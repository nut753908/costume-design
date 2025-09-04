import * as THREE from "three";

import { FreePlane } from "../../cross-section/free-plane.js";
import { VerticalPlane } from "../../cross-section/vertical-plane.js";
import { deleteFolder } from "../../main/gui.js";
import { createPlaneHelper } from "../plane-helper.js";
import { createArrowHelper } from "../arrow-helper.js";

/**
 * @param {GUI} gui
 * @param {FreePlane|VerticalPlane} plane
 * @param {string} name - The folder name.
 * @return {THREE.Group}
 */
export function createPlaneGroup(gui, plane, name = "Plane") {
  const group = new THREE.Group();
  group.visible = false;

  deleteFolder(gui, name);
  const folder = gui.addFolder(name);
  folder.add(group, "visible");

  const obj = {
    plane: plane.getPlane(),
    normal: plane.getNormal(),
    point: plane.getPoint(),
  };

  group.add(createPlaneHelper(folder, obj.plane, false));
  group.add(createArrowHelper(folder, obj.normal, obj.point, false));

  {
    let nFolder;
    if (plane instanceof FreePlane) {
      const fpFolder = folder.addFolder("FreePlane");
      nFolder = fpFolder.addFolder("normal");
      nFolder.add(plane.normal, "x").step(0.01).onChange(uN);
      nFolder.add(plane.normal, "y").step(0.01).onChange(uN);
      nFolder.add(plane.normal, "z").step(0.01).onChange(uN);
      const pFolder = fpFolder.addFolder("point");
      pFolder.add(plane.point, "x").step(0.01).onChange(uP);
      pFolder.add(plane.point, "y").step(0.01).onChange(uP);
      pFolder.add(plane.point, "z").step(0.01).onChange(uP);
    }
    if (plane instanceof VerticalPlane) {
      const vpFolder = folder.addFolder("VerticalPlane");
      vpFolder.add(plane, "u", 0, 1, 0.01).onChange(uU);
    }

    function uN() /* updateNormal */ {
      plane.normal.normalize();
      obj.plane.copy(plane.getPlane());
      obj.normal.copy(plane.getNormal());
      group.children[1].setDirection(obj.normal);
      nFolder.controllers.forEach((c) => c.updateDisplay());
    }
    function uP() /* updatePoint */ {
      obj.plane.copy(plane.getPlane());
      obj.point.copy(plane.getPoint());
      group.children[1].position.copy(obj.point);
    }
    function uU() /* updateU */ {
      obj.plane.copy(plane.getPlane());
      obj.normal.copy(plane.getNormal());
      obj.point.copy(plane.getPoint());
      group.children[1].setDirection(obj.normal);
      group.children[1].position.copy(obj.point);
    }
  }

  return group;
}
