<template>
  <div id="map" />
</template>

<script>

// * id

// 唯一标志，如果没设置，值就为一个默认给定的GUID

// * name

// 名称，可以不唯一

// availability

// 可用性

// * show

// 可见性

// description

// 描述

// position

// 位置

// * orientation

// 方向

// * viewFrom

// 查看此对象的初始偏移量

// parent

// 父节点

// * properties

// 与此实体关联的任意属性。

// * Graphics
// 相关的形状

// box

// corridor

// cylinder

// ellipse

// ellipsoid

// path

// point

// polygon

// polyline

// polylineVolume rectangle

// wall

// billboard

// label

// model
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
      // var viewer = new Cesium.Viewer('map', {
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
      //   selectionIndicator: true // 是否显示指示器组件

      // })
      // // Remove default base layer
      // viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // // Add Sentinel-2 imagery
      // viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))
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
      var wyoming = viewer.entities.add({
        name: 'Wyoming',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -109.080842, 45.002073,
            -105.91517, 45.002073,
            -104.058488, 44.996596,
            -104.053011, 43.002989,
            -104.053011, 41.003906,
            -105.728954, 40.998429,
            -107.919731, 41.003906,
            -109.04798, 40.998429,
            -111.047063, 40.998429,
            -111.047063, 42.000709,
            -111.047063, 44.476286,
            -111.05254, 45.002073]),
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        },
        // description: 'divID'// 方法一
      })

      viewer.zoomTo(wyoming)
      //方法二
      wyoming.description = '\
        <img\
          width="50{ac3c4da2cd0600a7fb5dd7ece3d30a0eed29da11cf2830143610191d982c65a1}"\
          style="float:left; margin: 0 1em 1em 0;"\
          src="/img/test2.jpg"/>\
        <p>\
          怀俄明州是美国西部山区的一个州\
        </p>\
        <p>\
          怀俄明州是面积最大、但人口最少的第十\
也是美国50强中人口密度第二低的\
States.该州西部三分之二的地区大部分被覆盖\
山麓有山脉和牧场\
落基山脉东部，而东三分之一\
该州是一个被称为高平原的高海拔草原。\
夏延是怀俄明州首府和人口最多的城市，\
2013年人口估计为62，448人。\
        </p>\
        <p>\
          来源: \
          <a style="color: WHITE"\
            target="_blank"\
            href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
        </p>';
      // 1.增加一个实体
      // 方法一
      var entity = new Entity({
        id: 'uniqueId'
      })
      viewer.entities.add(entity)

      // 方法一的简写
      viewer.entities.add({
        id: 'uniqueId'
      })

      // 方法二
      var entity = viewer.entities.getOrCreateEntity('uniqueId')

      // 2.查 实体
      var entity = viewer.entities.getById('uniqueId')

      // 3. 删 移除实体的方法：
      // 方法一，先查后删
      // var entity = viewer.entities.getById('uniqueId')
      // viewer.entities.remove(entity)
      // // 方法二，直接删除
      // viewer.entities.removeById('uniqueId')
      // // 方法三，删除所有
      // viewer.entities.removeAll()


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
