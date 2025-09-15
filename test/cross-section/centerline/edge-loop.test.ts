import {
  EdgeLoop,
  type EdgeLoopJSON,
} from "src/cross-section/centerline/edge-loop";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("EdgeLoop", () => {
  test("constructor()", () => {
    const el = new EdgeLoop([0, 1, 2], true);
    expect(el.vertices).toEqual([0, 1, 2]);
    expect(el.closed).toBe(true);
  });

  test("getPoints()", () => {
    const el = new EdgeLoop([0, 1, 2], true);
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const positions = new THREE.Float32BufferAttribute(array, 3);
    expect(el.getPoints(positions)).toEqual([
      new THREE.Vector3(0, 1, 2),
      new THREE.Vector3(3, 4, 5),
      new THREE.Vector3(6, 7, 8),
    ]);
  });

  test("clone()", () => {
    const el1 = new EdgeLoop([0, 1, 2], true);
    const el2 = el1.clone();
    expect(el1).toEqual(el2);
  });

  test("copy()", () => {
    const el1 = new EdgeLoop([0, 1, 2], true);
    const el2 = new EdgeLoop().copy(el1);
    expect(el1).toEqual(el2);
  });

  test("toJSON()", () => {
    const json1 = new EdgeLoop([0, 1, 2], true).toJSON();
    const json2: EdgeLoopJSON = { vertices: [0, 1, 2], closed: true };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const el1 = new EdgeLoop().fromJSON({ vertices: [0, 1, 2], closed: true });
    const el2 = new EdgeLoop([0, 1, 2], true);
    expect(el1).toEqual(el2);
  });
});
