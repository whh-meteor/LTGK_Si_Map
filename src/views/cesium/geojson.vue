<template>
  <div id="map" />
</template>

<script>

export default {
  name: 'Geojeson',
  data() {
    return {

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'
      // var viewer = new Cesium.Viewer('map', {
      //   // terrainProvider: Cesium.createWorldTerrain(),
      //   animation: false, // 是否显示动画控件
      //   homeButton: true, // 是否显示home键
      //   geocoder: true, // 是否显示地名查找控件        如果设置为true，则无法查询
      //   baseLayerPicker: true, // 是否显示图层选择控件
      //   timeline: true, // 是否显示时间线控件
      //   fullscreenButton: true, // 是否全屏显示
      //   scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      //   infoBox: true, // 是否显示点击要素之后显示的信息
      //   sceneModePicker: true, // 是否显示投影方式控件  三维/二维
      //   navigationInstructionsInitiallyVisible: true,
      //   navigationHelpButton: true, // 是否显示帮助信息控件
      //   selectionIndicator: true // 是否显示指示器组件

      // })
      // //  控制视角不转到地下
      // viewer.scene.globe.depthTestAgainstTerrain = true
      // // Remove default base layer
      // viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // // Add Sentinel-2 imagery
      // viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))
      var viewer = new Cesium.Viewer('map', {
        // terrainProvider: Cesium.createWorldTerrain(),
        animation: false, // 是否显示动画控件
        homeButton: true, // 是否显示home键
        geocoder: true, // 是否显示地名查找控件        如果设置为true，则无法查询
        baseLayerPicker: true, // 是否显示图层选择控件
        timeline: true, // 是否显示时间线控件
        fullscreenButton: true, // 是否全屏显示
        scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        infoBox: true, // 是否显示点击要素之后显示的信息
        sceneModePicker: true, // 是否显示投影方式控件  三维/二维
        navigationInstructionsInitiallyVisible: true,
        navigationHelpButton: true, // 是否显示帮助信息控件
        selectionIndicator: true, // 是否显示指示器组件
        // 加载天地图
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url:
                'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e',
          layer: 'tdtBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false,
          mininumLevel: 0,
          maximumLevel: 16
        })
      })
      // 加载geojson
      viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/json/ne_10m_us_states.topojson', {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        strokeWidth: 3
      }))

      // 贴出部分代码
      var promise = Cesium.GeoJsonDataSource.load('/json/huangheliuyu.json')
      promise.then(function(dataSource) {
        viewer.dataSources.add(dataSource)
        var entities = dataSource.entities.values
        var colorHash = {}
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i]
          var name = entity.name
          var color = colorHash[name]
          if (!color) {
            color = Cesium.Color.fromRandom({
              alpha: 1.0
            })
            colorHash[name] = color
          }
          entity.polygon.material = color
          entity.polygon.outline = false
          entity.polygon.extrudedHeight = 5000.0
        }
      })
      viewer.flyTo(promise)
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
