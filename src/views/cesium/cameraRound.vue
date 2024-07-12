<template>
  <div>
    <!-- 地图容器 -->
    <div id="map" />
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
  </div>
</template>

<script>
import { point, bearing, distance, destination } from '@turf/turf'

export default {
  name: 'Home',
  data() {
    return {
      viewer: null, // Cesium Viewer实例
      heading: 0, // 相机当前朝向角度
      offset: null, // 相机偏移参数
      entity: null // 地图上的实体
    }
  },
  mounted() {
    this.init() // 组件挂载后初始化地图
  },
  methods: {
    init() {

      // // 初始化Cesium Viewer
      // this.viewer = new Cesium.Viewer('map', {
      //   animation: true,
      //   homeButton: true,
      //   geocoder: true,
      //   baseLayerPicker: true,
      //   timeline: true,
      //   fullscreenButton: true,
      //   scene3DOnly: false,
      //   infoBox: true,
      //   sceneModePicker: true,
      //   navigationInstructionsInitiallyVisible: true,
      //   navigationHelpButton: true,
      //   selectionIndicator: true
      // })
      // this.viewer.scene.globe.depthTestAgainstTerrain = true // 启用地形深度测试
      // // Remove default base layer
      // this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0))
      // // Add Sentinel-2 imagery
      // this.viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))
      this.viewer = new Cesium.Viewer('map', {
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
          url:
                'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e',
          layer: 'tdtBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false,
          mininumLevel: 0,
          maximumLevel: 16
        })
      })
      // 添加一个实体到地图上
      this.entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(114, 30),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10
        }
      })
      // this.rotate() // 初始调用旋转方法（可选）
    },
    rotationCamera(degrees) {
      // 调整相机的朝向角度
      this.heading += degrees
    },
    beginRotate() {
      // 开始旋转
      this.viewer.zoomTo(this.entity, this.offset).then(() => {
        this.viewer.clock.onTick.addEventListener(this.rotate) // 注册旋转事件
      })
    },
    stop() {
      // 停止旋转
      this.viewer.clock.onTick.removeEventListener(this.rotate) // 取消旋转事件
      this.viewer.scene.screenSpaceCameraController.enableInputs = true // 恢复相机控制
    },
    rotate() {
      // 旋转方法
      this.heading += 0.1 // 每次调用增加0.1度
      this.offset = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading), -Cesium.Math.toRadians(30), 1000) // 计算新的相机偏移参数
      this.viewer.zoomTo(this.entity, this.offset) // 将相机移到新的位置
      this.viewer.scene.screenSpaceCameraController.enableInputs = false // 禁用相机控制
    }
  }
}
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
