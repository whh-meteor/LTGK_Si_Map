(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-530bf0b6"],{"266e":function(e,t,n){"use strict";n("dd1f")},dd1f:function(e,t,n){},f9d7:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"container"}})},s=[],r=n("5a89"),a=n("87d1"),o=n("4721"),h={name:"Threejs",data:function(){return{camera:null,scene:null,renderer:null,mesh:null,controls:null,mesh2:null}},mounted:function(){this.init()},methods:{init:function(){var e=document.getElementById("container");this.scene=new r["Scene"],this.camera=new r["PerspectiveCamera"](75,window.innerWidth/window.innerHeight,.1,700),this.renderer=new r["WebGLRenderer"]({antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(window.devicePixelRatio),e.appendChild(this.renderer.domElement);var t=new r["BoxGeometry"](1,1,1),n=new r["MeshBasicMaterial"]({color:65280});this.mesh=new r["Mesh"](t,n),this.scene.add(this.mesh),this.camera.position.set(3,2,5),this.camera.lookAt(0,0,0);var i=new r["AxesHelper"](3);if(this.scene.add(i),this.controls=new o["a"](this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.autoRotate=!1,a["a"].isWebGLAvailable())this.animate();else{var s=a["a"].getWebGLErrorMessage();e.appendChild(s)}var h=new r["MeshBasicMaterial"]({color:"red"});this.mesh2=new r["Mesh"](t,h),this.mesh.position.set(0,0,0),this.mesh2.position.set(3,0,3),this.scene.add(this.mesh2)},animate:function(){requestAnimationFrame(this.animate.bind(this)),this.mesh.rotation.x+=.01,this.mesh.rotation.y+=.01,this.renderer.render(this.scene,this.camera),this.controls.update()}}},d=h,c=(n("266e"),n("2877")),l=Object(c["a"])(d,i,s,!1,null,null,null);t["default"]=l.exports}}]);