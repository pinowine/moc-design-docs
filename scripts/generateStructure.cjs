const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // 用来解析 YAML 头部

// 定义函数，生成文档结构树的平面数据
function generateFlatStructure(folderPath) {
  const files = fs.readdirSync(folderPath);
  const flatStructure = [];

  files.forEach(file => {
    const fullPath = path.join(folderPath, file);
    const fileNameWithoutExtension = path.parse(file).name; // 去掉文件扩展名

    if (fs.lstatSync(fullPath).isDirectory()) {
      // 如果是目录，递归处理子文件夹
      flatStructure.push(...generateFlatStructure(fullPath));
    } else if (file.endsWith('.md')) {
      // 读取文件内容并提取 YAML 头部
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      const parts = fileNameWithoutExtension.split('-');
      const level = parts.length - 1; // 根据文件名中 "-" 的数量决定层级
      const parent = parts.slice(0, -1).join('-'); // 父级文件名

      // 添加当前文件到平面结构中
      flatStructure.push({
        title: data.title || fileNameWithoutExtension,
        level: level,
        parent: parent || null,
        type: data.type || 'document',
        file: fileNameWithoutExtension,
        children: [],
      });
    }
  });

  return flatStructure;
}

// 递归构建层次结构
function buildTree(flatStructure) {
  const lookup = {};
  const tree = [];

  // 遍历平面结构，按文件名创建查找表
  flatStructure.forEach(item => {
    lookup[item.file] = { ...item };
  });

  // 再次遍历平面结构，将子元素插入父元素的 children 中
  flatStructure.forEach(item => {
    if (item.parent && lookup[item.parent]) {
      // 将当前项作为其父项的 children
      lookup[item.parent].children.push(lookup[item.file]);
    } else {
      // 如果没有父级，将当前项作为根级元素添加到 tree
      tree.push(lookup[item.file]);
    }
  });

  return tree;
}

// 生成并保存 JSON 文件
function generateAndSaveStructure(folderPath, outputFileName) {
  const flatStructure = generateFlatStructure(folderPath); // 生成平面结构
  const treeStructure = buildTree(flatStructure); // 生成层次结构
  const outputPath = path.join(process.cwd(), `public/data/${outputFileName}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(treeStructure, null, 2));
  console.log(`${outputFileName}.json generated successfully at ${outputPath}`);
}

// 根目录设置
const documentsPath = path.join(process.cwd(), 'public/documents/documents');
const projectsPath = path.join(process.cwd(), 'public/documents/projects');
const tutorialsPath = path.join(process.cwd(), 'public/documents/tutorials');

// 生成并保存独立的 JSON 文件
generateAndSaveStructure(documentsPath, 'documentStructure');
generateAndSaveStructure(projectsPath, 'projectStructure');
generateAndSaveStructure(tutorialsPath, 'tutorialStructure');
