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
import { point, bearing, distance, destination } from "@turf/turf";
import * as d3 from "d3-delaunay";
export default {
  name: "Home",
  data() {
    return {
      viewer: null, // Cesium Viewer实例
      heading: 0, // 相机当前朝向角度
      offset: null, // 相机偏移参数
      entity: null, // 地图上的实体
    };
  },
  mounted() {
    this.init(); // 组件挂载后初始化地图
  },
  methods: {
    init() {
      // this.viewer = new Cesium.Viewer('map', {
      //   // terrainProvider: Cesium.createWorldTerrain(),
      //   animation: false, // 是否显示动画控件
      //   homeButton: true, // 是否显示home键
      //   geocoder: true, // 是否显示地名查找控件        如果设置为true，则无法查询
      //   baseLayerPicker: true, // 是否显示图层选择控件
      //   timeline: true, // 是否显示时间线控件
      //   fullscreenButton: true, // 是否全屏显示
      //   scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      //   infoBox: true, // 是否显示点击要素之后显示的信息
      //   sceneModePicker: true, // 是否显示投影方式控件  三维/二维
      //   navigationInstructionsInitiallyVisible: true,
      //   navigationHelpButton: true, // 是否显示帮助信息控件
      //   selectionIndicator: true, // 是否显示指示器组件
      //   // 加载天地图
      //   imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      //     url:
      //       'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e',
      //     layer: 'tdtBasicLayer',
      //     style: 'default',
      //     format: 'image/jpeg',
      //     tileMatrixSetID: 'GoogleMapsCompatible',
      //     show: false,
      //     mininumLevel: 0,
      //     maximumLevel: 16
      //   })
      // })
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

      // 添加一个实体到地图上
      this.entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120, 33),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
        },
      });
      // this.rotate() // 初始调用旋转方法（可选）
      this.loadGeoJsonData("/json/T8_Trans.geojson", 500000); // 渲染面
      this.loadGeoJsonData("/json/T9_Trans.geojson", 600000); // 渲染面
      this.loadGeoJsonData("/json/T10_Trans.geojson", 700000); // 渲染面
      this.loadGeoJsonData("/json/T13_Trans.geojson", 800000); // 渲染面
      // this.addGeological()
      // this.reset()
      this.useTranslucencyMask();
    },
    // 地球部分
    reset() {
      const scene = this.viewer.scene;
      const globe = scene.globe;
      const baseLayer = this.viewer.scene.imageryLayers.get(0);
      globe.showGroundAtmosphere = true;
      globe.baseColor = Cesium.Color.BLUE;
      globe.translucency.enabled = false;
      globe.translucency.frontFaceAlpha = 1.0;
      globe.undergroundColor = Cesium.Color.BLACK;
      globe.translucency.rectangle = undefined;
      baseLayer.colorToAlpha = undefined;
    },
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
    useTranslucencyRectangle() {
      const scene = this.viewer.scene;
      const globe = scene.globe;
      const baseLayer = this.viewer.scene.imageryLayers.get(0);
      globe.translucency.enabled = true;
      globe.undergroundColor = undefined;
      globe.translucency.frontFaceAlpha = 0.25;
      globe.translucency.rectangle = Cesium.Rectangle.fromDegrees(
        120.0,
        30.0,
        140.0,
        45.0
      );
    },

    // 曲面部分
    loadGeoJsonData(url, offset) {
      const geoJsonUrl = url;
      fetch(geoJsonUrl)
        .then((response) => response.json())
        .then((data) => {
          const points = data.features.map((feature) => {
            const coordinates = feature.geometry.coordinates;
            return [coordinates[0], coordinates[1], coordinates[2] - offset];
          });

          this.createSurfaceFromPoints(points);
        });
    },

    createSurfaceFromPoints(points) {
      // 生成插值点以使曲面更平滑
      const interpolatedPoints = this.generateInterpolatedPoints(points);

      // 使用Delaunay三角剖分生成三角网
      const delaunay = d3.Delaunay.from(
        interpolatedPoints.map((p) => [p[0], p[1]])
      );
      const triangles = delaunay.triangles;

      const positions = [];
      const colors = [];
      const indices = [];

      const heights = interpolatedPoints.map((p) => p[2]);
      const minHeight = Math.min(...heights);
      const maxHeight = Math.max(...heights);

      for (let i = 0; i < triangles.length; i += 3) {
        const [a, b, c] = [triangles[i], triangles[i + 1], triangles[i + 2]];
        const pointA = interpolatedPoints[a];
        const pointB = interpolatedPoints[b];
        const pointC = interpolatedPoints[c];

        positions.push(
          Cesium.Cartesian3.fromDegrees(pointA[0], pointA[1], pointA[2])
        );
        positions.push(
          Cesium.Cartesian3.fromDegrees(pointB[0], pointB[1], pointB[2])
        );
        positions.push(
          Cesium.Cartesian3.fromDegrees(pointC[0], pointC[1], pointC[2])
        );

        const colorA = this.getColorFromHeight(pointA[2], minHeight, maxHeight);
        const colorB = this.getColorFromHeight(pointB[2], minHeight, maxHeight);
        const colorC = this.getColorFromHeight(pointC[2], minHeight, maxHeight);
        colors.push(colorA[0], colorA[1], colorA[2], colorA[3]);
        colors.push(colorB[0], colorB[1], colorB[2], colorB[3]);
        colors.push(colorC[0], colorC[1], colorC[2], colorC[3]);

        indices.push(indices.length, indices.length + 1, indices.length + 2);
      }

      const geometry = new Cesium.Geometry({
        attributes: {
          position: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: Cesium.Cartesian3.packArray(positions),
          }),
          color: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.UNSIGNED_BYTE,
            componentsPerAttribute: 4,
            values: new Uint8Array(colors),
            normalize: true,
          }),
        },
        indices: new Uint16Array(indices),
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        boundingSphere: Cesium.BoundingSphere.fromPoints(positions),
      });

      const appearance = new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false,
        renderState: {
          depthTest: {
            enabled: true,
          },
          lineWidth: Math.min(2.0, this.viewer.scene.maximumAliasedLineWidth),
        },
      });

      const primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: geometry,
        }),
        appearance: appearance,
        asynchronous: false,
      });

      this.viewer.scene.primitives.add(primitive);
    },

    getColorFromHeight(height, minHeight, maxHeight) {
      const ratio = (height - minHeight) / (maxHeight - minHeight);
      // 反向设置颜色，高度越高颜色越红
      return Cesium.Color.fromHsl(0.6 * (1 - ratio), 1.0, 0.5, 1.0).toBytes();
    },

    generateInterpolatedPoints(points) {
      const interpolatedPoints = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        for (let t = 0; t <= 1; t += 0.2) {
          // 调整插值步长，减少生成的点数
          const interpolatedPoint = this.catmullRomInterpolate(
            p0,
            p1,
            p2,
            p3,
            t
          );
          interpolatedPoints.push(interpolatedPoint);

          // 限制插值点数量，防止生成过多点导致的栈溢出
          if (interpolatedPoints.length >= 10000) break;
        }

        if (interpolatedPoints.length >= 10000) break;
      }
      return interpolatedPoints;
    },

    catmullRomInterpolate(p0, p1, p2, p3, t) {
      const t2 = t * t;
      const t3 = t2 * t;

      const x =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);

      const y =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

      const z =
        0.5 *
        (2 * p1[2] +
          (-p0[2] + p2[2]) * t +
          (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]) * t2 +
          (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]) * t3);

      return [x, y, z];
    },

    // 加载数据点
    addGeological() {
      // 加载GeoJSON数据
      const geoJsonUrl = "/json/T8_Trans.geojson";
      fetch(geoJsonUrl)
        .then((response) => response.json())
        .then((data) => {
          const pointCollection = new Cesium.PointPrimitiveCollection();
          this.viewer.scene.primitives.add(pointCollection);

          data.features.forEach((feature) => {
            const coordinates = feature.geometry.coordinates;

            const position = Cesium.Cartesian3.fromDegrees(
              coordinates[0],
              coordinates[1],
              coordinates[2] * -1
            );

            pointCollection.add(
              new Cesium.PointPrimitive({
                position: position,
                color: Cesium.Color.RED,
                pixelSize: 1,
              })
            );
          });
        });
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
        -Cesium.Math.toRadians(30),
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
