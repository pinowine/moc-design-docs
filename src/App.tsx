import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Tutorials from './pages/Tutorials/Tutorials';
import Documents from './pages/Document/Document';
import Projects from './pages/Projects/Projects';
import About from './pages/About/About';
import NotFound from './pages/NotFound/NotFound';

interface DocumentData {
  title: string;
  file: string;
  children?: DocumentData[];
}

type ComponentType = React.ComponentType<{ file: string, title: string, path: string, fold: string}>;

const generateRoutes = (docs: DocumentData[], basePath = '', Component: ComponentType, fold = ''): JSX.Element[] => {
  let routes: JSX.Element[] = [];
  for (const doc of docs) {
    const currentPath = `${basePath}/${doc.title}`.replace(/\/+/g, '/');
    routes.push(
      <Route
        key={currentPath}
        path={currentPath}
        element={<Component file={doc.file} title={doc.title} path={doc.title} fold={fold}/>}
      />
    );
    if (doc.children) {
      routes = routes.concat(generateRoutes(doc.children, currentPath, Component, fold));
    }
  }
  return routes;
};

const App: React.FC = () => {
  const [documentStructure, setDocumentStructure] = useState<DocumentData[] | null>(null);
  const [tutorialStructure, setTutorialStructure] = useState<DocumentData[] | null>(null);
  const [projectStructure, setProjectStructure] = useState<DocumentData[] | null>(null);

  // UseEffect to fetch the data for each structure
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRes = await fetch('/data/documentStructure.json');
        const tutorialRes = await fetch('/data/tutorialStructure.json');
        const projectRes = await fetch('/data/projectStructure.json');

        if (docRes.ok && tutorialRes.ok && projectRes.ok) {
          const docData = await docRes.json();
          const tutorialData = await tutorialRes.json();
          const projectData = await projectRes.json();

          setDocumentStructure(docData);
          setTutorialStructure(tutorialData);
          setProjectStructure(projectData);
        } else {
          console.error('Failed to fetch one or more structures.');
        }
      } catch (error) {
        console.error('Error fetching structures:', error);
      }
    };

    fetchData();
  }, []);

  // Return null or loading spinner until data is loaded
  if (!documentStructure || !tutorialStructure || !projectStructure) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {generateRoutes(tutorialStructure, '/tutorials', Tutorials, 'tutorials')}
        {generateRoutes(documentStructure, '/documents', Documents, 'documents')}
        {generateRoutes(projectStructure, '/projects', Projects, 'projects')}
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
