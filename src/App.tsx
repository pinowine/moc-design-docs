import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading/Loading';

// Lazy-loaded components
const Home = React.lazy(() => import('./pages/Home/Home'));
const DocumentTemplate = React.lazy(() => import('./pages/Document/Document'));
const About = React.lazy(() => import('./pages/About/About'));

interface DocumentData {
  title: string;
  file: string;
  children?: DocumentData[];
}

type ComponentType = React.ComponentType<{ file: string, title: string, path: string, fold: string, type: string}>;

const generateRoutes = (docs: DocumentData[], basePath = '', Component: ComponentType, fold = '', type = ''): JSX.Element[] => {
  
  let routes: JSX.Element[] = [];

  if (!docs || docs.length === 0) return routes;

  for (const doc of docs) {
    const currentPath = `${basePath}/${doc.title}`.replace(/\/+/g, '/');
    routes.push(
      <Route
        key={currentPath}
        path={currentPath}
        element={<Component file={doc.file} title={doc.title} path={doc.title} fold={fold} type={type} />}
      />
    );
    if (doc.children) {
      routes = routes.concat(generateRoutes(doc.children, currentPath, Component, fold, type));
    }
  }
  return routes;
};

const App: React.FC = () => {
  const [documentStructure, setDocumentStructure] = useState<DocumentData[] | null>(null);
  const [tutorialStructure, setTutorialStructure] = useState<DocumentData[] | null>(null);
  const [projectStructure, setProjectStructure] = useState<DocumentData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // UseEffect to fetch the data for each structure
  useEffect(() => {
    const fetchData = async () => {
      try {
        const basePath = import.meta.env.BASE_URL || ''; // Get base path from environment
        const docRes = await fetch(`${basePath}data/documentStructure.json`);
        const tutorialRes = await fetch(`${basePath}data/tutorialStructure.json`);
        const projectRes = await fetch(`${basePath}data/projectStructure.json`);

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
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  // Return null or loading spinner until data is loaded
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router basename={import.meta.env.BASE_URL || ''}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {generateRoutes(tutorialStructure ?? [], '/tutorials', DocumentTemplate, 'tutorials', 'tutorial')}
          {generateRoutes(documentStructure ?? [], '/documents', DocumentTemplate, 'documents', 'document')}
          {generateRoutes(projectStructure ?? [], '/projects', DocumentTemplate, 'projects', 'project')}
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
