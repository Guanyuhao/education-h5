import React from 'react';
import './index.css';

const generateParticles = (num: number) => {
  const particles = [];
  for (let i = 0; i < num; i++) {
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      transform: `scale(${Math.random() * 0.5 + 0.5})`, // 控制缩放
    };
    particles.push(<div key={i} className="particle" style={style}></div>);
  }
  return particles;
};

interface LoadingProps {
  size?: number;
  particleCount?: number; // 控制粒子数量
}

const Loading: React.FC<LoadingProps> = ({ size = 80, particleCount = 20 }) => {
  return (
    <div className='loading-wrapper'>
      <div className="loading-container" style={{ width: size, height: size }}>
        <div className="loading-spinner">
          <div className="spinner-layer spinner-layer-1"></div>
          <div className="spinner-layer spinner-layer-2"></div>
          <div className="spinner-layer spinner-layer-3"></div>
        </div>
        <div className="particle-container">
          {generateParticles(particleCount)} {/* 动态控制粒子数量 */}
        </div>
      </div>
    </div>
  );
};

export default Loading;
