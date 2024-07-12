<template>
  <div id="map" style="width: 100%; height: 800px;" />
</template>

<script>
import * as maptalks from 'maptalks'
const edgeColor	= '#4682B4'
const polygonColors = ['#C0C0C0', '#87CEFA']
const mapCenter = [106.355, 26.75]
const altitude = 15000
export default {
  name: 'MapComponent',
  data() {
    return {
      polygons: [],
      limitLines: []
    }
  },
  mounted() {
    const map = new maptalks.Map('map', {
      center: [-0.113049, 51.498568],
      zoom: 14,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c']
      })
    })

    map.addLayer([
      // 添加图层或者其他地图元素
    ])
  },
  methods: {
    initMapTalk() {
      const map = new maptalks.Map('mapDom', {
        center: [121.345, 31.2088],
        zoom: 9,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
        })
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
</style>
