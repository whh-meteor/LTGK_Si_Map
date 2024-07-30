import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Home", icon: "dashboard" },
      },
    ],
  },

  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Example", icon: "el-icon-s-help" },
    hidden: true,
    children: [
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/table/index"),
        meta: { title: "Table", icon: "table" },
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/tree/index"),
        meta: { title: "Tree", icon: "tree" },
      },
    ],
  },
  {
    path: "/Maptalks",
    component: Layout,
    redirect: "/example/table",
    name: "Maptalks",
    meta: { title: "Maptalks", icon: "el-icon-s-help" },
    children: [
      {
        path: "table",
        name: "map",
        component: () => import("@/views/maptalks/map"),
        meta: { title: "加载地图", icon: "table" },
      },
      {
        path: "table1",
        name: "ArcGISTileLayer",
        component: () => import("@/views/maptalks/ArcGISTileLayer"),
        meta: { title: "加载ArcGIS图层", icon: "table" },
      },
      {
        path: "table2",
        name: "2.5D",
        component: () => import("@/views/maptalks/2.5D"),
        meta: { title: "2.5D效果", icon: "table" },
      },
      {
        path: "table3",
        name: "drawTools",
        component: () => import("@/views/maptalks/drawTools"),
        meta: { title: "绘制工具", icon: "table" },
      },
      {
        path: "table4",
        name: "EditPolygon",
        component: () => import("@/views/maptalks/EditPolygon"),
        meta: { title: "编辑多边形", icon: "table" },
      },
      {
        path: "table5",
        name: "building-vertexColors",
        component: () => import("@/views/maptalks/buildings-VertexColors"),
        meta: { title: "threejs建筑物", icon: "table" },
      },
      {
        path: "table6",
        name: "ParticleLayer",
        component: () => import("@/views/maptalks/ParticleLayer"),
        meta: { title: "粒子", icon: "table" },
      },
      {
        path: "table7",
        name: "EditLabelText",
        component: () => import("@/views/maptalks/EditLabelText"),
        meta: { title: "编辑标签内容", icon: "table" },
      },
      {
        path: "table8",
        name: "AddGeojson",
        component: () => import("@/views/maptalks/AddGeojson"),
        meta: { title: "添加Geojson", icon: "table" },
      },
      {
        path: "table9",
        name: "GeometryToGeojson",
        component: () => import("@/views/maptalks/GeometryToGeojson"),
        meta: { title: "几何图形转json", icon: "table" },
      },
      {
        path: "table10",
        name: "ColorInterpolate",
        component: () => import("@/views/maptalks/ColorInterpolate"),
        meta: { title: "颜色插值", icon: "table" },
      },
      {
        path: "table11",
        name: "vertexLine",
        component: () => import("@/views/maptalks/vertexLine"),
        meta: { title: "折点标记线", icon: "table" },
      },
      {
        path: "table12",
        name: "Difference",
        component: () => import("@/views/maptalks/Difference"),
        meta: { title: "矢量图形变化检测", icon: "table" },
      },
      {
        path: "table13",
        name: "DifferenceMore",
        component: () => import("@/views/maptalks/Differencemore"),
        meta: { title: "多个矢量图形变化检测", icon: "table" },
      },
      {
        path: "table14",
        name: "mask",
        component: () => import("@/views/maptalks/mask"),
        meta: { title: "Mask", icon: "table" },
      },
      {
        path: "table15",
        name: "Style",
        component: () => import("@/views/maptalks/Style"),
        meta: { title: "样式配置", icon: "table" },
      },
    ],
  },
  {
    path: "/Cesium", // 添加地图
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Cesium", icon: "el-icon-s-help" },
    children: [
      {
        path: "table",
        name: "cesiumMap",
        component: () => import("@/views/cesium/map"),
        meta: { title: "HelloCesium", icon: "table" },
      },
      {
        path: "table2",
        name: "BingMap",
        component: () => import("@/views/cesium/BingMap"),
        meta: { title: "加载天地图", icon: "table" },
      },
      {
        path: "table3",
        name: "AddImage",
        component: () => import("@/views/cesium/AddImage"),
        meta: { title: "添加ion哨兵底图", icon: "tree" },
      },
      {
        path: "table3-1",
        name: "ArcGISElevation",
        component: () => import("@/views/cesium/ArcGISElevation"),
        meta: { title: "添加ArcGIS地形图", icon: "tree" },
      },
      {
        path: "table4",
        name: "ConfiguringScene",
        component: () => import("@/views/cesium/ConfiguringScene"),
        meta: { title: "配置视窗", icon: "tree" },
      },

      {
        path: "table5",
        name: "StylingEntities",
        component: () => import("@/views/cesium/StylingEntities"),
        meta: { title: "绘制形状", icon: "tree" },
      },
      {
        path: "table6",
        name: "StylingEntitiesCZML",
        component: () => import("@/views/cesium/StylingEntitiesCZML"),
        meta: { title: "使用CZML绘制形状", icon: "tree" },
      },
      {
        path: "table7",
        name: "3DTiles",
        component: () => import("@/views/cesium/3DTiles"),
        meta: { title: "添加3DTiles&调整位置", icon: "tree" },
      },
      {
        path: "table7-1",
        name: "3DGLTF",
        component: () => import("@/views/cesium/3DGLTF"),
        meta: { title: "添加gLTF模型", icon: "tree" },
      },
      {
        path: "table8",
        name: "Material",
        component: () => import("@/views/cesium/Material"),
        meta: { title: "设置图形材质", icon: "tree" },
      },
      {
        path: "table9",
        name: "Entity",
        component: () => import("@/views/cesium/Entity"),
        meta: { title: "实体Entity操作", icon: "tree" },
      },
      {
        path: "table10",
        name: "camera",
        component: () => import("@/views/cesium/camera"),
        meta: { title: "Camera控制", icon: "tree" },
      },
      {
        path: "table101",
        name: "cameraRound",
        component: () => import("@/views/cesium/cameraRound.vue"),
        meta: { title: "中心旋转", icon: "tree" },
      },
      {
        path: "table11",
        name: "geojson",
        component: () => import("@/views/cesium/geojson"),
        meta: { title: "加载geojson", icon: "tree" },
      },
      {
        path: "table12",
        name: "polyline",
        component: () => import("@/views/cesium/polyline"),
        meta: { title: "弧线Polyline", icon: "tree" },
      },
      {
        path: "table14",
        name: "oceanWave",
        component: () => import("@/views/cesium/oceanWave"),
        meta: { title: "海洋波浪", icon: "tree" },
      },
      {
        path: "table15",
        name: "translucency",
        component: () => import("@/views/cesium/translucency"),
        meta: { title: "透明地球", icon: "tree" },
      },
      {
        path: "table13",
        name: "CZMLRoute",
        component: () => import("@/views/cesium/CZMLRoute"),
        meta: { title: "CZML路线", icon: "tree" },
      },
      {
        path: "table21",
        name: "CaseOne",
        component: () => import("@/views/cesium/CaseOne/CaseOne"),
        meta: { title: "综合案例一", icon: "tree" },
      },
      {
        path: "table22",
        name: "geologicalUnderGround",
        component: () => import("@/views/cesium/geologicalUnderGround"),
        meta: { title: "地质数据地下模式", icon: "tree" },
      },
      {
        path: "table23",
        name: "UnderGroundModel",
        component: () => import("@/views/cesium/UnderGroundModel"),
        meta: { title: "地下模型", icon: "tree" },
      },
      {
        path: "table24",
        name: "CaseTwo",
        component: () => import("@/views/cesium/CaseTwo/CaseTwo"),
        meta: { title: "案例二：地质层-流场展示", icon: "tree" },
      },
      {
        path: "table25",
        name: "pointsCloud",
        component: () => import("@/views/cesium/pointsCloud"),
        meta: { title: "模拟点云效果", icon: "tree" },
      },
      {
        path: "table26",
        name: "triangulation",
        component: () => import("@/views/cesium/triangulation"),
        meta: { title: "绘制三角网", icon: "tree" },
      },
      {
        path: "table27",
        name: "triangulation_surface",
        component: () => import("@/views/cesium/triangulation_surface"),
        meta: { title: "三角网导出", icon: "tree" },
      },
      {
        path: "table28",
        name: "DrawEntity",
        component: () => import("@/views/cesium/DrawEntity"),
        meta: { title: "实体绘制与编辑", icon: "tree" },
      },
    ],
  },
  {
    path: "/threejs",
    component: Layout,
    redirect: "/nested/menu1",
    name: "ThreeJS",
    meta: { title: "ThreeJS", icon: "el-icon-s-help" },
    children: [
      {
        path: "three",
        name: "threejs",
        component: () => import("@/views/threejs/threejs"),
        meta: { title: "创建场景", icon: "form" },
      },
      {
        path: "three2",
        name: "itemTrans",
        component: () => import("@/views/threejs/itemTrans"),
        meta: { title: "物体位移与父子元素", icon: "form" },
      },
      {
        path: "three3",
        name: "itemRound",
        component: () => import("@/views/threejs/itemRound"),
        meta: { title: "物体缩放与旋转", icon: "form" },
      },
      {
        path: "three4",
        name: "Animation",
        component: () => import("@/views/threejs/Animation"),
        meta: { title: "Animation动画", icon: "form" },
      },
      {
        path: "three5",
        name: "BufferGeomeetry",
        component: () => import("@/views/threejs/Geomeetry"),
        meta: { title: "几何BufferGeomeetry", icon: "form" },
      },
      {
        path: "three6",
        name: "Gui",
        component: () => import("@/views/threejs/lilGui"),
        meta: { title: "Lil-GUI", icon: "form" },
      },
      {
        path: "three7",
        name: "vertices",
        component: () => import("@/views/threejs/vertices"),
        meta: { title: "几何顶点", icon: "form" },
      },
      {
        path: "three8",
        name: "MaterialDifferentiation",
        component: () => import("@/views/threejs/MaterialDifferentiation"),
        meta: { title: "顶点划分材质", icon: "form" },
      },
      {
        path: "three9",
        name: "texture",
        component: () => import("@/views/threejs/texture"),
        meta: { title: "贴图与纹理", icon: "form" },
      },
      {
        path: "three10",
        name: "CubeTexture",
        component: () => import("@/views/threejs/CubeTexture"),
        meta: { title: "CubeTexture环境贴图", icon: "form" },
      },
    ],
  },

  {
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    hidden: true,
    meta: {
      title: "Nested",
      icon: "nested",
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/nested/menu1/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "Menu1" },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/nested/menu1/menu1-1"),
            name: "Menu1-1",
            meta: { title: "Menu1-1" },
          },
          {
            path: "menu1-2",
            component: () => import("@/views/nested/menu1/menu1-2"),
            name: "Menu1-2",
            meta: { title: "Menu1-2" },
            children: [
              {
                path: "menu1-2-1",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-1"),
                name: "Menu1-2-1",
                meta: { title: "Menu1-2-1" },
              },
              {
                path: "menu1-2-2",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-2"),
                name: "Menu1-2-2",
                meta: { title: "Menu1-2-2" },
              },
            ],
          },
          {
            path: "menu1-3",
            component: () => import("@/views/nested/menu1/menu1-3"),
            name: "Menu1-3",
            meta: { title: "Menu1-3" },
          },
        ],
      },
      {
        path: "menu2",
        component: () => import("@/views/nested/menu2/index"),
        name: "Menu2",
        meta: { title: "menu2" },
      },
    ],
  },

  {
    path: "external-link",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
