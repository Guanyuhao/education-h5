import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import ImgBg from '../../assets/bg1.png'
import './index.css'

function Home() {
  const [isLoading, setIsLoading] = useState(true); // 控制加载状态
  const navigate = useNavigate(); 
  const handleButtonClick = useCallback(() => {
    navigate('/map'); 
  }, [navigate]);

  const handleImgOnLoad = useCallback(() => {
    setIsLoading(false); // 图片加载完成后关闭 loading
  },[])

  return (
    <div className='home-container'>
      {isLoading && <Loading />}
      <div className={isLoading ? 'hidden home' : 'home'}>
        <div className="content">
          <h1>欢迎来到探索世界</h1>
        </div>
        <button onClick={handleButtonClick} className="custom-button">开始探索</button>
      </div>
      <img onLoad={handleImgOnLoad} src={ImgBg} className='hidden' />
    </div>
  )
}

export default Home
