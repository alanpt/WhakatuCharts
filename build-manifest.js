const fs = require('fs');
const path = require('path');

const tracksDir = path.join(__dirname, 'tracks');
const outFile = path.join(__dirname, 'tracks.json');

function buildManifest() {
  if (!fs.existsSync(tracksDir)) {
    fs.mkdirSync(tracksDir, { recursive: true });
    console.log('Created tracks/ folder. Add .mp3 and matching image files, then run this script again.');
    return;
  }

  const files = fs.readdirSync(tracksDir);
  const mp3s = files.filter(f => f.toLowerCase().endsWith('.mp3'));

  if (!mp3s.length) {
    console.log('No .mp3 files found in tracks/');
    fs.writeFileSync(outFile, '[]');
    return;
  }

  const tracks = mp3s
    .map(mp3 => {
      const base = mp3.replace(/\.mp3$/i, '');
      const imgExt = ['jpg', 'jpeg', 'png', 'webp'].find(ext =>
        files.includes(`${base}.${ext}`)
      );
      return {
        audio: `tracks/${mp3}`,
        image: imgExt ? `tracks/${base}.${imgExt}` : null,
        title: base.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  fs.writeFileSync(outFile, JSON.stringify(tracks, null, 2));
  console.log(`Done. ${tracks.length} track(s) written to tracks.json`);
  tracks.forEach(t => console.log(' -', t.title));
}

buildManifest();
