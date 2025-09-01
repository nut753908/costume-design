import { EdgeLoop } from "./edge-loop.js";
import { createRemainingVerticesMap, findNextVertex } from "./vertices.js";
import { createAllEdges, createEdgeMap, findNextEdge } from "./edges.js";

/**
 * Create all non-overlapping edge loops.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<EdgeLoop>} All non-overlapping edge loops.
 */
export function createAllEdgeLoops(nPolygonIndices) {
  const els = []; // egdeLoops
  const allEdges = createAllEdges(nPolygonIndices);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  const edgeMap = createEdgeMap(allEdges);
  for (let i = 0, l = allEdges.length; i < l; i++) {
    let edge = allEdges[i];
    if (edge.checked) continue;
    edge.checked = true;
    const firstV1 = edge.v1;
    const firstV2 = edge.v2;
    const vertices = [firstV1, firstV2];
    let opened = true;
    for (let n = 0; n < 2; n++) {
      let v1 = n === 0 ? firstV1 : firstV2;
      let v2 = n === 0 ? firstV2 : firstV1;
      const lastV = n === 0 ? firstV1 : firstV2;
      while (opened) {
        const v3 = findNextVertex(remainingVerticesMap, v1, v2);
        if (v3 === null) break;
        v1 = v2;
        v2 = v3;
        edge = edgeMap[`${v1},${v2}`];
        edge.checked = true;
        if (v3 === lastV) {
          opened = false;
          break;
        }
        if (n === 0) vertices.push(v3);
        if (n === 1) vertices.unshift(v3);
      }
    }
    const el = new EdgeLoop(vertices, !opened);
    els.push(el);
  }

  // TODO: show all needed
  // TODO: lighten the processing
  const newClosedEls = [];
  const openEls = els.filter((el) => !el.closed);
  openEls.forEach((openEl) => (openEl.checked = false));
  openEls.forEach((openEl, i) => {
    if (openEl.checked) return;
    let closed = false;
    const firstV1 = openEl.vertices[0];
    const firstV2 = openEl.vertices[1];
    const vss = remainingVerticesMap[`${firstV1},${firstV2}`];
    vss.forEach((vs) => {
      if (closed) return;
      if (vs.length !== 2) return;
      const checkedList = openEls.map((v) => v.checked);
      checkedList[i] = true;
      let v1 = firstV1;
      let v2 = firstV2;
      const vertices1 = [v1, v2];
      const vertices2 = Array.from(openEl.vertices);
      const e1_0 = edgeMap[`${v1},${vs[0]}`];
      const e1_1 = edgeMap[`${v1},${vs[1]}`];
      const e2_0 = edgeMap[`${v2},${vs[0]}`];
      const e2_1 = edgeMap[`${v2},${vs[1]}`];
      let e1;
      let e2;
      if (e1_0 && e2_1) {
        e1 = e1_0;
        e2 = e2_1;
      } else if (e1_1 && e2_0) {
        e1 = e1_1;
        e2 = e2_0;
      } else {
        console.error(`\
!(e1_0 && e2_1) && !(e1_1 && e2_0)
- v1: ${v1}
- v2: ${v2}
- vs: ${JSON.stringify(vs)}
- e1_0: ${JSON.stringify(e1_0)}
- e1_1: ${JSON.stringify(e1_1)}
- e2_0: ${JSON.stringify(e2_0)}
- e2_1: ${JSON.stringify(e2_1)}
`);
        return;
      }
      while (true) {
        const e3 = findNextEdge(remainingVerticesMap, e1, e2);
        if (e3 === null) break;
        let v3;
        if (`${v2},${e3.v1}` in edgeMap) {
          v3 = e3.v1;
        } else if (`${v2},${e3.v2}` in edgeMap) {
          v3 = e3.v2;
        } else {
          console.error(`\
!(\`\${v2},\${e3.v1}\` in edgeMap) && !(\`\${v2},\${e3.v2}\` in edgeMap)
- v2: ${v2}
- e1: ${JSON.stringify(e1)}
- e2: ${JSON.stringify(e2)}
- e3: ${JSON.stringify(e3)}
`);
          break;
        }
        vertices1.push(v3);
        let found = false;
        for (let j = 0, l2 = openEls.length; j < l2; j++) {
          openEl = openEls[j];
          if (openEl.createVertexPairs().includes(`${v2},${v3}`)) {
            found = true;
            vertices2.push(...openEl.vertices);
            checkedList[j] = true;
            break;
          }
        }
        if (!found) {
          console.error("!found");
          break;
        }
        if (v3 === firstV1) {
          vertices1.pop(); // remove the last duplicate vertex
          const a = vertices1.toSorted();
          const b = [...new Set(vertices2)].toSorted();
          if (JSON.stringify(a) === JSON.stringify(b)) {
            const el = new EdgeLoop(vertices1, true, true);
            newClosedEls.push(el);
            openEls.forEach((v, j) => {
              if (checkedList[j]) v.checked = true;
            });
            closed = true;
          }
          break;
        }
        v1 = v2;
        v2 = v3;
        e1 = e2;
        e2 = e3;
      }
    });
  });
  const newEls = els.filter((el) => el.closed).concat(newClosedEls);
  return newEls;
}

/**
 * Create the edge map.
 *
 * @param {Array<EdgeLoop>} els - Edge loops of the geometry.
 * @returns {{[k:string]:EdgeLoop}} The edge loop map. The key is a string of pairs v1, v2.
 */
export function createEdgeLoopMap(els) {
  const map = {};
  els.forEach((el) => {
    for (let i = 0, l = el.vertices.length - 1; i < l; i++) {
      const v1 = el.vertices[i];
      const v2 = el.vertices[i + 1];
      map[`${v1},${v2}`] = el;
      map[`${v2},${v1}`] = el;
    }
    if (el.closed) {
      const v1 = el.vertices[el.vertices.length - 1];
      const v2 = el.vertices[0];
      map[`${v1},${v2}`] = el;
      map[`${v2},${v1}`] = el;
    }
  });
  return map;
}
