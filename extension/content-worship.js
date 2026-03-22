// Runs on the worship practice page (index.html).
// Bridges chrome.storage between the page JS (which can't access it)
// and the YouTube iframe content script (which can).

window.addEventListener('message', (event) => {
  if (!event.data) return;

  // Page is requesting a semitone value be stored before loading the iframe
  if (event.data.type === 'worshipSetSemitones') {
    chrome.storage.local.set({ semitones: event.data.semitones }, () => {
      window.postMessage({ type: 'worshipSemitonesReady' }, '*');
    });
  }

  // YouTube iframe confirming pitch was applied — relay back to page
  if (event.data.type === 'worshipPitchApplied') {
    window.postMessage(event.data, '*');
  }
});
