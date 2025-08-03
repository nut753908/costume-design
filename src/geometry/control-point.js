import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ControlPoint } from "../math/control-point";

/**
 * @param {GUI} gui
 * @param {ControlPoint} cp
 */
export function createControlPointGeometry(gui, cp = new ControlPoint()) {
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
    const p = Math.PI;
    const folder = gui.addFolder("geometry");
    folder.add(cp.offset, "x", -1, 1).name("offset.x").onChange(update);
    folder.add(cp.offset, "y", -1, 1).name("offset.y").onChange(update);
    folder.add(cp.offset, "z", -1, 1).name("offset.z").onChange(update);
    folder.add(cp, "isSync");
    folder.add(cp.upV, "x", -1, 1).name("up.x").onChange(uv);
    folder.add(cp.upV, "y", -1, 1).name("up.y").onChange(uv);
    folder.add(cp.upV, "z", -1, 1).name("up.z").onChange(uv);
    folder.add(cp.upS, "radius", 0, 1).name("up.radius").onChange(us);
    folder.add(cp.upS, "phi", 0, p).name("up.phi").onChange(us);
    folder.add(cp.upS, "theta", -p, p).name("up.theta").onChange(us);
    folder.addFolder("---").close(); // separator
    folder.add(cp.downV, "x", -1, 1).name("down.x").onChange(dv);
    folder.add(cp.downV, "y", -1, 1).name("down.y").onChange(dv);
    folder.add(cp.downV, "z", -1, 1).name("down.z").onChange(dv);
    folder.add(cp.downS, "radius", 0, 1).name("down.radius").onChange(ds);
    folder.add(cp.downS, "phi", 0, p).name("down.phi").onChange(ds);
    folder.add(cp.downS, "theta", -p, p).name("down.theta").onChange(ds);

    const controllers = folder.controllers.filter(
      (c) => c._name.startsWith("up.") || c._name.startsWith("down.")
    );
    function uv() {
      updateFrom("upV");
    }
    function us() {
      updateFrom("upS");
    }
    function dv() {
      updateFrom("downV");
    }
    function ds() {
      updateFrom("downS");
    }
    function updateFrom(key) {
      cp.updateFrom[key]();
      controllers.forEach((c) => c.updateDisplay());
      update();
    }
  }
  return geometry;
}
