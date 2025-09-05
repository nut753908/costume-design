import { EdgeLoopStack } from "./edge-loop-stack.js";
import { createAllEdgeLoops, createEdgeLoopsMap } from "./edge-loops.js";
import { createRemainingVerticesMap } from "./vertices.js";
import { Edge } from "./edge.js";
import { findNextEdge } from "./edges.js";

/**
 * conditions:
 * - `nPolygonIndices` is set from the base geometry
 * - `if (vertices.length === 1) continue;` exist
 * - `if (strings.includes(s)) continue;` exist
 *
 *
 * all:
 *
 * stacks[ 0]: ○ torso in y direction
 * stacks[ 1]: △ left shoulder and left arm (containing ／)
 * stacks[ 2]: ○ left shoulder (containing /)
 * stacks[ 3]: × neck and left shoulder
 * stacks[ 4]: × center of head and torso in x direction
 * stacks[ 5]: ○ left arm (containing ／)
 * stacks[ 6]: ○ left leg
 * stacks[ 7]: ○ neck
 * stacks[ 8]: × neck and right shoulder
 * stacks[ 9]: △ left foot in y direction
 * stacks[10]: ○ left foot in z direction
 * stacks[11]: × left middle finger and left ring finger
 * stacks[12]: ○ left middle finger
 * stacks[13]: × left index finger and left middle finger
 * stacks[14]: ○ left index finger
 * stacks[15]: × left ring finger and left little finger
 * stacks[16]: ○ left ring finger
 * stacks[17]: ○ left little finger
 * stacks[18]: ○ left thumb
 * stacks[19]: × ear height in y direction
 * stacks[20]: × ear height in y direction (doubling)
 * stacks[21]: △ front of the head in z direction
 * stacks[22]: △ top of the head in y direction
 * stacks[23]: × left ear (doubling)
 * stacks[24]: △ left ear
 * stacks[25]: △ right shoulder and right arm (containing ＼)
 * stacks[26]: ○ right shoulder (containing \)
 * stacks[27]: ○ right arm (containing ＼)
 * stacks[28]: ○ right leg
 * stacks[29]: △ right foot in y direction
 * stacks[30]: ○ right foot in z direction
 * stacks[31]: × right middle finger and right ring finger
 * stacks[32]: ○ right middle finger
 * stacks[33]: × right index finger and right middle finger
 * stacks[34]: ○ right index finger
 * stacks[35]: × right ring finger and right little finger
 * stacks[36]: ○ right ring finger
 * stacks[37]: ○ right little finger
 * stacks[38]: ○ right thumb
 * stacks[39]: × right ear (doubling)
 * stacks[40]: △ right ear
 * stacks[41]: × left torso and left leg in x direction
 * stacks[42]: × center of the body in z direction
 * stacks[43]: × chest height in y direction
 * stacks[44]: × inside the lower body
 * stacks[45]: × outside of left foot
 * stacks[46]: ○ base of left thumb
 * stacks[47]: ○ left wrist
 * stacks[48]: △ left arm (containing /)
 * stacks[49]: × center of the head in z direction
 * stacks[50]: △ back of the head in z direction
 * stacks[51]: × right torso and right leg in x direction
 * stacks[52]: × outside of right foot
 * stacks[53]: ○ base of right thumb
 * stacks[54]: ○ right wrist
 * stacks[55]: △ right arm (containing \)
 *
 *
 * combinations in ○ list:
 *
 * stacks[ 0]: ○ torso in y direction
 * stacks[ 7]: ○ neck
 *
 * stacks[ 2]: ○ left shoulder (containing /)
 * stacks[ 5]: ○ left arm (containing ／)
 * stacks[47]: ○ left wrist
 *
 * stacks[26]: ○ right shoulder (containing \)
 * stacks[27]: ○ right arm (containing ＼)
 * stacks[54]: ○ right wrist
 *
 * stacks[18]: ○ left thumb
 * stacks[46]: ○ base of left thumb
 *
 * stacks[38]: ○ right thumb
 * stacks[53]: ○ base of right thumb
 *
 *
 * singles in ○ list:
 *
 * stacks[ 6]: ○ left leg
 * stacks[10]: ○ left foot in z direction
 * stacks[12]: ○ left middle finger
 * stacks[14]: ○ left index finger
 * stacks[16]: ○ left ring finger
 * stacks[17]: ○ left little finger
 * stacks[28]: ○ right leg
 * stacks[30]: ○ right foot in z direction
 * stacks[32]: ○ right middle finger
 * stacks[34]: ○ right index finger
 * stacks[36]: ○ right ring finger
 * stacks[37]: ○ right little finger
 *
 *
 * combinations for torso extension:
 *
 * stacks[ 6]: ○ left leg
 * stacks[28]: ○ right leg
 */

/**
 * Create all non-overlapping edge loop stacks.
 *
 * @param {Array<Array<number>>} nPolygonIndices - The n polygon indices.
 * @returns {Array<EdgeLoopStack>} All non-overlapping edge loop stacks.
 */
export function createAllEdgeLoopStacks(nPolygonIndices) {
  const stacks = []; // edgeLoopStacks
  const strings = []; // [JSON.stringify(stack.vertices.toSorted()) for stack in stacks]
  const allEls = createAllEdgeLoops(nPolygonIndices);
  const remainingVerticesMap = createRemainingVerticesMap(nPolygonIndices);
  const elsMap = createEdgeLoopsMap(allEls);
  for (let i = 0, l = allEls.length; i < l; i++) {
    const el = allEls[i]; // edgeLoop
    if (!el.closed) continue;
    for (let j = 0, l2 = el.vertices.length; j < l2; j++) {
      const vertices = [el.vertices];
      const firstE = new Edge(
        el.vertices[j],
        el.vertices[j !== l2 - 1 ? j + 1 : 0]
      ); // firstEdge
      let secondE = null; // secondEdge
      let opened = true;
      for (let n = 0; n < 2; n++) {
        let e1 = secondE; // edge1
        let e2 = firstE; // edge2
        while (opened) {
          const e3 = findNextEdge(remainingVerticesMap, e1, e2); // edge3
          if (e3 === null) break;
          if (secondE === null) secondE = e3;
          if (e3.equals(firstE)) {
            opened = false;
            break;
          }
          e1 = e2;
          e2 = e3;
          const els = elsMap[`${e3.v1},${e3.v2}`]; // edgeLoops
          if (els === undefined) break;
          const el2 = els.find(
            (v) => v.closed && el.vertices.length === v.vertices.length
          ); // edgeLoop2
          if (el2 === undefined) break;
          if (n === 0) vertices.push(el2.vertices);
          if (n === 1) vertices.unshift(el2.vertices);
        }
      }
      if (vertices.length === 1) continue;
      const s = JSON.stringify(vertices.toSorted()); // string
      if (strings.includes(s)) continue;
      strings.push(s);
      const stack = new EdgeLoopStack(vertices, !opened);
      stacks.push(stack);
    }
  }
  return stacks;
}
