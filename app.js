const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getSemitones(originalKey, targetKey) {
  const from = KEYS.indexOf(originalKey);
  const to = KEYS.indexOf(targetKey);
  if (from === -1 || to === -1) return 0;
  return ((to - from + 6) % 12) - 6;
}

function loadSongs() {
  try {
    return JSON.parse(localStorage.getItem('worship_songs')) || [];
  } catch {
    return [];
  }
}

function saveSongs(songs) {
  localStorage.setItem('worship_songs', JSON.stringify(songs));
}

function extractVideoId(url) {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
