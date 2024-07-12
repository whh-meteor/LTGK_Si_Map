<template>
  <!-- 地图的容器，设置宽度和高度 -->
  <div id="map" style="width: 100%; height: 800px;" />
</template>

<script>
import 'maptalks/dist/maptalks.css' // 导入 maptalks 的 CSS 样式
import * as maptalks from 'maptalks' // 导入 maptalks 库，用于地图功能
import '@maptalks/gl' // 导入 maptalks 的 GL 扩展
import * as THREE from 'three' // 导入 three.js 库，用于 3D 图形
import 'maptalks.three' // 导入 maptalks 的 three.js 扩展
import * as dat from 'dat.gui' // 导入 dat.gui 库，用于图形用户界面
import buildings from './buildings.js' // 导入包含建筑物数据的文件

import { ThreeLayer } from 'maptalks.three' // 导入 three.js 的图层
import { GroupGLLayer } from '@maptalks/gl-layers' // 导入 GL 图层

export default {
  name: 'MapComponent',
  data() {
    return {
      threeLayer: '', // three.js 图层
      material: '', // three.js 材料
      meshs: [] // 存储 3D 模型的数组
    }
  },
  mounted() {
    this.initMap() // 组件挂载时初始化地图
  },
  methods: {
    initMap() {
      // 初始化地图
      var map = new maptalks.Map('map', {
        center: [13.415118329414781, 52.53001062340084], // 设置地图中心点
        zoom: 16, // 设置地图缩放级别
        pitch: 70, // 设置地图倾斜角度
        centerCross: true, // 显示中心十字
        doubleClickZoom: false, // 禁用双击缩放
        baseLayer: new maptalks.TileLayer('tile', {
          urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', // 瓦片图层的 URL 模板
          subdomains: ['a', 'b', 'c', 'd'], // 子域名
          attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>' // 版权信息
        })
      })

      var features = []
      // 将所有建筑物的特征合并到一个数组中
      buildings.forEach(function(b) {
        features = features.concat(b.features)
      })

      // 创建 three.js 图层
      this.threeLayer = new ThreeLayer('t', {
        forceRenderOnMoving: true, // 在移动时强制渲染
        forceRenderOnRotating: true // 在旋转时强制渲染
      })

      // 创建材料
      this.material = new THREE.MeshLambertMaterial({ color: '#fff', transparent: true })
      var highlightmaterial = new THREE.MeshBasicMaterial({ color: 'yellow', transparent: true })

      // 准备绘制 three.js 图层
      this.threeLayer.prepareToDraw = function(gl, scene, camera) {
        var light = new THREE.DirectionalLight(0xffffff)
        light.position.set(0, -10, 10).normalize() // 设置光源位置
        scene.add(light) // 添加光源到场景
        scene.add(new THREE.AmbientLight('#fff', 0.2)) // 添加环境光

        var that = this
        // 为每个建筑物创建 3D 模型
        features.forEach(function(g) {
          var heightPerLevel = 10 // 每层的高度
          var levels = g.properties.levels || 1 // 获取建筑物的层数，默认为 1 层
          var mesh = that.threeLayer.toExtrudePolygon(maptalks.GeoJSON.toGeometry(g), {
            height: levels * heightPerLevel, // 设置建筑物的高度
            topColor: '#fff', // 设置顶面的颜色
            asynchronous: true // 异步生成模型
          }, that.material)

          // 设置工具提示
          mesh.setToolTip(levels * heightPerLevel, {
            showTimeout: 0,
            eventsPropagation: true,
            dx: 10
          })

          // 设置信息窗口
          mesh.setInfoWindow({
            content: 'hello world,height:' + levels * heightPerLevel, // 信息窗口的内容
            title: 'message', // 信息窗口的标题
            animationDuration: 0, // 动画持续时间
            autoOpenOn: false // 是否自动打开
          });

          // 为模型添加事件监听器
          ['click', 'mousemove', 'mouseout', 'mouseover', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(function(eventType) {
            mesh.on(eventType, function(e) {
              // 根据事件类型改变模型的材质
              if (e.type === 'mouseout') {
                this.setSymbol(this.material)
              }
              if (e.type === 'mouseover') {
                this.setSymbol(highlightmaterial)
              }
            })
          })

          // 将模型添加到数组中
          that.meshs.push(mesh)
        })
        // 将模型添加到 three.js 图层
        this.threeLayer.addMesh(this.meshs)
        // 为第一个模型添加事件监听器
        this.meshs[0].on('show hide symbolchange', function(e) {
          // console.log(e.type, e)
        })
        this.initGui() // 初始化 dat.gui
        this.threeLayer.config('animation', true) // 启用动画
      }.bind(this)

      // 配置场景
      const sceneConfig = {
        postProcess: {
          enable: true, // 启用后处理
          antialias: { enable: true } // 启用抗锯齿
        }
      }
      // 创建组图层
      const groupLayer = new GroupGLLayer('group', [this.threeLayer], { sceneConfig })
      groupLayer.addTo(map) // 将组图层添加到地图
    },
    initGui() {
      // 配置 dat.gui 参数
      var params = {
        add: true,
        color: this.material.color.getStyle(),
        show: true,
        opacity: 1,
        altitude: 0,
        animateShow: this.animateShow
      }
      var gui = new dat.GUI()

      // 添加模型控制
      gui.add(params, 'add').onChange(() => {
        if (params.add) {
          this.threeLayer.addMesh(this.meshs) // 添加模型
        } else {
          this.threeLayer.removeMesh(this.meshs) // 移除模型
        }
      })

      // 添加颜色控制
      gui.addColor(params, 'color').name('building color').onChange(() => {
        this.material.color.set(params.color)
        this.meshs.forEach((mesh) => {
          mesh.setSymbol(this.material)
        })
      })

      // 添加透明度控制
      gui.add(params, 'opacity', 0, 1).onChange(() => {
        this.material.opacity = params.opacity
        this.meshs.forEach((mesh) => {
          mesh.setSymbol(this.material)
        })
      })

      // 添加显示控制
      gui.add(params, 'show').onChange(() => {
        this.meshs.forEach((mesh) => {
          if (params.show) {
            mesh.show()
          } else {
            mesh.hide()
          }
        })
      })

      // 添加高度控制
      gui.add(params, 'altitude', 0, 300).onChange(() => {
        this.meshs.forEach((mesh) => {
          mesh.setAltitude(params.altitude)
        })
      })

      gui.add(params, 'animateShow') // 添加动画控制
    },
    animateShow() {
      // 执行动画显示
      this.meshs.forEach(function(mesh) {
        mesh.animateShow({
          duration: 3000 // 动画持续时间
        })
      })
    }
  }
}
</script>

<style>
html,
body,
#map {
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
