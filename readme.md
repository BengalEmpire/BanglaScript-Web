# BanglaScript Docs

The official documentation website for **BanglaScript** - a programming language that compiles Bengali syntax to JavaScript.

## Overview

**BanglaScript** empowers developers to write code in their native Bengali language. It bridges the gap between Bengali speakers and modern programming by allowing users to write logic using Bengali keywords, which are then transpiled into pure, executable JavaScript.

This repository (`BanglaScript-Web`) contains the source code for the documentation website, built with modern web technologies to provide a seamless learning experience.

## Features

- **Interactive Playground**: Try BanglaScript directly in your browser.
- **Comprehensive Documentation**: Detailed guides on syntax, functions, and usage.
- **Modern UI/UX**: Built with Next.js 15, Tailwind CSS, and Radix UI for a premium look and feel.
- **Dark Mode Support**: Fully responsive design with light and dark themes.
- **Fast Performance**: Optimized for speed and accessibility.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Transpilation**: Custom BanglaScript transpiler logic (integrated or documented).

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v18 or higher)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahmud-r-farhan/BanglaScript-Web.git
   cd BanglaScript-Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
BanglaScript-Web/
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable UI components
├── data/               # Static data for docs
├── lib/                # Utility functions
├── public/             # Static assets (images, icons)
├── styles/             # Global styles
├── next.config.mjs     # Next.js configuration
└── package.json        # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the documentation or add new features to the site:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## 🔗 Related Projects

- **[BanglaScript Core](https://github.com/BengalEmpire/BanglaScript)**: The core transpiler and CLI tool.


---

*Made with ❤️ for the Bengali programming community.*