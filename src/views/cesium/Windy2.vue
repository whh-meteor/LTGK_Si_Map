<template>
  <div>
    <div id="cesiumMap" class="cesium" />
  </div>
</template>

<script>
import CesiumWind from "./windy/cesium-wind.esm";
import netcdfjs from "./windy/netcdfjs.min.js";
export default {
  name: "CaseOne",

  data() {
    return {};
  },
  mounted() {
    // Vue生命周期钩子，组件挂载后执行
    this.$nextTick(() => {
      this.initCesium(); // 初始化Cesium地图
      this.loadNetCDF("/nc/UV010P202001_time0.nc");
    });
  },
  methods: {
    loadNetCDF(filePath) {
      return new Promise(function (resolve) {
        var request = new XMLHttpRequest();
        request.open("GET", filePath);
        request.responseType = "arraybuffer";

        request.onload = function () {
          var arrayToMap = function arrayToMap(array) {
            return array.reduce(function (map, object) {
              map[object.name] = object;
              return map;
            }, {});
          };

          var NetCDF = new netcdfjs(request.response);
          // var data = {};
          // var dimensions = arrayToMap(NetCDF.dimensions);
          // data.dimensions = {};
          // console.log("维度信息");
          // console.log(dimensions);
          // data.dimensions.lon = dimensions["longitude"].size;
          // data.dimensions.lat = dimensions["latitude"].size;
          // //   data.dimensions.lev = dimensions['Lev'].size
          // data.dimensions.lev = 1;
          // var variables = arrayToMap(NetCDF.variables);
          // var uAttributes = arrayToMap(variables["U"].attributes);
          // var vAttributes = arrayToMap(variables["V"].attributes);
          // data.lon = {};
          // data.lon.array = new Float32Array(
          //   NetCDF.getDataVariable("lon").flat()
          // );
          // data.lon.min = Math.min.apply(Math, data.lon.array);
          // data.lon.max = Math.max.apply(Math, data.lon.array);
          // data.lat = {};
          // data.lat.array = new Float32Array(
          //   NetCDF.getDataVariable("lat").flat()
          // );
          // data.lat.min = Math.min.apply(Math, data.lat.array);
          // data.lat.max = Math.max.apply(Math, data.lat.array);
          // data.lev = {};
          // data.lev.array = new Float32Array(
          //   NetCDF.getDataVariable("lev").flat()
          // );
          // data.lev.min = Math.min.apply(Math, data.lev.array);
          // data.lev.max = Math.max.apply(Math, data.lev.array);
          // data.U = {};
          // data.U.array = new Float32Array(NetCDF.getDataVariable("U").flat());
          // data.U.min = uAttributes["min"].value;
          // data.U.max = uAttributes["max"].value;
          // data.V = {};
          // data.V.array = new Float32Array(NetCDF.getDataVariable("V").flat());
          // data.V.min = vAttributes["min"].value;
          // data.V.max = vAttributes["max"].value;
          // console.log("U值");
          // console.log(data.U.array);
          // console.log("V值");
          // console.log(data.V.array);
          // console.log("u-max-min" + data.U.min, data.U.max);
          // console.log("v-max-min" + data.V.min, data.V.max);

          // resolve(data);
          // 提取维度数据
          var lonArray = Array.from(NetCDF.getDataVariable("latitude"));
          var latArray = Array.from(NetCDF.getDataVariable("longitude"));

          // 提取U和V变量数据
          var uArray = Array.from(NetCDF.getDataVariable("u10").flat());
          var vArray = Array.from(NetCDF.getDataVariable("v10").flat());
          // // 获取U和V的最小值和最大值
          // var uMin = uArray.reduce((a, b) => Math.min(a, b), Infinity);
          // var uMax = uArray.reduce((a, b) => Math.max(a, b), -Infinity);

          // var vMin = vArray.reduce((a, b) => Math.min(a, b), Infinity);
          // var vMax = vArray.reduce((a, b) => Math.max(a, b), -Infinity);

          // // 归一化U和V数据到-10到10的范围
          // var normalize = function (value, min, max) {
          //   return ((value - min) / (max - min)) * 20 - 10;
          // };

          // uArray = uArray.map(function (value) {
          //   return normalize(value, uMin, uMax);
          // });

          // vArray = vArray.map(function (value) {
          //   return normalize(value, vMin, vMax);
          // });
          // 用于存储过滤后的U和V数据
          var filteredUArray = [];
          var filteredVArray = [];

          // 用于存储保留的U和V数据
          var newUArray = [];
          var newVArray = [];

          // 计算风向并进行过滤
          for (let i = 0; i < uArray.length; i++) {
            // 计算风向（角度），atan2 返回的角度范围是 -π 到 π，因此需要转换为 0° 到 360° 范围
            let angle = Math.atan2(vArray[i], uArray[i]) * (180 / Math.PI);
            if (angle < 0) {
              angle += 360; // 将负角度转换为正角度
            }

            // 如果风向在70°-100°和250°-280°范围内，将其添加到过滤数组中
            if (
              (angle >= 70 && angle <= 100) ||
              (angle >= 250 && angle <= 280)
            ) {
              filteredUArray.push(uArray[i]);
              filteredVArray.push(vArray[i]);
            } else {
              // 否则，将其保留在新的数组中
              newUArray.push(uArray[i]);
              newVArray.push(vArray[i]);
            }
          }

          uArray = newUArray;
          vArray = newVArray;
          // 创建U的JSON对象
          var uData = {
            header: {
              parameterCategory: 1,
              parameterNumber: 2,
              la1: 90.5,
              la2: -90.5,
              lo1: -180.5,
              lo2: 179.5,
              extent: [-180.5, -90.5, 179.5, 90.5],
              nx: 360,
              ny: 181,
              dx: 1,
              dy: 1,
              min: -20.7940673828125,
              max: 30.6459312438965,
              GRIB_COMMENT: "u-component of wind [m/s]",
              GRIB_DISCIPLINE: "0(Meteorological)",
              GRIB_ELEMENT: "UGRD",
              GRIB_FORECAST_SECONDS: "0 sec",
              GRIB_IDS:
                "CENTER=7(US-NCEP) SUBCENTER=0 MASTER_TABLE=2 LOCAL_TABLE=1 SIGNF_REF_TIME=1(Start_of_Forecast) REF_TIME=2020-06-20T00:00:00Z PROD_STATUS=0(Operational) TYPE=1(Forecast)",
              GRIB_PDS_PDTN: "0",
              GRIB_PDS_TEMPLATE_ASSEMBLED_VALUES:
                "2 2 2 0 81 0 0 1 0 103 0 10 255 0 0",
              GRIB_PDS_TEMPLATE_NUMBERS:
                "2 2 2 0 81 0 0 0 1 0 0 0 0 103 0 0 0 0 10 255 0 0 0 0 0",
              GRIB_REF_TIME: "1592611200 sec UTC",
              GRIB_SHORT_NAME: "10-HTGL",
              GRIB_UNIT: "[m/s]",
              GRIB_VALID_TIME: "1592611200 sec UTC",
            },
            data: filteredUArray,
          };

          // 创建V的JSON对象
          var vData = {
            header: {
              parameterCategory: 1,
              parameterNumber: 3,
              la1: 90.5,
              la2: -90.5,
              lo1: -180.5,
              lo2: 179.5,
              extent: [-180.5, -90.5, 179.5, 90.5],
              nx: 360,
              ny: 181,
              dx: 1,
              dy: 1,
              min: -22.7341823577881,
              max: 22.6458168029785,
              GRIB_COMMENT: "v-component of wind [m/s]",
              GRIB_DISCIPLINE: "0(Meteorological)",
              GRIB_ELEMENT: "VGRD",
              GRIB_FORECAST_SECONDS: "0 sec",
              GRIB_IDS:
                "CENTER=7(US-NCEP) SUBCENTER=0 MASTER_TABLE=2 LOCAL_TABLE=1 SIGNF_REF_TIME=1(Start_of_Forecast) REF_TIME=2020-06-20T00:00:00Z PROD_STATUS=0(Operational) TYPE=1(Forecast)",
              GRIB_PDS_PDTN: "0",
              GRIB_PDS_TEMPLATE_ASSEMBLED_VALUES:
                "2 3 2 0 81 0 0 1 0 103 0 10 255 0 0",
              GRIB_PDS_TEMPLATE_NUMBERS:
                "2 3 2 0 81 0 0 0 1 0 0 0 0 103 0 0 0 0 10 255 0 0 0 0 0",
              GRIB_REF_TIME: "1592611200 sec UTC",
              GRIB_SHORT_NAME: "10-HTGL",
              GRIB_UNIT: "[m/s]",
              GRIB_VALID_TIME: "1592611200 sec UTC",
            },
            data: filteredVArray,
          };

          // 将U和V对象整合到数组中
          var result = [uData, vData];
          console.log(result);

          const windOptions = {
            colorScale: [
              "rgb(36,104, 180)",
              "rgb(60,157, 194)",
              "rgb(128,205,193 )",
              "rgb(151,218,168 )",
              "rgb(198,231,181)",
              "rgb(238,247,217)",
              "rgb(255,238,159)",
              "rgb(252,217,125)",
              "rgb(255,182,100)",
              "rgb(252,150,75)",
              "rgb(250,112,52)",
              "rgb(245,64,32)",
              "rgb(237,45,28)",
              "rgb(220,24,32)",
              "rgb(180,0,35)",
            ],
            frameRate: 16,
            maxAge: 60,
            globalAlpha: 0.9,
            velocityScale: 1 / 30,
            paths: 2000,
          };
          const windLayer = new CesiumWind(result, { windOptions });
          windLayer.addTo(viewer);
        };

        request.send();
      });
    },
    // 初始化Cesium场景
    initCesium() {
      // 设置Cesium Ion的默认访问令牌
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NTQxNDQ2NC0zZWY2LTQ2OTMtYTFmOS02M2I3ZjIyYzM1NGQiLCJpZCI6OTkzMjgsImlhdCI6MTY1NjQwOTIyMH0.n5tUNTClw_pGhOV70R6hCR2HLFEUe81hxnflRp3VSTU";
      // 创建Cesium Viewer实例
      const viewer = new Cesium.Viewer("cesiumMap", {
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
            alpha: true, // WebGL透明度
          },
        },
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          // url: 'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}' // 高德地图
          // url: 'https://t2.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=bcbfc51cf0b20e1e0fad16fb77c7d0c4' // 天地图
          // url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}' // 全球影像地址
          url: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/9812/{z}/{y}/{x}", // 影像图层
        }),
      });
      window.viewer = viewer; // 将viewer绑定到window对象上

      // 开启抗锯齿
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        // 判断是否支持图像渲染像素化处理
        viewer.resolutionScale = window.devicePixelRatio; // 设置分辨率比例
      }
      viewer.scene.fxaa = true; // 开启快速近似抗锯齿
      viewer.scene.postProcessStages.fxaa.enabled = true; // 启用后处理阶段的快速近似抗锯齿
      viewer.scene.globe.depthTestAgainstTerrain = false; // 禁用地形深度测试
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权信息

      const windOptions = {
        colorScale: [
          "rgb(36,104, 180)",
          "rgb(60,157, 194)",
          "rgb(128,205,193 )",
          "rgb(151,218,168 )",
          "rgb(198,231,181)",
          "rgb(238,247,217)",
          "rgb(255,238,159)",
          "rgb(252,217,125)",
          "rgb(255,182,100)",
          "rgb(252,150,75)",
          "rgb(250,112,52)",
          "rgb(245,64,32)",
          "rgb(237,45,28)",
          "rgb(220,24,32)",
          "rgb(180,0,35)",
        ],
        frameRate: 16,
        maxAge: 60,
        globalAlpha: 0.9,
        velocityScale: 1 / 30,
        paths: 2000,
      };

      // fetch("https://qjvic.github.io/cesium-wind/examples/wind.json")
      //   .then((res) => res.json())
      //   .then((res) => {
      //     console.log(res);
      //     //const windLayer = new CesiumWind(res, { windOptions });
      //     // windLayer.addTo(viewer);
      //   });
    },
  },
};
</script>
