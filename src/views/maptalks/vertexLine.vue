<template>
  <!-- 模板部分 -->
  <div>
    <!-- 地图容器，设置宽度为100%，高度为800像素 -->
    <div id="map" class="container" style="width: 100%; height: 800px;" />
  </div>
</template>

<script>
import * as maptalks from 'maptalks' // 引入maptalks库

export default {
  name: 'MapComponent', // 组件名称
  data() {
    return {
      label: '' // 数据部分，定义一个label变量
    }
  },
  mounted() {
    this.initMapTalk() // 组件挂载完成后调用initMapTalk方法初始化地图
  },
  methods: {
    initMapTalk() {
      // 创建一个新的maptalks地图对象
      var map = new maptalks.Map('map', {
        center: [2.3039431874999536, 50.97239313116968], // 地图中心点坐标
        zoom: 7, // 地图缩放级别
        baseLayer: new maptalks.TileLayer('base', { // 添加瓦片图层作为地图的基础图层
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', // 瓦片图层的URL模板
          subdomains: ["a", "b", "c", "d"], // 子域名，用于负载均衡
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 版权信息
        })
      });

      // 创建一个新的矢量图层，并添加到地图中
      var layer = new maptalks.VectorLayer('vector').addTo(map);

      // 创建一个新的LineString对象，并添加到矢量图层中
      var line = new maptalks.LineString(
        [
          [4.460010082031204, 50.41204897711654], // 点1坐标
          [3.7129397695312036, 51.05869036408862], // 点2坐标
          [3.2295413320312036, 51.20347195727524], // 点3坐标
          [1.0872073476562036, 51.27225609350862], // 点4坐标
          [-0.15424773046879636, 51.5053534272480] // 点5坐标
        ],
        {
          symbol: { // 线的样式
            'lineColor': '#1bbc9b', // 线的颜色
            'lineWidth': 3, // 线的宽度
            'lineDasharray': [10, 10], // 虚线样式
            'markerFile': '/img/Airplane.png', // 标记图像文件路径
            'markerPlacement': 'vertex', // 标记放置位置，顶点
            'markerVerticalAlignment': 'middle', // 标记垂直对齐方式
            'markerWidth': 64, // 标记宽度
            'markerHeight': 64 // 标记高度
          }
        }
      ).addTo(layer); // 将LineString添加到矢量图层中
    }
  }
}
</script>

<style scoped>
/* 可以添加自定义样式 */
#map {
  width: 100%; /* 地图容器宽度 */
  height: 100%; /* 地图容器高度 */
  background-color: azure; /* 地图容器背景颜色 */
}

html, body {
  margin: 0px; /* 去除默认的外边距 */
  height: 100%; /* 设置高度为100% */
  width: 100%; /* 设置宽度为100% */
}

.container {
  float: left; /* 左浮动布局 */
  width: 100%; /* 宽度为100% */
  height: 100%; /* 高度为100% */
}

#info {
  position: fixed; /* 固定定位 */
  background-color: rgba(13, 13, 13, 0.5); /* 半透明背景颜色 */
  padding: 10px 10px 10px 10px; /* 内边距 */
  font: 13px bold sans-serif; /* 字体样式 */
  color: #fff; /* 字体颜色 */
  left: 0px; /* 距左边0像素 */
  top: 0px; /* 距顶部0像素 */
  width: 100%; /* 宽度为100% */
  height: 70px; /* 高度为70像素 */
  overflow: hidden; /* 隐藏溢出内容 */
}
</style>
