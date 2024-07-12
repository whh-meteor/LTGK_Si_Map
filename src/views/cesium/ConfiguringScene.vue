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
        selectionIndicator: true, // 是否显示指示器组件

      })
      //激活基于太阳位置的光照
      viewer.scene.globe.enableLighting = true
      //创建初始相机视图
      // Remove default base layer
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // Add Sentinel-2 imagery
      viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))

      var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
      var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
      var homeCameraView = {
        destination: initialPosition,
        orientation: {
          heading: initialOrientation.heading,
          pitch: initialOrientation.pitch,
          roll: initialOrientation.roll
        }
      };
      // Set the initial view
      viewer.scene.camera.setView(homeCameraView)

      //添加一些相机飞行动画选项

      homeCameraView.duration = 2.0;
      homeCameraView.maximumHeight = 2000;
      homeCameraView.pitchAdjustHeight = 2000;
      homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
      // 覆盖默认主页按钮
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;
        viewer.scene.camera.flyTo(homeCameraView);
      })
      //设置时钟和时间轴。
      viewer.clock.shouldAnimate = true; // 当观看者开始时播放动画
      viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
      viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
      viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
      viewer.clock.multiplier = 2; // 设置加速
      viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // 勾选计算模式
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
      viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // 设置可见范围
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
