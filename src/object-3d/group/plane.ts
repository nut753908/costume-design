import * as THREE from "three";

import { GUI } from "lil-gui";
import { FreePlane } from "../../cross-section/free-plane";
import { VerticalPlane } from "../../cross-section/vertical-plane";
import { deleteFolder } from "../../main/gui";

/**
 * @param name - The folder name.
 */
export function createPlaneGroup(
  gui: GUI,
  plane: FreePlane | VerticalPlane,
  planeHelper: THREE.PlaneHelper, // TODO: later, change the type from THREE.PlaneHelper to PlaneHelper.
  arrowHelper: THREE.ArrowHelper,
  name = "PlaneGroup"
): THREE.Group {
  const obj = {
    plane: plane.getPlane(),
    normal: plane.getNormal(),
    point: plane.getPoint(),
  };

  const group = new THREE.Group();
  group.visible = false;

  // FIXME:
  const _planeHelper = planeHelper.clone();
  _planeHelper.visible = true;
  _planeHelper.normal = obj.normal;
  _planeHelper.point = obj.point;
  _planeHelper.size = planeHelper.size;
  // These functions are used by createPlaneHelper() in ./src/object-3d/plane-helper.js.
  planeHelper._updateSizeCallbacks.push((v) => (_planeHelper.size = v));
  group.add(_planeHelper);

  // FIXME:
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

    let nFolder: GUI;
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

    // FIXME:
    function uN() /* updateNormal */ {
      plane.normal.normalize();
      obj.plane.copy(plane.getPlane());
      obj.normal.copy(plane.getNormal());
      group.children[0].normal.copy(obj.normal);
      group.children[1].setDirection(obj.normal);
      nFolder.controllers.forEach((c) => c.updateDisplay());
    }
    // FIXME:
    function uP() /* updatePoint */ {
      obj.plane.copy(plane.getPlane());
      obj.point.copy(plane.getPoint());
      group.children[0].point.copy(obj.point);
      group.children[1].position.copy(obj.point);
    }
    // FIXME:
    function uU() /* updateU */ {
      obj.plane.copy(plane.getPlane());
      obj.normal.copy(plane.getNormal());
      obj.point.copy(plane.getPoint());
      group.children[0].normal.copy(obj.normal);
      group.children[0].point.copy(obj.point);
      group.children[1].setDirection(obj.normal);
      group.children[1].position.copy(obj.point);
    }
  }

  return group;
}
