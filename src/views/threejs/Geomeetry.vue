<template>
  <!-- 创建一个div容器，用于渲染Three.js的场景 -->
  <div id="container" />
</template>

<script>
import * as THREE from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
// 轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default {
  name: 'Threejs',
  data() {
    return {
      camera: null, // 相机对象
      scene: null, // 场景对象
      renderer: null, // 渲染器对象
      mesh: null, // 网格模型对象Mesh
      controls: null, // 轨道控制器,
      mesh2: null
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

      // // 创建一个立方体几何体
      // const geometry = new THREE.BoxGeometry(1, 1, 1)
      // // 创建一个基本材质，并设置颜色为绿色
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // 创建一个网格（几何体 + 材质）
      // this.mesh = new THREE.Mesh(geometry, material)
      // 将网格添加到场景中
      // this.scene.add(this.mesh)

      // 设置相机的位置
      this.camera.position.set(3, 2, 5)
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
      this.controls.autoRotate = false

      // 检查WebGL兼容性
      if (WebGL.isWebGLAvailable()) {
        this.animate()
      } else {
        const warning = WebGL.getWebGLErrorMessage()
        container.appendChild(warning)
      }
      // const material2 = new THREE.MeshBasicMaterial({ color: 'red' })
      // this.mesh2 = new THREE.Mesh(geometry, material2)

      // this.mesh.position.set(0, 0, 0)
      // this.mesh2.position.set(3, 0, 3)

      // this.scene.add(this.mesh2)
      // BufferGeomeetry属性
      // attributes：分量，分量属性将数据直接送往cpu进行处理，定义一个形体，你需要至少创建一个Float32Array数组，其中每三个要素定义一个顶点的三维空间坐标，每个三维定点即数组中的九个要素，确定一个面，该数组可以创建并传到分量中。
      // index：索引，一般不需要特意指定面，因为默认情况下position分量中，每三个空间坐标确定一个面，但是我们可以通过index属性，像THREE.gemotry类一样去指定用于组成每个面的顶点。

      const geometry = new THREE.BufferGeometry()
      const tempArr = []
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * 2 - 1
        const y = Math.random() * 2 - 1
        const z = Math.random() * 2 - 1
        tempArr.push(x, y, z)
      }
      const pointsArray = new Float32Array([...tempArr])
      // 创建顶点属性
      geometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3))

      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true, // 开启透明
        // opacity: 0.5, //设置透明度
        side: THREE.DoubleSide // 两面可见
      })
      // 需要一个 Mesh（网格）
      this.mesh = new THREE.Mesh(geometry, material)
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
