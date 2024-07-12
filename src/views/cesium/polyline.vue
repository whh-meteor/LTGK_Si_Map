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
      //  控制视角不转到地下
      viewer.scene.globe.depthTestAgainstTerrain = true
      // Remove default base layer
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // Add Sentinel-2 imagery
      viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))


      const redLine = viewer.entities.add({
        name: "地形红线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 5,
          material: Cesium.Color.RED,
          clampToGround: true,
        },
      });

      const greenRhumbLine = viewer.entities.add({
        name: "绿驼峰线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
          width: 5,
          arcType: Cesium.ArcType.RHUMB,
          material: Cesium.Color.GREEN,
        },
      });

      const glowingLine = viewer.entities.add({
        name: "表面发光的蓝线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            taperPower: 0.5,
            color: Cesium.Color.CORNFLOWERBLUE,
          }),
        },
      });

      const orangeOutlined = viewer.entities.add({
        name:
          "高度和表面呈黑色轮廓的橙色线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            39,
            250000,
            -125,
            39,
            250000,
          ]),
          width: 5,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
          }),
        },
      });

      const purpleArrow = viewer.entities.add({
        name: "高度紫色直箭头",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            43,
            500000,
            -125,
            43,
            500000,
          ]),
          width: 10,
          arcType: Cesium.ArcType.NONE,
          material: new Cesium.PolylineArrowMaterialProperty(
            Cesium.Color.PURPLE
          ),
        },
      });

      const dashedLine = viewer.entities.add({
        name: "蓝色虚线",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75,
            45,
            500000,
            -125,
            45,
            500000,
          ]),
          width: 4,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.CYAN,
          }),
        },
      });

      viewer.zoomTo(viewer.entities);

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
