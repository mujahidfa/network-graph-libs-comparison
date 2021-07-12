<template>
  <select v-model="rendererType" class="p-2 mb-2 border">
    <option value="webgl">WebGL</option>
    <option value="canvas">Canvas</option>
    <option value="svg">SVG</option>
  </select>
  <div
    id="sigma-container"
    ref="sigma-container"
    style="height: 90vh; width: 80vw; border: 1px solid blue"
  ></div>
</template>

<script>
let sigmaInstance;

export default {
  data() {
    return {
      rendererType: "webgl",
      sigmaInstance: null,
      timeout: null,
    };
  },
  props: {
    size: Number,
    graphData: Object,
  },
  watch: {
    size: function () {
      // this.createGraph();
      clearTimeout(this.timeout);
      let instance = Object.assign({}, this.graphInstance); // JSON.parse(JSON.stringify(this.graphInstance));
      // instance.kill();
      sigmaInstance.kill();
      this.testGraph();
    },
    rendererType: function () {
      // this.graphInstance.kill();
      clearTimeout(this.timeout);
      sigmaInstance.kill();
      this.testGraph();
    },
  },
  mounted() {
    // this.createGraph();
    this.testGraph();
  },
  methods: {
    testGraph() {
      // Initialise sigma:
      var s = new sigma({
        renderer: {
          container: this.$refs["sigma-container"],
          type: this.rendererType,
        },
        settings: {
          // edgeLabelSize: "proportional",
          minArrowSize: 10,
        },
      });

      // Generate a random graph:
      var nbNode = this.size;
      var nbEdge = this.size;
      var graph = {
        nodes: [],
        edges: [],
      };

      let colors = ["#FCA5A5", "#93C5FD", "#6EE7B7", "#FDE047"];
      for (let i = 0; i < nbNode; i++)
        graph.nodes.push({
          id: i,
          // label: "Node " + i,
          x: Math.random(),
          y: Math.random(),
          size: 1,
          color: colors[Math.floor(Math.random() * Math.floor(colors.length))],
        });

      for (let i = 0; i < nbEdge; i++)
        graph.edges.push({
          id: i,
          label: "Edge " + i,
          source: (Math.random() * nbNode) | 0,
          target: (Math.random() * nbNode) | 0,
          color: "#00000",
          type: "curvedArrow",
          size: 1,
        });

      // load the graph
      s.graph.read(graph);

      // listen for single node drags
      let dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

      // draw the graph
      s.refresh();

      // var config = {
      //   nodeMargin: 3.0,
      //   scaleNodes: 1.3,
      // };

      // // Configure the algorithm
      // var listener = s.configNoverlap(config);

      // // Bind all events:
      // listener.bind("start stop interpolate", function (event) {
      //   console.log(event.type);
      // });

      // // Start the algorithm:
      // s.startNoverlap();

      // launch force-atlas for 5sec
      // s.configForceAtlas2({
      //   scalingRatio: 1,
      // });
      s.startForceAtlas2();
      this.timeout = setTimeout(function () {
        s.killForceAtlas2();
      }, 10000);

      sigmaInstance = s;
    },
    createGraph() {
      let s = new sigma({
        renderer: {
          container: this.$refs["sigma-container"],
          type: this.rendererType,
        },
        settings: {
          // edgeLabelSize: "proportional",
          minArrowSize: 10,
          minNodeSize: 10,
        },
      });
      let data = JSON.parse(JSON.stringify(this.graphData));
      // console.log(data);
      // console.log(graphDatas);
      // Load the graph in sigma
      s.graph.read(data);
      // Ask sigma to draw it
      s.refresh();

      // launch force-atlas for 5sec
      s.startForceAtlas2();
      this.timeout = setTimeout(function () {
        s.killForceAtlas2();
      }, 10000);
    },
  },
};
</script>

<style scoped>
/* #sigma-container {
  width: 500px;
  height: 500px;
} */
</style>
