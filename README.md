# camwham

Cameron's art website — [camwham.com](https://camwham.com).

Built with [Astro](https://astro.build), deployed automatically to GitHub
Pages on every push to `main`.

## Adding a new piece of art

Two files per artwork. That's it.

1. **Drop the image** into `src/assets/artwork/`
   - e.g. `src/assets/artwork/happy-gadget.jpg`
   - JPG, PNG, WebP, or SVG all work
2. **Create a markdown file** at `src/content/artwork/<same-name>.md`:

   ```md
   ---
   title: Happy Gadget
   image: ../../assets/artwork/happy-gadget.jpg
   date: 2026-05-25
   ---

   A short note about the drawing. This part is optional.
   ```

3. Commit and push. GitHub Actions builds and deploys within ~1 minute.

```sh
git add .
git commit -m "add happy gadget"
git push
```

## Running it on your computer

```sh
npm install
npm run dev      # opens http://localhost:4321
```

| Command            | What it does                                 |
| :----------------- | :------------------------------------------- |
| `npm run dev`      | Local preview at `localhost:4321`            |
| `npm run build`    | Build the static site to `./dist/`           |
| `npm run preview`  | Preview the built site locally               |

## Project layout

```
camwham/
├── .github/workflows/deploy.yml   # builds + deploys to GitHub Pages
├── public/
│   └── CNAME                      # camwham.com
├── src/
│   ├── assets/artwork/            # the image files
│   ├── content/artwork/           # one markdown file per piece
│   ├── content.config.ts          # artwork schema
│   ├── layouts/Base.astro
│   ├── pages/
│   │   ├── index.astro            # gallery
│   │   └── art/[slug].astro       # one page per piece
│   └── styles/global.css
└── astro.config.mjs
```

## How the deploy works

`.github/workflows/deploy.yml` uses the official `withastro/action` to build
on every push to `main`, then `actions/deploy-pages` publishes `dist/` to
GitHub Pages. The `public/CNAME` file tells Pages to serve at
`camwham.com`.

DNS for the apex domain points to GitHub's four IPs:
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
