import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import {
  IntersectionLoopPicker,
  type IntersectionLoopPickerJSON,
} from "src/cross-section/intersection/intersection-loop-picker";
import { sortIntersectionLoops } from "src/cross-section/intersection/intersection-loops";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("sortIntersectionLoops()", () => {
  test("check order", () => {
    const positionsArray = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
      [0, 1, 0],
      [1, 1, 0],
      [1, 1, 1],
      [0, 1, 1],
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);

    const intersectionLoops = [
      new IntersectionLoop([new VertexIntersection(0)]),
      new IntersectionLoop([new VertexIntersection(1)]),
      new IntersectionLoop([new VertexIntersection(2)]),
      new IntersectionLoop([new VertexIntersection(3)]),
      new IntersectionLoop([new VertexIntersection(4)]),
      new IntersectionLoop([new VertexIntersection(5)]),
      new IntersectionLoop([new VertexIntersection(6)]),
      new IntersectionLoop([new VertexIntersection(7)]),
    ];
    const expected = [
      new IntersectionLoop([new VertexIntersection(0)]),
      new IntersectionLoop([new VertexIntersection(4)]),
      new IntersectionLoop([new VertexIntersection(3)]),
      new IntersectionLoop([new VertexIntersection(7)]),
      new IntersectionLoop([new VertexIntersection(1)]),
      new IntersectionLoop([new VertexIntersection(5)]),
      new IntersectionLoop([new VertexIntersection(2)]),
      new IntersectionLoop([new VertexIntersection(6)]),
    ];
    expect(sortIntersectionLoops(intersectionLoops, positions)).toEqual(
      expected
    );
  });
});

describe("IntersectionLoopPicker", () => {
  test("constructor()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp = new IntersectionLoopPicker([il], "some", [0]);
    expect(ilp.intersectionLoops).toEqual([il]);
    expect(ilp.selection).toBe("some");
    expect(ilp.indices).toEqual([0]);
  });

  test("getSelections()", () => {
    expect(IntersectionLoopPicker.getSelections()).toContain("all");
    expect(IntersectionLoopPicker.getSelections()).toContain("including plane");
    expect(IntersectionLoopPicker.getSelections()).toContain("excluding plane");
    expect(IntersectionLoopPicker.getSelections()).toContain("some");
  });

  describe("getSelectedIntersectionLoops()", () => {
    describe("three triangular pyramids example", () => {
      const positionsArray = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        //
        [2, 0.5, 0.5],
        [3, 0, 0],
        [3, 0, 1],
        [3, 1, 0.5],
        //
        [4, 0.5, 0],
        [5, 0, 0.5],
        [4, 0.5, 1],
        [5, 1, 0.5],
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const indicesArray = [
        [0, 1, 2],
        [0, 1, 3],
        [1, 2, 3],
        [2, 0, 3],
        //
        [4, 5, 6],
        [4, 5, 7],
        [5, 6, 7],
        [6, 4, 7],
        //
        [8, 9, 10],
        [8, 9, 11],
        [9, 10, 11],
        [10, 8, 11],
      ].flat();
      const _indices = new THREE.Uint16BufferAttribute(indicesArray, 1);

      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0.1, 0.5, 0.1)
      );
      const intersectionLoops = [
        new IntersectionLoop(
          [
            new EdgeIntersection(1, 3, 0.5, true),
            new EdgeIntersection(0, 3, 0.5, true),
            new EdgeIntersection(2, 3, 0.5, true),
          ],
          true
        ),
        new IntersectionLoop(
          [
            new EdgeIntersection(5, 7, 0.5, true),
            new EdgeIntersection(6, 7, 0.5, true),
            new VertexIntersection(4, true),
          ],
          true
        ),
        new IntersectionLoop(
          [
            new EdgeIntersection(9, 11, 0.5, true),
            new VertexIntersection(8, true),
            new VertexIntersection(10, true),
          ],
          true
        ),
      ];

      test('case "all"', () => {
        const ilp = new IntersectionLoopPicker(intersectionLoops, "all");
        expect(ilp.getSelectedIntersectionLoops(plane, positions)).toEqual(
          intersectionLoops
        );
      });

      test('case "including plane"', () => {
        const ilp = new IntersectionLoopPicker(
          intersectionLoops,
          "including plane"
        );
        expect(ilp.getSelectedIntersectionLoops(plane, positions)).toEqual([
          intersectionLoops[0],
        ]);
      });

      test('case "excluding plane"', () => {
        const ilp = new IntersectionLoopPicker(
          intersectionLoops,
          "excluding plane"
        );
        expect(ilp.getSelectedIntersectionLoops(plane, positions)).toEqual([
          intersectionLoops[1],
          intersectionLoops[2],
        ]);
      });

      test('case "some"', () => {
        const ilp = new IntersectionLoopPicker(
          intersectionLoops,
          "some",
          [0, 2, 3]
        );
        expect(ilp.getSelectedIntersectionLoops(plane, positions)).toEqual([
          intersectionLoops[0],
          intersectionLoops[2],
        ]);
      });
    });
  });

  test("clone()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp1 = new IntersectionLoopPicker([il], "some", [0]);
    const ilp2 = ilp1.clone();
    ilp2._updateGroup = ilp1._updateGroup;
    expect(ilp1).toEqual(ilp2);
  });

  test("copy()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp1 = new IntersectionLoopPicker([il], "some", [0]);
    const ilp2 = new IntersectionLoopPicker().copy(ilp1);
    ilp2._updateGroup = ilp1._updateGroup;
    expect(ilp1).toEqual(ilp2);
  });

  const _json: IntersectionLoopPickerJSON = {
    intersectionLoops: [
      {
        intersections: [
          {
            type: "EdgeIntersection",
            backV: 1,
            frontV: 3,
            u: 0.5,
            checked: true,
          },
          {
            type: "EdgeIntersection",
            backV: 0,
            frontV: 3,
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
      },
    ],
    selection: "some",
    indices: [0],
  };

  test("toJSON()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const json1 = new IntersectionLoopPicker([il], "some", [0]).toJSON();
    const json2: IntersectionLoopPickerJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const ilp1 = new IntersectionLoopPicker().fromJSON(_json);
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp2 = new IntersectionLoopPicker([il], "some", [0]);
    ilp2._updateGroup = ilp1._updateGroup;
    expect(ilp1).toEqual(ilp2);
  });
});
