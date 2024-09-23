import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 引入 FontAwesome 组件
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // 引入箭头图标
import './index.css'; // 导入样式文件

// 导航栏组件
const TopNavBar: React.FC = () => {
  const navigate = useNavigate();

  // 返回按钮点击处理函数
  const handleBackClick = () => {
    navigate(-1); // 返回到上一个页面
  };

  return (
    <div className="top-nav-bar">
      <button className="back-button" onClick={handleBackClick}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" /> {/* FontAwesome 图标 */}
        <span className="back-text">返回</span>
      </button>
    </div>
  );
};

export default TopNavBar;
