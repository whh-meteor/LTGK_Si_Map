<template>
  <div style="100vh">
    <div id="cesiumContainer" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      viewer: '',
      partsToLoad: [
        {
          url: 'MultipartVehicle_part1.czml',
          range: [0, 1500],
          requested: false,
          loaded: false
        },
        {
          url: 'MultipartVehicle_part2.czml',
          range: [1500, 3000],
          requested: false,
          loaded: false
        },
        {
          url: 'MultipartVehicle_part3.czml',
          range: [3000, 4500],
          requested: false,
          loaded: false
        }
      ],
      statusDisplay: '',
      dataSource: '',
      czmlPath: ''
    }
  },
  mounted() {
    this.init(Cesium)
  },
  methods: {
    init(Cesium) {
      var self = this
     
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true
      })
      this.statusDisplay = document.createElement('div')
      const fuelDisplay = document.createElement('div')
      this.czmlPath = '/SampleData/'
      let vehicleEntity
      // 添加空白的CzmlDataSource以保存我们的多部分实体。
      this.dataSource = new Cesium.CzmlDataSource()
      this.viewer.dataSources.add(this.dataSource)

      // 此演示展示了如何将单个路径分解为多个CZML流。


      // 预先加载第一部分。
      this.processPart(this.partsToLoad[0])
      // 在时钟自然到达之前加载一个新部分。
      // 请注意，这无法预测用户何时可以快进到它。
      const preloadTimeInSeconds = 100

      this.viewer.clock.onTick.addEventListener(function(clock) {
        // This example uses time offsets from the start to identify which parts need loading.
        const timeOffset = Cesium.JulianDate.secondsDifference(
          clock.currentTime,
          clock.startTime
        )

        // Filter the list of parts to just the ones that need loading right now.
        // Then, process each part that needs loading.
        this.partsToLoad
          .filter(function(part) {
            return (
              !part.requested &&
                            timeOffset >= part.range[0] - preloadTimeInSeconds &&
                            timeOffset <= part.range[1]
            )
          })
          .forEach(function(part) {
            this.processPart(part)
          })

        if (vehicleEntity) {
          const fuel = vehicleEntity.properties.fuel_remaining.getValue(
            clock.currentTime
          )
          if (Cesium.defined(fuel)) {
            fuelDisplay.textContent = `Fuel: ${fuel.toFixed(2)} gal`
          }
        }
      })

      // Add a reset button, for convenience.
      Sandcastle.addToolbarButton('Reset demo', function() {
        // Put things back to the starting position.
        this.viewer.clock.currentTime = this.viewer.clock.startTime
        this.viewer.clock.shouldAnimate = true

        this.partsToLoad.forEach(function(part) {
          part.requested = false
          part.loaded = false
        })

        this.dataSource.entities.removeAll()
        this.processPart(this.partsToLoad[0])
      })

      // Show the status display below the reset button.
      this.statusDisplay.style.background = 'rgba(42, 42, 42, 0.7)'
      this.statusDisplay.style.padding = '5px 10px'
      document.getElementById('toolbar').appendChild(this.statusDisplay)

      // Show a multi-part custom property being read from CZML.
      fuelDisplay.style.background = 'rgba(42, 42, 42, 0.7)'
      fuelDisplay.style.padding = '5px 10px'
      fuelDisplay.style.marginTop = '5px'
      document.getElementById('toolbar').appendChild(fuelDisplay)
    },
    updatestatusDisplay() {
      let msg = ''
      this.partsToLoad.forEach(function(part) {
        msg += `${part.url} - `
        if (part.loaded) {
          msg += 'Loaded.<br/>'
        } else if (part.requested) {
          msg += 'Loading now...<br/>'
        } else {
          msg += 'Not needed yet.<br/>'
        }
      })
      this.statusDisplay.innerHTML = msg
    },

    // Helper函数根据请求标记零件，并将其处理到数据源中。
    processPart(part) {
      part.requested = true
      //   this.updateStatusDisplay()
      var self = this
      this.dataSource.process(this.czmlPath + part.url).then(function() {
        part.loaded = true
        self.updateStatusDisplay()

        // Follow the vehicle with the camera.
        if (!this.viewer.trackedEntity) {
          this.viewer.trackedEntity = vehicleEntity = self.dataSource.entities.getById(
            'Vehicle'
          )
        }
      })
    }
   
  }

}
</script>
