// Runs inside YouTube embed iframes (youtube.com/embed/*).
// Applies pitch shift to the video element via native browser APIs.

(function () {
  chrome.storage.local.get(['semitones'], ({ semitones }) => {
    const shift = typeof semitones === 'number' ? semitones : 0;

    if (shift === 0) {
      window.parent.postMessage({ type: 'worshipPitchApplied', semitones: 0 }, '*');
      return;
    }

    waitForVideo((videoEl) => {
      applyPitch(videoEl, shift);
    });
  });

  function waitForVideo(cb) {
    const v = document.querySelector('video');
    if (v) { cb(v); return; }

    let attempts = 0;
    const interval = setInterval(() => {
      const v = document.querySelector('video');
      if (v) {
        clearInterval(interval);
        cb(v);
      } else if (++attempts >= 60) {
        clearInterval(interval);
        // Still confirm so the badge doesn't stay stuck
        window.parent.postMessage({ type: 'worshipPitchApplied', semitones: 0 }, '*');
      }
    }, 100);
  }

  function applyPitch(videoEl, semitones) {
    const pitchFactor = Math.pow(2, semitones / 12);

    // Primary: use native preservesPitch=false + playbackRate.
    // This shifts both pitch and speed together, but is reliable and has no CSP issues.
    // (Speed change: +2 st ≈ ×1.12 — noticeable but acceptable for practice.)
    videoEl.preservesPitch = false;
    videoEl.mozPreservesPitch = false;
    videoEl.webkitPreservesPitch = false;
    videoEl.playbackRate = pitchFactor;

    // Enhancement: try Web Audio MediaElementSource for higher-quality pitch-only shift.
    // Falls back silently to the playbackRate approach above if this fails.
    tryWebAudioPitchShift(videoEl, semitones, pitchFactor);

    window.parent.postMessage({ type: 'worshipPitchApplied', semitones }, '*');
  }

  function tryWebAudioPitchShift(videoEl, semitones, pitchFactor) {
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(videoEl);

      // ScriptProcessorNode-based pitch shifter (no AudioWorklet, no CSP issues).
      // Uses simple OLA (overlap-add) resampling — decent quality for voice/instruments.
      const shifter = buildOLAShifter(audioCtx, pitchFactor);
      source.connect(shifter);
      shifter.connect(audioCtx.destination);

      // Web Audio requires user gesture to start on some browsers
      if (audioCtx.state === 'suspended') {
        document.addEventListener('click', () => audioCtx.resume(), { once: true });
      }

      // Success — undo the playbackRate change (speed now preserved)
      videoEl.preservesPitch = true;
      videoEl.playbackRate = 1;
    } catch (e) {
      // Keep the playbackRate fallback active — do nothing here
    }
  }

  function buildOLAShifter(audioCtx, pitchFactor) {
    const GRAIN = 1024;
    const STEP = Math.round(GRAIN / 4);
    const processor = audioCtx.createScriptProcessor(GRAIN, 1, 1);

    // Hann window for smooth grain blending
    const hann = new Float32Array(GRAIN);
    for (let i = 0; i < GRAIN; i++) {
      hann[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / GRAIN));
    }

    // Circular read buffer so we always have enough look-ahead samples
    const buf = new Float32Array(GRAIN * 4);
    let writePos = 0;
    let readPhase = 0; // fractional read position (advances at pitchFactor rate)

    processor.onaudioprocess = (e) => {
      const inp = e.inputBuffer.getChannelData(0);
      const out = e.outputBuffer.getChannelData(0);
      const bufLen = buf.length;

      // Write new input samples into ring buffer
      for (let i = 0; i < GRAIN; i++) {
        buf[(writePos + i) % bufLen] = inp[i];
      }
      writePos = (writePos + GRAIN) % bufLen;

      // Read at shifted rate using linear interpolation
      for (let i = 0; i < GRAIN; i++) {
        const pos = readPhase % bufLen;
        const i0 = Math.floor(pos) % bufLen;
        const i1 = (i0 + 1) % bufLen;
        const frac = pos - Math.floor(pos);
        out[i] = (buf[i0] * (1 - frac) + buf[i1] * frac) * hann[i];
        readPhase = (readPhase + pitchFactor) % bufLen;
      }
    };

    return processor;
  }
})();
