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

        <label for="heightOffset">Height Offset: {{ heightOffset }}</label>
        <input
          type="range"
          id="heightOffset"
          v-model="heightOffset"
          min="-50000"
          max="50000"
          step="100"
          @input="updateHeightOffset"
        />
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
      heightOffset: 0,
      tilesets: [],
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
      // this.viewer.zoomTo(this.entity);
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
      //加载等值线地形;
      this.loadGeoJSONTurf("/json/T8_等值线_50.json", 0, 3, "#00ffff");
      this.loadGeoJSONTurf("/json/T9_等高线t.json", 0, 3, "#800000");
      this.loadGeoJSONTurf("/json/T110_等值线.json", 0, 3, "#2E8B57");
      this.loadGeoJSONTurf("/json/T13_等值线.json", 0, 3, "#D3D3D3");
      //加载三角网地形
      // this.LoadTrain("/json/tt.geojson");
      // this.LoadTrain2("/json/intensity_1.geojson");
      //加载点云地形

      // this.loadLAS("http://localhost:9003/model/tcGV6jCdB/tileset.json", 0); //t13 拉伸
      // this.loadLAS("http://localhost:9003/model/t43B9t2KD/tileset.json", 0); //t8 拉伸
      // // 无拉伸地形;
      // this.loadLAS(
      //   "http://localhost:9003/model/tsEekmzUR/tileset.json",
      //   this.heightOffset
      // ); //t8
      // this.loadLAS(
      //   "http://localhost:9003/model/tl0diAQeR/tileset.json",
      //   -100000
      // ); //t9
      // this.loadLAS(
      //   "http://localhost:9003/model/tGmHLBAlU/tileset.json",
      //   -200000
      // ); //t10
      // this.loadLAS(
      //   "http://localhost:9003/model/tue7NXrmB/tileset.json",
      //   -300000
      // ); //t13
      var self = this;
      // 监听鼠标点击事件
      this.viewer.screenSpaceEventHandler.setInputAction((click) => {
        // 使用屏幕坐标进行拾取
        const pickedFeature = this.viewer.scene.pick(click.position);

        if (
          Cesium.defined(pickedFeature)
          //&&
          // pickedFeature instanceof Cesium.Cesium3DTileFeature
        ) {
          // 如果点击的是一个 3D 瓦片特征
          const feature = pickedFeature; // 这里的 pickedFeature 是 Cesium3DTileFeature 类型

          // 访问特征属性
          const properties = feature.getPropertyNames();
          console.log("属性名称:", properties);

          properties.forEach((propertyName) => {
            const propertyValue = feature.getProperty(propertyName);
            console.log(`${propertyName}: ${propertyValue}`);
          });
        } else {
          console.log("没有拾取到有效的点云特征");
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    updateHeightOffset() {
      this.tilesets.forEach(({ tileset, url }) => {
        const translation = new Cesium.Cartesian3(0, 0, this.heightOffset);
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      });
    },
    loadLAS(url, heightOffset) {
      const translation = new Cesium.Cartesian3(0, 0, heightOffset); // 向下偏移500米
      const modelMatrix = Cesium.Matrix4.fromTranslation(translation);

      var heightOffset = heightOffset;
      var tileset = this.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: url,
          // 4*4 平移矩阵
          modelMatrix: modelMatrix,
        })
      );

      // 应用样式修改点云颜色
      tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [["true", "color('white')"]],
        },
      });
      this.tilesets.push({ tileset, url });
      this.viewer.flyTo(tileset);
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
            sample.properties.depth * 1000,
          ],
          { z: sample.properties.depth }
        ); // 将高度值保存到名为 'z' 的属性中);
      });

      // 创建一个FeatureCollection
      var featureCollection = turf.featureCollection(points);
      var tin = turf.tin(featureCollection, "z");
      var that = this;
      // 暂停事件触发
      viewer.entities.suspendEvents();
      var entities = [];

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
        var hue = slope / 90.0; // 将坡度从0到90度映射到色调从0到1
        var saturation = 1.0; // 全饱和度
        var lightness = 0.5; // 正常亮度
        var alpha = 0.8; // 完全不透明
        //将HSL颜色转换为RGBA，当坡度为0度时，hue变为0，颜色是红色；当坡度为90度时，hue变为1，颜色是绿色；在0到90度之间的坡度将映射到从红色到绿色之间的颜色。
        var color = Cesium.Color.fromHsl(hue, saturation, lightness).withAlpha(
          alpha
        );
        var entity = {
          name: "三角面",
          id: "triangle" + i,
          polygon: {
            hierarchy: [positions[0], positions[1], positions[2]],
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            perPositionHeight: true,
            material: color,
            outline: true,
            outlineColor: Cesium.Color.WHITE,
          },
        };

        entities.push(entity);
        // that.viewer.entities.add({
        //   name: "三角面",
        //   id: "triangle" + i,
        //   polygon: {
        //     hierarchy: [positions[0], positions[1], positions[2]],
        //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        //     perPositionHeight: true,
        //     material: color,
        //     //   Cesium.Color.fromCssColorString("#23B8BA").withAlpha(1.0),
        //     //  extrudedHeight: 0,
        //     outline: true, //不显示边线
        //     outlineColor: Cesium.Color.WHITE,
        //   },
        // });
      });

      // 批量添加entity
      entities.forEach((entity) => {
        viewer.entities.add(entity);
      });

      // 恢复事件触发
      viewer.entities.resumeEvents();
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
