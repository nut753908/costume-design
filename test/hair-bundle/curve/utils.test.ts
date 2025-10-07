import { isInvalidIndex, mean } from "src/hair-bundle/curve/utils";
import * as THREE from "three";
import {
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("isInvalidIndex()", () => {
  test.each([
    [1.1, 0, 2, true, "the index(1.1) is not integer."],
    [1, 0.1, 2, true, "the min(0.1) is not integer."],
    [1, 0, 2.1, true, "the max(2.1) is not integer."],
    [-1, 0, 2, true, "the index(-1) is out of range [0,2]."],
    [0, 0, 2, false, undefined],
    [1, 0, 2, false, undefined],
    [2, 0, 2, false, undefined],
    [3, 0, 2, true, "the index(3) is out of range [0,2]."],
  ])(
    "index:%d, min:%d, max:%d, expected:%o",
    (index, min, max, expected, msg) => {
      const spy = vi.spyOn(console, "error");
      if (msg !== undefined) {
        spy.mockImplementationOnce((v) => expect(v).toBe(msg));
      }
      expect(isInvalidIndex(index, min, max)).toBe(expected);
      expect(spy).toHaveBeenCalledTimes(msg !== undefined ? 1 : 0);
    }
  );
});

describe("mean()", () => {
  let spy: MockInstance;

  beforeEach(() => {
    spy = vi.spyOn(console, "error");
  });

  test("if TVector is THREE.Vector3", () => {
    const v1 = new THREE.Vector3(1, 2, 3);
    const v2 = new THREE.Vector3(3, 6, 9);
    expect(mean(v1, v2)).toEqual(new THREE.Vector3(2, 4, 6));
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("if TVector is THREE.Vector2", () => {
    const v1 = new THREE.Vector2(1, 2);
    const v2 = new THREE.Vector2(3, 6);
    expect(mean(v1, v2)).toEqual(new THREE.Vector2(2, 4));
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test("if TVector is THREE.Vector3 | THREE.Vector2 (invalid type)", () => {
    spy
      .mockImplementationOnce((v) => {
        expect(v).toBe(`\
!(v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3)
&& !(v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2)
- v1: {"x":1,"y":2,"z":3}
- v2: {"x":3,"y":6}
`);
      })
      .mockImplementationOnce((v) => {
        expect(v).toBe(`\
!(v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3)
&& !(v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2)
- v1: {"x":1,"y":2}
- v2: {"x":3,"y":6,"z":9}
`);
      });

    let v1: THREE.Vector3 | THREE.Vector2;
    let v2: THREE.Vector3 | THREE.Vector2;

    v1 = new THREE.Vector3(1, 2, 3);
    v2 = new THREE.Vector2(3, 6);
    mean<THREE.Vector3 | THREE.Vector2>(v1, v2);
    expect(spy).toHaveBeenCalledTimes(1);

    v1 = new THREE.Vector2(1, 2);
    v2 = new THREE.Vector3(3, 6, 9);
    mean<THREE.Vector3 | THREE.Vector2>(v1, v2);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
