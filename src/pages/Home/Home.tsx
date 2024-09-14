﻿import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';
import MOCLogo from '../../assets/moclogo.svg?react';

interface DocumentData {
  title: string;
  file: string;
  children?: DocumentData[];
}

const Home: React.FC = () => {
  const location = useLocation();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [tutorials, setTutorials] = useState<DocumentData[]>([]);
  const [projects, setProjects] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 当路由变为主页时，将页面滚动到顶部
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentRes = await fetch('/data/documentStructure.json');
        const tutorialRes = await fetch('/data/tutorialStructure.json');
        const projectRes = await fetch('/data/projectStructure.json');

        // console.log('Fetching documents:', documentRes);
        // console.log('Fetching tutorials:', tutorialRes);
        // console.log('Fetching projects:', projectRes);

        if (documentRes.ok && tutorialRes.ok && projectRes.ok) {
          const documentData = await documentRes.json();
          // console.log('Fetched document data:', documentData);
          const tutorialData = await tutorialRes.json();
          const projectData = await projectRes.json();

          setDocuments(documentData);
          setTutorials(tutorialData);
          setProjects(projectData);
        } else {
          console.error('Failed to load one or more JSON files');
        }
      } catch (error) {
        console.error('Error loading JSON data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 显示加载状态
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content-container">
        <header className="home-header">
          <div className="logo-container">
            <MOCLogo className="logo" />
          </div>
          <h1>欢迎来到 MOC-Design-DOCS</h1>
          <p>
            这是一个为<code>浙江大学MOC清唱团</code>搭建的静态站点，旨在便利于2024年以后的宣传与推广项目，包含开发者对自己历年为MOC设计宣传经验的总结。
          </p>
        </header>
        <section className="home-content">
          <Link to={`/tutorials/${tutorials[0].title}#${tutorials[0].title}`} className="home-section card">
            <h2>教程</h2>
            <p>了解如何快速开始使用我们的文档网站。</p>
          </Link>
          <Link to={`/documents/${documents[0].title}#${documents[0].title}`} className="home-section card">
            <h2>文档</h2>
            <p>浏览和搜索你所需要的文档内容。</p>
          </Link>
          <Link to={`/projects/${projects[0].title}#${projects[0].title}`} className="home-section card">
            <h2>项目参考</h2>
            <p>查看其他项目的参考文档和示例。</p>
          </Link>
          <Link to="/about" className="home-section card">
            <h2>关于我们</h2>
            <p>了解更多关于我们团队和网站的信息。</p>
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
