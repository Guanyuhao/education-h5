import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as echarts from "echarts";
import { ToastContainer, toast } from 'react-toastify';
import ls from 'localstorage-slim';
import SciFiBackground from '../../components/SciFiBackground';
import AutoVideo from '../../components/AutoVideo';

// 省份数据 https://datav.aliyun.com/portal/school/atlas/area_selector
import geoDate from '../../assets/china.json';
import './index.css';

const Map: React.FC = () => {
  const mapRef = useRef(null);
  const [selectedProvince, setSelectedProvince] = useState<string>(''); // 存储当前点击的省份
  const [watchedProvinces, setWatchedProvinces] = useState<string[]>([]); // 已经观看的省份
  const [showVideo, setShowVideo] = useState<boolean>(false); // 是否显示视频
  const [showMap, setShowMap] = useState<boolean>(false); // 是否显示视频


  useEffect(() => {
    const currentWatchedProvinces = ls.get('watchedProvinces') as string[] || [];
    setWatchedProvinces(currentWatchedProvinces)
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // 初始化 ECharts 实例
      const chart = echarts.init(mapRef.current);
      echarts.registerMap('china', geoDate as unknown as string);
       // 获取已观看的省份
       let currentWatchedProvinces: string[] = [];
       try {
        currentWatchedProvinces = ls.get('watchedProvinces') || [];
       } catch (error) {
         console.error('Error parsing watchedProvinces from localStorage:', error);
       }
       console.log('已观看的省份：', currentWatchedProvinces);
      // 定义地图的配置项
      const selectStyle = {
        disabled: true, // 禁用选中效果
        itemStyle: {
          areaColor: '#5083fb', // 已观看省份颜色
        },
        label: {
          show: true,
          // 暖黄色 #ff9900
          color: '#ff9900',
        }
      }
      const option = {
        // toolbox: {
        //   show: true,
        //   left: "left",
        //   top: "top",
        //   feature: {
        //     // dataView: { readOnly: false },
        //     restore: {},
        //     saveAsImage: {},
        //   },
        // },
        toolbox: false, // 隐藏工具箱
        tooltip: false, // 鼠标悬停提示
        geo: {
          selectedMode: 'multiple', // 多选模式
          map: 'china', // 使用中国地图
          roam: true, // 开启缩放和平移
          zoom: 5,  // 初始缩放级别，5 是放大的效果
          center: [116.4074, 39.9042],  // 北京市的经纬度
          itemStyle: {
            areaColor: '#f0f0f0',  // 默认省份颜色
            borderColor: '#fff',  // 省份边框颜色
            shadowColor: 'rgba(0, 0, 0, 0.5)',  // 设置阴影颜色
            shadowBlur: 30,  // 模糊程度
            shadowOffsetX: 0, // 阴影的水平偏移
            shadowOffsetY: 10, // 阴影的垂直偏移
          },
          emphasis: {
            areaColor: '#94b4ff', // 鼠标悬停省份颜色 淡蓝色 移动端没有
          },
          select: selectStyle,
          label: {
            show: true,
            // 灰色
            color: '#666',
            emphasis: {
              show: false,
            },
          },
          regions: currentWatchedProvinces.map((province) => ({
            name: province,
            selected: true,
            select: selectStyle,
            itemStyle: {
              areaColor: '#5083fb', // 已观看省份颜色
            }
          }))
        },        
      };
      // 设置点击事件监听器
      chart.on("click", (params) => {
        console.log(params); // params 包含点击省份的所有信息
        if (params.name) {
          setSelectedProvince(params.name); // 设置当前点击的省份
          if (!currentWatchedProvinces.includes(params.name)) {
            setShowVideo(true); // 显示视频播放器
          } else {
            setShowVideo(false); // 显示视频播放器
            toast('该省份已点亮，请选择其他省份', { 
              type: 'success', 
              theme: 'light', 
              autoClose: 2000, 
              toastId: 'watchedProvince',
              className: 'custom-toast'
            });
          }
        }
      });

      // 渲染地图
      chart.setOption(option);

      // 销毁时清理实例
      return () => {
        chart.dispose();
      };
    }
  }, [watchedProvinces]);

  // 视频播放完成后事件处理
  const handleVideoEnd = useCallback(() => {
     // 将省份加入已观看列表
     const currentWatchedProvinces = ls.get('watchedProvinces') as string[] || [];
     const newWatchedProvinces = Array.from(new Set([...currentWatchedProvinces, selectedProvince]));
     try {
      ls.set('watchedProvinces', newWatchedProvinces);
     } catch {
        console.error('Error saving to localStorage:');
     }
     setWatchedProvinces(newWatchedProvinces);
     setShowVideo(false); // 隐藏视频播放器
  }, [selectedProvince]);

  const exportChartAsImage = useCallback(() => {
    const chartInstance = echarts.getInstanceByDom(
      mapRef.current as unknown as HTMLDivElement
    );
    if (chartInstance) {
      const imgData = chartInstance.getDataURL({
        type: "png", // 也可以是 'jpeg'
        pixelRatio: 2,
        backgroundColor: "#fff",
      });

      // 创建一个 <a> 标签用于下载图片
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "map.png";
      link.click();
    }
  },[]);

  const handleAutoVideoPlayFinished = useCallback(() => {
    setShowMap(true);
  }, [])

  return (
    <>
      <AutoVideo type='map' handleVideoEnd={handleAutoVideoPlayFinished}/>
      <SciFiBackground hasNav hidden={!showMap}>
      <div className='map-container'>
        <div ref={mapRef} className="map"/>
        {watchedProvinces.length > 0 && <button onClick={exportChartAsImage} className='share-button'>
          分享点亮地图
        </button>}
      </div>
      <ToastContainer/>
      {/* 播放视频 */}
      {showVideo && (
          <div className='video-fullscreen'>
            <video
              autoPlay
              playsInline
              controls
              // onCanPlayThrough={handleVideoReady} // 视频资源加载完毕
              onEnded={handleVideoEnd}  
            >
              <source src='/v-logs/test.mp4' type="video/mp4" />
              浏览器不支持视频播放
            </video>
          </div>
        )}
      {/* 分享按钮 */}
    </SciFiBackground>
    </>
  );
};

export default Map;
