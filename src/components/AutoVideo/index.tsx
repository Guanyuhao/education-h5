/*背景视频自动播放*/
import {
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import Loading from "../loading";
import GifLoading from "../loading/gifLoading";

import "./index.css";

interface AutoVideoProps {
  type: "home" | "map";
  loadingType?: "normal" | "gif";
  withLoading?: boolean;
  handleVideoReady?: () => void;
  handleVideoEnd?: () => void;
}
export type AutoVideoHandle = {
  toggleMute: () => void;
  getMuted: () => boolean;
};

const Fn = () => {};

const AutoVideo = forwardRef<AutoVideoHandle, AutoVideoProps>((props, ref) => {
  const [isLoading, setIsLoading] = useState(true); // 控制加载状态
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // 控制视频是否静音
  const [autoPlayFailed, setAutoPlayFailed] = useState(false); // 自动播放失败标志

  const { type = "home", handleVideoReady = Fn, handleVideoEnd = Fn, withLoading = true, loadingType = "gif" } = props;
  const videoUrl = type === "home" ? "/video/bg-720.mp4" : "/video/bg-map-2.mp4";

  const handleVideoLoaded = useCallback(() => {
    setIsLoading(false); // 视频加载完毕，关闭加载动画 loading
    handleVideoReady?.(); // 视频加载完毕，执行回调
  },[handleVideoReady])

  const handleVideoPlayEnd = useCallback(() => {
    if (type === "home") {
      videoRef.current?.play();
    }
    else {
      handleVideoEnd?.(); // 视频播放完毕，执行回调
    }
  },[handleVideoEnd, type]);

  const handlePageInitVideoPlay = useCallback(() => {
    if (videoRef.current) {
      const videoPromise = videoRef.current.play();
      videoPromise
        .then(() => {
          setAutoPlayFailed(false); // 自动播放成功
          console.info("自动播放视频:success");
          const userAgent = window?.navigator?.userAgent?.toLowerCase();
          const isWeChat = /micromessenger/.test(userAgent);
          if (isWeChat) {
            setIsMuted(false); // 视频播放成功，取消静音
          }
        })
        .catch((err) => {
          setAutoPlayFailed(true); // 自动播放失败
          console.error("自动播放视频失败", err);
        });
    }
  }, [videoRef]);


  useEffect(() => {
    // eslint-disable-next-line 
    // const vConsole = new window.VConsole();
    // 检测微信浏览器环境
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isWeChat = /micromessenger/.test(userAgent);
       // 监听 WeixinJSBridgeReady 事件
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const WeixinJSBridge = window.WeixinJSBridge
      if (isWeChat && typeof window !== 'undefined' && typeof WeixinJSBridge !== 'undefined') {
        WeixinJSBridge.invoke("getNetworkType", {}, function(){
          handlePageInitVideoPlay?.();
        });
        document.addEventListener('WeixinJSBridgeReady', handlePageInitVideoPlay, false);
      } else {
        // 非微信浏览器，直接处理
        console.log("非微信浏览器");
        handlePageInitVideoPlay?.();
      }
    }
    return () => {
      // vConsole.destroy();
      // 清除事件监听器
      document.removeEventListener('WeixinJSBridgeReady', handlePageInitVideoPlay);
    };
  }, [handlePageInitVideoPlay])

  // 切换视频的静音状态
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  useImperativeHandle(ref, () => ({
    toggleMute,
    getMuted: () => isMuted,
  }));

  const handleManualPlay = useCallback(() => {
    handlePageInitVideoPlay?.();
  }, [handlePageInitVideoPlay]);

  return (
    <>
      {withLoading && loadingType === "normal" && isLoading && <Loading />}
      {withLoading && loadingType === "gif" && isLoading && <GifLoading />}
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        muted={isMuted}
        loop={false}
        playsInline
        x5-video-player-type="h5"
        webkit-playsinline="true"
        x-webkit-airplay="true"
        x5-video-player-fullscreen="true"
        onCanPlayThrough={handleVideoLoaded} // 视频资源加载完毕
        onEnded={handleVideoPlayEnd}          // 视频播放完毕
      >
        <source src={videoUrl} type="video/mp4" />
        浏览器不支持视频播放
      </video>
      {/* 自动播放失败提示 */}
      {autoPlayFailed && (
        <div className="video-overlay">
          <p className="video-text">点击下方按钮即开启体验</p>
          <button className="video-button" onClick={handleManualPlay}>
            开启
          </button>
        </div>
      )}
      {/* <ToastContainer/> */}
    </>
  );
});

export default AutoVideo;
