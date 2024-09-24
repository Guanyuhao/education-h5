import { useCallback, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'; // 引入图标
import Loading from '../../components/loading/gifLoading';
import './index.css'

function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true); // 控制加载状态
  const navigate = useNavigate(); 
  const [isMuted, setIsMuted] = useState(true); // 控制视频是否静音

  const handleVideoEnd = useCallback(() => {
    navigate('/map'); 
  }, [navigate]);

  const handleVideoReady = useCallback(() => {
    setIsLoading(false); // 视频加载完毕，关闭加载动画 loading
    if (videoRef.current) {
      videoRef.current.play();
    }
  },[])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('canplaythrough', handleVideoReady);
    }

    // 清理事件监听器
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplaythrough', handleVideoEnd);
      }
    };
  }, [handleVideoEnd, handleVideoReady]);

   // 切换视频的静音状态
   const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]); 

  return (
    <div className='home-page'>
      {isLoading && <Loading />}
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          muted={isMuted} // 通过 isMuted 状态控制是否静音
          loop
          playsInline
          onCanPlayThrough={handleVideoReady} // 视频资源加载完毕
          onEnded={handleVideoEnd}          // 视频播放完毕
        >
          <source src='/video/bg.mp4' type="video/mp4" />
          浏览器不支持视频播放
      </video>
      <div className="content-wrapper">
        {/* <h1>教育强国</h1> */}
        {/* <p>教育大国阔步迈向教育强国</p> */}
        {/* 声音控制按钮 */}
        {/* 声音控制按钮，使用图标替换文字 */}
        <button onClick={toggleMute} className="mute-button">
          {isMuted ? (
            <FontAwesomeIcon icon={faVolumeMute} /> // 静音图标
          ) : (
            <FontAwesomeIcon icon={faVolumeUp} />   // 音量图标
          )}
        </button>


        <button
          className="enter-button"
          onClick={handleVideoEnd}
        >
          开始巡礼
        </button>
      </div>
    </div>
  )
}

export default Home
