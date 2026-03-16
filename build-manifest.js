var fs = require('fs');
var path = require('path');
var tracksDir = path.join(__dirname, 'tracks');
var outFile = path.join(__dirname, 'tracks.json');

function encodePath(filename) {
  return filename.split('').map(function(c) {
    return encodeURIComponent(c)
      .replace(/'/g, '%27')
      .replace(/%2F/g, '/')
      .replace(/%5F/g, '_')
      .replace(/%2D/g, '-')
      .replace(/%2E/g, '.');
  }).join('');
}

function titleFromFilename(base) {
  return base
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function buildManifest() {
  if (!fs.existsSync(tracksDir)) {
    fs.mkdirSync(tracksDir, { recursive: true });
    console.log('Created tracks/ folder. Add audio and image files, then run again.');
    return;
  }

  var files = fs.readdirSync(tracksDir);
  var audioFiles = files.filter(function(f) {
    var lower = f.toLowerCase();
    return lower.slice(-4) === '.mp3' || lower.slice(-4) === '.m4a';
  });

  if (!audioFiles.length) {
    console.log('No .mp3 or .m4a files found in tracks/');
    fs.writeFileSync(outFile, '[]');
    return;
  }

  var tracks = audioFiles.map(function(audioFile) {
    var base = audioFile.slice(0, -4);
    var imgExt = ['jpg', 'jpeg', 'png', 'webp'].filter(function(ext) {
      return files.indexOf(base + '.' + ext) !== -1;
    })[0];
    return {
      audio: 'tracks/' + encodePath(audioFile),
      image: imgExt ? 'tracks/' + encodePath(base + '.' + imgExt) : null,
      title: titleFromFilename(base)
    };
  }).sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });

  fs.writeFileSync(outFile, JSON.stringify(tracks, null, 2));
  console.log('Done. ' + tracks.length + ' track(s) written to tracks.json');
  tracks.forEach(function(t) { console.log(' - ' + t.title); });
}

buildManifest();
