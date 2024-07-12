<template>
  <!-- 模板部分 -->
  <div>
    <!-- 地图容器，设置宽度为100%，高度为800像素 -->
    <div id="map" class="container" style="width: 100%; height: 800px;" />
    <!-- 信息显示区域 -->
    <div id="info" />
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
        center: [-0.113049, 51.498568], // 地图中心点坐标（伦敦）
        zoom: 14, // 地图缩放级别
        baseLayer: new maptalks.TileLayer('base', { // 添加瓦片图层作为地图的基础图层
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', // 瓦片图层的URL模板
          subdomains: ['a', 'b', 'c', 'd'], // 子域名，用于负载均衡
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 版权信息
        }),
        layers: [
          new maptalks.VectorLayer('v') // 添加一个矢量图层
        ]
      })

      // 创建一个新的Marker对象，并添加到矢量图层中
      var marker = new maptalks.Marker([-0.113049, 51.498568], { // Marker的坐标
        'properties': {
          'name': 'point marker' // Marker的属性
        }
      }).addTo(map.getLayer('v')) // 将Marker添加到矢量图层中

      // 将Marker的GeoJSON信息显示在info区域
      document.getElementById('info').innerHTML = JSON.stringify(marker.toGeoJSON())
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
