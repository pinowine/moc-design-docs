import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading/Loading';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Lazy-loaded components
const Home = React.lazy(() => import('./pages/Home/Home'));
const DocumentTemplate = React.lazy(() => import('./pages/Document/Document'));
const About = React.lazy(() => import('./pages/About/About'));
const Tool = React.lazy(() => import('./pages/Tool/Tool'))

interface DocumentData {
  title: string;
  code: string;
  desc: string;
  writer: string;
  first_date: string;
  last_date: string;
  children?: DocumentData[];
  setBreadcrumbData: (data: { path: string[]; title: string }) => void;
}

type ComponentType = React.ComponentType<{ 
  file: string, 
  title: string, 
  path: string, 
  fold: string, 
  type: string, 
  desc: string;
  writer: string,
  firstDate: string,
  lastDate: string,
  setBreadcrumbData: (data: { path: string[]; title: string }) => void,
  isTocOpen: boolean,
  toggleMobile: () => void
}>;

type NavbarType = React.ComponentType<{
  isTocOpen: boolean,
  breadcrumbData: { path: string[]; title: string },
  toggleMobile: () => void,
  isDocumentPage: boolean,
  isDarkMode: boolean,
  toggleDarkMode: () => void
}>;

const generateRoutes = (
  docs: DocumentData[], 
  basePath = '', 
  Component: ComponentType, 
  fold = '', 
  type = '',
  setBreadcrumbData: (data: { path: string[]; title: string }) => void,
  isTocOpen: boolean,
  toggleMobile: () => void,
  Navbar: NavbarType,
  isDocumentPage: boolean,
  breadcrumbData: { path: string[]; title: string },
  isDarkMode: boolean,
  toggleDarkMode: () => void
): JSX.Element[] => {
  
  let routes: JSX.Element[] = [];

  if (!docs || docs.length === 0) return routes;

  for (const doc of docs) {
    const currentPath = `${basePath}/${doc.title}`.replace(/\/+/g, '/');
    routes.push(
      <Route
        key={`route-${doc.title}`}
        path={currentPath}
        element={
          <>
            <Navbar 
              isDocumentPage={isDocumentPage} 
              isTocOpen={isTocOpen} 
              breadcrumbData={breadcrumbData} 
              toggleMobile={toggleMobile} 
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <Component 
              file={doc.code} 
              title={doc.title} 
              path={doc.title} 
              fold={fold} 
              type={type} 
              desc={doc.desc}
              writer={doc.writer}
              firstDate={doc.first_date}
              lastDate={doc.last_date}
              setBreadcrumbData={setBreadcrumbData} 
              isTocOpen={isTocOpen}
              toggleMobile={toggleMobile}
            />
          </>
        }
      />
    );
    if (doc.children) {
      routes = routes.concat(generateRoutes(
        doc.children, 
        currentPath, 
        Component, 
        fold, 
        type,
        setBreadcrumbData, 
        isTocOpen, 
        toggleMobile,
        Navbar,
        isDocumentPage,
        breadcrumbData,
        isDarkMode,
        toggleDarkMode
      ));
    }
  }
  return routes;
};

const App: React.FC = () => {
  const [documentStructure, setDocumentStructure] = useState<DocumentData[] | null>(null);
  const [tutorialStructure, setTutorialStructure] = useState<DocumentData[] | null>(null);
  const [projectStructure, setProjectStructure] = useState<DocumentData[] | null>(null);
  const [breadcrumbData, setBreadcrumbData] = useState<{ path: string[]; title: string }>({ path: [], title: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
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

    // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(prefersDarkScheme.matches);
    }
  }, []);
  
    // 更新主题
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isTocOpen) {
      document.getElementsByTagName('body')[0].classList.add('mobile-overlay-active');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('mobile-overlay-active');
    }
  }, [isTocOpen])

  const toggleMobile = () => {
    setIsTocOpen(!isTocOpen)
  }

  // Return null or loading spinner until data is loaded
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper category-html document-page">
      <Router basename={import.meta.env.BASE_URL || ''}>
        <Suspense fallback={<Loading />}>
          <Routes>

            <Route path="/" element={
              <>
                <Navbar 
                  isDocumentPage={false} 
                  isTocOpen={isTocOpen} 
                  breadcrumbData={breadcrumbData} 
                  toggleMobile={toggleMobile} 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                <Home />
              </>
            }/>

            {generateRoutes(
              tutorialStructure ?? [], 
              '/tutorials', DocumentTemplate, 'tutorials', 'tutorial', 
              setBreadcrumbData, isTocOpen, toggleMobile, 
              Navbar, true, breadcrumbData,
              isDarkMode, toggleDarkMode
            )}
            {generateRoutes(
              documentStructure ?? [], 
              '/documents', DocumentTemplate, 'documents', 'document', 
              setBreadcrumbData, isTocOpen, toggleMobile, 
              Navbar, true, breadcrumbData,
              isDarkMode, toggleDarkMode
            )}
            {generateRoutes(
              projectStructure ?? [], '/projects', DocumentTemplate, 'projects', 'project', 
              setBreadcrumbData, isTocOpen, toggleMobile, 
              Navbar, true, breadcrumbData,
              isDarkMode, toggleDarkMode
            )}
            
            <Route path="/about" element={
              <>
                <Navbar 
                  isDocumentPage={false} 
                  isTocOpen={isTocOpen} 
                  breadcrumbData={breadcrumbData} 
                  toggleMobile={toggleMobile} 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                <About />
              </>
            } />

            <Route path="/tool" element={
              <>
                <Navbar 
                  isDocumentPage={false} 
                  isTocOpen={isTocOpen} 
                  breadcrumbData={breadcrumbData} 
                  toggleMobile={toggleMobile} 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                <Tool isDarkMode={isDarkMode} />
              </>
            }/>
            
            <Route path="*" element={
              <>
                <Navbar 
                  isDocumentPage={false} 
                  isTocOpen={isTocOpen} 
                  breadcrumbData={breadcrumbData} 
                  toggleMobile={toggleMobile} 
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
                <Home />
              </>
            } />

          </Routes>
        </Suspense>
        <Footer></Footer>
      </Router>
    </div>
  );
};

export default App;
