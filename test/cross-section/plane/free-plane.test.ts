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
      new THREE.Vector3(2, 3, 4)
    );
    expect(p.normal).toEqual(new THREE.Vector3(1, 0, 0));
    expect(p.point).toEqual(new THREE.Vector3(2, 3, 4));
  });

  test("getNormal()", () => {
    const p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    expect(p.getNormal()).toEqual(new THREE.Vector3(1, 0, 0));
  });

  test("getPoint()", () => {
    const p = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    expect(p.getPoint()).toEqual(new THREE.Vector3(2, 3, 4));
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
      const p = new FreePlane(normal, new THREE.Vector3(0, 0, 0));
      expect(p.getTopNormal()).toEqual(expected);
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
      const p = new FreePlane(normal, new THREE.Vector3(0, 0, 0));
      expect(p.getBottomNormal()).toEqual(expected);
    });
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
    expect(p1).toEqual(p2);
  });

  test("copy()", () => {
    const p1 = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const p2 = new FreePlane().copy(p1);
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
    };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const p1 = new FreePlane().fromJSON({
      type: "FreePlane",
      normal: [1, 0, 0],
      point: [2, 3, 4],
    });
    const p2 = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    expect(p1).toEqual(p2);
  });
});
