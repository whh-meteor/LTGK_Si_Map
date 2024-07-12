import { LineFlowMaterialProperty } from './polylineMaterial'
// import * as Cesium from "cesium/Cesium";
import { initPath, setModelScale, stopTrackEntity, trackEntity } from './path'
import polyline from './polyline.json'

export default {
  mounted() {
  }, data() {
    return {
      lineIds: [0]
    }
  }, methods: {
    /**
             * 移除路径
             * @param id
             */
    removeEntityById(id) {
      window.viewer.entities.remove(window.viewer.entities.getById(id))
    }, 
    initMountainPathPlay() {
      window.viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: 'http://inner.qdlimap.cn:7001/GisServer/terrain/haishanzhouwei/'
      })
      const sea = new Cesium.UrlTemplateImageryProvider({
        url: 'http://inner.qdlimap.cn:7001/GisServer/terrain/haidi_wenli_quanqiu/{z}/{x}/{y}.png'
      })
      window.viewer.imageryLayers.addImageryProvider(sea, 1)
      const t = 4
      window.viewer.scene.globe.terrainExaggeration = t
      window.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(156.53161020845033, 11.415844854324565, 200022),
        orientation: { roll: 0.0015543983024004504, heading: 6.22000337604658, pitch: -1.096564258158123 }
      })
      setTimeout(() => {
        window.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(156.2, 12.0, 0),
          orientation: { roll: 0.0015543983024004504, heading: 6.22000337604658, pitch: -0.45196564258158123 },
          duration: 5,
          complete: () => {
            let paths = [[156.26, 12.16, -3000 * t], [156.24, 12.26, -3000 * t], [156.27, 12.35, -3000 * t]]
            paths = this.getLineDots(paths, 100)
            this.pathPlay({
              paths, // camera:{
              //   destination: Cesium.Cartesian3.fromDegrees(156.26, 12.16, -3000 * t),
              //   orientation : {roll: 0, heading:0, pitch: -1.5698490520914739},
              //   duration: 2,
              // },
              model: 'static/Models/jlh.glb', speed: 6, scale: 0.1, fixed: true
            })
          }
        })
      }, 3000)
    },
     initGlobalPathPlay() {
      const lat = 21
      const paths = []
      for (let i = 120; i < 361; i++) {
        paths.push([i, lat, 200000])
      }
      for (let i = 0; i < 121; i++) {
        paths.push([i, lat, 200000])
      }
      const camera = {
        destination: Cesium.Cartesian3.fromDegrees(120, 25, 18000000),
        orientation: { roll: 0, heading: 0, pitch: -1.5698490520914739 },
        duration: 2
      }
      window.viewer.camera.flyTo({
        ...camera, complete: () => {
          this.pathPlay({
            paths, camera: camera, model: 'static/Models/jlh.glb', speed: 20, scale: 0, fixed: false
          })
        }
      })
    }, /**
         * 创建/移除路径
         * @param val 是否开启
         */
    pathPlay({ paths, camera, model, scale, fixed, speed }) {
      stopTrackEntity(window.viewer)
      initPath({ viewer: window.viewer, id: 'path', paths, speed, model })
      trackEntity({ viewer: window.viewer, id: 'path', fixed, camera })
      setModelScale(window.viewer, 'path', scale || 0)
    }, /**
         * 移除路径
         * @param id
         */
    removePath() {
      stopTrackEntity(window.viewer)
      this.removeEntityById('path')
    }, removeEntity(id) {
      window.viewer.entities.remove(window.viewer.entities.getById(id))
    }, /**
         * 移除流光线
         * @param type 1 浮标汇聚线，2海底光缆线，不传移除所有
         */
    removeLines(type) {
      let lines = this.lineIds
      if (type === 1) {
        lines = this.lineIds.filter(i => i.includes('line-'))
      }
      if (type === 2) {
        lines = this.lineIds.filter(i => !i.includes('line-'))
      }
      lines.forEach(i => {
        this.removeEntity(i)
      })
    }, /**
         * 流光线
         */
    initLines(pointList) {
      // 所有点位
      const allDotInfos = pointList.features.map(i => {
        return {
          coords: i.geometry.coordinates, name: i.properties.type, properties: i.properties
        }
      })
      // 到信号塔的浮标
      const xhtBuoyDots = allDotInfos.filter(i => i.properties.equiptype === 'buoy' && i.properties.area === 'xht')
      xhtBuoyDots.forEach(i => i.coords = [...i.coords, 100]) // 设置点高度
      // 到卫星的浮标
      const wxBuoyDots = allDotInfos.filter(i => i.properties.equiptype === 'buoy' && i.properties.area === 'wx')
      wxBuoyDots.forEach(i => i.coords = [...i.coords, 100]) // 设置点高度
      // 信号塔
      const xhtDots = allDotInfos.filter(i => i.properties.equiptype === 'xht')
      xhtDots.forEach(i => i.coords = [...i.coords, 9000])
      // 卫星
      const wxDots = allDotInfos.filter(i => i.properties.equiptype === 'wx')
      wxDots.forEach(i => i.coords = [...i.coords, 180000])
      // 基站
      const jzDots = allDotInfos.filter(i => i.properties.equiptype === 'jz')
      jzDots.forEach(i => i.coords = [...i.coords, 100])
      // 中心
      const zxName = ['A0', 'A5']
      const zxDots = allDotInfos.filter(i => i.properties.equiptype === 'marker' && zxName.includes(i.properties.type))
      zxDots.forEach(i => i.coords = [...i.coords, 100])
      // 观测塔
      const gctDots = allDotInfos.filter(i => i.properties.equiptype === 'tower')
      gctDots.forEach(i => i.coords = [...i.coords, 100])
      // 观测塔和海缆连接点
      const gctName = gctDots.map(i => i.properties.area)
      const gctMarkerDots = allDotInfos.filter(i => i.properties.equiptype === 'marker' && gctName.includes(i.properties.type))
      gctMarkerDots.forEach(i => i.coords = [...i.coords, 100])
      // 平台
      const platformDots = allDotInfos.filter(i => i.properties.equiptype === 'platform')
      platformDots.forEach(i => i.coords = [...i.coords, 100])
      // 观测塔和海缆连接点
      const platformName = platformDots.map(i => i.properties.area)
      const platformMarkerDots = allDotInfos.filter(i => i.properties.equiptype === 'marker' && platformName.includes(i.properties.type))
      platformMarkerDots.forEach(i => i.coords = [...i.coords, 100])
      // 浮标-信号塔线
      this.initLineData(xhtBuoyDots, xhtDots, 0, '#02ffff')
      // 浮标-卫星线
      this.initLineData(wxBuoyDots, wxDots, 0, '#ffea02')
      // 信号塔-基站线
      this.initLineData(xhtDots, jzDots, 0, '#10ff00')
      // 卫星-基站线
      this.initLineData(wxDots, zxDots, 0, '#02ffff')
      // 基站-中心线
      this.initLineData(jzDots, zxDots, 0.4, '#10ff00', 3)
      // 观测塔-海缆线
      this.initLineData(gctDots, gctMarkerDots, 0.4, '#10ff00', 3)
      // 平台-海缆线
      this.initLineData(platformDots, platformMarkerDots, 0.4, '#10ff00', 3)
      // })
      // fetch('http://inner.qdlimap.cn:7001/GisServer/terrain/polyline.json')
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((data) => {
      // 所有线数据
      const data = polyline
      const allLineInfo = data.features.map(i => {
        const coords = i.geometry.coordinates.reverse()
        return {
          coords: coords.map(i => [...i, 100]), name: i.id, properties: i.properties
        }
      })
      // 绘制海底管道虚线
      const gdLine = allLineInfo.filter(i => i.properties.name)
      gdLine.forEach((line, index) => {
        this.drawLine(line.coords, {
          width: 1,
          color: Cesium.Color(255, 255, 255, 0.5), animation: false, dash: true, label: {
            text: '',
            show: true,
            fillColor: Cesium.Color.fromCssColorString('#ffffff'),
            font: 'normal 14px MicroSoft YaHei',
            showBackground: false,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP
            // disableDepthTestDistance: Number.POSITIVE_INFINITY,
          }
        }, line)
      })
      // 绘制海缆流动线
      const glLine = allLineInfo.filter(i => !i.properties.name)
      glLine.forEach((line, index) => {
        this.drawLine(line.coords, {
          gradient: 0.4,
          width: 3, color: Cesium.Color.fromCssColorString('#10ff00'), animation: true
        }, line)
      })
      // })
    }, /**
         * 绘制不同类型点之间的连接线,多对一
         * @param dotData1 汇聚起点集合
         * @param dotData2 汇聚终点集合
         * @param gradient 宽度
         * @param color 颜色
         * @param width 宽度
         */
    initLineData(dotData1, dotData2, gradient, color, width) {
      const lineData = dotData1.map(i => {
        const dots = dotData2.filter(a => (a.properties.equiptype === i.properties.area || a.properties.type === i.properties.area))
        return dots.map(dot => {
          return {
            coords: [i.coords, dot.coords],
            fillColor: Cesium.Color.fromCssColorString('#10ff00'),
            name: 'line-' + i.name + '-' + dot.name,
            properties: i.properties
          }
        })
      })
      lineData.forEach((lines, index) => {
        lines.forEach(line => {
          const entity = window.viewer.entities.getById(line.name)
          if (!entity) {
            this.drawLine(line.coords, {
              width: width || 1,
              gradient: gradient,
              color: Cesium.Color.fromCssColorString(color || '#ffffff'),
              // color: Cesium.Color(0,0,0,0),
              animation: true
            }, line)
          }
        })
      })
    },
    /**
             * 绘制线
             * @param coords 线坐标
             * @param option 线信息
             * @param line 线信息
             */
    drawLine(coords, option, line) {
      // 绘制线
      const allPosition = []
      coords.forEach(p => {
        allPosition.push(...p)
      })
      if (allPosition.length < 6) {
        return
      }
      // 默认材质
      let material = option.color || Cesium.Color.YELLOW.withAlpha(1)
      if (option.animation) { // 动效
        material = new LineFlowMaterialProperty({
          color: option.color || new Cesium.Color(1.0, 1.0, 0.0, 1), // 颜色
          speed: option.speed || 20, // 速度
          percent: option.percent || 0.3, // 粒子长度
          gradient: option.gradient // 背景色透明度
        })
      }
      if (option.dash) { // 虚线
        material = new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString('#1a6dcf'),
          dashLength: 20 // 短划线长度
        })
      }
      const middle = parseInt(coords.length / 2 || 0)
      const entity = {
        name: line.name,
        id: line.name ? line.name : 'temp' + new Date(),
        position: Cesium.Cartesian3.fromDegrees(...coords[middle]),
        polyline: {
          show: true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(allPosition),
          width: option.width || 2,
          material: material,
          clampToGround: false,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      }
      if (option.label) {
        entity.label = option.label
        entity.label.text = line.properties.name
      }
      this.lineIds.push(line.name)
      window.viewer.entities.add(entity)
    }, /**
         * 点插值
         * @param position 坐标
         * @param num 个数
         * @returns {[number, number][]}
         */
    getLineDots(position, num) {
      if (position.length === 0) {
        return []
      }
      const points = position.map(i => {
        return Cesium.Cartesian3.fromDegrees(...i)
      })
      const times = points.map((i, idx) => 0 + idx * 1 / (points.length - 1))
      const spline = new Cesium.HermiteSpline.createNaturalCubic({
        times: times, points: points
      })
      let positions = []
      const pointNums = num // 插值个数
      for (let i = 0; i <= pointNums; i++) {
        const cartesian3 = spline.evaluate(i / pointNums)
        positions.push(cartesian3)
      }
      positions = positions.map(i => {
        var ellipsoid = window.viewer.scene.globe.ellipsoid
        var cartographic = ellipsoid.cartesianToCartographic(i)
        var lat = Cesium.Math.toDegrees(cartographic.latitude)
        var lng = Cesium.Math.toDegrees(cartographic.longitude)
        var height = cartographic.height
        if (position[0][2]) {
          return [lng, lat, height]
        } else {
          return [lng, lat]
        }
      })
      return positions
    }
  }

}
