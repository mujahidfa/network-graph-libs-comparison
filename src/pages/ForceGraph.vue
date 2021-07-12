<template>
  <div style="height: 90vh; width: 80vw; border: 1px solid blue">
    <div ref="force-graph-container"></div>
  </div>
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
  methods: {
    createGraph() {
      // Random tree
      const N = this.size;
      // const gData = {
      //   nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      //   links: [...Array(N).keys()]
      //     .filter((id) => id)
      //     .map((id) => ({
      //       label:
      //       source: id,
      //       target: Math.round(Math.random() * (id - 1)),
      //     })),
      // };

      const Graph = ForceGraph()(this.$refs["force-graph-container"])
        // .linkDirectionalArrowLength(5)
        // .linkCurvature(1)
        .graphData({
          nodes: this.graphData.nodes,
          links: this.graphData.edges,
        })
        .cooldownTicks(100)
        .nodeLabel("label")
        .linkCanvasObjectMode(() => "after")
        .linkCanvasObject((link, ctx) => {
          const MAX_FONT_SIZE = 4;
          const LABEL_NODE_MARGIN = Graph.nodeRelSize() * 1.5;

          const start = link.source;
          const end = link.target;

          // ignore unbound links
          if (typeof start !== "object" || typeof end !== "object") return;

          // calculate label positioning
          const textPos = Object.assign(
            ...["x", "y"].map((c) => ({
              [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
            }))
          );

          const relLink = { x: end.x - start.x, y: end.y - start.y };

          const maxTextLength =
            Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
            LABEL_NODE_MARGIN * 2;

          let textAngle = Math.atan2(relLink.y, relLink.x);
          // maintain label vertical orientation for legibility
          if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
          if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

          const label = `${link.label} > `;

          // estimate fontSize to fit in link length
          ctx.font = "1px Sans-Serif";
          const fontSize = Math.min(
            MAX_FONT_SIZE,
            maxTextLength / ctx.measureText(label).width
          );
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding

          // draw text label (with background rect)
          ctx.save();
          ctx.translate(textPos.x, textPos.y);
          ctx.rotate(textAngle);

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            -bckgDimensions[0] / 2,
            -bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "darkgrey";
          ctx.fillText(label, 0, 0);
          ctx.restore();
        });

      Graph.d3Force("center", null);

      // fit to canvas when engine stops
      Graph.onEngineStop(() => Graph.zoomToFit(400));
    },
  },
  mounted() {
    this.createGraph();
  },
};
</script>
