import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type FileNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
};

// Ensure the path is within CONTENT_DIR
const safePath = (relativePath: string) => {
  const resolvedPath = path.resolve(CONTENT_DIR, relativePath);
  if (!resolvedPath.startsWith(CONTENT_DIR)) {
    throw new Error("Access denied");
  }
  return resolvedPath;
};

export const getFileTree = (dir: string = ""): FileNode[] => {
  const absoluteDir = safePath(dir);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const items = fs.readdirSync(absoluteDir, { withFileTypes: true });

  return items.map((item) => {
    const relativePath = path.join(dir, item.name);
    const node: FileNode = {
      name: item.name,
      path: relativePath.replace(/\\/g, "/"),
      type: item.isDirectory() ? "folder" : "file",
    };

    if (item.isDirectory()) {
      node.children = getFileTree(relativePath);
    }

    return node;
  });
};

export const readFile = (relativePath: string) => {
  const absolutePath = safePath(relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error("File not found");
  }
  return fs.readFileSync(absolutePath, "utf-8");
};

export const writeFile = (relativePath: string, content: string) => {
  const absolutePath = safePath(relativePath);
  fs.writeFileSync(absolutePath, content, "utf-8");
};

export const createItem = (relativePath: string, type: "file" | "folder") => {
  const absolutePath = safePath(relativePath);
  if (fs.existsSync(absolutePath)) {
    throw new Error("Item already exists");
  }

  if (type === "folder") {
    fs.mkdirSync(absolutePath, { recursive: true });
  } else {
    fs.writeFileSync(absolutePath, "", "utf-8");
  }
};

export const deleteItem = (relativePath: string) => {
  const absolutePath = safePath(relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error("Item not found");
  }
  fs.rmSync(absolutePath, { recursive: true, force: true });
};

export const renameItem = (oldPath: string, newPath: string) => {
  const absoluteOldPath = safePath(oldPath);
  const absoluteNewPath = safePath(newPath);

  if (!fs.existsSync(absoluteOldPath)) {
    throw new Error("Item not found");
  }
  if (fs.existsSync(absoluteNewPath)) {
    throw new Error("Destination already exists");
  }

  const newDir = path.dirname(absoluteNewPath);
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }

  fs.renameSync(absoluteOldPath, absoluteNewPath);
};
