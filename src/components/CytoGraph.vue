<template>
  <div>
    <div
      ref="cy"
      id="cy"
      style="height: 90vh; width: 80vw; border: 1px solid blue"
    ></div>
  </div>
</template>

<script>
// import cytoscape from "https://unpkg.com/cytoscape@3.17.0/dist/cytoscape.esm.min.js";
// import cola from "https://cdn.jsdelivr.net/npm/cytoscape-cola@2.4.0/cytoscape-cola.min.js";
import cola from "cytoscape-cola";
import euler from "cytoscape-euler";
import klay from "cytoscape-klay";
import fcose from "cytoscape-fcose";
import spread from "cytoscape-spread";
// import noOverlap from "cytoscape-no-overlap";
import { colors } from "../constants";

export default {
  props: {
    size: Number,
    nodes: {
      type: Array,
      required: true,
    },
    edges: {
      type: Array,
      required: true,
    },
  },
  watch: {
    nodes: function () {
      this.createGraph();
    },
    edges: function () {
      this.createGraph();
    },
  },
  methods: {
    createGraph() {
      let self = this;
      cytoscape.use(cola);
      cytoscape.use(euler);
      cytoscape.use(klay);
      cytoscape.use(fcose);
      cytoscape.use(spread);
      // cytoscape.use(noOverlap);
      // cyspringy(cytoscape);
      // cytoscape.use(cyspringy);

      let cy = cytoscape({
        container: this.$refs.cy, // container to render in
        // randomize: true,
        headless: false,
        elements: {
          nodes: this.nodes,
          edges: this.edges,
        },
        style: [
          // the stylesheet for the graph
          {
            selector: "node",
            style: {
              "background-color": "#666",
              "background-color": (node) => {
                switch (node.data("label")) {
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
              label: "data(id)",
              "text-valign": "center",
              "text-halign": "center",
              height: "60px",
              width: "60px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(label)",
              padding: "50px",
            },
          },
          {
            selector: "edge[label]",
            css: {
              "text-rotation": "autorotate",
              "text-margin-x": "0px",
              "text-margin-y": "0px",
              "text-background-opacity": 1,
              "text-background-color": "white",
            },
          },
        ],
        layout: {
          // name: "grid",
          name: self.size < 100 ? "cola" : "cose",
          animate: self.size < 100 ? true : false,
          infinite: self.size < 100 ? true : false,
          edgeLength: 190,
          // randomize: true,
          // fit: true,
          // nodeDimensionsIncludeLabels: true,
          // edgeLength: 200,
        },
      });

      cy.on("mouseover", "node", function (event) {
        // var node = event.cyTarget;
        // console.log(event.target["_private"].data);
        // self.$emit("node-hover", event.target["_private"].data);
      });
      cy.on("mouseout", "node", function (event) {
        // var node = event.cyTarget;
        // console.log(event.target["_private"].data);
        // self.$emit("node-hover", { id: "", label: "" });
      });
      cy.on("mouseover", "edge", function (event) {
        // var node = event.cyTarget;
        // console.log(event.target["_private"].data);
        // self.$emit("edge-hover", event.target["_private"].data);
      });
      cy.on("mouseout", "edge", function (event) {
        // self.$emit("edge-hover", { source: "", target: "", label: "" });
      });
    },
  },
  mounted() {
    this.createGraph();
  },
};
</script>

<style scoped></style>
