import { ControlPoint3 } from "src/curve/control-point-3";
import type { CurveJSON } from "src/curve/curve";
import { Curve3 } from "src/curve/curve-3";
import * as THREE from "three";
import { describe, expect, test, vi } from "vitest";

describe("Curve3", () => {
  test("constructor()", () => {
    const cps = [new ControlPoint3(), new ControlPoint3()];
    const c = new Curve3(cps);
    expect(c.cps).toEqual(cps);
  });

  test("curveClass()", () => {
    const c = new Curve3();
    const curve = new c.curveClass(
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    );
    expect(curve.type).toBe("CubicBezierCurve3");
  });

  test("cpClass()", () => {
    const c = new Curve3();
    const cp = new c.cpClass();
    expect(cp.type).toBe("ControlPoint3");
  });

  test("updateCurves()", () => {
    const c = new Curve3();
    c.cps = [new ControlPoint3(), new ControlPoint3()];
    expect(c.curves.length).toBe(0);
    c.updateCurves();
    expect(c.curves.length).toBe(1);
    expect(c.curves[0].type).toBe("CubicBezierCurve3");
  });

  describe("addCpToFirst()", () => {
    test("if (this.cps.length !== 0)", () => {
      const cps = [
        new ControlPoint3(new THREE.Vector3(1, 2, 3)),
        new ControlPoint3(new THREE.Vector3(4, 5, 6)),
      ];
      const c = new Curve3([cps[0], cps[1]]);
      c.addCpToFirst();
      expect(c.cps.length).toBe(3);
      expect(JSON.stringify(c.cps[0])).toBe(JSON.stringify(cps[0]));
      expect(c.cps[1]).toEqual(cps[0]);
      expect(c.cps[2]).toEqual(cps[1]);
    });

    test("else", () => {
      const c = new Curve3();
      c.addCpToFirst();
      expect(c.cps.length).toBe(1);
    });
  });

  describe("addCpToLast()", () => {
    test("if (this.cps.length !== 0)", () => {
      const cps = [
        new ControlPoint3(new THREE.Vector3(1, 2, 3)),
        new ControlPoint3(new THREE.Vector3(4, 5, 6)),
      ];
      const c = new Curve3([cps[0], cps[1]]);
      c.addCpToLast();
      expect(c.cps.length).toBe(3);
      expect(c.cps[0]).toEqual(cps[0]);
      expect(c.cps[1]).toEqual(cps[1]);
      expect(JSON.stringify(c.cps[2])).toBe(JSON.stringify(cps[1]));
    });

    test("else", () => {
      const c = new Curve3();
      c.addCpToFirst();
      expect(c.cps.length).toBe(1);
    });
  });

  describe("interpolateCp()", () => {
    const cps = [
      new ControlPoint3(
        new THREE.Vector3(0, 0, 0), // cp1.middlePos
        new THREE.Vector3(-1, 0, 0), // cp1.leftPos
        new THREE.Vector3(1, 0, 0), // cp1.rightPos
        false,
        false
      ),
      new ControlPoint3(
        new THREE.Vector3(2, 2, 0), // cp3.middlePos
        new THREE.Vector3(2, 1, 0), // cp3.leftPos
        new THREE.Vector3(2, 3, 0), // cp3.rightPos
        false,
        false
      ),
    ];
    test.each([
      [0, 2, "the index(0) is out of range [1,1]."],
      [1, 3, undefined],
      [2, 2, "the index(2) is out of range [1,1]."],
    ])("preLength:2, index:%i, postLength:%i", (index, postLength, msg) => {
      const spy = vi.spyOn(console, "error");
      if (msg !== undefined) {
        spy.mockImplementationOnce((v) => expect(v).toBe(msg));
      }
      const c = new Curve3([cps[0].clone(), cps[1].clone()]);
      c.interpolateCp(index);
      expect(c.cps.length).toBe(postLength);
      if (postLength === 2) {
        expect(JSON.stringify(c.cps)).toBe(JSON.stringify(cps));
      }
      if (postLength === 3) {
        // centerPos: (1.5, 0.5, 0)
        expect(c.cps[0].middlePos).toEqual(cps[0].middlePos);
        expect(c.cps[0].leftPos).toEqual(cps[0].leftPos);
        expect(c.cps[0].rightPos).toEqual(new THREE.Vector3(0.5, 0, 0)); // Assume there is no rounding error.
        expect(c.cps[1].middlePos).toEqual(new THREE.Vector3(1.375, 0.625, 0)); // Assume there is no rounding error.
        expect(c.cps[1].leftPos).toEqual(new THREE.Vector3(1, 0.25, 0)); // Assume there is no rounding error.
        expect(c.cps[1].rightPos).toEqual(new THREE.Vector3(1.75, 1, 0)); // Assume there is no rounding error.
        expect(c.cps[2].middlePos).toEqual(cps[1].middlePos);
        expect(c.cps[2].leftPos).toEqual(new THREE.Vector3(2, 1.5, 0)); // Assume there is no rounding error.
        expect(c.cps[2].rightPos).toEqual(cps[1].rightPos);
      }
      expect(spy).toHaveBeenCalledTimes(msg !== undefined ? 1 : 0);
      spy.mockReset();
    });
  });

  describe("removeCp()", () => {
    const cps = [
      new ControlPoint3(new THREE.Vector3(1, 2, 3)),
      new ControlPoint3(new THREE.Vector3(4, 5, 6)),
      new ControlPoint3(new THREE.Vector3(7, 8, 9)),
    ];
    test.each([
      [[0, 1, 2], -1, [0, 1, 2], "the index(-1) is out of range [0,2]."],
      [[0, 1, 2], 0, [1, 2], undefined],
      [[0, 1, 2], 1, [0, 2], undefined],
      [[0, 1, 2], 2, [0, 1], undefined],
      [[0, 1, 2], 3, [0, 1, 2], "the index(3) is out of range [0,2]."],
    ])(
      "preIndexList:%j, index:%i, postIndexList:%j",
      (preIndexList, index, postIndexList, msg) => {
        const spy = vi.spyOn(console, "error");
        if (msg !== undefined) {
          spy.mockImplementationOnce((v) => expect(v).toBe(msg));
        }
        const c = new Curve3(preIndexList.map((i) => cps[i]));
        c.removeCp(index);
        expect(c.cps).toEqual(postIndexList.map((i) => cps[i]));
        expect(spy).toHaveBeenCalledTimes(msg !== undefined ? 1 : 0);
        spy.mockReset();
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
    ])("length:%i, expected:%j", (length, expected) => {
      const c = new Curve3(Array(length).fill(new ControlPoint3()));
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
    ])("length:%i, expected:%j", (length, expected) => {
      const c = new Curve3(Array(length).fill(new ControlPoint3()));
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
    ])("length:%i, expected:%j", (length, expected) => {
      const c = new Curve3(Array(length).fill(new ControlPoint3()));
      expect(c.rIndexList).toEqual(expected);
    });
  });

  test("clone()", () => {
    const c1 = new Curve3([new ControlPoint3(), new ControlPoint3()]);
    const c2 = c1.clone();
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });

  test("copy()", () => {
    const c1 = new Curve3([new ControlPoint3(), new ControlPoint3()]);
    const c2 = new Curve3().copy(c1);
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });

  const _json: CurveJSON<3> = {
    metadata: {
      version: 4.7,
      type: "Curve",
      generator: "Curve.toJSON",
    },
    arcLengthDivisions: 200,
    type: "Curve3",
    autoClose: false,
    curves: [
      {
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
      },
    ] as (THREE.CurveJSON &
      Record<"v0", [number, number, number]> &
      Record<"v1", [number, number, number]> &
      Record<"v2", [number, number, number]> &
      Record<"v3", [number, number, number]>)[],
    cps: [
      {
        middlePos: [0, 0, 0],
        leftPos: [-1, 0, 0],
        rightPos: [1, 0, 0],
        isSyncRadius: true,
        isSyncAngle: true,
        type: "ControlPoint3",
        leftV: [-1, 0, 0],
        leftS: { radius: 1, phi: Math.PI / 2, theta: -Math.PI / 2 }, // Assume there is no rounding error.
        leftA: [0, 270, 180],
        rightV: [1, 0, 0],
        rightS: { radius: 1, phi: Math.PI / 2, theta: Math.PI / 2 }, // Assume there is no rounding error.
        rightA: [0, 90, 0],
      },
      {
        middlePos: [2, 2, 0],
        leftPos: [2, 1, 0],
        rightPos: [2, 3, 0],
        isSyncRadius: true,
        isSyncAngle: true,
        type: "ControlPoint3",
        leftV: [0, -1, 0],
        leftS: { radius: 1, phi: Math.PI, theta: 0 }, // Assume there is no rounding error.
        leftA: [180, 0, 270],
        rightV: [0, 1, 0],
        rightS: { radius: 1, phi: 0, theta: 0 }, // Assume there is no rounding error.
        rightA: [0, 0, 90],
      },
    ],
  };

  test("toJSON()", () => {
    const c1 = new Curve3([
      new ControlPoint3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(1, 0, 0)
      ),
      new ControlPoint3(
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(2, 1, 0),
        new THREE.Vector3(2, 3, 0)
      ),
    ]);
    const json1 = c1.toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const c1 = new Curve3().fromJSON(_json);
    const c2 = new Curve3([
      new ControlPoint3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(1, 0, 0)
      ),
      new ControlPoint3(
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(2, 1, 0),
        new THREE.Vector3(2, 3, 0)
      ),
    ]);
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });
});
