import { useCallback, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'; // 引入图标
import AutoVideo, { AutoVideoHandle } from '../../components/AutoVideo';
import './index.css'

function Home() {
  const autoVideoRef = useRef<AutoVideoHandle>(null);
  const navigate = useNavigate(); 

  const mutedStatus = autoVideoRef.current?.getMuted();
  const [isMuted, setIsMuted] = useState(!!mutedStatus); // 控制视频是否静音

  const handelMuteBtnClick = useCallback(() => {
    autoVideoRef.current?.toggleMute(); // 切换静音状态
    setTimeout(() => {
      const mutedStatus = autoVideoRef.current?.getMuted();
      // console.log('当前静音状态：', mutedStatus);
      setIsMuted(!!mutedStatus); // 更新静音状态
    })
  },[])

  return (
    <div className='home-page'>
      <AutoVideo type='home' ref={autoVideoRef} />
      <div className="content-wrapper">
        <button onClick={handelMuteBtnClick} className="mute-button">
          {isMuted ? (
            <FontAwesomeIcon icon={faVolumeMute} /> // 静音图标
          ) : (
            <FontAwesomeIcon icon={faVolumeUp} />   // 音量图标
          )}
        </button>
        <button
          className="enter-button"
          onClick={() => navigate('/map')}
        >
          开始巡礼
        </button>
      </div>
    </div>
  )
}

export default Home
