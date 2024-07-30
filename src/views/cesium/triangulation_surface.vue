<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import * as turf from "@turf/turf";
export default {
  // 初始化数据
  data() {
    return {
      viewer: null,
      scene: null,
      globe: null,
    };
  },
  // 组件挂载后执行
  mounted() {
    // 设置Cesium默认的Ion访问令牌
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI";

    // 初始化Cesium Viewer
    this.viewer = new Cesium.Viewer("map", {
      terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true, // 请求水面掩码
        requestVertexNormals: true, // 请求顶点法线
      }),
    });

    this.scene = this.viewer.scene;
    this.globe = this.scene.globe;
    // 添加瓦片坐标信息,显示当前瓦片的层级、行列号
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.TileCoordinatesImageryProvider()
    );
    // 禁用碰撞检测
    this.scene.screenSpaceCameraController.enableCollisionDetection = false;
    //地形线框模式
    // this.viewer.scene.globe._surface._tileProvider._debug.wireframe = true;
    // 设置地球透明度衰减参数
    this.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
      400.0,
      0.0,
      800.0,
      1.0
    );

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(117.096, 36.206), // 相机飞行目标位置
      complete: () => {},
    });
    alert("export");
    this.Load();
  },

  methods: {
    Load() {
      //获取当前Cesium视图的实例，并移除其中的所有实体（entities），以便开始新的加载。
      var viewer = this.viewer;
      viewer.entities.removeAll();
      //设置地理区域和准备变量:
      var scene = viewer.scene;
      var globe = viewer.scene.globe;
      //遍历当前场景中所有的地形瓦片并将相交的瓦片添加到处理列表中。
      var tilesToProcess = [];
      var quadtree =
        viewer.scene.globe._surface._tileProvider._quadtree._tilesToRender;
      // 遍历地形瓦片
      quadtree.forEach(function (tile) {
        tilesToProcess.push(tile);
        if (tile instanceof Cesium.Cesium3DTileset) return;
      });
      const MAX_SHORT = 32767;
      var terrainProvider = viewer.terrainProvider;

      // 创建一个Request对象，这通常是可选的
      const request = new Cesium.Request({
        throttle: true,
        throttleByServer: true,
      });

      // 定义要处理的瓦片坐标和级别:
      const tileCoords = [
        { x: 6759, y: 1222 },
        { x: 6760, y: 1222 },
        { x: 6761, y: 1222 },
        { x: 6759, y: 1223 },
        { x: 6760, y: 1223 },
        { x: 6761, y: 1223 },
        // 添加更多瓦片坐标
      ];
      const level = 12; // 定义级别

      console.log("ready?");
      console.log(terrainProvider.readyPromise);
      // 使用requestMultipleTiles请求多个瓦片
      terrainProvider.readyPromise.then(() => {
        console.log(terrainProvider.readyPromise);
        console.log("ready!");
        this.requestMultipleTiles(tileCoords, level, terrainProvider).then(
          (allTileData) => {
            console.log("所有瓦片的处理结果:", allTileData);

            // 创建 .obj 文件内容
            let objContent = this.createObjFileContent(allTileData);

            // 触发下载
            this.download("terrain.obj", objContent);
          }
        );
      });
    },
    // 定义请求单个瓦片数据的函数
    requestTileData(x, y, level, terrainProvider) {
      return terrainProvider
        .requestTileGeometry(x, y, level)
        .then((terrainData) => {
          console.log(
            "Terrain tile data for tile " + x + ", " + y + ":",
            terrainData
          );
          return terrainData; // 返回地形数据
        })
        .catch((error) => {
          console.error("获取地形数据失败", error);
        });
    },

    // 定义请求多个瓦片数据的函数
    requestMultipleTiles(tileCoords, level, terrainProvider) {
      let promises = [];

      for (let tileCoord of tileCoords) {
        let promise = this.requestTileData(
          tileCoord.x,
          tileCoord.y,
          level,
          terrainProvider
        );
        promises.push(promise);
      }

      return Promise.all(promises);
    },
    //处理每个瓦片的地形数据，计算出顶点和面。
    processTileData(terrainData, tileCoord, level) {
      const rect = new Cesium.GeographicTilingScheme().tileXYToRectangle(
        tileCoord.x,
        tileCoord.y,
        level
      );
      const minimumHeight = terrainData._minimumHeight;
      const maximumHeight = terrainData._maximumHeight;

      const indices = terrainData._indices;
      const quantizedVertices = terrainData._quantizedVertices;
      const vertexCount = quantizedVertices.length / 3;

      const vertices = [];
      const faces = [];
      console.log(quantizedVertices);
      for (let i = 0; i < vertexCount; i++) {
        const rawU = quantizedVertices[i];
        const rawV = quantizedVertices[i + vertexCount];
        const rawH = quantizedVertices[i + vertexCount * 2];

        const u = rawU / MAX_SHORT;
        const v = rawV / MAX_SHORT;

        const longitude = Cesium.Math.lerp(rect.west, rect.east, u);
        const latitude = Cesium.Math.lerp(rect.south, rect.north, v);
        const height = Cesium.Math.lerp(
          minimumHeight,
          maximumHeight,
          rawH / MAX_SHORT
        );
        const carto = new Cesium.Cartographic(longitude, latitude, height);
        const cartesian = Cesium.Cartographic.toCartesian(carto);
        vertices.push([cartesian.x, cartesian.y, height]);
      }

      for (let i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i + 1], indices[i + 2]]);
      }

      console.log("Vertices:", vertices);
      console.log("Faces:", faces);

      // 将 indices 数组展平
      const flatIndices = [];
      for (let i = 0; i < indices.length; i++) {
        flatIndices.push(indices[i]);
      }

      // 创建一个 Uint16Array
      const flattenedIndices = new Uint16Array(flatIndices);

      const positions = [];

      // 创建一个空的 Cesium.EntityCollection
      var entityCollection = new Cesium.EntityCollection();

      for (let i = 0; i < faces.length; i++) {
        // 创建一个包含三角形顶点的数组
        var triangleVertices = [
          vertices[faces[i][0]][0],
          vertices[faces[i][0]][1],
          vertices[faces[i][0]][2] + 3700000,
          vertices[faces[i][1]][0],
          vertices[faces[i][1]][1],
          vertices[faces[i][1]][2] + 3700000,
          vertices[faces[i][2]][0],
          vertices[faces[i][2]][1],
          vertices[faces[i][2]][2] + 3700000,
        ];
        // 定义三个点的笛卡尔坐标
        var point1 = new Cesium.Cartesian3(
          triangleVertices[0],
          triangleVertices[1],
          triangleVertices[2]
        );
        var point2 = new Cesium.Cartesian3(
          triangleVertices[3],
          triangleVertices[4],
          triangleVertices[5]
        );
        var point3 = new Cesium.Cartesian3(
          triangleVertices[6],
          triangleVertices[7],
          triangleVertices[8]
        );

        // 将笛卡尔坐标转换为地理坐标（经纬度）
        var cartographicPoint1 = Cesium.Cartographic.fromCartesian(point1);
        var cartographicPoint2 = Cesium.Cartographic.fromCartesian(point2);
        var cartographicPoint3 = Cesium.Cartographic.fromCartesian(point3);
        // 获取经度、纬度（以度为单位），以及高度
        var longitude1 = Cesium.Math.toDegrees(cartographicPoint1.longitude);
        var latitude1 = Cesium.Math.toDegrees(cartographicPoint1.latitude);
        console.log(cartographicPoint1.latitude);
        var height1 = vertices[faces[i][0]][2];
        var longitude2 = Cesium.Math.toDegrees(cartographicPoint2.longitude);
        var latitude2 = Cesium.Math.toDegrees(cartographicPoint2.latitude);
        var height2 = vertices[faces[i][1]][2];
        var longitude3 = Cesium.Math.toDegrees(cartographicPoint3.longitude);
        var latitude3 = Cesium.Math.toDegrees(cartographicPoint3.latitude);
        var height3 = vertices[faces[i][2]][2];
        viewer.entities.add({
          name: "三角面",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
              longitude1,
              latitude1,
              height1,
              longitude2,
              latitude2,
              height2,
              longitude3,
              latitude3,
              height3,
            ]),
            //hierarchy: [point1, point2, point3],
            // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            perPositionHeight: true,
            material: Cesium.Color.fromCssColorString("#23B8BA").withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
          },
        });
      }
      this.viewer.zoomTo(viewer.entities);

      return { vertices, faces };
    },

    //创建和下载OBJ文件:
    createObjFileContent(allTileData) {
      let objContent = "";
      let vertexOffset = 0;

      allTileData.forEach((tileData) => {
        // 添加顶点
        tileData.vertices.forEach((v) => {
          objContent += `v ${v[0]} ${v[1]} ${v[2]}\n`;
        });

        // 添加面
        tileData.faces.forEach((f) => {
          // 注意：.obj文件中的索引从1开始，且需要考虑之前顶点的偏移
          objContent += `f ${f[0] + 1 + vertexOffset} ${
            f[1] + 1 + vertexOffset
          } ${f[2] + 1 + vertexOffset}\n`;
        });

        // 更新顶点偏移
        vertexOffset += tileData.vertices.length;
      });

      return objContent;
    },
    download(filename, text) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },

  beforeDestroy() {
    // 在组件销毁前恢复默认的地形提供者
    this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
  },
};
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
