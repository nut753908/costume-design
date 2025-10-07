import type GUI from "lil-gui";
import type { ArrowHelperWithCallbacks } from "src/main/object-3d/arrow-helper";
import {
  PlaneHelper,
  type PlaneHelperWithCallbacks,
} from "src/main/object-3d/plane-helper";
import * as THREE from "three";

/**
 * Abstract class for FreePlane and VerticalPlane.
 */
export abstract class Plane {
  /**
   * Whether to invert the result of this.getNormal().
   */
  inverted: boolean;

  /**
   * Secret field.
   * This function is used by setGUI() in src/cross-section/plane/free-plane.ts.
   * This function is used by setGUI() in src/cross-section/plane/vertical-plane.ts.
   * Set it in advance using createGroup() in src/cross-section/plane/plane.ts.
   */
  _updateGroup: () => void;

  /**
   * Constructs a new plane.
   *
   * @param inverted - {@link Plane#inverted}
   */
  constructor(inverted = false) {
    this.inverted = inverted;
    this._updateGroup = () => {};
  }

  /**
   * Create a group for helpers.
   *
   * @param name - The name for each callback.
   */
  createGroup(
    name: string,
    planeHelper: PlaneHelperWithCallbacks,
    arrowHelper: ArrowHelperWithCallbacks
  ): THREE.Group {
    const group = new THREE.Group();

    const _planeHelper = planeHelper.clone();
    _planeHelper.size = planeHelper.size;
    // These functions are used by createPlaneHelper() in src/object-3d/plane-helper.ts.
    planeHelper._updateVisibleCallbacks[name] = (v) => {
      _planeHelper.visible = v;
    };
    planeHelper._updateSizeCallbacks[name] = (v) => {
      _planeHelper.size = v;
    };
    group.add(_planeHelper);

    const _arrowHelper = arrowHelper.clone();
    // These functions are used by createArrowHelper() in src/object-3d/arrow-helper.ts.
    arrowHelper._updateVisibleCallbacks[name] = (v) => {
      _arrowHelper.visible = v;
    };
    arrowHelper._updateLengthCallbacks[name] = (v) => _arrowHelper.setLength(v);
    group.add(_arrowHelper);

    // This function is used by setGUI() in src/cross-section/plane/free-plane.ts.
    // This function is used by setGUI() in src/cross-section/plane/vertical-plane.ts.
    this._updateGroup = () => {
      if (group.children[0] instanceof PlaneHelper) {
        group.children[0].normal.copy(this.getNormal());
        group.children[0].point.copy(this.getPoint());
      }
      if (group.children[1] instanceof THREE.ArrowHelper) {
        group.children[1].setDirection(this.getNormal());
        group.children[1].position.copy(this.getPoint());
      }
    };
    this._updateGroup();

    return group;
  }

  /**
   * Remove the callbacks for helpers.
   *
   * @param name - The name for callbacks.
   */
  static removeCallbacks(
    name: string,
    planeHelper: PlaneHelperWithCallbacks,
    arrowHelper: ArrowHelperWithCallbacks
  ) {
    delete planeHelper._updateVisibleCallbacks[name];
    delete planeHelper._updateSizeCallbacks[name];
    delete arrowHelper._updateVisibleCallbacks[name];
    delete arrowHelper._updateLengthCallbacks[name];
  }

  /**
   * Set GUI.
   *
   * @param name - The curve folder name used in the GUI.
   * @param updateCallback - The callback that is invoked after updating plane.
   */
  abstract setGUI(gui: GUI, name: string, updateCallback: () => void): void;

  /**
   * Get the normal direction of the plane.
   */
  abstract getNormal(): THREE.Vector3;

  /**
   * Get the reference point on the plane.
   */
  abstract getPoint(): THREE.Vector3;

  /**
   * Get the THREE.Plane instance.
   */
  getPlane(): THREE.Plane {
    const normal = this.getNormal();
    const point = this.getPoint();
    return new THREE.Plane().setFromNormalAndCoplanarPoint(normal, point);
  }
}
