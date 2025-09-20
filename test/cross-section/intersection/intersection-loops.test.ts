import { createAllEdges } from "src/cross-section/centerline/edges";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import {
  convertToTriangularPolygonIndices,
  createIndicesMap,
} from "src/cross-section/intersection/indices";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import {
  createAllIntersectionLoops,
  IntersectionLoops,
  type IntersectionLoopsJSON,
  sortIntersectionLoops,
} from "src/cross-section/intersection/intersection-loops";
import { createAllIntersections } from "src/cross-section/intersection/intersections";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test, vi } from "vitest";

describe("createAllIntersectionLoops()", () => {
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
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    test("all intersections", () => {
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(1, 3, 0.5),
        new EdgeIntersection(0, 3, 0.5),
        new EdgeIntersection(2, 3, 0.5),
        new EdgeIntersection(5, 7, 0.5),
        new EdgeIntersection(6, 7, 0.5),
        new EdgeIntersection(9, 11, 0.5),
        new VertexIntersection(4),
        new VertexIntersection(8),
        new VertexIntersection(10),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      const spy = vi.spyOn(console, "error");
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const expected = [
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
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("cube example", () => {
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
    const indicesArray = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 1, 5],
      [0, 5, 4],
      [1, 2, 6],
      [1, 6, 5],
      [2, 3, 7],
      [2, 7, 6],
      [3, 0, 4],
      [3, 4, 7],
      [4, 5, 6],
      [4, 6, 7],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    test("all intersections", () => {
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(1, 5, 0.5),
        new EdgeIntersection(0, 5, 0.5),
        new EdgeIntersection(0, 4, 0.5),
        new EdgeIntersection(2, 6, 0.5),
        new EdgeIntersection(1, 6, 0.5),
        new EdgeIntersection(3, 7, 0.5),
        new EdgeIntersection(2, 7, 0.5),
        new EdgeIntersection(3, 4, 0.5),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      const spy = vi.spyOn(console, "error");
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const expected = [
        new IntersectionLoop(
          [
            new EdgeIntersection(1, 5, 0.5, true),
            new EdgeIntersection(0, 5, 0.5, true),
            new EdgeIntersection(0, 4, 0.5, true),
            new EdgeIntersection(3, 4, 0.5, true),
            new EdgeIntersection(3, 7, 0.5, true),
            new EdgeIntersection(2, 7, 0.5, true),
            new EdgeIntersection(2, 6, 0.5, true),
            new EdgeIntersection(1, 6, 0.5, true),
          ],
          true
        ),
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("plane example", () => {
    /**
     * flat layout:
     *   6(-1, 1) 7(0, 1) 8(1, 1)
     *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
     *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
     */
    const positionsArray = [
      [-1, -1, 0],
      [0, -1, 0],
      [1, -1, 0],
      [-1, 0, 0],
      [0, 0, 0],
      [1, 0, 0],
      [-1, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ].flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = [
      [0, 1, 4],
      [0, 4, 3],
      [1, 2, 5],
      [1, 5, 4],
      [3, 4, 7],
      [3, 7, 6],
      [4, 5, 8],
      [4, 8, 7],
    ].flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    test("all intersections", () => {
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
       *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
       */
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const expected = [
        new EdgeIntersection(4, 7, 0.5),
        new EdgeIntersection(3, 7, 0.5),
        new EdgeIntersection(3, 6, 0.5),
        new EdgeIntersection(5, 8, 0.5),
        new EdgeIntersection(4, 8, 0.5),
      ];
      expect(createAllIntersections(plane, allEdges, positions)).toEqual(
        expected
      );
    });

    test("all intersection loops", () => {
      const spy = vi.spyOn(console, "error");
      /**
       * flat layout:
       *   6(-1, 1) 7(0, 1) 8(1, 1)
       *   3(-1, 0) 4(0, 0) 5(1, 0)  ◤5 ◢4  ◤7 ◢6
       *   0(-1,-1) 1(0,-1) 2(1,-1)  ◤1 ◢0  ◤3 ◢2
       */
      const plane = new FreePlane(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5, 0)
      );
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const expected = [
        new IntersectionLoop(
          [
            new EdgeIntersection(5, 8, 0.5, true),
            new EdgeIntersection(4, 8, 0.5, true),
            new EdgeIntersection(4, 7, 0.5, true),
            new EdgeIntersection(3, 7, 0.5, true),
            new EdgeIntersection(3, 6, 0.5, true),
          ],
          false
        ),
      ];
      expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
        expected
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  // NOTE: This testing is expensive to perform.
  test("whileLoop: count > 1000", () => {
    const spy = vi
      .spyOn(console, "error")
      .mockImplementationOnce((v) => expect(v).toBe("whileLoop: count > 1000"))
      .mockImplementationOnce((v) => expect(v).toBe("whileLoop: count > 1000"));
    /**
     * top view flat layout:
     *                 4+4i(0,0,1)
     *   1+4i(-1,0,0)     0(0,0,1) 3+4i(1,0,0) ◢2 ◣3
     *                2+4i(0,0,-1)             ◥0 ◤1
     */
    const positionsArray = [[0, 1, 0]]
      .concat(
        Array(250)
          .fill([
            [0, 0, -1],
            [-1, 0, 0],
            [1, 0, 0],
            [0, 0, 1],
          ])
          .flat(),
        [-1, 0, 0]
      )
      .flat();
    const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
    const indicesArray = Array(250)
      .fill(0)
      .flatMap((_, i) => [
        [0, 1 + 4 * i, 2 + 4 * i],
        [0, 2 + 4 * i, 3 + 4 * i],
        [0, 3 + 4 * i, 4 + 4 * i],
        [0, 4 + 4 * i, 5 + 4 * i],
      ])
      .flat();
    const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);

    const plane = new FreePlane(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0.5, 0)
    );
    const allIntersections = createAllIntersections(plane, allEdges, positions);
    const expected = [
      new IntersectionLoop(
        Array(1001)
          .fill(0)
          .map((_, i) => new EdgeIntersection(1 + i, 0, 0.5, true)),
        false
      ),
    ];
    expect(createAllIntersectionLoops(indicesMap, allIntersections)).toEqual(
      expected
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

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

describe("IntersectionLoops", () => {
  test("constructor()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils = new IntersectionLoops([il], "some", [0]);
    expect(ils.intersectionLoops).toEqual([il]);
    expect(ils.selection).toBe("some");
    expect(ils.indices).toEqual([0]);
  });

  test("getSelections()", () => {
    expect(IntersectionLoops.getSelections()).toContain("all");
    expect(IntersectionLoops.getSelections()).toContain("including plane");
    expect(IntersectionLoops.getSelections()).toContain("excluding plane");
    expect(IntersectionLoops.getSelections()).toContain("some");
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
        const ils = new IntersectionLoops(intersectionLoops, "all");
        expect(ils.getSelectedIntersectionLoops(plane, positions)).toEqual(
          intersectionLoops
        );
      });

      test('case "including plane"', () => {
        const ils = new IntersectionLoops(intersectionLoops, "including plane");
        expect(ils.getSelectedIntersectionLoops(plane, positions)).toEqual([
          intersectionLoops[0],
        ]);
      });

      test('case "excluding plane"', () => {
        const ils = new IntersectionLoops(intersectionLoops, "excluding plane");
        expect(ils.getSelectedIntersectionLoops(plane, positions)).toEqual([
          intersectionLoops[1],
          intersectionLoops[2],
        ]);
      });

      test('case "some"', () => {
        const ils = new IntersectionLoops(intersectionLoops, "some", [0, 2, 3]);
        expect(ils.getSelectedIntersectionLoops(plane, positions)).toEqual([
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
    const ils1 = new IntersectionLoops([il], "some", [0]);
    const ils2 = ils1.clone();
    ils2._updateGroup = ils1._updateGroup;
    expect(ils1).toEqual(ils2);
  });

  test("copy()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils1 = new IntersectionLoops([il], "some", [0]);
    const ils2 = new IntersectionLoops().copy(ils1);
    ils2._updateGroup = ils1._updateGroup;
    expect(ils1).toEqual(ils2);
  });

  const _json: IntersectionLoopsJSON = {
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
    const json1 = new IntersectionLoops([il], "some", [0]).toJSON();
    const json2: IntersectionLoopsJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const ils1 = new IntersectionLoops().fromJSON(_json);
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils2 = new IntersectionLoops([il], "some", [0]);
    ils2._updateGroup = ils1._updateGroup;
    expect(ils1).toEqual(ils2);
  });
});
