import {
  FreePlane,
  type FreePlaneJSON,
} from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("FreePlane", () => {
  test("constructor()", () => {
    const p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4),
      true
    );
    expect(p.normal).toEqual(new THREE.Vector3(1, 0, 0));
    expect(p.point).toEqual(new THREE.Vector3(2, 3, 4));
    expect(p.inverted).toBe(true);
  });

  test("getNormal()", () => {
    let p: FreePlane;

    p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4),
      false
    );
    expect(p.getNormal()).toEqual(new THREE.Vector3(1, 0, 0));

    p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4),
      true
    );
    expect(p.getNormal()).toEqual(new THREE.Vector3(-1, -0, -0));
  });

  test("getPoint()", () => {
    const p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    expect(p.getPoint()).toEqual(new THREE.Vector3(2, 3, 4));
  });

  test("getPlane()", () => {
    const p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    expect(p.getPlane()).toEqual(
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -2)
    );
  });

  test("clone()", () => {
    const p1 = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const p2 = p1.clone();
    p2._updateGroup = p1._updateGroup;
    expect(p1).toEqual(p2);
  });

  test("copy()", () => {
    const p1 = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const p2 = new FreePlane().copy(p1);
    p2._updateGroup = p1._updateGroup;
    expect(p1).toEqual(p2);
  });

  test("toJSON()", () => {
    const p1 = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const json1 = p1.toJSON();
    const json2: FreePlaneJSON = {
      type: "FreePlane",
      normal: [1, 0, 0],
      point: [2, 3, 4],
      inverted: false,
    };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const p1 = new FreePlane().fromJSON({
      type: "FreePlane",
      normal: [1, 0, 0],
      point: [2, 3, 4],
      inverted: false,
    });
    const p2 = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    p2._updateGroup = p1._updateGroup;
    expect(p1).toEqual(p2);
  });
});
