import type { GUI } from "lil-gui";
import { FreePlane } from "src/cross-section/plane/free-plane";
import { VerticalPlane } from "src/cross-section/plane/vertical-plane";
import { deleteFolder } from "src/main/gui";
import type { ArrowHelperWithCallbacks } from "src/object-3d/arrow-helper";
import {
  PlaneHelper,
  type PlaneHelperWithCallbacks,
} from "src/object-3d/plane-helper";
import * as THREE from "three";

/**
 * @param name - The folder name.
 * @param updateCallback - The callback that is invoked after updating plane.
 */
export function createPlaneGroup(
  gui: GUI,
  plane: FreePlane | VerticalPlane,
  planeHelper: PlaneHelperWithCallbacks,
  arrowHelper: ArrowHelperWithCallbacks,
  name = "PlaneGroup",
  updateCallback = (_name: string) => {}
): THREE.Group {
  const obj = {
    plane: plane.getPlane(),
    normal: plane.getNormal(),
    point: plane.getPoint(),
  };

  const group = new THREE.Group();
  group.visible = false;

  const _planeHelper = planeHelper.clone();
  _planeHelper.visible = true;
  _planeHelper.normal = obj.normal;
  _planeHelper.point = obj.point;
  _planeHelper.size = planeHelper.size;
  // These functions are used by createPlaneHelper() in src/object-3d/plane-helper.ts.
  planeHelper._updateSizeCallbacks.push((v) => {
    _planeHelper.size = v;
  });
  group.add(_planeHelper);

  const _arrowHelper = arrowHelper.clone();
  _arrowHelper.visible = true;
  _arrowHelper.setDirection(obj.normal);
  _arrowHelper.position.copy(obj.point);
  // These functions are used by createArrowHelper() in src/object-3d/arrow-helper.ts.
  arrowHelper._updateLengthCallbacks.push((v) => _arrowHelper.setLength(v));
  group.add(_arrowHelper);

  {
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

    function uN() /* updateNormal */ {
      if (!(plane instanceof FreePlane)) return;
      plane.normal.normalize();
      obj.plane.copy(plane.getPlane());
      obj.normal.copy(plane.getNormal());
      if (group.children[0] instanceof PlaneHelper) {
        group.children[0].normal.copy(obj.normal);
      }
      if (group.children[1] instanceof THREE.ArrowHelper) {
        group.children[1].setDirection(obj.normal);
      }
      nFolder.controllers.map((c) => c.updateDisplay());
      updateCallback(name);
    }
    function uP() /* updatePoint */ {
      if (!(plane instanceof FreePlane)) return;
      obj.plane.copy(plane.getPlane());
      obj.point.copy(plane.getPoint());
      if (group.children[0] instanceof PlaneHelper) {
        group.children[0].point.copy(obj.point);
      }
      if (group.children[1] instanceof THREE.ArrowHelper) {
        group.children[1].position.copy(obj.point);
      }
      updateCallback(name);
    }
    function uU() /* updateU */ {
      if (!(plane instanceof VerticalPlane)) return;
      obj.plane.copy(plane.getPlane());
      obj.normal.copy(plane.getNormal());
      obj.point.copy(plane.getPoint());
      if (group.children[0] instanceof PlaneHelper) {
        group.children[0].normal.copy(obj.normal);
        group.children[0].point.copy(obj.point);
      }
      if (group.children[1] instanceof THREE.ArrowHelper) {
        group.children[1].setDirection(obj.normal);
        group.children[1].position.copy(obj.point);
      }
      updateCallback(name);
    }
  }

  return group;
}
