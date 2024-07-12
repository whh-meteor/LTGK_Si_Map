<template>
  <div id="map" />
</template>

<script>

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
      var viewer = new Cesium.Viewer('map', {
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

      // !!!! ColorMaterialProperty-颜色材质!!!!
      // 方法一，构造时赋材质
      var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.BLUE.withAlpha(0.5)// 可设置不同的MaterialProperty
        }
      })

      //   方法二，构造后赋材质
      var entity2 = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-100.0, 43.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0
        }
      })
      var ellipse = entity2.ellipse
      ellipse.material = Cesium.Color.RED
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      // 监听颜色变化
      handler.setInputAction(function(movement) {
        var pickedObject = viewer.scene.pick(movement.endPosition)
        // console.log(Cesium.defined(pickedObject) )
        // console.log(pickedObject.id)
        // console.log(Cesium.defined(pickedObject) && pickedObject.id === entity)
        if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
          entity.ellipse.material = Cesium.Color.YELLOW // 鼠标移入，改变颜色为黄色
        } else {
          entity.ellipse.material = Cesium.Color.BLUE.withAlpha(0.5)// 鼠标移出，恢复原颜色
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // !!! ImageMaterialProperty - 图片-贴图! !!!
      var entity3 = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-105.0, 35.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.BLUE.withAlpha(0.5)// 可设置不同的MaterialProperty
        }
      })
      var ellipse3 = entity3.ellipse
      // 完整的这么写
      ellipse3.material = new Cesium.ImageMaterialProperty({
        image: 'img/test.jpg',
        repeat: new Cesium.Cartesian2(2, 2)
      })

      // !!!! CheckerboatdMaterialProperty - 棋盘纹理 !!!!
      var entity4 = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-107.0, 30.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.BLUE.withAlpha(0.5)// 可设置不同的MaterialProperty
        }
      })
      entity4.ellipse.material = new Cesium.CheckerboardMaterialProperty({
        evenColor: Cesium.Color.WHITE, // evenColor 默认白色，棋盘的第一个颜色
        oddColor: Cesium.Color.BLACK, // oddColor 默认黑色，第二个颜色
        repeat: new Cesium.Cartesian2(4, 4) // repeat 重复次数
      })
      // !!!! StripeMaterialProperty - 条纹纹理 !!!!
      var entity5 = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-95.0, 36.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.BLUE.withAlpha(0.5)// 可设置不同的MaterialProperty
        }
      })

      entity5.ellipse.material = new Cesium.StripeMaterialProperty({
        evenColor: Cesium.Color.WHITE, // color 网格颜色
        oddColor: Cesium.Color.BLACK, // 默认黑色，第二个颜色
        repeat: 32, //  条纹重复次数
        offset: 20, // 偏移量
        orientation: Cesium.StripeOrientation.VERTICAL // orientation 水平或者垂直,默认水平
      })

      // !!!! GridMaterialProperty -网格 !!!!
      var entity6 = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-95.0, 32.0),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.BLUE.withAlpha(0.5)// 可设置不同的MaterialProperty
        }
      })

      entity6.ellipse.material = new Cesium.GridMaterialProperty({
        color: Cesium.Color.YELLOW, // color 网格颜色
        cellAlpha: 0.2, // cellAlpha 单元格透明度
        lineCount: new Cesium.Cartesian2(8, 8), // lineCount 行列个数
        lineThickness: new Cesium.Cartesian2(2.0, 2.0) // lineThickness 线粗细 lineOffset 线偏移
      })

      // Polyline PolylineGlowMaterialProperty 发光线
      var entity7 = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-95, 50,
            -109.1, 50]),
          width: 5,
          material: Cesium.Color.RED
        }})
      //   viewer.zoomTo(viewer.entities)

      entity7.polyline.material = new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2, // glowPower 发光的长度，值为线宽的百分比(0~1.0)
        color: Cesium.Color.RED // color 发光的颜色(中心颜色为白色）
      })

      // ！！！！ PolylineOutlineMaterialProperty ！！！！
      var entity8 = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([-95, 48,
            -109.1, 48]),
          width: 5,
          material: Cesium.Color.RED
        }})
      entity8.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.ORANGE, // color 线的颜色
        outlineWidth: 3, // outlineWidth 线纹理宽度 
        outlineColor: Cesium.Color.BLACK // outlineColor 线纹理颜色
      })
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
