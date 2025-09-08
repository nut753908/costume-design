import type { GUI } from "lil-gui";
import * as THREE from "three";
import { closeFolder, deleteFolder } from "../main/gui";
import { createColor } from "../math/color";

export function createPlaneHelper(gui: GUI): PlaneHelperWithCallbacks {
  const obj = {
    normal: new THREE.Vector3(0, 0, 1),
    point: new THREE.Vector3(0, 0, 0),
    size: 0.3,
    color: createColor(0xffff00),
  };
  const helper = new PlaneHelper(
    obj.normal,
    obj.point,
    obj.size,
    obj.color,
  ) as PlaneHelperWithCallbacks;
  helper.visible = false;
  // These function are set in createPlaneGroup() in ./src/object-3d/group/plane.ts.
  helper._updateSizeCallbacks = [];

  {
    deleteFolder(gui, "PlaneHelper");
    const folder = gui.addFolder("PlaneHelper");
    closeFolder(folder);
    folder.add(obj, "size").step(0.01).onChange(uS);
    folder.addColor(obj, "color").onChange(uC);

    function uS() /* updateSize */ {
      helper._updateSizeCallbacks.forEach((c) => c(obj.size));
    }
    function uC() /* updateColor */ {
      helper.setColor(obj.color);
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
export class PlaneHelper extends THREE.PlaneHelper {
  /**
   * The normal direction of the plane. Must be a unit vector.
   */
  normal: THREE.Vector3;

  /**
   * The reference point on the plane.
   */
  point: THREE.Vector3;

  /**
   * Constructs a new plane helper.
   *
   * @param normal - {@link PlaneHelper#normal}
   * @param point - {@link PlaneHelper#point}
   * @param size - {@link THREE.PlaneHelper#size}
   * @param color - {@link THREE.PlaneHelper#hex}
   */
  constructor(
    normal = new THREE.Vector3(0, 0, 1),
    point = new THREE.Vector3(0, 0, 0),
    size = 1,
    color: number | THREE.Color | string = 0xffff00,
  ) {
    super(new THREE.Plane(), size, 0xffff00);
    this.setColor(color);
    this.normal = normal;
    this.point = point;
  }

  /**
   * Set the color of the helper.
   *
   * @param color - The color to set.
   */
  setColor(color: number | THREE.Color | string) {
    if (this.material instanceof THREE.LineBasicMaterial) {
      this.material.color.set(color);
    }
    if (
      "material" in this.children[0] &&
      this.children[0].material instanceof THREE.MeshBasicMaterial
    ) {
      this.children[0].material.color.set(color);
    }
  }

  updateMatrixWorld() {
    this.position.set(0, 0, 0);
    this.scale.set(0.5 * this.size, 0.5 * this.size, 1);
    this.lookAt(this.normal);
    this.position.copy(this.point);
    this.updateWorldMatrix(false, true);
  }
}

export type PlaneHelperWithCallbacks = PlaneHelper &
  Record<"_updateSizeCallbacks", ((size: number) => void)[]>;
