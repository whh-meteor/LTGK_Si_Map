<template>
  <div>
    <!-- 地图容器 -->
    <div id="map" />
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

      <a href="#" @click="DrawPoints()">绘制点</a>
      <a href="#" @click="DrawPolyline()">绘制线</a>
      <a href="#" @click="DrawCircle()">绘制圆</a>
      <a href="#" @click="DrawRectangle()">绘制矩形</a>
      <a href="#" @click="DrawPolygon()">绘制多边形</a>
    </div>
  </div>
</template>

<script>
import { point, bearing, distance, destination } from "@turf/turf";
import EditPolygon from "../maptalks/EditPolygon.vue";

export default {
  name: "Home",
  data() {
    return {
      viewer: null, // Cesium Viewer实例
      heading: 0, // 相机当前朝向角度
      offset: null, // 相机偏移参数
      entity: null, // 地图上的实体
    };
  },
  mounted() {
    this.init(); // 组件挂载后初始化地图
  },
  methods: {
    init() {
      this.viewer = new Cesium.Viewer("map", {
        // terrainProvider: Cesium.createWorldTerrain(),
        animation: false, // 是否显示动画控件
        homeButton: true, // 是否显示home键
        geocoder: true, // 是否显示地名查找控件        如果设置为true，则无法查询
        baseLayerPicker: true, // 是否显示图层选择控件
        timeline: true, // 是否显示时间线控件
        fullscreenButton: true, // 是否全屏显示
        scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        infoBox: true, // 是否显示点击要素之后显示的信息
        sceneModePicker: true, // 是否显示投影方式控件  三维/二维
        navigationInstructionsInitiallyVisible: true,
        navigationHelpButton: true, // 是否显示帮助信息控件
        selectionIndicator: true, // 是否显示指示器组件
        // 加载天地图
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false,
          mininumLevel: 0,
          maximumLevel: 16,
        }),
      });
      // 添加一个实体到地图上
      this.entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(114, 30),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
        },
      });
      // this.rotate() // 初始调用旋转方法（可选）
    },
    /**
     * 绘制点
     */
    DrawPoints() {
      return new Promise((resolve, reject) => {
        let viewer = this.viewer;
        let drawnPoints = [];

        // 创建一个事件处理器
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        // 注册鼠标左键点击事件，用于绘制点
        handler.setInputAction((event) => {
          // 获取鼠标点击的笛卡尔坐标(鼠标点击位置->笛卡尔坐标)
          var cartesian = this.getCatesian3FromPX(event.position);
          // 确保坐标有效
          if (cartesian) {
            // 添加点实体
            viewer.entities.add({
              position: cartesian,
              point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
              },
            });

            // 获取地理坐标（经纬度）
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let height = Cesium.Math.toDegrees(cartographic.height);
            // 将绘制的点添加到数组中
            drawnPoints.push({ lng: longitude, lat: latitude, height: height });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 注册鼠标右键点击事件，用于结束绘制
        handler.setInputAction(() => {
          // 销毁事件处理器
          handler.destroy();

          // 返回所有绘制的点
          resolve(drawnPoints);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      });
    },
    /**
     * 绘制折线
     */
    DrawPolyline() {
      return new Promise((resolve, reject) => {
        let viewer = this.viewer;
        let polylinePoints = [];

        // 临时折线实体
        let polylineEntity = viewer.entities.add({
          Id: "drawingPolyline",
          name: "画线",
          polyline: {
            //使用CallbackProperty允许我们在用户点击时动态更新线段的位置
            positions: new Cesium.CallbackProperty(() => {
              return polylinePoints;
            }, false),
            width: 2,
            material: Cesium.Color.RED,
          },
        });

        // 临时动态线实体
        let dynamicLineEntity = viewer.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              if (lastPoint && currentMousePoint) {
                return [lastPoint, currentMousePoint];
              } else {
                return [];
              }
            }, false),
            width: 2,
            material: Cesium.Color.RED.withAlpha(0.5), // 使用半透明红色，与主线区分
          },
        });

        let lastPoint = null;
        let currentMousePoint = null;

        // 创建事件处理器
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        // 注册鼠标左键点击事件，用于添加点和显示点
        handler.setInputAction((event) => {
          let cartesian = this.getCatesian3FromPX(event.position);
          if (cartesian) {
            polylinePoints.push(cartesian);
            lastPoint = cartesian;

            viewer.entities.add({
              position: cartesian,
              point: {
                color: Cesium.Color.BLUE,
                pixelSize: 10,
              },
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动事件，更新当前鼠标位置并重绘临时线
        handler.setInputAction((event) => {
          currentMousePoint = this.getCatesian3FromPX(event.endPosition);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 注册鼠标左键双击点击事件，用于结束绘制
        handler.setInputAction(() => {
          handler.destroy();
          viewer.entities.remove(dynamicLineEntity); // 移除临时线

          resolve(polylinePoints);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      });
    },
    /**
     * 绘制圆形
     */
    DrawCircle() {
      return new Promise((resolve, reject) => {
        let viewer = this.viewer;
        let centerPoint = null;
        let centerPointEntity = null; // 用于存储中点实体的引用
        let radius = 10;
        viewer.scene.globe.depthTestAgainstTerrain = false;
        let drawingCircle = viewer.entities.add({
          id: "drawingCircle",
          name: "画圆",
          ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(() => {
              return radius;
            }, false),
            semiMajorAxis: new Cesium.CallbackProperty(() => {
              return radius;
            }, false),
            material: Cesium.Color.BLUE.withAlpha(0.2),
            outline: true,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 2,
            fill: true, //为true时只显示轮廓线
          },
        });

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction((event) => {
          var cartesian = this.getCatesian3FromPX(event.position);
          if (cartesian && centerPoint === null) {
            centerPoint = cartesian;
            drawingCircle.position = centerPoint;

            // 添加中点实体并保存其引用
            centerPointEntity = viewer.entities.add({
              position: cartesian,
              point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
              },
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((event) => {
          if (centerPoint) {
            let cartesian = this.getCatesian3FromPX(event.endPosition);
            if (cartesian) {
              let distance = Cesium.Cartesian3.distance(centerPoint, cartesian);
              radius = distance;
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(() => {
          if (centerPoint !== null && radius > 0) {
            handler.destroy(); // 关闭鼠标事件监听，结束绘制

            let circleCenter = Cesium.Cartographic.fromCartesian(centerPoint);
            let lng = Cesium.Math.toDegrees(circleCenter.longitude);
            let lat = Cesium.Math.toDegrees(circleCenter.latitude);

            resolve({
              center: { lng: lng, lat: lat },
              radius: radius,
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      });
    },
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
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      });
    },
    /**
     * 绘制多边形
     * @param {Object}  option
     * @param {Boolean} option.ground 是否贴地
     */
    DrawPolygon(option) {
      var allPoints = [];
      // 设置返回值
      return new Promise((resolve, reject) => {
        // 1. 获取Cesium Viewer
        let viewer = this.viewer;
        // 2. 创建一个用于存储多边形顶点的数组
        let polygonPoints = [];
        // 3. 创建一个用于显示当前绘制中的多边形的实体
        let drawingPolygon = viewer.entities.add({
          id: "drawingPolygon",
          name: "画多边形",
          polygon: {
            hierarchy: new Cesium.CallbackProperty(() => {
              return new Cesium.PolygonHierarchy(polygonPoints);
            }, false),
            material: Cesium.Color.BLUE.withAlpha(0.2),
            perPositionHeight: (option && option.ground) || false, // true:不贴地/false:贴地
          },
        });

        // 4. 创建一个用于显示当前绘制中的线的实体
        let drawingLine = viewer.entities.add({
          id: "drawingLine",
          name: "画线",
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              return polygonPoints;
            }, false),
            width: 3,
            material: Cesium.Color.GREEN,
          },
        });

        // 5. 监听鼠标点击事件，将点击的点添加到顶点数组中，并添加点实体
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction((event) => {
          var cartesian = this.getCatesian3FromPX(event.position);
          if (cartesian) {
            // 将点坐标添加到数组中
            polygonPoints.push(cartesian.clone());
            // 在第一次点击时，添加一个克隆的点到数组中，用于动态更新
            if (polygonPoints.length === 1) {
              polygonPoints.push(cartesian.clone());
            }
            // 添加点实体
            viewer.entities.add({
              position: cartesian,
              point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
              },
            });

            //将三维笛卡尔坐标系点转为经纬度坐标点，并保存到点数组中
            let cartesian3 = cartesian.clone();
            // 使用Cesium.Cartographic.fromCartesian将Cartesian3对象转换为Cartographic对象
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
            allPoints.push([
              Cesium.Math.toDegrees(cartographic.longitude),
              Cesium.Math.toDegrees(cartographic.latitude),
              cartographic.height,
            ]);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 6. 监听鼠标移动事件，动态更新多边形和线的形状
        handler.setInputAction((event) => {
          var cartesian = this.getCatesian3FromPX(event.endPosition);
          if (polygonPoints.length >= 2) {
            if (cartesian && cartesian.x) {
              polygonPoints.pop();
              polygonPoints.push(cartesian);
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 7. 监听鼠标右键点击事件，结束绘制
        handler.setInputAction(() => {
          var cartesian = polygonPoints[polygonPoints.length - 1];
          // 添加点实体
          viewer.entities.add({
            position: cartesian,
            point: {
              color: Cesium.Color.RED,
              pixelSize: 10,
            },
          });
          polygonPoints.push(polygonPoints[0]);
          handler.destroy(); // 关闭鼠标事件监听，结束绘制

          resolve(allPoints);
          this.EditPolygon(polygonPoints, allPoints, drawingLine);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      });
    },
    EditPolygon(polygonPoints, allPoints, drawingLine) {
      var viewer = this.viewer;
      var pointEntities = [];
      // 创建一个事件处理器
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

      handler.setInputAction((event) => {
        var cartesian = this.getCatesian3FromPX(event.position);
        if (cartesian) {
          // 将点坐标添加到数组中
          polygonPoints.push(cartesian.clone());
          // 在第一次点击时，添加一个克隆的点到数组中，用于动态更新
          if (polygonPoints.length === 1) {
            polygonPoints.push(cartesian.clone());
          }
          // 添加点实体
          var pointEntity = viewer.entities.add({
            id: "point" + polygonPoints.length,
            position: cartesian,
            point: {
              color: Cesium.Color.RED,
              pixelSize: 10,
            },
          });
          pointEntities.push(pointEntity);
          //添加到多边形数组中
          let cartesian3 = cartesian.clone();
          // 使用Cesium.Cartographic.fromCartesian将Cartesian3对象转换为Cartographic对象
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
          allPoints.push([
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height,
          ]);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 6. 监听鼠标移动事件，动态更新多边形和线的形状
      handler.setInputAction((event) => {
        var cartesian = this.getCatesian3FromPX(event.endPosition);
        if (polygonPoints.length >= 2) {
          if (cartesian && cartesian.x) {
            polygonPoints.pop();
            polygonPoints.push(cartesian);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // 7. 监听鼠标双击事件，结束绘制
      handler.setInputAction(() => {
        var cartesian = polygonPoints[polygonPoints.length - 1];
        handler.destroy(); // 关闭鼠标事件监听，结束绘制
        // 移除因单击事件产生的最后一个点
        if (polygonPoints.length > 1) {
          // 去除数组中最后一个点
          polygonPoints.pop();
          // 返回值
          allPoints.pop();
          allPoints.push(allPoints[0]); // 闭合
          var endPoint = viewer.entities.getById(
            "point" + (polygonPoints.length + 1)
          );
          if (endPoint) {
            viewer.entities.remove(endPoint);
          }
          var startPoint = viewer.entities.getById("point1");
          if (startPoint) {
            viewer.entities.remove(startPoint);
          }
        }
        // resolve(allPoints);

        // 移除用于绘制的动态线实体
        viewer.entities.remove(drawingLine);

        // 以下为拖拽点改变多边形形状代码
        let selectedPointEntity = null;
        let selectedIndex = -1;
        var dragHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        //鼠标按下
        dragHandler.setInputAction((event) => {
          const pickedObject = viewer.scene.pick(event.position);
          if (
            Cesium.defined(pickedObject) &&
            pointEntities.includes(pickedObject.id)
          ) {
            selectedPointEntity = pickedObject.id;
            selectedIndex = pointEntities.indexOf(selectedPointEntity);
            alert("禁用摄像机控制");
            // 禁用摄像机控制
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            viewer.scene.screenSpaceCameraController.enableTranslate = false;
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            viewer.scene.screenSpaceCameraController.enableTilt = false;
            viewer.scene.screenSpaceCameraController.enableLook = false;
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        // 当鼠标移动时
        dragHandler.setInputAction((event) => {
          if (selectedPointEntity) {
            const cartesian = this.getCatesian3FromPX(event.endPosition);
            if (cartesian && selectedIndex !== -1) {
              selectedPointEntity.position = cartesian;
              polygonPoints[selectedIndex] = cartesian;
              // 如果当前拖动的是第一个点或是最后一个点
              if (
                selectedIndex === 0 ||
                selectedIndex === polygonPoints.length - 2
              ) {
                polygonPoints[polygonPoints.length - 1] = cartesian;
                pointEntities[polygonPoints.length - 1].position.setValue(
                  cartesian
                );
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 当鼠标左键抬起时
        dragHandler.setInputAction(() => {
          selectedPointEntity = null;
          selectedIndex = -1;

          // 启用摄像机控制
          viewer.scene.screenSpaceCameraController.enableRotate = true;
          viewer.scene.screenSpaceCameraController.enableTranslate = true;
          viewer.scene.screenSpaceCameraController.enableZoom = true;
          viewer.scene.screenSpaceCameraController.enableTilt = true;
          viewer.scene.screenSpaceCameraController.enableLook = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
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

    rotationCamera(degrees) {
      // 调整相机的朝向角度
      this.heading += degrees;
    },
    beginRotate() {
      // 开始旋转
      this.viewer.zoomTo(this.entity, this.offset).then(() => {
        this.viewer.clock.onTick.addEventListener(this.rotate); // 注册旋转事件
      });
    },
    stop() {
      // 停止旋转
      this.viewer.clock.onTick.removeEventListener(this.rotate); // 取消旋转事件
      this.viewer.scene.screenSpaceCameraController.enableInputs = true; // 恢复相机控制
    },
    rotate() {
      // 旋转方法
      this.heading += 0.1; // 每次调用增加0.1度
      this.offset = new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(this.heading),
        -Cesium.Math.toRadians(30),
        1000
      ); // 计算新的相机偏移参数
      this.viewer.zoomTo(this.entity, this.offset); // 将相机移到新的位置
      this.viewer.scene.screenSpaceCameraController.enableInputs = false; // 禁用相机控制
    },
  },
};
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
