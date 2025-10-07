import {
  ControlPoint3,
  type ControlPoint3JSON,
} from "src/hair-bundle/curve/control-point-3";
import { Spherical } from "src/math/spherical";
import { reverseInPI, rotate180, rotatePI } from "src/math/utils";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("ControlPoint3", () => {
  test("constructor()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    expect(cp.middlePos).toEqual(new THREE.Vector3(1, 2, 3));
    expect(cp.leftPos).toEqual(new THREE.Vector3(4, 5, 6));
    expect(cp.rightPos).toEqual(new THREE.Vector3(7, 8, 9));
    expect(cp.isSyncRadius).toBe(false);
    expect(cp.isSyncRadius).toBe(false);
    expect(cp.leftV).toEqual(new THREE.Vector3(3, 3, 3));
    expect(cp.leftS.radius).toBeCloseTo(3 * Math.sqrt(3));
    expect(cp.leftS.phi).toBeCloseTo(Math.atan(Math.SQRT2));
    expect(cp.leftS.theta).toBeCloseTo(Math.PI / 4);
    expect(cp.leftA.x).toBeCloseTo(45);
    expect(cp.leftA.y).toBeCloseTo(45);
    expect(cp.leftA.z).toBeCloseTo(45);
    expect(cp.rightV).toEqual(new THREE.Vector3(6, 6, 6));
    expect(cp.rightS.radius).toBeCloseTo(6 * Math.sqrt(3));
    expect(cp.rightS.phi).toBeCloseTo(Math.atan(Math.SQRT2));
    expect(cp.rightS.theta).toBeCloseTo(Math.PI / 4);
    expect(cp.rightA.x).toBeCloseTo(45);
    expect(cp.rightA.y).toBeCloseTo(45);
    expect(cp.rightA.z).toBeCloseTo(45);
  });

  test("updateFromMiddlePos()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.middlePos.copy(new THREE.Vector3(10, 11, 12));
    cp.updateFromMiddlePos();
    expect(cp.leftPos).toEqual(new THREE.Vector3(10 + 3, 11 + 3, 12 + 3));
    expect(cp.rightPos).toEqual(new THREE.Vector3(10 + 6, 11 + 6, 12 + 6));
  });

  test("updateFromLeftPos()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.leftPos.copy(new THREE.Vector3(10, 11, 12));
    cp.updateFromLeftPos();
    expect(cp.leftV).toEqual(new THREE.Vector3(9, 9, 9));
    expect(cp.leftS.radius).toBeCloseTo(9 * Math.sqrt(3));
    expect(cp.leftS.phi).toBeCloseTo(Math.atan(Math.SQRT2));
    expect(cp.leftS.theta).toBeCloseTo(Math.PI / 4);
    expect(cp.leftA.x).toBeCloseTo(45);
    expect(cp.leftA.y).toBeCloseTo(45);
    expect(cp.leftA.z).toBeCloseTo(45);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromRightPos()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.rightPos.copy(new THREE.Vector3(10, 11, 12));
    cp.updateFromRightPos();
    expect(cp.rightV).toEqual(new THREE.Vector3(9, 9, 9));
    expect(cp.rightS.radius).toBeCloseTo(9 * Math.sqrt(3));
    expect(cp.rightS.phi).toBeCloseTo(Math.atan(Math.SQRT2));
    expect(cp.rightS.theta).toBeCloseTo(Math.PI / 4);
    expect(cp.rightA.x).toBeCloseTo(45);
    expect(cp.rightA.y).toBeCloseTo(45);
    expect(cp.rightA.z).toBeCloseTo(45);
    // Skip the this.syncRightToLeft() test.
  });

  test("updateFromLeftS()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.leftS.copy(
      new Spherical(9 * Math.sqrt(3), Math.atan(Math.SQRT2), Math.PI / 4)
    );
    cp.updateFromLeftS();
    expect(cp.leftV.x).toBeCloseTo(9);
    expect(cp.leftV.y).toBeCloseTo(9);
    expect(cp.leftV.z).toBeCloseTo(9);
    expect(cp.leftA.x).toBeCloseTo(45);
    expect(cp.leftA.y).toBeCloseTo(45);
    expect(cp.leftA.z).toBeCloseTo(45);
    expect(cp.leftPos.x).toBeCloseTo(1 + 9);
    expect(cp.leftPos.y).toBeCloseTo(2 + 9);
    expect(cp.leftPos.z).toBeCloseTo(3 + 9);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromLeftAx()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.leftA.x = 0;
    cp.updateFromLeftAx();
    expect(cp.leftV.x).toBeCloseTo(3);
    expect(cp.leftV.y).toBeCloseTo(3 * Math.SQRT2);
    expect(cp.leftV.z).toBeCloseTo(0);
    expect(cp.leftA.x).toBeCloseTo(0);
    expect(cp.leftA.y).toBeCloseTo(90);
    expect(cp.leftA.z).toBeCloseTo(
      THREE.MathUtils.radToDeg(Math.atan(Math.SQRT2))
    );
    expect(cp.leftPos.x).toBeCloseTo(1 + 3);
    expect(cp.leftPos.y).toBeCloseTo(2 + 3 * Math.SQRT2);
    expect(cp.leftPos.z).toBeCloseTo(3 + 0);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromLeftAy()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.leftA.y = 0;
    cp.updateFromLeftAy();
    expect(cp.leftV.x).toBeCloseTo(0);
    expect(cp.leftV.y).toBeCloseTo(3);
    expect(cp.leftV.z).toBeCloseTo(3 * Math.SQRT2);
    expect(cp.leftA.x).toBeCloseTo(
      THREE.MathUtils.radToDeg(Math.atan(Math.SQRT2))
    );
    expect(cp.leftA.y).toBeCloseTo(0);
    expect(cp.leftA.z).toBeCloseTo(90);
    expect(cp.leftPos.x).toBeCloseTo(1 + 0);
    expect(cp.leftPos.y).toBeCloseTo(2 + 3);
    expect(cp.leftPos.z).toBeCloseTo(3 + 3 * Math.SQRT2);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromLeftAz()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.leftA.z = 0;
    cp.updateFromLeftAz();
    expect(cp.leftV.x).toBeCloseTo(3 * Math.SQRT2);
    expect(cp.leftV.y).toBeCloseTo(0);
    expect(cp.leftV.z).toBeCloseTo(3);
    expect(cp.leftA.x).toBeCloseTo(90);
    expect(cp.leftA.y).toBeCloseTo(
      THREE.MathUtils.radToDeg(Math.atan(Math.SQRT2))
    );
    expect(cp.leftA.z).toBeCloseTo(0);
    expect(cp.leftPos.x).toBeCloseTo(1 + 3 * Math.SQRT2);
    expect(cp.leftPos.y).toBeCloseTo(2 + 0);
    expect(cp.leftPos.z).toBeCloseTo(3 + 3);
    // Skip the this.syncLeftToRight() test.
  });

  test("updateFromRightS()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.rightS.copy(
      new Spherical(9 * Math.sqrt(3), Math.atan(Math.SQRT2), Math.PI / 4)
    );
    cp.updateFromRightS();
    expect(cp.rightV.x).toBeCloseTo(9);
    expect(cp.rightV.y).toBeCloseTo(9);
    expect(cp.rightV.z).toBeCloseTo(9);
    expect(cp.rightA.x).toBeCloseTo(45);
    expect(cp.rightA.y).toBeCloseTo(45);
    expect(cp.rightA.z).toBeCloseTo(45);
    expect(cp.rightPos.x).toBeCloseTo(1 + 9);
    expect(cp.rightPos.y).toBeCloseTo(2 + 9);
    expect(cp.rightPos.z).toBeCloseTo(3 + 9);
    // Skip the this.syncRightToLeft() test.
  });

  test("updateFromRightAx()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.rightA.x = 0;
    cp.updateFromRightAx();
    expect(cp.rightV.x).toBeCloseTo(6);
    expect(cp.rightV.y).toBeCloseTo(6 * Math.SQRT2);
    expect(cp.rightV.z).toBeCloseTo(0);
    expect(cp.rightA.x).toBeCloseTo(0);
    expect(cp.rightA.y).toBeCloseTo(90);
    expect(cp.rightA.z).toBeCloseTo(
      THREE.MathUtils.radToDeg(Math.atan(Math.SQRT2))
    );
    expect(cp.rightPos.x).toBeCloseTo(1 + 6);
    expect(cp.rightPos.y).toBeCloseTo(2 + 6 * Math.SQRT2);
    expect(cp.rightPos.z).toBeCloseTo(3 + 0);
    // Skip the this.syncRightToLeft() test.
  });

  test("updateFromRightAy()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.rightA.y = 0;
    cp.updateFromRightAy();
    expect(cp.rightV.x).toBeCloseTo(0);
    expect(cp.rightV.y).toBeCloseTo(6);
    expect(cp.rightV.z).toBeCloseTo(6 * Math.SQRT2);
    expect(cp.rightA.x).toBeCloseTo(
      THREE.MathUtils.radToDeg(Math.atan(Math.SQRT2))
    );
    expect(cp.rightA.y).toBeCloseTo(0);
    expect(cp.rightA.z).toBeCloseTo(90);
    expect(cp.rightPos.x).toBeCloseTo(1 + 0);
    expect(cp.rightPos.y).toBeCloseTo(2 + 6);
    expect(cp.rightPos.z).toBeCloseTo(3 + 6 * Math.SQRT2);
    // Skip the this.syncRightToLeft() test.
  });

  test("updateFromRightAz()", () => {
    const cp = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    cp.rightA.z = 0;
    cp.updateFromRightAz();
    expect(cp.rightV.x).toBeCloseTo(6 * Math.SQRT2);
    expect(cp.rightV.y).toBeCloseTo(0);
    expect(cp.rightV.z).toBeCloseTo(6);
    expect(cp.rightA.x).toBeCloseTo(90);
    expect(cp.rightA.y).toBeCloseTo(
      THREE.MathUtils.radToDeg(Math.atan(Math.SQRT2))
    );
    expect(cp.rightA.z).toBeCloseTo(0);
    expect(cp.rightPos.x).toBeCloseTo(1 + 6 * Math.SQRT2);
    expect(cp.rightPos.y).toBeCloseTo(2 + 0);
    expect(cp.rightPos.z).toBeCloseTo(3 + 6);
    // Skip the this.syncRightToLeft() test.
  });

  describe("syncLeftToRight()", () => {
    test.each([
      [
        false,
        false,
        new Spherical(6 * Math.sqrt(3), Math.atan(Math.SQRT2), Math.PI / 4),
        new THREE.Vector3(6, 6, 6),
        new THREE.Vector3(45, 45, 45),
        new THREE.Vector3(1 + 6, 2 + 6, 3 + 6),
      ],
      [
        true,
        false,
        new Spherical(3 * Math.sqrt(3), Math.atan(Math.SQRT2), Math.PI / 4),
        new THREE.Vector3(3, 3, 3),
        new THREE.Vector3(45, 45, 45),
        new THREE.Vector3(1 + 3, 2 + 3, 3 + 3),
      ],
      [
        false,
        true,
        new Spherical(
          6 * Math.sqrt(3),
          reverseInPI(Math.atan(Math.SQRT2)),
          rotatePI(Math.PI / 4)
        ),
        new THREE.Vector3(-6, -6, -6),
        new THREE.Vector3(rotate180(45), rotate180(45), rotate180(45)),
        new THREE.Vector3(1 - 6, 2 - 6, 3 - 6),
      ],
      [
        true,
        true,
        new Spherical(
          3 * Math.sqrt(3),
          reverseInPI(Math.atan(Math.SQRT2)),
          rotatePI(Math.PI / 4)
        ),
        new THREE.Vector3(-3, -3, -3),
        new THREE.Vector3(rotate180(45), rotate180(45), rotate180(45)),
        new THREE.Vector3(1 - 3, 2 - 3, 3 - 3),
      ],
    ])(
      "isSyncRadius:%o, isSyncAngle:%o",
      (isSyncRadius, isSyncAngle, rightS, rightV, rightA, rightPos) => {
        const cp = new ControlPoint3(
          new THREE.Vector3(1, 2, 3),
          new THREE.Vector3(4, 5, 6),
          new THREE.Vector3(7, 8, 9),
          isSyncRadius,
          isSyncAngle
        );
        cp.syncLeftToRight();
        expect(cp.rightS.radius).toBeCloseTo(rightS.radius);
        expect(cp.rightS.phi).toBeCloseTo(rightS.phi);
        expect(cp.rightS.theta).toBeCloseTo(rightS.theta);
        expect(cp.rightV.x).toBeCloseTo(rightV.x);
        expect(cp.rightV.y).toBeCloseTo(rightV.y);
        expect(cp.rightV.z).toBeCloseTo(rightV.z);
        expect(cp.rightA.x).toBeCloseTo(rightA.x);
        expect(cp.rightA.y).toBeCloseTo(rightA.y);
        expect(cp.rightA.z).toBeCloseTo(rightA.z);
        expect(cp.rightPos.x).toBeCloseTo(rightPos.x);
        expect(cp.rightPos.y).toBeCloseTo(rightPos.y);
        expect(cp.rightPos.z).toBeCloseTo(rightPos.z);
      }
    );
  });

  describe("syncRightToLeft()", () => {
    test.each([
      [
        false,
        false,
        new Spherical(3 * Math.sqrt(3), Math.atan(Math.SQRT2), Math.PI / 4),
        new THREE.Vector3(3, 3, 3),
        new THREE.Vector3(45, 45, 45),
        new THREE.Vector3(1 + 3, 2 + 3, 3 + 3),
      ],
      [
        true,
        false,
        new Spherical(6 * Math.sqrt(3), Math.atan(Math.SQRT2), Math.PI / 4),
        new THREE.Vector3(6, 6, 6),
        new THREE.Vector3(45, 45, 45),
        new THREE.Vector3(1 + 6, 2 + 6, 3 + 6),
      ],
      [
        false,
        true,
        new Spherical(
          3 * Math.sqrt(3),
          reverseInPI(Math.atan(Math.SQRT2)),
          rotatePI(Math.PI / 4)
        ),
        new THREE.Vector3(-3, -3, -3),
        new THREE.Vector3(rotate180(45), rotate180(45), rotate180(45)),
        new THREE.Vector3(1 - 3, 2 - 3, 3 - 3),
      ],
      [
        true,
        true,
        new Spherical(
          6 * Math.sqrt(3),
          reverseInPI(Math.atan(Math.SQRT2)),
          rotatePI(Math.PI / 4)
        ),
        new THREE.Vector3(-6, -6, -6),
        new THREE.Vector3(rotate180(45), rotate180(45), rotate180(45)),
        new THREE.Vector3(1 - 6, 2 - 6, 3 - 6),
      ],
    ])(
      "isSyncRadius:%o, isSyncAngle:%o",
      (isSyncRadius, isSyncAngle, leftS, leftV, leftA, leftPos) => {
        const cp = new ControlPoint3(
          new THREE.Vector3(1, 2, 3),
          new THREE.Vector3(4, 5, 6),
          new THREE.Vector3(7, 8, 9),
          isSyncRadius,
          isSyncAngle
        );
        cp.syncRightToLeft();
        expect(cp.leftS.radius).toBeCloseTo(leftS.radius);
        expect(cp.leftS.phi).toBeCloseTo(leftS.phi);
        expect(cp.leftS.theta).toBeCloseTo(leftS.theta);
        expect(cp.leftV.x).toBeCloseTo(leftV.x);
        expect(cp.leftV.y).toBeCloseTo(leftV.y);
        expect(cp.leftV.z).toBeCloseTo(leftV.z);
        expect(cp.leftA.x).toBeCloseTo(leftA.x);
        expect(cp.leftA.y).toBeCloseTo(leftA.y);
        expect(cp.leftA.z).toBeCloseTo(leftA.z);
        expect(cp.leftPos.x).toBeCloseTo(leftPos.x);
        expect(cp.leftPos.y).toBeCloseTo(leftPos.y);
        expect(cp.leftPos.z).toBeCloseTo(leftPos.z);
      }
    );
  });

  test("clone()", () => {
    const cp1 = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    const cp2 = cp1.clone();
    expect(JSON.stringify(cp1)).toBe(JSON.stringify(cp2));
  });

  test("copy()", () => {
    const cp1 = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    const cp2 = new ControlPoint3().copy(cp1);
    expect(JSON.stringify(cp1)).toBe(JSON.stringify(cp2));
  });

  const _json: ControlPoint3JSON = {
    middlePos: [1, 2, 3],
    leftPos: [4, 5, 6],
    rightPos: [7, 8, 9],
    isSyncRadius: false,
    isSyncAngle: false,
    type: "ControlPoint3",
    leftV: [3, 3, 3],
    leftS: {
      radius: 3 * Math.sqrt(3),
      phi: Math.atan(Math.SQRT2),
      theta: Math.PI / 4,
    }, // Assume there is no rounding error.
    leftA: [45, 45, 45], // Assume there is no rounding error.
    rightV: [6, 6, 6],
    rightS: {
      radius: 6 * Math.sqrt(3),
      phi: Math.atan(Math.SQRT2),
      theta: Math.PI / 4,
    }, // Assume there is no rounding error.
    rightA: [45, 45, 45], // Assume there is no rounding error.
  };

  test("toJSON()", () => {
    const cp1 = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    const json1 = cp1.toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const cp1 = new ControlPoint3().fromJSON(_json);
    const cp2 = new ControlPoint3(
      new THREE.Vector3(1, 2, 3),
      new THREE.Vector3(4, 5, 6),
      new THREE.Vector3(7, 8, 9),
      false,
      false
    );
    expect(JSON.stringify(cp1)).toBe(JSON.stringify(cp2));
  });
});
