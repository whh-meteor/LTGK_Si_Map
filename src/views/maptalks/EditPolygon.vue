<template>
  <div>
    <!-- 定义一个 div 元素，用于显示地图，设置宽度为100%，高度为800像素 -->
    <div id="map" style="width: 100%; height: 800px;" />
    <div class="pane">
      <!-- 编辑操作面板 -->
      <a href="#" @click.prevent="startEdit">开始编辑</a>
      <a href="#" @click.prevent="endEdit">结束编辑</a>
    </div>
  </div>
</template>

<script>
// 导入 maptalks 库
import * as maptalks from 'maptalks'

export default {
  name: 'MapComponent', // 组件的名称
  data() {
    return {
      polygon: null // 定义地图多边形对象
    }
  },
  mounted() {
    this.initMapTalk() // 在组件挂载后初始化地图
  },
  methods: {
    // 初始化地图
    initMapTalk() {
      var map = new maptalks.Map('map', {
        center: [-0.113049, 51.498568], // 地图中心经纬度
        zoom: 14, // 地图缩放级别
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', // 瓦片地图URL模板
          subdomains: ['a', 'b', 'c', 'd'], // 子域列表
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 地图属性信息
        })
      })

      // 创建多边形对象
      this.polygon = new maptalks.Polygon([
        [
          [-0.131049, 51.498568],
          [-0.107049, 51.498568],
          [-0.107049, 51.493568],
          [-0.131049, 51.493568],
          [-0.131049, 51.498568]
        ]
      ], {
        visible: true, // 设置多边形可见
        editable: true, // 允许编辑多边形
        cursor: 'pointer', // 鼠标样式
        draggable: false, // 禁止拖动
        dragShadow: false, // 拖动时不显示影子
        drawOnAxis: null, // 强制拖动在一个轴上，可以为: x, y
        symbol: {
          'lineColor': '#34495e', // 边线颜色
          'lineWidth': 2, // 边线宽度
          'polygonFill': 'rgb(135,196,240)', // 多边形填充色
          'polygonOpacity': 0.6 // 多边形填充透明度
        }
      })

      // 将多边形添加到矢量图层中
      new maptalks.VectorLayer('vector', this.polygon).addTo(map)

      this.startEdit() // 初始化时开始编辑多边形
    },
    // 开始编辑多边形
    startEdit() {
      this.polygon.startEdit()
    },
    // 结束编辑多边形
    endEdit() {
      this.polygon.endEdit()
    }
  }
}
</script>

<style scoped>
html,
body {
  margin: 0px;
  height: 100%;
  width: 100%;
}

.container {
  width: 100%;
  height: 100%;
}

.pane {
  background: #34495e;
  line-height: 28px;
  color: #fff;
  z-index: 10;
  position: absolute;
  top: 20px;
  right: 20px;
}

.pane a {
  display: block;
  color: #fff;
  text-align: left;
  padding: 0 10px;
  min-width: 28px;
  min-height: 28px;
  float: left;
}
</style>
