<template>
  <div>
    <div id="cesiumMap" class="cesium" />
  </div>
</template>

<script>
import InfoTool from './src/InfoTool/InfoTool.js' // 弹窗工具
import line from './src/line' // 浮动光线
import pointList from './src/point.json' // 所有的点位信息
import seaArea from './src/sea.json' // 海面范围
import axios from 'axios'
import './cesiumUtils/CesiumHeatmap.js'
import './cesiumUtils/PolylineTrailLinkMaterialProperty'

export default {
  name: 'CaseOne',
  mixins: [line],
  data() {
    return {
      infoToolPop: null, // 弹窗
      buoyPositions: [], // 浮标位置
      standards: [0, 1, 2, 3, 4, 5, 6, 7], // 风浪等级（晴天、大风、降水） 12*h
      waveHeight: 2, // 当前浪高
      worldRectangle: false,
      wf: [0.01, 0.04, 0.08, 0.1, 0.13, 0.15, 0.18, 0.2]
    }
  },
  mounted() {
    // Vue生命周期钩子，组件挂载后执行
    this.$nextTick(() => {
      this.initCesium() // 初始化Cesium地图
    })
  },
  methods: {
    // 初始化Cesium场景
    initCesium() {
      // 设置Cesium Ion的默认访问令牌
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NTQxNDQ2NC0zZWY2LTQ2OTMtYTFmOS02M2I3ZjIyYzM1NGQiLCJpZCI6OTkzMjgsImlhdCI6MTY1NjQwOTIyMH0.n5tUNTClw_pGhOV70R6hCR2HLFEUe81hxnflRp3VSTU'
      // 创建Cesium Viewer实例
      const viewer = new Cesium.Viewer('cesiumMap', {
        geocoder: false, // 位置查找工具
        animation: false, // 左下角动画控件
        baseLayerPicker: false, // 图层选择器
        fullscreenButton: false, // 全屏按钮
        vrButton: false, // VR按钮
        homeButton: false, // 复位按钮
        infoBox: false, // 信息框
        sceneModePicker: false, // 场景模式选择器
        selectionIndicator: false, // 选择指示器
        timeline: false, // 时间轴
        navigationHelpButton: false, // 导航帮助按钮
        navigationInstructionsInitiallyVisible: false, // 初始导航说明
        navigation: true, // 导航
        sceneModel: Cesium.SceneMode.SCENE3D, // 3D场景模式
        orderIndependentTranslucency: false, // 无序独立透明度
        contextOptions: {
          webgl: {
            alpha: true // WebGL透明度
          }
        },
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          // url: 'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}' // 高德地图
          // url: 'https://t2.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=bcbfc51cf0b20e1e0fad16fb77c7d0c4' // 天地图
          // url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}' // 全球影像地址
          url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/9812/{z}/{y}/{x}' // 影像图层
        })
      })
      window.viewer = viewer // 将viewer绑定到window对象上
      this.initData() // 开始加载模型

      //   this.showOrHideWave() // 添加区域水面
      this.addFlow() // 添加波浪
      // 开启抗锯齿
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) { // 判断是否支持图像渲染像素化处理
        viewer.resolutionScale = window.devicePixelRatio // 设置分辨率比例
      }
      viewer.scene.fxaa = true // 开启快速近似抗锯齿
      viewer.scene.postProcessStages.fxaa.enabled = true // 启用后处理阶段的快速近似抗锯齿
      viewer.scene.globe.depthTestAgainstTerrain = false // 禁用地形深度测试
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息

      // 声明一个loading对象
      const loading = this.$loading({
        lock: true, // 锁屏
        text: '加载中...', // 加载动画的文字
        spinner: 'el-icon-loading', // 加载图标
        background: 'rgba(0, 0, 0, 0.7)' // 背景颜色
      })

      // 初始化动画设置
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 500000000), // 初始相机位置
        orientation: {
          heading: 0.2079384332084935,
          roll: 0.00031509431759868534,
          pitch: -1.0
        },
        duration: 3 // 动画持续时间
      })

      // 相机飞行设置
      this.camera({
        position: { x: 0, y: 0, z: 24000000 },
        orientation: { roll: 6.2079384332084935, heading: 0.00031509431759868534, pitch: -1.535 },
        duration: 2
      }, () => {
        setTimeout(() => {
          if (loading) {
            loading.close() // 关闭loading
          }

          this.camera({
            position: { x: 123.051061, y: 25.758157, z: 24000000 },
            orientation: { roll: 6.2079384332084935, heading: 0.00031509431759868534, pitch: -1.535 },
            duration: 8
          }, () => {
            // 飞行后回调函数->继续飞行
            this.camera({
              position: { x: 123.051061, y: 25.758157, z: 2400000 },
              orientation: { roll: 6.2079384332084935, heading: 0.00031509431759868534, pitch: -1.535 },
              duration: 2
            }, () => {
              // 飞行后回调函数->继续飞行
              this.camera({
                position: { x: 123.061061, y: 23.758157, z: 350000 },
                orientation: { roll: 0, heading: 0, pitch: -0.5 },
                duration: 2
              }, () => {
                // // 飞行后回调函数->初始化线
                this.initLines(pointList)
              })
            })
          })
        }, 2000)
      })

      // 初始化InfoTool 弹窗
      this.infoToolPop = new InfoTool(viewer)

      // 监听点击事件
      let coordinate = {} // 保存点击的坐标
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 创建事件处理器
      handler.setInputAction(event => {
        const cartesian = viewer.camera.pickEllipsoid(event.position) // 获取点击位置的笛卡尔坐标
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian) // 转换为地理坐标
        const lng = Cesium.Math.toDegrees(cartographic.longitude) // 经度
        const lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬度
        const alt = cartographic.height // 高度，椭球面高度永远为0
        coordinate = {
          longitude: Number(lng.toFixed(6)), // 保留6位小数的经度
          latitude: Number(lat.toFixed(6)), // 保留6位小数的纬度
          altitude: Number(alt.toFixed(2)) // 保留2位小数的高度
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK) // 左键点击事件

      // 监听选中实体变化事件
      viewer.selectedEntityChanged.addEventListener(evt => {
        if (evt) {
          setTimeout(() => {
            this.initPopShow(evt, coordinate) // 初始化弹窗显示
          })
        }
      })

      // 弹窗点击事件处理
      window.popupClick = (key) => {
        this.$emit('handleSeaBuoy') // 触发父组件的handleSeaBuoy事件
      }
    },

    // 相机飞行方法
    camera(opt, callback) {
      window.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(opt.position.x, opt.position.y, opt.position.z), // 相机飞行目标位置
        orientation: opt.orientation, // 相机飞行朝向
        duration: opt.duration, // 飞行持续时间
        complete: () => {
          if (callback) { callback() } // 飞行完成后的回调函数
        }
      })
    },
    // 初始化弹窗设置
    initPopShow(layer, position) {
      const options = {
        position: Cesium.Cartesian3.fromDegrees(
          position.longitude,
          position.latitude,
          0
        ),
        content: {
          title: '浮标信息',
          props: {
            浮标编号: layer['_id'],
            经度: position.longitude,
            纬度: position.latitude
          },
          button: {
            key: 'detail',
            label: '查看详情'
          }
        }
        // parent: entity.parent
      }
      const callback = {}
      this.infoToolPop.add(options, callback)
    },
    // 初始化数据模型
    initData() {
      const that = this
      const data = pointList
      const features = data.features
      features.forEach(feature => {
        switch (feature.properties.equiptype) {
          case 'buoy':
            that.buoyPositions.push(feature)
            this.addBuoy(feature) // 添加单个浮标
            break
          case 'platform':
            // 添加普通模型
            this.addCommonModel({
              id: feature.properties.type,
              scale: 6000,
              url: '/static/models/sea/ZuanJingPingTai.glb',
              position: {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                z: 0
              }
            })
            break
          case 'tower':
            this.addCommonModel({
              id: feature.properties.type,
              scale: 300,
              url: '/static/models/sea/FengLiFaDianJi.glb',
              position: {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                z: 0
              }
            })
            break
          case 'xht':
            this.addCommonModel({
              id: feature.properties.type,
              scale: 3000,
              url: '/static/models/sea/Ta.glb',
              position: {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                z: 0
              }
            })
            break
          case 'wx':
            this.addCommonModel({
              id: feature.properties.type,
              scale: 600,
              url: '/static/models/sea/WeiXing.glb',
              position: {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                z: 180000
              }
            })
            break
          case 'jz':
            this.addCommonModel({
              id: feature.properties.type,
              scale: 3000,
              url: '/static/models/sea/JiZhan.glb',
              position: {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                z: 0
              }
            })
            break
          case 'marker': {
            if (feature.properties.type === 'A0' || feature.properties.type === 'A5') {
              this.addCommonModel({
                id: feature.properties.type,
                scale: 2000,
                url: '/static/models/sea/DaSha.glb',
                position: {
                  x: feature.geometry.coordinates[0],
                  y: feature.geometry.coordinates[1],
                  z: 0
                }
              })
            }
            const opt = {
              position: feature.geometry.coordinates,
              label: feature.properties.type
            }
            setTimeout(() => {
              this.addLabelMaker(opt)
            }, 15000)
          }
            break
        }
      })
    },
    // 添加普通模型（无动作）
    addCommonModel(opt) {
      window.viewer.entities.add({
        id: opt.id,
        position: new Cesium.Cartesian3.fromDegrees(opt.position.x, opt.position.y, opt.position.z),
        // 模型基础信息
        model: {
          uri: opt.url,
          scale: opt.scale
        }
      })
    }, // 添加文字标注
    addLabelMaker(opt) {
      window.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(opt.position[0], opt.position[1], 10000),
        label: {
          text: opt.label,
          font: 'normal 20px MicroSoft YaHei',
          fillColor: Cesium.Color.fromCssColorString('#10ff00')
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          // disableDepthTestDistance: 99000000,
        }
      })
    },
    // 添加单个浮标
    addBuoy(feature) {
      const that = this
      const id = feature.properties.type
      const coords = feature.geometry.coordinates
      // 添加模型
      const vehicleEntity = window.viewer.entities.add({
        id: id,
        position: new Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 0),
        // 模型基础信息
        model: {
          uri: '/static/three/models/10M_FenZuJian_220909.gltf',
          scale: 700
        }
      })
      // 确定步长，如果波高小，步长就大，波高大，步长小
      let frequency = 1
      for (let i = 0; i < this.standards.length; i++) {
        if (this.standards[i] === this.waveHeight) {
          frequency = this.standards.length - this.waveHeight
          break
        }
      }
      const range = 5 * that.waveHeight // 摆动幅度 5°*浪高
      let over = false
      const height = that.waveHeight * 5// 模型放大了1千倍，所以起伏高度也放大1000倍
      let h = Math.floor(Math.random() * 100)
      h = h % 2 === 0 ? h : -1 * h
      let pitch = 0
      let tempParam = 0
      // 控制模型旋转角度
      vehicleEntity.orientation = new Cesium.CallbackProperty(function() {
        const mesh = window.viewer.entities.getById(id)
        const p = mesh.position._value// 获取position
        tempParam = Math.sin(0.01 * h)
        if (!over) {
          pitch = tempParam * range
          p.z = p.z + tempParam * height
          // p.z = p.z + 0.05
          h = h + 6
          if (h > 180) { over = true }
        } else {
          pitch = tempParam * range
          p.z = p.z - tempParam * height
          // p.z = p.z - 0.05
          // 确保p.z是有效值
          if (isNaN(p.z)) {
            p.z = 0
            alert('Invalid p.z value: NaN')
          }
          h = h - 6
          if (h < -180) {
            over = false
          }
        }

        const hpr = new Cesium.HeadingPitchRoll(0, Cesium.Math.toRadians(pitch), 0)
        return Cesium.Transforms.headingPitchRollQuaternion(p, hpr)
      }, false)
    },
    // 定义一个显示或隐藏波浪的函数
    showOrHideWave() {
      const that = this
      const scene = window.viewer.scene // 获取场景对象

      // 获取海域的几何特征
      const features = seaArea.features
      const instances = [] // 用于存储几何实例

      // 检查是否已经创建了几何体
      if (this.geometry === undefined) {
        // 遍历每一个海域特征
        for (let i = 0; i < features.length; i++) {
          for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
            // 将多边形坐标转换为数组
            const polygonArrayStr = features[i].geometry.coordinates[j].toString().split(',')
            const polygonArray = []
            polygonArrayStr.forEach(item => {
              polygonArray.push(parseFloat(item)) // 将字符串转换为浮点数
            })

            // 创建多边形几何体
            const polygon = new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(polygonArray) // 将坐标转换为笛卡尔坐标
              ),
              extrudedHeight: 5 // 设置挤出高度
            })

            // 创建几何体实例
            const geometry = this.geometry = Cesium.PolygonGeometry.createGeometry(polygon)
            instances.push(new Cesium.GeometryInstance({
              geometry: geometry,
              attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN) // 设置颜色属性
              }
            }))
            this.instances = instances // 保存几何实例
          }
        }
      }

      // 定义一个函数来应用水材质
      function applyWaterMaterial(primitive, scene) {
        primitive.appearance.material = new Cesium.Material({
          fabric: {
            type: 'Water',
            uniforms: {
              specularMap: '/static/texture/global_world.jpg', // 高光贴图
              normalMap: '/static/img/admin/watex80.jpg', // 法线贴图
              frequency: that.wf[7 - that.waveHeight] * 10000, // 波动频率
              animationSpeed: that.wf[that.waveHeight - 1], // 动画速度
              amplitude: that.waveHeight * 10000 // 波幅
            }
          }
        })
      }

      // 如果已经存在海面矩形，则移除
      if (this.worldRectangle) {
        window.viewer.scene.primitives.remove(this.worldRectangle)
        this.worldRectangle = undefined
      }

      // 创建新的海面矩形
      const worldRectangle = this.worldRectangle = window.viewer.scene.primitives.add(new Cesium.Primitive({
        id: 'sea',
        geometryInstances: this.instances, // 使用已创建的几何实例
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          aboveGround: true // 设置为地面上
        }),
        show: true, // 显示
        asynchronous: false // 同步渲染
      }))

      // 应用水材质
      applyWaterMaterial(worldRectangle, scene)
    },
    // 海浪
    addFlow() {
      var bounds = {
        west: 73.18, south: 10.68, east: 142.81, north: 45.08
      }
      window.heatMap = CesiumHeatmap.create(
        window.viewer, // your cesium viewer
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
      axios.get('http://119.167.138.12:6902/lte/sampledata/flow.json').then(request => {
        const res = request.data
        if (res) {
          this.drawFlow(res)
          var data = []
          res.forEach(function(item) {
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
        window.instances.push(window.viewer.entities.add({
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
    }
  }
}
</script>
