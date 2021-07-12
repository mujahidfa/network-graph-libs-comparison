<template>
  <div
    ref="vivagraph-container"
    style="height: 90vh; width: 80vw; border: 1px solid blue"
  ></div>
</template>

<script>
export default {
  props: {
    size: Number,
    graphData: Object,
  },
  watch: {
    size: function () {
      // $remove(item);
      this.createGraph();
    },
  },
  mounted() {
    this.createGraph();
  },
  methods: {
    createGraph() {
      var graph = Viva.Graph.graph();
      for (let n = 0; n < this.size - 1; n++) {
        graph.addLink(
          this.graphData.edges[n].source,
          this.graphData.edges[n].target
        );
        graph.addNode(n);
      }

      // specify where it should be rendered:
      var renderer = Viva.Graph.View.renderer(graph, {
        container: this.$refs["vivagraph-container"],
        graphics: Viva.Graph.View.webglGraphics(),
      });
      renderer.run();
    },
  },
};
</script>

<style scoped></style>
