<template>
  <div style="100vh">
    <div id="cesiumContainer">
      <div id="toolbar">
      <table>
        <tbody>
          <tr>
            <td>Translucency enabled</td>
            <td>
              <input type="checkbox" data-bind="checked: translucencyEnabled">
            </td>
          </tr>
          <tr>
            <td>Fade by distance</td>
            <td>
              <input type="checkbox" data-bind="checked: fadeByDistance">
            </td>
          </tr>
          <tr>
            <td>Show vector data</td>
            <td>
              <input type="checkbox" data-bind="checked: showVectorData">
            </td>
          </tr>
          <tr>
            <td>Alpha</td>
            <td>
              <input type="range" min="0.0" max="1.0" step="0.1" data-bind="value: alpha, valueUpdate: 'input'">
              <input type="text" size="5" data-bind="value: alpha">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewer: null,
      polyline: null,
      polygon: null,
      viewModel: null
    }
  },
  mounted() {
    this.init(Cesium)
  },
  methods: {
    init(Cesium) {
      // var terrainProvider = this.createArcGisElevation3DTerrainProvider(Cesium)
      // terrainProvider.readyPromise.then(function() {
      //   this.viewer = new Cesium.Viewer('cesiumContainer', {
      //     terrainProvider: terrainProvider,
      //     imageryProvider: new Cesium.BingMapsImageryProvider({
      //       url: 'https://dev.virtualearth.net',
      //       mapStyle: Cesium.BingMapsStyle.AERIAL,
      //       culture: 'zh-Hans',
      //       key: 'AlgsUaY9R3p9MHmp-GN-o4j9HsdPrxboqvpaWwL5Da5vwQv7YkdC426vW1s6Lxrk' // apply your own key from bing map
      //     }),
      //     baseLayerPicker: false

      //   })

      // this.viewer.terrainProvider = terrainProvider

      //   this.viewer.scene.camera.flyTo({
      //     destination: Cesium.Cartesian3.fromDegrees(87.4074, 27.9254, 5756.992959404834),
      //     orientation: {
      //       heading: 4.7702,
      //       pitch: 0.0857,
      //       roll: 0
      //     }
      //   })
      // }).otherwise(function(error) {
      //   throw (error)
      // })
      // 初始化Cesium Viewer
      // this.viewer = new Cesium.Viewer('cesiumContainer', {
      //   animation: true,
      //   homeButton: true,
      //   geocoder: true,
      //   baseLayerPicker: true,
      //   timeline: true,
      //   fullscreenButton: true,
      //   scene3DOnly: false,
      //   infoBox: false,
      //   sceneModePicker: true,
      //   navigationInstructionsInitiallyVisible: true,
      //   navigationHelpButton: true,
      //   selectionIndicator: true
      // })
      // this.viewer.scene.globe.depthTestAgainstTerrain = true // 启用地形深度测试
      // // Remove default base layer
      // this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0))
      // // Add Sentinel-2 imagery
      // this.viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3954 }))
      this.viewer = new Cesium.Viewer('cesiumContainer', {
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
          url:
                'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e',
          layer: 'tdtBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false,
          mininumLevel: 0,
          maximumLevel: 16
        })
      })

      // var scene = this.viewer.scene
      // var globe = this.viewer.scene.globe
      var longitude = -3.82518
      var latitude = 53.11728
      var height = 72.8
      var position = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      )
      var url = '/SampleData/ParcLeadMine.glb'

      var entity = this.viewer.entities.add({
        name: url,
        position: position,
        model: {
          uri: url
        }
      })

      this.polygon = this.viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArrayHeights([
              -3.8152789692233817,
              53.124521420389996,
              200.20779492422255,
              -3.8165955002619016,
              53.12555934545405,
              205.85834336951655,
              -3.8201599842222054,
              53.12388420656903,
              230.82362697069453,
              -3.8198667503545027,
              53.123748567587455,
              225.53297006293968,
              -3.8190548496317476,
              53.1240486000822,
              221.82677773619432,
              -3.817536387097508,
              53.122763476393764,
              209.94136782255705,
              -3.8169125359199336,
              53.12285547981627,
              210.96626238861327,
              -3.8166873871853073,
              53.12299403424474,
              211.02223937734595,
              -3.8163695374580873,
              53.12300505277307,
              211.25942926271824,
              -3.8162743040622313,
              53.12281471203994,
              212.35109129094147,
              -3.8159746138174193,
              53.12280996651767,
              214.87977416348798,
              -3.815429896849304,
              53.1236135347983,
              209.72496223706005
            ])
          ),
          material: Cesium.Color.LIME.withAlpha(0.5),
          classificationType: Cesium.ClassificationType.TERRAIN
        }
      })

      this.polyline = this.viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -3.8098444201746373,
            53.1190304262546,
            286.1875170545701,
            -3.8099801237370663,
            53.119539531697576,
            288.7733884242394,
            -3.810165716635671,
            53.11979180761567,
            290.9294630315179,
            -3.8104840812145357,
            53.12007534956926,
            292.6392327626228,
            -3.8105689502073554,
            53.120259094792196,
            292.222036965774,
            -3.811027311824268,
            53.120409248874196,
            289.61356291617307,
            -3.811530473295422,
            53.12063281057782,
            284.01098712543586,
            -3.8120545342562693,
            53.120742539082435,
            280.118191867836,
            -3.812444493044727,
            53.120813289759326,
            276.0400221387852,
            -3.812779626711285,
            53.12094275348024,
            271.1187399484896,
            -3.8133560322579494,
            53.12104757866638,
            263.3495497598578,
            -3.8137266493960085,
            53.12120789867194,
            257.73878624321316,
            -3.8142552291751133,
            53.121321248522904,
            251.87265828778177,
            -3.814322603988525,
            53.12174170121103,
            238.7082749547689,
            -3.8143764268391314,
            53.1219492923309,
            235.0371831845662,
            -3.8148156514145786,
            53.12210819668669,
            230.2458816627467,
            -3.8155394721966163,
            53.1222990144029,
            221.33319292262706,
            -3.8159828072920927,
            53.12203093429715,
            223.66664756982703,
            -3.816678108944717,
            53.12183939425214,
            223.8787312412801,
            -3.817466081093726,
            53.121751900508535,
            224.52293229989735,
            -3.8183082996527955,
            53.12173266141031,
            223.3672181535749
          ]),
          width: 8,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.YELLOW,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK
          }),
          clampToGround: true
        }
      })

      this.viewModel = {
        translucencyEnabled: true,
        fadeByDistance: true,
        showVectorData: false,
        alpha: 0.5
      }

      Cesium.knockout.track(this.viewModel)
      var toolbar = document.getElementById('toolbar')
      Cesium.knockout.applyBindings(this.viewModel, toolbar)
      for (var name in this.viewModel) {
        if (this.viewModel.hasOwnProperty(name)) {
          Cesium.knockout.getObservable(this.viewModel, name).subscribe(this.update)
        }
      }


      this.update()

      this.viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3(
          3826465.9884728403,
          -254831.02751468265,
          5081387.671561018
        ),
        orientation: new Cesium.HeadingPitchRoll(
          3.3889450556243754,
          -0.5276382514771969,
          6.282272566663295
        ),
        endTransform: Cesium.Matrix4.IDENTITY
      })

      this.viewer.scene.camera.flyTo({
        destination: new Cesium.Cartesian3(
          3827270.552916987,
          -255123.18143177085,
          5079147.091351856
        ),
        orientation: new Cesium.HeadingPitchRoll(
          3.2624281242239963,
          -0.22213535190506972,
          6.282786783842843
        ),
        duration: 5.0
      })
    },

    update() {
      this.viewer.scene.globe.translucency.enabled = this.viewModel.translucencyEnabled

      var alpha = Number(this.viewModel.alpha)
      alpha = !isNaN(alpha) ? alpha : 1.0
      alpha = Cesium.Math.clamp(alpha, 0.0, 1.0)

      this.viewer.scene.globe.translucency.frontFaceAlphaByDistance = alpha
      this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = this.viewModel.fadeByDistance
        ? 1.0
        : alpha

      this.polygon.show = this.viewModel.showVectorData
      this.polyline.show = this.viewModel.showVectorData
    },
    createArcGisElevation3DTerrainProvider(Cesium) {
      // The following code is written by Peter Lu
      // I disclaims copyright to this source code
      // and I really hope one day, it coube be merged with Cesium Trunk~
      /**
       * A {@link TerrainProvider} that produces terrain geometry by tessellating height maps
       * retrieved from an ArcGIS Elevation3D Server.
       *
       * @alias ArcGisElevation3DTerrainProvider
       * @constructor
       *
       * @example
       * var terrainProvider = new ArcGisElevation3DTerrainProvider();
       * viewer.terrainProvider = terrainProvider;
       *
       *  @see TerrainProvider
       */
      const self = this
      function ArcGisElevation3DTerrainProvider(options) {
        options = Cesium.defaultValue(options, {})

        this._tilingScheme = new Cesium.WebMercatorTilingScheme({ ellipsoid: options.ellipsoid })

        this._terrainDataStructure = {
          heightScale: 1,
          heightOffset: 0,
          elementsPerHeight: 1,
          stride: 1,
          elementMultiplier: 65.0
        }

        this.lerc = self.LERC()

        // Note: the 64 below does NOT need to match the actual vertex dimensions, because
        // the ellipsoid is significantly smoother than actual terrain.
        this._levelZeroMaximumGeometricError = Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(this._tilingScheme.ellipsoid, 65,
          this._tilingScheme.getNumberOfXTilesAtLevel(0))

        this._baseUrl = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}'
        this._errorEvent = new Cesium.Event()
        this._readyPromise = Cesium.when.resolve(true)
      }

      Object.defineProperties(ArcGisElevation3DTerrainProvider.prototype, {
        /**
         * Gets an event that is raised when the terrain provider encounters an asynchronous error.  By subscribing
         * to the event, you will be notified of the error and can potentially recover from it.  Event listeners
         * are passed an instance of {@link TileProviderError}.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {Event}
         */
        errorEvent: {
          get: function () {
            return this._errorEvent
          }
        },

        /**
         * Gets the credit to display when this terrain provider is active.  Typically this is used to credit
         * the source of the terrain.  This function should not be called before {@link ArcGisElevation3DTerrainProvider#ready} returns true.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {Credit}
         */
        credit: {
          get: function () {
            return this._credit
          }
        },

        /**
         * Gets the tiling scheme used by this provider.  This function should
         * not be called before {@link ArcGisElevation3DTerrainProvider#ready} returns true.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {GeographicTilingScheme}
         */
        tilingScheme: {
          get: function () {
            return this._tilingScheme
          }
        },

        /**
         * Gets a value indicating whether or not the provider is ready for use.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {Boolean}
         */
        ready: {
          get: function () {
            return true
          }
        },

        /**
         * Gets a promise that resolves to true when the provider is ready for use.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {Promise.<Boolean>}
         * @readonly
         */
        readyPromise: {
          get: function () {
            return this._readyPromise
          }
        },

        /**
         * Gets a value indicating whether or not the provider includes a water mask.  The water mask
         * indicates which areas of the globe are water rather than land, so they can be rendered
         * as a reflective surface with animated waves.  This function should not be
         * called before {@link ArcGisElevation3DTerrainProvider#ready} returns true.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {Boolean}
         */
        hasWaterMask: {
          get: function () {
            return false
          }
        },

        /**
         * Gets a value indicating whether or not the requested tiles include vertex normals.
         * This function should not be called before {@link ArcGisElevation3DTerrainProvider#ready} returns true.
         * @memberof ArcGisElevation3DTerrainProvider.prototype
         * @type {Boolean}
         */
        hasVertexNormals: {
          get: function () {
            return false
          }
        }
      })

      /**
       * Requests the geometry for a given tile.  This function should not be called before
       * {@link ArcGisElevation3DTerrainProvider#ready} returns true.  The result includes terrain
       * data and indicates that all child tiles are available.
       *
       * @param {Number} x The X coordinate of the tile for which to request geometry.
       * @param {Number} y The Y coordinate of the tile for which to request geometry.
       * @param {Number} level The level of the tile for which to request geometry.
       * @returns {Promise.<TerrainData>|undefined} A promise for the requested geometry.  If this method
       *          returns undefined instead of a promise, it is an indication that too many requests are already
       *          pending and the request will be retried later.
       */
      ArcGisElevation3DTerrainProvider.prototype.requestTileGeometry = function (x, y, level) {
        var url = this._baseUrl.replace('{z}', level).replace('{x}', x).replace('{y}', y)

        var that = this

        var resource = Cesium.Resource.createIfNeeded(url)
        return resource.fetchArrayBuffer().then(function (buffer) {
          var bufferNow = buffer
          var pixels, mask, min, max, height, width
          var decodedPixelBlock = that.lerc.decode(buffer, { returnMask: true })
          width = decodedPixelBlock.width
          height = decodedPixelBlock.height
          min = decodedPixelBlock.minValue
          max = decodedPixelBlock.maxValue
          pixels = decodedPixelBlock.pixelData
          mask = decodedPixelBlock.maskData

          var bEmptyData = 0
          var setWidth = 65
          var nRatio = 4
          var fWidth = setWidth
          var fHeight = setWidth
          var buffer = new Float32Array(fWidth * fHeight)

          for (var i = 0; i < fHeight; i++) {
            for (var j = 0; j < fWidth; j++) {
              if (mask && mask[i * width * nRatio + j * nRatio] == 0) {
                buffer[i * fWidth + j] = 0
              } else {
                buffer[i * fWidth + j] = pixels[i * width * nRatio + j * nRatio]
                bEmptyData++
              }
            }
          }

          return new Cesium.HeightmapTerrainData({
            buffer: buffer,
            width: fWidth,
            height: fHeight,
            structure: that._terrainDataStructure
          })
          // if(bEmptyData !=0){
          //     return new Cesium.HeightmapTerrainData({
          //       buffer : buffer,
          //       width : fWidth,
          //       height : fHeight,
          //       structure : that._terrainDataStructure
          //   });
          // }else{
          //   return {bEmptyData:true};
          // }
        }).otherwise(function (error) {
        })

        return
      }

      /**
       * Gets the maximum geometric error allowed in a tile at a given level.
       *
       * @param {Number} level The tile level for which to get the maximum geometric error.
       * @returns {Number} The maximum geometric error.
       */
      ArcGisElevation3DTerrainProvider.prototype.getLevelMaximumGeometricError = function (level) {
        return this._levelZeroMaximumGeometricError / (1 << level)
      }

      /**
       * Determines whether data for a tile is available to be loaded.
       *
       * @param {Number} x The X coordinate of the tile for which to request geometry.
       * @param {Number} y The Y coordinate of the tile for which to request geometry.
       * @param {Number} level The level of the tile for which to request geometry.
       * @returns {Boolean} Undefined if not supported, otherwise true or false.
       */
      ArcGisElevation3DTerrainProvider.prototype.getTileDataAvailable = function (x, y, level) {
        return undefined
      }

      return new ArcGisElevation3DTerrainProvider()
    },
    LERC() {
      // WARNING: This decoder version can only read old version 1 Lerc blobs. Use with caution.
      // A new, updated js Lerc decoder is in the works.

      // Note: currently, this module only has an implementation for decoding LERC data, not encoding. The name of
      // the class was chosen to be future proof.

      var LercCodec = {}

      LercCodec.defaultNoDataValue = -3.4027999387901484e+38 // smallest Float32 value

      /**
         * Decode a LERC byte stream and return an object containing the pixel data and some required and optional
         * information about it, such as the image's width and height.
         *
         * @param {ArrayBuffer} input The LERC input byte stream
         * @param {object} [options] Decoding options, containing any of the following properties:
         * @config {number} [inputOffset = 0]
         *        Skip the first inputOffset bytes of the input byte stream. A valid LERC file is expected at that position.
         * @config {Uint8Array} [encodedMask = null]
         *        If specified, the decoder will not read mask information from the input and use the specified encoded
         *        mask data instead. Mask header/data must not be present in the LERC byte stream in this case.
         * @config {number} [noDataValue = LercCode.defaultNoDataValue]
         *        Pixel value to use for masked pixels.
         * @config {ArrayBufferView|Array} [pixelType = Float32Array]
         *        The desired type of the pixelData array in the return value. Note that it is the caller's responsibility to
         *        provide an appropriate noDataValue if the default pixelType is overridden.
         * @config {boolean} [returnMask = false]
         *        If true, the return value will contain a maskData property of type Uint8Array which has one element per
         *        pixel, the value of which is 1 or 0 depending on whether that pixel's data is present or masked. If the
         *        input LERC data does not contain a mask, maskData will not be returned.
         * @config {boolean} [returnEncodedMask = false]
         *        If true, the return value will contain a encodedMaskData property, which can be passed into encode() as
         *        encodedMask.
         * @config {boolean} [returnFileInfo = false]
         *        If true, the return value will have a fileInfo property that contains metadata obtained from the
         *        LERC headers and the decoding process.
         * @config {boolean} [computeUsedBitDepths = false]
         *        If true, the fileInfo property in the return value will contain the set of all block bit depths
         *        encountered during decoding. Will only have an effect if returnFileInfo option is true.
         * @returns {{width, height, pixelData, minValue, maxValue, noDataValue, [maskData], [encodedMaskData], [fileInfo]}}
         */
      LercCodec.decode = function (input, options) {
        options = options || {}

        var skipMask = options.encodedMaskData || (options.encodedMaskData === null)
        var parsedData = parse(input, options.inputOffset || 0, skipMask)

        var noDataValue = (options.noDataValue != null) ? options.noDataValue : LercCodec.defaultNoDataValue

        var uncompressedData = uncompressPixelValues(parsedData, options.pixelType || Float32Array,
          options.encodedMaskData, noDataValue, options.returnMask)

        var result = {
          width: parsedData.width,
          height: parsedData.height,
          pixelData: uncompressedData.resultPixels,
          minValue: parsedData.pixels.minValue,
          maxValue: parsedData.pixels.maxValue,
          noDataValue: noDataValue
        }

        if (uncompressedData.resultMask) {
          result.maskData = uncompressedData.resultMask
        }

        if (options.returnEncodedMask && parsedData.mask) {
          result.encodedMaskData = parsedData.mask.bitset ? parsedData.mask.bitset : null
        }

        if (options.returnFileInfo) {
          result.fileInfo = formatFileInfo(parsedData)
          if (options.computeUsedBitDepths) {
            result.fileInfo.bitDepths = computeUsedBitDepths(parsedData)
          }
        }

        return result
      }

      var uncompressPixelValues = function (data, TypedArrayClass, maskBitset, noDataValue, storeDecodedMask) {
        var blockIdx = 0
        var numX = data.pixels.numBlocksX
        var numY = data.pixels.numBlocksY
        var blockWidth = Math.floor(data.width / numX)
        var blockHeight = Math.floor(data.height / numY)
        var scale = 2 * data.maxZError
        maskBitset = maskBitset || ((data.mask) ? data.mask.bitset : null)

        var resultPixels, resultMask
        resultPixels = new TypedArrayClass(data.width * data.height)
        if (storeDecodedMask && maskBitset) {
          resultMask = new Uint8Array(data.width * data.height)
        }
        var blockDataBuffer = new Float32Array(blockWidth * blockHeight)

        var xx, yy
        for (var y = 0; y <= numY; y++) {
          var thisBlockHeight = (y !== numY) ? blockHeight : (data.height % numY)
          if (thisBlockHeight === 0) {
            continue
          }
          for (var x = 0; x <= numX; x++) {
            var thisBlockWidth = (x !== numX) ? blockWidth : (data.width % numX)
            if (thisBlockWidth === 0) {
              continue
            }

            var outPtr = y * data.width * blockHeight + x * blockWidth
            var outStride = data.width - thisBlockWidth

            var block = data.pixels.blocks[blockIdx]

            var blockData, blockPtr, constValue
            if (block.encoding < 2) {
              // block is either uncompressed or bit-stuffed (encodings 0 and 1)
              if (block.encoding === 0) {
                // block is uncompressed
                blockData = block.rawData
              } else {
                // block is bit-stuffed
                unstuff(block.stuffedData, block.bitsPerPixel, block.numValidPixels, block.offset, scale, blockDataBuffer, data.pixels.maxValue)
                blockData = blockDataBuffer
              }
              blockPtr = 0
            } else if (block.encoding === 2) {
              // block is all 0
              constValue = 0
            } else {
              // block has constant value (encoding === 3)
              constValue = block.offset
            }

            var maskByte
            if (maskBitset) {
              for (yy = 0; yy < thisBlockHeight; yy++) {
                if (outPtr & 7) {
                  //
                  maskByte = maskBitset[outPtr >> 3]
                  maskByte <<= outPtr & 7
                }
                for (xx = 0; xx < thisBlockWidth; xx++) {
                  if (!(outPtr & 7)) {
                    // read next byte from mask
                    maskByte = maskBitset[outPtr >> 3]
                  }
                  if (maskByte & 128) {
                    // pixel data present
                    if (resultMask) {
                      resultMask[outPtr] = 1
                    }
                    resultPixels[outPtr++] = (block.encoding < 2) ? blockData[blockPtr++] : constValue
                  } else {
                    // pixel data not present
                    if (resultMask) {
                      resultMask[outPtr] = 0
                    }
                    resultPixels[outPtr++] = noDataValue
                  }
                  maskByte <<= 1
                }
                outPtr += outStride
              }
            } else {
              // mask not present, simply copy block over
              if (block.encoding < 2) {
                // duplicating this code block for performance reasons
                // blockData case:
                for (yy = 0; yy < thisBlockHeight; yy++) {
                  for (xx = 0; xx < thisBlockWidth; xx++) {
                    resultPixels[outPtr++] = blockData[blockPtr++]
                  }
                  outPtr += outStride
                }
              } else {
                // constValue case:
                for (yy = 0; yy < thisBlockHeight; yy++) {
                  for (xx = 0; xx < thisBlockWidth; xx++) {
                    resultPixels[outPtr++] = constValue
                  }
                  outPtr += outStride
                }
              }
            }
            if ((block.encoding === 1) && (blockPtr !== block.numValidPixels)) {
              throw 'Block and Mask do not match'
            }
            blockIdx++
          }
        }

        return {
          resultPixels: resultPixels,
          resultMask: resultMask
        }
      }

      var formatFileInfo = function (data) {
        return {
          'fileIdentifierString': data.fileIdentifierString,
          'fileVersion': data.fileVersion,
          'imageType': data.imageType,
          'height': data.height,
          'width': data.width,
          'maxZError': data.maxZError,
          'eofOffset': data.eofOffset,
          'mask': data.mask ? {
            'numBlocksX': data.mask.numBlocksX,
            'numBlocksY': data.mask.numBlocksY,
            'numBytes': data.mask.numBytes,
            'maxValue': data.mask.maxValue
          } : null,
          'pixels': {
            'numBlocksX': data.pixels.numBlocksX,
            'numBlocksY': data.pixels.numBlocksY,
            'numBytes': data.pixels.numBytes,
            'maxValue': data.pixels.maxValue,
            'minValue': data.pixels.minValue,
            'noDataValue': this.noDataValue
          }
        }
      }

      var computeUsedBitDepths = function (data) {
        var numBlocks = data.pixels.numBlocksX * data.pixels.numBlocksY
        var bitDepths = {}
        for (var i = 0; i < numBlocks; i++) {
          var block = data.pixels.blocks[i]
          if (block.encoding === 0) {
            bitDepths.float32 = true
          } else if (block.encoding === 1) {
            bitDepths[block.bitsPerPixel] = true
          } else {
            bitDepths[0] = true
          }
        }

        return Object.keys(bitDepths)
      }

      var parse = function (input, fp, skipMask) {
        var data = {}

        // File header
        var fileIdView = new Uint8Array(input, fp, 10)
        data.fileIdentifierString = String.fromCharCode.apply(null, fileIdView)
        if (data.fileIdentifierString.trim() != 'CntZImage') {
          throw 'Unexpected file identifier string: ' + data.fileIdentifierString
        }
        fp += 10
        var view = new DataView(input, fp, 24)
        data.fileVersion = view.getInt32(0, true)
        data.imageType = view.getInt32(4, true)
        data.height = view.getUint32(8, true)
        data.width = view.getUint32(12, true)
        data.maxZError = view.getFloat64(16, true)
        fp += 24

        // Mask Header
        if (!skipMask) {
          view = new DataView(input, fp, 16)
          data.mask = {}
          data.mask.numBlocksY = view.getUint32(0, true)
          data.mask.numBlocksX = view.getUint32(4, true)
          data.mask.numBytes = view.getUint32(8, true)
          data.mask.maxValue = view.getFloat32(12, true)
          fp += 16

          // Mask Data
          if (data.mask.numBytes > 0) {
            var bitset = new Uint8Array(Math.ceil(data.width * data.height / 8))
            view = new DataView(input, fp, data.mask.numBytes)
            var cnt = view.getInt16(0, true)
            var ip = 2; var op = 0
            do {
              if (cnt > 0) {
                while (cnt--) { bitset[op++] = view.getUint8(ip++) }
              } else {
                var val = view.getUint8(ip++)
                cnt = -cnt
                while (cnt--) { bitset[op++] = val }
              }
              cnt = view.getInt16(ip, true)
              ip += 2
            } while (ip < data.mask.numBytes)
            if ((cnt !== -32768) || (op < bitset.length)) {
              throw 'Unexpected end of mask RLE encoding'
            }
            data.mask.bitset = bitset
            fp += data.mask.numBytes
          } else if ((data.mask.numBytes | data.mask.numBlocksY | data.mask.maxValue) == 0) { // Special case, all nodata
            var bitset = new Uint8Array(Math.ceil(data.width * data.height / 8))
            data.mask.bitset = bitset
          }
        }

        // Pixel Header
        view = new DataView(input, fp, 16)
        data.pixels = {}
        data.pixels.numBlocksY = view.getUint32(0, true)
        data.pixels.numBlocksX = view.getUint32(4, true)
        data.pixels.numBytes = view.getUint32(8, true)
        data.pixels.maxValue = view.getFloat32(12, true)
        fp += 16

        var numBlocksX = data.pixels.numBlocksX
        var numBlocksY = data.pixels.numBlocksY
        // the number of blocks specified in the header does not take into account the blocks at the end of
        // each row/column with a special width/height that make the image complete in case the width is not
        // evenly divisible by the number of blocks.
        var actualNumBlocksX = numBlocksX + ((data.width % numBlocksX) > 0 ? 1 : 0)
        var actualNumBlocksY = numBlocksY + ((data.height % numBlocksY) > 0 ? 1 : 0)
        data.pixels.blocks = new Array(actualNumBlocksX * actualNumBlocksY)
        var minValue = 1000000000
        var blockI = 0
        for (var blockY = 0; blockY < actualNumBlocksY; blockY++) {
          for (var blockX = 0; blockX < actualNumBlocksX; blockX++) {
            // Block
            var size = 0
            var bytesLeft = input.byteLength - fp
            view = new DataView(input, fp, Math.min(10, bytesLeft))
            var block = {}
            data.pixels.blocks[blockI++] = block
            var headerByte = view.getUint8(0); size++
            block.encoding = headerByte & 63
            if (block.encoding > 3) {
              throw 'Invalid block encoding (' + block.encoding + ')'
            }
            if (block.encoding === 2) {
              fp++
              minValue = Math.min(minValue, 0)
              continue
            }
            if ((headerByte !== 0) && (headerByte !== 2)) {
              headerByte >>= 6
              block.offsetType = headerByte
              if (headerByte === 2) {
                block.offset = view.getInt8(1); size++
              } else if (headerByte === 1) {
                block.offset = view.getInt16(1, true); size += 2
              } else if (headerByte === 0) {
                block.offset = view.getFloat32(1, true); size += 4
              } else {
                throw 'Invalid block offset type'
              }
              minValue = Math.min(block.offset, minValue)

              if (block.encoding === 1) {
                headerByte = view.getUint8(size); size++
                block.bitsPerPixel = headerByte & 63
                headerByte >>= 6
                block.numValidPixelsType = headerByte
                if (headerByte === 2) {
                  block.numValidPixels = view.getUint8(size); size++
                } else if (headerByte === 1) {
                  block.numValidPixels = view.getUint16(size, true); size += 2
                } else if (headerByte === 0) {
                  block.numValidPixels = view.getUint32(size, true); size += 4
                } else {
                  throw 'Invalid valid pixel count type'
                }
              }
            }
            fp += size

            if (block.encoding == 3) {
              continue
            }

            var arrayBuf, store8
            if (block.encoding === 0) {
              var numPixels = (data.pixels.numBytes - 1) / 4
              if (numPixels !== Math.floor(numPixels)) {
                throw 'uncompressed block has invalid length'
              }
              arrayBuf = new ArrayBuffer(numPixels * 4)
              store8 = new Uint8Array(arrayBuf)
              store8.set(new Uint8Array(input, fp, numPixels * 4))
              var rawData = new Float32Array(arrayBuf)
              for (var j = 0; j < rawData.length; j++) {
                minValue = Math.min(minValue, rawData[j])
              }
              block.rawData = rawData
              fp += numPixels * 4
            } else if (block.encoding === 1) {
              var dataBytes = Math.ceil(block.numValidPixels * block.bitsPerPixel / 8)
              var dataWords = Math.ceil(dataBytes / 4)
              arrayBuf = new ArrayBuffer(dataWords * 4)
              store8 = new Uint8Array(arrayBuf)
              store8.set(new Uint8Array(input, fp, dataBytes))
              block.stuffedData = new Uint32Array(arrayBuf)
              fp += dataBytes
            }
          }
        }
        data.pixels.minValue = minValue
        data.eofOffset = fp
        return data
      }

      var unstuff = function (src, bitsPerPixel, numPixels, offset, scale, dest, maxValue) {
        var bitMask = (1 << bitsPerPixel) - 1
        var i = 0; var o
        var bitsLeft = 0
        var n, buffer
        var nmax = Math.ceil((maxValue - offset) / scale)
        // get rid of trailing bytes that are already part of next block
        var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8)
        src[src.length - 1] <<= 8 * numInvalidTailBytes

        for (o = 0; o < numPixels; o++) {
          if (bitsLeft === 0) {
            buffer = src[i++]
            bitsLeft = 32
          }
          if (bitsLeft >= bitsPerPixel) {
            n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask
            bitsLeft -= bitsPerPixel
          } else {
            var missingBits = (bitsPerPixel - bitsLeft)
            n = ((buffer & bitMask) << missingBits) & bitMask
            buffer = src[i++]
            bitsLeft = 32 - missingBits
            n += (buffer >>> bitsLeft)
          }
          // pixel values may exceed max due to quantization
          dest[o] = n < nmax ? offset + n * scale : maxValue
        }
        return dest
      }

      return LercCodec
    }
  }

}
</script>
