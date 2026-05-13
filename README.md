# Multi-Column Markdown Reader

A feature-rich multi-column Markdown reader with customizable typography and responsive reading experience.

## Features

- **Multi-column layout** - Adjustable columns (1-5) with customizable gap
- **Typography controls** - Font family (sans/serif/mono), size, line height, alignment
- **Mermaid diagram support** - Render flowcharts, sequence diagrams, etc. with zoom/pan
- **Table expansion** - Expandable tables for better readability
- **Dark/Light mode** - Toggle between themes
- **File import** - Load local `.md` or `.txt` files
- **Code syntax highlighting** - Prism-based syntax highlighting for code blocks
- **Responsive design** - Clean, modern UI with Tailwind CSS

## Screenshots

![Light Mode](./screenshots/light.png)
![Dark Mode](./screenshots/dark.png)

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/multi-column-md-reader.git
cd multi-column-md-reader

# Install dependencies
npm install

# Run the app
npm run dev
```

Open http://localhost:3000 in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 4
- Mermaid 11
- react-markdown
- Lucide icons

## License

MIT