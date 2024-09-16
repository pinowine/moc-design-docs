interface MarkdownFile {
    title: string;
    file: string;
    children?: MarkdownFile[]; // 可选的子节点
}

interface MarkdownResult {
    fileName: string;
    content: string;
    type: string;
}

// 递归函数：处理每个节点并加载对应的文件内容
const fetchMarkdownFiles = async (items: MarkdownFile[], basePath: string, type: string): Promise<MarkdownResult[]> => {
  let files: MarkdownResult[] = [];

  for (const item of items) {
    const baseRepo = import.meta.env.BASE_URL || ''; // Get base path from environment
    const filePath = `${baseRepo}documents/${basePath}/${item.file}.md`; // 构建 Markdown 文件路径

    // 使用 fetch 获取 Markdown 文件内容
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}`);
      }
      const content = await response.text();
      files.push({
        fileName: item.file,
        content,
        type, // 记录是属于 document, project, 还是 tutorial
      });
    } catch (error) {
      console.error(`Error fetching ${filePath}:`, error);
    }

    // 如果有子节点，递归调用 fetchMarkdownFiles
    if (item.children && item.children.length > 0) {
      const childFiles = await fetchMarkdownFiles(item.children, basePath, type);
      files = files.concat(childFiles); // 合并子节点的文件结果
    }
  }

  return files;
};

// 动态加载 JSON 文件的辅助函数
const fetchJSON = async (filePath: string) => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}`);
  }
  return await response.json();
};

export const getMarkdownFiles = async () => {
  // 定义基础路径，根据类型映射到不同的文件夹
  const basePaths = {
    documents: 'documents',   // 对应 documentStructure 文件的数据
    projects: 'projects',     // 对应 projectStructure 文件的数据
    tutorials: 'tutorials',   // 对应 tutorialStructure 文件的数据
  };

  const basePath = import.meta.env.BASE_URL || ''; // Get base path from environment

  // 动态加载 JSON 数据
  const [documentStructure, projectStructure, tutorialStructure] = await Promise.all([
    fetchJSON(`${basePath}data/documentStructure.json`),
    fetchJSON(`${basePath}data/projectStructure.json`),
    fetchJSON(`${basePath}data/tutorialStructure.json`),
  ]);

  // 合并三个结构
  const structureMap = {
    documents: documentStructure,
    projects: projectStructure,
    tutorials: tutorialStructure,
  };

  // 存储最终返回的文件内容
  let files: { fileName: string; content: string; type: string }[] = [];

  // 遍历 document, project, tutorial 结构，获取对应的文件内容
  for (const type of ['documents', 'projects', 'tutorials'] as const) {
    const structure = structureMap[type]; // 获取对应的 JSON 结构
    const basePath = basePaths[type];     // 获取对应的文件夹路径

    // 递归获取文件内容
    const fetchedFiles = await fetchMarkdownFiles(structure, basePath, type);
    files = files.concat(fetchedFiles); // 合并每个类型的文件结果
  }

  return files;
};
