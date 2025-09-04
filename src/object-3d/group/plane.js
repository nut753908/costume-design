import * as THREE from "three";

import { FreePlane } from "../../cross-section/free-plane.js";
import { VerticalPlane } from "../../cross-section/vertical-plane.js";
import { deleteFolder } from "../../main/gui.js";

/**
 * @param {GUI} gui
 * @param {FreePlane|VerticalPlane} plane
 * @param {THREE.PlaneHelper} planeHelper
 * @param {THREE.ArrowHelper} arrowHelper
 * @param {string} [name="Plane"] - The folder name.
 * @return {THREE.Group}
 */
export function createPlaneGroup(
  gui,
  plane,
  planeHelper,
  arrowHelper,
  name = "Plane"
) {
  const obj = {
    plane: plane.getPlane(),
    normal: plane.getNormal(),
    point: plane.getPoint(),
  };

  const group = new THREE.Group();
  group.visible = false;

  const _planeHelper = planeHelper.clone();
  _planeHelper.visible = true;
  _planeHelper.plane = obj.plane;
  _planeHelper.size = planeHelper.size;
  // These functions are used by createPlaneHelper() in ./src/object-3d/plane-helper.js.
  planeHelper._updateSizeCallbacks.push((v) => (_planeHelper.size = v));
  group.add(_planeHelper);

  const _arrowHelper = arrowHelper.clone();
  _arrowHelper.visible = true;
  _arrowHelper.setDirection(obj.normal);
  _arrowHelper.position.copy(obj.point);
  // These functions are used by createArrowHelper() in ./src/object-3d/arrow-helper.js.
  arrowHelper._updateLengthCallbacks.push((v) => _arrowHelper.setLength(v));
  group.add(_arrowHelper);

  {
    if (plane instanceof FreePlane) name += " {FreePlane}";
    if (plane instanceof VerticalPlane) name += " {VerticalPlane}";
    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(group, "visible");

    let nFolder;
    if (plane instanceof FreePlane) {
      nFolder = folder.addFolder("normal");
      nFolder.add(plane.normal, "x").step(0.01).onChange(uN);
      nFolder.add(plane.normal, "y").step(0.01).onChange(uN);
      nFolder.add(plane.normal, "z").step(0.01).onChange(uN);
      const pFolder = folder.addFolder("point");
      pFolder.add(plane.point, "x").step(0.01).onChange(uP);
      pFolder.add(plane.point, "y").step(0.01).onChange(uP);
      pFolder.add(plane.point, "z").step(0.01).onChange(uP);
    }
    if (plane instanceof VerticalPlane) {
      folder.add(plane, "u", 0, 1, 0.01).onChange(uU);
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
