<template>
  <div style="height: 100%; width: 100%">
    <!-- 地图容器 -->
    <div id="map" class="full-size"></div>
    <!-- 风场效果的Canvas，使用v-show来控制显示与隐藏 -->
    <canvas v-show="canvasShow" id="windycanvas" class="canvas-windy"></canvas>
  </div>
</template>

<script>
import CanvasWindyApi from "cesium-windy-canvas"; // 导入风场效果API
import CesiumWindyData from "./windy/cesiumwindy.data.js"; // 导入风场数据

export default {
  name: "Windy",
  data() {
    return {
      globalExtent: [], // 存储地图当前视图的地理范围
      refreshTimer: -1, // 用于延迟重绘风场
      mouseDown: false, // 标记鼠标是否按下
      mouseMove: false, // 标记鼠标是否移动
      windy: null, // 风场对象
      windycanvas: null, // 风场的Canvas对象
      handler: null, // 事件处理器对象
      viewer: null, // Cesium Viewer对象
      canvasShow: true, // 控制风场Canvas的显示与隐藏
    };
  },
  mounted() {
    this.init(); // 组件挂载时初始化
  },
  methods: {
    // 显示风场Canvas
    showWindy() {
      this.canvasShow = true;
    },
    // 隐藏风场Canvas
    hideWindy() {
      this.canvasShow = false;
    },
    // 获取当前Cesium视图的四个角的地理坐标范围
    getCesiumExtent() {
      const canvaswidth = window.innerWidth;
      const canvasheight = window.innerHeight;

      // 定义四个角的屏幕坐标
      const left_top_pt = new Cesium.Cartesian2(0, 0);
      const left_bottom_pt = new Cesium.Cartesian2(0, canvasheight);
      const right_top_pt = new Cesium.Cartesian2(canvaswidth, 0);
      const right_bottom_pt = new Cesium.Cartesian2(canvaswidth, canvasheight);

      // 获取四个角的地理坐标
      const pick1 = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(left_top_pt),
        this.viewer.scene
      );
      const pick2 = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(left_bottom_pt),
        this.viewer.scene
      );
      const pick3 = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(right_top_pt),
        this.viewer.scene
      );
      const pick4 = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(right_bottom_pt),
        this.viewer.scene
      );

      // 如果四个点都有效，计算地理坐标范围
      if (pick1 && pick2 && pick3 && pick4) {
        const geoPt1 =
          this.viewer.scene.globe.ellipsoid.cartesianToCartographic(pick2);
        const geoPt2 =
          this.viewer.scene.globe.ellipsoid.cartesianToCartographic(pick3);
        const point1 = [
          (geoPt1.longitude / Math.PI) * 180,
          (geoPt1.latitude / Math.PI) * 180,
        ];
        const point2 = [
          (geoPt2.longitude / Math.PI) * 180,
          (geoPt2.latitude / Math.PI) * 180,
        ];

        // 处理跨经度180度的情况
        if (point1[0] > point2[0]) {
          this.globalExtent = [
            point1[0],
            180,
            point1[1],
            point2[1],
            -180,
            point2[0],
            point1[1],
            point2[1],
          ];
        } else {
          this.globalExtent = [point1[0], point2[0], point1[1], point2[1]];
        }
      } else {
        this.globalExtent = []; // 如果获取不到坐标，则重置范围
      }
      console.log("监听");
    },
    // 调整风场Canvas的大小
    resizeCanvas() {
      if (this.windycanvas == null) return;
      //   this.windycanvas.width = window.innerWidth;
      //   this.windycanvas.height = window.innerHeight;

      // 获取 Cesium 地图容器的位置和尺寸
      const mapElement = document.getElementById("map");
      const mapRect = mapElement.getBoundingClientRect();

      // 调整风场 Canvas 的位置和大小，使其与 Cesium 地图容器对齐
      this.windycanvas.style.left = `${mapRect.left}px`;
      this.windycanvas.style.top = `${mapRect.top}px`;
      this.windycanvas.width = mapRect.width;
      this.windycanvas.height = mapRect.height;
      console.log(this.windycanvas.width, this.windycanvas.height, 123);

      if (this.windy) {
        console.log("存在");
        // 调整风场API的Canvas大小
        this.windy._resize(this.windycanvas.width, this.windycanvas.height);
      }
    },
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

      // 隐藏Cesium的版权信息
      this.viewer.cesiumWidget.creditContainer.style.display = "none";

      // 创建事件处理器实例
      this.handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );

      // 监听鼠标滚轮事件，重新生成风场
      this.handler.setInputAction(() => {
        clearTimeout(this.refreshTimer);
        this.hideWindy();
        setTimeout(() => {
          this.windy.extent = this.globalExtent;
          this.windy.redraw();
          this.showWindy();
        }, 200);
      }, Cesium.ScreenSpaceEventType.WHEEL);

      // 监听鼠标左键按下事件
      this.handler.setInputAction(() => {
        this.mouseDown = true;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // 监听鼠标右键按下事件
      this.handler.setInputAction(() => {
        this.mouseDown = true;
      }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);

      // 监听鼠标移动事件，隐藏风场
      this.handler.setInputAction(() => {
        if (this.mouseDown) {
          this.hideWindy();
          this.mouseMove = true;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // 监听鼠标左键抬起事件，重新生成风场
      this.handler.setInputAction(() => {
        if (this.mouseDown && this.mouseMove) {
          this.windy.extent = this.globalExtent;
          this.windy.redraw();
        }
        this.showWindy();
        this.mouseDown = false;
        this.mouseMove = false;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // 监听鼠标右键抬起事件，重新生成风场
      this.handler.setInputAction(() => {
        if (this.mouseDown && this.mouseMove) {
          this.windy.extent = this.globalExtent;
          this.windy.redraw();
        }
        this.showWindy();
        this.mouseDown = false;
        this.mouseMove = false;
      }, Cesium.ScreenSpaceEventType.RIGHT_UP);

      // 获取风场的Canvas对象
      this.windycanvas = document.getElementById("windycanvas");

      // 初始化风场参数
      const params = {
        viewer: this.viewer,
        canvas: this.windycanvas,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        speedRate: 2000,
        particlesNumber: 10000,
        maxAge: 120,
        frameRate: 10,
        color: "#ffffff",
        lineWidth: 1,
      };

      // 调整风场Canvas的大小
      this.resizeCanvas();
      window.onresize = this.resizeCanvas;

      // 创建风场实例
      this.windy = new CanvasWindyApi.CesiumWindy(CesiumWindyData, params);

      // 添加监听器，每次渲染后更新地理范围
      this.viewer.scene.postRender.addEventListener(() => {
        this.getCesiumExtent();
      });
      console.log(this.viewer);
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
