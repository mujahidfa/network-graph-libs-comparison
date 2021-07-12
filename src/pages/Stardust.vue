<template>
  <canvas ref="stardust-container"></canvas>
</template>

<script>
export default {
  methods: {
    createGraph() {
      // Get our canvas element
      var canvas = this.$refs["stardust-container"];
      var width = 960;
      var height = 500;

      // Create a WebGL 2D platform on the canvas:
      var platform = Stardust.platform("webgl-2d", canvas, width, height);

      // ... Load data and render your visualization
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      var circleSpec = Stardust.mark.circle();
      var circles = Stardust.mark.create(circleSpec, platform);
      circles.attr("center", (d) => [d * 80, 250]);
      circles.attr("radius", (d) => d * 3);
      circles.attr("color", [0, 0, 0, 1]);
      circles.data(data);
      circles.render();
    },
  },
  mounted() {
    this.createGraph();
  },
};
</script>

<style scoped></style>
