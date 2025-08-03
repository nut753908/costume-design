import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint } from "../math/control-point";

/**
 * @param {GUI} gui
 */
export function createControlPointGeometry(gui) {
  const cp = new ControlPoint();
  const geometry = new THREE.BufferGeometry();

  function update() {
    const upPos = cp.getUpPos();
    const downPos = cp.getDownPos();
    const vertices = [
      upPos.x,
      upPos.y,
      upPos.z,
      cp.offset.x,
      cp.offset.y,
      cp.offset.z,
      downPos.x,
      downPos.y,
      downPos.z,
    ];
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
  }
  update();

  {
    const folder = gui.addFolder("geometry");
    folder.add(cp.offset, "x", -1, 1, 0.01).name("offset.x").onChange(update);
    folder.add(cp.offset, "y", -1, 1, 0.01).name("offset.y").onChange(update);
    folder.add(cp.offset, "z", -1, 1, 0.01).name("offset.z").onChange(update);
    folder.add(cp.up, "x", -1, 1, 0.01).name("up.x").onChange(update);
    folder.add(cp.up, "y", -1, 1, 0.01).name("up.y").onChange(update);
    folder.add(cp.up, "z", -1, 1, 0.01).name("up.z").onChange(update);
    folder.add(cp.down, "x", -1, 1, 0.01).name("down.x").onChange(update);
    folder.add(cp.down, "y", -1, 1, 0.01).name("down.y").onChange(update);
    folder.add(cp.down, "z", -1, 1, 0.01).name("down.z").onChange(update);
  }
  return geometry;
}
