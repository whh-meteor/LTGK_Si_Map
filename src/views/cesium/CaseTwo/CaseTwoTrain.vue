<template>
  <div>
    <!-- 地图容器 -->
    <div id="map">
      <!-- 控制面板 -->
      <div class="pane">
        <!-- 旋转按钮，点击后调用rotationCamera方法旋转5度 -->
        <a href="#" @click="rotationCamera(5)">旋转5</a>
        <!-- 旋转按钮，点击后调用rotationCamera方法逆时针旋转5度 -->
        <a href="#" @click="rotationCamera(-5)">旋转-5</a>
        <!-- 停止旋转按钮，点击后调用stop方法停止旋转 -->
        <a href="#" @click="stop()">停止旋转</a>
        <!-- 开始旋转按钮，点击后调用beginRotate方法开始旋转 -->
        <a href="#" @click="beginRotate()">开始旋转</a>
      </div>
      <div id="toolbar" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../CaseOne/cesiumUtils/CesiumHeatmap.js";
import "../CaseOne/cesiumUtils/PolylineTrailLinkMaterialProperty";
import pointList from "../CaseOne/src/point.json"; // 所有的点位信息
import seaArea from "../CaseOne//src/sea.json"; // 海面范围
import { point, bearing, distance, destination } from "@turf/turf";
import * as d3 from "d3-delaunay";
import { initPath } from "./src/path";
import * as turf from "@turf/turf";
import Delaunator from "delaunator";
import { color } from "dat.gui";
export default {
  name: "Home",
  data() {
    return {
      viewer: null, // Cesium Viewer实例
      heading: 0, // 相机当前朝向角度
      offset: null, // 相机偏移参数
      entity: null, // 地图上的实体
      inTime: undefined,
      outTime: undefined,
      shipId: undefined,
      shipNames: [],
      shipPath: undefined,
      showWarning: false,
      turfWarnArea: null,
    };
  },
  mounted() {
    this.init(); // 组件挂载后初始化地图
  },
  methods: {
    init() {
      // 设置Cesium默认的Ion访问令牌
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI";

      // 初始化Cesium Viewer
      this.viewer = new Cesium.Viewer("map", {
        terrainProvider: Cesium.createWorldTerrain({
          requestWaterMask: true, // 请求水面掩码
          requestVertexNormals: true, // 请求顶点法线
        }),
      });
      // 启用地形深度测试
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      // 配置Cesium的地表穿透（underground）设置：
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000; // 允许镜头进入地下
      this.viewer.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z; // 允许从顶部视角进入地下
      // 地球半透明设置
      // this.viewer.scene.globe.material = Cesium.Material.fromType('Color')
      // this.viewer.scene.globe.material.uniforms.color = new Cesium.Color(1.0, 1.0, 1.0, 0.5); // 设置透明度为50%

      this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
      this.viewer.scene.globe.undergroundColor.withAlpha(0.5);
      // 添加一个实体到地图上
      this.entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(123, 34, -350000),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
        },
      });
      const outerCoreRadius = 6000000;
      const outerCore = this.viewer.entities.add({
        name: "Outer Core",
        position: Cesium.Cartesian3.ZERO,
        ellipsoid: {
          radii: new Cesium.Cartesian3(
            outerCoreRadius,
            outerCoreRadius,
            outerCoreRadius
          ),
          material: Cesium.Color.BLACK.withAlpha(0.5),
        },
      });
      this.viewer.zoomTo(this.entity);
      // // 初始化动画设置
      // this.viewer.camera.setView({
      //   destination: Cesium.Cartesian3.fromDegrees(123, 33, 5000000), // 初始相机位置
      //   orientation: {
      //     heading: 0.2079384332084935,
      //     roll: 0.00031509431759868534,
      //     pitch: -1.0,
      //   },
      //   duration: 3, // 动画持续时间
      // });
      // this.rotate() // 初始调用旋转方法（可选）

      //插值点

      //地球透明 海水部分
      this.useTranslucencyMask();

      this.loadGeoJSONTurf("/json/T8_等值线_50.json", 500000, 10, "#00ffff");
      // this.loadGeoJSONTurf("/json/T9_等高线t.json", 600000, 10, "#800000");
      // this.loadGeoJSONTurf("/json/T110_等值线.json", 700000, 10, "#2E8B57");
      // this.loadGeoJSONTurf("/json/T13_等值线.json", 800000, 10, "#D3D3D3");
    },
    // 读取GeoJSON数据并展示三维三角网
    async loadGeoJSONTurf(url, offset, scale, ColorSurface) {
      var viewer = this.viewer;
      const response = await fetch(url);
      const geojson = await response.json();
      const features = geojson.features;
      const geometries = [];
      const colors = [];

      features.forEach((feature) => {
        if (feature.geometry.coordinates) {
          const coordinates = feature.geometry.coordinates;

          const contourHeight = feature.properties.Contour;

          const positions = coordinates.map((coord) =>
            Cesium.Cartesian3.fromDegrees(
              coord[0],
              coord[1],
              contourHeight * scale - offset
            )
          );

          geometries.push(
            new Cesium.PolylineGeometry({
              positions: positions,
              width: 2.0,
            })
          );

          colors.push(
            Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromCssColorString(ColorSurface)
            )
          );
        }
      });

      const instances = geometries.map((geometry, index) => {
        return new Cesium.GeometryInstance({
          geometry: geometry,
          attributes: {
            color: colors[index],
          },
        });
      });

      viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: instances,
          appearance: new Cesium.PolylineColorAppearance(),
        })
      );
    },

    // 地球部分

    useTranslucencyMask() {
      const scene = this.viewer.scene;
      const globe = scene.globe;
      const baseLayer = this.viewer.scene.imageryLayers.get(0);
      globe.showGroundAtmosphere = false;
      globe.baseColor = Cesium.Color.TRANSPARENT;
      globe.translucency.enabled = true;
      globe.undergroundColor = undefined;

      // Set oceans on Bing base layer to transparent
      baseLayer.colorToAlpha = new Cesium.Color(0.0, 0.0, 0.0);
      baseLayer.colorToAlphaThreshold = 0.2;
    },
    rotationCamera(degrees) {
      // 调整相机的朝向角度
      this.heading += degrees;
    },
    beginRotate() {
      // 开始旋转
      this.viewer.zoomTo(this.entity, this.offset).then(() => {
        this.viewer.clock.onTick.addEventListener(this.rotate); // 注册旋转事件
      });
    },
    stop() {
      // 停止旋转
      this.viewer.clock.onTick.removeEventListener(this.rotate); // 取消旋转事件
      this.viewer.scene.screenSpaceCameraController.enableInputs = true; // 恢复相机控制
    },
    rotate() {
      // 旋转方法
      this.heading += 0.1; // 每次调用增加0.1度
      this.offset = new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(this.heading),
        -Cesium.Math.toRadians(60),
        1000
      ); // 计算新的相机偏移参数
      this.viewer.zoomTo(this.entity, this.offset); // 将相机移到新的位置
      this.viewer.scene.screenSpaceCameraController.enableInputs = false; // 禁用相机控制
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  background-color: azure;
  /* 地图背景色 */
}

.pane {
  background: #34495e;
  /* 面板背景色 */
  line-height: 28px;
  /* 行高 */
  color: #fff;
  /* 字体颜色 */
  z-index: 10;
  /* 层叠顺序 */
  position: absolute;
  /* 绝对定位 */
  top: 20px;
  /* 距顶部距离 */
  left: 20px;
  /* 距左侧距离 */
}

.pane a {
  display: block;
  /* 块级元素 */
  color: #fff;
  /* 链接字体颜色 */
  text-align: left;
  /* 左对齐 */
  padding: 0 10px;
  /* 内边距 */
  min-width: 28px;
  /* 最小宽度 */
  min-height: 28px;
  /* 最小高度 */
  float: left;
  /* 左浮动 */
}
</style>
