<template>
  <div
    id="d3-graph"
    style="width: 90vw; height: 80vh; border: 1px solid blue"
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
      this.createGraph();
    },
  },
  mounted() {
    this.createGraph();
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    createGraph() {
      let nodes = [];
      let links = [];
      // let data = {
      //   nodes: [
      //     {
      //       id: 1,
      //       name: "A",
      //     },
      //     {
      //       id: 2,
      //       name: "B",
      //     },
      //   ],
      //   links: [
      //     {
      //       source: 1,
      //       target: 2,
      //     },
      //   ],
      // };

      // let size = this.size;
      // for (let p = 0; p < size; p++) {
      //   nodes.push({ id: p, name: p });

      //   links.push({
      //     source: this.getRandomInt(size),
      //     target: this.getRandomInt(size),
      //   });
      // }

      // let data = {
      //   nodes,
      //   links,
      // };

      let data = {
        nodes: this.graphData.nodes,
        links: this.graphData.edges,
      };

      // set the dimensions and margins of the graph
      let margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;
      // let width = 900;
      // let height = 900;

      // append the svg object to the body of the page
      var svg = d3
        .select("#d3-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Initialize the links
      var link = svg
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#aaa");

      // Initialize the nodes
      var node = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")
        .call(d3.drag().on("drag", dragged));

      function dragged(d) {
        (d.x = d3.event.x), (d.y = d3.event.y);
        d3.select(this).attr("cx", d.x).attr("cy", d.y);
        link
          .filter(function (l) {
            return l.source === d;
          })
          .attr("x1", d.x)
          .attr("y1", d.y);
        link
          .filter(function (l) {
            return l.target === d;
          })
          .attr("x2", d.x)
          .attr("y2", d.y);
      }

      // Let's list the force we wanna apply on the network
      var simulation = d3
        .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
        .force(
          "link",
          d3
            .forceLink() // This force provides links between nodes
            .id(function (d) {
              return d.id;
            }) // This provide  the id of a node
            .links(data.links) // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
        .on("end", ticked);

      // This function is run at each iteration of the force algorithm, updating the nodes position.
      function ticked() {
        link
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        node
          .attr("cx", function (d) {
            return d.x + 6;
          })
          .attr("cy", function (d) {
            return d.y - 6;
          });
      }
    },
  },
};
</script>
