<template>
  <div id="map-container">
    <div id="map" />
    <GeojsonStylePanel @update-style="applyStyle" />
  </div>
</template>

<script>
import 'maptalks/dist/maptalks.css'
import * as maptalks from 'maptalks'
import GeojsonStylePanel from './GeojsonStylePanel.vue'

export default {
  components: {
    GeojsonStylePanel
  },
  data() {
    return {
      map: null,
      geojsonLayer: null,
      geojsonData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [102.0, 0.0],
                  [103.0, 1.0],
                  [104.0, 0.0],
                  [105.0, 1.0],
                  [102.0, 0.0]
                ]
              ]
            },
            properties: {}
          }
        ]
      }
    }
  },
  mounted() {
    this.initializeMap()
  },
  methods: {
    initializeMap() {
      this.map = new maptalks.Map('map', {
        center: [103.5, 0.5],
        zoom: 5,
        baseLayer: new maptalks.TileLayer('base', {
          urlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c']
        })
      })

      this.geojsonLayer = new maptalks.VectorLayer('geojson', {
        style: {
          symbol: {
            polygonFill: '#ff0000',
            polygonOpacity: 0.5,
            lineColor: '#000000',
            lineWidth: 2
          }
        }
      }).addTo(this.map)

      this.geojsonLayer.addGeometry(maptalks.GeoJSON.toGeometry(this.geojsonData))
    },
    applyStyle(style) {
      if (this.geojsonLayer) {
        this.geojsonLayer.setStyle({
          symbol: {
            polygonFill: style.fillColor,
            polygonOpacity: style.fillOpacity,
            lineColor: style.borderColor,
            lineWidth: style.borderWidth
          }
        })
      }
    }
  }
}
</script>

  <style>
  #map-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  #map {
    width: 100%;
    height: 100%;
  }
  </style>
