/*
      流纹纹理线
      color 颜色
      duration 持续时间 毫秒
   */
Cesium.PolylineTrailLinkMaterialProperty = function(color, duration) {
  this._definitionChanged = new Cesium.Event()
  this._color = undefined
  this._colorSubscription = undefined
  this.color = color
  this.duration = duration
  this._time = (new Date()).getTime()
}

Object.defineProperties(Cesium.PolylineTrailLinkMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return false
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor('color')
})
Cesium.PolylineTrailLinkMaterialProperty.prototype.getType = function(time) {
  return 'PolylineTrailLink'
}
Cesium.PolylineTrailLinkMaterialProperty.prototype.getValue = function(time, result) {
  if (!Cesium.defined(result)) {
    result = {}
  }
  result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color)
  result.image = Cesium.PolylineTrailLinkImage
  result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration
  return result
}
Cesium.PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {
  return this === other || (other instanceof Cesium.PolylineTrailLinkMaterialProperty && Cesium.Property.equals(this._color, other._color))
}
Cesium.PolylineTrailLinkImage = require('./colors-water.png')
console.log(Cesium.PolylineTrailLinkImage)
Cesium.PolylineTrailLinkMaterialProperty.add2Material = function() {
  Cesium.Material._materialCache.addMaterial('PolylineTrailLink', {
    fabric: {
      type: 'PolylineTrailLink',
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
        image: Cesium.PolylineTrailLinkImage,
        time: 0
      },
      source: `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                           return material;\n\
                                                       }`
    },
    translucent: function(material) {
      return true
    }
  })
}

