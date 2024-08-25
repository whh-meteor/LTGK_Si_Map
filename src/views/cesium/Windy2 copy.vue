<template>
  <div style="height: 100%; width: 100%" id="box">
    <!-- 地图容器 -->
    <div id="map" class="full-size"></div>
    风场效果的Canvas，使用v-show来控制显示与隐藏
    <!-- <canvas v-show="canvasShow" id="windycanvas" class="canvas-windy"></canvas> -->
  </div>
</template>

<script>
// import CanvasWindyApi from "cesium-windy-canvas"; // 导入风场效果API
import CesiumWindyData from "./windy/cesiumwindy.data.js"; // 导入风场数据
import CanvasWindy from "./windy/windy2D.js";
export default {
  name: "Windy",
  data() {
    return {
      windData: CesiumWindyData,
      options: { age: 120, particlesNumber: 2000, frames: 1, speedRate: 3000 },
      grid: [],
      windycanvas: null,
      windy: null,
    };
  },
  mounted() {
    this.init(); // 组件挂载时初始化
  },
  methods: {
    // 初始化Cesium Viewer和风场效果
    init() {
      // 创建Cesium Viewer实例
      this.viewer = new Cesium.Viewer("map", {
        animation: false,
        homeButton: true,
        geocoder: true,
        baseLayerPicker: true,
        timeline: true,
        fullscreenButton: true,
        scene3DOnly: false,
        infoBox: true,
        sceneModePicker: true,
        navigationInstructionsInitiallyVisible: true,
        navigationHelpButton: true,
        selectionIndicator: true,
        // 使用天地图作为图层
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false,
          mininumLevel: 0,
          maximumLevel: 16,
        }),
      });
      console.log(this.windData);
      // 隐藏Cesium的版权信息
      this.viewer.cesiumWidget.creditContainer.style.display = "none";
      setTimeout(() => {
        this.windycanvas = document.createElement("canvas");
        this.windycanvas.setAttribute("id", "windycanvas");
        this.windycanvas.style.position = "fixed";
        this.windycanvas.style["point-event"] = "none";
        this.windycanvas.style["z-index"] = 100;
        this.windycanvas.style.top = 0;
        document.getElementById("box").appendChild(this.windycanvas);
        this.addWindLayer();
      }, 1000);
    },
    addWindLayer() {
      this.resizeCanvas();
      // 初始化风场参数
      const params = {
        viewer: this.viewer,
        canvas: this.windycanvas,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        speedRate: this.options.speedRate,
        particlesNumber: this.options.particlesNumber,
        maxAge: this.options.age,
        frameRate: this.options.frameRate,
      };
      this.windy = new CanvasWindy(this.windData, params);
    },
    resizeCanvas() {
      var windy = this.windy;
      if (this.windycanvas == null) {
        return;
      }
      this.windycanvas.width = window.innerWidth;
      this.windycanvas.height = window.innerHeight;

      if (windy) {
        windy._resize(this.windycanvas.width, this.windycanvas.height);
      }
    },
  },
};
</script>

<style scoped>
/* #map {
    width: 100%;
    height: 100%;
    background-color: azure;
  } */

.full-size {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

.canvas-windy {
  position: fixed;
  top: 0;
  z-index: 10;
  display: block;
  pointer-events: none; /* 禁止鼠标事件，防止干扰地图交互 */
}
</style>
