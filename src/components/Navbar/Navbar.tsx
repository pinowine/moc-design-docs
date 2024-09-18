import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import Search from '../Search/Search';
import MOCLogo from '../../assets/moclogo.svg?react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkScheme.matches);
  }, []);

  useEffect(() => {
    const iconElement = document.getElementsByClassName('icon')[3];

    if (iconElement) {
      if (isDarkMode) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        iconElement.classList.add('icon-theme-dark');
        iconElement.classList.remove('icon-theme-light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        iconElement.classList.add('icon-theme-light');
        iconElement.classList.remove('icon-theme-dark');
      }
    }
  }, [isDarkMode]);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const isPathMatch = (path: string) => {
    return location.pathname === path || location.pathname === `${path}/`;
  };

  return (
    <div className="sticky-header-container without-actions">

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
                <li className="top-level-entry-container">
                  <Link to="/" className="top-level-entry menu-link" aria-disabled={isPathMatch('/')}>
                    首页
                  </Link>
                </li>
                <li className="top-level-entry-container">
                  <Link to="/tutorials/快速开始" className="top-level-entry menu-link" aria-disabled={isPathMatch('/tutorials/教程')}>
                    教程
                  </Link>
                </li>
                <li className="top-level-entry-container">
                  <Link to="/documents/开始之前" className="top-level-entry menu-link" aria-disabled={isPathMatch('/documents/文档')}>
                    文档
                  </Link>
                </li>
                <li className="top-level-entry-container">
                  <Link to="/projects/纳新系列" className="top-level-entry menu-link" aria-disabled={isPathMatch('/projects/项目参考')}>
                    项目参考
                  </Link>
                </li>
                <li className="top-level-entry-container">
                  <Link to="/about" className="top-level-entry menu-link" aria-disabled={isPathMatch('/about')}>
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
                  <span className="theme-switcher-menu-icon icon"></span>
                  色彩主题
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

    </div>
  );
};

export default Navbar;
