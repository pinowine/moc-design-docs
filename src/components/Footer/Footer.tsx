import React, { useEffect, useState } from 'react';
import MOCLogo from '../../assets/moclogo.svg?react';
import { Link } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";
import { FaBilibili } from "react-icons/fa6";
import { FaWeibo } from "react-icons/fa";
import { SiXiaohongshu } from "react-icons/si";
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
        const basePath = import.meta.env.BASE_URL || ''; // Get base path from environment
        const documentRes = await fetch(`${basePath}data/documentStructure.json`);
        const tutorialRes = await fetch(`${basePath}data/tutorialStructure.json`);
        const projectRes = await fetch(`${basePath}data/projectStructure.json`);

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
            <li>
              <Link to="https://www.xiaohongshu.com/user/profile/65e48476000000000500cff7" className="social-icon">
                <SiXiaohongshu />
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
          <a 
            href="https://developer.mozilla.org/zh-CN/" 
            className="logo" 
            aria-label="MDN homepage"
          >
            <svg 
              id="mdn-docs-logo" 
              xmlns="http://www.w3.org/2000/svg" 
              x="0" 
              y="0" 
              viewBox="0 0 694.9 104.4" 
              role="img"
            >
              <title>MDN Web Docs</title>
              <path 
                d="M40.3 0 11.7 92.1H0L28.5 0h11.8zm10.4 0v92.1H40.3V0h10.4zM91 0 62.5 92.1H50.8L79.3 0H91zm10.4 0v92.1H91V0h10.4z" 
                className="logo-m"
              ></path>
              <path d="M627.9 95.6h67v8.8h-67v-8.8z" className="logo-_"></path>
              <path 
                d="M367 42h-4l-10.7 30.8h-5.5l-10.8-26h-.4l-10.5 26h-5.2L308.7 42h-3.8v-5.6H323V42h-6.5l6.8 20.4h.4l10.3-26h4.7l11.2 26h.5l5.7-20.3h-6.2v-5.6H367V42zm34.9 20c-.4 3.2-2 5.9-4.7 8.2-2.8 2.3-6.5 3.4-11.3 3.4-5.4 0-9.7-1.6-13.1-4.7-3.3-3.2-5-7.7-5-13.7 0-5.7 1.6-10.3 4.7-14s7.4-5.5 12.9-5.5c5.1 0 9.1 1.6 11.9 4.7s4.3 6.9 4.3 11.3c0 1.5-.2 3-.5 4.7h-25.6c.3 7.7 4 11.6 10.9 11.6 2.9 0 5.1-.7 6.5-2 1.5-1.4 2.5-3 3-4.9l6 .9zM394 51.3c.2-2.4-.4-4.7-1.8-6.9s-3.8-3.3-7-3.3c-3.1 0-5.3 1-6.9 3-1.5 2-2.5 4.4-2.8 7.2H394zm51 2.4c0 5-1.3 9.5-4 13.7s-6.9 6.2-12.7 6.2c-6 0-10.3-2.2-12.7-6.7-.1.4-.2 1.4-.4 2.9s-.3 2.5-.4 2.9h-7.3c.3-1.7.6-3.5.8-5.3.3-1.8.4-3.7.4-5.5V22.3h-6v-5.6H416v27c1.1-2.2 2.7-4.1 4.7-5.7 2-1.6 4.8-2.4 8.4-2.4 4.6 0 8.4 1.6 11.4 4.7 3 3.2 4.5 7.6 4.5 13.4zm-7.7.6c0-4.2-1-7.4-3-9.5-2-2.2-4.4-3.3-7.4-3.3-3.4 0-6 1.2-8 3.7-1.9 2.4-2.9 5-3 7.7V57c0 3 1 5.6 3 7.7s4.5 3.1 7.6 3.1c3.6 0 6.3-1.3 8.1-3.9 1.8-2.7 2.7-5.9 2.7-9.6zm69.2 18.5h-13.2v-7.2c-1.2 2.2-2.8 4.1-4.9 5.6-2.1 1.6-4.8 2.4-8.3 2.4-4.8 0-8.7-1.6-11.6-4.9-2.9-3.2-4.3-7.7-4.3-13.3 0-5 1.3-9.6 4-13.7 2.6-4.1 6.9-6.2 12.8-6.2 5.7 0 9.8 2.2 12.3 6.5V22.3h-8.6v-5.6h15.8v50.6h6v5.5zM493.2 56v-4.4c-.1-3-1.2-5.5-3.2-7.3s-4.4-2.8-7.2-2.8c-3.6 0-6.3 1.3-8.2 3.9-1.9 2.6-2.8 5.8-2.8 9.6 0 4.1 1 7.3 3 9.5s4.5 3.3 7.4 3.3c3.2 0 5.8-1.3 7.8-3.8 2.1-2.6 3.1-5.3 3.2-8zm53.1-1.4c0 5.6-1.8 10.2-5.3 13.7s-8.2 5.3-13.9 5.3-10.1-1.7-13.4-5.1c-3.3-3.4-5-7.9-5-13.5 0-5.3 1.6-9.9 4.7-13.7 3.2-3.8 7.9-5.7 14.2-5.7s11 1.9 14.1 5.7c3 3.7 4.6 8.1 4.6 13.3zm-7.7-.2c0-4-1-7.2-3-9.5s-4.8-3.5-8.2-3.5c-3.6 0-6.4 1.2-8.3 3.7s-2.9 5.6-2.9 9.5c0 3.7.9 6.8 2.8 9.4 1.9 2.6 4.6 3.9 8.3 3.9 3.6 0 6.4-1.3 8.4-3.8 1.9-2.6 2.9-5.8 2.9-9.7zm45 5.8c-.4 3.2-1.9 6.3-4.4 9.1-2.5 2.9-6.4 4.3-11.8 4.3-5.2 0-9.4-1.6-12.6-4.8-3.2-3.2-4.8-7.7-4.8-13.7 0-5.5 1.6-10.1 4.7-13.9 3.2-3.8 7.6-5.7 13.2-5.7 2.3 0 4.6.3 6.7.8 2.2.5 4.2 1.5 6.2 2.9l1.5 9.5-5.9.7-1.3-6.1c-2.1-1.2-4.5-1.8-7.2-1.8-3.5 0-6.1 1.2-7.7 3.7-1.7 2.5-2.5 5.7-2.5 9.6 0 4.1.9 7.3 2.7 9.5 1.8 2.3 4.4 3.4 7.8 3.4 5.2 0 8.2-2.9 9.2-8.8l6.2 1.3zm34.7 1.9c0 3.6-1.5 6.5-4.6 8.5s-7 3-11.7 3c-5.7 0-10.6-1.2-14.6-3.6l1.2-8.8 5.7.6-.2 4.7c1.1.5 2.3.9 3.6 1.1s2.6.3 3.9.3c2.4 0 4.5-.4 6.5-1.3 1.9-.9 2.9-2.2 2.9-4.1 0-1.8-.8-3.1-2.3-3.8s-3.5-1.3-5.8-1.7-4.6-.9-6.9-1.4c-2.3-.6-4.2-1.6-5.7-2.9-1.6-1.4-2.3-3.5-2.3-6.3 0-4.1 1.5-6.9 4.6-8.5s6.4-2.4 9.9-2.4c2.6 0 5 .3 7.2.9 2.2.6 4.3 1.4 6.1 2.4l.8 8.8-5.8.7-.8-5.7c-2.3-1-4.7-1.6-7.2-1.6-2.1 0-3.7.4-5.1 1.1-1.3.8-2 2-2 3.8 0 1.7.8 2.9 2.3 3.6 1.5.7 3.4 1.2 5.7 1.6 2.2.4 4.5.8 6.7 1.4 2.2.6 4.1 1.6 5.7 3 1.4 1.6 2.2 3.7 2.2 6.6zM197.6 73.2h-17.1v-5.5h3.8V51.9c0-3.7-.7-6.3-2.1-7.9-1.4-1.6-3.3-2.3-5.7-2.3-3.2 0-5.6 1.1-7.2 3.4s-2.4 4.6-2.5 6.9v15.6h6v5.5h-17.1v-5.5h3.8V51.9c0-3.8-.7-6.4-2.1-7.9-1.4-1.5-3.3-2.3-5.6-2.3-3.2 0-5.5 1.1-7.2 3.3-1.6 2.2-2.4 4.5-2.5 6.9v15.8h6.9v5.5h-20.2v-5.5h6V42.4h-6.1v-5.6h13.4v6.4c1.2-2.1 2.7-3.8 4.7-5.2 2-1.3 4.4-2 7.3-2s5.3.7 7.5 2.1c2.2 1.4 3.7 3.5 4.5 6.4 1.1-2.5 2.7-4.5 4.9-6.1s4.8-2.4 7.9-2.4c3.5 0 6.5 1.1 8.9 3.3s3.7 5.6 3.7 10.2v18.2h6.1v5.5zm42.5 0h-13.2V66c-1.2 2.2-2.8 4.1-4.9 5.6-2.1 1.6-4.8 2.4-8.3 2.4-4.8 0-8.7-1.6-11.6-4.9-2.9-3.2-4.3-7.7-4.3-13.3 0-5 1.3-9.6 4-13.7 2.6-4.1 6.9-6.2 12.8-6.2s9.8 2.2 12.3 6.5V22.7h-8.6v-5.6h15.8v50.6h6v5.5zm-13.3-16.8V52c-.1-3-1.2-5.5-3.2-7.3s-4.4-2.8-7.2-2.8c-3.6 0-6.3 1.3-8.2 3.9-1.9 2.6-2.8 5.8-2.8 9.6 0 4.1 1 7.3 3 9.5s4.5 3.3 7.4 3.3c3.2 0 5.8-1.3 7.8-3.8 2.1-2.6 3.1-5.3 3.2-8zm61.5 16.8H269v-5.5h6V51.9c0-3.7-.7-6.3-2.2-7.9-1.4-1.6-3.4-2.3-5.7-2.3-3.1 0-5.6 1-7.4 3s-2.8 4.4-2.9 7v15.9h6v5.5h-19.3v-5.5h6V42.4h-6.2v-5.6h13.6V43c2.6-4.6 6.8-6.9 12.7-6.9 3.6 0 6.7 1.1 9.2 3.3s3.7 5.6 3.7 10.2v18.2h6v5.4h-.2z" 
                className="logo-text"
              ></path>
            </svg>
          </a>
          <a 
            href="https://www.mozilla.org/" 
            className="footer-moz-logo-link" 
            target="_blank" 
          rel="noopener noreferrer"
          >
            <svg width="112" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title id="mozilla-footer-logo-svg">Mozilla logo</title>
              <path d="M41.753 14.218c-2.048 0-3.324 1.522-3.324 4.157 0 2.423 1.119 4.286 3.29 4.286 2.082 0 3.447-1.678 3.447-4.347 0-2.826-1.522-4.096-3.413-4.096Zm54.89 7.044c0 .901.437 1.618 1.645 1.618 1.427 0 2.949-1.024 3.044-3.352-.649-.095-1.365-.185-2.02-.185-1.426-.005-2.668.397-2.668 1.92Z" fill="currentColor"></path>
              <path d="M0 0v32h111.908V0H0Zm32.56 25.426h-5.87v-7.884c0-2.423-.806-3.352-2.39-3.352-1.924 0-2.702 1.365-2.702 3.324v4.868h1.864v3.044h-5.864v-7.884c0-2.423-.806-3.352-2.39-3.352-1.924 0-2.702 1.365-2.702 3.324v4.868h2.669v3.044H6.642v-3.044h1.863v-7.918H6.642V11.42h5.864v2.11c.839-1.489 2.3-2.39 4.252-2.39 2.02 0 3.878.963 4.566 3.01.778-1.862 2.361-3.01 4.566-3.01 2.512 0 4.812 1.522 4.812 4.84v6.402h1.863v3.044h-.005Zm9.036.307c-4.314 0-7.296-2.635-7.296-7.106 0-4.096 2.484-7.481 7.514-7.481s7.481 3.38 7.481 7.29c0 4.472-3.228 7.297-7.699 7.297Zm22.578-.307H51.942l-.403-2.11 7.7-8.846h-4.376l-.621 2.17-2.888-.313.498-4.907h12.294l.313 2.11-7.767 8.852h4.533l.654-2.172 3.167.308-.872 4.908Zm7.99 0h-4.191v-5.03h4.19v5.03Zm0-8.976h-4.191v-5.03h4.19v5.03Zm2.618 8.976 6.054-21.358h3.945l-6.054 21.358h-3.945Zm8.136 0 6.048-21.358h3.945l-6.054 21.358h-3.939Zm21.486.307c-1.863 0-2.887-1.085-3.072-2.792-.805 1.427-2.232 2.792-4.498 2.792-2.02 0-4.314-1.085-4.314-4.006 0-3.447 3.323-4.253 6.518-4.253.778 0 1.584.034 2.3.124v-.465c0-1.427-.034-3.133-2.3-3.133-.84 0-1.488.061-2.143.402l-.453 1.578-3.195-.34.549-3.224c2.45-.996 3.692-1.27 5.992-1.27 3.01 0 5.556 1.55 5.556 4.75v6.083c0 .805.314 1.085.963 1.085.184 0 .375-.034.587-.095l.034 2.11a5.432 5.432 0 0 1-2.524.654Z" fill="currentColor"></path>
            </svg>
          </a>
          <ul className="footer-moz-list">
            <li className="footer-moz-item">
              <a 
                href="https://www.mozilla.org/privacy/websites/" 
                className="footer-moz-link" 
                target="_blank" 
                rel="noopener noreferrer"
              >Website Privacy Notice</a>
            </li>
            <li className="footer-moz-item">
              <a 
                href="https://www.mozilla.org/privacy/websites/#cookies" 
                className="footer-moz-link" 
                target="_blank" 
                rel="noopener noreferrer"
              >Cookies</a>
            </li>
            <li className="footer-moz-item">
              <a 
              href="https://www.mozilla.org/about/legal/terms/mozilla" 
              className="footer-moz-link" 
              target="_blank" 
              rel="noopener noreferrer"
              >Legal</a>
            </li><li className="footer-moz-item">
              <a 
              href="https://www.mozilla.org/about/governance/policies/participation/" 
              className="footer-moz-link" 
              target="_blank" 
              rel="noopener noreferrer"
              >Community Participation Guidelines</a>
            </li>
          </ul>
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
