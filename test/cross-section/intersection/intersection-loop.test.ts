import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import {
  IntersectionLoop,
  type IntersectionLoopJSON,
} from "src/cross-section/intersection/intersection-loop";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
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

  test("bottomVs()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new EdgeIntersection(0, 4, 0.25, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    expect(il.bottomVs).toEqual([1, 0, 2]);
  });

  test("topVs()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new EdgeIntersection(0, 4, 0.25, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    expect(il.topVs).toEqual([3, 4, 2]);
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

  describe("inLoop()", () => {
    describe("cube example", () => {
      const array = [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
        [0, 1, 0],
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1],
      ].flat();
      const positions = new THREE.Float32BufferAttribute(array, 3);

      describe("normal:[0,1,0]", () => {
        const normal = new THREE.Vector3(0, 1, 0);
        // anyVector:[1,0,0]
        // cd(v2):[0,0,1]
        // y:0.5
        describe.each([
          // z:(any), x:0.5
          [new THREE.Vector3(0.5, 0.5, 0.5), true], // count:1
          [new THREE.Vector3(0.5, 0.5, 1.5), false], // count:0
          [new THREE.Vector3(0.5, 0.5, -0.5), false], // count:2
          // z:-0.5, x:(any)
          [new THREE.Vector3(1.5, 0.5, -0.5), false], // count:0
          [new THREE.Vector3(1, 0.5, -0.5), false], // count:2
          // z:0, x:(any)
          [new THREE.Vector3(0.5, 0.5, 0), false], // count:2
          [new THREE.Vector3(1, 0.5, 0), false], // count:2
          // z:0.5, x:1
          [new THREE.Vector3(1, 0.5, 0.5), true], // count:1
          // z:1, x:(any)
          [new THREE.Vector3(0.5, 0.5, 1), true], // count:1
          [new THREE.Vector3(1, 0.5, 1), true], // count:1
        ])("point:%j, expected:%o", (point, expected) => {
          const plane = new FreePlane(normal, point);
          test.each([[false], [true]])(
            "(intersections) reversed:%o",
            (reversed) => {
              const intersections = [
                new EdgeIntersection(0, 4, 0.5, true),
                new EdgeIntersection(1, 5, 0.5, true),
                new EdgeIntersection(2, 6, 0.5, true),
                new EdgeIntersection(3, 7, 0.5, true),
              ];
              const il = new IntersectionLoop(
                reversed ? intersections.toReversed() : intersections,
                true
              );
              expect(il.inLoop(plane, positions)).toBe(expected);
            }
          );
        });
      });

      describe("normal:[1,0,0]", () => {
        const normal = new THREE.Vector3(1, 0, 0);
        // anyVector:[0,0,1]
        // cd(v2):[0,1,0]
        // x:0.5
        describe.each([
          // y:(any), z:0.5
          [new THREE.Vector3(0.5, 0.5, 0.5), true], // count:1
          [new THREE.Vector3(0.5, 1.5, 0.5), false], // count:0
          [new THREE.Vector3(0.5, -0.5, 0.5), false], // count:2
        ])("point:%j, expected:%o", (point, expected) => {
          const plane = new FreePlane(normal, point);
          test.each([[false], [true]])(
            "(intersections) reversed:%o",
            (reversed) => {
              const intersections = [
                new EdgeIntersection(0, 1, 0.5, true),
                new EdgeIntersection(3, 2, 0.5, true),
                new EdgeIntersection(7, 6, 0.5, true),
                new EdgeIntersection(4, 5, 0.5, true),
              ];
              const il = new IntersectionLoop(
                reversed ? intersections.toReversed() : intersections,
                true
              );
              expect(il.inLoop(plane, positions)).toBe(expected);
            }
          );
        });
      });

      describe("normal:[0,0,1]", () => {
        const normal = new THREE.Vector3(0, 0, 1);
        // anyVector:[1,0,0]
        // cd(v2):[0,0,1]
        // z:0.5
        describe.each([
          // x:(any), y:0.5
          [new THREE.Vector3(0.5, 0.5, 0.5), true], // count:1
          [new THREE.Vector3(1.5, 0.5, 0.5), false], // count:0
          [new THREE.Vector3(-0.5, 0.5, 0.5), false], // count:2
        ])("point:%j, expected:%o", (point, expected) => {
          const plane = new FreePlane(normal, point);
          test.each([[false], [true]])(
            "(intersections) reversed:%o",
            (reversed) => {
              const intersections = [
                new EdgeIntersection(0, 3, 0.5, true),
                new EdgeIntersection(1, 2, 0.5, true),
                new EdgeIntersection(5, 6, 0.5, true),
                new EdgeIntersection(4, 7, 0.5, true),
              ];
              const il = new IntersectionLoop(
                reversed ? intersections.toReversed() : intersections,
                true
              );
              expect(il.inLoop(plane, positions)).toBe(expected);
            }
          );
        });
      });

      // NOTE: To avoid rounding errors, no normalization is performed in this test.
      describe("normal:[1,1,1]", () => {
        const normal = new THREE.Vector3(1, 1, 1);
        // anyVector:[1,0,0]
        // cd(v2):[0,-1,1]
        // x:0.5
        describe.each([
          // z:(any), x:(any)
          [new THREE.Vector3(0.5, 0.5, 0.5), true], // count:1
          [new THREE.Vector3(0.5, -0.5, 1.5), false], // count:0
          [new THREE.Vector3(0.5, 1.5, -0.5), false], // count:2
        ])("point:%j, expected:%o", (point, expected) => {
          const plane = new FreePlane(normal, point);
          test.each([[false], [true]])(
            "(intersections) reversed:%o",
            (reversed) => {
              const intersections = [
                new EdgeIntersection(1, 2, 0.5, true),
                new EdgeIntersection(3, 2, 0.5, true),
                new EdgeIntersection(3, 7, 0.5, true),
                new EdgeIntersection(4, 7, 0.5, true),
                new EdgeIntersection(4, 5, 0.5, true),
                new EdgeIntersection(1, 5, 0.5, true),
              ];
              const il = new IntersectionLoop(
                reversed ? intersections.toReversed() : intersections,
                true
              );
              expect(il.inLoop(plane, positions)).toBe(expected);
            }
          );
        });
      });

      describe("normal:[-1,0,0]", () => {
        const normal = new THREE.Vector3(-1, 0, 0);
        // anyVector:[0,0,1]
        // cd(v2):[0,-1,0]
        // x:0.5
        describe.each([
          // y:(any), z:0.5
          [new THREE.Vector3(0.5, 0.5, 0.5), true], // count:1
          [new THREE.Vector3(0.5, -0.5, 0.5), false], // count:0
          [new THREE.Vector3(0.5, 1.5, 0.5), false], // count:2
        ])("point:%j, expected:%o", (point, expected) => {
          const plane = new FreePlane(normal, point);
          test.each([[false], [true]])(
            "(intersections) reversed:%o",
            (reversed) => {
              const intersections = [
                new EdgeIntersection(0, 1, 0.5, true),
                new EdgeIntersection(3, 2, 0.5, true),
                new EdgeIntersection(7, 6, 0.5, true),
                new EdgeIntersection(4, 5, 0.5, true),
              ];
              const il = new IntersectionLoop(
                reversed ? intersections.toReversed() : intersections,
                true
              );
              expect(il.inLoop(plane, positions)).toBe(expected);
            }
          );
        });
      });

      test("if (!this.closed)", () => {
        const normal = new THREE.Vector3(0, 1, 0);
        const point = new THREE.Vector3(0.5, 0.5, 0.5);
        const plane = new FreePlane(normal, point);
        const intersections = [
          new EdgeIntersection(0, 4, 0.5, true),
          new EdgeIntersection(1, 5, 0.5, true),
          new EdgeIntersection(2, 6, 0.5, true),
          new EdgeIntersection(3, 7, 0.5, true),
        ];
        const il = new IntersectionLoop(intersections, false); // closed:false
        expect(il.inLoop(plane, positions)).toBeFalsy();
      });
    });
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
