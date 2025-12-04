Photo MDX Uploader

This is a small local helper to generate MDX files in `src/content/photo/` from a simple form.

- How it works

- Launch the server: `node server.cjs` (from `scripts/photo-uploader` folder)

	Note: if your project `package.json` sets `"type": "module"`, Node treats `.js` files as ESM and the original `server.js` (CommonJS `require`) will fail. Use `server.cjs` in that case. If you prefer ESM, I can provide an ESM-converted server as well.
- Open `http://localhost:3001/` in your browser.
- Fill in title, description, hero image URL, and a list of image URLs (one per line).
- Click `生成并写入 MDX` — the server will write a new `.mdx` file into `src/content/photo/`.

Notes & Safety

- This script is intended as a local helper while developing. Do NOT expose it publicly.
- No external dependencies are required (uses built-in `http` and `fs`).
- The script avoids overwriting existing files by appending `-1`, `-2`, etc. if a filename already exists.

Customization

- The MDX template generation is implemented in `server.js` (function `mdxTemplate`). You can adapt the markup or frontmatter fields as needed.

If you want, I can:
- Add a small npm script to `package.json` to start the uploader (e.g. `npm run upload`),
- Improve the front-end UI styling or add drag-and-drop support,
- Add validation for image URLs or auto-download images to local `public` folder.
