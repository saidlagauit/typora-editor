"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FileNode } from "@/types";
import {
  ChevronRight,
  ChevronDown,
  File,
  Trash2,
  FilePlus,
  FolderPlus,
  FolderInput,
  Upload,
} from "lucide-react";
import clsx from "clsx";
import Modal from "./Modal";

interface FileTreeProps {
  onSelect: (path: string) => void;
  activePath?: string;
}

type ModalState = {
  isOpen: boolean;
  type: "create-file" | "create-folder" | "delete" | "move" | null;
  targetPath?: string;
  inputValue?: string;
};

export default function FileTree({ onSelect, activePath }: FileTreeProps) {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTree = useCallback(async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setTree(data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTree();
  }, [fetchTree]);

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const openCreateModal = (type: "create-file" | "create-folder") => {
    setModal({
      isOpen: true,
      type,
      inputValue: "",
    });
  };

  const openDeleteModal = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModal({
      isOpen: true,
      type: "delete",
      targetPath: path,
    });
  };

  const openMoveModal = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModal({
      isOpen: true,
      type: "move",
      targetPath: path,
      inputValue: path, // Pre-fill with current path
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null });
  };

  const handleModalSubmit = async () => {
    if (!modal.type) return;

    try {
      if (modal.type === "delete" && modal.targetPath) {
        await fetch(`/api/files?path=${encodeURIComponent(modal.targetPath)}`, {
          method: "DELETE",
        });
      } else if (
        modal.type === "move" &&
        modal.targetPath &&
        modal.inputValue
      ) {
        await fetch("/api/files", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPath: modal.targetPath,
            newPath: modal.inputValue,
          }),
        });
      } else if (modal.inputValue) {
        const type = modal.type === "create-file" ? "file" : "folder";
        // Simple creation at root for now
        const path = modal.inputValue;

        await fetch("/api/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, type }),
        });
      }

      closeModal();
      fetchTree();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Operation failed");
    }
  };

  const handleDragStart = (e: React.DragEvent, path: string) => {
    e.dataTransfer.setData("text/plain", path);
    setDraggedNode(path);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetPath: string,
    targetType: "file" | "folder",
  ) => {
    e.preventDefault();
    const sourcePath = e.dataTransfer.getData("text/plain");
    setDraggedNode(null);

    if (!sourcePath || sourcePath === targetPath) return;

    // If dropping on a file, we might want to move it to the same folder,
    // but typically you drop INTO a folder.
    // For simplicity, let's only allow dropping onto folders to move INSIDE them.
    // Or if dropping on root... wait, root isn't a node here.

    if (targetType !== "folder") return;

    // Prevent moving folder into itself
    if (targetPath.startsWith(sourcePath + "/")) return;

    try {
      const fileName = sourcePath.split("/").pop();
      const newPath = `${targetPath}/${fileName}`;

      await fetch("/api/files", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPath: sourcePath, newPath }),
      });

      fetchTree();
    } catch (error) {
      console.error("Drop failed:", error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const path = file.name; // Save to root by default

      try {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, content }),
        });
        fetchTree();
        // Clear input value to allow re-uploading same file
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Import failed:", error);
        alert("Import failed");
      }
    };
    reader.readAsText(file);
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expanded.has(node.path);
    const isActive = activePath === node.path;

    return (
      <div key={node.path}>
        <div
          className={clsx(
            "flex items-center py-1.5 px-3 cursor-pointer text-sm group transition-colors rounded-md mx-2",
            isActive
              ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
            draggedNode === node.path && "opacity-50",
          )}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          draggable
          onDragStart={(e) => handleDragStart(e, node.path)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, node.path, node.type)}
          onClick={() => {
            if (node.type === "folder") {
              toggleExpand(node.path);
            } else {
              onSelect(node.path);
            }
          }}
        >
          <span
            className={clsx(
              "mr-2 transition-colors",
              isActive
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500",
            )}
          >
            {node.type === "folder" ? (
              isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : (
              <File size={16} />
            )}
          </span>
          <span className="truncate flex-1">{node.name}</span>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => openMoveModal(node.path, e)}
              className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mr-1 transition-colors"
              title="Move/Rename"
            >
              <FolderInput size={14} />
            </button>
            <button
              onClick={(e) => openDeleteModal(node.path, e)}
              className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getModalTitle = () => {
    switch (modal.type) {
      case "create-file":
        return "New File";
      case "create-folder":
        return "New Folder";
      case "delete":
        return "Delete Item";
      case "move":
        return "Move / Rename Item";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="h-full flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 w-64 text-sm transition-colors select-none">
        <div className="p-4 flex items-center justify-between group">
          <span className="font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider pl-2">
            Files
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".md,.txt"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm hover:shadow"
              title="Import File"
            >
              <Upload size={14} />
            </button>
            <button
              onClick={() => openCreateModal("create-file")}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm hover:shadow"
              title="New File"
            >
              <FilePlus size={14} />
            </button>
            <button
              onClick={() => openCreateModal("create-folder")}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm hover:shadow"
              title="New Folder"
            >
              <FolderPlus size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {tree.map((node) => renderNode(node))}
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={getModalTitle()}
        onSubmit={handleModalSubmit}
        submitLabel={
          modal.type === "delete"
            ? "Delete"
            : modal.type === "move"
              ? "Move"
              : "Create"
        }
        isDestructive={modal.type === "delete"}
      >
        {modal.type === "delete" ? (
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-mono font-bold">{modal.targetPath}</span>?
            This action cannot be undone.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {modal.type === "move" ? "New Path" : "Name"}
            </label>
            <input
              type="text"
              value={modal.inputValue || ""}
              onChange={(e) =>
                setModal({ ...modal, inputValue: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                modal.type === "create-file"
                  ? "example.md"
                  : modal.type === "move"
                    ? "folder/newname.md"
                    : "folder-name"
              }
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleModalSubmit();
              }}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
