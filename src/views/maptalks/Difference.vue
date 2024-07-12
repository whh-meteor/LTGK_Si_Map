<template>
  <div>
    <div id="map" style="width: 100%; height: 800px;" />

  </div>

</template>

<script>
import * as turf from '@turf/turf'
import * as maptalks from 'maptalks'
import axios from 'axios' // 导入 axios 库，用于 HTTP 请求
export default {
  name: 'MapComponent',
  data() {
    return {
      label: '',
      jsondata: null,
      jsondata2: null
    }
  },
  mounted() {
    this.initMapTalk()
  },
  methods: {
    initMapTalk() {
      var map = new maptalks.Map('map', {
        center: [110.113049, 37.498568],
        zoom: 4,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
        }),
        layers: [
          new maptalks.VectorLayer('v')
        ]
      })

      //     // 外部json加载
      // axios.get('/json/huangheliuyu.json')
      //       .then(response => {
      //         console.log(response.data)
      //         console.log(response.data.features[0])
      //         window.jsondata = response.data

      //         // var marker = maptalks.GeoJSON.toGeometry(that.jsondata.features[0]).addTo(map.getLayer('v'))
      //       })
      //       .catch(error => {
      //         console.error('获取 JSON 数据时出错:', error)
      //       })
      //     axios.get('/json/huangheliuyuEdit.json')
      //       .then(response => {
      //         window.jsondata2 = response.data

      //         // var marker = maptalks.GeoJSON.toGeometry(that.jsondata2.features[0]).addTo(map.getLayer('v'))
      //       })
      //       .catch(error => {
      //         console.error('获取 JSON2 数据时出错:', error)
      //       })
      //左
      var json2 = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'coordinates': [
                [
                  [
                    120.34730433193238,
                    35.683223094723346
                  ],
                  [
                    122.48476054965408,
                    36.742912930271956
                  ],
                  [
                    123.87122142542114,
                    38.12329290512454
                  ],
                  [
                    124.30357731750513,
                    39.26401523112375
                  ],
                  [
                    119.46675183393467,
                    39.1156235884207
                  ],
                  [
                    120.34730433193238,
                    35.683223094723346
                  ]
                ]
              ],
              'type': 'Polygon'
            }
          }
        ]
      }
      // 右
      var json1 = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'coordinates': [
                [
                  [
                    124.18747895245372,
                    38.00883233250596
                  ],
                  [
                    120.93373776444798,
                    39.02907197543499
                  ],
                  [
                    120.49848386566384,
                    36.89504124510556
                  ],
                  [
                    123.11296151809455,
                    33.740610350502635
                  ],
                  [
                    125.98885090740714,
                    35.90683127085957
                  ],
                  [
                    126.02762938554633,
                    38.21190550950388
                  ],
                  [
                    124.18747895245372,
                    38.00883233250596
                  ]
                ]
              ],
              'type': 'Polygon'
            }
          }
        ]
      }
      // 加载两个geojson文件
      maptalks.GeoJSON.toGeometry(json1.features[0]).addTo(map.getLayer('v'))
      maptalks.GeoJSON.toGeometry(json2.features[0]).addTo(map.getLayer('v'))
      //分别获取坐标
      const coordinates1 = json1.features[0].geometry.coordinates
      const coordinates2 = json2.features[0].geometry.coordinates
      // 构造图形
      var polygon1 = turf.polygon(coordinates1, {
        'fill': '#F00',
        'fill-opacity': 0.1
      })
      var polygon2 = turf.polygon(coordinates2, {
        'fill': '#00F',
        'fill-opacity': 0.1
      })
      // 计算相交部分
      var intersect = turf.intersect(turf.featureCollection([polygon1, polygon2]))
      console.log(intersect)

      // 将相交结果添加到地图上
      const layer = new maptalks.VectorLayer('vector').addTo(map)
      const polygon = new maptalks.Polygon(intersect.geometry.coordinates, {
        symbol: {
          lineColor: '#34495e',
          lineWidth: 2,
          polygonFill: 'rgba(255, 255, 0, 0.5)',
          polygonOpacity: 0.4
        }
      })
      layer.addGeometry(polygon)

      var difference1 = turf.difference(turf.featureCollection([polygon1, intersect]));
      var difference2 = turf.difference(turf.featureCollection([polygon2, intersect]));
      const addLayer = new maptalks.Polygon(difference1.geometry.coordinates, {
        symbol: {
          lineColor: '#34495e',
          lineWidth: 2,
          polygonFill: 'rgba(255, 0, 255, 0.5)',
          polygonOpacity: 0.4
        }
      })
      layer.addGeometry(addLayer)
      const Sublayer = new maptalks.Polygon(difference2.geometry.coordinates, {
        symbol: {
          lineColor: '#34495e',
          lineWidth: 2,
          polygonFill: 'rgba(0, 255, 255, 0.5)',
          polygonOpacity: 0.4
        }
      })
      layer.addGeometry(Sublayer)
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
