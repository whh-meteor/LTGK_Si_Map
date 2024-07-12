<template>
  <div id="map" />
</template>

<script>

// import * as Cesium from "cesium/Cesium";
// import widget from "cesium/Widgets/widgets.css";

export default {
  name: 'Home',
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
        selectionIndicator: true // 是否显示指示器组件

      })
      // 激活基于太阳位置的光照
      viewer.scene.globe.enableLighting = true
      // Remove default base layer
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))

      // Add Sentinel-2 imagery
      viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))


      // 使用CZML绘制形状
      const czml = [
        {
          id: 'document',
          name: 'CZML Model',
          version: '1.0'
        },
        {
          id: 'aircraft model',
          name: 'Cesium Air',
          position: {
            cartographicDegrees: [-77, 37, 10000] // 位置：经度，纬度，高度
          },
          model: {
            gltf: '../SampleData/models/CesiumAir/Cesium_Air.glb', // 模型文件路径
            scale: 2.0, // 模型缩放比例
            minimumPixelSize: 128 // 模型最小像素大小
          }
        }
      ]


      var dataSourcePromise = Cesium.CzmlDataSource.load(czml)
      viewer.dataSources.add(dataSourcePromise)
      viewer.zoomTo(dataSourcePromise)
      // 删除模型
      // viewer.dataSources.removeAll()
      // viewer.dataSources.remove()
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