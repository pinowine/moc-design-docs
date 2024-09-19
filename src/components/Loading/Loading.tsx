import React, { useEffect, useState } from 'react';
import './Loading.css'

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  

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

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="loading-container">
      <div className="loading-text">{`< Loading... />`}</div>
      <div className="progress-ring">
      <svg width="120" height="120">
          <circle
            className="progress-ring__background"
            stroke="lightgray"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="progress-ring__circle"
            stroke="blue"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        </svg>
      </div>
    </div>
  );
};

export default Loading;