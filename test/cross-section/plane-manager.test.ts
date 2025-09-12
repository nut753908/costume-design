import { createLinePath } from "src/cross-section/centerline";
import { FreePlane } from "src/cross-section/free-plane";
import {
  PlaneManager,
  type PlaneManagerJSON,
} from "src/cross-section/plane-manager";
import { VerticalPlane } from "src/cross-section/vertical-plane";
import * as THREE from "three";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("PlaneManager", () => {
  test("constructor()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = [
      new FreePlane(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 3, 4)),
      new VerticalPlane(curves.b, 1),
    ];
    const pm = new PlaneManager(curves, planes);
    expect(pm.curves).toEqual(curves);
    expect(pm.planes).toEqual(planes);
  });

  test("clone()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = [
      new FreePlane(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 3, 4)),
      new VerticalPlane(curves.b, 1),
    ];
    const pm1 = new PlaneManager(curves, planes);
    const pm2 = pm1.clone();
    expect(pm1).toEqual(pm2);
  });

  test("copy()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = [
      new FreePlane(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 3, 4)),
      new VerticalPlane(curves.b, 1),
    ];
    const pm1 = new PlaneManager(curves, planes);
    const pm2 = new PlaneManager().copy(pm1);
    expect(pm1).toEqual(pm2);
  });

  const _jsonForCurvePath: PlaneManagerJSON = {
    curves: {
      a: {
        metadata: {
          version: 4.7,
          type: "Curve",
          generator: "Curve.toJSON",
        },
        arcLengthDivisions: 200,
        type: "CurvePath",
        autoClose: false,
        curves: [
          {
            metadata: {
              version: 4.7,
              type: "Curve",
              generator: "Curve.toJSON",
            },
            arcLengthDivisions: 200,
            type: "LineCurve3",
            v1: [1, 2, 3],
            v2: [1, 2, 4],
          },
        ] as (THREE.CurveJSON &
          Record<"v1", [number, number, number]> &
          Record<"v2", [number, number, number]>)[],
      },
    },
    planes: [],
  };
  const _jsonForCatmullRomCurve3: PlaneManagerJSON = {
    curves: {
      b: {
        metadata: {
          version: 4.7,
          type: "Curve",
          generator: "Curve.toJSON",
        },
        arcLengthDivisions: 200,
        type: "CatmullRomCurve3",
        points: [
          [1, 2, 3],
          [1, 2, 4],
        ],
        closed: false,
        curveType: "centripetal",
        tension: 0.5,
      } as THREE.CurveJSON &
        Record<"points", [number, number, number][]> &
        Record<"closed", boolean> &
        Record<"curveType", string> &
        Record<"tension", number>,
    },
    planes: [],
  };
  const _jsonForCubicBezierCurve3: PlaneManagerJSON = {
    curves: {
      c: {
        metadata: {
          version: 4.7,
          type: "Curve",
          generator: "Curve.toJSON",
        },
        arcLengthDivisions: 200,
        type: "CubicBezierCurve3",
        v0: [0, 0, 0],
        v1: [1, 0, 0],
        v2: [2, 1, 0],
        v3: [2, 2, 0],
      } as THREE.CurveJSON &
        Record<"v0", [number, number, number]> &
        Record<"v1", [number, number, number]> &
        Record<"v2", [number, number, number]> &
        Record<"v3", [number, number, number]>,
    },
    planes: [],
  };

  const _jsonForFreePlane: PlaneManagerJSON = {
    curves: {},
    planes: [
      {
        type: "FreePlane",
        normal: [1, 0, 0],
        point: [2, 3, 4],
      },
    ],
  };
  const _jsonForVerticalPlane: PlaneManagerJSON = {
    curves: {},
    planes: [
      {
        type: "VerticalPlane",
        curve: {
          metadata: {
            version: 4.7,
            type: "Curve",
            generator: "Curve.toJSON",
          },
          arcLengthDivisions: 200,
          type: "CatmullRomCurve3",
          points: [
            [1, 2, 3],
            [1, 2, 4],
          ],
          closed: false,
          curveType: "centripetal",
          tension: 0.5,
        } as THREE.CurveJSON &
          Record<"points", [number, number, number][]> &
          Record<"closed", boolean> &
          Record<"curveType", string> &
          Record<"tension", number>,
        u: 1,
      },
    ],
  };
  const _jsonForNonExistentPlane: PlaneManagerJSON = {
    curves: {},
    planes: [
      {
        type: "NonExistentPlane",
        normal: [0, 0, 0],
        point: [0, 0, 0],
      },
    ],
  };

  const _json: PlaneManagerJSON = {
    curves: {
      a: _jsonForCurvePath.curves.a,
      b: _jsonForCatmullRomCurve3.curves.b,
    },
    planes: [_jsonForFreePlane.planes[0], _jsonForVerticalPlane.planes[0]],
  };

  test("toJSON()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = [
      new FreePlane(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 3, 4)),
      new VerticalPlane(curves.b, 1),
    ];
    const json1 = new PlaneManager(curves, planes).toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  describe("fromJSON()", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    afterEach(() => spy.mockReset());

    test('curves: if (v.type === "CurvePath")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForCurvePath);
      const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
      const curves = { a: createLinePath(points) };
      const pm2 = new PlaneManager(curves);
      expect(pm1).toEqual(pm2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('curves: else if (v.type === "CatmullRomCurve3")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForCatmullRomCurve3);
      const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
      const curves = { b: new THREE.CatmullRomCurve3(points) };
      const pm2 = new PlaneManager(curves);
      expect(pm1).toEqual(pm2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test("curves: else", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
!(v.type === "CurvePath") && !(v.type === "CatmullRomCurve3")
- v: {"metadata":{"version":4.7,"type":"Curve","generator":"Curve.toJSON"},\
"arcLengthDivisions":200,"type":"CubicBezierCurve3",\
"v0":[0,0,0],"v1":[1,0,0],"v2":[2,1,0],"v3":[2,2,0]}
`);
      });
      const pm = new PlaneManager().fromJSON(_jsonForCubicBezierCurve3);
      expect(pm.curves.c.type).not.toBe("CubicBezierCurve3");
      expect(pm.curves.c.type).toBe("CurvePath");
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('planes: if (v.type === "FreePlane")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForFreePlane);
      const planes = [
        new FreePlane(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 3, 4)),
      ];
      const pm2 = new PlaneManager({}, planes);
      expect(pm1).toEqual(pm2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('planes: if (v.type === "VerticalPlane")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForVerticalPlane);
      const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
      const curve = new THREE.CatmullRomCurve3(points);
      const planes = [new VerticalPlane(curve, 1)];
      const pm2 = new PlaneManager({}, planes);
      expect(pm1).toEqual(pm2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test("planes: else", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
!(v.type === "FreePlane") && !(v.type === "VerticalPlane")
- v: {"type":"NonExistentPlane","normal":[0,0,0],"point":[0,0,0]}
`);
      });
      const pm = new PlaneManager().fromJSON(_jsonForNonExistentPlane);
      expect(pm.planes[0].type).not.toBe("NonExistentPlane");
      expect(pm.planes[0].type).toBe("FreePlane");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
