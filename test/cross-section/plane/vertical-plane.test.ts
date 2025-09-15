import { createLinePath } from "src/cross-section/centerline/centerline";
import {
  VerticalPlane,
  type VerticalPlaneJSON,
} from "src/cross-section/plane/vertical-plane";
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
    const p = new VerticalPlane(curve, 1);
    expect(p.curve).toEqual(curve);
    expect(p.u).toEqual(1);
  });

  test("getNormal()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p = new VerticalPlane(curve, 1);
    expect(p.getNormal()).toEqual(new THREE.Vector3(0, 0, 1));
  });

  test("getPoint()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p = new VerticalPlane(curve, 1);
    expect(p.getPoint()).toEqual(new THREE.Vector3(1, 2, 4));
  });

  describe("getTopNormal()", () => {
    test.each([
      [
        /**
         * when
         *   x,y,z,w∈N,
         *   x^2+y^2+z^2=w^2
         * then
         *   a,b,c,d∈N,
         *   x=|a^2+b^2-c^2-d^2|,
         *   y=2|ac+bd|,
         *   z=2|ad-bc|,
         *   w=a^2+b^2+c^2+d^2
         *
         * if
         *   (a,b,c,d)=(1,6,2,3)
         * then
         *   (x,y,z,w)=(24,40,18,50)
         *   (x,y,z,w)/w=(0.48,0.8,0.36,1)
         */
        new THREE.Vector3(0.48, 0.8, 0.36),
        new THREE.Vector3(0.48, 0.8, 0.36),
      ],
      [
        new THREE.Vector3(0.48, -0.8, 0.36),
        new THREE.Vector3(-0.48, 0.8, -0.36),
      ],
    ])("normal:%j, expected:%j", (normal, expected) => {
      const curve = createLinePath([new THREE.Vector3(0, 0, 0), normal]);
      const p = new VerticalPlane(curve, 0);
      const topNormal = p.getTopNormal();
      expect(topNormal.x).toBeCloseTo(expected.x);
      expect(topNormal.y).toBeCloseTo(expected.y);
      expect(topNormal.z).toBeCloseTo(expected.z);
    });
  });

  describe("getBottomNormal()", () => {
    test.each([
      [
        new THREE.Vector3(0.48, 0.8, 0.36),
        new THREE.Vector3(-0.48, -0.8, -0.36),
      ],
      [
        new THREE.Vector3(0.48, -0.8, 0.36),
        new THREE.Vector3(0.48, -0.8, 0.36),
      ],
    ])("normal:%j, expected:%j", (normal, expected) => {
      const curve = createLinePath([new THREE.Vector3(0, 0, 0), normal]);
      const p = new VerticalPlane(curve, 0);
      const bottomNormal = p.getBottomNormal();
      expect(bottomNormal.x).toBeCloseTo(expected.x);
      expect(bottomNormal.y).toBeCloseTo(expected.y);
      expect(bottomNormal.z).toBeCloseTo(expected.z);
    });
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
    expect(p1).toEqual(p2);
  });

  test("copy()", () => {
    const curve = createLinePath([
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(1, 2, 4),
    ]);
    const p1 = new VerticalPlane(curve, 1);
    const p2 = new VerticalPlane().copy(p1);
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
