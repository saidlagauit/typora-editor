"use client";

import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { Download, FileDown } from "lucide-react";

interface EditorProps {
  path?: string;
}

export default function Editor({ path }: EditorProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-detect text direction
  const getDirection = (text: string) => {
    const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(text) ? "rtl" : "ltr";
  };

  const direction = getDirection(content);

  useEffect(() => {
    if (!path) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/content?path=${encodeURIComponent(path)}`,
        );
        const data = await res.json();
        setContent(data.content || "");
      } catch (error) {
        console.error("Failed to load content", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [path]);

  const handleChange = (val: string) => {
    setContent(val);
    setSaving(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (!path) return;
      try {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, content: val }),
        });
        setSaving(false);
      } catch (error) {
        console.error("Failed to save", error);
      }
    }, 2000); // 2s autosave
  };

  const handleExportPDF = () => {
    // Switch to preview mode before printing
    setMode("preview");
    // Allow time for render
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = path?.split("/").pop() || "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!path) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a file to edit
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-950">
      {/* Toolbar - Minimalist */}
      <div className="h-14 flex items-center px-6 justify-between bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors group">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-[300px] select-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          {path}
        </div>
        <div className="flex items-center gap-4 opacity-75 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-16 text-right select-none animate-pulse">
            {saving ? "Saving..." : ""}
          </span>

          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-4">
            <button
              onClick={handleDownloadMD}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all"
              title="Download Markdown"
            >
              <FileDown size={18} strokeWidth={1.5} />
            </button>

            <button
              onClick={handleExportPDF}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all"
              title="Export PDF"
            >
              <Download size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
            {(["edit", "split", "preview"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  "px-3 py-1.5 text-xs rounded-md capitalize transition-all font-medium",
                  mode === m
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        {(mode === "edit" || mode === "split") && (
          <div
            className={clsx(
              "h-full overflow-y-auto px-8 py-6 bg-white dark:bg-gray-950 print:hidden transition-colors scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800",
              mode === "split"
                ? "w-1/2 border-r border-dashed border-gray-200 dark:border-gray-800"
                : "w-full max-w-4xl mx-auto",
            )}
          >
            <TextareaAutosize
              value={content}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-full resize-none outline-none text-gray-800 dark:text-gray-200 bg-transparent font-mono text-lg leading-relaxed placeholder-gray-300 dark:placeholder-gray-700"
              placeholder="Start writing..."
              minRows={20}
              dir={direction}
            />
          </div>
        )}

        {(mode === "preview" || mode === "split") && (
          <div
            className={clsx(
              "h-full overflow-y-auto px-8 py-6 prose prose-lg prose-gray dark:prose-invert max-w-none print:w-full print:absolute print:top-0 print:left-0 print:h-auto print:overflow-visible transition-colors scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800",
              mode === "split"
                ? "w-1/2 bg-gray-50/50 dark:bg-gray-900/50"
                : "w-full max-w-4xl mx-auto bg-white dark:bg-gray-950",
            )}
            dir={direction}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
