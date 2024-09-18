import React, { useEffect, useState } from 'react';
import './Loading.css'

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  

  useEffect(() => {
    // 获取当前 root 元素
    const rootElement = document.documentElement;
    // 假设你的主题类是 'light' 和 'dark'
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 动态设置 root 的 class
    rootElement.classList.add(isDarkMode ? 'dark' : 'light');
    // Simulate progress increment
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    }, 300); // Increment progress every 300ms

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-text">{`< Loading... />`}</div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default Loading;