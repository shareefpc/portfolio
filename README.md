# Shareef PC Portfolio

A responsive portfolio for Shareef PC, full-stack developer and product designer. The site uses plain HTML, CSS, and JavaScript. All assets are local, and the repository root is the site root.

## Preview locally

Open `index.html` in a browser. To preview over HTTP, run the following from this folder and open [the local preview](http://127.0.0.1:8000/).

```sh
python -m http.server 8000 --bind 127.0.0.1
```

## Edit the site

- Update the introduction, about section, and project cards in `index.html`.
- Edit case studies in `projects/`. Relay, Forma, and Signal are fictional examples with interactive browser demos and sample data. Their proposed production architectures are described on their case-study pages.
- Add a public email address and full HTTPS profile URLs in `assets/contact.js`. LinkedIn, Instagram, and Email appear under Connect in the desktop sidebar and the mobile More menu. Configured links also appear in the contact section, which supports GitHub.
- Replace the portrait and avatar in `assets/` when needed. The hero illustration was generated for this portfolio, and the project images are original interface mockups.
- The Stack icons are local SVG files from [Devicon v2.17.0](https://github.com/devicons/devicon/tree/v2.17.0). Their [license](assets/stack/LICENSE.txt) is included with the files.

## Upload to GitHub

Create an empty repository on GitHub. From this folder, run:

```sh
git init -b main
git add .
git commit -m "Add Shareef PC portfolio"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

To publish with GitHub Pages later, select `main` and `/ (root)` in the repository’s **Settings → Pages**. The site uses relative paths for repository URLs and requires no build or deployment workflow.

## Hero artwork

`assets/hero.webp` was generated with the built-in image generation tool and resized for the web.

> Use case: stylized-concept. Create spectacular premium wide 16:9 hero art for the personal portfolio of a full-stack developer and product designer. Abstract editorial 3D cover artwork, evoking the layers of a product from interface through data. A single stack of three large translucent dark cobalt glass slabs with softly rounded square corners, suspended diagonally, close to camera, vivid ultramarine and a fine electric chartreuse light trace through one edge. Visible layered interiors and subtle etched circuitry, no recognizable devices, no UI screenshots, no typography. The stack occupies the right 60 percent with strong lateral perspective; the left third is low-key midnight navy negative space for overlay. Black blue backdrop with minimal micro-grain, point lighting, photographic material rendering, clean cinematic composition, no borders, no text, no humans.
