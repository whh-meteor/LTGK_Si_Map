<template>
  <!-- 模板部分 -->
  <div>
    <!-- 地图容器，设置宽度为100%，高度为800像素 -->
    <div id="map" class="container" style="width: 100%; height: 800px;" />
  </div>
</template>

<script>
import * as maptalks from 'maptalks'

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
        center: [0, 0], // 地图中心点坐标
        zoom: 2, // 地图缩放级别
        baseLayer: new maptalks.TileLayer('tile', { // 添加瓦片图层作为地图的基础图层
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', // 瓦片图层的URL模板
          subdomains: ['a', 'b', 'c', 'd'], // 子域名，用于负载均衡
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 版权信息
        })
      })

      // 创建一个新的矢量图层，并添加到地图中
      var layer = new maptalks.VectorLayer('v').addTo(map)
      
      // 获取人口数据的JSON文件，并将数据加载到地图上
      fetch('/json/population.json').then(function(res) { return res.json() }).then(function(json) {
        var points = [] // 用于存储点数据的数组
        var max = -Infinity // 初始化最大值
        json.forEach(function(d) {
          var x = d[0]; var y = d[1]; var value = d[2] // 从数据中提取经度、纬度和值
          max = Math.max(value, max) // 更新最大值
          
          // 创建一个新的Marker对象
          var point = new maptalks.Marker([x, y], {
            properties: {
              value: value // 设置Marker的属性值
            },
            symbol: {
              markerWidth: 2, // Marker的宽度
              markerHeight: 2, // Marker的高度
              markerType: 'ellipse', // Marker的类型
              markerFill: { // Marker的填充样式
                type: 'color-interpolate', // 根据属性值进行颜色插值
                property: 'value', // 插值的属性
                stops: [
                  [0, 'green'], // 0值对应绿色
                  [50, 'yellow'], // 50值对应黄色
                  [360, 'red'] // 360值对应红色
                ]
              },
              markerLineWidth: 0 // Marker的边线宽度
            }
          })
          points.push(point) // 将Marker添加到数组中
        })
        layer.addGeometry(points) // 将所有Marker添加到矢量图层中
        console.log(max) // 在控制台输出最大值
      })
    }
  }
}
</script>

<style scoped>
/* 可以添加自定义样式 */
#map {
    width: 100%;
    height: 100%;
    background-color: azure; /* 地图容器背景颜色 */
}

html,
body {
    margin: 0px; /* 去除默认的外边距 */
    height: 100%; /* 设置高度为100% */
    width: 100%; /* 设置宽度为100% */
}

.container {
    float: left; /* 浮动布局 */
    width: 100%; /* 宽度为100% */
    height: 100%; /* 高度为100% */
}

#info {
    position: fixed; /* 固定定位 */
    background-color: rgba(13, 13, 13, 0.5); /* 半透明背景颜色 */
    padding: 10px 10px 10px 10px; /* 内边距 */
    font: 13px bold sans-serif; /* 字体样式 */
    color: #fff; /* 字体颜色 */
    left: 0px; /* 左边距离 */
    top: 0px; /* 顶部距离 */
    width: 100%; /* 宽度为100% */
    height: 70px; /* 高度为70像素 */
    overflow: hidden; /* 隐藏溢出内容 */
}
</style>
