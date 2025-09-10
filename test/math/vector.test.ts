import { mean } from "src/math/vector";
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

describe("mean()", () => {
  let spy: MockInstance;

  beforeEach(() => {
    spy = vi.spyOn(console, "error");
  });

  afterEach(() => spy.mockReset());

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
    spy = spy
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
