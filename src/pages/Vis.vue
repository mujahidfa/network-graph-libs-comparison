<template>
  <div>
    <button v-if="progress >= 100" @click="reset" class="border">reset</button>
    <div v-if="progress < 100" class="flex items-center justify-center">
      <progress :value="progress" max="100">
        {{ progress }}
      </progress>
    </div>
  </div>

  <div
    id="visnetwork"
    ref="visnetwork"
    style="height: 90vh; width: 80vw; border: 1px solid blue"
  ></div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
      hiddenNodesId: [],
      nodes: null,
    };
  },
  props: {
    size: Number,
    graphData: Object,
  },
  computed: {
    graphLoadingStyle() {
      return this.progress < 100 ? "hidden" : "";
    },
  },
  watch: {
    size: function () {
      this.progress = 0;
      this.createGraph();
    },
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    createGraph() {
      let self = this;
      let seedNodes = this.graphData.nodes;
      let seedEdges = this.graphData.edges;
      // let size = this.size;
      // for (let p = 0; p < size; p++) {
      //   seedNodes.push({
      //     id: p,
      //     label: `Node ${p}`,
      //     color: p % 2 === 0 ? "blue" : "red",
      //     name: `name${p}`,
      //     hidden: false,
      //   });

      //   seedEdges.push({
      //     from: this.getRandomInt(size),
      //     to: p, //this.getRandomInt(size),
      //   });
      // }

      // seedEdges.push({
      //   from: 9, //this.getRandomInt(size),
      //   to: 1, //this.getRandomInt(size),
      //   // arrows: {
      //   //   to: {
      //   //     enabled: true,
      //   //   },
      //   // },
      // });

      // create an array with nodes
      let nodes = new vis.DataSet(seedNodes);
      this.nodes = nodes;
      // create an array with edges
      let edges = new vis.DataSet(seedEdges);

      // create a network
      let container = this.$refs.visnetwork;
      let data = {
        nodes: nodes,
        edges: edges,
      };
      let options = {
        // manipulation: {
        //   enabled: true,
        //   deleteNode: true,
        // },
        interaction: {
          hideEdgesOnDrag: this.size > 150 ? true : false,
        },
        nodes: {
          shape: "circle",
        },
        edges: {
          arrows: {
            to: {
              enabled: true,
            },
          },
          color: "lightblue",
          font: { align: "middle" },
          length: 200,
          smooth: {
            enabled: false,
            // type: "dynamic",
            // roundness: 0.5,
          },
        },
        physics: {
          enabled: this.size > 1000 ? false : true,
          // solver: "repulsion",
          // solver: "barnesHut",
          solver: "forceAtlas2Based",
          adaptiveTimestep: true,
          // barnesHut: {
          //   gravitationalConstant: -8000,
          //   springConstant: 0.04,
          //   springLength: 95,
          // },
          stabilization: {
            enabled: true,
            iterations: 3000,
            updateInterval: 10,
          },
        },
        layout: {
          improvedLayout: this.size > 150 ? false : true,
          randomSeed: 10,
        },
        // interaction: { hover: true },
        // hideEdgesOnDrag: this.size > 150 ? false : true,
      };
      let network = new vis.Network(container, data, options);
      // network.on("hoverNode", function (e) {
      //   console.log(seedNodes.filter((node) => node.id === e.node)[0].name);
      // });
      network.on("click", function (e) {});
      network.on("doubleClick", function (e) {
        // console.log(e);
        // console.log(seedNodes.filter((node) => node.id === e.node)[0].name);

        // If clicked element is a node, hide it
        if (e.nodes.length > 0) {
          let clickedNodeId = e.nodes[0];
          self.hiddenNodesId.push(clickedNodeId);
          nodes.update({
            id: clickedNodeId,
            hidden: true,
          });
        }
        // clicked element is an edge
        else {
        }
      });

      network.on("stabilizationProgress", function (params) {
        // console.log({ params });
        self.progress = Math.trunc((params.iterations / params.total) * 100);
        // document.getElementById("bar").style.width = width + "px";
        // document.getElementById("text").innerHTML =
        //   Math.round(widthFactor * 100) + "%";
      });
      network.once("stabilizationIterationsDone", function () {
        // document.getElementById("text").innerHTML = "100%";
        // document.getElementById("bar").style.width = "496px";
        // document.getElementById("loadingBar").style.opacity = 0;
        // // really clean the dom element
        // setTimeout(function () {
        //   document.getElementById("loadingBar").style.display = "none";
        // }, 500);
        self.progress = 100;
        network.fit();
      });
    },
    reset() {
      this.hiddenNodesId.forEach((nodeId) => {
        this.nodes.update({
          id: nodeId,
          hidden: false,
        });
      });
      this.hiddenNodesId = [];
    },
  },
  mounted() {
    this.createGraph();
  },
};
</script>

<style scoped></style>
