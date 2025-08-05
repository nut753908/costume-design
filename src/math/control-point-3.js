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
   * @param {THREE.Vector3} [middlePos] - The position of middle control point.
   * @param {THREE.Vector3} [upPos] - The position of upside control point.
   * @param {THREE.Vector3} [downPos] - The position of downside control point.
   * @param {boolean} [isSync=true] - Whether to synchronize "up" and "down".
   */
  constructor(
    middlePos = new THREE.Vector3(0, 0, 0),
    upPos = new THREE.Vector3(0, 1, 0),
    downPos = new THREE.Vector3(0, -1, 0),
    isSync = true
  ) {
    /**
     * The position of middle control point.
     *
     * @type {THREE.Vector3}
     */
    this.middlePos = middlePos;

    /**
     * The position of upside control point.
     *
     * @type {THREE.Vector3}
     */
    this.initUp(upPos);

    /**
     * The position of downside control point.
     *
     * @type {THREE.Vector3}
     */
    this.initDown(downPos);

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
    this.middlePos.copy(other.middlePos);
    this.upPos.copy(other.upPos);
    this.upV.copy(other.upV);
    this.upS.copy(other.upS);
    this.downPos.copy(other.downPos);
    this.downV.copy(other.downV);
    this.downS.copy(other.downS);
    this.isSync = other.isSync;

    return this;
  }

  /**
   * Initialize "up".
   * "upPos" splits into "upV" and "upS".
   * "upV" is "upPos - middlePos" and its type is THREE.'V'ector3.
   * "upS" is "upPos - middlePos" and its type is THREE.'S'pherical.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} upPos - The position of upside control point.
   */
  initUp(upPos) {
    this.upPos = upPos;
    this.upV = upPos.clone().sub(this.middlePos);
    this.upS = new THREE.Spherical().setFromVector3(this.upV);
  }
  /**
   * Initialize "down".
   * "downPos" splits into "downV" and "downS".
   * "downV" is "downPos - middlePos" and its type is THREE.'V'ector3.
   * "downS" is "downPos - middlePos" and its type is THREE.'S'pherical.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} downPos - The position of downside control point.
   */
  initDown(downPos) {
    this.downPos = downPos;
    this.downV = downPos.clone().sub(this.middlePos);
    this.downS = new THREE.Spherical().setFromVector3(this.downV);
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
    folder.add(cp.middlePos, "x", -1, 1).name("middle.x").onChange(uMP);
    folder.add(cp.middlePos, "y", -1, 1).name("middle.y").onChange(uMP);
    folder.add(cp.middlePos, "z", -1, 1).name("middle.z").onChange(uMP);
    folder.add(cp, "isSync");
    folder.add(cp.upPos, "x", -1, 1).name("up.x").onChange(uUP);
    folder.add(cp.upPos, "y", -1, 1).name("up.y").onChange(uUP);
    folder.add(cp.upPos, "z", -1, 1).name("up.z").onChange(uUP);
    folder.add(cp.upS, "radius", 0, 1).name("up.radius").onChange(uUS);
    folder.add(cp.upS, "phi", 0, pi).name("up.phi").onChange(uUS);
    folder.add(cp.upS, "theta", -pi, pi).name("up.theta").onChange(uUS);
    folder.addFolder("---").close(); // separator
    folder.add(cp.downPos, "x", -1, 1).name("down.x").onChange(uDP);
    folder.add(cp.downPos, "y", -1, 1).name("down.y").onChange(uDP);
    folder.add(cp.downPos, "z", -1, 1).name("down.z").onChange(uDP);
    folder.add(cp.downS, "radius", 0, 1).name("down.radius").onChange(uDS);
    folder.add(cp.downS, "phi", 0, pi).name("down.phi").onChange(uDS);
    folder.add(cp.downS, "theta", -pi, pi).name("down.theta").onChange(uDS);

    const upDownControllers = folder.controllers.filter(
      (c) => c._name.startsWith("up.") || c._name.startsWith("down.")
    );

    function uMP() /* updateFromMiddlePos */ {
      updateFrom("middlePos");
    }
    function uUP() /* updateFromUpPos */ {
      updateFrom("upPos");
    }
    function uUS() /* updateFromUpS */ {
      updateFrom("upS");
    }
    function uDP() /* updateFromDownPos */ {
      updateFrom("downPos");
    }
    function uDS() /* updateFromDownS */ {
      updateFrom("downS");
    }
    /**
     * @param {"middlePos"|"upPos"|"upS"|"downPos"|"downS"} key - A key to pass to this.updateFrom.
     */
    function updateFrom(key) {
      cp.updateFrom[key]();
      updateGeometry(cp);
      upDownControllers.forEach((c) => c.updateDisplay());
    }
  }

  updateFrom = {
    middlePos: () => this.updateFromMiddlePos(),
    upPos: () => this.updateFromUpPos(),
    upS: () => this.updateFromUpS(),
    downPos: () => this.updateFromDownPos(),
    downS: () => this.updateFromDownS(),
  };

  /**
   * Update "upPos" and "downPos" from "middlePos".
   */
  updateFromMiddlePos() {
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
  }

  /**
   * Update "upV" and "upS" from "upPos" and synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpPos() {
    this.upV.copy(this.upPos.clone().sub(this.middlePos));
    this.upS.setFromVector3(this.upV);
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * Update "upV" and "upPos" from "upS" and synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpS() {
    this.upV.setFromSpherical(this.upS);
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    if (this.isSync) this.syncUpToDown();
  }
  /**
   * Update "downV" and "downS" from "downPos" and synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownPos() {
    this.downV.copy(this.downPos.clone().sub(this.middlePos));
    this.downS.setFromVector3(this.downV);
    if (this.isSync) this.syncDownToUp();
  }
  /**
   * Update "downV" and "downPos" from "downS" and synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownS() {
    this.downV.setFromSpherical(this.downS);
    this.downPos.copy(this.middlePos.clone().add(this.downV));
    if (this.isSync) this.syncDownToUp();
  }

  /**
   * Synchronize from "up" to "down" with reversing the direction.
   */
  syncUpToDown() {
    this.donwV = this.middlePos.clone().sub(this.upPos);
    this.downPos.copy(this.middlePos.clone().add(this.donwV));
    this.downS.setFromVector3(this.donwV);
  }
  /**
   * Synchronize from "down" to "up" with reversing the direction.
   */
  syncDownToUp() {
    this.upV = this.middlePos.clone().sub(this.downPos);
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    this.upS.setFromVector3(this.upV);
  }
}
