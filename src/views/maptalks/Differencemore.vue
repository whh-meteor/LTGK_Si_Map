<template>
  <div>
    <div id="map" style="width: 100%; height: 800px;" />
    <div id="info" />
  </div>

</template>

<script>
import * as turf from '@turf/turf'
import * as maptalks from 'maptalks'
import axios from 'axios' // 导入 axios 库，用于 HTTP 请求
import GeoJSONt1 from '../../../public/json/huangdao2014.json'
import GeoJSONt2 from '../../../public/json/huangdao2024.json'
import { TextMarker } from 'maptalks'

export default {
  name: 'MapComponent',
  data() {
    return {
      label: '',
      json1: null,
      json2: null,
      coordinates: null,
      coordinates2: null,
      multiPoly: null,
      multiPoly2: null,
      intersect: null,
      downloadJSON: {
        IntersectJSON: null,
        ADDJson: null,
        ReduceJSON: null
      }

    }
  },
  mounted() {
    this.initMapTalk()
  },
  methods: {
    initMapTalk() {
      var map = new maptalks.Map('map', {
        center: [120.513049, 36.498568],
        zoom: 9,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
        }),
        layers: [
          new maptalks.VectorLayer('v')
        ]
      })
      window.map = map
      this.ToolBar()
      this.json1 = GeoJSONt1
      this.json2 = GeoJSONt2

      // 加载两个geojson文件到地图中
      // 取出json中的坐标值
    },
    // 控制ToolBar
    ToolBar() {
      var that = this
      new maptalks.control.Toolbar({
        'position': 'top-left',
        'items': [{
          item: '加载Geojson数据',
          click: function () { },
          children: [{
            item: 'T1',
            click: function () { that.AddT1Json() }
          }, {
            item: 'T2',
            click: function () { that.AddT2Json() }
          }]
        }, {
          item: '计算相交',
          click: function () { that.Intersect() }
        }, {
          item: '计算增加',
          click: function () { that.AddLayer() }
        }, {
          item: '计算减少',
          click: function () { that.DesLayer() }
        }, {
          item: '清除图层',
          click: function () { that.ClearLayer() }
        }, {
          item: '下载Geojson数据',
          click: function () { that.handleDownload() }
        }
        ]
      })
        .addTo(window.map)
    },
    // 加载基础数据T1
    AddT1Json() {
      this.coordinates = this.json1.features.map(feature => feature.geometry.coordinates)
      this.multiPoly = turf.multiPolygon(this.coordinates)
      console.log(this.multiPoly)
      new maptalks.VectorLayer('multiPoly', maptalks.GeoJSON.toGeometry(this.multiPoly)).addTo(window.map)
    },
    // 加载基础数据T2
    AddT2Json() {
      this.coordinates2 = this.json2.features.map(feature => feature.geometry.coordinates)
      this.multiPoly2 = turf.multiPolygon(this.coordinates2)
      console.log(this.multiPoly2)
      new maptalks.VectorLayer('multiPoly2', maptalks.GeoJSON.toGeometry(this.multiPoly2)).addTo(window.map).setStyle(
        { 'symbol': this.getSymbol('rgba(135,196,240,0.5)', 0.1, 'T2时刻') })
    },
    // 设置线和面的属性（设置颜色,设置文字）
    getSymbol(colour, opacity, name) {
      return [
        {
          'lineColor': '#2acaff',
          'lineWidth': 1,
          'polygonFill': colour,
          'polygonOpacity': opacity,
          shadowBlur: 1,
          shadowColor: '#c1d9bc',
          shadowOffsetX: -2,
          shadowOffsetY: 1
        },
        {
          'textName': name,
          'textSize': 14,
          'textFill': '#fff'

        }
      ]
    },
    Intersect() {
      // 计算相交部分
      this.intersect = turf.intersect(turf.featureCollection([this.multiPoly, this.multiPoly2]))
      console.log(this.intersect)
      const allPolygonsGeoJSON = []
      for (let i = 0; i < this.intersect.geometry.coordinates.length; i++) {
        // 将相交结果添加到地图上
        // 计算面积
        const polygonGeoJSON = turf.polygon(this.intersect.geometry.coordinates[i])
        const area = turf.area(polygonGeoJSON)
        const layer = new maptalks.VectorLayer('intersect' + [i]).addTo(window.map)
        const polygon = new maptalks.Polygon(this.intersect.geometry.coordinates[i], {
          symbol: {
            lineColor: '#34495e',
            lineWidth: 2,
            polygonFill: 'rgba(255, 255, 0, 0.5)',
            polygonOpacity: 0.4,
            textName: `相交面积: ${area.toFixed(2)} m²`,
            textSize: 14,
            textFill: '#f00',
            textHaloFill: '#fff',
            textHaloRadius: 5
          }
        })
        layer.addGeometry(polygon)
        allPolygonsGeoJSON.push(polygon.toGeoJSON())
        // 保存geojson
        this.downloadJSON.IntersectJSON = JSON.stringify(polygon.toGeoJSON())

      }
      this.downloadJSON.IntersectJSON = allPolygonsGeoJSON
    },
    DesLayer() {
      var difference1 = turf.difference(turf.featureCollection([this.multiPoly, this.intersect]))
      if (difference1) {
        const allPolygonsGeoJSON = []
        for (let i = 0; i < difference1.geometry.coordinates.length; i++) {
          // 将减少结果添加到地图上
          // 计算面积
          const polygonGeoJSON = turf.polygon(difference1.geometry.coordinates[i])
          const area = turf.area(polygonGeoJSON)

          const layer = new maptalks.VectorLayer('difference1' + [i]).addTo(window.map)
          const polygon = new maptalks.Polygon(difference1.geometry.coordinates[i], {
            symbol: {
              lineColor: '#34495e',
              lineWidth: 2,
              polygonFill: 'rgba(0, 0, 255, 0.5)',
              polygonOpacity: 0.4,
              textName: `减少面积: ${area.toFixed(2)} m²`,
              textSize: 14,
              textFill: '#f00',
              textHaloFill: '#fff',
              textHaloRadius: 5
            }
          })
          layer.addGeometry(polygon)
          // this.downloadJSON.ReduceJSON.push(JSON.stringify(polygon.toGeoJSON()))
          allPolygonsGeoJSON.push(polygon.toGeoJSON())
        }
        // 将所有图形的 GeoJSON 存储到 this.downloadJSON.ReduceJSON
        this.downloadJSON.ReduceJSON = allPolygonsGeoJSON
      } else {
        alert('dif 1 null ')
      }
    },

    AddLayer() {
      var difference2 = turf.difference(turf.featureCollection([this.multiPoly2, this.intersect]))
      const allPolygonsGeoJSON = []
      if (difference2) {
        for (let i = 0; i < difference2.geometry.coordinates.length; i++) {
          // 计算面积
          const polygonGeoJSON = turf.polygon(difference2.geometry.coordinates[i])
          const area = turf.area(polygonGeoJSON)

          // 将增加结果添加到地图上
          const layer = new maptalks.VectorLayer('difference2' + [i]).addTo(window.map)
          const polygon = new maptalks.Polygon(difference2.geometry.coordinates[i], {
            symbol: {
              lineColor: '#34495e',
              lineWidth: 2,
              polygonFill: 'rgba(255, 0, 0, 0.5)',
              polygonOpacity: 0.4,
              textName: `增加面积: ${area.toFixed(2)} m²`,
              textSize: 14,
              textFill: '#f00',
              textHaloFill: '#fff',
              textHaloRadius: 5
            }
          })
          layer.addGeometry(polygon)
          allPolygonsGeoJSON.push(polygon.toGeoJSON())
        }

        // 将增加图形的 GeoJSON 存储到 this.downloadJSON.ReduceJSON
        this.downloadJSON.ADDJson = allPolygonsGeoJSON
      } else {
        alert('dif 2 null')
      }
    },

    ClearLayer() {
      var layers = window.map.getLayers()
      layers.forEach(function (layer) {
        window.map.removeLayer(layer)
      })
    },
    // 下载空间分析的geojson数据
    handleDownload() {
      this.downloadGeoJSON(this.downloadJSON.IntersectJSON, '相交部分')
      this.downloadGeoJSON(this.downloadJSON.ADDJson, '增加部分')
      this.downloadGeoJSON(this.downloadJSON.ReduceJSON, '减少部分')
    },
    downloadGeoJSON(data, filename) {
      // 创建一个标准的 GeoJSON FeatureCollection 对象
      const featureCollection = {
        type: 'FeatureCollection',
        features: data
      }
      // 将 FeatureCollection 对象转换为字符串
      const geojsonStr = JSON.stringify(featureCollection)

      // 将 GeoJSON 对象转换为字符串

      // const geojsonStr = JSON.stringify(this.downloadJSON.ReduceJSON).slice(1, -1).replace(/\\"/g, '"')
      console.log(geojsonStr)
      if (geojsonStr) {
        // 创建一个 Blob 对象
        const blob = new Blob([geojsonStr], { type: 'application/json' })

        // 创建一个下载链接
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename + '.geojson'

        // 触发下载
        link.click()

        // 释放 URL 对象
        URL.revokeObjectURL(url)
      } else {
        alert('下载错误')
      }
    }
  }

}

</script>

<style scoped>
/* 可以添加自定义样式 */
#map {
  width: 100%;
  height: 100%;
  background-color: azure;
}

html,
body {
  margin: 0px;
  height: 100%;
  width: 100%
}

.container {
  width: 100%;
  height: 100%
}

.pane {
  background: #34495e;
  line-height: 28px;
  color: #fff;
  z-index: 10;
  position: absolute;
  top: 20px;
  right: 20px
}

.pane a {
  display: block;
  color: #fff;
  text-align: left;
  padding: 0 10px;
  min-width: 28px;
  min-height: 28px;
  float: left
}
</style>
