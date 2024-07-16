<template>
    <div>
      <div id="map">
        <div id="toolbar" class="page">
          <table>
            <tbody>
              <tr>
                <td>是否可查看地下掩埋模型</td>
                <td>
                  <input v-model="viewModel.translucencyEnabled" type="checkbox">
                </td>
              </tr>
              <tr>
                <td>按距离衰减</td>
                <td>
                  <input v-model="viewModel.fadeByDistance" type="checkbox">
                </td>
              </tr>
  
              <tr>
                <td>透明度</td>
                <td>
                  <input v-model="viewModel.alpha" type="range" min="0.0" max="1.0" step="0.1">
                  <input v-model="viewModel.alpha" type="text" size="5">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    // 初始化数据
    data() {
      return {
        viewModel: {
          translucencyEnabled: true, // 是否启用透明效果
          fadeByDistance: true, // 是否按距离衰减透明度
          showVectorData: false, // 是否显示矢量数据
          alpha: 0.5 // 透明度值
        }
      }
    },
    // 组件挂载后执行
    mounted() {
      // 设置Cesium默认的Ion访问令牌
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'
  
      // 初始化Cesium Viewer
      this.viewer = new Cesium.Viewer('map', {
        terrainProvider: Cesium.createWorldTerrain({
          requestWaterMask: true, // 请求水面掩码
          requestVertexNormals: true // 请求顶点法线
        })
      })
  
      this.scene = this.viewer.scene
      this.globe = this.scene.globe
  
      // 禁用碰撞检测
      this.scene.screenSpaceCameraController.enableCollisionDetection = false
  
      // 设置地球透明度衰减参数
      this.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
        400.0,
        0.0,
        800.0,
        1.0
      )
  
      // 定义模型位置
      const longitude = 112.396876
      const latitude = 37.934629
      const height = 1100
      const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
      const url = '/SampleData/models/ParcLeadMine/ParcLeadMine.glb'
  
      // 添加模型实体
      this.entity = this.viewer.entities.add({
        name: url,
        position: position,
        model: {
          uri: url
        }
      })
     // 飞向模型位置
     this.viewer.flyTo(this.entity)
  

      // 添加多边形实体
      this.polygon = this.viewer.entities.add({
        name: "Polygon",
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArrayHeights([
              -3.8152789692233817, 53.124521420389996, 200.20779492422255,
              -3.8165955002619016, 53.12555934545405, 205.85834336951655,
              -3.8201599842222054, 53.12388420656903, 230.82362697069453,
              -3.8198667503545027, 53.123748567587455, 225.53297006293968,
              -3.8190548496317476, 53.1240486000822, 221.82677773619432,
              -3.817536387097508, 53.122763476393764, 209.94136782255705,
              -3.8169125359199336, 53.12285547981627, 210.96626238861327,
              -3.8166873871853073, 53.12299403424474, 211.02223937734595,
              -3.8163695374580873, 53.12300505277307, 211.25942926271824,
              -3.8162743040622313, 53.12281471203994, 212.35109129094147,
              -3.8159746138174193, 53.12280996651767, 214.87977416348798,
              -3.815429896849304, 53.1236135347983, 209.72496223706005
            ])
          ),
          material: Cesium.Color.LIME.withAlpha(0.5), // 设置多边形的颜色和透明度
          classificationType: Cesium.ClassificationType.TERRAIN // 分类类型
        }
      })
     
      // 添加折线实体
      this.polyline = this.viewer.entities.add({
        name: "Polyline",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -3.8098444201746373, 53.1190304262546, 286.1875170545701,
            -3.8099801237370663, 53.119539531697576, 288.7733884242394,
            -3.810165716635671, 53.11979180761567, 290.9294630315179,
            -3.8104840812145357, 53.12007534956926, 292.6392327626228,
            -3.8105689502073554, 53.120259094792196, 292.222036965774,
            -3.811027311824268, 53.120409248874196, 289.61356291617307,
            -3.811530473295422, 53.12063281057782, 284.01098712543586,
            -3.8120545342562693, 53.120742539082435, 280.118191867836,
            -3.812444493044727, 53.120813289759326, 276.0400221387852,
            -3.812779626711285, 53.12094275348024, 271.1187399484896,
            -3.8133560322579494, 53.12104757866638, 263.3495497598578,
            -3.8137266493960085, 53.12120789867194, 257.73878624321316,
            -3.8142552291751133, 53.121321248522904, 251.87265828778177,
            -3.814322603988525, 53.12174170121103, 238.7082749547689,
            -3.8143764268391314, 53.1219492923309, 235.0371831845662,
            -3.8148156514145786, 53.12210819668669, 230.2458816627467,
            -3.8155394721966163, 53.1222990144029, 221.33319292262706,
            -3.8159828072920927, 53.12203093429715, 223.66664756982703,
            -3.816678108944717, 53.12183939425214, 223.8787312412801,
            -3.817466081093726, 53.121751900508535, 224.52293229989735,
            -3.8183082996527955, 53.12173266141031, 223.3672181535749
          ]),
          width: 8,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.YELLOW, // 设置折线的颜色
            outlineWidth: 2, // 设置折线轮廓宽度
            outlineColor: Cesium.Color.BLACK // 设置折线轮廓颜色
          }),
          clampToGround: true // 将折线贴附在地面上
        }
      })
  
      // 监听viewModel的变化，触发update方法
      this.$watch(
        () => this.viewModel,
        this.update,
        { deep: true }
      )
  
      // 初始化透明度设置
      this.update()
    },
    beforeDestroy() {
      // 在组件销毁前恢复默认的地形提供者
      this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()
    },
    methods: {
      // 更新透明度和显示状态的方法
      update() {
        this.globe.translucency.enabled = this.viewModel.translucencyEnabled
  
        let alpha = Number(this.viewModel.alpha)
        alpha = !isNaN(alpha) ? alpha : 1.0
        alpha = Cesium.Math.clamp(alpha, 0.0, 1.0)
  
        this.globe.translucency.frontFaceAlphaByDistance.nearValue = alpha
        this.globe.translucency.frontFaceAlphaByDistance.farValue = this.viewModel.fadeByDistance
          ? 1.0
          : alpha
  
        this.polygon.show = this.viewModel.showVectorData
        this.polyline.show = this.viewModel.showVectorData
      }
    }
  }
  </script>
  
  <style scoped>
  .page {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #fff;
      background: #fff;
      padding: 10px;
      border-radius: 5px;
      width: 400px;
  }
  
  #toolbar {
      color: rgba(42, 42, 42, 0.8);
      padding: 4px;
      border-radius: 4px;
  }
  
  #toolbar input {
      vertical-align: middle;
      padding-top: 2px;
      padding-bottom: 2px;
  }
  
  #toolbar .header {
      font-weight: bold;
  }
  </style>
  