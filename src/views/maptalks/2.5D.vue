 <template>
  <!-- 定义一个 id 为 'map' 的 div 元素，它将占据容器的全部宽度和高度 -->
  <div id="map" style="width: 100%; height: 800px;" />
</template>

<script>
import * as maptalks from 'maptalks' // 导入 maptalks 库，用于地图功能
import axios from 'axios' // 导入 axios 库，用于 HTTP 请求

// 定义边界颜色，多边形颜色，地图中心和海拔高度的常量
const edgeColor = '#4682B4'
const polygonColors = ['#C0C0C0', '#87CEFA']
const mapCenter = [106.355, 26.75]
const altitude = 15000

export default {
  name: 'MapComponent',
  data() {
    return {
      polygons: [], // 存储多边形对象
      limitLines: [], // 存储限制线对象
      mapDom: '' // 存储地图 DOM 元素
    }
  },
  mounted() {
    this.initMapTalk() // 初始化地图
    this.drawRegion() // 绘制区域
    this.drawWall() // 绘制边界
  },
  methods: {
    initMapTalk() {
      // 定义地图 URL 模板
      const url = 'https://api.mapbox.com/styles/v1/ling13/cjpv0upr10vc52sodrbmtrmrb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGluZzEzIiwiYSI6ImNqbHozcGRwZDBzMHIzcXBqNXV2dGR4dHAifQ.32-e7GIttC0FriVwvJ0GqA#6.1/27.044989/106.588086/0'
      this.mapDom = new maptalks.Map('map', {
        center: mapCenter, // 设置地图中心
        zoom: 7, // 设置缩放级别
        pitch: 45, // y 方向倾斜角度
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: url,
          subdomains: ['a', 'b', 'c', 'd'],
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
        })
      })
    },
    drawLimitLines(idx, coordinates, properties) {
      // 创建多线字符串对象用于绘制限制线
      const outLine = new maptalks.MultiLineString(coordinates, {
        symbol: {
          lineColor: edgeColor,
          lineWidth: 1,
          textPlacement: 'vertex'
        },
        properties: {
          altitude: altitude,
          index: idx,
          id: properties.id,
          properties: properties
        }
      })
      this.limitLines.push(outLine) // 将限制线对象添加到数组中
    },
    drawBorderLines(coordinates, properties) {
      // 创建多线字符串对象用于绘制边界线
      const outLine = new maptalks.MultiLineString(coordinates, {
        symbol: {
          lineColor: edgeColor,
          lineWidth: 1,
          textPlacement: 'vertex'
        },
        properties: {
          altitude: altitude,
          id: properties.id,
          properties: properties
        }
      })
      this.limitLines.push(outLine) // 将边界线对象添加到数组中
    },
    drawPolygons(idx, coordinates, properties) {
      // 创建多边形对象
      const polygon = new maptalks.MultiPolygon(coordinates, {
        symbol: {
          lineWidth: 1,
          lineColor: edgeColor,
          polygonFill: polygonColors[0],
          polygonOpacity: 0.5
        },
        properties: {
          altitude: altitude,
          id: properties.id,
          index: idx,
          properties: properties
        }
      })
        // 鼠标进入多边形时改变填充颜色
        .on('mouseenter', function(e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[1]
          })
        })
        // 鼠标离开多边形时恢复填充颜色
        .on('mouseout', function(e) {
          e.target.updateSymbol({
            polygonFill: polygonColors[0]
          })
        })
      this.polygons.push(polygon) // 将多边形对象添加到数组中
    },
    drawRegion() {
      const self = this
      // 从指定 URL 获取 JSON 数据
      axios.get('/json/guizhou.json')
        .then(response => {
          const mapData = response.data
          const features = mapData.features
          features.forEach((g, i) => {
            const properties = g.properties
            const coordinates = g.geometry.coordinates
            self.drawPolygons(i, coordinates, properties) // 绘制多边形
          })
          // 创建矢量图层并将多边形添加到图层中
          const polygonsLayer = new maptalks.VectorLayer(
            'vector-polygon',
            self.polygons,
            {
              enableAltitude: true
            }
          ).addTo(self.mapDom)
        })
        .catch(error => {
          console.error('获取 JSON 数据时出错:', error)
        })
    },
    drawWall() {
      const self = this
      // 从指定 URL 获取边界 JSON 数据
      axios.get('/json/guizhou-border.json')
        .then(response => {
          const borderMapData = response.data
          const borderFeatures = borderMapData.features[0]
          const properties = borderFeatures.properties
          const pathCoordinates = borderFeatures.geometry.coordinates.map(d => { return d[0] })
          self.drawBorderLines(pathCoordinates, properties) // 绘制边界线
          // 创建矢量图层并将限制线添加到图层中
          const limitLinesLayer = new maptalks.VectorLayer(
            'vector-line',
            self.limitLines,
            {
              enableAltitude: true,
              drawAltitude: {
                polygonFill: edgeColor,
                polygonOpacity: 0.3,
                lineWidth: 0
              }
            }
          ).addTo(self.mapDom)
        })
        .catch(error => {
          console.error('获取 JSON 数据时出错:', error)
        })
    }
  }
  // drawRegion() {
  //   const self = this
  //   $.getJSON('guizhou.json', '', function(mapData) {
  //     const features = mapData.features
  //     features.forEach((g, i) => {
  //       const properties = g.properties
  //       const coordinates = g.geometry.coordinates
  //       self.drawPolygons(i, coordinates, properties)
  //     })
  //     const polygonsLayer = new maptalks.VectorLayer(
  //       'vector-polygon',
  //       self.polygons,
  //       {
  //         enableAltitude: true
  //       }
  //     ).addTo(self.mapDom)
  //   })
  // },
  // drawWall() {
  //   const self = this
  //   $.getJSON('guizhou-border.json', '', function(borderMapData) {
  //     const borderFeatures = borderMapData.features[0]
  //     const properties = borderFeatures.properties
  //     const pathCoordinates = borderFeatures.geometry.coordinates.map(d => { return d[0] })
  //     self.drawBorderLines(pathCoordinates, properties)
  //     const limitLinesLayer = new maptalks.VectorLayer(
  //       'vector-line',
  //       self.limitLines,
  //       {
  //         enableAltitude: true,
  //         drawAltitude: {
  //           polygonFill: edgeColor,
  //           polygonOpacity: 0.3,
  //           lineWidth: 0
  //         }
  //       }
  //     ).addTo(self.mapDom)
  //   })
  // }
}

</script>

<style scoped>
/* 可以添加自定义样式 */
#map {
    width: 100%;
    height: 100%;
    background-color: azure;
}
</style>