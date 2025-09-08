import type { Edge } from "./edge";
import { EdgeLoop } from "./edge-loop";
import { createAllEdges, createEdgeMap, findNextEdge } from "./edges";
import { createRemainingVerticesMap, findNextVertex } from "./vertices";

/**
 * Create all non-overlapping edge loops.
 *
 * @param nPolygonIndices - The n polygon indices.
 * @return  All non-overlapping edge loops.
 */
export function createAllEdgeLoops(nPolygonIndices: number[][]): EdgeLoop[] {
  const els: EdgeLoop[] = []; // egdeLoops
  const allEdges = createAllEdges(nPolygonIndices);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  const edgeMap = createEdgeMap(allEdges);
  for (let i = 0, l = allEdges.length; i < l; i++) {
    let edge = allEdges[i];
    if (edge.checked) continue;
    edge.checked = true;
    const firstV1 = edge.v1; // firstVertex1
    const firstV2 = edge.v2; // firstVertex2
    const vertices = [firstV1, firstV2];
    let opened = true;
    for (let n = 0; n < 2; n++) {
      let v1 = n === 0 ? firstV1 : firstV2; // vertex1
      let v2 = n === 0 ? firstV2 : firstV1; // vertex2
      const lastV = n === 0 ? firstV1 : firstV2; // lastVertex
      while (opened) {
        const v3 = findNextVertex(remainingVerticesMap, v1, v2); // vertex3
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

  const closedEls1 = els.filter((el) => el.closed); // closedEdgeLoops1
  const closedEls2: EdgeLoop[] = []; // closedEdgeLoops2
  const strings: string[] = []; // [JSON.stringify(el.vertices.toSorted()) for el in closedEls2]
  els
    .filter((el) => !el.closed)
    .forEach((openEl) => {
      const firstV1 = openEl.vertices[0];
      const firstV2 = openEl.vertices[1];
      const vss = remainingVerticesMap[`${firstV1},${firstV2}`]; // vertices's
      vss.forEach((vs) => {
        if (vs.length !== 2) return;
        let v1 = firstV1; // vertex1
        let v2 = firstV2; // vertex2
        const vertices = [v1, v2];
        const e1_0 = edgeMap[`${v1},${vs[0]}`]; // edge1_0
        const e2_1 = edgeMap[`${v2},${vs[1]}`]; // edge2_1
        const e1_1 = edgeMap[`${v1},${vs[1]}`]; // edge1_1
        const e2_0 = edgeMap[`${v2},${vs[0]}`]; // edge2_0
        let e1: Edge; // edge1
        let e2: Edge; // edge2
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
          const e3 = findNextEdge(remainingVerticesMap, e1, e2); // edge3
          if (e3 === null) break;
          let v3: number; // vertex3
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
            const s = JSON.stringify(vertices.toSorted()); // string
            if (strings.includes(s)) break;
            strings.push(s);
            const el = new EdgeLoop(vertices, true); // edgeLoop
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
 * @param els - Edge loops of the geometry.
 * @return  The edge loops map. The key is a string of pairs v1, v2.
 */
export function createEdgeLoopsMap(els: EdgeLoop[]): {
  [k: string]: EdgeLoop[];
} {
  const map: { [k: string]: EdgeLoop[] } = {};
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
