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
      // 设置Cesium的默认访问令牌
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'

      // 创建Cesium Viewer实例
      var viewer = new Cesium.Viewer('map', {
        // terrainProvider: Cesium.createWorldTerrain(), // 选择地形提供者
        animation: false, // 是否显示动画控件
        homeButton: true, // 是否显示home键
        geocoder: true, // 是否显示地名查找控件
        baseLayerPicker: true, // 是否显示图层选择控件
        timeline: true, // 是否显示时间线控件
        fullscreenButton: true, // 是否全屏显示
        scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        infoBox: true, // 是否显示点击要素之后显示的信息
        sceneModePicker: true, // 是否显示投影方式控件（三维/二维）
        navigationInstructionsInitiallyVisible: true, // 是否显示初始导航帮助信息
        navigationHelpButton: true, // 是否显示帮助信息控件
        selectionIndicator: true // 是否显示指示器组件
      })
      // Remove default base layer
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // Add Sentinel-2 imagery
      viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))

      // 激活基于太阳位置的光照
      viewer.scene.globe.enableLighting = true

      // 添加红色立方体实体
      var redBox = viewer.entities.add({
        name: '带黑色轮廓的红色立方体',
        position: Cesium.Cartesian3.fromDegrees(-110.0, 40.0, 300000.0),
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      })

      // 添加红色走廊实体
      var redCorridor = viewer.entities.add({
        name: '地面带圆角的红色走廊',
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -100.0, 40.0,
            -105.0, 40.0,
            -105.0, 35.0
          ]),
          width: 200000.0,
          material: Cesium.Color.RED.withAlpha(0.5)
        }
      })

      // 添加绿色走廊实体
      var greenCorridor = viewer.entities.add({
        name: '带黑色轮廓的绿色走廊',
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -90.0, 40.0,
            -95.0, 40.0,
            -95.0, 35.0
          ]),
          height: 100000.0,
          width: 200000.0,
          cornerType: Cesium.CornerType.MITERED,
          material: Cesium.Color.GREEN,
          outline: true // 高度必须设置才能显示轮廓
        }
      })

      // 添加蓝色走廊实体
      var blueCorridor = viewer.entities.add({
        name: '带轮廓的蓝色走廊',
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -80.0, 40.0,
            -85.0, 40.0,
            -85.0, 35.0
          ]),
          height: 200000.0,
          extrudedHeight: 100000.0,
          width: 200000.0,
          cornerType: Cesium.CornerType.BEVELED,
          material: Cesium.Color.BLUE.withAlpha(0.5),
          outline: true, // 必须设置高度或挤出高度才能显示轮廓
          outlineColor: Cesium.Color.WHITE
        }
      })

      // 添加绿色圆形实体
      var greenCircle = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-111.0, 45.0, 150000.0),
        name: '带轮廓的绿色圆形',
        ellipse: {
          semiMinorAxis: 300000.0,
          semiMajorAxis: 300000.0,
          height: 200000.0,
          material: Cesium.Color.GREEN,
          outline: true // 高度必须设置才能显示轮廓
        }
      })

      // 添加红色椭圆实体
      var redEllipse = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-103.0, 45.0),
        name: '表面上的红色椭圆',
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.RED.withAlpha(0.5)
        }
      })

      // 添加蓝色椭圆实体
      var blueEllipse = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-95.0, 45.0, 100000.0),
        name: '带轮廓的蓝色椭圆',
        ellipse: {
          semiMinorAxis: 150000.0,
          semiMajorAxis: 300000.0,
          extrudedHeight: 200000.0,
          rotation: Cesium.Math.toRadians(45),
          material: Cesium.Color.BLUE.withAlpha(0.5),
          outline: true
        }
      })

      // 添加绿色圆柱实体
      var greenCylinder = viewer.entities.add({
        name: '带黑色轮廓的绿色圆柱',
        position: Cesium.Cartesian3.fromDegrees(-100.0, 32.0, 200000.0),
        cylinder: {
          length: 400000.0,
          topRadius: 200000.0,
          bottomRadius: 200000.0,
          material: Cesium.Color.GREEN.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.DARK_GREEN
        }
      })

      // 添加红色锥体实体
      var redCone = viewer.entities.add({
        name: '红色锥体',
        position: Cesium.Cartesian3.fromDegrees(-105.0, 32.0, 200000.0),
        cylinder: {
          length: 400000.0,
          topRadius: 0.0,
          bottomRadius: 200000.0,
          material: Cesium.Color.RED
        }
      })

      // 将视图缩放到所有实体
      viewer.zoomTo(viewer.entities)
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
