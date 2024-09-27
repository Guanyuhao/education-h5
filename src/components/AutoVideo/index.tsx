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
  const { type = "home", handleVideoReady = Fn, handleVideoEnd = Fn, withLoading = true, loadingType = "gif" } = props;
  const videoUrl = type === "home" ? "/video/bg.mp4" : "/video/map-bg.mp4";

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
          setIsMuted(false); // 视频播放成功，取消静音
          // const ctx = new AudioContext()
          // const canAutoPlay = ctx.state === 'running'
          // ctx.close()
          // if (canAutoPlay) {
          //   setIsMuted(false); // 视频播放成功，取消静音
          // } else {
          //   toast.info("当前浏览器不支持自动播音频，请手动播放", {
          //     position: 'bottom-center',
          //     autoClose: 2000,
          //   });
          // }
        })
        .catch((err) => {
          console.error("自动播放视频成功", err);
        });
    }
  }, [videoRef]);


  useEffect(() => {
    // const vConsole = new window.VConsole();
    // 检测微信浏览器环境
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isWeChat = /micromessenger/.test(userAgent);
       // 监听 WeixinJSBridgeReady 事件
      const WeixinJSBridge = window.WeixinJSBridge
      if (isWeChat && typeof window !== 'undefined' && typeof WeixinJSBridge !== 'undefined') {
        // 微信浏览器，使用 WeixinJSBridge 处理

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
      {/* <ToastContainer/> */}
    </>
  );
});

export default AutoVideo;
