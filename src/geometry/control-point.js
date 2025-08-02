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
    folder.add(cp.up, "radius", 0, 1, 0.01).name("up.radius").onChange(update);
    folder.add(cp.up, "phi", 0, Math.PI, 0.01).name("up.phi").onChange(update);
    folder
      .add(cp.up, "theta", 0, 2 * Math.PI, 0.01)
      .name("up.theta")
      .onChange(update);
    folder
      .add(cp.down, "radius", 0, 1, 0.01)
      .name("down.radius")
      .onChange(update);
    folder
      .add(cp.down, "phi", 0, Math.PI, 0.01)
      .name("down.phi")
      .onChange(update);
    folder
      .add(cp.down, "theta", 0, 2 * Math.PI, 0.01)
      .name("down.theta")
      .onChange(update);
  }
  return geometry;
}
