"use client";

import { useState } from "react";
import FileTree from "@/components/FileTree";
import Editor from "@/components/Editor";
import {
  FolderOpen,
  Layout,
  Moon,
  PenTool,
  Download,
  FileText,
} from "lucide-react";

export default function Home() {
  const [activeFile, setActiveFile] = useState<string | undefined>();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="print:hidden h-full border-r border-gray-200 dark:border-gray-800">
        <FileTree onSelect={setActiveFile} activePath={activeFile} />
      </div>
      <main className="flex-1 h-full overflow-hidden">
        {activeFile ? (
          <Editor path={activeFile} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="max-w-2xl space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Typora Editor
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  A modern, distraction-free Markdown writing experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <FolderOpen size={20} />
                  </div>
                  <h3 className="font-semibold mb-1">File Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Organize your files with drag & drop support and a powerful
                    file explorer.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <Layout size={20} />
                  </div>
                  <h3 className="font-semibold mb-1">Split View</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Write with immediate visual feedback using our real-time
                    split view editor.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <Moon size={20} />
                  </div>
                  <h3 className="font-semibold mb-1">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Easy on the eyes with a carefully crafted dark theme for
                    night-time writing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <PenTool size={20} />
                  </div>
                  <h3 className="font-semibold mb-1">Auto Save</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Never lose your work. Changes are saved automatically as you
                    type.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <Download size={20} />
                  </div>
                  <h3 className="font-semibold mb-1">PDF Export</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Export your documents to professional PDF format with a
                    single click.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100 mb-3 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-semibold mb-1">Markdown Support</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full support for standard Markdown syntax, including tables
                    and code blocks.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-sm text-zinc-400 dark:text-zinc-500">
                Select a file from the sidebar to start editing
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
