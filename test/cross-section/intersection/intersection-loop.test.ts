import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import {
  IntersectionLoop,
  type IntersectionLoopJSON,
} from "src/cross-section/intersection/intersection-loop";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("IntersectionLoop", () => {
  test("constructor()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    expect(il.intersections).toEqual(intersections);
    expect(il.closed).toBe(true);
  });

  test("getPoints()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(il.getPoints(positions)).toEqual([
      new THREE.Vector3(
        3 + (9 - 3) * 0.5,
        4 + (10 - 4) * 0.5,
        5 + (11 - 5) * 0.5
      ),
      new THREE.Vector3(
        0 + (9 - 0) * 0.75,
        1 + (10 - 1) * 0.75,
        2 + (11 - 2) * 0.75
      ),
      new THREE.Vector3(6, 7, 8),
    ]);
  });

  test("clone()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il1 = new IntersectionLoop(intersections, true);
    const il2 = il1.clone();
    expect(il1).toEqual(il2);
  });

  test("copy()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il1 = new IntersectionLoop(intersections, true);
    const il2 = new IntersectionLoop().copy(il1);
    expect(il1).toEqual(il2);
  });

  const _json: IntersectionLoopJSON = {
    intersections: [
      {
        type: "EdgeIntersection",
        bottomV: 1,
        topV: 3,
        u: 0.5,
        checked: true,
      },
      {
        type: "EdgeIntersection",
        bottomV: 0,
        topV: 3,
        u: 0.75,
        checked: true,
      },
      {
        type: "VertexIntersection",
        v: 2,
        checked: true,
      },
    ],
    closed: true,
  };

  test("toJSON()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const json1 = new IntersectionLoop(intersections, true).toJSON();
    const json2: IntersectionLoopJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const il1 = new IntersectionLoop().fromJSON(_json);
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il2 = new IntersectionLoop(intersections, true);
    expect(il1).toEqual(il2);
  });
});
