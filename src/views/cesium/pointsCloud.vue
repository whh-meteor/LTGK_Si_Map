<template>
  <div>
    <!-- 地图容器 -->
    <div id="map" />
  </div>
</template>

<script>
import { point, bearing, distance, destination } from '@turf/turf'
import * as d3 from 'd3-delaunay'

export default {
  name: 'Home',
  data() {
    return {
      viewer: null, // Cesium Viewer实例
      entity: null // 地图上的实体
    }
  },
  mounted() {
    this.init() // 组件挂载后初始化地图
  },
  methods: {
    init() {
     // 设置Cesium默认的Ion访问令牌
     Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'

      this.viewer = new Cesium.Viewer('map', {
        terrainProvider: Cesium.createWorldTerrain({
          requestWaterMask: true,
          requestVertexNormals: true
        })
      })
      this.viewer.scene.globe.depthTestAgainstTerrain = true
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000
      this.viewer.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z
      this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false

      this.entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120, 33),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10
        }
      })
      this.addGeological('/json/T8_Trans.geojson')
    },

    addGeological(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const points = data.features.map(feature => ({
            coordinates: feature.geometry.coordinates,
            position: Cesium.Cartesian3.fromDegrees(
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[2] * -1
            )
          }))

          const delaunay = d3.Delaunay.from(points.map(p => p.coordinates))
          const interpolatedPoints = []

          for (let triangle of delaunay.trianglePolygons()) {
            const [a, b, c] = triangle
            const midpointAB = this.interpolate(a, b)
            const midpointBC = this.interpolate(b, c)
            const midpointCA = this.interpolate(c, a)

            interpolatedPoints.push(a, b, c, midpointAB, midpointBC, midpointCA)
          }

          const pointCollection = new Cesium.PointPrimitiveCollection()
          this.viewer.scene.primitives.add(pointCollection)

          interpolatedPoints.forEach(coords => {
            // if (!this.isValidCoordinate(coords)) {
            //   console.error('Invalid coordinate detected:', coords)
            //   return
            // }
            const position = Cesium.Cartesian3.fromDegrees(coords[0], coords[1], coords[2] * -1)
            pointCollection.add(new Cesium.PointPrimitive({
              position: position,
              color: Cesium.Color.GREEN,
              pixelSize: 1
            }))
          })
        })
    },

    interpolate(a, b) {
      const p1 = point(a)
      const p2 = point(b)
      const dist = distance(p1, p2)
      const bear = bearing(p1, p2)
      const mid = destination(p1, dist / 2, bear)
      return mid.geometry.coordinates
    },

    isValidCoordinate(coords) {
      return (
        Array.isArray(coords) &&
        coords.length === 3 &&
        !isNaN(coords[0]) &&
        !isNaN(coords[1]) &&
        !isNaN(coords[2]) &&
        coords[0] >= -180 && coords[0] <= 180 &&
        coords[1] >= -90 && coords[1] <= 90
      )
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  background-color: azure;
}
</style>
