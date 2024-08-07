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
    this.DrawRectangle();
  },

  methods: {
    /**
     * 绘制矩形
     */
    DrawRectangle() {
      var allPoints = [];
      // 设置返回值
      return new Promise((resolve, reject) => {
        let viewer = this.viewer;
        let topLeftPoint = null;
        let bottomRightPoint = null;

        let drawingRectangle = viewer.entities.add({
          id: "drawingRectangle",
          name: "画矩形",
          rectangle: {
            coordinates: new Cesium.CallbackProperty(() => {
              if (topLeftPoint === null || bottomRightPoint === null) {
                return;
              }
              let west = topLeftPoint.longitude;
              let north = topLeftPoint.latitude;
              let east = bottomRightPoint.longitude;
              let south = bottomRightPoint.latitude;
              return new Cesium.Rectangle(west, south, east, north);
            }, false),
            material: Cesium.Color.BLUE.withAlpha(0.2),
            closeTop: true,
            closeBottom: false,
          },
        });

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction((event) => {
          var cartesian = this.getCatesian3FromPX(event.position);
          if (cartesian) {
            if (topLeftPoint === null) {
              topLeftPoint = Cesium.Cartographic.fromCartesian(cartesian);
            }

            viewer.entities.add({
              position: cartesian,
              point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
              },
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((event) => {
          if (topLeftPoint) {
            bottomRightPoint = Cesium.Cartographic.fromCartesian(
              this.getCatesian3FromPX(event.endPosition)
            );
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(() => {
          if (topLeftPoint !== null && bottomRightPoint !== null) {
            handler.destroy(); // 关闭鼠标事件监听，结束绘制

            let west = Cesium.Math.toDegrees(topLeftPoint.longitude);
            let north = Cesium.Math.toDegrees(topLeftPoint.latitude);
            let east = Cesium.Math.toDegrees(bottomRightPoint.longitude);
            let south = Cesium.Math.toDegrees(bottomRightPoint.latitude);

            allPoints.push({ lng: west, lat: north });
            allPoints.push({ lng: east, lat: north });
            allPoints.push({ lng: east, lat: south });
            allPoints.push({ lng: west, lat: south });
            allPoints.push(allPoints[0]); // 闭合
            resolve(allPoints);

            //根据矩形区域生成点集
            this.ceatRectangularPoints(allPoints);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      });
    },

    //根据矩形区域生成点集
    ceatRectangularPoints(resultPoints) {
      console.log(resultPoints);
      // 1. 创建一个矩形区域
      //   var rectangle = Cesium.Rectangle.fromDegrees(
      //     117.09649937089316,
      //     36.20673458245797,
      //     117.11797117691083,
      //     36.230040948473906
      //   );
      var rectangle = Cesium.Rectangle.fromDegrees(
        resultPoints[0].lng,
        resultPoints[2].lat,
        resultPoints[2].lng,
        resultPoints[0].lat
      );
      console.log("1-区域范围");
      console.log(rectangle);
      // 2. 在这个矩形区域内生成点集
      var width = 20; // 横向点数
      var height = 20; // 纵向点数
      var terrainProvider = this.viewer.terrainProvider;
      console.log("2- terrainProvider地形");
      console.log(terrainProvider);
      var positions = [];
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var longitude = Cesium.Math.lerp(
            rectangle.west,
            rectangle.east,
            x / (width - 1)
          );
          var latitude = Cesium.Math.lerp(
            rectangle.south,
            rectangle.north,
            y / (height - 1)
          );
          positions.push(Cesium.Cartographic.fromRadians(longitude, latitude));
        }
      }
      console.log("3- positions");
      console.log(positions);
      this.giveHeight(terrainProvider, positions);
    },
    giveHeight(terrainProvider, positions) {
      //根据地形和区域为上述点集赋高度值
      var that = this;
      Cesium.sampleTerrainMostDetailed(terrainProvider, positions).then(
        function (samples) {
          var points = samples.map(function (sample) {
            // Geojson 的Points
            return turf.point(
              [
                Cesium.Math.toDegrees(sample.longitude),
                Cesium.Math.toDegrees(sample.latitude),
                sample.height,
              ],
              { z: sample.height }
            ); // 将高度值保存到名为 'z' 的属性中);
          });
          console.log("4- points");
          console.log(points);
          // 创建一个FeatureCollection
          var featureCollection = turf.featureCollection(points);
          var tin = turf.tin(featureCollection, "z");
          var geometryInstances = []; // 用于存放所有的三角形GeometryInstance
          var instances = [];

          // 遍历每个TIN三角形!!!!
          tin.features.forEach(function (feature, i) {
            var coordinates = feature.geometry.coordinates[0];

            var heights = [
              feature.properties.a,
              feature.properties.b,
              feature.properties.c,
            ];
            var positions = coordinates.map(function (coord, index) {
              return Cesium.Cartesian3.fromDegrees(
                coord[0],
                coord[1],
                heights[index]
              );
            });

            //  坡度计算
            const point1 = positions[0];
            const point2 = positions[1];
            const point3 = positions[2];
            //使用我们新定义的函数计算每个三角形的坡度
            var analysisResult = that.calculateSlopeAndAspect(
              point1,
              point2,
              point3
            );

            var slope = analysisResult.slope;
            var hue = slope / 90.0; // 将坡度从0到90度映射到色调从0到1
            var saturation = 1.0; // 全饱和度
            var lightness = 0.5; // 正常亮度
            var alpha = 1.0; // 完全不透明
            //将HSL颜色转换为RGBA，当坡度为0度时，hue变为0，颜色是红色；当坡度为90度时，hue变为1，颜色是绿色；在0到90度之间的坡度将映射到从红色到绿色之间的颜色。
            var color = Cesium.Color.fromHsl(
              hue,
              saturation,
              lightness
            ).withAlpha(alpha);

            that.viewer.entities.add({
              name: "三角面",
              id: "triangle" + i,
              polygon: {
                hierarchy: [positions[0], positions[1], positions[2]],
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                perPositionHeight: true,
                material: color,
                //   Cesium.Color.fromCssColorString("#23B8BA").withAlpha(1.0),
                //  extrudedHeight: 0,
                outline: true,
                outlineColor: Cesium.Color.GREEN,
              },
            });
          });

          var cartesianPoints = points.map(function (point) {
            var coord = point.geometry.coordinates;
            var cartographic = Cesium.Cartographic.fromDegrees(
              coord[0],
              coord[1],
              coord[2]
            );
            return Cesium.Cartographic.toCartesian(cartographic);
          });
          var pointCollection = new Cesium.PointPrimitiveCollection();

          cartesianPoints.forEach(function (position) {
            pointCollection.add({
              position: position,
              color: Cesium.Color.RED,
              pixelSize: 5,
            });
          });
          that.viewer.scene.primitives.add(pointCollection);
        }
      );
    },
    /**
     * 拾取位置点
     * @param {Object} px 屏幕坐标
     * @return {Object} Cartesian3 三维坐标
     */
    getCatesian3FromPX: function (px) {
      if (this.viewer && px) {
        var picks = this.viewer.scene.drillPick(px);
        var cartesian = null;
        var isOn3dtiles = false,
          isOnTerrain = false;
        // drillPick
        for (let i in picks) {
          let pick = picks[i];

          if (
            (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
            (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
            (pick && pick.primitive instanceof Cesium.Model)
          ) {
            //模型上拾取
            isOn3dtiles = true;
          }
          // 3dtilset
          if (isOn3dtiles) {
            this.viewer.scene.pick(px); // pick
            cartesian = this.viewer.scene.pickPosition(px);
            if (cartesian) {
              let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
              if (cartographic.height < 0) cartographic.height = 0;
              let lon = Cesium.Math.toDegrees(cartographic.longitude),
                lat = Cesium.Math.toDegrees(cartographic.latitude),
                height = cartographic.height;
              cartesian = this.transformWGS84ToCartesian({
                lng: lon,
                lat: lat,
                alt: height,
              });
            }
          }
        }
        // 地形
        let boolTerrain =
          this.viewer.terrainProvider instanceof
          Cesium.EllipsoidTerrainProvider;
        // Terrain
        if (!isOn3dtiles && !boolTerrain) {
          var ray = this.viewer.scene.camera.getPickRay(px);
          if (!ray) return null;
          cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
          isOnTerrain = true;
        }
        // 地球
        if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
          cartesian = this.viewer.scene.camera.pickEllipsoid(
            px,
            this.viewer.scene.globe.ellipsoid
          );
        }
        if (cartesian) {
          let position = this.transformCartesianToWGS84(cartesian);
          if (position.alt < 0) {
            cartesian = this.transformWGS84ToCartesian(position, 0.1);
          }
          return cartesian;
        }
        return false;
      }
    },
    /***
     * 坐标转换 84转笛卡尔
     * @param {Object} {lng,lat,alt} 地理坐标
     * @return {Object} Cartesian3 三维位置坐标
     */
    transformWGS84ToCartesian: function (position, alt) {
      if (this.viewer) {
        return position
          ? Cesium.Cartesian3.fromDegrees(
              position.lng || position.lon,
              position.lat,
              (position.alt = alt || position.alt),
              Cesium.Ellipsoid.WGS84
            )
          : Cesium.Cartesian3.ZERO;
      }
    },
    /***
     * 坐标转换 笛卡尔转84
     * @param {Object} Cartesian3 三维位置坐标
     * @return {Object} {lng,lat,alt} 地理坐标
     */
    transformCartesianToWGS84: function (cartesian) {
      if (this.viewer && cartesian) {
        var ellipsoid = Cesium.Ellipsoid.WGS84;
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        return {
          lng: Cesium.Math.toDegrees(cartographic.longitude),
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          alt: cartographic.height,
        };
      }
    },
    /**
     * 计算三角形的坡度
     * @param {*} point1
     * @param {*} point2
     * @param {*} point3
     * @returns
     */
    calculateSlopeAndAspect(point1, point2, point3) {
      // 计算两个向量，它们位于三角形的两边
      var v1 = Cesium.Cartesian3.subtract(
        point1,
        point2,
        new Cesium.Cartesian3()
      );
      var v2 = Cesium.Cartesian3.subtract(
        point2,
        point3,
        new Cesium.Cartesian3()
      );
      // 计算这两个向量的叉积，得到三角形的法向量
      var normal = new Cesium.Cartesian3();
      Cesium.Cartesian3.cross(v1, v2, normal);
      Cesium.Cartesian3.normalize(normal, normal);

      // 计算三角形的中心点
      var centroid = new Cesium.Cartesian3(
        (point1.x + point2.x + point3.x) / 3,
        (point1.y + point2.y + point3.y) / 3,
        (point1.z + point2.z + point3.z) / 3
      );

      // 得到从地球中心到三角形中心的单位向量（这里不应该使用垂直向量(0,0,1)，如果使用(0,0,1)会导致面南的坡度大，面北的坡度小）
      var centerToCentroid = Cesium.Cartesian3.normalize(
        centroid,
        new Cesium.Cartesian3()
      );

      // 确保法线向量指向地球外部
      if (Cesium.Cartesian3.dot(normal, centerToCentroid) < 0) {
        Cesium.Cartesian3.negate(normal, normal);
      }

      // 计算坡度：法向量和从地球中心到三角形中心的径向向量之间的夹角
      var slopeRadians = Math.acos(
        Cesium.Cartesian3.dot(normal, centerToCentroid)
      );

      var slopeDegrees = Cesium.Math.toDegrees(slopeRadians);
      // 如果坡度大于90度，则将其减少到90度以下
      if (slopeDegrees > 90) {
        slopeDegrees = 180 - slopeDegrees;
      }
      // 返回坡度值
      return { slope: slopeDegrees };
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
