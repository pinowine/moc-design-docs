import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import Search from '../Search/Search';
import MOCLogo from '../../assets/moclogo.svg?react';
import Loading from '../Loading/Loading';

import Breadcrumb from '../Breadcrumb/Breadcrumb';

interface DocumentData {
  title: string;
  file: string;
  desc: string;
  children?: DocumentData[];
}

interface NavbarProps {
  isDocumentPage: boolean;
  isTocOpen: boolean;
  toggleMobile: () => void;
  breadcrumbData: { path: string[]; title: string };
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({isDocumentPage, isTocOpen, toggleMobile, breadcrumbData, isDarkMode, toggleDarkMode}) => {
  const [documentStructure, setDocumentStructure] = useState<DocumentData[] | null>(null);
  const [tutorialStructure, setTutorialStructure] = useState<DocumentData[] | null>(null);
  const [projectStructure, setProjectStructure] = useState<DocumentData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTutorialsOpen, setIsTutorialsOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    const navigationElement = document.getElementsByClassName('top-navigation')[0];
    if (navigationElement) {
      if (isMenuOpen) {
        navigationElement.classList.remove('show-nav');
      } else {
        navigationElement.classList.add('show-nav');
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isPathMatch = (pattern: string) => {
    return location.pathname === pattern || location.pathname.startsWith(`${pattern}/`);
  };

  const toggleTutorials = () => {
    setIsTutorialsOpen(!isTutorialsOpen)
  }

  const toggleDocuments = () => {
    setIsDocumentsOpen(!isDocumentsOpen)
  }

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen)
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="sticky-header-container">
      <header className="top-navigation">
            <div className="container">
              <div className="top-navigation-wrap">
                <Link to="/" className="logo" aria-label="MOCDesignDOC home">
                  <MOCLogo className="logo" />
                  <span className="logo-text">MOCDesignDOCS</span>
                </Link>
                <button
                  title={isMenuOpen ? 'Close main menu' : 'Open main menu'}
                  type="button"
                  className="button action has-icon main-menu-toggle"
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                >
                  <span className="button-wrap">
                    <span className={`icon ${isMenuOpen ? 'icon-menu' : 'icon-cancel'}`}></span>
                    <span className="visually-hidden">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                  </span>
                </button>
              </div>
              <div className="top-navigation-main">
                <nav className="main-nav">
                  <ul className="main-menu">

                    <li className={`top-level-entry-container ${isPathMatch('/') ? 'active' : ''}`}>
                      <Link 
                        to="/" 
                        className="top-level-entry menu-link"
                      >首页</Link>
                    </li>

                    <li className={`top-level-entry-container ${isPathMatch('/tutorials') ? 'active' : ''}`}>

                      <button 
                        type="button" 
                        id="tutorials-button" 
                        className="top-level-entry menu-toggle" 
                        aria-controls="tutorials-menu" 
                        aria-expanded={isTutorialsOpen}
                        onClick={toggleTutorials}
                      >教程</button>
                      <Link 
                        to="/tutorials/快速开始" 
                        className="top-level-entry"
                      >教程</Link>
                      <ul 
                        id="guides-menu" 
                        className={`submenu guides inline-submenu-lg ${isTutorialsOpen ? '' : 'hidden'} `}
                        aria-labelledby="guides-button"
                      >
                        {
                          tutorialStructure?.map((tutorial) => (
                            <li key={tutorial.title} className={`${tutorial.file}-link-container`}>
                              <Link to={`/tutorials/${tutorial.title}`} className='submenu-item'>
                                <div className={`submenu-icon ${tutorial.file}`}></div>
                                <div className="submenu-content-container">
                                  <div className="submenu-item-heading">{tutorial.title}</div>
                                  <p className="submenu-item-description">{tutorial.desc}</p>
                                </div>
                              </Link>
                            </li>
                          ))
                        }
                      </ul>

                    </li>

                    <li className={`top-level-entry-container ${isPathMatch('/documents') ? 'active' : ''}`}>

                      <button 
                        type="button" 
                        id="documents-button" 
                        className="top-level-entry menu-toggle" 
                        aria-controls="documents-menu" 
                        aria-expanded={isDocumentsOpen}
                        onClick={toggleDocuments}
                      >文档</button>
                      <Link 
                        to="/documents/开始之前" 
                        className="top-level-entry"
                      >
                        文档
                      </Link>
                      <ul 
                        id="guides-menu" 
                        className={`submenu guides inline-submenu-lg ${isDocumentsOpen ? '' : 'hidden'} `}
                        aria-labelledby="guides-button"
                      >
                        {
                          documentStructure?.map((doc) => (
                            <li key={doc.title} className={`${doc.file}-link-container`}>
                              <Link to={`/documents/${doc.title}`} className='submenu-item'>
                                <div className={`submenu-icon ${doc.file}`}></div>
                                <div className="submenu-content-container">
                                  <div className="submenu-item-heading">{doc.title}</div>
                                  <p className="submenu-item-description">{doc.desc}</p>
                                </div>
                              </Link>
                            </li>
                          ))
                        }
                      </ul>

                    </li>

                    <li className={`top-level-entry-container ${isPathMatch('/projects') ? 'active' : ''}`}>

                      <button 
                        type="button" 
                        id="projects-button" 
                        className="top-level-entry menu-toggle" 
                        aria-controls="projects-menu" 
                        aria-expanded={isProjectsOpen}
                        onClick={toggleProjects}
                      >项目参考</button>
                      <Link 
                        to="/projects/纳新系列" 
                        className="top-level-entry"
                      >
                        项目参考
                      </Link>
                      <ul 
                        id="guides-menu" 
                        className={`submenu guides inline-submenu-lg ${isProjectsOpen ? '' : 'hidden'} `}
                        aria-labelledby="guides-button"
                      >
                        {
                          projectStructure?.map((project) => (
                            <li key={project.title} className={`${project.file}-link-container`}>
                              <Link to={`/projects/${project.title}`} className='submenu-item'>
                                <div className={`submenu-icon ${project.file}`}></div>
                                <div className="submenu-content-container">
                                  <div className="submenu-item-heading">{project.title}</div>
                                  <p className="submenu-item-description">{project.desc}</p>
                                </div>
                              </Link>
                            </li>
                          ))
                        }
                      </ul>

                    </li>

                    <li className={`top-level-entry-container ${isPathMatch('/tool') ? 'active' : ''}`}>
                      <Link 
                        to="/tool" 
                        className="top-level-entry menu-link"
                      >
                        编辑器
                      </Link>
                    </li>

                    <li className={`top-level-entry-container ${isPathMatch('/about') ? 'active' : ''}`}>
                      <Link 
                        to="/about" 
                        className="top-level-entry menu-link"
                      >
                        关于
                      </Link>
                    </li>

                  </ul>
                </nav>

                <Search />

                <div className="theme-switcher-menu">
                  <button
                    type="button"
                    className="button action has-icon theme-switcher-menu small"
                    aria-haspopup="menu"
                    onClick={toggleDarkMode}
                  >
                    <span className="button-wrap">
                      <span className={`theme-switcher-menu-icon icon ${isDarkMode ? "icon-theme-dark" : "icon-theme-light"}`}></span>
                      色彩主题
                    </span>
                  </button>
                </div>

                <ul className="auth-container">
                  <li>
                    <a 
                      href="" 
                      className="login-link" 
                      rel="nofollow"
                    >
                      登录
                    </a>
                  </li>
                  <li>
                    <a 
                    href="" 
                    target="_self" 
                    rel="nofollow" 
                    className="button primary mdn-plus-subscribe-link"
                    >
                      <span className="button-wrap">注册</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
      </header>
      <div className={`article-actions-container ${isDocumentPage ? '' : 'visually-hidden'}`}>
        <div className="container">
          <button 
            className="button action sidebar-button backdrop" 
            type='button' 
            aria-label={isTocOpen ? 'Collapse sidebar' : 'Open sidebar'} 
            aria-expanded={isTocOpen} 
            aria-controls="sidebar-quicklinks" 
            onClick={toggleMobile} 
          >
            <span className="button-wrap">
              <span className="icon icon-sidebar"></span>
            </span>
          </button>
          <Breadcrumb path={breadcrumbData.path} title={breadcrumbData.title} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
