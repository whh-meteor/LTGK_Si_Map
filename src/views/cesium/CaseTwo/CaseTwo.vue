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
import axios from 'axios'
import '../CaseOne/cesiumUtils/CesiumHeatmap.js'
import '../CaseOne/cesiumUtils/PolylineTrailLinkMaterialProperty'
import pointList from '../CaseOne/src/point.json' // 所有的点位信息
import seaArea from '../CaseOne//src/sea.json' // 海面范围
import { point, bearing, distance, destination } from '@turf/turf'
import * as d3 from 'd3-delaunay'
import { initPath } from './src/path'
import * as turf from '@turf/turf'

export default {
  name: 'Home',
  data() {
    return {
      viewer: null, // Cesium Viewer实例
      heading: 0, // 相机当前朝向角度
      offset: null, // 相机偏移参数
      entity: null // 地图上的实体
      , inTime: undefined,
      outTime: undefined,
      shipId: undefined,
      shipNames: [],
      shipPath: undefined,
      showWarning: false,
      turfWarnArea: null
    }
  },
  mounted() {
    this.init() // 组件挂载后初始化地图
  },
  methods: {

    init() {
      // 设置Cesium默认的Ion访问令牌
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'

      // 初始化Cesium Viewer
      this.viewer = new Cesium.Viewer('map', {
        terrainProvider: Cesium.createWorldTerrain({
          requestWaterMask: true, // 请求水面掩码
          requestVertexNormals: true // 请求顶点法线
        })
      })
      // 启用地形深度测试
      this.viewer.scene.globe.depthTestAgainstTerrain = true
      // 配置Cesium的地表穿透（underground）设置：
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000 // 允许镜头进入地下
      this.viewer.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z // 允许从顶部视角进入地下
      // 地球半透明设置
      // this.viewer.scene.globe.material = Cesium.Material.fromType('Color')
      // this.viewer.scene.globe.material.uniforms.color = new Cesium.Color(1.0, 1.0, 1.0, 0.5); // 设置透明度为50%

      this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false

      // 添加一个实体到地图上
      this.entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120, 33),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10
        }
      })

      // 初始化动画设置
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(120, 33, 50000), // 初始相机位置
        orientation: {
          heading: 0.2079384332084935,
          roll: 0.00031509431759868534,
          pitch: -1.0
        },
        duration: 3 // 动画持续时间
      })
      // this.rotate() // 初始调用旋转方法（可选）
      // this.loadGeoJsonData('/json/T8_Trans.geojson', 500000) // 渲染面
      // this.loadGeoJsonData('/json/T9_Trans.geojson', 600000) // 渲染面
      // this.loadGeoJsonData('/json/T10_Trans.geojson', 700000) // 渲染面
      // this.loadGeoJsonData('/json/T13_Trans.geojson', 800000) // 渲染面
      //原始点
      this.addGeological('/json/T8_Trans.geojson')
      this.addGeological('/json/T9_Trans.geojson')
      this.addGeological('/json/T10_Trans.geojson')
      this.addGeological('/json/T13_Trans.geojson')
      //插值点
      // this.addGeologicalInter()
      // this.reset()
      //地球透明 海水部分
      this.useTranslucencyMask()
      //添加部分海洋流场
      this.addFlow()
      //添加船运动与路线，围墙
      this.drawWall()
      this.initShipData()
      this.showPath()
    },

    // 路线部分
    initShipData() {
      let that = this
      // let p = axios.get("http://inner.qdlimap.cn:7001/GisServer/terrain/shipPath.json");
      // p.then((response) => {
      // if (response.status === 200) {
      var response = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "Id": 0,
              "type": "ShipType1",
              "otherProperty": "value1"
            },
            "geometry": {
              "coordinates": [
                [
                  122.08570642594748,
                  31.461898501692374
                ],
                [
                  122.93784465873495,
                  31.406892169864868
                ],
                [
                  123.76824028729777,
                  31.5188327735149
                ]
              ],
              "type": "LineString"
            }
          }
        ]
      }
      let paths = []
      let features = response.features
      console.log(features)
      features.forEach((feature, index) => {
        if (feature.properties.Id === 0) {
          this.shipPath = ({
            coords: feature.geometry.coordinates,
            name: feature.properties.type,
            properties: feature.properties,
          })
        }
        let path = []
        feature.geometry.coordinates.forEach(coord => {
          path.push([...coord, 100])
        })
        paths.push(path)
      })

      for (let i = 0; i < paths.length; i++) {
        that.shipNames.push(features[i].properties.Id)
        initPath({
          viewer: this.viewer,
          id: features[i].properties.Id,
          paths: paths[i],
          speed: 0.1,
          model: "/static/models/sea/ship.glb"
        })
        let entity = this.viewer.entities.getById(features[i].properties.Id)
        entity.properties = { isInWarn: false }
        let isIn = false
        console.log(entity)
        var self = this
        entity.model.scale = new Cesium.CallbackProperty(() => {
          let curtime = this.viewer.clock.currentTime;
          let pos = entity._position.getValue(curtime, null);
          let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
          let lon = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          // 判断

          let result = turf.booleanPointInPolygon(turf.point([lon, lat]), that.turfWarnArea)
          if (result) {

            if (!isIn) {
              that.showWarning = true;
              that.inTime = new Date().toLocaleString()
              that.shipId = "粤番渔0532"
            }
            isIn = true
            entity.properties._isInWarn._value = true
            that.updateWall()
          } else {
            if (isIn) {
              that.outTime = new Date().toLocaleString()
              isIn = false
              entity.properties._isInWarn._value = false
              that.updateWall()
            }
          }
          return 50
        }, false)
      }
      // }
      // }, (error) => {
      // });
    },
    showPath() {
      if (this.shipPath && this.shipPath.coords) {
        let positions = this.shipPath.coords.map(coord => {
          return Cesium.Cartesian3.fromDegrees(coord[0], coord[1], coord[2]);
        });

        let pathEntity = this.viewer.entities.add({
          name: this.shipPath.name,
          polyline: {
            positions: positions,
            width: 5,
            material: Cesium.Color.fromCssColorString('#00f').withAlpha(0.7)
          }
        });

        // 可选：可以缩放到船舶路径
        this.viewer.zoomTo(pathEntity);
      } else {
        console.warn('船舶路径数据未正确初始化。');
      }
    },
    drawWall() {
      let that = this
      if (!this.turfWarnArea) {
        this.coordinates = []
        this.maximumh = []
        this.minimumH = []
        let center = [122.816, 31.449];
        let radius = 30;
        let options = { steps: 50, units: 'kilometers', properties: { foo: 'bar' } };
        let circleFeature = turf.circle(center, radius, options);
        let circleCoords = circleFeature.geometry.coordinates[0]
        circleCoords.forEach(coord => {
          this.coordinates.push(coord[0])
          this.coordinates.push(coord[1])
          this.coordinates.push(14000)
          this.maximumh.push(14000)
          this.minimumH.push(1000)
        })
        this.turfWarnArea = turf.polygon(circleFeature.geometry.coordinates)
        console.log(this.turfWarnArea)
      }
      let rgba = Cesium.Color.fromCssColorString(that.warn ? '#FF0000' : '#00FF33')
      this.wall = this.viewer.entities.add({
        id: "wall",
        wall: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.coordinates),
          maximumHeights: this.maximumh,
          minimumHeights: this.minimumH,
          material: new Cesium.ImageMaterialProperty({
            transparent: true,//设置透明
            image:
              that.getColorRamp({
                0.0: rgba.withAlpha(1.0).toCssColorString().replace(')', ',1.0)'),
                0.045: rgba.withAlpha(0.8).toCssColorString(),
                0.1: rgba.withAlpha(0.6).toCssColorString(),
                0.15: rgba.withAlpha(0.4).toCssColorString(),
                0.37: rgba.withAlpha(0.2).toCssColorString(),
                0.54: rgba.withAlpha(0.1).toCssColorString(),
                1.0: rgba.withAlpha(0).toCssColorString()
              })
          }),
        }
      });
    },
    updateWall() {
      let temp = false
      // 看看有没有船在警戒区
      this.shipNames.forEach(shipName => {
        if (this.viewer.entities.getById(shipName).properties.isInWarn._value)
          temp = true
      })
      // 有船在警戒区且绿色 或者 没有船在警戒区为红色
      if ((temp && !this.warn) || (!temp && this.warn)) {
        this.warn = !this.warn
        this.viewer.entities.remove(this.viewer.entities.getById("wall"))
        this.wall = undefined
        this.drawWall()
      }
    },
    removeJJ() {
      for (let i = 1; i < 11; i++) {
        let ship = this.viewer.entities.getById("船" + i)
        if (ship) {
          this.viewer.entities.remove(ship)
        }
      }
      this.warn = false
      this.viewer.entities.remove(this.viewer.entities.getById("wall"))
      this.wall = undefined
    },
    getColorRamp(val) {
      if (val == null) {
        val = { 0.0: "blue", 0.1: "cyan", 0.37: "lime", 0.54: "yellow", 1: "red" }
      }
      let ramp = document.createElement('canvas');
      ramp.width = 1;
      ramp.height = 100;
      let ctx = ramp.getContext('2d');
      let grd = ctx.createLinearGradient(0, 0, 0, 100);
      for (let key in val) {
        grd.addColorStop(1 - Number(key), val[key]);
      }
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 1, 900);
      return ramp;
    },
    // 地球部分
    reset() {
      const scene = this.viewer.scene
      const globe = scene.globe
      const baseLayer = this.viewer.scene.imageryLayers.get(0)
      globe.showGroundAtmosphere = true
      globe.baseColor = Cesium.Color.BLUE
      globe.translucency.enabled = false
      globe.translucency.frontFaceAlpha = 1.0
      globe.undergroundColor = Cesium.Color.BLACK
      globe.translucency.rectangle = undefined
      baseLayer.colorToAlpha = undefined
    },
    useTranslucencyMask() {
      const scene = this.viewer.scene
      const globe = scene.globe
      const baseLayer = this.viewer.scene.imageryLayers.get(0)
      globe.showGroundAtmosphere = false
      globe.baseColor = Cesium.Color.TRANSPARENT
      globe.translucency.enabled = true
      globe.undergroundColor = undefined

      // Set oceans on Bing base layer to transparent
      baseLayer.colorToAlpha = new Cesium.Color(0.0, 0.0, 0.0)
      baseLayer.colorToAlphaThreshold = 0.2
    },
    useTranslucencyRectangle() {
      const scene = this.viewer.scene
      const globe = scene.globe
      const baseLayer = this.viewer.scene.imageryLayers.get(0)
      globe.translucency.enabled = true
      globe.undergroundColor = undefined
      globe.translucency.frontFaceAlpha = 0.25
      globe.translucency.rectangle = Cesium.Rectangle.fromDegrees(
        120.0,
        30.0,
        140.0,
        45.0
      )
    },

    // 曲面部分
    loadGeoJsonData(url, offset) {
      const geoJsonUrl = url
      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          const points = data.features.map(feature => {
            const coordinates = feature.geometry.coordinates
            return [coordinates[0], coordinates[1], coordinates[2] - offset]
          })

          this.createSurfaceFromPoints(points)
        })
    },

    createSurfaceFromPoints(points) {
      // 生成插值点以使曲面更平滑
      const interpolatedPoints = this.generateInterpolatedPoints(points)

      // 使用Delaunay三角剖分生成三角网
      const delaunay = d3.Delaunay.from(interpolatedPoints.map(p => [p[0], p[1]]))
      const triangles = delaunay.triangles

      const positions = []
      const colors = []
      const indices = []

      const heights = interpolatedPoints.map(p => p[2])
      const minHeight = Math.min(...heights)
      const maxHeight = Math.max(...heights)

      for (let i = 0; i < triangles.length; i += 3) {
        const [a, b, c] = [triangles[i], triangles[i + 1], triangles[i + 2]]
        const pointA = interpolatedPoints[a]
        const pointB = interpolatedPoints[b]
        const pointC = interpolatedPoints[c]

        positions.push(Cesium.Cartesian3.fromDegrees(pointA[0], pointA[1], pointA[2]))
        positions.push(Cesium.Cartesian3.fromDegrees(pointB[0], pointB[1], pointB[2]))
        positions.push(Cesium.Cartesian3.fromDegrees(pointC[0], pointC[1], pointC[2]))

        const colorA = this.getColorFromHeight(pointA[2], minHeight, maxHeight)
        const colorB = this.getColorFromHeight(pointB[2], minHeight, maxHeight)
        const colorC = this.getColorFromHeight(pointC[2], minHeight, maxHeight)
        colors.push(colorA[0], colorA[1], colorA[2], colorA[3])
        colors.push(colorB[0], colorB[1], colorB[2], colorB[3])
        colors.push(colorC[0], colorC[1], colorC[2], colorC[3])

        indices.push(indices.length, indices.length + 1, indices.length + 2)
      }

      const geometry = new Cesium.Geometry({
        attributes: {
          position: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: Cesium.Cartesian3.packArray(positions)
          }),
          color: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.UNSIGNED_BYTE,
            componentsPerAttribute: 4,
            values: new Uint8Array(colors),
            normalize: true
          })
        },
        indices: new Uint16Array(indices),
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        boundingSphere: Cesium.BoundingSphere.fromPoints(positions)
      })

      const appearance = new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false,
        renderState: {
          depthTest: {
            enabled: true
          },
          lineWidth: Math.min(2.0, this.viewer.scene.maximumAliasedLineWidth)
        }
      })

      const primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: geometry,
          id: 'surfaceEntity' // 设置唯一标识符
        }),
        appearance: appearance,
        asynchronous: false
      })

      this.viewer.scene.primitives.add(primitive)

      // 添加点击事件监听器
      // 添加点击事件监听器
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      handler.setInputAction(movement => {
        const pickedObject = this.viewer.scene.pick(movement.position);
        console.log('Picked object:', pickedObject); // 输出 pickedObject 以调试
        if (Cesium.defined(pickedObject) && pickedObject.primitive === primitive) {
          // 当点击了面时，显示简介信息
          this.showInfo();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    showInfo() {
      // 显示简介信息的逻辑，例如在控制台输出或者在 UI 上显示
      alert('Surface clicked!')
      // 你可以将信息显示在 HTML 元素中，例如一个侧边栏
      // document.getElementById('infoPanel').innerHTML = 'This is the surface information.';
    },
    getColorFromHeight(height, minHeight, maxHeight) {
      const ratio = (height - minHeight) / (maxHeight - minHeight)
      // 反向设置颜色，高度越高颜色越红
      return Cesium.Color.fromHsl(0.6 * (1 - ratio), 1.0, 0.5, 1.0).toBytes()
    },

    generateInterpolatedPoints(points) {
      const interpolatedPoints = []
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[Math.min(i + 2, points.length - 1)]

        for (let t = 0; t <= 1; t += 0.2) { // 调整插值步长，减少生成的点数
          const interpolatedPoint = this.catmullRomInterpolate(p0, p1, p2, p3, t)
          interpolatedPoints.push(interpolatedPoint)

          // 限制插值点数量，防止生成过多点导致的栈溢出
          if (interpolatedPoints.length >= 10000) break
        }

        if (interpolatedPoints.length >= 10000) break
      }
      return interpolatedPoints
    },

    catmullRomInterpolate(p0, p1, p2, p3, t) {
      const t2 = t * t
      const t3 = t2 * t

      const x = 0.5 * ((2 * p1[0]) +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)

      const y = 0.5 * ((2 * p1[1]) +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)

      const z = 0.5 * ((2 * p1[2]) +
        (-p0[2] + p2[2]) * t +
        (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]) * t2 +
        (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]) * t3)

      return [x, y, z]
    },

    // 海浪
    addFlow() {
      var bounds = {
        west: 73.18, south: 10.68, east: 142.81, north: 45.08
      }
      window.heatMap = CesiumHeatmap.create(
        this.viewer, // your cesium viewer
        bounds, // bounds for heatmap layer
        { // heatmap相应参数
          backgroundColor: 'rgba(0,0,0,0)',
          radius: 50,
          maxOpacity: 0.5,
          minOpacity: 0,
          blur: 0.75,
          gradient: { // the gradient used if not given in the heatmap options object
            '.3': '#76adff',
            '.65': '#167fff',
            '.8': '#003dd8',
            '.95': '#002090'
          }
        }
      )
      // axios.get('http://119.167.167.32:6902/lte/sampledata/flow.json').then(request => {
      axios.get('/json/flow.json').then(request => {
        const res = request.data
        if (res) {
          this.drawFlow(res)
          var data = []
          res.forEach(function (item) {
            var x = parseFloat(item[1]) // 将经度字符串转换为浮点数
            var y = parseFloat(item[2]) // 将纬度字符串转换为浮点数
            var value = item[3] * 10
            data.push({ x: x, y: y, value: value })
          })
          console.log(data)
          window.heatMap.setWGS84Data(0, 10, data)
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.error('error：', err)
      })
    },
    // 绘制流场
    drawFlow(data) {
      Cesium.PolylineTrailLinkMaterialProperty.add2Material()
      var material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.Green, 2000)
      material.color = new Cesium.Color(255, 255, 255, 0.2)
      var length = data.length
      var instances = []
      window.instances = []
      for (var i = 0; i < length; i++) {
        var item = data[i]
        var points = this.parabolaEquation([item[1] - 0, item[2] - 0, -4000], (item[4] - 0) * (Math.PI / 180), (item[3] - 0) * 2, 6)
        var pointArr = []
        for (var j = 0; j < points.length; j++) {
          pointArr.push(points[j][0], points[j][1], points[j][2])
        }
        window.instances.push(this.viewer.entities.add({
          name: 'PolylineTrailLink' + i,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
            width: 2,
            material: material

          }
        }))
      }
    },
    // 抛物线方程
    parabolaEquation(startPoint, angle, length, number) {
      var result = []
      var z0 = typeof (startPoint[2]) === 'undefined' ? 0 : startPoint[2] // 让旋涡在同一平面上
      var z1 = typeof (startPoint[2]) === 'undefined' ? 0 : startPoint[2]
      var num = typeof (number) === 'undefined' && number < 3 ? 10 : number
      var dz0 = z1 - z0
      var x0 = startPoint[0]
      var y0 = startPoint[1]
      var lengthChange = length / number
      var heightChange = dz0 / number
      for (var i = 0; i < num; i++) {
        var x, y, z
        var lengthAdd = lengthChange * i
        z = z0 + heightChange * i
        y = Math.cos(angle) * lengthAdd + y0
        x = Math.sin(angle) * lengthAdd + x0
        result.push([x, y, z])
      }
      return result
    },
    // 清空流场
    clearFlow() {
      window.heatMap.remove()
      window.instances.forEach(item => {
        item._show = false
      })
    },

    // 加载数据点
    addGeological(url) {

      const geoJsonUrl = url
      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          const pointCollection = new Cesium.PointPrimitiveCollection()
          this.viewer.scene.primitives.add(pointCollection)

          data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates

            const position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], (coordinates[2]) * -1)

            pointCollection.add(new Cesium.PointPrimitive({
              position: position,
              color: Cesium.Color.GREEN,
              pixelSize: 1
            }))
          })
        })
    },
    // 插值加载数据点（性能是个大问题）
    addGeologicalInter() {
      const geoJsonUrl = '/json/T8_Trans.geojson';
      const BATCH_SIZE = 1000; // 每批次加载的点数量

      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          const pointCollection = new Cesium.PointPrimitiveCollection({
            blendOption: Cesium.BlendOption.OPAQUE // 设置blendOption优化性能
          });
          this.viewer.scene.primitives.add(pointCollection);

          const positions = [];

          data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;

            // 增加密度的部分
            const pointsPerFeature = 20; // 每个原始点生成的附加点数量减少
            for (let i = 0; i < pointsPerFeature; i++) {
              // 生成随机偏移量
              const offsetLat = (Math.random() - 0.5) * 0.2;  // 调整随机偏移量
              const offsetLon = (Math.random() - 0.5) * 0.2;  // 调整随机偏移量
              const offsetAlt = (Math.random() - 0.5) * 0.7;   // 调整随机偏移量

              const position = Cesium.Cartesian3.fromDegrees(
                coordinates[0] + offsetLon,
                coordinates[1] + offsetLat,
                (coordinates[2] + offsetAlt) * -1
              );

              positions.push(position);
            }
          });

          function addBatch(startIndex) {
            for (let i = startIndex; i < Math.min(startIndex + BATCH_SIZE, positions.length); i++) {
              pointCollection.add(new Cesium.PointPrimitive({
                position: positions[i],
                color: Cesium.Color.GREEN,
                pixelSize: 1  // 调整点的大小
              }));
            }

            if (startIndex + BATCH_SIZE < positions.length) {
              // 使用 requestAnimationFrame 或 setTimeout 分批次加载
              requestAnimationFrame(() => addBatch(startIndex + BATCH_SIZE));
            }
          }

          // 开始批量添加点
          addBatch(0);
        });

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
