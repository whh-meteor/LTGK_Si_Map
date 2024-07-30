<template>
  <div class="geojson-style-panel">
    <label for="fillColor">填充颜色:</label>
    <input
      type="color"
      id="fillColor"
      v-model="style.fillColor"
      @input="updateStyle"
    />

    <label for="fillOpacity">填充透明度:</label>
    <input
      type="range"
      id="fillOpacity"
      v-model.number="style.fillOpacity"
      min="0"
      max="1"
      step="0.01"
      @input="updateStyle"
    />

    <label for="borderColor">边框颜色:</label>
    <input
      type="color"
      id="borderColor"
      v-model="style.borderColor"
      @input="updateStyle"
    />

    <label for="borderWidth">边框宽度:</label>
    <input
      type="range"
      id="borderWidth"
      v-model.number="style.borderWidth"
      min="0"
      max="10"
      step="0.1"
      @input="updateStyle"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      style: {
        fillColor: "#ff0000",
        fillOpacity: 0.5,
        borderColor: "#000000",
        borderWidth: 2,
      },
    };
  },
  methods: {
    updateStyle() {
      this.$emit("update-style", this.style);
    },
  },
};
</script>

<style>
.geojson-style-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
