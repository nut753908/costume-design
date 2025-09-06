import * as THREE from "three";

import { GUI } from "lil-gui";
import { createColor } from "../math/color";
import { closeFolder, deleteFolder } from "../main/gui";

/**
 * @param {GUI} gui
 * @return {THREE.PlaneHelper}
 */
export function createPlaneHelper(gui) {
  const obj = {
    normal: new THREE.Vector3(0, 0, 1),
    point: new THREE.Vector3(0, 0, 0),
    size: 0.3,
    hex: createColor(0xffff00),
  };
  const helper = new PlaneHelper(obj.normal, obj.point, obj.size, obj.hex);
  helper.visible = false;
  // These function are set in createPlaneGroup() in ./src/object-3d/group/plane.js.
  helper._updateSizeCallbacks = [];
  {
    deleteFolder(gui, "PlaneHelper");
    const folder = gui.addFolder("PlaneHelper");
    closeFolder(folder);
    folder.add(obj, "size").step(0.01).onChange(uS);
    folder.addColor(obj, "hex").onChange(uH);

    function uS() /* updateSize */ {
      helper._updateSizeCallbacks.forEach((c) => c(obj.size));
    }
    function uH() /* updateHex */ {
      helper.material.color.set(obj.hex);
      helper.children[0].material.color.set(obj.hex);
    }
  }
  return helper;
}

/**
 * A helper object to visualize an instance of {@link Plane}.
 * (This class is created by copying THREE.PlaneHelper.)
 *
 * ```js
 * import { PlaneHelper } from "./src/object-3d/plane-helper";
 * const normal = new THREE.Vector3( 0, 0, 1 );
 * const point = new THREE.Vector3( 0, 0, 0 );
 * const helper = new PlaneHelper( normal, point, 1, 0xffff00 );
 * scene.add( helper );
 * ```
 *
 * @augments THREE.PlaneHelper
 */
class PlaneHelper extends THREE.PlaneHelper {
  /**
   * Constructs a new plane helper.
   *
   * @param {THREE.Vector3} [normal=(0,0,1)] - The normal direction of the plane. Must be a unit vector.
   * @param {THREE.Vector3} [point=(0,0,0)] - The reference point on the plane.
   * @param {number} [size=1] - The side length of plane helper.
   * @param {number|THREE.Color|string} [hex=0xffff00] - The helper's color.
   */
  constructor(
    normal = new THREE.Vector3(0, 0, 1),
    point = new THREE.Vector3(0, 0, 0),
    size = 1,
    hex = 0xffff00
  ) {
    super(new THREE.Plane(), size, hex);

    this.normal = normal;
    this.point = point;
  }

  updateMatrixWorld() {
    this.position.set(0, 0, 0);
    this.scale.set(0.5 * this.size, 0.5 * this.size, 1);
    this.lookAt(this.normal);
    this.position.copy(this.point);
    this.updateWorldMatrix(false, true);
  }
}
