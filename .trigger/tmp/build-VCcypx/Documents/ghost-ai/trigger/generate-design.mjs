import {
  logger,
  task
} from "../../../chunk-MSEQBWFO.mjs";
import "../../../chunk-5A54AS5L.mjs";
import {
  __name,
  init_esm
} from "../../../chunk-4DNCWKMJ.mjs";

// trigger/generate-design.ts
init_esm();
var generateDesign = task({
  id: "generate-design",
  maxDuration: 300,
  run: /* @__PURE__ */ __name(async (payload) => {
    const { projectId, prompt, canvasSnapshot } = payload;
    logger.info("Starting design generation", {
      projectId,
      prompt,
      existingNodes: canvasSnapshot.nodes.length,
      existingEdges: canvasSnapshot.edges.length
    });
    return { projectId, nodesAdded: 0, edgesAdded: 0 };
  }, "run")
});
export {
  generateDesign
};
//# sourceMappingURL=generate-design.mjs.map
