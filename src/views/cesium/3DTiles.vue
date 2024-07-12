<template>
  <div>
    <div id="map" />
    <div id="getposition">
      <div id="getposition">
        <input type="button" value="x+" @click="change(0)">
        <input type="button" value="x-" @click="change(1)">
        <input type="button" value="y+" @click="change(2)">
        <input type="button" value="y-" @click="change(3)">
        <input type="button" value="z+" @click="change(4)">
        <input type="button" value="z-" @click="change(5)">
        <br>
        <input type="button" value="1" @click="changeStep(1)">
        <input type="button" value="10" @click="changeStep(10)">
        <input type="button" value="100" @click="changeStep(100)">
        <br>
        <input type="button" value="vi" @click="changeVisible">
        <div id="result" style="background: white;">{{ result }}</div>
      </div>
    </div>
  </div>
</template>

<script>

// import * as Cesium from "cesium/Cesium";
// import widget from "cesium/Widgets/widgets.css";

export default {
  name: 'Home',
  data() {
    return {
      viewer: null,
      tileset: null,
      boundingSphere: null,
      x: 360.0,
      y: -920.0,
      z: -820.0,
      step: 10,
      result: 'x:360.0 y:-920.0 z:-820.0'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'
      // Construct the default list of terrain sources.
      var terrainModels = Cesium.createDefaultTerrainProviderViewModels()

      this.viewer = new Cesium.Viewer('map', {
        terrainProvider: Cesium.createWorldTerrain(),
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
      this.viewer.scene.globe.depthTestAgainstTerrain = false
      // Remove default base layer
      this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0))
      // Add Sentinel-2 imagery
      this.viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))

      var boundingSphere = new Cesium.BoundingSphere(
        Cesium.Cartesian3.fromDegrees(111.5652101, 38.70350851, 100.500143),
        143.6271004
      )

      this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener(commandInfo => {
        this.viewer.camera.flyToBoundingSphere(boundingSphere)
        commandInfo.cancel = true
      })

      this.viewer.camera.flyToBoundingSphere(boundingSphere, { duration: 0 })

      var m = Cesium.Matrix4.fromArray([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        this.x, this.y, this.z, 1.0
      ])

      this.tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: 'Scene/testm3DTiles.json',
        maximumScreenSpaceError: 2, // 最大屏幕误差
        maximumNumberOfLoadedTiles: 1000, // 加载最大瓦片个数
        modelMatrix: m // 方法一,动态修改modelMatrix
      }))

      this.tileset.readyPromise.then(this.zoomToTileset)
    },
    zoomToTileset() {
      this.boundingSphere = this.tileset.boundingSphere
      this.viewer.camera.viewBoundingSphere(this.boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0))
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)

      this.changeHeight(0) // 固定模型位置
    },
    changeStep(step) {
      this.step = step
    },
    change(type) {
      switch (type) {
        case 0:
          this.x += this.step
          break
        case 1:
          this.x -= this.step
          break
        case 2:
          this.y += this.step
          break
        case 3:
          this.y -= this.step
          break
        case 4:
          this.z += this.step
          break
        case 5:
          this.z -= this.step
          break
      }

      var translation = Cesium.Cartesian3.fromArray([this.x, this.y, this.z])
      var m = Cesium.Matrix4.fromTranslation(translation)

      this.result = `x:${this.x} y:${this.y} z:${this.z}`

      this.tileset.modelMatrix = m
    },
    changeVisible() {
      this.tileset.show = !this.tileset.show
    },
    // 方法二，直接调用函数，调整高度，height表示物体离地面的高度
    changeHeight(height) {
      height = Number(height)
      if (isNaN(height)) {
        return
      }

      var cartographic = Cesium.Cartographic.fromCartesian(this.tileset.boundingSphere.center)
      var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
      var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)
      var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
      this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
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

#getposition {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 600px;
  background-color: gray
}
</style>
