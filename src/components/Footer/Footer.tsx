import React, { useEffect, useState } from 'react';
import MOCLogo from '../../assets/moclogo.svg?react';
import { Link } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { FaBilibili } from "react-icons/fa6";
import { FaWeibo } from "react-icons/fa";
import './Footer.css';

interface DocumentData {
  title: string;
  file: string;
  children?: DocumentData[];
}

const Footer: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [tutorials, setTutorials] = useState<DocumentData[]>([]);
  const [projects, setProjects] = useState<DocumentData[]>([]);

  // 使用 useEffect 动态加载 JSON 文件
  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentRes = await fetch('/data/documentStructure.json');
        const tutorialRes = await fetch('/data/tutorialStructure.json');
        const projectRes = await fetch('/data/projectStructure.json');

        if (documentRes.ok && tutorialRes.ok && projectRes.ok) {
          const documentData = await documentRes.json();
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
      }
    };

    fetchData();
  }, []);

  if (documents.length === 0 || tutorials.length === 0 || projects.length === 0) {
    return <div>Loading...</div>; // 处理数据未加载完的情况
  }

  return (
    <footer className="page-footer" id='nav-footer'>
      <div className="page-footer-grid">
        <div className="page-footer-logo-col">
          <Link to="/" className="logo" aria-label='Home'>
            <MOCLogo />
            <span className='logo-text'>MOCDesignDOCS</span>
          </Link>
          <p>帮助您快速放弃设计。</p>
          <ul className="social-icons">
            <li>
              <Link to="https://github.com/pinowine/moc-design-docs" className="social-icon">
                <FaGithub />
              </Link>
            </li>
            <li>
              <Link to="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA3MDkzMjE1Nw==" className="social-icon">
                <IoLogoWechat />
              </Link>
            </li>
            <li>
              <Link to="https://space.bilibili.com/367355192?spm_id_from=333.337.0.0" className="social-icon">
                <FaBilibili />
              </Link>
            </li>
            <li>
              <Link to="https://weibo.com/6543442202?refer_flag=1001030103_" className="social-icon">
                <FaWeibo />
              </Link>
            </li>
          </ul>
        </div>
        <div className="page-footer-nav-col-1">
          <h2 className="footer-nav-heading">MOCDesignDOCS</h2>
          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <Link to="/">首页</Link>
            </li>
            <li className="footer-nav-item">
              <Link to={`/tutorials/${tutorials[0].title}#${tutorials[0].title}`}>教程</Link>
            </li>
            <li className="footer-nav-item">
              <Link to={`/documents/${documents[0].title}#${documents[0].title}`}>文档</Link>
            </li>
            <li className="footer-nav-item">
              <Link to={`/projects/${projects[0].title}#${projects[0].title}`}>项目参考</Link>
            </li>
          </ul>
        </div>
        <div className="page-footer-nav-col-2">
          <h2 className="footer-nav-heading">不知从何开始？</h2>
          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <Link to="/tutorials/快速开始#快速开始">快速开始</Link>
            </li>
            <li className="footer-nav-item">
              <Link to="/tutorials/帮助建设我们的文档#帮助建设我们的文档">帮助建设我们的文档</Link>
            </li>
          </ul>
        </div>
        <div className="page-footer-nav-col-3">
          <h2 className="footer-nav-heading">寻找项目</h2>
          <ul className="footer-nav-list">
            {projects.map((project, index) => (
              <li key={index} className='footer-nav-item'>
                <Link to={`/projects/${project.title}`}>{project.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="page-footer-nav-col-4">
          <h2 className="footer-nav-heading">文档导航</h2>
          <ul className="footer-nav-list">
            {documents.map((doc, index) => (
              <li key={index} className='footer-nav-item'>
                <Link to={`/documents/${doc.title}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="page-footer-moz">
          {/* Mozilla section remains unchanged */}
        </div>
        <div className="page-footer-legal">
          <p className="page-footer-legal-text">
            项目深受MDN文档影响，因此直接沿用了Mozilla架构。
          </p>
          <p id="license" className="page-footer-legal-text">
            Visit
            <Link to="https://www.mozilla.org" target="_blank" rel="noopener noreferrer"> Mozilla Corporation’s </Link>
            not-for-profit parent, the 
            <Link target="_blank" rel="noopener noreferrer" to="https://foundation.mozilla.org/"> Mozilla Foundation </Link>
            . <br />
            Portions of this content are ©1998–2024 by individual mozilla.org contributors.
            Content available under 
            <Link to="/zh-CN/docs/MDN/Writing_guidelines/Attrib_copyright_license"> a Creative Commons license </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
