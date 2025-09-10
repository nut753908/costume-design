import { mean } from "src/math/vector";
import * as THREE from "three";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("mean()", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  beforeEach(() => spy.mockClear());

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
