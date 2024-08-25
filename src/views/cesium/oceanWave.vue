<template>
  <div id="map" />
</template>

<script>
// import * as Cesium from "cesium/Cesium";
// import widget from "cesium/Widgets/widgets.css";

export default {
  name: "Home",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var viewer = new Cesium.Viewer("map", {
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
        // 加载天地图
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
      const scene = viewer.scene;
      const globe = scene.globe;
      const baseLayer = viewer.scene.imageryLayers.get(0);
      // 隐藏地球的地面大气层
      globe.showGroundAtmosphere = false;
      //设置地球的基础颜色为透明，以便隐藏海洋
      // globe.baseColor = Cesium.Color.TRANSPARENT
      globe.baseColor = Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.1); // 完全不透明
      // 启用地球的半透明功能，使地球表面可以根据颜色进行透明化处理
      globe.translucency.enabled = true;
      // 清除地下颜色设置（默认情况下禁用地下颜色）
      globe.undergroundColor = undefined;
      // 将基础图层的颜色设为透明，以隐藏特定颜色的部分（通常是黑色）
      baseLayer.colorToAlpha = new Cesium.Color(0.0, 0.0, 0.0);
      // 设置透明化阈值，低于此值的颜色将变得透明
      baseLayer.colorToAlphaThreshold = 0.22;
      // 重新渲染场景

      viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
              rectangle: Cesium.Rectangle.fromDegrees(
                -180.0,
                -90.0,
                180.0,
                90.0
              ),
              vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            }),
          }),
          // 水材质
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: new Cesium.Material({
              fabric: {
                type: "Water",
                uniforms: {
                  // 水区颜色
                  baseWaterColor: new Cesium.Color(
                    89 / 255,
                    148 / 255,
                    236 / 255,
                    0.3
                  ),
                  // 从水区到非水区域混合
                  blendColor: new Cesium.Color(0.5, 1.0, 0.699, 1.0),
                  normalMap: "/img/waterNormals.jpg",
                  specularMap: "/img/earthspec1k.jpg",
                  frequency: 2000.0, // 波浪数量。
                  animationSpeed: 0.01, // 动画速度
                  amplitude: 10.0, // 水波振幅
                  specularIntensity: 0, // 镜面反射强度
                },
              },
            }),
            aboveGround: true,
          }),
          show: true,
        })
      );
    },
  },
};
</script>
<style scoped>
#map {
  width: 100%;
  height: 100%;
  background-color: azure;
}
</style>
