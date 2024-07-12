
<template>
  <!-- 定义一个 div 元素，用于显示地图，设置宽度为100%，高度为800像素 -->
  <div id="map" style="width: 100%; height: 800px;" />
</template>

<script>
import * as maptalks from 'maptalks' // 导入 maptalks 库

export default {
  name: 'MapComponent', // 组件的名称
  data() {
    return {
      // 可以在这里定义组件的数据
    }
  },
  mounted() {
    this.initMapTalk() // 在组件挂载后初始化地图
  },
  methods: {
    initMapTalk() {
      // 创建一个新的 maptalks.Map 实例
      var map = new maptalks.Map('map', {
        center: [-0.113049, 51.498568], // 设置地图中心的经纬度坐标
        zoom: 14, // 设置地图的初始缩放级别
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', // 设置瓦片图层的 URL 模板
          subdomains: ['a', 'b', 'c', 'd'], // 设置子域
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 设置版权信息
        })
      })

      // 创建一个新的矢量图层，并添加到地图中
      var layer = new maptalks.VectorLayer('vector').addTo(map)

      // 创建一个绘图工具，初始模式为“点”
      var drawTool = new maptalks.DrawTool({
        mode: 'Point'
      }).addTo(map).disable() // 添加到地图并禁用

      // 监听绘图结束事件
      drawTool.on('drawend', function(param) {
        console.log(param.geometry) // 打印绘制的几何图形
        layer.addGeometry(param.geometry) // 将几何图形添加到矢量图层中
      })

      // 定义工具栏的项目，包括各种绘图模式和功能
      var items = ['Point', 'LineString', 'Polygon', 'Circle', 'Ellipse', 'Rectangle', 'FreeHandLineString', 'FreeHandPolygon'].map(function(value) {
        return {
          item: value, // 项目的名称
          click: function() {
            drawTool.setMode(value).enable() // 设置绘图模式并启用绘图工具
          }
        }
      })

      // 创建一个工具栏并添加到地图中
      var toolbar = new maptalks.control.Toolbar({
        items: [
          {
            item: 'Shape', // 工具栏的主项目
            children: items // 子项目，即各种绘图模式
          },
          {
            item: 'Disable', // 禁用绘图工具的按钮
            click: function() {
              drawTool.disable() // 禁用绘图工具
            }
          },
          {
            item: 'Clear', // 清除矢量图层的按钮
            click: function() {
              layer.clear() // 清空矢量图层
            }
          }
        ]
      }).addTo(map)
    }
  }
}
</script>

<style scoped>
/* 可以添加自定义样式 */
html, body { margin: 0px; height: 100%; width: 100%; }
.container { width: 100%; height: 100%; }
</style>
