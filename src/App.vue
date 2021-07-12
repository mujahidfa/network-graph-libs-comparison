<template>
  <nav class="flex justify-center space-x-4">
    <router-link to="/">Home</router-link>
    <router-link to="/Cytoscape">Cytoscape</router-link>
    <router-link to="/Vis">Vis.js</router-link>
    <router-link to="/D3">D3</router-link>
    <router-link to="/Sprite">Sprite</router-link>
    <router-link to="/Vivagraph">VivaGraph</router-link>
    <router-link to="/Stardust">Stardust</router-link>
    <router-link to="/ForceGraph">force-graph</router-link>
  </nav>
  <div class="flex items-center justify-center pb-4 space-x-2">
    <label for="node-size" class="block font-medium text-gray-700"
      >Number of nodes:</label
    >
    <div class="mt-1">
      <input
        type="number"
        name="node-size"
        id="node-size"
        v-model.lazy.number="nodeSize"
        class="block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  </div>
  <div class="flex flex-col items-center">
    <router-view v-slot="{ Component }" :size="nodeSize" :graphData="graphData">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import { colors } from "./constants.js";

export default {
  data() {
    return {
      progress: 0,
      nodeSize: 10,
      graphData: {},
      // cytoscapeData: {},
      // visData: {},
      // d3Data: {},
      // spriteData: {},
      nodeTypes: ["Account", "Entity", "STR", "Contact"],
      edgeTypes: [
        "IS_STR",
        "HAS_CONTACT",
        "IS_EMPLOYER",
        "IS_PCT",
        "IS_SIGNATORY",
      ],
    };
  },
  watch: {
    nodeSize: function (oldSize, newSize) {
      this.createGraphData();
    },
  },
  mounted() {
    this.createGraphData();
  },
  methods: {
    createGraphData() {
      let seedNodes = [];
      let seedEdges = [];
      let size = this.nodeSize;
      for (let id = 0; id < size; id++) {
        let nodeType = this.getRandomNodeType();

        let N = 1000;

        seedNodes.push({
          id: id,
          label: nodeType,
          type: nodeType,
          color: this.nodeColor(nodeType),
          x: 100 * Math.cos((2 * id * Math.PI) / N),
          y: 100 * Math.sin((2 * id * Math.PI) / N),
        });

        let sourceId = this.getRandomInt(size);
        let targetId = this.getRandomInt(size);
        seedEdges.push({
          id: id,
          // cytoscape & sprite
          source: sourceId,
          target: targetId,

          // Vis.js
          from: sourceId,
          to: targetId,
          label: this.getRandomEdgeType(),
          type: this.getRandomEdgeType(),
        });
      }

      this.graphData = {
        nodes: seedNodes,
        edges: seedEdges,
      };
    },
    nodeColor(label) {
      switch (label) {
        case "Entity":
          return colors.blue;
        case "STR":
          return colors.red;
        case "Contact":
          return colors.green;
        case "Account":
          return colors.yellow;
        default:
          return "black";
      }
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    getRandomNodeType() {
      let index = this.getRandomInt(this.nodeTypes.length);

      return this.nodeTypes[index];
    },
    getRandomEdgeType() {
      let index = this.getRandomInt(this.edgeTypes.length);

      return this.edgeTypes[index];
    },
  },
};
</script>

<style>
.router-link-active {
  @apply text-green-600 underline;
}
</style>
