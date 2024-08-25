/* !
  * library v1.0.0
  * https://github.com/  (github address)
  * 
  * (c) 2021 AuthorName
  */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CesiumWind = factory());
}(this, (function () { 'use strict';

	var Util = function () {
	  var loadText = function loadText(filePath) {
	    var request = new XMLHttpRequest();
	    request.open('GET', filePath, false);
	    request.send();
	    return request.responseText;
	  };

	  var getFullscreenQuad = function getFullscreenQuad() {
	    var fullscreenQuad = new Cesium.Geometry({
	      attributes: new Cesium.GeometryAttributes({
	        position: new Cesium.GeometryAttribute({
	          componentDatatype: Cesium.ComponentDatatype.FLOAT,
	          componentsPerAttribute: 3,
	          //  v3----v2
	          //  |     |
	          //  |     |
	          //  v0----v1
	          values: new Float32Array([-1, -1, 0, // v0
	          1, -1, 0, // v1
	          1, 1, 0, // v2
	          -1, 1, 0])
	        }),
	        st: new Cesium.GeometryAttribute({
	          componentDatatype: Cesium.ComponentDatatype.FLOAT,
	          componentsPerAttribute: 2,
	          values: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
	        })
	      }),
	      indices: new Uint32Array([3, 2, 0, 0, 2, 1])
	    });
	    return fullscreenQuad;
	  };

	  var createTexture = function createTexture(options, typedArray) {
	    if (Cesium.defined(typedArray)) {
	      // typed array needs to be passed as source option, this is required by Cesium.Texture
	      var source = {};
	      source.arrayBufferView = typedArray;
	      options.source = source;
	    }

	    var texture = new Cesium.Texture(options);
	    return texture;
	  };

	  var createFramebuffer = function createFramebuffer(context, colorTexture, depthTexture) {
	    var framebuffer = new Cesium.Framebuffer({
	      context: context,
	      colorTextures: [colorTexture],
	      depthTexture: depthTexture
	    });
	    return framebuffer;
	  };

	  var createRawRenderState = function createRawRenderState(options) {
	    var translucent = true;
	    var closed = false;
	    var existing = {
	      viewport: options.viewport,
	      depthTest: options.depthTest,
	      depthMask: options.depthMask,
	      blending: options.blending
	    };
	    var rawRenderState = Cesium.Appearance.getDefaultRenderState(translucent, closed, existing);
	    return rawRenderState;
	  };

	  var viewRectangleToLonLatRange = function viewRectangleToLonLatRange(viewRectangle) {
	    var range = {};
	    var postiveWest = Cesium.Math.mod(viewRectangle.west, Cesium.Math.TWO_PI);
	    var postiveEast = Cesium.Math.mod(viewRectangle.east, Cesium.Math.TWO_PI);
	    var width = viewRectangle.width;
	    var longitudeMin;
	    var longitudeMax;

	    if (width > Cesium.Math.THREE_PI_OVER_TWO) {
	      longitudeMin = 0.0;
	      longitudeMax = Cesium.Math.TWO_PI;
	    } else {
	      if (postiveEast - postiveWest < width) {
	        longitudeMin = postiveWest;
	        longitudeMax = postiveWest + width;
	      } else {
	        longitudeMin = postiveWest;
	        longitudeMax = postiveEast;
	      }
	    }

	    range.lon = {
	      min: Cesium.Math.toDegrees(longitudeMin),
	      max: Cesium.Math.toDegrees(longitudeMax)
	    };
	    var south = viewRectangle.south;
	    var north = viewRectangle.north;
	    var height = viewRectangle.height;
	    var extendHeight = height > Cesium.Math.PI / 12 ? height / 2 : 0;
	    var extendedSouth = Cesium.Math.clampToLatitudeRange(south - extendHeight);
	    var extendedNorth = Cesium.Math.clampToLatitudeRange(north + extendHeight); // extend the bound in high latitude area to make sure it can cover all the visible area

	    if (extendedSouth < -Cesium.Math.PI_OVER_THREE) {
	      extendedSouth = -Cesium.Math.PI_OVER_TWO;
	    }

	    if (extendedNorth > Cesium.Math.PI_OVER_THREE) {
	      extendedNorth = Cesium.Math.PI_OVER_TWO;
	    }

	    range.lat = {
	      min: Cesium.Math.toDegrees(extendedSouth),
	      max: Cesium.Math.toDegrees(extendedNorth)
	    };
	    return range;
	  };

	  return {
	    loadText: loadText,
	    getFullscreenQuad: getFullscreenQuad,
	    createTexture: createTexture,
	    createFramebuffer: createFramebuffer,
	    createRawRenderState: createRawRenderState,
	    viewRectangleToLonLatRange: viewRectangleToLonLatRange
	  };
	}();

	var DataProcess = function () {
	  var data;

	  var loadNetCDF = function loadNetCDF(filePath) {
	    return new Promise(function (resolve) {
	      var request = new XMLHttpRequest();
	      request.open('GET', filePath);
	      request.responseType = 'arraybuffer';

	      request.onload = function () {
	        var arrayToMap = function arrayToMap(array) {
	          return array.reduce(function (map, object) {
	            map[object.name] = object;
	            return map;
	          }, {});
	        };

	        var NetCDF = new netcdfjs(request.response);
	        data = {};
	        var dimensions = arrayToMap(NetCDF.dimensions);
	        data.dimensions = {};
	        data.dimensions.lon = dimensions['lon'].size;
	        data.dimensions.lat = dimensions['lat'].size;
	        data.dimensions.lev = dimensions['lev'].size;
	        var variables = arrayToMap(NetCDF.variables);
	        var uAttributes = arrayToMap(variables['U'].attributes);
	        var vAttributes = arrayToMap(variables['V'].attributes);
	        data.lon = {};
	        data.lon.array = new Float32Array(NetCDF.getDataVariable('lon').flat());
	        data.lon.min = Math.min.apply(Math, data.lon.array);
	        data.lon.max = Math.max.apply(Math, data.lon.array);
	        data.lat = {};
	        data.lat.array = new Float32Array(NetCDF.getDataVariable('lat').flat());
	        data.lat.min = Math.min.apply(Math, data.lat.array);
	        data.lat.max = Math.max.apply(Math, data.lat.array);
	        data.lev = {};
	        data.lev.array = new Float32Array(NetCDF.getDataVariable('lev').flat());
	        data.lev.min = Math.min.apply(Math, data.lev.array);
	        data.lev.max = Math.max.apply(Math, data.lev.array);
	        data.U = {};
	        data.U.array = new Float32Array(NetCDF.getDataVariable('U').flat());
	        data.U.min = uAttributes['min'].value;
	        data.U.max = uAttributes['max'].value;
	        data.V = {};
	        data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat());
	        data.V.min = vAttributes['min'].value;
	        data.V.max = vAttributes['max'].value;
	        resolve(data);
	      };

	      request.send();
	    });
	  };

	  var randomizeParticles = function randomizeParticles(maxParticles, viewerParameters) {
	    var array = new Float32Array(4 * maxParticles);

	    for (var i = 0; i < maxParticles; i++) {
	      array[4 * i] = Cesium.Math.randomBetween(viewerParameters.lonRange.x, viewerParameters.lonRange.y);
	      array[4 * i + 1] = Cesium.Math.randomBetween(viewerParameters.latRange.x, viewerParameters.latRange.y);
	      array[4 * i + 2] = Cesium.Math.randomBetween(data.lev.min, data.lev.max);
	      array[4 * i + 3] = 0.0;
	    }

	    return array;
	  };

	  return {
	    loadNetCDF: loadNetCDF,
	    randomizeParticles: randomizeParticles
	  };
	}();

	var CustomPrimitive = function CustomPrimitive(options) {
	  this.commandType = options.commandType;
	  this.geometry = options.geometry;
	  this.attributeLocations = options.attributeLocations;
	  this.primitiveType = options.primitiveType;
	  this.uniformMap = options.uniformMap;
	  this.vertexShaderSource = options.vertexShaderSource;
	  this.fragmentShaderSource = options.fragmentShaderSource;
	  this.rawRenderState = options.rawRenderState;
	  this.framebuffer = options.framebuffer;
	  this.outputTexture = options.outputTexture;
	  this.autoClear = Cesium.defaultValue(options.autoClear, false);
	  this.preExecute = options.preExecute;
	  this.show = true;
	  this.commandToExecute = undefined;
	  this.clearCommand = undefined;

	  if (this.autoClear) {
	    this.clearCommand = new Cesium.ClearCommand({
	      color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
	      depth: 1.0,
	      framebuffer: this.framebuffer,
	      pass: Cesium.Pass.OPAQUE
	    });
	  }
	};

	CustomPrimitive.prototype.createCommand = function createCommand(context) {
	  switch (this.commandType) {
	    case 'Draw':
	      {
	        var vertexArray = Cesium.VertexArray.fromGeometry({
	          context: context,
	          geometry: this.geometry,
	          attributeLocations: this.attributeLocations,
	          bufferUsage: Cesium.BufferUsage.STATIC_DRAW
	        });
	        var shaderProgram = Cesium.ShaderProgram.fromCache({
	          context: context,
	          attributeLocations: this.attributeLocations,
	          vertexShaderSource: this.vertexShaderSource,
	          fragmentShaderSource: this.fragmentShaderSource
	        });
	        var renderState = Cesium.RenderState.fromCache(this.rawRenderState);
	        return new Cesium.DrawCommand({
	          owner: this,
	          vertexArray: vertexArray,
	          primitiveType: this.primitiveType,
	          uniformMap: this.uniformMap,
	          modelMatrix: Cesium.Matrix4.IDENTITY,
	          shaderProgram: shaderProgram,
	          framebuffer: this.framebuffer,
	          renderState: renderState,
	          pass: Cesium.Pass.OPAQUE
	        });
	      }

	    case 'Compute':
	      {
	        return new Cesium.ComputeCommand({
	          owner: this,
	          fragmentShaderSource: this.fragmentShaderSource,
	          uniformMap: this.uniformMap,
	          outputTexture: this.outputTexture,
	          persists: true
	        });
	      }
	  }
	};

	CustomPrimitive.prototype.setGeometry = function setGeometry(context, geometry) {
	  this.geometry = geometry;
	  var vertexArray = Cesium.VertexArray.fromGeometry({
	    context: context,
	    geometry: this.geometry,
	    attributeLocations: this.attributeLocations,
	    bufferUsage: Cesium.BufferUsage.STATIC_DRAW
	  });
	  this.commandToExecute.vertexArray = vertexArray;
	};

	CustomPrimitive.prototype.update = function update(frameState) {
	  if (!this.show) {
	    return;
	  }

	  if (!Cesium.defined(this.commandToExecute)) {
	    this.commandToExecute = this.createCommand(frameState.context);
	  }

	  if (Cesium.defined(this.preExecute)) {
	    this.preExecute();
	  }

	  if (Cesium.defined(this.clearCommand)) {
	    frameState.commandList.push(this.clearCommand);
	  }

	  frameState.commandList.push(this.commandToExecute);
	};

	CustomPrimitive.prototype.isDestroyed = function isDestroyed() {
	  return false;
	};

	CustomPrimitive.prototype.destroy = function destroy() {
	  if (Cesium.defined(this.commandToExecute)) {
	    this.commandToExecute.shaderProgram = this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy();
	  }

	  return Cesium.destroyObject(this);
	};

	var calculateSpeedFrag = "\n// the size of UV textures: width = lon, height = lat*lev\nuniform sampler2D U; // eastward wind \nuniform sampler2D V; // northward wind\nuniform sampler2D currentParticlesPosition; // (lon, lat, lev)\n\nuniform vec3 dimension; // (lon, lat, lev)\nuniform vec3 minimum; // minimum of each dimension\nuniform vec3 maximum; // maximum of each dimension\nuniform vec3 interval; // interval of each dimension\n\n// used to calculate the wind norm\nuniform vec2 uSpeedRange; // (min, max);\nuniform vec2 vSpeedRange;\nuniform float pixelSize;\nuniform float speedFactor;\n\nfloat speedScaleFactor = speedFactor * pixelSize;\n\nvarying vec2 v_textureCoordinates;\n\nvec2 mapPositionToNormalizedIndex2D(vec3 lonLatLev) {\n    // ensure the range of longitude and latitude\n    lonLatLev.x = mod(lonLatLev.x, 360.0);\n    lonLatLev.y = clamp(lonLatLev.y, -90.0, 90.0);\n\n    vec3 index3D = vec3(0.0);\n    index3D.x = (lonLatLev.x - minimum.x) / interval.x;\n    index3D.y = (lonLatLev.y - minimum.y) / interval.y;\n    index3D.z = (lonLatLev.z - minimum.z) / interval.z;\n\n    // the st texture coordinate corresponding to (col, row) index\n    // example\n    // data array is [0, 1, 2, 3, 4, 5], width = 3, height = 2\n    // the content of texture will be\n    // t 1.0\n    //    |  3 4 5\n    //    |\n    //    |  0 1 2\n    //   0.0------1.0 s\n\n    vec2 index2D = vec2(index3D.x, index3D.z * dimension.y + index3D.y);\n    vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / (dimension.y * dimension.z));\n    return normalizedIndex2D;\n}\n\nfloat getWindComponent(sampler2D componentTexture, vec3 lonLatLev) {\n    vec2 normalizedIndex2D = mapPositionToNormalizedIndex2D(lonLatLev);\n    float result = texture2D(componentTexture, normalizedIndex2D).r;\n    return result;\n}\n\nfloat interpolateTexture(sampler2D componentTexture, vec3 lonLatLev) {\n    float lon = lonLatLev.x;\n    float lat = lonLatLev.y;\n    float lev = lonLatLev.z;\n\n    float lon0 = floor(lon / interval.x) * interval.x;\n    float lon1 = lon0 + 1.0 * interval.x;\n    float lat0 = floor(lat / interval.y) * interval.y;\n    float lat1 = lat0 + 1.0 * interval.y;\n\n    float lon0_lat0 = getWindComponent(componentTexture, vec3(lon0, lat0, lev));\n    float lon1_lat0 = getWindComponent(componentTexture, vec3(lon1, lat0, lev));\n    float lon0_lat1 = getWindComponent(componentTexture, vec3(lon0, lat1, lev));\n    float lon1_lat1 = getWindComponent(componentTexture, vec3(lon1, lat1, lev));\n\n    float lon_lat0 = mix(lon0_lat0, lon1_lat0, lon - lon0);\n    float lon_lat1 = mix(lon0_lat1, lon1_lat1, lon - lon0);\n    float lon_lat = mix(lon_lat0, lon_lat1, lat - lat0);\n    return lon_lat;\n}\n\nvec3 linearInterpolation(vec3 lonLatLev) {\n    // https://en.wikipedia.org/wiki/Bilinear_interpolation\n    float u = interpolateTexture(U, lonLatLev);\n    float v = interpolateTexture(V, lonLatLev);\n    float w = 0.0;\n    return vec3(u, v, w);\n}\n\nvec2 lengthOfLonLat(vec3 lonLatLev) {\n    // unit conversion: meters -> longitude latitude degrees\n    // see https://en.wikipedia.org/wiki/Geographic_coordinate_system#Length_of_a_degree for detail\n\n    // Calculate the length of a degree of latitude and longitude in meters\n    float latitude = radians(lonLatLev.y);\n\n    float term1 = 111132.92;\n    float term2 = 559.82 * cos(2.0 * latitude);\n    float term3 = 1.175 * cos(4.0 * latitude);\n    float term4 = 0.0023 * cos(6.0 * latitude);\n    float latLength = term1 - term2 + term3 - term4;\n\n    float term5 = 111412.84 * cos(latitude);\n    float term6 = 93.5 * cos(3.0 * latitude);\n    float term7 = 0.118 * cos(5.0 * latitude);\n    float longLength = term5 - term6 + term7;\n\n    return vec2(longLength, latLength);\n}\n\nvec3 convertSpeedUnitToLonLat(vec3 lonLatLev, vec3 speed) {\n    vec2 lonLatLength = lengthOfLonLat(lonLatLev);\n    float u = speed.x / lonLatLength.x;\n    float v = speed.y / lonLatLength.y;\n    float w = 0.0;\n    vec3 windVectorInLonLatLev = vec3(u, v, w);\n\n    return windVectorInLonLatLev;\n}\n\nvec3 calculateSpeedByRungeKutta2(vec3 lonLatLev) {\n    // see https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods#Second-order_methods_with_two_stages for detail\n    const float h = 0.5;\n\n    vec3 y_n = lonLatLev;\n    vec3 f_n = linearInterpolation(lonLatLev);\n    vec3 midpoint = y_n + 0.5 * h * convertSpeedUnitToLonLat(y_n, f_n) * speedScaleFactor;\n    vec3 speed = h * linearInterpolation(midpoint) * speedScaleFactor;\n\n    return speed;\n}\n\nfloat calculateWindNorm(vec3 speed) {\n    vec3 percent = vec3(0.0);\n    percent.x = (speed.x - uSpeedRange.x) / (uSpeedRange.y - uSpeedRange.x);\n    percent.y = (speed.y - vSpeedRange.x) / (vSpeedRange.y - vSpeedRange.x);\n    float norm = length(percent);\n\n    return norm;\n}\n\nvoid main() {\n    // texture coordinate must be normalized\n    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;\n    vec3 speed = calculateSpeedByRungeKutta2(lonLatLev);\n    vec3 speedInLonLat = convertSpeedUnitToLonLat(lonLatLev, speed);\n\n    vec4 particleSpeed = vec4(speedInLonLat, calculateWindNorm(speed / speedScaleFactor));\n    gl_FragColor = particleSpeed;\n}\n";

	var updatePositionFrag = "uniform sampler2D currentParticlesPosition; // (lon, lat, lev)\nuniform sampler2D particlesSpeed; // (u, v, w, norm) Unit converted to degrees of longitude and latitude \n\nvarying vec2 v_textureCoordinates;\n\nvoid main() {\n    // texture coordinate must be normalized\n    vec3 lonLatLev = texture2D(currentParticlesPosition, v_textureCoordinates).rgb;\n    vec3 speed = texture2D(particlesSpeed, v_textureCoordinates).rgb;\n    vec3 nextParticle = lonLatLev + speed;\n\n    gl_FragColor = vec4(nextParticle, 0.0);\n}";

	var postProcessingPositionFrag = "\nuniform sampler2D nextParticlesPosition;\nuniform sampler2D particlesSpeed; // (u, v, w, norm)\n\n// range (min, max)\nuniform vec2 lonRange;\nuniform vec2 latRange;\n\nuniform float randomCoefficient; // use to improve the pseudo-random generator\nuniform float dropRate; // drop rate is a chance a particle will restart at random position to avoid degeneration\nuniform float dropRateBump;\n\nvarying vec2 v_textureCoordinates;\n\n// pseudo-random generator\nconst vec3 randomConstants = vec3(12.9898, 78.233, 4375.85453);\nconst vec2 normalRange = vec2(0.0, 1.0);\nfloat rand(vec2 seed, vec2 range) {\n    vec2 randomSeed = randomCoefficient * seed;\n    float temp = dot(randomConstants.xy, randomSeed);\n    temp = fract(sin(temp) * (randomConstants.z + temp));\n    return temp * (range.y - range.x) + range.x;\n}\n\nvec3 generateRandomParticle(vec2 seed, float lev) {\n    // ensure the longitude is in [0, 360]\n    float randomLon = mod(rand(seed, lonRange), 360.0);\n    float randomLat = rand(-seed, latRange);\n\n    return vec3(randomLon, randomLat, lev);\n}\n\nbool particleOutbound(vec3 particle) {\n    return particle.y < -90.0 || particle.y > 90.0;\n}\n\nvoid main() {\n    vec3 nextParticle = texture2D(nextParticlesPosition, v_textureCoordinates).rgb;\n    vec4 nextSpeed = texture2D(particlesSpeed, v_textureCoordinates);\n    float speedNorm = nextSpeed.a;\n    float particleDropRate = dropRate + dropRateBump * speedNorm;\n\n    vec2 seed1 = nextParticle.xy + v_textureCoordinates;\n    vec2 seed2 = nextSpeed.xy + v_textureCoordinates;\n    vec3 randomParticle = generateRandomParticle(seed1, nextParticle.z);\n    float randomNumber = rand(seed2, normalRange);\n\n    if (randomNumber < particleDropRate || particleOutbound(nextParticle)) {\n        gl_FragColor = vec4(randomParticle, 1.0); // 1.0 means this is a random particle\n    } else {\n        gl_FragColor = vec4(nextParticle, 0.0);\n    }\n}";

	var ParticlesComputing = function ParticlesComputing(context, data, userInput, viewerParameters) {
	  this.createWindTextures(context, data);
	  this.createParticlesTextures(context, userInput, viewerParameters);
	  this.createComputingPrimitives(data, userInput, viewerParameters);
	};

	ParticlesComputing.prototype.createWindTextures = function createWindTextures(context, data) {
	  var windTextureOptions = {
	    context: context,
	    width: data.dimensions.lon,
	    height: data.dimensions.lat * data.dimensions.lev,
	    pixelFormat: Cesium.PixelFormat.LUMINANCE,
	    pixelDatatype: Cesium.PixelDatatype.FLOAT,
	    flipY: false,
	    sampler: new Cesium.Sampler({
	      // the values of texture will not be interpolated
	      minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
	      magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
	    })
	  };
	  this.windTextures = {
	    U: Util.createTexture(windTextureOptions, data.U.array),
	    V: Util.createTexture(windTextureOptions, data.V.array)
	  };
	};

	ParticlesComputing.prototype.createParticlesTextures = function createParticlesTextures(context, userInput, viewerParameters) {
	  var particlesTextureOptions = {
	    context: context,
	    width: userInput.particlesTextureSize,
	    height: userInput.particlesTextureSize,
	    pixelFormat: Cesium.PixelFormat.RGBA,
	    pixelDatatype: Cesium.PixelDatatype.FLOAT,
	    flipY: false,
	    sampler: new Cesium.Sampler({
	      // the values of texture will not be interpolated
	      minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
	      magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
	    })
	  };
	  var particlesArray = DataProcess.randomizeParticles(userInput.maxParticles, viewerParameters);
	  var zeroArray = new Float32Array(4 * userInput.maxParticles).fill(0);
	  this.particlesTextures = {
	    currentParticlesPosition: Util.createTexture(particlesTextureOptions, particlesArray),
	    nextParticlesPosition: Util.createTexture(particlesTextureOptions, particlesArray),
	    postProcessingPosition: Util.createTexture(particlesTextureOptions, particlesArray),
	    particlesSpeed: Util.createTexture(particlesTextureOptions, zeroArray)
	  };
	};

	ParticlesComputing.prototype.destroyParticlesTextures = function destroyParticlesTextures() {
	  var this$1 = this;
	  Object.keys(this.particlesTextures).forEach(function (key) {
	    this$1.particlesTextures[key].destroy();
	  });
	};

	ParticlesComputing.prototype.createComputingPrimitives = function createComputingPrimitives(data, userInput, viewerParameters) {
	  var _dimension = new Cesium.Cartesian3(data.dimensions.lon, data.dimensions.lat, data.dimensions.lev);

	  var _minimum = new Cesium.Cartesian3(data.lon.min, data.lat.min, data.lev.min);

	  var _maximum = new Cesium.Cartesian3(data.lon.max, data.lat.max, data.lev.max);

	  var _interval = new Cesium.Cartesian3((_maximum.x - _minimum.x) / (_dimension.x - 1), (_maximum.y - _minimum.y) / (_dimension.y - 1), _dimension.z > 1 ? (_maximum.z - _minimum.z) / (_dimension.z - 1) : 1.0);

	  var _uSpeedRange = new Cesium.Cartesian2(data.U.min, data.U.max);

	  var _vSpeedRange = new Cesium.Cartesian2(data.V.min, data.V.max);

	  var that = this;
	  this.primitives = {
	    calculateSpeed: new CustomPrimitive({
	      commandType: 'Compute',
	      uniformMap: {
	        U: function U() {
	          return that.windTextures.U;
	        },
	        V: function V() {
	          return that.windTextures.V;
	        },
	        currentParticlesPosition: function currentParticlesPosition() {
	          return that.particlesTextures.currentParticlesPosition;
	        },
	        dimension: function dimension() {
	          return _dimension;
	        },
	        minimum: function minimum() {
	          return _minimum;
	        },
	        maximum: function maximum() {
	          return _maximum;
	        },
	        interval: function interval() {
	          return _interval;
	        },
	        uSpeedRange: function uSpeedRange() {
	          return _uSpeedRange;
	        },
	        vSpeedRange: function vSpeedRange() {
	          return _vSpeedRange;
	        },
	        pixelSize: function pixelSize() {
	          return viewerParameters.pixelSize;
	        },
	        speedFactor: function speedFactor() {
	          return userInput.speedFactor;
	        }
	      },
	      fragmentShaderSource: new Cesium.ShaderSource({
	        sources: [calculateSpeedFrag]
	      }),
	      outputTexture: this.particlesTextures.particlesSpeed,
	      preExecute: function preExecute() {
	        // keep the outputTexture up to date
	        that.primitives.calculateSpeed.commandToExecute.outputTexture = that.particlesTextures.particlesSpeed;
	      }
	    }),
	    updatePosition: new CustomPrimitive({
	      commandType: 'Compute',
	      uniformMap: {
	        currentParticlesPosition: function currentParticlesPosition() {
	          return that.particlesTextures.currentParticlesPosition;
	        },
	        particlesSpeed: function particlesSpeed() {
	          return that.particlesTextures.particlesSpeed;
	        }
	      },
	      fragmentShaderSource: new Cesium.ShaderSource({
	        sources: [updatePositionFrag]
	      }),
	      outputTexture: this.particlesTextures.nextParticlesPosition,
	      preExecute: function preExecute() {
	        // swap textures before binding
	        var temp;
	        temp = that.particlesTextures.currentParticlesPosition;
	        that.particlesTextures.currentParticlesPosition = that.particlesTextures.postProcessingPosition;
	        that.particlesTextures.postProcessingPosition = temp; // keep the outputTexture up to date

	        that.primitives.updatePosition.commandToExecute.outputTexture = that.particlesTextures.nextParticlesPosition;
	      }
	    }),
	    postProcessingPosition: new CustomPrimitive({
	      commandType: 'Compute',
	      uniformMap: {
	        nextParticlesPosition: function nextParticlesPosition() {
	          return that.particlesTextures.nextParticlesPosition;
	        },
	        particlesSpeed: function particlesSpeed() {
	          return that.particlesTextures.particlesSpeed;
	        },
	        lonRange: function lonRange() {
	          return viewerParameters.lonRange;
	        },
	        latRange: function latRange() {
	          return viewerParameters.latRange;
	        },
	        randomCoefficient: function randomCoefficient() {
	          var randomCoefficient = Math.random();
	          return randomCoefficient;
	        },
	        dropRate: function dropRate() {
	          return userInput.dropRate;
	        },
	        dropRateBump: function dropRateBump() {
	          return userInput.dropRateBump;
	        }
	      },
	      fragmentShaderSource: new Cesium.ShaderSource({
	        sources: [postProcessingPositionFrag]
	      }),
	      outputTexture: this.particlesTextures.postProcessingPosition,
	      preExecute: function preExecute() {
	        // keep the outputTexture up to date
	        that.primitives.postProcessingPosition.commandToExecute.outputTexture = that.particlesTextures.postProcessingPosition;
	      }
	    })
	  };
	};

	var segmentDrawVert = "attribute vec2 st;\n// it is not normal itself, but used to control normal\nattribute vec3 normal; // (point to use, offset sign, not used component)\n\nuniform sampler2D currentParticlesPosition;\nuniform sampler2D postProcessingPosition;\n\nuniform float particleHeight;\n\nuniform float aspect;\nuniform float pixelSize;\nuniform float lineWidth;\n\nvec3 convertCoordinate(vec3 lonLatLev) {\n    // WGS84 (lon, lat, lev) -> ECEF (x, y, z)\n    // see https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#From_geodetic_to_ECEF_coordinates for detail\n\n    // WGS 84 geometric constants \n    float a = 6378137.0; // Semi-major axis \n    float b = 6356752.3142; // Semi-minor axis \n    float e2 = 6.69437999014e-3; // First eccentricity squared\n\n    float latitude = radians(lonLatLev.y);\n    float longitude = radians(lonLatLev.x);\n\n    float cosLat = cos(latitude);\n    float sinLat = sin(latitude);\n    float cosLon = cos(longitude);\n    float sinLon = sin(longitude);\n\n    float N_Phi = a / sqrt(1.0 - e2 * sinLat * sinLat);\n    float h = particleHeight; // it should be high enough otherwise the particle may not pass the terrain depth test\n\n    vec3 cartesian = vec3(0.0);\n    cartesian.x = (N_Phi + h) * cosLat * cosLon;\n    cartesian.y = (N_Phi + h) * cosLat * sinLon;\n    cartesian.z = ((b * b) / (a * a) * N_Phi + h) * sinLat;\n    return cartesian;\n}\n\nvec4 calcProjectedCoordinate(vec3 lonLatLev) {\n    // the range of longitude in Cesium is [-180, 180] but the range of longitude in the NetCDF file is [0, 360]\n    // [0, 180] is corresponding to [0, 180] and [180, 360] is corresponding to [-180, 0]\n    lonLatLev.x = mod(lonLatLev.x + 180.0, 360.0) - 180.0;\n    vec3 particlePosition = convertCoordinate(lonLatLev);\n    vec4 projectedCoordinate = czm_modelViewProjection * vec4(particlePosition, 1.0);\n    return projectedCoordinate;\n}\n\nvec4 calcOffset(vec4 currentProjectedCoordinate, vec4 nextProjectedCoordinate, float offsetSign) {\n    vec2 aspectVec2 = vec2(aspect, 1.0);\n    vec2 currentXY = (currentProjectedCoordinate.xy / currentProjectedCoordinate.w) * aspectVec2;\n    vec2 nextXY = (nextProjectedCoordinate.xy / nextProjectedCoordinate.w) * aspectVec2;\n\n    float offsetLength = lineWidth / 2.0;\n    vec2 direction = normalize(nextXY - currentXY);\n    vec2 normalVector = vec2(-direction.y, direction.x);\n    normalVector.x = normalVector.x / aspect;\n    normalVector = offsetLength * normalVector;\n\n    vec4 offset = vec4(offsetSign * normalVector, 0.0, 0.0);\n    return offset;\n}\n\nvoid main() {\n    vec2 particleIndex = st;\n\n    vec3 currentPosition = texture2D(currentParticlesPosition, particleIndex).rgb;\n    vec4 nextPosition = texture2D(postProcessingPosition, particleIndex);\n\n    vec4 currentProjectedCoordinate = vec4(0.0);\n    vec4 nextProjectedCoordinate = vec4(0.0);\n    if (nextPosition.w > 0.0) {\n        currentProjectedCoordinate = calcProjectedCoordinate(currentPosition);\n        nextProjectedCoordinate = calcProjectedCoordinate(currentPosition);\n    } else {\n        currentProjectedCoordinate = calcProjectedCoordinate(currentPosition);\n        nextProjectedCoordinate = calcProjectedCoordinate(nextPosition.xyz);\n    }\n\n    float pointToUse = normal.x; // -1 is currentProjectedCoordinate and +1 is nextProjectedCoordinate\n    float offsetSign = normal.y;\n\n    vec4 offset = pixelSize * calcOffset(currentProjectedCoordinate, nextProjectedCoordinate, offsetSign);\n    if (pointToUse < 0.0) {\n        gl_Position = currentProjectedCoordinate + offset;\n    } else {\n        gl_Position = nextProjectedCoordinate + offset;\n    }\n}";

	var segmentDrawFrag = "\nvoid main() {\n    const vec4 white = vec4(1.0);\n    gl_FragColor = white;\n}";

	var fullscreenVert = "\nattribute vec3 position;\nattribute vec2 st;\n\nvarying vec2 textureCoordinate;\n\nvoid main() {\n    textureCoordinate = st;\n    gl_Position = vec4(position, 1.0);\n}";

	var trailDrawFrag = "uniform sampler2D segmentsColorTexture;\nuniform sampler2D segmentsDepthTexture;\n\nuniform sampler2D currentTrailsColor;\nuniform sampler2D trailsDepthTexture;\n\nuniform float fadeOpacity;\n\nvarying vec2 textureCoordinate;\n\nvoid main() {\n    vec4 pointsColor = texture2D(segmentsColorTexture, textureCoordinate);\n    vec4 trailsColor = texture2D(currentTrailsColor, textureCoordinate);\n\n    trailsColor = floor(fadeOpacity * 255.0 * trailsColor) / 255.0; // make sure the trailsColor will be strictly decreased\n\n    float pointsDepth = texture2D(segmentsDepthTexture, textureCoordinate).r;\n    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;\n    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));\n\n    gl_FragColor = vec4(0.0);\n    if (pointsDepth < globeDepth) {\n        gl_FragColor = gl_FragColor + pointsColor;\n    }\n    if (trailsDepth < globeDepth) {\n        gl_FragColor = gl_FragColor + trailsColor;\n    }\n    gl_FragDepthEXT = min(pointsDepth, trailsDepth);\n}";

	var screenDrawFrag = "uniform sampler2D trailsColorTexture;\nuniform sampler2D trailsDepthTexture;\n\nvarying vec2 textureCoordinate;\n\nvoid main() {\n    vec4 trailsColor = texture2D(trailsColorTexture, textureCoordinate);\n    float trailsDepth = texture2D(trailsDepthTexture, textureCoordinate).r;\n    float globeDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, textureCoordinate));\n\n    if (trailsDepth < globeDepth) {\n        gl_FragColor = trailsColor;\n    } else {\n        gl_FragColor = vec4(0.0);\n    }\n}";

	var ParticlesRendering = function ParticlesRendering(context, data, userInput, viewerParameters, particlesComputing) {
	  this.createRenderingTextures(context, data);
	  this.createRenderingFramebuffers(context);
	  this.createRenderingPrimitives(context, userInput, viewerParameters, particlesComputing);
	};

	ParticlesRendering.prototype.createRenderingTextures = function createRenderingTextures(context, data) {
	  var colorTextureOptions = {
	    context: context,
	    width: context.drawingBufferWidth,
	    height: context.drawingBufferHeight,
	    pixelFormat: Cesium.PixelFormat.RGBA,
	    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE
	  };
	  var depthTextureOptions = {
	    context: context,
	    width: context.drawingBufferWidth,
	    height: context.drawingBufferHeight,
	    pixelFormat: Cesium.PixelFormat.DEPTH_COMPONENT,
	    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT
	  };
	  this.textures = {
	    segmentsColor: Util.createTexture(colorTextureOptions),
	    segmentsDepth: Util.createTexture(depthTextureOptions),
	    currentTrailsColor: Util.createTexture(colorTextureOptions),
	    currentTrailsDepth: Util.createTexture(depthTextureOptions),
	    nextTrailsColor: Util.createTexture(colorTextureOptions),
	    nextTrailsDepth: Util.createTexture(depthTextureOptions)
	  };
	};

	ParticlesRendering.prototype.createRenderingFramebuffers = function createRenderingFramebuffers(context) {
	  this.framebuffers = {
	    segments: Util.createFramebuffer(context, this.textures.segmentsColor, this.textures.segmentsDepth),
	    currentTrails: Util.createFramebuffer(context, this.textures.currentTrailsColor, this.textures.currentTrailsDepth),
	    nextTrails: Util.createFramebuffer(context, this.textures.nextTrailsColor, this.textures.nextTrailsDepth)
	  };
	};

	ParticlesRendering.prototype.createSegmentsGeometry = function createSegmentsGeometry(userInput) {
	  var repeatVertex = 4;
	  var st = [];

	  for (var s = 0; s < userInput.particlesTextureSize; s++) {
	    for (var t = 0; t < userInput.particlesTextureSize; t++) {
	      for (var i = 0; i < repeatVertex; i++) {
	        st.push(s / userInput.particlesTextureSize);
	        st.push(t / userInput.particlesTextureSize);
	      }
	    }
	  }

	  st = new Float32Array(st);
	  var normal = [];
	  var pointToUse = [-1, 1];
	  var offsetSign = [-1, 1];

	  for (var i = 0; i < userInput.maxParticles; i++) {
	    for (var j = 0; j < repeatVertex / 2; j++) {
	      for (var k = 0; k < repeatVertex / 2; k++) {
	        normal.push(pointToUse[j]);
	        normal.push(offsetSign[k]);
	        normal.push(0);
	      }
	    }
	  }

	  normal = new Float32Array(normal);
	  var indexSize = 6 * userInput.maxParticles;
	  var vertexIndexes = new Uint32Array(indexSize);

	  for (var i = 0, j = 0, vertex = 0; i < userInput.maxParticles; i++) {
	    vertexIndexes[j++] = vertex + 0;
	    vertexIndexes[j++] = vertex + 1;
	    vertexIndexes[j++] = vertex + 2;
	    vertexIndexes[j++] = vertex + 2;
	    vertexIndexes[j++] = vertex + 1;
	    vertexIndexes[j++] = vertex + 3;
	    vertex += 4;
	  }

	  var geometry = new Cesium.Geometry({
	    attributes: new Cesium.GeometryAttributes({
	      st: new Cesium.GeometryAttribute({
	        componentDatatype: Cesium.ComponentDatatype.FLOAT,
	        componentsPerAttribute: 2,
	        values: st
	      }),
	      normal: new Cesium.GeometryAttribute({
	        componentDatatype: Cesium.ComponentDatatype.FLOAT,
	        componentsPerAttribute: 3,
	        values: normal
	      })
	    }),
	    indices: vertexIndexes
	  });
	  return geometry;
	};

	ParticlesRendering.prototype.createRenderingPrimitives = function createRenderingPrimitives(context, userInput, viewerParameters, particlesComputing) {
	  var that = this;
	  this.primitives = {
	    segments: new CustomPrimitive({
	      commandType: 'Draw',
	      attributeLocations: {
	        st: 0,
	        normal: 1
	      },
	      geometry: this.createSegmentsGeometry(userInput),
	      primitiveType: Cesium.PrimitiveType.TRIANGLES,
	      uniformMap: {
	        currentParticlesPosition: function currentParticlesPosition() {
	          return particlesComputing.particlesTextures.currentParticlesPosition;
	        },
	        postProcessingPosition: function postProcessingPosition() {
	          return particlesComputing.particlesTextures.postProcessingPosition;
	        },
	        aspect: function aspect() {
	          return context.drawingBufferWidth / context.drawingBufferHeight;
	        },
	        pixelSize: function pixelSize() {
	          return viewerParameters.pixelSize;
	        },
	        lineWidth: function lineWidth() {
	          return userInput.lineWidth;
	        },
	        particleHeight: function particleHeight() {
	          return userInput.particleHeight;
	        }
	      },
	      vertexShaderSource: new Cesium.ShaderSource({
	        sources: [segmentDrawVert]
	      }),
	      fragmentShaderSource: new Cesium.ShaderSource({
	        sources: [segmentDrawFrag]
	      }),
	      rawRenderState: Util.createRawRenderState({
	        // undefined value means let Cesium deal with it
	        viewport: undefined,
	        depthTest: {
	          enabled: true
	        },
	        depthMask: true
	      }),
	      framebuffer: this.framebuffers.segments,
	      autoClear: true
	    }),
	    trails: new CustomPrimitive({
	      commandType: 'Draw',
	      attributeLocations: {
	        position: 0,
	        st: 1
	      },
	      geometry: Util.getFullscreenQuad(),
	      primitiveType: Cesium.PrimitiveType.TRIANGLES,
	      uniformMap: {
	        segmentsColorTexture: function segmentsColorTexture() {
	          return that.textures.segmentsColor;
	        },
	        segmentsDepthTexture: function segmentsDepthTexture() {
	          return that.textures.segmentsDepth;
	        },
	        currentTrailsColor: function currentTrailsColor() {
	          return that.framebuffers.currentTrails.getColorTexture(0);
	        },
	        trailsDepthTexture: function trailsDepthTexture() {
	          return that.framebuffers.currentTrails.depthTexture;
	        },
	        fadeOpacity: function fadeOpacity() {
	          return userInput.fadeOpacity;
	        }
	      },
	      // prevent Cesium from writing depth because the depth here should be written manually
	      vertexShaderSource: new Cesium.ShaderSource({
	        defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
	        sources: [fullscreenVert]
	      }),
	      fragmentShaderSource: new Cesium.ShaderSource({
	        defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
	        sources: [trailDrawFrag]
	      }),
	      rawRenderState: Util.createRawRenderState({
	        viewport: undefined,
	        depthTest: {
	          enabled: true,
	          func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information

	        },
	        depthMask: true
	      }),
	      framebuffer: this.framebuffers.nextTrails,
	      autoClear: true,
	      preExecute: function preExecute() {
	        // swap framebuffers before binding
	        var temp;
	        temp = that.framebuffers.currentTrails;
	        that.framebuffers.currentTrails = that.framebuffers.nextTrails;
	        that.framebuffers.nextTrails = temp; // keep the framebuffers up to date

	        that.primitives.trails.commandToExecute.framebuffer = that.framebuffers.nextTrails;
	        that.primitives.trails.clearCommand.framebuffer = that.framebuffers.nextTrails;
	      }
	    }),
	    screen: new CustomPrimitive({
	      commandType: 'Draw',
	      attributeLocations: {
	        position: 0,
	        st: 1
	      },
	      geometry: Util.getFullscreenQuad(),
	      primitiveType: Cesium.PrimitiveType.TRIANGLES,
	      uniformMap: {
	        trailsColorTexture: function trailsColorTexture() {
	          return that.framebuffers.nextTrails.getColorTexture(0);
	        },
	        trailsDepthTexture: function trailsDepthTexture() {
	          return that.framebuffers.nextTrails.depthTexture;
	        }
	      },
	      // prevent Cesium from writing depth because the depth here should be written manually
	      vertexShaderSource: new Cesium.ShaderSource({
	        defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
	        sources: [fullscreenVert]
	      }),
	      fragmentShaderSource: new Cesium.ShaderSource({
	        defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
	        sources: [screenDrawFrag]
	      }),
	      rawRenderState: Util.createRawRenderState({
	        viewport: undefined,
	        depthTest: {
	          enabled: false
	        },
	        depthMask: true,
	        blending: {
	          enabled: true
	        }
	      }),
	      framebuffer: undefined // undefined value means let Cesium deal with it

	    })
	  };
	};

	var ParticleSystem = function ParticleSystem(context, data, userInput, viewerParameters) {
	  this.context = context;
	  this.data = data;
	  this.userInput = userInput;
	  this.viewerParameters = viewerParameters;
	  this.particlesComputing = new ParticlesComputing(this.context, this.data, this.userInput, this.viewerParameters);
	  this.particlesRendering = new ParticlesRendering(this.context, this.data, this.userInput, this.viewerParameters, this.particlesComputing);
	};

	ParticleSystem.prototype.canvasResize = function canvasResize(context) {
	  var this$1 = this;
	  this.particlesComputing.destroyParticlesTextures();
	  Object.keys(this.particlesComputing.windTextures).forEach(function (key) {
	    this$1.particlesComputing.windTextures[key].destroy();
	  });
	  Object.keys(this.particlesRendering.framebuffers).forEach(function (key) {
	    this$1.particlesRendering.framebuffers[key].destroy();
	  });
	  this.context = context;
	  this.particlesComputing = new ParticlesComputing(this.context, this.data, this.userInput, this.viewerParameters);
	  this.particlesRendering = new ParticlesRendering(this.context, this.data, this.userInput, this.viewerParameters, this.particlesComputing);
	};

	ParticleSystem.prototype.clearFramebuffers = function clearFramebuffers() {
	  var this$1 = this;
	  var clearCommand = new Cesium.ClearCommand({
	    color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
	    depth: 1.0,
	    framebuffer: undefined,
	    pass: Cesium.Pass.OPAQUE
	  });
	  Object.keys(this.particlesRendering.framebuffers).forEach(function (key) {
	    clearCommand.framebuffer = this$1.particlesRendering.framebuffers[key];
	    clearCommand.execute(this$1.context);
	  });
	};

	ParticleSystem.prototype.refreshParticles = function refreshParticles(maxParticlesChanged) {
	  this.clearFramebuffers();
	  this.particlesComputing.destroyParticlesTextures();
	  this.particlesComputing.createParticlesTextures(this.context, this.userInput, this.viewerParameters);

	  if (maxParticlesChanged) {
	    var geometry = this.particlesRendering.createSegmentsGeometry(this.userInput);
	    this.particlesRendering.primitives.segments.geometry = geometry;
	    var vertexArray = Cesium.VertexArray.fromGeometry({
	      context: this.context,
	      geometry: geometry,
	      attributeLocations: this.particlesRendering.primitives.segments.attributeLocations,
	      bufferUsage: Cesium.BufferUsage.STATIC_DRAW
	    });
	    this.particlesRendering.primitives.segments.commandToExecute.vertexArray = vertexArray;
	  }
	};

	ParticleSystem.prototype.applyUserInput = function applyUserInput(userInput) {
	  var this$1 = this;
	  var maxParticlesChanged = false;

	  if (this.userInput.maxParticles != userInput.maxParticles) {
	    maxParticlesChanged = true;
	  }

	  Object.keys(userInput).forEach(function (key) {
	    this$1.userInput[key] = userInput[key];
	  });
	  this.refreshParticles(maxParticlesChanged);
	};

	ParticleSystem.prototype.applyViewerParameters = function applyViewerParameters(viewerParameters) {
	  var this$1 = this;
	  Object.keys(viewerParameters).forEach(function (key) {
	    this$1.viewerParameters[key] = viewerParameters[key];
	  });
	  this.refreshParticles(false);
	};

	/**
	 * 地图所有类的基类
	 */
	var Base = function Base() {
	  this.id = parseInt(Math.random() * 1000) + new Date().getTime();
	};

	/**
	 * 在地图上展示的最小分类元祖
	 */

	var Tuple = /*@__PURE__*/function (Base) {
	  function Tuple() {
	    this.type = ""; //类型

	    this.map = null;
	    this._successCallBack = null; //成功回调函数,请调用_success方法

	    this._errorCallBack = null; //失败回调函数,请调用_error方法
	  }

	  if (Base) Tuple.__proto__ = Base;
	  Tuple.prototype = Object.create(Base && Base.prototype);
	  Tuple.prototype.constructor = Tuple; //添加到指定的map中

	  Tuple.prototype._addToMap = function _addToMap(map) {
	    throw new Error("请实现该方法");
	  }; //从map中移除


	  Tuple.prototype._removeByMap = function _removeByMap(destroy) {
	    throw new Error("请实现该方法");
	  }; //飞到元祖上


	  Tuple.prototype._flyTo = function _flyTo(duration, pitch, heading, range, maximumHeight) {
	    throw new Error("请实现该方法");
	  };

	  Tuple.prototype._success = function _success(data) {
	    this._successCallBack && this._successCallBack(data);
	  };

	  Tuple.prototype._error = function _error(data) {
	    this._errorCallBack && this._errorCallBack(data);
	  };
	  /**
	   * 飞到该元祖
	   * @param {number} duration 时间
	   * @param {number} pitch 俯仰角
	   * @param {number} heading 水平角
	   * @param {number} range 距离该元祖的位置距离
	   * @param {number} maximumHeight 飞行的最大高度
	   * @returns {this}
	   */


	  Tuple.prototype.flyTo = function flyTo(duration, pitch, heading, range, maximumHeight) {
	    if (this.map) {
	      this._flyTo(duration, pitch, heading, range, maximumHeight);
	    }

	    return this;
	  };
	  /**
	   * 添加到指定的map中
	   * @param map 
	   */


	  Tuple.prototype.addToMap = function addToMap(map) {
	    this.map = map;

	    this._addToMap(map);

	    return this;
	  };
	  /**
	   * 从map中移除
	   * @param destroy
	   */


	  Tuple.prototype.removeByMap = function removeByMap(destroy) {
	    if (this.map) {
	      this._removeByMap(destroy);

	      this.map = null;
	    }

	    return this;
	  };
	  /**
	   * 成功的加载完成回调
	   * @param callBack 
	   */

	  Tuple.prototype.when = function when(callBack) {
	    this._successCallBack = callBack;
	    return this;
	  };
	  /**
	  * 加载失败回调
	  * @param callBack 
	  */


	  Tuple.prototype["catch"] = function catch$1(callBack) {
	    this._errorCallBack = callBack;
	    return this;
	  };

	  return Tuple;
	}(Base);

	var Layer = /*@__PURE__*/function (Tuple) {
	  function Layer(name) {
	    Tuple.call(this);
	    this.type = "Layer";
	    this.name = name;
	    this.cesiumLayer = null;
	  }

	  if (Tuple) Layer.__proto__ = Tuple;
	  Layer.prototype = Object.create(Tuple && Tuple.prototype);
	  Layer.prototype.constructor = Layer;
	  var prototypeAccessors = {
	    show: {
	      configurable: true
	    }
	  };

	  prototypeAccessors.show.set = function (value) {
	    this.cesiumLayer.show = value;
	  };

	  prototypeAccessors.show.get = function () {
	    return this.cesiumLayer.show;
	  }; //添加到指定的map中


	  Layer.prototype._addToMap = function _addToMap(map) {
	    throw new Error("请实现该方法");
	  }; //从map中移除


	  Layer.prototype._removeByMap = function _removeByMap(destroy) {
	    throw new Error("请实现该方法");
	  };

	  Layer.prototype._flyTo = function _flyTo(duration, pitch, heading, range, maximumHeight) {
	    if (duration === void 0) duration = 3;
	    if (pitch === void 0) pitch = -90;
	    if (heading === void 0) heading = 0;
	    if (range === void 0) range = 0;
	    this.map.viewer.flyTo(this.cesiumLayer, {
	      maximumHeight: maximumHeight,
	      duration: duration,
	      offset: {
	        heading: Cesium.Math.toRadians(heading),
	        pitch: Cesium.Math.toRadians(pitch),
	        range: range
	      }
	    });
	    return this;
	  };

	  Object.defineProperties(Layer.prototype, prototypeAccessors);
	  return Layer;
	}(Tuple);

	var Cesium$1 = window.Cesium;
	var defaultOptions = {
	  maxParticles: 64 * 64,
	  particleHeight: 100.0,
	  fadeOpacity: 0.996,
	  dropRate: 0.003,
	  dropRateBump: 0.01,
	  speedFactor: 1.0,
	  lineWidth: 4.0,
	  particlesTextureSize: 64
	}; //

	var CesiumWind = /*@__PURE__*/function (Layer) {
	  function CesiumWind(url, option) {
	    if (option === void 0) option = defaultOptions;
	    Layer.call(this, option.name);
	    this.url = url;
	    this.option = option;
	  }

	  if (Layer) CesiumWind.__proto__ = Layer;
	  CesiumWind.prototype = Object.create(Layer && Layer.prototype);
	  CesiumWind.prototype.constructor = CesiumWind;

	  CesiumWind.prototype.updateOption = function updateOption(option) {
	    Object.assign(this.option, this.option, option);
	    this.particleSystem.applyUserInput(this.option);
	  }; //添加到指定的map中


	  CesiumWind.prototype._addToMap = function _addToMap(map) {
	    this._init(map.viewer);
	  }; //从map中移除


	  CesiumWind.prototype._removeByMap = function _removeByMap(destroy) {
	    this.scene.primitives.remove(this.cesiumLayer);
	  };

	  CesiumWind.prototype._init = function _init(viewer) {
	    var this$1 = this;
	    this.scene = viewer.scene;
	    this.camera = viewer.camera;
	    this.viewerParameters = {
	      lonRange: new Cesium$1.Cartesian2(),
	      latRange: new Cesium$1.Cartesian2(),
	      pixelSize: 0.0
	    }; // use a smaller earth radius to make sure distance to camera > 0
	    // 使用更小的地球半径，以确保camera>0的距离

	    this.globeBoundingSphere = new Cesium$1.BoundingSphere(Cesium$1.Cartesian3.ZERO, 0.99 * 6378137.0);

	    this._updateViewerParameters();

	    DataProcess.loadNetCDF(this.url).then(function (data) {
	      this$1.particleSystem = new ParticleSystem(this$1.scene.context, data, this$1.option, this$1.viewerParameters);

	      this$1._addPrimitives();

	      this$1._setupEventListeners();
	    });
	  };

	  CesiumWind.prototype._addPrimitives = function _addPrimitives() {
	    var collection = new Cesium$1.PrimitiveCollection(); // the order of primitives.add() should respect the dependency of primitives

	    collection.add(this.particleSystem.particlesComputing.primitives.calculateSpeed);
	    collection.add(this.particleSystem.particlesComputing.primitives.updatePosition);
	    collection.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition);
	    collection.add(this.particleSystem.particlesRendering.primitives.segments);
	    collection.add(this.particleSystem.particlesRendering.primitives.trails);
	    collection.add(this.particleSystem.particlesRendering.primitives.screen);
	    this.scene.primitives.add(collection);
	    this.cesiumLayer = collection;
	  };

	  CesiumWind.prototype._updateViewerParameters = function _updateViewerParameters() {
	    var viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid);
	    var lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
	    this.viewerParameters.lonRange.x = lonLatRange.lon.min;
	    this.viewerParameters.lonRange.y = lonLatRange.lon.max;
	    this.viewerParameters.latRange.x = lonLatRange.lat.min;
	    this.viewerParameters.latRange.y = lonLatRange.lat.max;
	    var pixelSize = this.camera.getPixelSize(this.globeBoundingSphere, this.scene.drawingBufferWidth, this.scene.drawingBufferHeight);

	    if (pixelSize > 0) {
	      this.viewerParameters.pixelSize = pixelSize;
	    }
	  };

	  CesiumWind.prototype._setupEventListeners = function _setupEventListeners() {
	    var that = this;
	    this.camera.moveStart.addEventListener(function () {
	      that.scene.primitives.show = false;
	    });
	    this.camera.moveEnd.addEventListener(function () {
	      that._updateViewerParameters();

	      that.particleSystem.applyViewerParameters(that.viewerParameters);
	      that.scene.primitives.show = true;
	    });
	    var resized = false;
	    window.addEventListener("resize", function () {
	      resized = true;
	      that.scene.primitives.show = false;
	      that.scene.primitives.removeAll();
	    });
	    this.scene.preRender.addEventListener(function () {
	      if (resized) {
	        that.particleSystem.canvasResize(that.scene.context);
	        resized = false;

	        that._addPrimitives();

	        that.scene.primitives.show = true;
	      }
	    });
	  };

	  return CesiumWind;
	}(Layer);

	return CesiumWind;

})));
