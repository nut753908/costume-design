import { disposeGroup, objectMap } from "src/main/utils";
import * as THREE from "three";
import { expect, test, vi } from "vitest";

test("disposeGroup()", () => {
  const parent = new THREE.Group();

  const child1 = new THREE.Object3D() as THREE.Object3D &
    Record<"dispose", () => void>;
  child1.dispose = () => {};
  parent.add(child1);

  const child2 = new THREE.Object3D() as THREE.Object3D &
    Record<"geometry", THREE.BufferGeometry>;
  child2.geometry = new THREE.BufferGeometry();
  parent.add(child2);

  const child3 = new THREE.Group();

  const grandchild1 = new THREE.Object3D() as THREE.Object3D &
    Record<"dispose", () => void>;
  grandchild1.dispose = () => {};
  child3.add(grandchild1);

  const grandchild2 = new THREE.Object3D() as THREE.Object3D &
    Record<"geometry", THREE.BufferGeometry>;
  grandchild2.geometry = new THREE.BufferGeometry();
  child3.add(grandchild2);

  parent.add(child3);

  const spies = [
    vi.spyOn(child1, "dispose"),
    vi.spyOn(child2.geometry, "dispose"),
    vi.spyOn(grandchild1, "dispose"),
    vi.spyOn(grandchild2.geometry, "dispose"),
  ];
  disposeGroup(parent);
  spies.map((s) => expect(s).toHaveBeenCalledTimes(1));
});

test("objectMap()", () => {
  const obj = { a: 1, b: 2, c: 3 };
  const func = (v: number): string => String(v);
  expect(objectMap(obj, func)).toEqual({ a: "1", b: "2", c: "3" });
});
