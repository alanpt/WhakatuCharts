# Whakatu Listening Station

## First-time setup

### 1. Install Node.js
Download from https://nodejs.org (LTS version). Just needed locally to run the build script.

### 2. Create the GitHub repo
- Go to github.com → New repository
- Name it anything, e.g. `whakatu`
- Set to Public
- Do NOT tick "Add README"

### 3. Upload your files
Either use GitHub Desktop (easier) or the git command line.

**Using GitHub Desktop:**
1. Download GitHub Desktop from desktop.github.com
2. Clone your new repo to your computer
3. Copy all files from this zip into that folder
4. Add your logo.png
5. Add your tracks (see below)
6. Commit and push

**Using command line:**
```bash
git clone https://github.com/YOURUSERNAME/whakatu.git
cd whakatu
# copy files in, then:
git add .
git commit -m "initial"
git push
```

### 4. Enable GitHub Pages
- Go to your repo on github.com
- Settings → Pages
- Source: Deploy from branch
- Branch: main, folder: / (root)
- Save

Your site will be live at: `https://YOURUSERNAME.github.io/REPONAME`

---

## Adding tracks

1. Drop `song-name.mp3` and `song-name.jpg` into the `tracks/` folder
2. Open a terminal in the project folder and run:
   ```
   node build-manifest.js
   ```
3. This updates `tracks.json`
4. Commit and push everything (the mp3, image, and updated tracks.json)

Track titles are generated from filenames — hyphens and underscores become spaces, words are capitalised. So `the-rolling-stones_jumpin-jack-flash.mp3` becomes "The Rolling Stones Jumpin Jack Flash".

## Logo

Replace `logo.png` with your own. Square PNG works best, minimum 192×192px.

## PWA install

**iOS:** Open in Safari → Share button → Add to Home Screen  
**Android:** Open in Chrome → three-dot menu → Add to Home Screen / Install app

## Note on audio autoplay

Browsers block autoplay until the user interacts with the page. The first track loads ready to play — it starts automatically when the user taps Next or Previous for the first time, and auto-advances after that.
