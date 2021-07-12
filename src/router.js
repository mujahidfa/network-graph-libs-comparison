import { createWebHistory, createRouter } from "vue-router";

import Home from "./pages/Home.vue";
import Cytoscape from "./pages/Cytoscape.vue";
import Vis from "./pages/Vis.vue";
import D3 from "./pages/D3.vue";
import Sprite from "./pages/Sprite.vue";
import Vivagraph from "./pages/Vivagraph.vue";
import Stardust from "./pages/Stardust.vue";
import ForceGraph from "./pages/ForceGraph.vue";

const history = createWebHistory();

const routes = [
  { path: "/", component: Home },
  { path: "/Cytoscape", component: Cytoscape },
  { path: "/Vis", component: Vis },
  { path: "/D3", component: D3 },
  { path: "/Sprite", component: Sprite },
  { path: "/Vivagraph", component: Vivagraph },
  { path: "/Stardust", component: Stardust },
  { path: "/ForceGraph", component: ForceGraph },
];

const router = createRouter({ history, routes });

export default router;
