import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint } from "../math/control-point";

/**
 * @param {GUI} gui
 */
export function createControlPointGeometry(gui) {
  const cp = new ControlPoint();
  const geometry = new THREE.BufferGeometry();

  function updateGeometry() {
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
  updateGeometry();

  {
    const folder = gui.addFolder("geometry");
    folder
      .add(cp.offset, "x", -1, 1, 0.01)
      .name("offset.x")
      .onChange(updateGeometry);
    folder
      .add(cp.offset, "y", -1, 1, 0.01)
      .name("offset.y")
      .onChange(updateGeometry);
    folder
      .add(cp.offset, "z", -1, 1, 0.01)
      .name("offset.z")
      .onChange(updateGeometry);
    folder.add(cp, "isSync");
    folder
      .add(cp.upV, "x", -1, 1, 0.01)
      .name("up.x")
      .onChange(() => {
        cp.updateFromUpV();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.upV, "y", -1, 1, 0.01)
      .name("up.y")
      .onChange(() => {
        cp.updateFromUpV();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.upV, "z", -1, 1, 0.01)
      .name("up.z")
      .onChange(() => {
        cp.updateFromUpV();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.upS, "radius", 0, 1, 0.01)
      .name("up.radius")
      .onChange(() => {
        cp.updateFromUpS();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.upS, "phi", 0, Math.PI, 0.01)
      .name("up.phi")
      .onChange(() => {
        cp.updateFromUpS();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.upS, "theta", -Math.PI, Math.PI, 0.01)
      .name("up.theta")
      .onChange(() => {
        cp.updateFromUpS();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder.addFolder("---").close(); // separator
    folder
      .add(cp.downV, "x", -1, 1, 0.01)
      .name("down.x")
      .onChange(() => {
        cp.updateFromDownV();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.downV, "y", -1, 1, 0.01)
      .name("down.y")
      .onChange(() => {
        cp.updateFromDownV();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.downV, "z", -1, 1, 0.01)
      .name("down.z")
      .onChange(() => {
        cp.updateFromDownV();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.downS, "radius", 0, 1, 0.01)
      .name("down.radius")
      .onChange(() => {
        cp.updateFromDownS();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.downS, "phi", 0, Math.PI, 0.01)
      .name("down.phi")
      .onChange(() => {
        cp.updateFromDownS();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
    folder
      .add(cp.downS, "theta", -Math.PI, Math.PI, 0.01)
      .name("down.theta")
      .onChange(() => {
        cp.updateFromDownS();
        folder.controllers.forEach((c) => c.updateDisplay());
        updateGeometry();
      });
  }
  return geometry;
}
