(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-723d75e6"],{"0584":function(e,t,i){"use strict";(function(e){var n=i("2909"),r=i("5530"),o=(i("99af"),i("4de4"),i("caad"),i("d81d"),i("b0c0"),i("a9e3"),i("d3b7"),i("2532"),i("c7cd"),i("159b"),i("112e")),a=i("f248"),s=i("addb");t["a"]={mounted:function(){},data:function(){return{lineIds:[0]}},methods:{removeEntityById:function(e){window.viewer.entities.remove(window.viewer.entities.getById(e))},initMountainPathPlay:function(){var t=this;window.viewer.scene.terrainProvider=new e.CesiumTerrainProvider({url:"http://inner.qdlimap.cn:7001/GisServer/terrain/haishanzhouwei/"});var i=new e.UrlTemplateImageryProvider({url:"http://inner.qdlimap.cn:7001/GisServer/terrain/haidi_wenli_quanqiu/{z}/{x}/{y}.png"});window.viewer.imageryLayers.addImageryProvider(i,1);var n=4;window.viewer.scene.globe.terrainExaggeration=n,window.viewer.camera.setView({destination:e.Cartesian3.fromDegrees(156.53161020845033,11.415844854324565,200022),orientation:{roll:.0015543983024004504,heading:6.22000337604658,pitch:-1.096564258158123}}),setTimeout((function(){window.viewer.camera.flyTo({destination:e.Cartesian3.fromDegrees(156.2,12,0),orientation:{roll:.0015543983024004504,heading:6.22000337604658,pitch:-.45196564258158123},duration:5,complete:function(){var e=[[156.26,12.16,-3e3*n],[156.24,12.26,-3e3*n],[156.27,12.35,-3e3*n]];e=t.getLineDots(e,100),t.pathPlay({paths:e,model:"static/Models/jlh.glb",speed:6,scale:.1,fixed:!0})}})}),3e3)},initGlobalPathPlay:function(){for(var t=this,i=21,n=[],o=120;o<361;o++)n.push([o,i,2e5]);for(var a=0;a<121;a++)n.push([a,i,2e5]);var s={destination:e.Cartesian3.fromDegrees(120,25,18e6),orientation:{roll:0,heading:0,pitch:-1.5698490520914739},duration:2};window.viewer.camera.flyTo(Object(r["a"])(Object(r["a"])({},s),{},{complete:function(){t.pathPlay({paths:n,camera:s,model:"static/Models/jlh.glb",speed:20,scale:0,fixed:!1})}}))},pathPlay:function(e){var t=e.paths,i=e.camera,n=e.model,r=e.scale,o=e.fixed,s=e.speed;Object(a["c"])(window.viewer),Object(a["a"])({viewer:window.viewer,id:"path",paths:t,speed:s,model:n}),Object(a["d"])({viewer:window.viewer,id:"path",fixed:o,camera:i}),Object(a["b"])(window.viewer,"path",r||0)},removePath:function(){Object(a["c"])(window.viewer),this.removeEntityById("path")},removeEntity:function(e){window.viewer.entities.remove(window.viewer.entities.getById(e))},removeLines:function(e){var t=this,i=this.lineIds;1===e&&(i=this.lineIds.filter((function(e){return e.includes("line-")}))),2===e&&(i=this.lineIds.filter((function(e){return!e.includes("line-")}))),i.forEach((function(e){t.removeEntity(e)}))},initLines:function(t){var i=this,r=t.features.map((function(e){return{coords:e.geometry.coordinates,name:e.properties.type,properties:e.properties}})),o=r.filter((function(e){return"buoy"===e.properties.equiptype&&"xht"===e.properties.area}));o.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var a=r.filter((function(e){return"buoy"===e.properties.equiptype&&"wx"===e.properties.area}));a.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var c=r.filter((function(e){return"xht"===e.properties.equiptype}));c.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[9e3])}));var l=r.filter((function(e){return"wx"===e.properties.equiptype}));l.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[18e4])}));var d=r.filter((function(e){return"jz"===e.properties.equiptype}));d.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var p=["A0","A5"],u=r.filter((function(e){return"marker"===e.properties.equiptype&&p.includes(e.properties.type)}));u.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var f=r.filter((function(e){return"tower"===e.properties.equiptype}));f.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var h=f.map((function(e){return e.properties.area})),m=r.filter((function(e){return"marker"===e.properties.equiptype&&h.includes(e.properties.type)}));m.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var v=r.filter((function(e){return"platform"===e.properties.equiptype}));v.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])}));var g=v.map((function(e){return e.properties.area})),y=r.filter((function(e){return"marker"===e.properties.equiptype&&g.includes(e.properties.type)}));y.forEach((function(e){return e.coords=[].concat(Object(n["a"])(e.coords),[100])})),this.initLineData(o,c,0,"#02ffff"),this.initLineData(a,l,0,"#ffea02"),this.initLineData(c,d,0,"#10ff00"),this.initLineData(l,u,0,"#02ffff"),this.initLineData(d,u,.4,"#10ff00",3),this.initLineData(f,m,.4,"#10ff00",3),this.initLineData(v,y,.4,"#10ff00",3);var w=s,b=w.features.map((function(e){var t=e.geometry.coordinates.reverse();return{coords:t.map((function(e){return[].concat(Object(n["a"])(e),[100])})),name:e.id,properties:e.properties}})),x=b.filter((function(e){return e.properties.name}));x.forEach((function(t,n){i.drawLine(t.coords,{width:1,color:e.Color(255,255,255,.5),animation:!1,dash:!0,label:{text:"",show:!0,fillColor:e.Color.fromCssColorString("#ffffff"),font:"normal 14px MicroSoft YaHei",showBackground:!1,horizontalOrigin:e.HorizontalOrigin.LEFT,verticalOrigin:e.VerticalOrigin.TOP}},t)}));var C=b.filter((function(e){return!e.properties.name}));C.forEach((function(t,n){i.drawLine(t.coords,{gradient:.4,width:3,color:e.Color.fromCssColorString("#10ff00"),animation:!0},t)}))},initLineData:function(t,i,n,r,o){var a=this,s=t.map((function(t){var n=i.filter((function(e){return e.properties.equiptype===t.properties.area||e.properties.type===t.properties.area}));return n.map((function(i){return{coords:[t.coords,i.coords],fillColor:e.Color.fromCssColorString("#10ff00"),name:"line-"+t.name+"-"+i.name,properties:t.properties}}))}));s.forEach((function(t,i){t.forEach((function(t){var i=window.viewer.entities.getById(t.name);i||a.drawLine(t.coords,{width:o||1,gradient:n,color:e.Color.fromCssColorString(r||"#ffffff"),animation:!0},t)}))}))},drawLine:function(t,i,r){var a,s=[];if(t.forEach((function(e){s.push.apply(s,Object(n["a"])(e))})),!(s.length<6)){var c=i.color||e.Color.YELLOW.withAlpha(1);i.animation&&(c=new o["a"]({color:i.color||new e.Color(1,1,0,1),speed:i.speed||20,percent:i.percent||.3,gradient:i.gradient})),i.dash&&(c=new e.PolylineDashMaterialProperty({color:e.Color.fromCssColorString("#1a6dcf"),dashLength:20}));var l=parseInt(t.length/2||0),d={name:r.name,id:r.name?r.name:"temp"+new Date,position:(a=e.Cartesian3).fromDegrees.apply(a,Object(n["a"])(t[l])),polyline:{show:!0,positions:e.Cartesian3.fromDegreesArrayHeights(s),width:i.width||2,material:c,clampToGround:!1,disableDepthTestDistance:Number.POSITIVE_INFINITY}};i.label&&(d.label=i.label,d.label.text=r.properties.name),this.lineIds.push(r.name),window.viewer.entities.add(d)}},getLineDots:function(t,i){if(0===t.length)return[];for(var r=t.map((function(t){var i;return(i=e.Cartesian3).fromDegrees.apply(i,Object(n["a"])(t))})),o=r.map((function(e,t){return 0+1*t/(r.length-1)})),a=new e.HermiteSpline.createNaturalCubic({times:o,points:r}),s=[],c=i,l=0;l<=c;l++){var d=a.evaluate(l/c);s.push(d)}return s=s.map((function(i){var n=window.viewer.scene.globe.ellipsoid,r=n.cartesianToCartographic(i),o=e.Math.toDegrees(r.latitude),a=e.Math.toDegrees(r.longitude),s=r.height;return t[0][2]?[a,o,s]:[a,o]})),s}}}}).call(this,i("ec35"))},"06c5":function(e,t,i){"use strict";i.d(t,"a",(function(){return r}));i("a630"),i("fb6a"),i("b0c0"),i("d3b7"),i("ac1f"),i("00b4"),i("25f0"),i("3ca3");var n=i("6b75");function r(e,t){if(e){if("string"==typeof e)return Object(n["a"])(e,t);var i={}.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?Object(n["a"])(e,t):void 0}}},"112e":function(e,t,i){"use strict";(function(e){i.d(t,"a",(function(){return o}));var n=i("d4ec"),r=i("bee2"),o=function(){function t(i){Object(n["a"])(this,t),this._definitionChanged=new e.Event,this._color=void 0,this._speed=void 0,this._percent=void 0,this._gradient=void 0,this.color=i.color,this.speed=i.speed,this.percent=i.percent,this.gradient=i.gradient}return Object(r["a"])(t,[{key:"isConstant",get:function(){return!1}},{key:"definitionChanged",get:function(){return this._definitionChanged}},{key:"getType",value:function(t){return e.Material.LineFlowMaterialType}},{key:"getValue",value:function(t,i){return e.defined(i)||(i={}),i.color=e.Property.getValueOrDefault(this._color,t,e.Color.RED,i.color),i.speed=e.Property.getValueOrDefault(this._speed,t,5,i.speed),i.percent=e.Property.getValueOrDefault(this._percent,t,.1,i.percent),i.gradient=e.Property.getValueOrDefault(this._gradient,t,.01,i.gradient),i}},{key:"equals",value:function(i){return this===i||i instanceof t&&e.Property.equals(this._color,i._color)&&e.Property.equals(this._speed,i._speed)&&e.Property.equals(this._percent,i._percent)&&e.Property.equals(this._gradient,i._gradient)}}])}();Object.defineProperties(o.prototype,{color:e.createPropertyDescriptor("color"),speed:e.createPropertyDescriptor("speed"),percent:e.createPropertyDescriptor("percent"),gradient:e.createPropertyDescriptor("gradient")}),e.Material.LineFlowMaterialProperty="LineFlowMaterialProperty",e.Material.LineFlowMaterialType="LineFlowMaterialType",e.Material.LineFlowMaterialSource="\n    uniform vec4 color;\n    uniform float speed;\n    uniform float percent;\n    uniform float gradient;\n\n    czm_material czm_getMaterial(czm_materialInput materialInput){\n      czm_material material = czm_getDefaultMaterial(materialInput);\n      vec2 st = materialInput.st;\n      float t =fract(czm_frameNumber * speed / 1000.0);\n      t *= (1.0 + percent);\n      float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);\n      alpha += gradient;\n      material.diffuse = color.rgb;\n      material.alpha = alpha;\n      return material;\n    }\n    ",e.Material._materialCache.addMaterial(e.Material.LineFlowMaterialType,{fabric:{type:e.Material.LineFlowMaterialType,uniforms:{color:new e.Color(1,0,0,1),speed:10,percent:.1,gradient:.01},source:e.Material.LineFlowMaterialSource},translucent:function(e){return!0}})}).call(this,i("ec35"))},1148:function(e,t,i){"use strict";var n=i("a691"),r=i("1d80");e.exports="".repeat||function(e){var t=String(r(this)),i="",o=n(e);if(o<0||o==1/0)throw RangeError("Wrong number of repetitions");for(;o>0;(o>>>=1)&&(t+=t))1&o&&(i+=t);return i}},"137b":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("div",{staticClass:"cesium",attrs:{id:"cesiumMap"}})])}],o=i("9c1f"),a=o["a"],s=i("2877"),c=Object(s["a"])(a,n,r,!1,null,null,null);t["default"]=c.exports},2909:function(e,t,i){"use strict";i.d(t,"a",(function(){return c}));var n=i("6b75");function r(e){if(Array.isArray(e))return Object(n["a"])(e)}i("a4d3"),i("e01a"),i("d28b"),i("a630"),i("d3b7"),i("3ca3"),i("ddb0");function o(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}var a=i("06c5");function s(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(e){return r(e)||o(e)||Object(a["a"])(e)||s()}},"3ee4":function(e,t,i){},"408a":function(e,t,i){var n=i("c6b6");e.exports=function(e){if("number"!=typeof e&&"Number"!=n(e))throw TypeError("Incorrect invocation");return+e}},"6b75":function(e,t,i){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=Array(t);i<t;i++)n[i]=e[i];return n}i.d(t,"a",(function(){return n}))},"81d5":function(e,t,i){"use strict";var n=i("7b0b"),r=i("23cb"),o=i("50c4");e.exports=function(e){var t=n(this),i=o(t.length),a=arguments.length,s=r(a>1?arguments[1]:void 0,i),c=a>2?arguments[2]:void 0,l=void 0===c?i:r(c,i);while(l>s)t[s++]=e;return t}},"9c1f":function(e,t,i){"use strict";(function(e){i("a9e3"),i("b680"),i("d3b7"),i("25f0"),i("159b");var n=i("e48d"),r=i("0584"),o=i("e52d"),a=i("dfa1"),s=i("bc3a"),c=i.n(s);i("03f0"),i("d4d8");t["a"]={name:"CaseOne",mixins:[r["a"]],data:function(){return{infoToolPop:null,buoyPositions:[],standards:[0,1,2,3,4,5,6,7],waveHeight:2,worldRectangle:!1,wf:[.01,.04,.08,.1,.13,.15,.18,.2]}},mounted:function(){var e=this;this.$nextTick((function(){e.initCesium()}))},methods:{initCesium:function(){var t=this;e.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NTQxNDQ2NC0zZWY2LTQ2OTMtYTFmOS02M2I3ZjIyYzM1NGQiLCJpZCI6OTkzMjgsImlhdCI6MTY1NjQwOTIyMH0.n5tUNTClw_pGhOV70R6hCR2HLFEUe81hxnflRp3VSTU";var i=new e.Viewer("cesiumMap",{geocoder:!1,animation:!1,baseLayerPicker:!1,fullscreenButton:!1,vrButton:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,timeline:!1,navigationHelpButton:!1,navigationInstructionsInitiallyVisible:!1,navigation:!0,sceneModel:e.SceneMode.SCENE3D,orderIndependentTranslucency:!1,contextOptions:{webgl:{alpha:!0}},imageryProvider:new e.UrlTemplateImageryProvider({url:"https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/9812/{z}/{y}/{x}"})});window.viewer=i,this.initData(),this.addFlow(),e.FeatureDetection.supportsImageRenderingPixelated()&&(i.resolutionScale=window.devicePixelRatio),i.scene.fxaa=!0,i.scene.postProcessStages.fxaa.enabled=!0,i.scene.globe.depthTestAgainstTerrain=!1,i._cesiumWidget._creditContainer.style.display="none";var r=this.$loading({lock:!0,text:"加载中...",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"});i.camera.setView({destination:e.Cartesian3.fromDegrees(0,0,5e8),orientation:{heading:.2079384332084935,roll:.00031509431759868534,pitch:-1},duration:3}),this.camera({position:{x:0,y:0,z:24e6},orientation:{roll:6.2079384332084935,heading:.00031509431759868534,pitch:-1.535},duration:2},(function(){setTimeout((function(){r&&r.close(),t.camera({position:{x:123.051061,y:25.758157,z:24e6},orientation:{roll:6.2079384332084935,heading:.00031509431759868534,pitch:-1.535},duration:8},(function(){t.camera({position:{x:123.051061,y:25.758157,z:24e5},orientation:{roll:6.2079384332084935,heading:.00031509431759868534,pitch:-1.535},duration:2},(function(){t.camera({position:{x:123.061061,y:23.758157,z:35e4},orientation:{roll:0,heading:0,pitch:-.5},duration:2},(function(){t.initLines(o)}))}))}))}),2e3)})),this.infoToolPop=new n["a"](i);var a={},s=new e.ScreenSpaceEventHandler(i.scene.canvas);s.setInputAction((function(t){var n=i.camera.pickEllipsoid(t.position),r=e.Cartographic.fromCartesian(n),o=e.Math.toDegrees(r.longitude),s=e.Math.toDegrees(r.latitude),c=r.height;a={longitude:Number(o.toFixed(6)),latitude:Number(s.toFixed(6)),altitude:Number(c.toFixed(2))}}),e.ScreenSpaceEventType.LEFT_CLICK),i.selectedEntityChanged.addEventListener((function(e){e&&setTimeout((function(){t.initPopShow(e,a)}))})),window.popupClick=function(e){t.$emit("handleSeaBuoy")}},camera:function(t,i){window.viewer.camera.flyTo({destination:e.Cartesian3.fromDegrees(t.position.x,t.position.y,t.position.z),orientation:t.orientation,duration:t.duration,complete:function(){i&&i()}})},initPopShow:function(t,i){var n={position:e.Cartesian3.fromDegrees(i.longitude,i.latitude,0),content:{title:"浮标信息",props:{"浮标编号":t["_id"],"经度":i.longitude,"纬度":i.latitude},button:{key:"detail",label:"查看详情"}}},r={};this.infoToolPop.add(n,r)},initData:function(){var e=this,t=this,i=o,n=i.features;n.forEach((function(i){switch(i.properties.equiptype){case"buoy":t.buoyPositions.push(i),e.addBuoy(i);break;case"platform":e.addCommonModel({id:i.properties.type,scale:6e3,url:"/static/models/sea/ZuanJingPingTai.glb",position:{x:i.geometry.coordinates[0],y:i.geometry.coordinates[1],z:0}});break;case"tower":e.addCommonModel({id:i.properties.type,scale:300,url:"/static/models/sea/FengLiFaDianJi.glb",position:{x:i.geometry.coordinates[0],y:i.geometry.coordinates[1],z:0}});break;case"xht":e.addCommonModel({id:i.properties.type,scale:3e3,url:"/static/models/sea/Ta.glb",position:{x:i.geometry.coordinates[0],y:i.geometry.coordinates[1],z:0}});break;case"wx":e.addCommonModel({id:i.properties.type,scale:600,url:"/static/models/sea/WeiXing.glb",position:{x:i.geometry.coordinates[0],y:i.geometry.coordinates[1],z:18e4}});break;case"jz":e.addCommonModel({id:i.properties.type,scale:3e3,url:"/static/models/sea/JiZhan.glb",position:{x:i.geometry.coordinates[0],y:i.geometry.coordinates[1],z:0}});break;case"marker":"A0"!==i.properties.type&&"A5"!==i.properties.type||e.addCommonModel({id:i.properties.type,scale:2e3,url:"/static/models/sea/DaSha.glb",position:{x:i.geometry.coordinates[0],y:i.geometry.coordinates[1],z:0}});var n={position:i.geometry.coordinates,label:i.properties.type};setTimeout((function(){e.addLabelMaker(n)}),15e3);break}}))},addCommonModel:function(t){window.viewer.entities.add({id:t.id,position:new e.Cartesian3.fromDegrees(t.position.x,t.position.y,t.position.z),model:{uri:t.url,scale:t.scale}})},addLabelMaker:function(t){window.viewer.entities.add({position:e.Cartesian3.fromDegrees(t.position[0],t.position[1],1e4),label:{text:t.label,font:"normal 20px MicroSoft YaHei",fillColor:e.Color.fromCssColorString("#10ff00")}})},addBuoy:function(t){for(var i=this,n=t.properties.type,r=t.geometry.coordinates,o=window.viewer.entities.add({id:n,position:new e.Cartesian3.fromDegrees(r[0],r[1],0),model:{uri:"/static/three/models/10M_FenZuJian_220909.gltf",scale:700}}),a=0;a<this.standards.length;a++)if(this.standards[a]===this.waveHeight){this.standards.length-this.waveHeight;break}var s=5*i.waveHeight,c=!1,l=5*i.waveHeight,d=Math.floor(100*Math.random());d=d%2===0?d:-1*d;var p=0,u=0;o.orientation=new e.CallbackProperty((function(){var t=window.viewer.entities.getById(n),i=t.position._value;u=Math.sin(.01*d),c?(p=u*s,i.z=i.z-u*l,isNaN(i.z)&&(i.z=0,alert("Invalid p.z value: NaN")),d-=6,d<-180&&(c=!1)):(p=u*s,i.z=i.z+u*l,d+=6,d>180&&(c=!0));var r=new e.HeadingPitchRoll(0,e.Math.toRadians(p),0);return e.Transforms.headingPitchRollQuaternion(i,r)}),!1)},showOrHideWave:function(){var t=this,i=this,n=window.viewer.scene,r=a.features,o=[];if(void 0===this.geometry)for(var s=0;s<r.length;s++)for(var c=function(){var i=r[s].geometry.coordinates[l].toString().split(","),n=[];i.forEach((function(e){n.push(parseFloat(e))}));var a=new e.PolygonGeometry({polygonHierarchy:new e.PolygonHierarchy(e.Cartesian3.fromDegreesArray(n)),extrudedHeight:5}),c=t.geometry=e.PolygonGeometry.createGeometry(a);o.push(new e.GeometryInstance({geometry:c,attributes:{color:e.ColorGeometryInstanceAttribute.fromColor(e.Color.GREEN)}})),t.instances=o},l=0;l<r[s].geometry.coordinates.length;l++)c();function d(t,n){t.appearance.material=new e.Material({fabric:{type:"Water",uniforms:{specularMap:"/static/texture/global_world.jpg",normalMap:"/static/img/admin/watex80.jpg",frequency:1e4*i.wf[7-i.waveHeight],animationSpeed:i.wf[i.waveHeight-1],amplitude:1e4*i.waveHeight}}})}this.worldRectangle&&(window.viewer.scene.primitives.remove(this.worldRectangle),this.worldRectangle=void 0);var p=this.worldRectangle=window.viewer.scene.primitives.add(new e.Primitive({id:"sea",geometryInstances:this.instances,appearance:new e.EllipsoidSurfaceAppearance({aboveGround:!0}),show:!0,asynchronous:!1}));d(p,n)},addFlow:function(){var e=this,t={west:73.18,south:10.68,east:142.81,north:45.08};window.heatMap=CesiumHeatmap.create(window.viewer,t,{backgroundColor:"rgba(0,0,0,0)",radius:50,maxOpacity:.5,minOpacity:0,blur:.75,gradient:{".3":"#76adff",".65":"#167fff",".8":"#003dd8",".95":"#002090"}}),c.a.get("http://119.167.138.12:6902/lte/sampledata/flow.json").then((function(t){var i=t.data;if(i){e.drawFlow(i);var n=[];i.forEach((function(e){var t=parseFloat(e[1]),i=parseFloat(e[2]),r=10*e[3];n.push({x:t,y:i,value:r})})),console.log(n),window.heatMap.setWGS84Data(0,10,n)}else console.log(i)})).catch((function(e){console.error("error：",e)}))},drawFlow:function(t){e.PolylineTrailLinkMaterialProperty.add2Material();var i=new e.PolylineTrailLinkMaterialProperty(e.Color.Green,2e3);i.color=new e.Color(255,255,255,.2);var n=t.length;window.instances=[];for(var r=0;r<n;r++){for(var o=t[r],a=this.parabolaEquation([o[1]-0,o[2]-0,-4e3],(o[4]-0)*(Math.PI/180),2*(o[3]-0),6),s=[],c=0;c<a.length;c++)s.push(a[c][0],a[c][1],a[c][2]);window.instances.push(window.viewer.entities.add({name:"PolylineTrailLink"+r,polyline:{positions:e.Cartesian3.fromDegreesArrayHeights(s),width:2,material:i}}))}},parabolaEquation:function(e,t,i,n){for(var r=[],o="undefined"===typeof e[2]?0:e[2],a="undefined"===typeof e[2]?0:e[2],s="undefined"===typeof n&&n<3?10:n,c=a-o,l=e[0],d=e[1],p=i/n,u=c/n,f=0;f<s;f++){var h,m,v,g=p*f;v=o+u*f,m=Math.cos(t)*g+d,h=Math.sin(t)*g+l,r.push([h,m,v])}return r},clearFlow:function(){window.heatMap.remove(),window.instances.forEach((function(e){e._show=!1}))}}}}).call(this,i("ec35"))},addb:function(e){e.exports=JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","id":0,"geometry":{"type":"LineString","coordinates":[[122.27874755859375,30.04351806640625],[122.43292236328125,30.05120849609375],[122.4747314453125,29.9808349609375],[122.99639892578125,29.72186279296875],[123.95953369140625,29.5201416015625],[124.71148681640625,29.025146484375]]},"properties":{"FID":0,"Id":0,"name":""}},{"type":"Feature","id":1,"geometry":{"type":"LineString","coordinates":[[121.87695233487477,30.87347553496045],[121.93596296781948,30.829693452453114],[122.4994193340001,30.81065776440647],[122.55271926053058,30.83730772767177],[122.67264409522443,30.862054122132463],[122.84396528764421,30.844922002890485],[123.26275042467034,30.315729875193767],[123.90234954303753,29.756080646622593],[123.95953369140625,29.520141601562614]]},"properties":{"FID":1,"Id":0,"name":""}},{"type":"Feature","id":2,"geometry":{"type":"LineString","coordinates":[[121.87695233487477,30.87347553496045],[121.93646262236246,30.656057296812378],[122.01641251215824,30.51328963646256],[122.31336924568586,30.326739893605577],[122.8387542357732,30.16874368281833],[124.80323724218681,28.96354668336528],[124.93550029704299,28.34009399030503]]},"properties":{"FID":2,"Id":0,"name":"海底管道"}},{"type":"Feature","id":3,"geometry":{"type":"LineString","coordinates":[[121.91552336551104,29.744247839378318],[121.93836619116712,29.706176463285033],[122.04686961303287,29.689044344043054],[122.18583013577347,29.502494601185845],[122.60842241040882,29.416834004975954],[123.44979982207053,28.714417116054847],[124.93550029704299,28.34009399030503]]},"properties":{"FID":3,"Id":0,"name":"海底管道"}}]}')},b680:function(e,t,i){"use strict";var n=i("23e7"),r=i("a691"),o=i("408a"),a=i("1148"),s=i("d039"),c=1..toFixed,l=Math.floor,d=function(e,t,i){return 0===t?i:t%2===1?d(e,t-1,i*e):d(e*e,t/2,i)},p=function(e){var t=0,i=e;while(i>=4096)t+=12,i/=4096;while(i>=2)t+=1,i/=2;return t},u=c&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!s((function(){c.call({})}));n({target:"Number",proto:!0,forced:u},{toFixed:function(e){var t,i,n,s,c=o(this),u=r(e),f=[0,0,0,0,0,0],h="",m="0",v=function(e,t){var i=-1,n=t;while(++i<6)n+=e*f[i],f[i]=n%1e7,n=l(n/1e7)},g=function(e){var t=6,i=0;while(--t>=0)i+=f[t],f[t]=l(i/e),i=i%e*1e7},y=function(){var e=6,t="";while(--e>=0)if(""!==t||0===e||0!==f[e]){var i=String(f[e]);t=""===t?i:t+a.call("0",7-i.length)+i}return t};if(u<0||u>20)throw RangeError("Incorrect fraction digits");if(c!=c)return"NaN";if(c<=-1e21||c>=1e21)return String(c);if(c<0&&(h="-",c=-c),c>1e-21)if(t=p(c*d(2,69,1))-69,i=t<0?c*d(2,-t,1):c/d(2,t,1),i*=4503599627370496,t=52-t,t>0){v(0,i),n=u;while(n>=7)v(1e7,0),n-=7;v(d(10,n,1),0),n=t-1;while(n>=23)g(1<<23),n-=23;g(1<<n),v(1,1),g(2),m=y()}else v(0,i),v(1<<-t,0),m=y()+a.call("0",u);return u>0?(s=m.length,m=h+(s<=u?"0."+a.call("0",u-s)+m:m.slice(0,s-u)+"."+m.slice(s-u))):m=h+m,m}})},bee2:function(e,t,i){"use strict";i.d(t,"a",(function(){return o}));var n=i("a38e");function r(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,Object(n["a"])(r.key),r)}}function o(e,t,i){return t&&r(e.prototype,t),i&&r(e,i),Object.defineProperty(e,"prototype",{writable:!1}),e}},d4ec:function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}i.d(t,"a",(function(){return n}))},e48d:function(e,t,i){"use strict";(function(e){var n=i("d4ec"),r=i("bee2"),o=i("ade3"),a=(i("b0c0"),i("3ee4"),i("ecb4")),s=i("e5c9"),c=function(){function t(e){Object(n["a"])(this,t),Object(o["a"])(this,"__element",void 0),Object(o["a"])(this,"viewer",void 0),this.viewer=e,this.__element=document.createElement("div"),this.__element.id="infoTool_"+a["a"](!0),this.__element.name="infoTool",this.__element.classList.add("helsing-three-plugins-infotool"),this.__element.appendChild(document.createElement("div")),this.__element.appendChild(document.createElement("div")),this.__element.parent="",e.container.appendChild(this.__element)}return Object(r["a"])(t,[{key:"add",value:function(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;if(i){var r,o,s,c;if(i instanceof e.Cesium3DTileFeature)c=i,i={};else{if(i instanceof e.Cartesian2||i instanceof e.Cartesian3?(r=i,i={}):(r=i.position,c=i.inputFeature),!r)return;if(r instanceof e.Cartesian2?(s=this.viewer.camera.pickEllipsoid(r,this.viewer.scene.globe.ellipsoid),o=r):(s=r,o=e.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene,s)),!s)return}var l=this,d="";if("info"===i.type){var p=c||this.viewer.scene.pick(o);if(!e.defined(p))return void this.remove();if(p instanceof Cesium3DTileFeature)for(var u=p.getPropertyNames(),f=u.length,h=0;h<f;++h){var m=u[h];d+='"'+m+'": "'+p.getProperty(m)+'",\n'}else if(p.id){var v=p.id.properties;if(v)for(var g=v._propertyNames,y=g.length,w=0;w<y;++w){var b=g[w];d+='"'+b+'": "'+v[b]._value+'",\n'}}}this.remove(),(d||i.content)&&(i.position=s,i.element=i.element||this.__element,t.createInfoTool(this.viewer,i,(function(){d?a["d"](l.__element.querySelector("div:nth-child(2)"),d):a["c"](l.__element.querySelector("div:nth-child(2)"),i.content,(function(){l.remove("onclickClose")})),"function"===typeof n&&n()})),i.parent&&(this.__element.parent=i.parent))}}},{key:"remove",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;"onclickClose"===e&&s["a"].$emit("popupClose",!0),a["b"](this.__element,"opacity","0"),a["b"](this.__element.querySelector("div:nth-child(1)"),"transition",""),a["b"](this.__element.querySelector("div:nth-child(2)"),"transition",""),a["b"](this.__element.querySelector("div:nth-child(1)"),"height","0"),a["b"](this.__element.querySelector("div:nth-child(2)"),"pointer-events","none")}},{key:"getParent",value:function(){return this.__element.parent}}],[{key:"createInfoTool",value:function(i,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,o=e.Cartographic.fromCartesian(n.position),s=e.Math.toDegrees(o.longitude),c=e.Math.toDegrees(o.latitude),l=o.height;a["b"](n.element,"opacity","0"),a["b"](n.element.querySelector("div:nth-child(1)"),"height","0"),a["b"](n.element.querySelector("div:nth-child(2)"),"opacity","0"),r(),setTimeout((function(){t.popup(i,n.element,s,c,l)}),100)}},{key:"popup",value:function(i,n,r,o,s){setTimeout((function(){a["b"](n,"opacity","1"),a["b"](n.querySelector("div:nth-child(1)"),"transition","opacity 0.5s"),a["b"](n.querySelector("div:nth-child(2)"),"transition","opacity 0.5s"),a["b"](n.querySelector("div:nth-child(1)"),"height","12px"),a["b"](n.querySelector("div:nth-child(2)"),"pointer-events","auto"),a["b"](n.querySelector("div:nth-child(2)"),"opacity","1")}),100);var c=e.Cartesian3.fromDegrees(r,o,s),l=2!==i.scene.mode;t.hookToGlobe(i,n,c,[10,-80],l),i.scene.requestRender()}},{key:"hookToGlobe",value:function(t,i,n,r,o){var s=t.scene,c=t.camera,l=new e.Cartesian3;s.preRender.addEventListener((function(){var t=s.cartesianToCanvasCoordinates(n,l);if(e.defined(t))if(a["b"](i,"left",parseInt(t.x+r[0])+"px"),a["b"](i,"top",parseInt(t.y+r[1])+"px"),o){var d=c.position,p=s.globe.ellipsoid.cartesianToCartographic(d).height;p+=s.globe.ellipsoid.maximumRadius,e.Cartesian3.distance(d,n)>p?a["b"](i,"display","none"):a["b"](i,"display","flex")}else a["b"](i,"display","flex")}))}}])}();t["a"]=c}).call(this,i("ec35"))},e5c9:function(e,t,i){"use strict";var n=i("2b0e"),r=new n["default"];t["a"]=r},ecb4:function(e,t,i){"use strict";i.d(t,"b",(function(){return r})),i.d(t,"d",(function(){return o})),i.d(t,"a",(function(){return s})),i.d(t,"c",(function(){return c}));var n=i("53ca");i("99af"),i("d3b7"),i("4d63"),i("ac1f"),i("2c3e"),i("25f0"),i("5319");function r(e,t,i){if(e)if(e instanceof Array&&e.length>0)for(var n=0;n<e.length;n++)e[n].style.setProperty(t,i);else if("string"===typeof e)if(e.indexOf("__")<0&&e.indexOf(".")<0&&e.indexOf(" ")<0){var r=document.getElementById(e);r&&r.style.setProperty(t,i)}else for(var o=document.querySelectorAll(e),a=0;a<o.length;a++)o[a].style.setProperty(t,i);else e instanceof HTMLElement&&e.style.setProperty(t,i)}function o(e,t){if(e)if(e instanceof Array&&e.length>0)for(var i=0;i<e.length;i++){var n=e[i];a(n)&&(n.innerText=t)}else if("string"===typeof e)if(e.indexOf("__")<0&&e.indexOf(".")<0&&e.indexOf(" ")<0){var r=document.getElementById(e);r&&(r.innerText=t)}else for(var o=document.querySelectorAll(e),s=0;s<o.length;s++)o[s].innerText=t;else a(e)&&(e.innerText=t)}function a(e){return"object"===("undefined"===typeof HTMLElement?"undefined":Object(n["a"])(HTMLElement))?e instanceof HTMLElement:!(!e||"object"!==Object(n["a"])(e)||1!==e.nodeType&&9!==e.nodeType||"string"!==typeof e.nodeName)}function s(e){var t=(new Date).getTime(),i="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var i=(t+16*Math.random())%16|0;return t=Math.floor(t/16),("x"===e?i:3&i|8).toString(16)}));return e&&(i=i.replace(/-/g,"")),i}function c(e,t,i){if(e)if(e instanceof Array&&e.length>0)for(var n=0;n<e.length;n++){var r=e[n];a(r)&&l(r,t,i)}else if("string"===typeof e)if(e.indexOf("__")<0&&e.indexOf(".")<0&&e.indexOf(" ")<0){var o=document.getElementById(e);o&&l(o,t,i)}else for(var s=document.querySelectorAll(e),c=0;c<s.length;c++)l(s[c],t,i);else a(e)&&l(e,t,i)}function l(e,t,i){e.innerHTML='\n        <div class="pop-container-frame" style="position:relative;width:100%;height: 100%;overflow: hidden;">\n            <div class="popTitle" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">\n                <img class="popTitleMarker" src="/static/img/admin/pop_title.png" alt="" />\n                <div class="popTitleText"></div>\n            </div>\n            \n            <div class="popSpans" style="float: left;width: 100%;padding: 3px;"> \n            </div>\n            <div class="popImg" style="float: left;width: 100%;">\n            </div>\n            <div class="pop-btns" style="float: left;width: 96%;margin:0 2%">\n            </div>\n        </div>\n        <img class="pop-border" src="/static/img/admin/pop_border.png" alt="" />\n        <div class="pop-close">✖</div>',d(e.querySelector(".popTitleText"),t),p(e.querySelector(".popSpans"),t),u(e.querySelector(".popSpans"),t),f(e.querySelector(".pop-btns"),t);var n=e.querySelector(".pop-close");n.onclick=function(){i()}}function d(e,t){e.innerHTML=t.title||""}function p(e,t){(!t.props||!t.props instanceof Object)&&(t.props=[]),e.innerHTML="";var i="";for(var n in t.props){var r=h(t.props[n],25);i+='\n            <div class="pop-span">\n                <img class="marker" src="/static/img/admin/pop-item.png" alt="" />\n                <div class="label popup-ellipsis">\n                '.concat(n,'\n                </div>\n                <div style="bottom:0" class="value popup-ellipsis" title="').concat(r,'">\n                    ').concat(t.props[n]||"","\n                </div>\n            </div>")}e.innerHTML=i}function u(e,t){t.img&&(e.innerHTML+='\n            <div class="pop-span pop-img" style="margin: 1% 1.5%;">\n                <div class="label popup-ellipsis">\n                '.concat(t.img.label,'\n                </div>\n                <div style="bottom:0" class="value">\n                    <img src="').concat(t.img.src,'" />\n                </div>\n            </div>'))}function f(e,t){t.button&&(e.innerHTML='\n        <div class="pop-btn" >\n            <button onclick="popupClick(\''.concat(t.button.key,'\')" type="primary" size="small">').concat(t.button.label,"</button>\n        </div>"))}function h(e,t){return e&&e.toString().replace(new RegExp("(.{"+t+"})","g"),"$1\n")}},f248:function(e,t,i){"use strict";(function(e){i.d(t,"b",(function(){return n})),i.d(t,"a",(function(){return r})),i.d(t,"d",(function(){return a})),i.d(t,"c",(function(){return s}));i("a9e3"),i("c7cd");function n(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,n=e.entities.getById(t);n&&(n.model.scale=i)}function r(t){var i=t.viewer,n=t.id,r=t.paths,o=t.speed,a=t.model;console.log(i,n,r,o,a);var s=i.entities.getById(n);if(!s){var c=1;console.log("paths.length",r.length);var l=c*(r.length-1),d=e.JulianDate.fromDate(new Date),p=e.JulianDate.addHours(d,8,new e.JulianDate),u=e.JulianDate.addSeconds(p,l,new e.JulianDate);i.clock.startTime=p.clone(),i.clock.stopTime=u.clone(),i.clock.currentTime=p.clone(),i.clock.clockRange=e.ClockRange.LOOP_STOP,i.clock.multiplier=o||1,i.clock.shouldAnimate=!0,i.scene.light=new e.DirectionalLight({direction:new e.Cartesian3(.35492591601301104,-.8909182691839401,-.2833588392420772)});var f=function(){for(var t=new e.SampledPositionProperty,i=0;i<r.length;i++){var n=e.JulianDate.addSeconds(p,i*c,new e.JulianDate),o=e.Cartesian3.fromDegrees(r[i][0],r[i][1],r[i][2]);t.addSample(n,o)}return t},h=f();i.entities.add({id:n,position:h,orientation:new e.VelocityOrientationProperty(h),model:{disableDepthTestDistance:Number.POSITIVE_INFINITY,uri:a||"static/Models/jlh.glb",scale:.5},billboard:{},path:{disableDepthTestDistance:Number.POSITIVE_INFINITY,resolution:1,leadTime:l,trailTime:l,material:new e.PolylineGlowMaterialProperty({glowPower:.1,color:e.Color.YELLOW}),width:0}})}}var o=null;function a(t){var i=t.viewer,n=t.id,r=t.fixed,a=t.camera,s=i.entities.getById(n);i.trackedEntity=s;var c=new e.Matrix3;function l(t,i,n){var r=e.Property.getValueOrUndefined(t.position,i,new e.Cartesian3);if(e.defined(r)){var o=e.Property.getValueOrUndefined(t.orientation,i,new e.Quaternion);return n=e.defined(o)?e.Matrix4.fromRotationTranslation(e.Matrix3.fromQuaternion(o,c),r,n):e.Transforms.eastNorthUpToFixedFrame(r,void 0,n),n}}var d=new e.Matrix4;o=function(t){if(i.camera.position.z<0&&i.camera.setView(a),i.trackedEntity&&r){l(i.trackedEntity,i.clock.currentTime,d);var n=120,o=20,s=10;i.scene.camera.lookAtTransform(d,new e.Cartesian3(-n,s,o))}},i.scene.preUpdate.addEventListener(o)}function s(e){o&&e.scene.preUpdate.removeEventListener(o),e.trackedEntity=void 0}}).call(this,i("ec35"))}}]);