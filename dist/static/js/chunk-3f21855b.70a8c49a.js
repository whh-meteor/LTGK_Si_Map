(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3f21855b"],{"272e":function(e,n,t){},8717:function(e,n,t){"use strict";t.r(n);var i=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"container"}})},r=[],a=(t("99af"),t("ace4"),t("d3b7"),t("cfc3"),t("9a8c"),t("a975"),t("735e"),t("c1ac"),t("d139"),t("3a7b"),t("d5d6"),t("82f8"),t("e91f"),t("60bd"),t("5f96"),t("3280"),t("3fcc"),t("ca91"),t("25a1"),t("cd26"),t("3c5d"),t("2954"),t("649e"),t("219c"),t("170b"),t("b39a"),t("72f7"),t("5a89")),s=t("87d1"),o=t("4721"),c={name:"Threejs",data:function(){return{camera:null,scene:null,renderer:null,mesh:null,controls:null,mesh2:null}},mounted:function(){this.init()},methods:{init:function(){var e=document.getElementById("container");this.scene=new a["Scene"],this.camera=new a["PerspectiveCamera"](75,window.innerWidth/window.innerHeight,.1,700),this.renderer=new a["WebGLRenderer"]({antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(window.devicePixelRatio),e.appendChild(this.renderer.domElement),this.camera.position.set(3,2,5),this.camera.lookAt(0,0,0);var n=new a["AxesHelper"](3);if(this.scene.add(n),this.controls=new o["a"](this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.autoRotate=!1,s["a"].isWebGLAvailable())this.animate();else{var t=s["a"].getWebGLErrorMessage();e.appendChild(t)}for(var i=new a["BufferGeometry"],r=[],c=0;c<120;c++){var d=2*Math.random()-1,h=2*Math.random()-1,l=2*Math.random()-1;r.push(d,h,l)}var u=new Float32Array([].concat(r));i.setAttribute("position",new a["BufferAttribute"](u,3));var m=new a["MeshBasicMaterial"]({color:65280,wireframe:!0,transparent:!0,side:a["DoubleSide"]});this.mesh=new a["Mesh"](i,m),this.scene.add(this.mesh)},animate:function(){requestAnimationFrame(this.animate.bind(this)),this.renderer.render(this.scene,this.camera),this.controls.update()}}},d=c,h=(t("ae89"),t("2877")),l=Object(h["a"])(d,i,r,!1,null,null,null);n["default"]=l.exports},ae89:function(e,n,t){"use strict";t("272e")},cfc3:function(e,n,t){var i=t("74e8");i("Float32",(function(e){return function(n,t,i){return e(this,n,t,i)}}))}}]);