import { createLinePath } from "src/tight-clothing/centerline/centerline";
import {
  VerticalPlane,
  type VerticalPlaneJSON,
} from "src/tight-clothing/plane/vertical-plane";
import * as THREE from "three";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("VerticalPlane", () => {
  test("constructor()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p = new VerticalPlane(curve, 1, true);
    expect(p.curve).toEqual(curve);
    expect(p.u).toEqual(1);
    expect(p.inverted).toBe(true);
  });

  test("getNormal()", () => {
    let p: VerticalPlane;
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);

    p = new VerticalPlane(curve, 1, false);
    expect(p.getNormal()).toEqual(new THREE.Vector3(0, 0, 1));

    p = new VerticalPlane(curve, 1, true);
    expect(p.getNormal()).toEqual(new THREE.Vector3(-0, -0, -1));
  });

  test("getPoint()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p = new VerticalPlane(curve, 1);
    expect(p.getPoint()).toEqual(new THREE.Vector3(1, 2, 4));
  });

  test("getPlane()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p = new VerticalPlane(curve, 1);
    expect(p.getPlane()).toEqual(
      new THREE.Plane(new THREE.Vector3(0, 0, 1), -4)
    );
  });

  test("clone()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p1 = new VerticalPlane(curve, 1);
    const p2 = p1.clone();
    p2._updateGroup = p1._updateGroup;
    expect(p1).toEqual(p2);
  });

  test("copy()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p1 = new VerticalPlane(curve, 1);
    const p2 = new VerticalPlane().copy(p1);
    p2._updateGroup = p1._updateGroup;
    expect(p1).toEqual(p2);
  });

  const _jsonForCurvePath: VerticalPlaneJSON = {
    type: "VerticalPlane",
    curve: {
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
    u: 1,
    inverted: false,
  };
  const _jsonForCatmullRomCurve3: VerticalPlaneJSON = {
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
    inverted: false,
  };
  const _jsonForCubicBezierCurve3: VerticalPlaneJSON = {
    type: "VerticalPlane",
    curve: {
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
    u: 1,
    inverted: false,
  };

  test("toJSON()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p1 = new VerticalPlane(curve, 1);
    const json1 = p1.toJSON();
    const json2 = _jsonForCurvePath;
    expect(json1).toEqual(json2);
  });

  describe("fromJSON()", () => {
    let spy: MockInstance;

    beforeEach(() => {
      spy = vi.spyOn(console, "error");
    });

    test('if (json.curve.type === "CurvePath")', () => {
      const p1 = new VerticalPlane().fromJSON(_jsonForCurvePath);
      const curve = createLinePath([
        new THREE.Vector3(1, 2, 3),
        new THREE.Vector3(1, 2, 4),
      ]);
      const p2 = new VerticalPlane(curve, 1);
      p2._updateGroup = p1._updateGroup;
      expect(p1).toEqual(p2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test(`else if (json.curve.type === "CatmullRomCurve3")`, () => {
      const p1 = new VerticalPlane().fromJSON(_jsonForCatmullRomCurve3);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1, 2, 3),
        new THREE.Vector3(1, 2, 4),
      ]);
      const p2 = new VerticalPlane(curve, 1);
      p2._updateGroup = p1._updateGroup;
      expect(p1).toEqual(p2);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test("else", () => {
      spy.mockImplementationOnce((v) => {
        expect(v).toBe(`\
!(json.curve.type === "CurvePath") && !(json.curve.type === "CatmullRomCurve3")
- json.curve: {"metadata":{"version":4.7,"type":"Curve","generator":"Curve.toJSON"},\
"arcLengthDivisions":200,"type":"CubicBezierCurve3",\
"v0":[0,0,0],"v1":[1,0,0],"v2":[2,1,0],"v3":[2,2,0]}
`);
      });
      const c1 = new THREE.CubicBezierCurve3().fromJSON(
        _jsonForCubicBezierCurve3.curve
      );
      const c2 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(2, 1, 0),
        new THREE.Vector3(2, 2, 0)
      );
      expect(c1).toEqual(c2);
      const p = new VerticalPlane().fromJSON(_jsonForCubicBezierCurve3);
      expect(p.curve.type).not.toBe("CubicBezierCurve3");
      expect(p.curve.type).toBe("CurvePath");
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
