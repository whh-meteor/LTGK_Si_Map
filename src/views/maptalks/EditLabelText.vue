<template>
  <!-- 模板部分 -->
  <div>
    <!-- 地图容器，设置宽度为100%，高度为800像素 -->
    <div id="map" style="width: 100%; height: 800px;" />

    <!-- 编辑控制面板，包含开始编辑和结束编辑的链接 -->
    <div class="pane">
      <a href="#" @click.prevent="startEdit">开始编辑</a> <!-- 点击链接调用startEdit方法 -->
      <a href="#" @click.prevent="endEdit">结束编辑</a> <!-- 点击链接调用endEdit方法 -->
    </div>
  </div>
</template>

<script>
import * as maptalks from 'maptalks' // 引入maptalks库

export default {
  name: 'MapComponent',
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
        })
      })

      // 创建一个新的矢量图层，并添加到地图中
      var layer = new maptalks.VectorLayer('v').addTo(map)

      // 创建一个新的Label对象，并添加到矢量图层中
      this.label = new maptalks.Label('在此编辑', [-0.117, 51.496], { // Label的文本和位置
        'textSymbol': { // 文本符号样式
          'textFaceName': 'sans-serif', // 字体名称
          'textFill': '#fff', // 文本颜色
          'textSize': 18 // 文本大小
        },
        'boxStyle': { // 符号框样式
          'padding': [12, 8], // 内边距
          'symbol': { // 符号样式
            'markerType': 'square', // 符号类型为方形
            'markerFillOpacity': 0.9, // 填充不透明度
            'markerLineColor': '#34495e', // 边线颜色
            'markerFill': '#34495e', // 填充颜色
            'markerLineWidth': 1 // 边线宽度
          }
        }
      }).addTo(layer)

      this.startEdit() // 初始化后开始编辑
    },
    startEdit() {
      this.label.startEditText() // 开始编辑Label文本
    },
    endEdit() {
      this.label.endEditText() // 结束编辑Label文本
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

html,
body {
  margin: 0px; /* 去除默认的外边距 */
  height: 100%; /* 设置高度为100% */
  width: 100%; /* 设置宽度为100% */
}

.container {
  width: 100%; /* 宽度为100% */
  height: 100%; /* 高度为100% */
}

.pane {
  background: #34495e; /* 面板背景颜色 */
  line-height: 28px; /* 行高 */
  color: #fff; /* 字体颜色 */
  z-index: 10; /* 层叠顺序 */
  position: absolute; /* 绝对定位 */
  top: 20px; /* 距顶部20像素 */
  right: 20px; /* 距右侧20像素 */
}

.pane a {
  display: block; /* 块级元素 */
  color: #fff; /* 链接字体颜色 */
  text-align: left; /* 文本左对齐 */
  padding: 0 10px; /* 内边距 */
  min-width: 28px; /* 最小宽度 */
  min-height: 28px; /* 最小高度 */
  float: left; /* 左浮动 */
}
</style>
