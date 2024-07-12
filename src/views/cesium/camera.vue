<template>
  <div id="map" />
</template>

<script>

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
      // Remove default base layer
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // Add Sentinel-2 imagery
      viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))

      //  控制视角不转到地下
      viewer.scene.globe.depthTestAgainstTerrain = true
      // 第一种setView
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.435314, 39.960521, 15000.0), // 设置位置

        orientation: {
          heading: Cesium.Math.toRadians(20.0), // 方向
          pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
          roll: 0
        }
      })
      // or
      viewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0), // west, south, east, north
        orientation: {
          heading: Cesium.Math.toRadians(20.0), // 方向
          pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
          roll: 0
        }
      })

      // 第二种方式，flyto
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.435314, 39.960521, 15000.0), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(20.0), // 方向
          pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
          roll: 0
        },
        duration: 5, // 设置飞行持续时间，默认会根据距离来计算
        complete: function () {
          // 到达位置后执行的回调函数
          alert("到达位置")
        },
        cancle: function () {
          alert("取消飞行")
        },
        pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        maximumHeight: 5000, // 相机最大飞行高度
        flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度(这个，很好用)
      });

      // 第三种方式lookAt
      var center = Cesium.Cartesian3.fromDegrees(116.435314, 39.960521)// camera视野的中心点坐标
      var heading = Cesium.Math.toRadians(50.0)
      var pitch = Cesium.Math.toRadians(-20.0)
      var range = 5000.0
      viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range))
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
