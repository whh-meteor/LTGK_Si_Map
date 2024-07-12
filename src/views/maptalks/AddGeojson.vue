<template>
  <div>
    <div id="map" style="width: 100%; height: 800px;" />

  </div>

</template>

<script>
import * as maptalks from 'maptalks'
import axios from 'axios' // 导入 axios 库，用于 HTTP 请求
export default {
  name: 'MapComponent',
  data() {
    return {
      label: ''
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

      // 外部json加载
      axios.get('/json/huangheliuyu.json')
        .then(response => {
          const jsondata = response.data.features[0]

          var marker = maptalks.GeoJSON.toGeometry(jsondata).addTo(map.getLayer('v'))
        })
        .catch(error => {
          console.error('获取 JSON 数据时出错:', error)
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
