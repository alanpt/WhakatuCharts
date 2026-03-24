var fs = require('fs');
var path = require('path');

var tracksDir = path.join(__dirname, 'tracks');
var outFile = path.join(__dirname, 'tracks.json');

function encodePath(filename) {
  // encode each character that isn't safe in a URL path
  return filename.split('').map(function(c) {
    return encodeURIComponent(c)
      .replace(/'/g, '%27')
      // keep these characters unencoded — they're safe in paths
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
    console.log('Created tracks/ folder. Add .mp3 and matching image files, then run again.');
    return;
  }

  var files = fs.readdirSync(tracksDir);
  var mp3s = files.filter(function(f) { return f.toLowerCase().slice(-4) === '.mp3'; });

  if (!mp3s.length) {
    console.log('No .mp3 files found in tracks/');
    fs.writeFileSync(outFile, '[]');
    return;
  }

  var tracks = mp3s.map(function(mp3) {
    var base = mp3.slice(0, -4);
    var imgExt = ['jpg', 'jpeg', 'png', 'webp'].filter(function(ext) {
      return files.indexOf(base + '.' + ext) !== -1;
    })[0];

    return {
      audio: 'tracks/' + encodePath(mp3),
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
