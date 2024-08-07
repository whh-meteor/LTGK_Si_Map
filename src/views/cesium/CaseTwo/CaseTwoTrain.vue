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
import earcut from "earcut";
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

      // this.loadGeoJSONTurf("/json/T8_等值线_50.json", 500000, 10, "#00ffff");
      // this.loadGeoJSONTurf("/json/T9_等高线t.json", 600000, 10, "#800000");
      // this.loadGeoJSONTurf("/json/T110_等值线.json", 700000, 10, "#2E8B57");
      // this.loadGeoJSONTurf("/json/T13_等值线.json", 800000, 10, "#D3D3D3");

      // this.LoadTrain("/json/tt.geojson");
      this.LoadTrain2("/json/T13_均匀点.json");
    },
    // 读取GeoJSON数据并展示三维等深线
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
    async LoadTrain2(url) {
      var viewer = this.viewer;
      const response = await fetch(url);
      const geojson = await response.json();
      var points = geojson.features.map(function (sample) {
        // Geojson 的Points
        return turf.point(
          [
            sample.geometry.coordinates[0],
            sample.geometry.coordinates[1],
            sample.properties.grid_code * 100,
          ],
          { z: sample.properties.grid_code }
        ); // 将高度值保存到名为 'z' 的属性中);
      });

      // 创建一个FeatureCollection
      var featureCollection = turf.featureCollection(points);
      var tin = turf.tin(featureCollection, "z");
      var that = this;

      // 遍历每个TIN三角形!!!!
      tin.features.forEach(function (feature, i) {
        var coordinates = feature.geometry.coordinates[0];

        var heights = [
          feature.properties.a,
          feature.properties.b,
          feature.properties.c,
        ];
        var positions = coordinates.map(function (coord, index) {
          return Cesium.Cartesian3.fromDegrees(
            coord[0],
            coord[1],
            heights[index]
          );
        });

        //  坡度计算
        const point1 = positions[0];
        const point2 = positions[1];
        const point3 = positions[2];
        //使用我们新定义的函数计算每个三角形的坡度
        var analysisResult = that.calculateSlopeAndAspect(
          point1,
          point2,
          point3
        );

        var slope = analysisResult.slope;
        var hue = 1 - slope / 90.0; // 将坡度从0到90度映射到色调从0到1
        var saturation = 1.0; // 全饱和度
        var lightness = 0.5; // 正常亮度
        var alpha = 0.5; // 完全不透明
        //将HSL颜色转换为RGBA，当坡度为0度时，hue变为0，颜色是红色；当坡度为90度时，hue变为1，颜色是绿色；在0到90度之间的坡度将映射到从红色到绿色之间的颜色。
        var color = Cesium.Color.fromHsl(hue, saturation, lightness).withAlpha(
          alpha
        );

        that.viewer.entities.add({
          name: "三角面",
          id: "triangle" + i,
          polygon: {
            hierarchy: [positions[0], positions[1], positions[2]],
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            perPositionHeight: true,
            material: color,
            //   Cesium.Color.fromCssColorString("#23B8BA").withAlpha(1.0),
            //  extrudedHeight: 0,
            outline: true,
            outlineColor: Cesium.Color.GREEN,
          },
        });
      });
    },
    calculateSlopeAndAspect(point1, point2, point3) {
      // 计算两个向量，它们位于三角形的两边
      var v1 = Cesium.Cartesian3.subtract(
        point1,
        point2,
        new Cesium.Cartesian3()
      );
      var v2 = Cesium.Cartesian3.subtract(
        point2,
        point3,
        new Cesium.Cartesian3()
      );
      // 计算这两个向量的叉积，得到三角形的法向量
      var normal = new Cesium.Cartesian3();
      Cesium.Cartesian3.cross(v1, v2, normal);
      Cesium.Cartesian3.normalize(normal, normal);

      // 计算三角形的中心点
      var centroid = new Cesium.Cartesian3(
        (point1.x + point2.x + point3.x) / 3,
        (point1.y + point2.y + point3.y) / 3,
        (point1.z + point2.z + point3.z) / 3
      );

      // 得到从地球中心到三角形中心的单位向量（这里不应该使用垂直向量(0,0,1)，如果使用(0,0,1)会导致面南的坡度大，面北的坡度小）
      var centerToCentroid = Cesium.Cartesian3.normalize(
        centroid,
        new Cesium.Cartesian3()
      );

      // 确保法线向量指向地球外部
      if (Cesium.Cartesian3.dot(normal, centerToCentroid) < 0) {
        Cesium.Cartesian3.negate(normal, normal);
      }

      // 计算坡度：法向量和从地球中心到三角形中心的径向向量之间的夹角
      var slopeRadians = Math.acos(
        Cesium.Cartesian3.dot(normal, centerToCentroid)
      );

      var slopeDegrees = Cesium.Math.toDegrees(slopeRadians);
      // 如果坡度大于90度，则将其减少到90度以下
      if (slopeDegrees > 90) {
        slopeDegrees = 180 - slopeDegrees;
      }
      // 返回坡度值
      return { slope: slopeDegrees };
    },
    //读取Geojson数据并显示三维网格
    async LoadTrain(url) {
      var viewer = this.viewer;
      const response = await fetch(url);
      const geojson = await response.json();
      const features = geojson.features;
      const geometries = [];
      const colors = [];
      console.log("GeoJSON数据:", geojson);

      const vertices = [];
      const flatVertices = [];
      const faces = [];

      // 解析GeoJSON中的点数据
      geojson.features.forEach((feature) => {
        const coords = feature.geometry.coordinates;
        const depth = feature.properties.depth;
        vertices.push([coords[0], coords[1], depth * 20]);
        flatVertices.push(coords[0], coords[1], depth * 20);
      });

      // 使用earcut进行三角剖分
      const indices = earcut(flatVertices, null, 3);

      console.log(indices);
      // 将剖分结果转换为faces数组
      for (let i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i + 1], indices[i + 2]]);
      }

      console.log("Vertices:", vertices);
      console.log("Faces:", faces);

      // 清空已有的实体
      this.viewer.entities.removeAll();

      // 将生成的三角网加载到Cesium中
      faces.forEach((face) => {
        const point1 = vertices[face[0]];
        const point2 = vertices[face[1]];
        const point3 = vertices[face[2]];

        // 确保点的高度在合理范围内
        const heightOffset = 3700;
        const adjustedPoints = [
          point1[0],
          point1[1],
          point1[2] + heightOffset,
          point2[0],
          point2[1],
          point2[2] + heightOffset,
          point3[0],
          point3[1],
          point3[2] + heightOffset,
        ];

        // 添加三角面
        this.viewer.entities.add({
          name: "三角面",
          polygon: {
            hierarchy:
              Cesium.Cartesian3.fromDegreesArrayHeights(adjustedPoints),
            perPositionHeight: true,
            material: Cesium.Color.fromCssColorString("#23B8BA").withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
          },
        });
      });

      this.viewer.zoomTo(this.viewer.entities);

      return { vertices, faces };
    },
    newTins() {
      const triangles = [
        {
          POINTA: 192037,
          POINTB: 192036,
          POINTC: 193130,
        },
        {
          POINTA: 192037,
          POINTB: 193131,
          POINTC: 193130,
        },
        {
          POINTA: 193131,
          POINTB: 193130,
          POINTC: 194224,
        },
        {
          POINTA: 193131,
          POINTB: 194225,
          POINTC: 194224,
        },
        {
          POINTA: 194225,
          POINTB: 195318,
          POINTC: 194224,
        },
        {
          POINTA: 194225,
          POINTB: 195318,
          POINTC: 195319,
        },
        {
          POINTA: 195319,
          POINTB: 195318,
          POINTC: 196412,
        },
        {
          POINTA: 195319,
          POINTB: 196413,
          POINTC: 196412,
        },
        {
          POINTA: 196413,
          POINTB: 196412,
          POINTC: 197506,
        },
        {
          POINTA: 196413,
          POINTB: 197507,
          POINTC: 197506,
        },
        {
          POINTA: 197507,
          POINTB: 198600,
          POINTC: 197506,
        },
        {
          POINTA: 197507,
          POINTB: 198600,
          POINTC: 198601,
        },
        {
          POINTA: 198601,
          POINTB: 198600,
          POINTC: 199694,
        },
        {
          POINTA: 198601,
          POINTB: 199695,
          POINTC: 199694,
        },
        {
          POINTA: 199695,
          POINTB: 199694,
          POINTC: 200788,
        },
        {
          POINTA: 199695,
          POINTB: 200789,
          POINTC: 200788,
        },
        {
          POINTA: 196421,
          POINTB: 197514,
          POINTC: 197515,
        },
        {
          POINTA: 196421,
          POINTB: 197514,
          POINTC: 196420,
        },
        {
          POINTA: 195327,
          POINTB: 196421,
          POINTC: 196420,
        },
        {
          POINTA: 195327,
          POINTB: 195326,
          POINTC: 196420,
        },
        {
          POINTA: 194233,
          POINTB: 195326,
          POINTC: 195327,
        },
        {
          POINTA: 194233,
          POINTB: 194232,
          POINTC: 195326,
        },
        {
          POINTA: 193139,
          POINTB: 194232,
          POINTC: 194233,
        },
        {
          POINTA: 193139,
          POINTB: 193138,
          POINTC: 194232,
        },
        {
          POINTA: 192045,
          POINTB: 193139,
          POINTC: 193138,
        },
        {
          POINTA: 192045,
          POINTB: 192044,
          POINTC: 193138,
        },
        {
          POINTA: 192044,
          POINTB: 193138,
          POINTC: 192043,
        },
        {
          POINTA: 193138,
          POINTB: 192043,
          POINTC: 193137,
        },
        {
          POINTA: 192043,
          POINTB: 193137,
          POINTC: 193136,
        },
        {
          POINTA: 192043,
          POINTB: 192042,
          POINTC: 193136,
        },
        {
          POINTA: 192042,
          POINTB: 193136,
          POINTC: 193135,
        },
        {
          POINTA: 192042,
          POINTB: 192041,
          POINTC: 193135,
        },
        {
          POINTA: 192041,
          POINTB: 193135,
          POINTC: 192040,
        },
        {
          POINTA: 193135,
          POINTB: 192040,
          POINTC: 193134,
        },
        {
          POINTA: 192040,
          POINTB: 193134,
          POINTC: 193133,
        },
        {
          POINTA: 192040,
          POINTB: 192039,
          POINTC: 193133,
        },
        {
          POINTA: 192039,
          POINTB: 193133,
          POINTC: 193132,
        },
        {
          POINTA: 192039,
          POINTB: 192038,
          POINTC: 193132,
        },
        {
          POINTA: 192038,
          POINTB: 193132,
          POINTC: 192037,
        },
        {
          POINTA: 193132,
          POINTB: 192037,
          POINTC: 193131,
        },
        {
          POINTA: 193132,
          POINTB: 194226,
          POINTC: 193131,
        },
        {
          POINTA: 194226,
          POINTB: 194225,
          POINTC: 193131,
        },
        {
          POINTA: 194225,
          POINTB: 194226,
          POINTC: 195320,
        },
        {
          POINTA: 194225,
          POINTB: 195320,
          POINTC: 195319,
        },
        {
          POINTA: 195320,
          POINTB: 196414,
          POINTC: 195319,
        },
        {
          POINTA: 196414,
          POINTB: 195319,
          POINTC: 196413,
        },
        {
          POINTA: 196414,
          POINTB: 197508,
          POINTC: 196413,
        },
        {
          POINTA: 197508,
          POINTB: 197507,
          POINTC: 196413,
        },
        {
          POINTA: 198602,
          POINTB: 197508,
          POINTC: 197507,
        },
        {
          POINTA: 198602,
          POINTB: 198601,
          POINTC: 197507,
        },
        {
          POINTA: 198602,
          POINTB: 199696,
          POINTC: 198601,
        },
        {
          POINTA: 199696,
          POINTB: 198601,
          POINTC: 199695,
        },
        {
          POINTA: 199696,
          POINTB: 200790,
          POINTC: 199695,
        },
        {
          POINTA: 200790,
          POINTB: 200789,
          POINTC: 199695,
        },
        {
          POINTA: 199697,
          POINTB: 199696,
          POINTC: 200790,
        },
        {
          POINTA: 199697,
          POINTB: 200791,
          POINTC: 200790,
        },
        {
          POINTA: 199698,
          POINTB: 199697,
          POINTC: 200791,
        },
        {
          POINTA: 200792,
          POINTB: 199698,
          POINTC: 200791,
        },
        {
          POINTA: 200793,
          POINTB: 200792,
          POINTC: 199698,
        },
        {
          POINTA: 200793,
          POINTB: 199698,
          POINTC: 199699,
        },
        {
          POINTA: 200793,
          POINTB: 199700,
          POINTC: 199699,
        },
        {
          POINTA: 200794,
          POINTB: 199700,
          POINTC: 200793,
        },
        {
          POINTA: 200794,
          POINTB: 199701,
          POINTC: 199700,
        },
        {
          POINTA: 200795,
          POINTB: 200794,
          POINTC: 199701,
        },
        {
          POINTA: 200795,
          POINTB: 199701,
          POINTC: 200796,
        },
        {
          POINTA: 199702,
          POINTB: 199701,
          POINTC: 200796,
        },
        {
          POINTA: 199703,
          POINTB: 199702,
          POINTC: 200796,
        },
        {
          POINTA: 199703,
          POINTB: 200797,
          POINTC: 200796,
        },
        {
          POINTA: 198609,
          POINTB: 199703,
          POINTC: 199702,
        },
        {
          POINTA: 198609,
          POINTB: 198608,
          POINTC: 199702,
        },
        {
          POINTA: 197515,
          POINTB: 198609,
          POINTC: 198608,
        },
        {
          POINTA: 197515,
          POINTB: 197514,
          POINTC: 198608,
        },
        {
          POINTA: 197514,
          POINTB: 198608,
          POINTC: 197513,
        },
        {
          POINTA: 197514,
          POINTB: 197513,
          POINTC: 196419,
        },
        {
          POINTA: 197514,
          POINTB: 196420,
          POINTC: 196419,
        },
        {
          POINTA: 196420,
          POINTB: 195325,
          POINTC: 196419,
        },
        {
          POINTA: 195326,
          POINTB: 196420,
          POINTC: 195325,
        },
        {
          POINTA: 195326,
          POINTB: 195325,
          POINTC: 194231,
        },
        {
          POINTA: 194232,
          POINTB: 195326,
          POINTC: 194231,
        },
        {
          POINTA: 193137,
          POINTB: 194232,
          POINTC: 194231,
        },
        {
          POINTA: 193138,
          POINTB: 194232,
          POINTC: 193137,
        },
        {
          POINTA: 194230,
          POINTB: 193137,
          POINTC: 194231,
        },
        {
          POINTA: 194230,
          POINTB: 193137,
          POINTC: 193136,
        },
        {
          POINTA: 193136,
          POINTB: 194230,
          POINTC: 194229,
        },
        {
          POINTA: 193136,
          POINTB: 193135,
          POINTC: 194229,
        },
        {
          POINTA: 193135,
          POINTB: 194229,
          POINTC: 193134,
        },
        {
          POINTA: 194229,
          POINTB: 193134,
          POINTC: 194228,
        },
        {
          POINTA: 193134,
          POINTB: 194228,
          POINTC: 194227,
        },
        {
          POINTA: 193134,
          POINTB: 193133,
          POINTC: 194227,
        },
        {
          POINTA: 193133,
          POINTB: 194227,
          POINTC: 194226,
        },
        {
          POINTA: 193133,
          POINTB: 193132,
          POINTC: 194226,
        },
        {
          POINTA: 194227,
          POINTB: 195320,
          POINTC: 194226,
        },
        {
          POINTA: 194227,
          POINTB: 195321,
          POINTC: 195320,
        },
        {
          POINTA: 195321,
          POINTB: 195320,
          POINTC: 196414,
        },
        {
          POINTA: 195321,
          POINTB: 196415,
          POINTC: 196414,
        },
        {
          POINTA: 196415,
          POINTB: 196414,
          POINTC: 197508,
        },
        {
          POINTA: 196415,
          POINTB: 197509,
          POINTC: 197508,
        },
        {
          POINTA: 197509,
          POINTB: 198602,
          POINTC: 197508,
        },
        {
          POINTA: 197509,
          POINTB: 198602,
          POINTC: 198603,
        },
        {
          POINTA: 198603,
          POINTB: 198602,
          POINTC: 199696,
        },
        {
          POINTA: 198603,
          POINTB: 199697,
          POINTC: 199696,
        },
        {
          POINTA: 198604,
          POINTB: 199697,
          POINTC: 198603,
        },
        {
          POINTA: 198604,
          POINTB: 199697,
          POINTC: 199698,
        },
        {
          POINTA: 199699,
          POINTB: 198604,
          POINTC: 199698,
        },
        {
          POINTA: 198605,
          POINTB: 199699,
          POINTC: 198604,
        },
        {
          POINTA: 198606,
          POINTB: 198605,
          POINTC: 199699,
        },
        {
          POINTA: 198606,
          POINTB: 199700,
          POINTC: 199699,
        },
        {
          POINTA: 198607,
          POINTB: 198606,
          POINTC: 199700,
        },
        {
          POINTA: 198607,
          POINTB: 199700,
          POINTC: 199701,
        },
        {
          POINTA: 199702,
          POINTB: 198607,
          POINTC: 199701,
        },
        {
          POINTA: 198608,
          POINTB: 199702,
          POINTC: 198607,
        },
        {
          POINTA: 198608,
          POINTB: 197513,
          POINTC: 198607,
        },
        {
          POINTA: 198606,
          POINTB: 197513,
          POINTC: 198607,
        },
        {
          POINTA: 197512,
          POINTB: 198606,
          POINTC: 197513,
        },
        {
          POINTA: 197513,
          POINTB: 197512,
          POINTC: 196419,
        },
        {
          POINTA: 197512,
          POINTB: 196419,
          POINTC: 196418,
        },
        {
          POINTA: 195325,
          POINTB: 196418,
          POINTC: 196419,
        },
        {
          POINTA: 195325,
          POINTB: 196418,
          POINTC: 195324,
        },
        {
          POINTA: 194231,
          POINTB: 195325,
          POINTC: 195324,
        },
        {
          POINTA: 194230,
          POINTB: 194231,
          POINTC: 195324,
        },
        {
          POINTA: 195324,
          POINTB: 195323,
          POINTC: 194230,
        },
        {
          POINTA: 195323,
          POINTB: 194230,
          POINTC: 194229,
        },
        {
          POINTA: 194229,
          POINTB: 194228,
          POINTC: 195323,
        },
        {
          POINTA: 194228,
          POINTB: 195323,
          POINTC: 195322,
        },
        {
          POINTA: 194228,
          POINTB: 195321,
          POINTC: 195322,
        },
        {
          POINTA: 194228,
          POINTB: 194227,
          POINTC: 195321,
        },
        {
          POINTA: 195322,
          POINTB: 195321,
          POINTC: 196415,
        },
        {
          POINTA: 195322,
          POINTB: 196416,
          POINTC: 196415,
        },
        {
          POINTA: 196416,
          POINTB: 196415,
          POINTC: 197509,
        },
        {
          POINTA: 196416,
          POINTB: 197510,
          POINTC: 197509,
        },
        {
          POINTA: 197510,
          POINTB: 197509,
          POINTC: 198603,
        },
        {
          POINTA: 197510,
          POINTB: 198604,
          POINTC: 198603,
        },
        {
          POINTA: 198605,
          POINTB: 197510,
          POINTC: 198604,
        },
        {
          POINTA: 198605,
          POINTB: 197510,
          POINTC: 197511,
        },
        {
          POINTA: 197512,
          POINTB: 197511,
          POINTC: 198605,
        },
        {
          POINTA: 197512,
          POINTB: 198606,
          POINTC: 198605,
        },
        {
          POINTA: 197512,
          POINTB: 196418,
          POINTC: 197511,
        },
        {
          POINTA: 196418,
          POINTB: 196417,
          POINTC: 197511,
        },
        {
          POINTA: 195324,
          POINTB: 196418,
          POINTC: 196417,
        },
        {
          POINTA: 195324,
          POINTB: 195323,
          POINTC: 196417,
        },
        {
          POINTA: 195323,
          POINTB: 196417,
          POINTC: 195322,
        },
        {
          POINTA: 196417,
          POINTB: 195322,
          POINTC: 196416,
        },
        {
          POINTA: 196416,
          POINTB: 196417,
          POINTC: 197511,
        },
        {
          POINTA: 196416,
          POINTB: 197510,
          POINTC: 197511,
        },
      ];

      const points = [
        {
          type: "Feature",
          properties: { id: 192036, depth: -1550.0634, depth_9: -974.35917 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192037, depth: -1548.5803, depth_9: -974.23708 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192038, depth: -1545.9717, depth_9: -974.115 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192039, depth: -1545.4133, depth_9: -973.99291 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192040, depth: -1548.078, depth_9: -973.87083 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192041, depth: -1550.6251, depth_9: -974.27239 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192042, depth: -1553.0587, depth_9: -974.7204 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192043, depth: -1555.4813, depth_9: -975.1684 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192044, depth: -1564.4261, depth_9: -975.6164 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 192045, depth: -1583.7703, depth_9: -976.0644 },
          geometry: {
            type: "Point",
            coordinates: [120.966896314, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193130, depth: -1553.4219, depth_9: -977.09781 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193131, depth: -1556.5633, depth_9: -976.97573 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193132, depth: -1554.0042, depth_9: -976.85364 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193133, depth: -1551.5491, depth_9: -976.73156 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193134, depth: -1552.1818, depth_9: -977.05397 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193135, depth: -1554.8446, depth_9: -977.50197 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193136, depth: -1557.3319, depth_9: -977.94997 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193137, depth: -1559.7644, depth_9: -978.39797 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193138, depth: -1562.1538, depth_9: -978.84597 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 193139, depth: -1576.3276, depth_9: -979.29398 },
          geometry: {
            type: "Point",
            coordinates: [120.970896313999987, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194224, depth: -1556.7913, depth_9: -979.83646 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194225, depth: -1560.1891, depth_9: -979.71437 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194226, depth: -1562.1973, depth_9: -979.59229 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194227, depth: -1559.4344, depth_9: -979.83554 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194228, depth: -1557.1284, depth_9: -980.28354 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194229, depth: -1558.95, depth_9: -980.73154 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194230, depth: -1561.5885, depth_9: -981.17954 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194231, depth: -1564.0382, depth_9: -981.62755 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194232, depth: -1566.4697, depth_9: -982.07555 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 194233, depth: -1568.8344, depth_9: -982.52355 },
          geometry: {
            type: "Point",
            coordinates: [120.974896314, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195318, depth: -1560.6213, depth_9: -982.5751 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195319, depth: -1563.552, depth_9: -982.45302 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195320, depth: -1566.9567, depth_9: -982.61711 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195321, depth: -1567.7184, depth_9: -983.06511 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195322, depth: -1564.9422, depth_9: -983.51311 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195323, depth: -1563.0522, depth_9: -983.96112 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195324, depth: -1565.7179, depth_9: -984.40912 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195325, depth: -1568.3097, depth_9: -984.85712 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195326, depth: -1570.7441, depth_9: -985.30512 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 195327, depth: -1573.1744, depth_9: -985.75312 },
          geometry: {
            type: "Point",
            coordinates: [120.978896314, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196412, depth: -1564.9427, depth_9: -985.31375 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196413, depth: -1567.2764, depth_9: -985.39868 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196414, depth: -1570.3171, depth_9: -985.84668 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196415, depth: -1573.7245, depth_9: -986.29469 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196416, depth: -1573.1405, depth_9: -986.74269 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196417, depth: -1570.4859, depth_9: -987.19069 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196418, depth: -1569.8209, depth_9: -987.63869 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196419, depth: -1572.4855, depth_9: -988.08669 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196420, depth: -1575.0168, depth_9: -988.5347 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 196421, depth: -1577.4499, depth_9: -988.9827 },
          geometry: {
            type: "Point",
            coordinates: [120.982896313999987, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197506, depth: -1569.628, depth_9: -988.18025 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197507, depth: -1571.4157, depth_9: -988.62826 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197508, depth: -1573.9316, depth_9: -989.07626 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197509, depth: -1577.0838, depth_9: -989.52426 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197510, depth: -1580.4926, depth_9: -989.97226 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197511, depth: -1578.5643, depth_9: -990.42026 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197512, depth: -1576.0603, depth_9: -990.86827 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197513, depth: -1576.5894, depth_9: -991.31627 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197514, depth: -1579.2519, depth_9: -991.76427 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 197515, depth: -1581.7234, depth_9: -992.21227 },
          geometry: {
            type: "Point",
            coordinates: [120.986896314, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198600, depth: -1574.3485, depth_9: -991.40983 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198601, depth: -1576.101, depth_9: -991.85783 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198602, depth: -1577.8886, depth_9: -992.30583 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198603, depth: -1580.5868, depth_9: -992.75383 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198604, depth: -1583.8509, depth_9: -993.20184 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198605, depth: -1586.6345, depth_9: -993.64984 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198606, depth: -1583.9912, depth_9: -994.09784 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198607, depth: -1581.6391, depth_9: -994.54584 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198608, depth: -1583.3576, depth_9: -994.99384 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 198609, depth: -1585.9877, depth_9: -995.44185 },
          geometry: {
            type: "Point",
            coordinates: [120.990896314, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199694, depth: -1579.4457, depth_9: -994.6394 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199695, depth: -1580.7861, depth_9: -995.0874 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199696, depth: -1582.5741, depth_9: -995.53541 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199697, depth: -1584.4203, depth_9: -995.98341 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199698, depth: -1587.242, depth_9: -996.43141 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199699, depth: -1590.6181, depth_9: -996.87941 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199700, depth: -1592.2685, depth_9: -997.32741 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199701, depth: -1589.465, depth_9: -997.77542 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199702, depth: -1587.4598, depth_9: -998.22342 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 199703, depth: -1590.1255, depth_9: -998.67142 },
          geometry: {
            type: "Point",
            coordinates: [120.994896313999988, 34.48597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200788, depth: -1584.6281, depth_9: -997.86898 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.52197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200789, depth: -1585.8334, depth_9: -998.31698 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.51797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200790, depth: -1587.2592, depth_9: -998.76498 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.51397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200791, depth: -1589.0471, depth_9: -999.21298 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.50997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200792, depth: -1591.0755, depth_9: -999.66098 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.50597641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200793, depth: -1593.9819, depth_9: -1000.3451 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.50197641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200794, depth: -1597.3858, depth_9: -1001.7638 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.49797641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200795, depth: -1597.7014, depth_9: -1003.1824 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.49397641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200796, depth: -1595.0002, depth_9: -1004.6011 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.48997641],
          },
        },
        {
          type: "Feature",
          properties: { id: 200797, depth: -1594.2285, depth_9: -1006.0197 },
          geometry: {
            type: "Point",
            coordinates: [120.998896314, 34.48597641],
          },
        },
      ];

      const pointMap = {};
      points.forEach((point) => {
        pointMap[point.id] = point.geometry.coordinates;
      });

      const tinTriangles = triangles.map((triangle) => {
        return {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                pointMap[triangle.POINTA],
                pointMap[triangle.POINTB],
                pointMap[triangle.POINTC],
                pointMap[triangle.POINTA],
              ],
            ],
          },
        };
      });

      const tinGeoJSON = {
        type: "FeatureCollection",
        features: tinTriangles,
      };

      console.log(JSON.stringify(tinGeoJSON));
      return JSON.stringify(tinGeoJSON);
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
