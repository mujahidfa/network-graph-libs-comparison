<template>
  <!-- <div class="flex justify-center pb-2 space-x-4">
    <p>Edges:</p>
    <button
      type="button"
      v-for="(type, index) in edgeTypes"
      :key="index"
      @click="toggleEdgeVisibility(type)"
      class="inline-flex items-center px-6 text-base font-medium border border-transparent rounded-md focus:outline-none hover:ring hover:ring-offset-2"
      :class="
        isEdgeToggled[type]
          ? 'text-white bg-gray-300'
          : 'text-indigo-700 bg-indigo-100'
      "
    >
      {{ type }}
    </button>
  </div>
  <div class="flex justify-center pb-2 space-x-4">
    <p>Nodes:</p>
    <button
      type="button"
      v-for="(type, index) in nodeTypes"
      :key="index"
      @click="toggleNodeVisibility(type)"
      class="inline-flex items-center px-6 text-base font-medium border border-transparent rounded-md focus:outline-none hover:ring hover:ring-offset-2"
      :class="nodeButtonStyles(type)"
    >
      {{ type }}
    </button>
  </div> -->
  <cyto-graph
    :nodes="nodes"
    :edges="edges"
    @node-hover="printHoveredNode"
    @edge-hover="printHoveredEdge"
    :size="size"
  />
  <!-- <div class="flex space-x-2">
    <button
      type="button"
      class="inline-flex items-center px-6 text-base font-medium border border-transparent rounded-md focus:outline-none hover:ring hover:ring-offset-2"
      :class="nodeButtonStyles(hoveredNode.type)"
    >
      {{ hoveredNode.type }}
    </button>
    <span>{{ hoveredNode.value }}</span>
  </div>
  <div class="flex space-x-2">
    <span>{{ hoveredEdge.source }}</span>
    <button
      type="button"
      class="inline-flex items-center px-6 text-base font-medium text-gray-800 bg-gray-300 border border-transparent rounded-md focus:outline-none hover:ring hover:ring-offset-2"
    >
      {{ hoveredEdge.type }}
    </button>
    <span>{{ hoveredEdge.target }}</span>
  </div> -->
</template>

<script>
import CytoGraph from "../components/CytoGraph.vue";

export default {
  components: { CytoGraph },
  data() {
    return {
      nodes: [],
      edges: [],
      originalNodes: [],
      originalEdges: [],
      nodeTypes: ["Account", "Entity", "STR", "Contact"],
      edgeTypes: [
        "IS_STR",
        "HAS_CONTACT",
        "IS_EMPLOYER",
        "IS_PCT",
        "IS_SIGNATORY",
      ],
      isNodeToggled: {
        Account: false,
        Entity: false,
        STR: false,
        Contact: false,
      },
      isEdgeToggled: {
        IS_STR: false,
        HAS_CONTACT: false,
        IS_EMPLOYER: false,
        IS_PCT: false,
        IS_SIGNATORY: false,
      },
      hoveredNode: {
        type: "",
        value: "",
      },
      hoveredEdge: {
        type: "",
        source: "",
        target: "",
      },
    };
  },
  props: {
    size: Number,
    graphData: Object,
  },
  watch: {
    size: function () {
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
      let size = this.size;
      for (let p = 0; p < size; p++) {
        seedNodes.push({
          data: { id: p, label: this.getRandomNodeType() },
        });

        seedEdges.push({
          data: {
            source: this.getRandomInt(size),
            target: this.getRandomInt(size),
            label: this.getRandomEdgeType(),
          },
        });
      }

      this.nodes = seedNodes;
      this.edges = seedEdges;
      this.originalNodes = seedNodes;
      this.originalEdges = seedEdges;
    },
    printHoveredNode(node) {
      this.hoveredNode.type = node.type;
      this.hoveredNode.value = node.id;
    },
    printHoveredEdge(edge) {
      this.hoveredEdge.type = edge.type;
      this.hoveredEdge.source = edge.source;
      this.hoveredEdge.target = edge.target;
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
    toggleEdgeVisibility(edgeType) {
      if (this.isEdgeToggled[edgeType]) {
        this.edges = [
          ...this.edges,
          ...this.originalEdges.filter((edge) => edge.data.type === edgeType),
        ];
      } else {
        this.edges = this.edges.filter((edge) => edge.data.type !== edgeType);
      }
      this.isEdgeToggled[edgeType] = !this.isEdgeToggled[edgeType];
    },
    toggleNodeVisibility(nodeType) {
      if (this.isNodeToggled[nodeType]) {
        this.nodes = [
          ...this.nodes,
          ...this.originalNodes.filter((node) => node.data.type === nodeType),
        ];
        this.edges = [...this.edges, ...this.getHiddenEdges(nodeType)];
      } else {
        // this.nodes = this.nodes.filter((node) => node.data.type !== nodeType);
        this.hideNodes(nodeType);
      }
      this.isNodeToggled[nodeType] = !this.isNodeToggled[nodeType];
    },
    getHiddenEdges(nodeType) {
      return this.originalEdges.filter((edge) =>
        this.isEdgeInNodes(edge, this.nodes)
      );
    },
    hideNodes(nodeType) {
      // get all nodes with type === nodeType
      let nodes = this.nodes.filter((node) => node.data.type === nodeType);
      console.log({ nodes });

      // get all edges with source or target node
      let edges = this.edges.filter((edge) => this.isEdgeInNodes(edge, nodes));
      console.log({ edges });

      // hide edges with source or target node
      this.edges = this.edges.filter((edge) => !edges.includes(edge));

      // hide nodes
      this.nodes = this.nodes.filter((node) => node.data.type !== nodeType);
    },
    isEdgeInNodes(edge, nodes) {
      for (let node of nodes) {
        if (
          node.data.id === edge.data.source ||
          node.data.id === edge.data.target
        ) {
          return true;
        }
      }
      return false;
    },
    getNodesWithType(nodeType) {
      return;
    },
    getEdgesWithNode(node) {
      return this.edges.filter(
        (edge) =>
          edge.data.source === node.data.id || edge.data.target === node.data.id
      );
    },
    nodeButtonStyles(type) {
      let colors = {
        Account: "bg-yellow-300 text-yellow-900",
        Entity: "bg-blue-300 text-blue-900",
        STR: "bg-red-300 text-red-900",
        Contact: "bg-green-300 text-green-900",
      };
      if (!colors[type]) {
        return "";
      }
      return this.isNodeToggled[type] ? "text-white bg-gray-300" : colors[type];
    },
  },
};
</script>
