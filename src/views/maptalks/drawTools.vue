<template>
  <!-- 定义一个 div 元素，用于显示地图，设置宽度为100%，高度为800像素 -->
  <div id="map" style="width: 100%; height: 800px" />
</template>

<script>
import * as maptalks from "maptalks"; // 导入 maptalks 库
import "maptalks/dist/maptalks.css"; // 导入 maptalks 的 CSS 样式
import * as turf from "@turf/turf";
import bohaiJson from "/public/json/baohai_Polygon.json";
import meshJson from "/public/json/mesh_cs.json";
import anxianJson from "/public/json/Xyz2Json_84.json";

export default {
  name: "MapComponent", // 组件的名称
  data() {
    return {
      // 可以在这里定义组件的数据
      coordinates: null,
      bohaiPolygon: null,
      map: null,
    };
  },
  mounted() {
    this.initMapTalk(); // 在组件挂载后初始化地图
  },
  methods: {
    initMapTalk() {
      // 创建一个新的 maptalks.Map 实例
      this.map = new maptalks.Map("map", {
        center: [117.113049, 36.498568], // 设置地图中心的经纬度坐标
        zoom: 10, // 设置地图的初始缩放级别
        baseLayer: new maptalks.TileLayer("base", {
          urlTemplate:
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", // 设置瓦片图层的 URL 模板
          subdomains: ["a", "b", "c", "d"], // 设置子域
          attribution:
            '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>', // 设置版权信息
        }),
      });

      // 创建一个新的矢量图层，并添加到地图中
      var layer = new maptalks.VectorLayer("vector").addTo(this.map);

      // 创建一个绘图工具，初始模式为“点”
      var drawTool = new maptalks.DrawTool({
        mode: "Point",
      })
        .addTo(this.map)
        .disable(); // 添加到地图并禁用

      // 监听绘图结束事件
      drawTool.on("drawend", function (param) {
        console.log(param.geometry); // 打印绘制的几何图形
        layer.addGeometry(param.geometry); // 将几何图形添加到矢量图层中
      });

      // 定义工具栏的项目，包括各种绘图模式和功能
      var items = [
        "Point",
        "LineString",
        "Polygon",
        "Circle",
        "Ellipse",
        "Rectangle",
        "FreeHandLineString",
        "FreeHandPolygon",
      ].map(function (value) {
        return {
          item: value, // 项目的名称
          click: function () {
            drawTool.setMode(value).enable(); // 设置绘图模式并启用绘图工具
          },
        };
      });
      var self = this;
      this.map.on("click", function (e) {
        //reset colors
        layer.forEach(function (g) {
          g.updateSymbol({
            markerFill: "#0e595e",
          });
        });
        //identify
        self.map.identify(
          {
            coordinate: e.coordinate,
            layers: [layer],
          },
          function (geos) {
            if (geos.length === 0) {
              return;
            }
            geos.forEach(function (g) {
              switch (g.type) {
                case "Polygon":
                  g.updateSymbol({
                    polygonFill: "rgb(135,196,240)",
                    polygonOpacity: 1,
                    lineColor: "#1bbc9b",
                    lineWidth: 6,
                    lineJoin: "round", //miter, round, bevel
                    lineCap: "round", //butt, round, square
                    lineDasharray: null, //dasharray, e.g. [10, 5, 5]
                    "lineOpacity ": 1,
                  });

                  break;
                case "LineString":
                  g.updateSymbol({
                    lineColor: "#1bbc9b",
                    lineWidth: 6,
                    lineJoin: "round", //miter, round, bevel
                    lineCap: "round", //butt, round, square
                    lineDasharray: null, //dasharray, e.g. [10, 5, 5]
                    "lineOpacity ": 1,
                  });
                  break;
                case "Point":
                  console.log(g._coordinates);
                  g.updateSymbol({
                    markerFill: "#f00",
                    markerFile: "/img/捕捉折点.png", // 标记图像文件路径
                    markerWidth: 24, // 标记宽度
                    markerHeight: 24, // 标记高度
                  });
                  break;

                default:
                  break;
              }
            });
          }
        );
      });

      // 创建一个工具栏并添加到地图中
      var toolbar = new maptalks.control.Toolbar({
        items: [
          {
            item: "Shape", // 工具栏的主项目
            children: items, // 子项目，即各种绘图模式
          },
          {
            item: "Disable", // 禁用绘图工具的按钮
            click: function () {
              drawTool.disable(); // 禁用绘图工具
            },
          },
          {
            item: "Clear", // 清除矢量图层的按钮
            click: function () {
              layer.clear(); // 清空矢量图层
            },
          },
          {
            item: "岸线",
            click: function () {
              self.loadAnXian();
            },
          },
          {
            item: "三角网", // 清除矢量图层的按钮
            click: function () {
              self.addTrian();
            },
            children: [
              {
                item: "Tin",
                click: function () {
                  self.genTrian();
                },
              },
              {
                item: "前端三角网测试2",
                click: function () {
                  self.testTin();
                },
              },
            ],
          },
          {
            item: "岸线范围", // 清除矢量图层的按钮
            click: function () {
              self.coastLine();
            },
            children: [
              {
                item: "面转线",
                click: function () {
                  self.coastLine2Line();
                },
              },
              {
                item: "要素转点",
                click: function () {
                  self.coastExplodePoint();
                },
              },
              {
                item: "点转线",
                click: function () {
                  self.coastPoint2Line();
                },
              },
              {
                item: "分割线",
                click: function () {
                  self.coastSplitLine();
                },
              },
            ],
          },
        ],
      }).addTo(this.map);
    },
    //加载json面饼记载到地图上
    coastLine() {
      //从feature collection 中获取单个feature
      maptalks.GeoJSON.toGeometry(bohaiJson.features[0]).addTo(
        this.map.getLayer("vector")
      );
    },
    //面转线
    coastLine2Line() {
      var line = turf.polygonToLine(bohaiJson.features[0]);
      maptalks.GeoJSON.toGeometry(line).addTo(this.map.getLayer("vector"));
    },
    //要素转点
    coastExplodePoint() {
      var line = turf.polygonToLine(bohaiJson.features[0]);
      var explode = turf.explode(line);
      console.log(explode);
      explode.features.forEach((element) => {
        maptalks.GeoJSON.toGeometry(element).addTo(this.map.getLayer("vector"));
      });
    },
    //点转线
    coastPoint2Line() {
      var line = turf.polygonToLine(bohaiJson.features[0]);
      var explode = turf.explode(line);
      var coordinates = [];
      explode.features.forEach((element) => {
        coordinates.push(element.geometry.coordinates);
      });
      var linestring1 = turf.lineString(coordinates, { name: "line 1" });
      maptalks.GeoJSON.toGeometry(linestring1).addTo(
        this.map.getLayer("vector")
      );
    },
    //打断线
    coastSplitLine() {
      var line = turf.polygonToLine(bohaiJson.features[0]);
      var line2 = {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [116.66192466198561, 39.44249939480318],
            [122.31036944610531, 39.76526340701045],
          ],
          type: "LineString",
        },
      };
      maptalks.GeoJSON.toGeometry(line2).addTo(this.map.getLayer("vector"));
      var split = turf.lineSplit(line, line2);
      console.log(split);

      split.features.forEach((element) => {
        maptalks.GeoJSON.toGeometry(element).addTo(this.map.getLayer("vector"));
      });
    },
    addTrian() {
      // var converted = turf.toWgs84(meshJson);
      // console.log(converted);
      meshJson.features.forEach((element) => {
        maptalks.GeoJSON.toGeometry(element).addTo(this.map.getLayer("vector"));
      });
    },

    genTrian() {
      // 面转线
      var lines = [];
      meshJson.features.forEach((element) => {
        var line = turf.polygonToLine(element);
        lines.push(line);
        maptalks.GeoJSON.toGeometry(line).addTo(this.map.getLayer("vector"));
      });
      // 线转点
      // 用于存储所有相交点的集合，确保唯一性
      var uniqueIntersections = new Set();

      // 用于存储所有相交点的集合，确保唯一性
      var uniqueIntersections = new Set();

      // 迭代lines数组，找到所有相交点
      for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
          let line1 = lines[i];
          let line2 = lines[j];
          let intersectPoints = turf.lineIntersect(line1, line2);

          if (intersectPoints.features.length > 0) {
            intersectPoints.features.forEach((point) => {
              // 将坐标转换为字符串，确保唯一性
              let coordStr = point.geometry.coordinates.join(",");
              uniqueIntersections.add(coordStr);
            });
          }
        }
      }
      var Points = [];
      // 将唯一的相交点添加到maptalks图层中
      uniqueIntersections.forEach((coordStr) => {
        // 将字符串转换回坐标数组
        let coordinates = coordStr.split(",").map(Number);
        let point = turf.point(coordinates);
        maptalks.GeoJSON.toGeometry(point)
          .addTo(this.map.getLayer("vector"))
          .setSymbol({
            markerType: "ellipse",
            markerFill: "#f00", // 红色
            markerLineColor: "#fff", // 白色边框
            markerLineWidth: 1,
            markerWidth: 10,
            markerHeight: 10,
          });

        Points.push(point);
      });
      console.log(Points);
      console.log(uniqueIntersections);
      var collection = turf.featureCollection(Points);
      var tin = turf.tin(collection);

      tin.features.forEach((element) => {
        maptalks.GeoJSON.toGeometry(element).addTo(this.map.getLayer("vector"));
      });
    },
    testTin() {
      // generate some random point data
      var points = turf.randomPoint(30, { bbox: [50, 30, 70, 50] });
      console.log(points);
      // add a random property to each point between 0 and 9
      for (var i = 0; i < points.features.length; i++) {
        points.features[i].properties.z = ~~(Math.random() * 9);
      }
      var tin = turf.tin(points, "z");
    },
    loadAnXian() {
      anxianJson.features.forEach((element) => {
        maptalks.GeoJSON.toGeometry(element)
          .addTo(this.map.getLayer("vector"))
          .setSymbol({
            markerFile: "/img/Z折点(悬停).png",
            markerWidth: 10,
            markerHeight: 10,
          });
      });

      var coordinates = [];
      anxianJson.features.forEach((element) => {
        coordinates.push(element.geometry.coordinates);
      });
      var linestring1 = turf.lineString(coordinates, { name: "line 1" });

      maptalks.GeoJSON.toGeometry(linestring1)
        .addTo(this.map.getLayer("vector"))
        .setSymbol({
          lineColor: "#1bbc9b", // 线的颜色
          lineWidth: 3, // 线的宽度
          lineDasharray: [10, 10], // 虚线样式
          // markerFile: "/img/Z折点(悬停).png", // 标记图像文件路径
          // markerPlacement: "vertex", // 标记放置位置，顶点
          markerVerticalAlignment: "middle", // 标记垂直对齐方式
          markerWidth: 16, // 标记宽度
          markerHeight: 16, // 标记高度
        });

      var start = turf.point([121.64073575625395, 37.754175814015746]);
      var stop = turf.point([123.79057108474568, 37.71827432244768]);
      var sliced = turf.lineSlice(start, stop, linestring1);
      maptalks.GeoJSON.toGeometry(sliced).addTo(this.map.getLayer("vector"));
    },
  },
};
</script>

<style scoped>
/* 可以添加自定义样式 */
html,
body {
  margin: 0px;
  height: 100%;
  width: 100%;
}
.container {
  width: 100%;
  height: 100%;
}
</style>
