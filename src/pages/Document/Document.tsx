import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import './Document.css'

const MarkdownRenderer = lazy(() => import('../../components/MarkdownRenderer/MarkdownRenderer'));
const Breadcrumb = lazy(() => import('../../components/Breadcrumb/Breadcrumb'));

interface DocumentProps {
  title: string;
  file: string;
  path: string;
  fold: string;
}

interface DocumentData {
  title: string
  file: string
  children?: DocumentData[]
}

const Document: React.FC<DocumentProps> = ({ file,title,fold }) => {
  const [content, setContent] = useState('');
  const [documentStructure, setDocumentStructure] = useState<DocumentData[]>([]);
  const [currentSection, setCurrentSection] = useState('');
  const location = useLocation();
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchDocumentStructure = async () => {
      try {
        const basePath = import.meta.env.BASE_URL || ''; // Get base path from environment
        const response = await fetch(`${basePath}data/documentStructure.json`); // Prepend basePath
        if (!response.ok) {
          throw new Error('Error loading document structure');
        }
        const data = await response.json();
        setDocumentStructure(data);
        setFilteredDocs(data); // 默认显示所有文档
      } catch (error) {
        console.error('Error fetching document structure:', error);
      }
    };
  
    fetchDocumentStructure();
  }, []);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const basePath = import.meta.env.BASE_URL || ''; // Get base path from environment
        const response = await fetch(`${basePath}documents/${fold}/${file}.md`)
        if (response.ok) {
          const text = await response.text()
          setContent(text)
        } else {
          setContent('Error loading content')
        }
      } catch (error) {
        setContent('Error loading content')
      }
    }

    fetchContent()

    // 每次加载新文档时滚动到顶部
    window.scrollTo(0, 0);
  }, [file, fold])

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentSection(window.location.hash.replace('#', ''));
    };

    // Set initial hash value and listen for hash changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Keep the scroll position in sidebar based on current section
  useEffect(() => {
    const handleScroll = () => {
      const headings = Array.from(document.querySelectorAll('.main-page-content h2')) as HTMLElement[];
      const scrollPosition = window.scrollY + window.innerHeight / 2 - 100;

      let current = '';
      for (const heading of headings) {
        if (heading.offsetTop <= scrollPosition) {
          current = heading.id;
        } else {
          break;
        }
      }

      setCurrentSection(current);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Make sure only the Markdown content is updated
  const markdownRendererKey = `${fold}-${file}`;

  useEffect(() => {
    const focusCurrentDocument = () => {
      const currentElement = document.querySelector(`[href="${window.location.hash}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  
    focusCurrentDocument();
  }, [location.pathname, currentSection]); // Trigger on path or section changes

  useEffect(() => {
    if (isTocOpen) {
      document.getElementsByTagName('body')[0].classList.add('mobile-overlay-active');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('mobile-overlay-active');
    }
  }, [isTocOpen])

  const getPathArray = () => {
    return location.pathname.split('/').filter(Boolean).map(segment => decodeURIComponent(segment))
  }

  const toggleMobile = () => {
    setIsTocOpen(!isTocOpen)
  }

  const isCurrentDocument = (docPath: string) => {
    const currentPath = decodeURIComponent(location.pathname.split('/').slice(2).join('/'));
    const decodedDocPath = decodeURIComponent(docPath);
    return currentPath === decodedDocPath;
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterText(value);
  
    if (value.trim() === '') {
      setFilteredDocs(documentStructure);
    } else {
      const filtered = documentStructure.filter(doc => 
        doc.title.toLowerCase().includes(value.toLowerCase()) ||
        (doc.children && doc.children.some(child => child.title.toLowerCase().includes(value.toLowerCase())))
      );
      setFilteredDocs(filtered);
    }
  };

  const clearFilter = () => {
    setFilterText('');
    setFilteredDocs(documentStructure); // 从 useState 中获取的 documentStructure
    document.getElementById('sidebar-filter-input')?.classList.remove('is-active');
    document.getElementById('sidebar-filter-input')?.classList.add('false');
  };

  const handleInputFocus = () => {
    document.getElementById('sidebar-filter-input')?.classList.add('is-active');
    document.getElementById('sidebar-filter-input')?.classList.remove('false');
  }

  return (
    <div className="page-wrapper category-html document-page">
      <div className="sticky-header-container">
        <header className="top-navigation">
          <Navbar />
        </header>
        <div className="article-actions-container">
          <div className="container">
            <button 
              className="button action has-icon sidebar-button" 
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
            <Suspense fallback={<Loading/>} >
              <Breadcrumb path={getPathArray()} title={title} />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="main-wrapper">
        <div className="sidebar-container">
          <aside className={`sidebar ${isTocOpen ? 'is-expanded' : ''}`} id='sidebar-quicklinks' data-macro="LearnSidebar">
            <nav className="sidebar-inner" aria-label='Related Topics'>
              <header className="sidebar-actions">
                <section className="sidebar-filter-container">
                  <div className="sidebar-filter">
                    <label htmlFor="sidebar-filter-input" id="sidebar-filter-label" className="sidebar-filter-label">
                      <span className="icon icon-filter"></span>
                      <span className="visually-hidden">Filter Sidebar</span>
                    </label>
                    <input 
                      type="text" 
                      id='sidebar-filter-input' 
                      className="sidebar-filter-input-field" 
                      placeholder="Filter" 
                      value={filterText}
                      onChange={handleFilterChange}
                      onFocus={handleInputFocus}
                    />
                    <button 
                      type='button' 
                      className='button action has-icon clear-sidebar-filter-button' 
                      onClick={clearFilter} 
                    >
                      <span className="button-wrap">
                        <span className="icon icon-cancel"></span>
                        <span className="visually-hidden">Clear filter input</span>
                      </span>
                    </button>
                  </div>
                </section>
              </header>
              <div className="sidebar-inner-nav">
                <div className="in-nav-toc">
                  <div className="document-toc-container">
                    <section className="document-toc">
                      <header>
                        <h2 className="document-toc-heading">In this Article</h2>
                      </header>
                      <ul className='document-toc-list' >
                        {content.split('\n').filter(line => line.startsWith('##')).map((line, idx) => {
                          const section = line.replace(/#/g, '').trim();
                          const additionalClass = line.startsWith('####') ? 'visually-hidden' : line.startsWith('###') ? 'h3' : line.startsWith('##') ? 'h2' : '';
                          return (
                            <li key={idx} className="document-toc-item">
                              <a 
                                href={`#${section}`} 
                                className={`document-toc-link ${additionalClass}`}
                                aria-current={currentSection === section ? 'true' : undefined}
                              >{section}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  </div>
                </div>
                <div className="sidebar-body">
                  <ol>
                    {filteredDocs.map((doc) => (
                      <div key={doc.title}>
                        <li className='section'>
                          <Link
                            to={`/${fold}/${doc.title}`}
                            aria-current={isCurrentDocument(`${doc.title}`) ? 'page' : undefined}
                            >{doc.title}</Link>
                        </li>
                        <li>
                          {doc.children && (
                            <details open>
                              <summary>
                                {doc.title}
                              </summary>
                              <ol>
                                {doc.children.map((child) => (
                                  <div key={child.title}>
                                    <li key={child.title}>
                                      <Link
                                        to={`/${fold}/${doc.title}/${child.title}`}
                                        aria-current={isCurrentDocument(`${doc.title}/${child.title}`) ? 'page' : undefined}
                                      >{child.title}</Link>
                                    </li>
                                    <li>
                                      {child.children && (
                                        <details open>
                                          <summary>
                                            {child.title}
                                          </summary>
                                          <ol>
                                            {child.children.map((grandchild) => (
                                              <li key={grandchild.title}>
                                                <Link
                                                  to={`/${fold}/${doc.title}/${child.title}/${grandchild.title}`}
                                                  aria-current={isCurrentDocument(`${doc.title}/${child.title}/${grandchild.title}`) ? 'page' : undefined}
                                                >{grandchild.title}</Link>
                                              </li>
                                            ))}
                                          </ol>
                                        </details>
                                      )}
                                    </li>
                                  </div>
                                ))}
                              </ol>
                            </details>
                          )}
                        </li>
                    </div>))}
                  </ol>
                </div>
              </div>
              <section className="place side"></section>
            </nav>
          </aside>
          <div className="toc-container">
            <aside className="toc">
              <nav>
                <div className="document-toc-container">
                <section className="document-toc">
                  <header>
                    <h2 className="document-toc-heading">In this Article</h2>
                  </header>
                  <ul className='document-toc-list' >
                    {content.split('\n').filter(line => line.startsWith('##')).map((line, idx) => {
                      const section = line.replace(/#/g, '').trim();
                      const additionalClass = line.startsWith('####') ? 'visually-hidden' : line.startsWith('###') ? 'h3' : line.startsWith('##') ? 'h2' : '';
                      return(
                      <li key={idx} className="document-toc-item">
                        <a 
                          href={`#${section}`} 
                          className={`document-toc-link ${additionalClass}`}
                          aria-current={currentSection === section ? 'true' : undefined}
                        >{section}</a>
                      </li>
                      );
                    })}
                  </ul>
                </section>
                </div>
              </nav>
            </aside>
            <section className="place side"></section>
          </div>
        </div>
        <main className="main-content">
          <article className="main-page-content" lang='zh-CN'>
            { 
              <Suspense fallback={<Loading />}>
                <MarkdownRenderer key={markdownRendererKey} file={file} fold={fold} />
              </Suspense>
            }
          </article>
        </main>
        
      </div>
      <Footer />
    </div>
  )
}

export default Document
