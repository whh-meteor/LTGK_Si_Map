<template>
  <!-- 创建一个div容器，用于渲染Three.js的场景 -->
  <div id="container" />
</template>

<script>
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
// 轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
export default {
  name: 'Threejs',
  data() {
    return {
      camera: null, // 相机对象
      scene: null, // 场景对象
      renderer: null, // 渲染器对象
      mesh: null, // 网格模型对象Mesh
      controls: null // 轨道控制器
    }
  },
  mounted() {
    // 组件挂载后初始化场景
    this.init()
  },
  methods: {
    init() {
      const container = document.getElementById('container')
      // 创建一个场景对象
      this.scene = new THREE.Scene()

      // 创建一个透视相机
      /**
         * PerspectiveCamera:
         * 参数一：视野角度，单位是角度。
         * 参数二：长宽比。
         * 参数三：近截面和远截面，只有在这些截面之间的物体才会被渲染。
         */
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 700)

      // 创建渲染器，加上抗锯齿
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      // 设置渲染器的宽高
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      // 设置设备像素比，以支持高分辨率显示设备
      this.renderer.setPixelRatio(window.devicePixelRatio)
      // 将渲染器的DOM元素（canvas）添加到容器中
      container.appendChild(this.renderer.domElement)

      // 设置相机的位置
      this.camera.position.set(2, 2, 5)
      // 设置相机看向原点
      this.camera.lookAt(0, 0, 0)

      // 添加一个坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(3)
      this.scene.add(axesHelper)

      // 添加轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // 启用阻尼效果
      this.controls.enableDamping = true
      // 设置阻尼系数
      this.controls.dampingFactor = 0.05
      // 启用自动旋转
      // this.controls.autoRotate = true

      // 检查WebGL兼容性
      if (WebGL.isWebGLAvailable()) {
        this.animate()
      } else {
        const warning = WebGL.getWebGLErrorMessage()
        container.appendChild(warning)
      }

      // 二、共用顶点
      // 使用索引绘制
      // var geometry = new THREE.BufferGeometry()
      // const vertices = new Float32Array([
      //   -1.0, -1.0, 0.0,
      //   1.0, -1.0, 0.0,
      //   1.0, 1.0, 0.0,
      //   -1.0, 1.0, 0
      // ])
      // // 创建顶点属性
      // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      // // 创建索引
      // const indice = new Uint16Array([0, 1, 2, 2, 3, 0])
      // // 设置索引
      // geometry.setIndex(new THREE.BufferAttribute(indice, 1))
      // // 创建材质
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0xffff00, // 材质颜色
      //   side: THREE.DoubleSide, // 是否正反面都可看
      //   wireframe: true// 线框
      // })

      // const material2 = new THREE.MeshBasicMaterial({
      //   color: 0xff00, // 材质颜色
      //   side: THREE.DoubleSide // 是否正反面都可看
      // })
      // 设置两个顶点组，形成两个素材
      // geometry.addGroup(0, 3, 0)
      // geometry.addGroup(3, 3, 1)
      // this.mesh = new THREE.Mesh(geometry, [material, material2])


      const cubeGemoetry = new THREE.BoxGeometry(1, 1, 1);//创建材质
      const material0 = new THREE.MeshBasicMaterial({
        color: 0x00ff00,  //材质颜色
        side: THREE.DoubleSide,  //是否正反面都可看
      })
      const material1 = new THREE.MeshBasicMaterial({
        color: 0xff0000,  //材质颜色
        side: THREE.DoubleSide,  //是否正反面都可看
      })
      const material2 = new THREE.MeshBasicMaterial({
        color: 0x00ffff,  //材质颜色
        side: THREE.DoubleSide,  //是否正反面都可看
      })
      const material3 = new THREE.MeshBasicMaterial({
        color: 0x000f00,  //材质颜色
        side: THREE.DoubleSide,  //是否正反面都可看
      })
      const material4 = new THREE.MeshBasicMaterial({
        color: 0xf0ff00,  //材质颜色
        side: THREE.DoubleSide,  //是否正反面都可看
      })
      const material5 = new THREE.MeshBasicMaterial({
        color: 0xff00ff,  //材质颜色
        side: THREE.DoubleSide,  //是否正反面都可看
      })
      this.mesh = new THREE.Mesh(cubeGemoetry, [material0, material1, material2, material3, material4, material5]);
      // 添加物体到网格
      this.scene.add(this.mesh);

      // 添加物体到网格
      this.scene.add(this.mesh)


    },
    animate() {
      // 递归调用自身以实现动画效果
      requestAnimationFrame(this.animate.bind(this))
      // 旋转立方体
      // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y += 0.01
      // 渲染场景和相机
      this.renderer.render(this.scene, this.camera)
      // 更新控制器
      this.controls.update()
    }
  }
}
</script>

<style>
/* 设置容器的宽高，使其占满整个视口 */
#container {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>
