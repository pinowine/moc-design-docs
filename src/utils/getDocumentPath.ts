// src/utils/getDocumentPath.ts

interface DocumentNode {
  title: string;
  file: string;
  children?: DocumentNode[];
}

// 递归查找文件路径
const findPath = (nodes: DocumentNode[], fileName: string, parentPath: string[] = []): string[] | null => {
  for (const node of nodes) {
    const currentPath = [...parentPath, node.title];
    
    if (node.file === fileName) {
      return currentPath; // 找到文件，返回路径
    }
    
    if (node.children) {
      const result = findPath(node.children, fileName, currentPath);
      if (result) {
        return result; // 在子节点中找到了，返回路径
      }
    }
  }
  return null; // 没有找到，返回 null
};

// 异步加载 JSON 文件的辅助函数
const fetchJSON = async (filePath: string): Promise<DocumentNode[]> => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}`);
  }
  return await response.json();
};

// 根据文件路径确定 JSON 文件，并在对应的 JSON 中查找路径
export const getDocumentPath = async (fileName: string, folder: string): Promise<{ path: string[], prefix: string } | null> => {
  let structure;
  let prefix;

  // 动态加载对应的 JSON 文件
  try {
    const basePath = import.meta.env.BASE_URL || ''; // Get base path from environment
    switch (folder) {
      case 'documents':
        structure = await fetchJSON(`${basePath}data/documentStructure.json`);
        prefix = 'documents';
        break;
      case 'projects':
        structure = await fetchJSON(`${basePath}data/projectStructure.json`);
        prefix = 'projects';
        break;
      case 'tutorials':
        structure = await fetchJSON(`${basePath}data/tutorialStructure.json`);
        prefix = 'tutorials';
        break;
      default:
        return null; // 如果文件夹名不符合任何预设，返回 null
    }

    // 在对应的 JSON 结构中查找文件路径
    const path = findPath(structure, fileName);
  
    if (path) {
      return { path, prefix }; // 返回路径和对应的前缀
    }

    // console.log(`Searching for ${fileName} in ${folder}:`, path);
    return null; // 未找到路径

  } catch (error) {
    // console.error('Error fetching structure:', error);
    return null;
  }
};
