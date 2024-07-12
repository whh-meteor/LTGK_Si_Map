<template>
  <!-- 定义一个 id 为 'map' 的 div 元素，它将占据容器的全部宽度和高度 -->
  <div id="map" style="width: 100%; height: 800px;" />
</template>

<script>
import * as maptalks from 'maptalks' // 导入 maptalks 库，用于地图功能
import axios from 'axios' // 导入 axios 库，用于 HTTP 请求

// 定义边界颜色、多边形颜色，地图中心和海拔高度的常量
const edgeColor = '#4682B4'
const polygonColors = ['#C0C0C0', '#87CEFA']
const mapCenter = [-0.113049, 51.498568]
const altitude = 15000

export default {
  name: 'MapComponent',
  data() {
    return {
      polygons: [], // 存储多边形对象
      limitLines: [], // 存储限制线对象
      map: '' // 存储地图 DOM 元素
    }
  },
  mounted() {
    // 组件挂载后初始化地图
    this.initMapTalk()
  },
  methods: {
    initMapTalk() {
      // 定义地图 URL 模板
      const url = 'https://api.mapbox.com/styles/v1/ling13/cjpv0upr10vc52sodrbmtrmrb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGluZzEzIiwiYSI6ImNqbHozcGRwZDBzMHIzcXBqNXV2dGR4dHAifQ.32-e7GIttC0FriVwvJ0GqA#6.1/27.044989/106.588086/0'
      this.map = new maptalks.Map('map', {
        center: mapCenter, // 设置地图中心
        zoom: 14, // 设置缩放级别
        pitch: 45, // y 方向倾斜角度
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: url, // URL 模板
          subdomains: ['a', 'b', 'c', 'd'], // 子域名
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 版权信息
        })
      })

      // 创建一个动画粒子圆层
      var particles = new maptalks.ParticleLayer('c', {
        'forceRenderOnMoving': true // 移动时强制渲染
      })

      var center = this.map.getCenter() // 获取地图中心
      // 设置圆的半径（以米为单位）
      var radius = 1000

      // 定义粒子获取方法
      particles.getParticles = function(t) {
        var point = this.map.coordinateToContainerPoint(center) // 将坐标转换为容器点
        // 计算当前时间的粒子角度
        var angle = (t / 16 % 360) * Math.PI / 180
        // 将距离转换为像素长度
        var pxLen = this.map.distanceToPixel(radius, radius)
        var r = pxLen.width
        // 计算从圆心到粒子的像素偏移
        var x = r * Math.cos(angle)
        var y = r * Math.sin(angle)
        return [
          {
            point: point.add(x, y), // 粒子位置
            r: 4, // 粒子半径
            color: 'rgb(0,255,0)' // 粒子颜色
          }
        ]
      }

      // 将粒子层添加到地图中
      this.map.addLayer(particles)

      // 创建并添加十字标记
      new maptalks.Marker(center, {
        symbol: {
          markerType: 'cross', // 标记类型
          markerWidth: 10, // 标记宽度
          markerHeight: 10, // 标记高度
          markerLineWidth: 2 // 标记线宽
        }
      }).addTo(this.map.getLayer('v'))

      // 创建并添加圆形
      new maptalks.Circle(center, 1000, {
        symbol: {
          lineColor: '#fff', // 线颜色
          lineWidth: 6, // 线宽
          lineOpacity: 0.2, // 线透明度
          polygonOpacity: 0 // 多边形透明度
        }
      }).addTo(this.map.getLayer('v'))
    },
    drawLimitLines(idx, coordinates, properties) {
      // 创建多线字符串对象用于绘制限制线
      const outLine = new maptalks.MultiLineString(coordinates, {
        symbol: {
          lineColor: edgeColor, // 线颜色
          lineWidth: 1, // 线宽
          textPlacement: 'vertex' // 文本位置
        },
        properties: {
          altitude: altitude, // 海拔高度
          index: idx, // 索引
          id: properties.id, // 属性 ID
          properties: properties // 其他属性
        }
      })
      // 将限制线对象添加到数组中
      this.limitLines.push(outLine)
    }
  }
}
</script>

<style scoped>
/* 可以添加自定义样式 */
#map {
  width: 100%;
  height: 100%;
  background-color: azure; /* 背景颜色 */
}
</style>
