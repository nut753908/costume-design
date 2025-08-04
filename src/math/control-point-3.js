import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

/**
 * A class representing a 3D control point of curve.
 *
 * ```js
 * import { ControlPoint3 } from "./src/math/control-point-3.js";
 * const cp = new ControlPoint3(
 *   new THREE.Vector3(0, 0, 0),
 *   new THREE.Vector3(0, 1, 0),
 *   new THREE.Vector3(0, -1, 0),
 *   true
 * );
 * ```
 */
export class ControlPoint3 {
  /**
   * Constructs a new ControlPoint3.
   *
   * @param {THREE.Vector3} [offset] - The offset position for control points.
   * @param {THREE.Vector3|THREE.Spherical} [up] - The vector from the offset to upside control point.
   * @param {THREE.Vector3|THREE.Spherical} [down] - The vector from the offset to downside control point.
   * @param {boolean} [isSync=true] - Whether to synchronize "up" and "down".
   */
  constructor(
    offset = new THREE.Vector3(0, 0, 0),
    up = new THREE.Vector3(0, 1, 0),
    down = new THREE.Vector3(0, -1, 0),
    isSync = true
  ) {
    /**
     * The offset position for control points.
     *
     * @type {THREE.Vector3}
     */
    this.offset = offset;

    /**
     * The vector from the offset to upside control point.
     *
     * @type {THREE.Vector3|THREE.Spherical}
     */
    this.initUp(up);

    /**
     * The vector from the offset to downside control point.
     *
     * @type {THREE.Vector3|THREE.Spherical}
     */
    this.initDown(down);

    /**
     * Whether to synchronize "up" and "down".
     *
     * @type {boolean}
     */
    this.isSync = isSync;
  }

  /**
   * Returns a new ControlPoint3 with copied values from this instance.
   *
   * @returns {ControlPoint3} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given ControlPoint3 to this instance.
   *
   * @param {ControlPoint3} other - The ControlPoint3 to copy.
   * @returns {ControlPoint3} A reference to this ControlPoint3.
   */
  copy(other) {
    this.offset.copy(other.offset);
    this.upV.copy(other.upV);
    this.upS.copy(other.upS);
    this.downV.copy(other.downV);
    this.downS.copy(other.downS);
    this.isSync = other.isSync;

    return this;
  }

  /**
   * Initialize "up", which splits into "upV" and "upS".
   * "upV" is "up" and its type is THREE.'V'ector3.
   * "upS" is "up" and its type is THREE.'S'pherical.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3|THREE.Spherical}
   */
  initUp(up) {
    if (up instanceof THREE.Vector3) {
      this.upV = up;
      this.upS = new THREE.Spherical().setFromVector3(up);
    } else if (up instanceof THREE.Spherical) {
      this.upV = new THREE.Vector3().setFromSpherical(up);
      this.upS = up;
    }
  }
  /**
   * Initialize "down", which splits into "downV" and "downS".
   * "downV" is "down" and its type is THREE.'V'ector3.
   * "downS" is "down" and its type is THREE.'S'pherical.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3|THREE.Spherical}
   */
  initDown(down) {
    if (down instanceof THREE.Vector3) {
      this.downV = down;
      this.downS = new THREE.Spherical().setFromVector3(down);
    } else if (down instanceof THREE.Spherical) {
      this.downV = new THREE.Vector3().setFromSpherical(down);
      this.downS = down;
    }
  }

  /**
   * Set GUI with updateGeometry.
   *
   * @param {GUI} gui
   * @param {(cp:ControlPoint3)=>void} updateGeometry - A callback that can update the geometry.
   */
  setGUI(gui, updateGeometry) {
    const cp = this;

    updateGeometry(cp); // First, update the geometry.

    const pi = Math.PI;
    const folder = gui.addFolder("cp");
    folder.add(cp.offset, "x", -1, 1).name("offset.x").onChange(uO);
    folder.add(cp.offset, "y", -1, 1).name("offset.y").onChange(uO);
    folder.add(cp.offset, "z", -1, 1).name("offset.z").onChange(uO);
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

    function uO() /* updateFromOffset */ {
      updateGeometry(cp);
    }
    function uUV() /* updateFromUpV */ {
      updateFrom("upV");
    }
    function uUS() /* updateFromUpS */ {
      updateFrom("upS");
    }
    function uDV() /* updateFromDownV */ {
      updateFrom("downV");
    }
    function uDS() /* updateFromDownS */ {
      updateFrom("downS");
    }
    /**
     * @param {"upV"|"upS"|"downV"|"downS"} key - A key to pass to this.updateFrom.
     */
    function updateFrom(key) {
      cp.updateFrom[key]();
      updateGeometry(cp);
      upDownControllers.forEach((c) => c.updateDisplay());
    }
  }

  updateFrom = {
    upV: () => this.updateFromUpV(),
    upS: () => this.updateFromUpS(),
    downV: () => this.updateFromDownV(),
    downS: () => this.updateFromDownS(),
  };

  /**
   * Update "upS" from "upV" and synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpV() {
    this.upS.setFromVector3(this.upV);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * Update "upV" from "upS" and synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpS() {
    this.upV.setFromSpherical(this.upS);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * Update "downS" from "downV" and synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownV() {
    this.downS.setFromVector3(this.downV);
    if (this.isSync) this.syncDownToUp();
  }
  /**
   * Update "downV" from "downS" and synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownS() {
    this.downV.setFromSpherical(this.downS);
    if (this.isSync) this.syncDownToUp();
  }

  /**
   * Synchronize from "up" to "down" with reversing the direction.
   */
  syncUpToDown() {
    this.downV.copy(this.upV.clone().negate());
    this.downS.setFromVector3(this.downV);
  }
  /**
   * Synchronize from "down" to "up" with reversing the direction.
   */
  syncDownToUp() {
    this.upV.copy(this.downV.clone().negate());
    this.upS.setFromVector3(this.upV);
  }

  /**
   * Get the position of upside control point.
   *
   * @returns {THREE.Vector3}
   */
  get upPos() {
    return this.offset.clone().add(this.upV);
  }
  /**
   * Get the position of downside control point.
   *
   * @returns {THREE.Vector3}
   */
  get downPos() {
    return this.offset.clone().add(this.downV);
  }
}
