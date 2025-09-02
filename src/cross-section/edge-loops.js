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

  const closedEls1 = els.filter((el) => el.closed);
  const closedEls2 = [];
  const strings = []; // [JSON.stringify(el.vertices.toSorted()) for el in closedEls2]
  els
    .filter((el) => !el.closed)
    .forEach((openEl) => {
      const firstV1 = openEl.vertices[0];
      const firstV2 = openEl.vertices[1];
      const vss = remainingVerticesMap[`${firstV1},${firstV2}`];
      vss.forEach((vs) => {
        if (vs.length !== 2) return;
        let v1 = firstV1;
        let v2 = firstV2;
        const vertices = [v1, v2];
        const e1_0 = edgeMap[`${v1},${vs[0]}`];
        const e2_1 = edgeMap[`${v2},${vs[1]}`];
        const e1_1 = edgeMap[`${v1},${vs[1]}`];
        const e2_0 = edgeMap[`${v2},${vs[0]}`];
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
          if (v3 === firstV1) {
            const s = JSON.stringify(vertices.toSorted());
            if (strings.includes(s)) break;
            strings.push(s);
            const el = new EdgeLoop(vertices, true);
            closedEls2.push(el);
            break;
          }
          vertices.push(v3);
          v1 = v2;
          v2 = v3;
          e1 = e2;
          e2 = e3;
        }
      });
    });
  return closedEls1.concat(closedEls2);
}

/**
 * Create the edge loops map.
 *
 * @param {Array<EdgeLoop>} els - Edge loops of the geometry.
 * @returns {{[k:string]:Array<EdgeLoop>}} The edge loops map. The key is a string of pairs v1, v2.
 */
export function createEdgeLoopsMap(els) {
  const map = {};
  els.forEach((el) => {
    for (let i = 0, l = el.vertices.length - 1; i < l; i++) {
      const v1 = el.vertices[i];
      const v2 = el.vertices[i + 1];
      [`${v1},${v2}`, `${v2},${v1}`].forEach((k) => {
        k in map ? map[k].push(el) : (map[k] = [el]);
      });
    }
    if (el.closed) {
      const v1 = el.vertices[el.vertices.length - 1];
      const v2 = el.vertices[0];
      [`${v1},${v2}`, `${v2},${v1}`].forEach((k) => {
        k in map ? map[k].push(el) : (map[k] = [el]);
      });
    }
  });
  return map;
}
