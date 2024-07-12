<template>
  <div id="map"  class="container" style="width: 100%; height: 800px;" />

</template>

<script>
import * as maptalks from 'maptalks'

export default {
  name: 'MapComponent',
  data() {
    return {
      polygons: [],
      limitLines: []
    }
  },
  mounted() {
    this.initMapTalk()
  },
  methods: {
    initMapTalk() {
      var arcUrl = 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'

      maptalks.SpatialReference.loadArcgis(arcUrl + '?f=pjson', function(err, conf) {
        if (err) {
          throw new Error(err)
        }
        var ref = conf.spatialReference
        ref.projection = 'EPSG:3857'
        ref.fullExtent = null
        var map = new maptalks.Map('map', {
          center: [121, 0],
          zoom: 1,
          minZoom: 1,
          maxZoom: 16,
          spatialReference: ref,
          baseLayer: new maptalks.TileLayer('base', {
            'tileSystem': conf.tileSystem,
            'tileSize': conf.tileSize,
            'urlTemplate': arcUrl + '/tile/{z}/{y}/{x}',
            'attribution': '&copy; <a target="_blank" href="' + arcUrl + '"">ArcGIS</a>'
          })
        })
      })
    }
  }
}
</script>

<style scoped>
/* 可以添加自定义样式 */
html,body{margin:0px;height:800px;width:100%}
  
</style>
