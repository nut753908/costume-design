import { ControlPoint2 } from "src/curve/control-point-2";
import type { CurveJSON } from "src/curve/curve";
import { Curve2 } from "src/curve/curve-2";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("Curve2", () => {
  test("constructor()", () => {
    const cps = [new ControlPoint2(), new ControlPoint2()];
    const c = new Curve2(cps);
    expect(c.cps).toEqual(cps);
  });

  test("curveClass()", () => {
    const c = new Curve2();
    const curve = new c.curveClass(
      new THREE.Vector2(),
      new THREE.Vector2(),
      new THREE.Vector2(),
      new THREE.Vector2()
    );
    expect(curve.type).toBe("CubicBezierCurve");
  });

  test("cpClass()", () => {
    const c = new Curve2();
    const cp = new c.cpClass();
    expect(cp.type).toBe("ControlPoint2");
  });

  test("updateCurves()", () => {
    const c = new Curve2();
    c.cps = [new ControlPoint2(), new ControlPoint2()];
    expect(c.curves.length).toBe(0);
    c.updateCurves();
    expect(c.curves.length).toBe(1);
    expect(c.curves[0].type).toBe("CubicBezierCurve");
  });

  describe("addCpToFirst()", () => {
    test("if (this.cps.length !== 0)", () => {
      const cps = [
        new ControlPoint2(new THREE.Vector2(1, 2)),
        new ControlPoint2(new THREE.Vector2(3, 4)),
      ];
      const c = new Curve2([cps[0], cps[1]]);
      c.addCpToFirst();
      expect(c.cps.length).toBe(3);
      expect(JSON.stringify(c.cps[0])).toBe(JSON.stringify(cps[0]));
      expect(c.cps[1]).toEqual(cps[0]);
      expect(c.cps[2]).toEqual(cps[1]);
    });

    test("else", () => {
      const c = new Curve2();
      c.addCpToFirst();
      expect(c.cps.length).toBe(1);
    });
  });

  describe("addCpToLast()", () => {
    test("if (this.cps.length !== 0)", () => {
      const cps = [
        new ControlPoint2(new THREE.Vector2(1, 2)),
        new ControlPoint2(new THREE.Vector2(3, 4)),
      ];
      const c = new Curve2([cps[0], cps[1]]);
      c.addCpToLast();
      expect(c.cps.length).toBe(3);
      expect(c.cps[0]).toEqual(cps[0]);
      expect(c.cps[1]).toEqual(cps[1]);
      expect(JSON.stringify(c.cps[2])).toBe(JSON.stringify(cps[1]));
    });

    test("else", () => {
      const c = new Curve2();
      c.addCpToFirst();
      expect(c.cps.length).toBe(1);
    });
  });

  // TODO: index: 0, 2
  // TODO: add spy
  test("interpolateCp()", () => {
    const c = new Curve2([
      new ControlPoint2(
        new THREE.Vector2(0, 0), // cp1.middlePos
        new THREE.Vector2(-1, -1), // cp1.leftPos
        new THREE.Vector2(1, 1), // cp1.rightPos
        false,
        false
      ),
      new ControlPoint2(
        new THREE.Vector2(0, 3), // cp3.middlePos
        new THREE.Vector2(1, 2), // cp3.leftPos
        new THREE.Vector2(-1, 4), // cp3.rightPos
        false,
        false
      ),
    ]); // centerPos: (1, 1.5)
    c.interpolateCp(1);
    expect(c.cps.length).toBe(3);
    expect(c.cps[0].middlePos).toEqual(new THREE.Vector2(0, 0));
    expect(c.cps[0].leftPos).toEqual(new THREE.Vector2(-1, -1));
    expect(c.cps[0].rightPos).toEqual(new THREE.Vector2(0.5, 0.5));
    expect(c.cps[1].middlePos).toEqual(new THREE.Vector2(0.75, 1.5));
    expect(c.cps[1].leftPos).toEqual(new THREE.Vector2(0.75, 1));
    expect(c.cps[1].rightPos).toEqual(new THREE.Vector2(0.75, 2));
    expect(c.cps[2].middlePos).toEqual(new THREE.Vector2(0, 3));
    expect(c.cps[2].leftPos).toEqual(new THREE.Vector2(0.5, 2.5));
    expect(c.cps[2].rightPos).toEqual(new THREE.Vector2(-1, 4));
  });

  // TODO: add spy
  describe("removeCp()", () => {
    const cps = [
      new ControlPoint2(new THREE.Vector2(1, 2)),
      new ControlPoint2(new THREE.Vector2(3, 4)),
      new ControlPoint2(new THREE.Vector2(5, 6)),
    ];
    test.each([
      [[0, 1, 2], -1, [0, 1, 2]],
      [[0, 1, 2], 0, [1, 2]],
      [[0, 1, 2], 1, [0, 2]],
      [[0, 1, 2], 2, [0, 1]],
      [[0, 1, 2], 3, [0, 1, 2]],
    ])(
      "preIndexList:%j, index:%i, postIndexList:%j",
      (preIndexList, index, postIndexList) => {
        const c = new Curve2(preIndexList.map((i) => cps[i]));
        c.removeCp(index);
        expect(c.cps).toEqual(postIndexList.map((i) => cps[i]));
      }
    );
  });

  describe("iIndexList()", () => {
    test.each([
      [0, []],
      [1, []],
      [2, [1]],
      [3, [1, 2]],
      [4, [1, 2, 3]],
    ])("cpsLength:%i, expected:%j", (cpsLength, expected) => {
      const c = new Curve2(Array(cpsLength).fill(new ControlPoint2()));
      expect(c.iIndexList).toEqual(expected);
    });
  });

  describe("safeRIndexList()", () => {
    test.each([
      [0, []],
      [1, []],
      [2, []],
      [3, [0, 1, 2]],
      [4, [0, 1, 2, 3]],
    ])("cpsLength:%i, expected:%j", (cpsLength, expected) => {
      const c = new Curve2(Array(cpsLength).fill(new ControlPoint2()));
      expect(c.safeRIndexList).toEqual(expected);
    });
  });

  describe("rIndexList()", () => {
    test.each([
      [0, []],
      [1, [0]],
      [2, [0, 1]],
      [3, [0, 1, 2]],
      [4, [0, 1, 2, 3]],
    ])("cpsLength:%i, expected:%j", (cpsLength, expected) => {
      const c = new Curve2(Array(cpsLength).fill(new ControlPoint2()));
      expect(c.rIndexList).toEqual(expected);
    });
  });

  test("clone()", () => {
    const c1 = new Curve2([new ControlPoint2(), new ControlPoint2()]);
    const c2 = c1.clone();
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });

  test("copy()", () => {
    const c1 = new Curve2([new ControlPoint2(), new ControlPoint2()]);
    const c2 = new Curve2().copy(c1);
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });

  const _json: CurveJSON<2> = {
    metadata: {
      version: 4.7,
      type: "Curve",
      generator: "Curve.toJSON",
    },
    arcLengthDivisions: 200,
    type: "Curve2",
    autoClose: false,
    curves: [
      {
        metadata: {
          version: 4.7,
          type: "Curve",
          generator: "Curve.toJSON",
        },
        arcLengthDivisions: 200,
        type: "CubicBezierCurve",
        v0: [0, 0],
        v1: [1, 0],
        v2: [2, 1],
        v3: [2, 2],
      },
    ] as (THREE.CurveJSON &
      Record<"v0", [number, number]> &
      Record<"v1", [number, number]> &
      Record<"v2", [number, number]> &
      Record<"v3", [number, number]>)[],
    cps: [
      {
        middlePos: [0, 0],
        leftPos: [-1, 0],
        rightPos: [1, 0],
        isSyncRadius: true,
        isSyncAngle: true,
        type: "ControlPoint2",
        leftV: [-1, 0],
        leftC: { radius: 1, angle: 180 }, // Assume there is no rounding error.
        rightV: [1, 0],
        rightC: { radius: 1, angle: 0 }, // Assume there is no rounding error.
      },
      {
        middlePos: [2, 2],
        leftPos: [2, 1],
        rightPos: [2, 3],
        isSyncRadius: true,
        isSyncAngle: true,
        type: "ControlPoint2",
        leftV: [0, -1],
        leftC: { radius: 1, angle: 270 }, // Assume there is no rounding error.
        rightV: [0, 1],
        rightC: { radius: 1, angle: 90 }, // Assume there is no rounding error.
      },
    ],
  };

  test("toJSON()", () => {
    const c1 = new Curve2([
      new ControlPoint2(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-1, 0),
        new THREE.Vector2(1, 0)
      ),
      new ControlPoint2(
        new THREE.Vector2(2, 2),
        new THREE.Vector2(2, 1),
        new THREE.Vector2(2, 3)
      ),
    ]);
    const json1 = c1.toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const c1 = new Curve2().fromJSON(_json);
    const c2 = new Curve2([
      new ControlPoint2(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-1, 0),
        new THREE.Vector2(1, 0)
      ),
      new ControlPoint2(
        new THREE.Vector2(2, 2),
        new THREE.Vector2(2, 1),
        new THREE.Vector2(2, 3)
      ),
    ]);
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });
});
