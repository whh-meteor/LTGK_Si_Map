<template>
  <!-- 模板部分 -->
  <div>
    <!-- 地图容器，设置宽度为100%，高度为800像素 -->
    <div id="map" class="container" style="width: 100%; height: 800px;" />
  </div>
</template>

<script>
import * as maptalks from 'maptalks' // 引入maptalks库

export default {
  name: 'MapComponent', // 组件名称
  data() {
    return {
      label: '' // 数据部分，定义一个label变量
    }
  },
  mounted() {
    this.initMapTalk() // 组件挂载完成后调用initMapTalk方法初始化地图
  },
  methods: {
    initMapTalk() {
      var base = new maptalks.TileLayer('base', { // 添加瓦片图层作为地图的基础图层
        urlTemplate: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        subdomains: ['a', 'b', 'c', 'd'], // 子域名，用于负载均衡
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 版权信息
      })
      // 创建一个新的maptalks地图对象
      var map = new maptalks.Map('map', {
        center: [-0.13039431874999536, 51.97239313116968], // 地图中心点坐标
        zoom: 7, // 地图缩放级别
        baseLayer: base
      })
      // 创建一个新的矢量图层，并添加到地图中
      var layer = new maptalks.VectorLayer('vector').addTo(map)

      // 创建一个绘图工具，初始模式为“点”
      var drawTool = new maptalks.DrawTool({
        mode: 'Point'
      }).addTo(map).disable() // 添加到地图并禁用

      // 定义工具栏的项目，包括各种绘图模式和功能
      var items = ['Point', 'LineString', 'Polygon', 'Circle', 'Ellipse', 'Rectangle', 'FreeHandLineString', 'FreeHandPolygon'].map(function (value) {
        return {
          item: value, // 项目的名称
          click: function () {
            drawTool.setMode(value).enable() // 设置绘图模式并启用绘图工具
          }
        }
      })

      // 创建一个工具栏并添加到地图中
      var toolbar = new maptalks.control.Toolbar({
        items: [
          {
            item: 'Shape', // 工具栏的主项目
            children: items // 子项目，即各种绘图模式
          },
          {
            item: 'Disable', // 禁用绘图工具的按钮
            click: function () {
              drawTool.disable() // 禁用绘图工具
            }
          },
          {
            item: 'Clear', // 清除矢量图层的按钮
            click: function () {
              layer.clear() // 清空矢量图层
            }
          }
        ]
      }).addTo(map)

      // 创建一个新的矢量图层，并添加到地图中
      var layer2 = new maptalks.VectorLayer('vector2').addTo(map)

      // 创建一个新的LineString对象，并添加到矢量图层中
      var line = new maptalks.LineString(
        [
          [4.460010082031204, 50.41204897711654], // 点1坐标
          [3.7129397695312036, 51.05869036408862], // 点2坐标
          [3.2295413320312036, 51.20347195727524], // 点3坐标
          [1.0872073476562036, 51.27225609350862], // 点4坐标
          [-0.15424773046879636, 51.5053534272480] // 点5坐标
        ],
        {
          symbol: { // 线的样式
            'lineColor': '#1bbc9b', // 线的颜色
            'lineWidth': 3, // 线的宽度
            'lineDasharray': [10, 10], // 虚线样式
            'markerFile': '/img/Airplane.png', // 标记图像文件路径
            'markerPlacement': 'vertex', // 标记放置位置，顶点
            'markerVerticalAlignment': 'middle', // 标记垂直对齐方式
            'markerWidth': 64, // 标记宽度
            'markerHeight': 64 // 标记高度
          }
        }
      ).addTo(layer2) // 将LineString添加到矢量图层中

      var layer3 = new maptalks.VectorLayer('vector3', polygon).addTo(map)
      var polygon = new maptalks.Polygon([
        [
          [-5.131049, 45.498568],
          [-0.107049, 45.498568],
          [-0.107049, 51.493568],
          [-5.131049, 51.493568],
          [-5.131049, 45.498568]
        ]
      ], {
        visible: true,
        editable: true,
        cursor: 'pointer',
        draggable: false,
        dragShadow: false, // display a shadow during dragging
        drawOnAxis: null, // force dragging stick on a axis, can be: x, y
        symbol: {
          'lineColor': '#34495e',
          'lineWidth': 2,
          'polygonFill': 'rgb(135,196,240)',
          'polygonOpacity': 0.6
        }
      }).addTo(layer3)
      console.log(layer3)
      // 创建一个 MarkerLayer
      var layer4 = new maptalks.VectorLayer('vector4')
        .addTo(map);
      var extent = map.getExtent()
      var min = extent.getMin()
      var w = extent.getWidth()
      var h = extent.getHeight()
      var markers = []
      for (var i = 0; i < 100; i++) {
        markers.push(new maptalks.Marker([min.x + Math.random() * w, min.y + Math.random() * h]))
      }
      layer4.addGeometry(markers)

      // 监听绘图结束事件
      drawTool.on('drawend', function (param) {
        console.log(param.geometry) // 打印绘制的几何图形
        layer.addGeometry(param.geometry) // 将几何图形添加到矢量图层中

        // 根据绘制矩形获取边界坐标
        var boundary = [[
          [param.geometry._coordinates[0].x, param.geometry._coordinates[0].y],
          [param.geometry._coordinates[1].x, param.geometry._coordinates[1].y],
          [param.geometry._coordinates[2].x, param.geometry._coordinates[2].y],
          [param.geometry._coordinates[3].x, param.geometry._coordinates[3].y],
          [param.geometry._coordinates[0].x, param.geometry._coordinates[0].y]
        ]]
        console.log(boundary) // 打印绘制的几何图形
        var mask = new maptalks.Polygon(boundary, {
          'symbol': [
            {

              'polygonOpacity': 1,
              'polygonFill': 'rgb(0,0,0)',
              'lineColor': 'rgb(0,0,0)',
              'lineWidth': 1
            }
          ]
        })


        // layer4.setMask(mask).addTo(map)

        // map.animateTo({
        //   center: [param.geometry.startLat, param.geometry.startLon],
        //   zoom: 18,
        //   // pitch: 65,
        //   // bearing: 360
        // }, {
        //   duration: 0
        // });


        var allLayers = map.getLayers();
        for (var i = 0; i < allLayers.length; i++) {
          if (!allLayers[i].getMask()) {
            allLayers[i].setMask(
              new maptalks.Polygon(boundary, {
                'symbol': [
                  {

                    'polygonOpacity': 1,
                    'polygonFill': 'rgb(0,0,0)',
                    'lineColor': 'rgb(0,0,0)',
                    'lineWidth': 1
                  }
                ]
              })
            );
          } else {
            allLayers[i].getMask().setCoordinates(boundary);
          }
        }
      })

      var boundary = [[[109.191369116306319, 19.736612649767874], [109.191347658634214, 19.736794423924326], [109.19259220361711, 19.736531861187487], [109.195274412632031, 19.735562395035053], [109.209500849247036, 19.730068642352247], [109.209565222263379, 19.72653395894347], [109.209264814853711, 19.726453165265738], [109.209028780460415, 19.726069394738637], [109.203707277774839, 19.726089593210407], [109.203664362430601, 19.726594554174969], [109.202827513217969, 19.727099513543749], [109.201840460300488, 19.728028634612741], [109.2000594735146, 19.728715372799819], [109.195961058139844, 19.730270621899336], [109.192656576633482, 19.731401702643819], [109.192999899387388, 19.731745064856661], [109.192849695682554, 19.732048030902128], [109.192163050174742, 19.73196724001286], [109.191154539585142, 19.732674158908559], [109.19169098138812, 19.735461408639065], [109.191369116306319, 19.736612649767874]]]
    }
  }
}
</script>

<style scoped>
/* 可以添加自定义样式 */
#map {
  width: 100%;
  /* 地图容器宽度 */
  height: 100%;
  /* 地图容器高度 */
  background-color: azure;
  /* 地图容器背景颜色 */
}

html,
body {
  margin: 0px;
  /* 去除默认的外边距 */
  height: 100%;
  /* 设置高度为100% */
  width: 100%;
  /* 设置宽度为100% */
}

.container {
  float: left;
  /* 左浮动布局 */
  width: 100%;
  /* 宽度为100% */
  height: 100%;
  /* 高度为100% */
}

#info {
  position: fixed;
  /* 固定定位 */
  background-color: rgba(13, 13, 13, 0.5);
  /* 半透明背景颜色 */
  padding: 10px 10px 10px 10px;
  /* 内边距 */
  font: 13px bold sans-serif;
  /* 字体样式 */
  color: #fff;
  /* 字体颜色 */
  left: 0px;
  /* 距左边0像素 */
  top: 0px;
  /* 距顶部0像素 */
  width: 100%;
  /* 宽度为100% */
  height: 70px;
  /* 高度为70像素 */
  overflow: hidden;
  /* 隐藏溢出内容 */
}
</style>
