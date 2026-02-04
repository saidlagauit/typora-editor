# Typora-like Editor

A modern, file-based Markdown editor built with Next.js and Tailwind CSS. It features a clean, distraction-free interface inspired by Typora, with support for split-view editing, live preview, and dark mode.

## Features

### 📝 Markdown Editing

- **Split View**: Edit Markdown on the left and see a live preview on the right.
- **Edit & Preview Modes**: Switch between full edit mode, full preview mode, or split view.
- **Autosave**: Changes are automatically saved to the local file system as you type.
- **Syntax Highlighting**: Rich Markdown rendering using `react-markdown` and `@tailwindcss/typography`.

### 📂 File Management

- **File Explorer**: Browse files and folders in a collapsible sidebar tree view.
- **File Operations**:
  - Create new files and folders.
  - Delete files and folders.
  - Move files (Drag & Drop support).
- **Custom Modals**: Clean, accessible modal dialogs for all file operations (no native browser alerts).

### 🎨 User Interface

- **Monochrome Design**: A strict 3-color minimalist palette (Black, White, Gray) for a distraction-free writing environment.
- **Dark & Light Mode**: Seamlessly switch between dark and light themes with consistent monochrome styling.
- **RTL Support**: Automatic text direction detection for languages like Arabic.
- **Responsive**: Adapts to different screen sizes.

### 📤 Export & Download

- **PDF Export**: Export your documents to professional PDF format.
- **Markdown Download**: Download the raw `.md` file locally.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Markdown Rendering**: `react-markdown`
- **Icons**: `lucide-react`
- **State Management**: React Hooks & Context API

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/saidlagauit/typora-editor.git
   cd typora-editor
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open the editor**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `content/`: **(Important)** This directory stores all the markdown files created and edited in the application.
- `src/components/`:
  - `Editor.tsx`: Main editing component with split-view logic.
  - `FileTree.tsx`: Sidebar component for file navigation.
  - `Modal.tsx`: Reusable modal component for UI interactions.
  - `ThemeProvider.tsx`: Context provider for Dark/Light mode.
- `src/lib/fs.ts`: Server-side file system utilities.
- `src/app/api/`: API routes for file CRUD operations.

## License

MIT
