import { createLinePath } from "src/cross-section/centerline";
import { FreePlane } from "src/cross-section/free-plane";
import {
  PlaneManager,
  type PlaneManagerJSON,
} from "src/cross-section/plane-manager";
import { VerticalPlane } from "src/cross-section/vertical-plane";
import * as THREE from "three";
import {
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
    const planes = {
      "[0] {FreePlane}": new FreePlane(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(2, 3, 4)
      ),
      "[1] b {VerticalPlane}": new VerticalPlane(curves.a, 1),
    };
    const pm = new PlaneManager(curves, planes);
    expect(pm.curves).toEqual(curves);
    expect(pm.planes).toEqual(planes);
  });

  test("addFreePlane()", () => {
    const pm = new PlaneManager();
    expect(pm.planeKeys.length).toBe(0);
    pm.addFreePlane();
    expect(pm.planeKeys.length).toBe(1);
    expect(pm.planeKeys).toContain("[0] {FreePlane}");
    expect(pm.planes["[0] {FreePlane}"].type).toBe("FreePlane");
  });

  describe("addVerticalPlane()", () => {
    let spy: MockInstance;
    let pm: PlaneManager;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
      pm = new PlaneManager({ a: new THREE.CurvePath<THREE.Vector3>() });
      expect(pm.planeKeys.length).toBe(0);
    });

    test("if (!this.curveKeys.includes(curveKey))", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
if (!this.curveKeys.includes(curveKey))
- curveKey: b
- this.curveKeys: ["a"]
`);
      });
      pm.addVerticalPlane("b");
      expect(pm.planeKeys.length).toBe(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("else", () => {
      pm.addVerticalPlane("a");
      expect(pm.planeKeys.length).toBe(1);
      expect(pm.planeKeys).toContain("[0] a {VerticalPlane}");
      expect(pm.planes["[0] a {VerticalPlane}"].type).toBe("VerticalPlane");
      expect(
        (pm.planes["[0] a {VerticalPlane}"] as VerticalPlane).curve
      ).toEqual(pm.curves.a);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("removePlane()", () => {
    let spy: MockInstance;
    let pm: PlaneManager;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
      pm = new PlaneManager({}, { "[0] {FreePlane}": new FreePlane() });
      expect(pm.planeKeys.length).toBe(1);
    });

    test("if (!this.planeKeys.includes(key))", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
if (!this.planeKeys.includes(key))
- key: [1] b {VerticalPlane}
- this.planeKeys: ["[0] {FreePlane}"]
`);
      });
      pm.removePlane("[1] b {VerticalPlane}");
      expect(pm.planeKeys.length).toBe(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("else", () => {
      pm.removePlane("[0] {FreePlane}");
      expect(pm.planeKeys.length).toBe(0);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe("curveKeys()", () => {
    test.each([[[]], [["a"]], [["a", "b"]]])("curveKeys:%j", (curveKeys) => {
      const curves: {
        [k: string]: THREE.CurvePath<THREE.Vector3> | THREE.CatmullRomCurve3;
      } = {};
      curveKeys.forEach((k) => {
        curves[k] = new THREE.CurvePath<THREE.Vector3>();
      });
      const pm = new PlaneManager(curves);
      expect(pm.curveKeys).toEqual(curveKeys);
    });
  });

  describe("planeKeys()", () => {
    test.each([
      [[]],
      [["[0] {FreePlane}"]],
      [["[0] {FreePlane}", "[1] a {VerticalPlane}"]],
    ])("planeKeys:%j", (planeKeys) => {
      const planes: {
        [k: string]: FreePlane | VerticalPlane;
      } = {};
      planeKeys.forEach((k) => {
        planes[k] = new FreePlane();
      });
      const pm = new PlaneManager({}, planes);
      expect(pm.planeKeys).toEqual(planeKeys);
    });
  });

  test("clone()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = {
      "[0] {FreePlane}": new FreePlane(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(2, 3, 4)
      ),
      "[1] b {VerticalPlane}": new VerticalPlane(curves.b, 1),
    };
    const pm1 = new PlaneManager(curves, planes);
    const pm2 = pm1.clone();
    pm2._updatePlanesGroup = pm1._updatePlanesGroup;
    expect(pm1).toEqual(pm2);
  });

  test("copy()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = {
      "[0] {FreePlane}": new FreePlane(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(2, 3, 4)
      ),
      "[1] b {VerticalPlane}": new VerticalPlane(curves.b, 1),
    };
    const pm1 = new PlaneManager(curves, planes);
    const pm2 = new PlaneManager().copy(pm1);
    pm2._updatePlanesGroup = pm1._updatePlanesGroup;
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
    planes: {},
    planeNextIndex: 0,
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
    planes: {},
    planeNextIndex: 0,
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
    planes: {},
    planeNextIndex: 0,
  };

  const _jsonForFreePlane: PlaneManagerJSON = {
    curves: {},
    planes: {
      "[0] {FreePlane}": {
        type: "FreePlane",
        normal: [1, 0, 0],
        point: [2, 3, 4],
      },
    },
    planeNextIndex: 1,
  };
  const _jsonForVerticalPlane: PlaneManagerJSON = {
    curves: {},
    planes: {
      "[1] b {VerticalPlane}": {
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
    },
    planeNextIndex: 1,
  };
  const _jsonForNonExistentPlane: PlaneManagerJSON = {
    curves: {},
    planes: {
      "[2] {NonExistentPlane}": {
        type: "NonExistentPlane",
        normal: [0, 0, 0],
        point: [0, 0, 0],
      },
    },
    planeNextIndex: 1,
  };

  const _json: PlaneManagerJSON = {
    curves: {
      a: _jsonForCurvePath.curves.a,
      b: _jsonForCatmullRomCurve3.curves.b,
    },
    planes: {
      "[0] {FreePlane}": _jsonForFreePlane.planes["[0] {FreePlane}"],
      "[1] b {VerticalPlane}":
        _jsonForVerticalPlane.planes["[1] b {VerticalPlane}"],
    },
    planeNextIndex: 2,
  };

  test("toJSON()", () => {
    const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
    const curves = {
      a: createLinePath(points),
      b: new THREE.CatmullRomCurve3(points),
    };
    const planes = {
      "[0] {FreePlane}": new FreePlane(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(2, 3, 4)
      ),
      "[1] b {VerticalPlane}": new VerticalPlane(curves.b, 1),
    };
    const json1 = new PlaneManager(curves, planes).toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  describe("fromJSON()", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    test('curves: if (v.type === "CurvePath")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForCurvePath);
      const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
      const curves = { a: createLinePath(points) };
      const pm2 = new PlaneManager(curves);
      pm2._updatePlanesGroup = pm1._updatePlanesGroup;
      expect(pm1).toEqual(pm2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('curves: else if (v.type === "CatmullRomCurve3")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForCatmullRomCurve3);
      const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
      const curves = { b: new THREE.CatmullRomCurve3(points) };
      const pm2 = new PlaneManager(curves);
      pm2._updatePlanesGroup = pm1._updatePlanesGroup;
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
      const planes = {
        "[0] {FreePlane}": new FreePlane(
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(2, 3, 4)
        ),
      };
      const pm2 = new PlaneManager({}, planes);
      pm2._updatePlanesGroup = pm1._updatePlanesGroup;
      expect(pm1).toEqual(pm2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('planes: if (v.type === "VerticalPlane")', () => {
      const pm1 = new PlaneManager().fromJSON(_jsonForVerticalPlane);
      const points = [new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 4)];
      const curve = new THREE.CatmullRomCurve3(points);
      const planes = { "[1] b {VerticalPlane}": new VerticalPlane(curve, 1) };
      const pm2 = new PlaneManager({}, planes);
      pm2._updatePlanesGroup = pm1._updatePlanesGroup;
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
      expect(pm.planes["[2] {NonExistentPlane}"].type).not.toBe(
        "NonExistentPlane"
      );
      expect(pm.planes["[2] {NonExistentPlane}"].type).toBe("FreePlane");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
