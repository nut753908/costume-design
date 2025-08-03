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
      ...upPos.toArray(),
      ...cp.offset.toArray(),
      ...downPos.toArray(),
    ];
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
  }
  update();

  {
    const pi = Math.PI;
    const folder = gui.addFolder("geometry");
    folder.add(cp.offset, "x", -1, 1).name("offset.x").onChange(update);
    folder.add(cp.offset, "y", -1, 1).name("offset.y").onChange(update);
    folder.add(cp.offset, "z", -1, 1).name("offset.z").onChange(update);
    folder.add(cp, "isSync");
    folder.add(cp.upV, "x", -1, 1).name("up.x").onChange(uUV);
    folder.add(cp.upV, "y", -1, 1).name("up.y").onChange(uUV);
    folder.add(cp.upV, "z", -1, 1).name("up.z").onChange(uUV);
    folder.add(cp.upS, "radius", 0, 1).name("up.radius").onChange(uUS);
    folder.add(cp.upS, "phi", 0, pi).name("up.phi").onChange(uUS);
    folder.add(cp.upS, "theta", -pi, pi).name("up.theta").onChange(uUS);
    folder.addFolder("---").close(); // separator
    folder.add(cp.downV, "x", -1, 1).name("down.x").onChange(uDV);
    folder.add(cp.downV, "y", -1, 1).name("down.y").onChange(uDV);
    folder.add(cp.downV, "z", -1, 1).name("down.z").onChange(uDV);
    folder.add(cp.downS, "radius", 0, 1).name("down.radius").onChange(uDS);
    folder.add(cp.downS, "phi", 0, pi).name("down.phi").onChange(uDS);
    folder.add(cp.downS, "theta", -pi, pi).name("down.theta").onChange(uDS);

    const upDownControllers = folder.controllers.filter(
      (c) => c._name.startsWith("up.") || c._name.startsWith("down.")
    );
    function uUV() /* updateUpV */ {
      updateUpDown("upV");
    }
    function uUS() /* updateUpS */ {
      updateUpDown("upS");
    }
    function uDV() /* updateDownV */ {
      updateUpDown("downV");
    }
    function uDS() /* updateDownS */ {
      updateUpDown("downS");
    }
    /**
     * @param {"upV"|"upS"|"downV"|"downS"} key - A key to pass to cp.updateFrom.
     */
    function updateUpDown(key) {
      cp.updateFrom[key]();
      upDownControllers.forEach((c) => c.updateDisplay());
      update();
    }
  }
  return geometry;
}
