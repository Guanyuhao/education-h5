import React, { useEffect, useState } from 'react';
import TopNavBar from '../TopNavBar';
import './index.css';

interface SciFiBackgroundProps {
    children: React.ReactNode
    hasNav?: boolean
}

// 定义流星的属性
interface MeteorProps {
  id: number;
  startX: string;
  startY: string;
  duration: string;
  delay: string;
  direction: 'left' | 'right';
}

// 单个流星组件
const Meteor: React.FC<MeteorProps> = ({ startX, startY, duration, delay, direction }) => {
  return (
    <div
      className={`meteor ${direction}`}
      style={{
        top: startY,
        left: startX,
        animationDuration: duration,
        animationDelay: delay,
      }}
    />
  );
};

// SciFiBackground 组件
const SciFiBackground: React.FC<SciFiBackgroundProps> = ({ children, hasNav }) => {
  const [meteors, setMeteors] = useState<MeteorProps[]>([]);

  useEffect(() => {
    const generatedMeteors: MeteorProps[] = [];
    for (let i = 0; i < 15; i++) { // 控制流星数量
      const startX = `${Math.random() * 100}%`;  // 随机 X 位置
      const startY = `-${Math.random() * 200}px`; // 随机 Y 起点
      const duration = `${3 + Math.random() * 5}s`;  // 随机动画时长
      const delay = `${Math.random() * 3}s`;  // 随机延迟时间
      const direction = Math.random() > 0.5 ? 'right' : 'left';  // 随机方向

      generatedMeteors.push({
        id: i,
        startX,
        startY,
        duration,
        delay,
        direction,
      });
    }
    setMeteors(generatedMeteors);
  }, []);

  return (
    <div className="sci-fi-background">
      <div className={`context ${hasNav ? 'with-nav' : ''}`}>
        {hasNav && <TopNavBar />}
        {children}
      </div>
      <div className="meteor-container">
        {meteors.map((meteor) => (
          <Meteor
            key={meteor.id}
            id={meteor.id}
            startX={meteor.startX}
            startY={meteor.startY}
            duration={meteor.duration}
            delay={meteor.delay}
            direction={meteor.direction}
          />
        ))}
      </div>
      {/* <div className='flag-bg'></div> */}
    </div>
  );
};
export default SciFiBackground;
