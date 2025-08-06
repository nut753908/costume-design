import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { safeAsin, safeAcos, reversePI, rotatePI } from "./utils.js";

/**
 * A class representing a 3D control point of curve.
 *
 * ```js
 * import { ControlPoint3 } from "./src/math/control-point-3.js";
 * const cp = new ControlPoint3(
 *   new THREE.Vector3(0, 0, 0),
 *   new THREE.Vector3(0, 1, 0),
 *   new THREE.Vector3(0, -1, 0),
 *   true,
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
   * @param {boolean} [isSyncRadius=true] - Whether to synchronize the "up" and "down" radius.
   * @param {boolean} [isSyncAngle=true] - Whether to synchronize the "up" and "down" angle.
   */
  constructor(
    middlePos = new THREE.Vector3(0, 0, 0),
    upPos = new THREE.Vector3(0, 1, 0),
    downPos = new THREE.Vector3(0, -1, 0),
    isSyncRadius = true,
    isSyncAngle = true
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
     * Whether to synchronize the "up" and "down" radius.
     *
     * @type {boolean}
     */
    this.isSyncRadius = isSyncRadius;

    /**
     * Whether to synchronize the "up" and "down" angle.
     *
     * @type {boolean}
     */
    this.isSyncAngle = isSyncAngle;
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
    this.upR.copy(other.upR);
    this.downPos.copy(other.downPos);
    this.downV.copy(other.downV);
    this.downS.copy(other.downS);
    this.downR.copy(other.downR);
    this.isSyncRadius = other.isSyncRadius;
    this.isSyncAngle = other.isSyncAngle;

    return this;
  }

  /**
   * Initialize "up".
   * "upV" is "upPos - middlePos" and its type is THREE.'V'ector3.
   * "upS" is "upPos - middlePos" and its type is THREE.'S'pherical.
   * "upR" represents each rotation angle of "upV" as THREE.Vector3.
   *   "upR.x" is the rotation angle around the x axis.
   *   "upR.y" is the rotation angle around the y axis.
   *   "upR.z" is the rotation angle around the z axis.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} upPos - The position of upside control point.
   */
  initUp(upPos) {
    this.upPos = upPos;
    this.upV = upPos.clone().sub(this.middlePos);
    this.upS = new THREE.Spherical().setFromVector3(this.upV);
    this.upR = this.getR(this.upV);
  }
  /**
   * Initialize "down".
   * "downV" is "downPos - middlePos" and its type is THREE.'V'ector3.
   * "downS" is "downPos - middlePos" and its type is THREE.'S'pherical.
   * "downR" represents each rotation angle of "downV" as THREE.Vector3.
   *   "downR.x" is the rotation angle around the x axis.
   *   "downR.y" is the rotation angle around the y axis.
   *   "downR.z" is the rotation angle around the z axis.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} downPos - The position of downside control point.
   */
  initDown(downPos) {
    this.downPos = downPos;
    this.downV = downPos.clone().sub(this.middlePos);
    this.downS = new THREE.Spherical().setFromVector3(this.downV);
    this.downR = this.getR(this.downV);
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

    const folder = gui.addFolder("cp");
    folder.add(cp.middlePos, "x", -1, 1).name("middle.x").onChange(uMP);
    folder.add(cp.middlePos, "y", -1, 1).name("middle.y").onChange(uMP);
    folder.add(cp.middlePos, "z", -1, 1).name("middle.z").onChange(uMP);
    folder.add(cp, "isSyncRadius");
    folder.add(cp, "isSyncAngle");
    folder.add(cp.upPos, "x", -1, 1).name("up.x").onChange(uUP);
    folder.add(cp.upPos, "y", -1, 1).name("up.y").onChange(uUP);
    folder.add(cp.upPos, "z", -1, 1).name("up.z").onChange(uUP);
    folder.add(cp.upS, "radius", 0, 1).name("up.radius").onChange(uUS);
    folder.add(cp.upR, "x", 0, 360).name("up.Rx").onChange(uURx);
    folder.add(cp.upR, "y", 0, 360).name("up.Ry").onChange(uURy);
    folder.add(cp.upR, "z", 0, 360).name("up.Rz").onChange(uURz);
    folder.addFolder("---").close(); // separator
    folder.add(cp.downPos, "x", -1, 1).name("down.x").onChange(uDP);
    folder.add(cp.downPos, "y", -1, 1).name("down.y").onChange(uDP);
    folder.add(cp.downPos, "z", -1, 1).name("down.z").onChange(uDP);
    folder.add(cp.downS, "radius", 0, 1).name("down.radius").onChange(uDS);
    folder.add(cp.downR, "x", 0, 360).name("down.Rx").onChange(uDRx);
    folder.add(cp.downR, "y", 0, 360).name("down.Ry").onChange(uDRy);
    folder.add(cp.downR, "z", 0, 360).name("down.Rz").onChange(uDRz);

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
    function uURx() /* updateFromUpRx */ {
      updateFrom("upRx");
    }
    function uURy() /* updateFromUpRy */ {
      updateFrom("upRy");
    }
    function uURz() /* updateFromUpRz */ {
      updateFrom("upRz");
    }
    function uDP() /* updateFromDownPos */ {
      updateFrom("downPos");
    }
    function uDS() /* updateFromDownS */ {
      updateFrom("downS");
    }
    function uDRx() /* updateFromDownRx */ {
      updateFrom("downRx");
    }
    function uDRy() /* updateFromDownRy */ {
      updateFrom("downRy");
    }
    function uDRz() /* updateFromDownRz */ {
      updateFrom("downRz");
    }
    /**
     * @param {"middlePos"|"upPos"|"upS"|"upRx"|"upRy"|"upRz"|"downPos"|"downS"|"downRx"|"downRy"|"downRz"} key - A key to pass to this.updateFrom.
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
    upRx: () => this.updateFromUpRx(),
    upRy: () => this.updateFromUpRy(),
    upRz: () => this.updateFromUpRz(),
    downPos: () => this.updateFromDownPos(),
    downS: () => this.updateFromDownS(),
    downRx: () => this.updateFromDownRx(),
    downRy: () => this.updateFromDownRy(),
    downRz: () => this.updateFromDownRz(),
  };

  /**
   * Update "upPos" and "downPos" from "middlePos".
   */
  updateFromMiddlePos() {
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
  }
  /**
   * Update "upV", "upS" and "upR" from "upPos".
   * Then synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpPos() {
    this.upV.copy(this.upPos.clone().sub(this.middlePos));
    this.upS.setFromVector3(this.upV);
    this.upR.copy(this.getR(this.upV));
    this.syncUpToDown();
  }
  /**
   * Update "upV", "upR" and "upPos" from "upS".
   * Then synchronize from "up" to "down" only if this.isSync = true.
   */
  updateFromUpS() {
    this.upV.setFromSpherical(this.upS);
    this.upR.copy(this.getR(this.upV));
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    this.syncUpToDown();
  }
  /**
   * Update "upS" from "upRx" and the previous "upS" and call updateFromUpS().
   */
  updateFromUpRx() {
    const x = this.upV.x;
    const r_yz = Math.sqrt(this.upS.radius ** 2 - x ** 2);
    const Rx = THREE.MathUtils.degToRad(this.upR.x);
    const y = r_yz * Math.cos(Rx);
    const z = r_yz * Math.sin(Rx);
    this.upS.phi = safeAcos(y, this.upS.radius);
    const r_zx = this.upS.radius * Math.sin(this.upS.phi);
    const theta0 = safeAcos(z, r_zx);
    this.upS.theta = x > 0 ? theta0 : 2 * Math.PI - theta0;
    this.updateFromUpS();
  }
  /**
   * Update "upS" from "upRy" and the previous "upS" and call updateFromUpS().
   */
  updateFromUpRy() {
    this.upS.theta = THREE.MathUtils.degToRad(this.upR.y);
    this.updateFromUpS();
  }
  /**
   * Update "upS" from "upRy" and the previous "upS" and call updateFromUpS().
   */
  updateFromUpRz() {
    const z = this.upV.z;
    const r_xy = Math.sqrt(this.upS.radius ** 2 - z ** 2);
    const Rz = THREE.MathUtils.degToRad(this.upR.z);
    const x = r_xy * Math.cos(Rz);
    const y = r_xy * Math.sin(Rz);
    this.upS.phi = safeAcos(y, this.upS.radius);
    const r_zx = this.upS.radius * Math.sin(this.upS.phi);
    const theta0 = safeAcos(z, r_zx);
    this.upS.theta = x > 0 ? theta0 : 2 * Math.PI - theta0;
    this.updateFromUpS();
  }
  /**
   * Update "downV", "downS" and "downR" from "downPos".
   * Then synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownPos() {
    this.downV.copy(this.downPos.clone().sub(this.middlePos));
    this.downS.setFromVector3(this.downV);
    this.downR.copy(this.getR(this.downV));
    this.syncDownToUp();
  }
  /**
   * Update "downV", "downR" and "downPos" from "downS".
   * Then synchronize from "down" to "up" only if this.isSync = true.
   */
  updateFromDownS() {
    this.downV.setFromSpherical(this.downS);
    this.downR.copy(this.getR(this.downV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
    this.syncDownToUp();
  }
  /**
   * Update "downS" from "downRx" and the previous "downS" and call updateFromDownS().
   */
  updateFromDownRx() {
    const x = this.downV.x;
    const r_yz = Math.sqrt(this.downS.radius ** 2 - x ** 2);
    const Rx = THREE.MathUtils.degToRad(this.downR.x);
    const y = r_yz * Math.cos(Rx);
    const z = r_yz * Math.sin(Rx);
    this.downS.phi = safeAcos(y, this.downS.radius);
    const r_zx = this.downS.radius * Math.sin(this.downS.phi);
    const theta0 = safeAcos(z, r_zx);
    this.downS.theta = x > 0 ? theta0 : 2 * Math.PI - theta0;
    this.updateFromDownS();
  }
  /**
   * Update "downS" from "downRy" and the previous "downS" and call updateFromDownS().
   */
  updateFromDownRy() {
    this.downS.theta = THREE.MathUtils.degToRad(this.downR.y);
    this.updateFromDownS();
  }
  /**
   * Update "downS" from "downRz" and the previous "downS" and call updateFromDownS().
   */
  updateFromDownRz() {
    const z = this.downV.z;
    const r_xy = Math.sqrt(this.downS.radius ** 2 - z ** 2);
    const Rz = THREE.MathUtils.degToRad(this.downR.z);
    const x = r_xy * Math.cos(Rz);
    const y = r_xy * Math.sin(Rz);
    this.downS.phi = safeAcos(y, this.downS.radius);
    const r_zx = this.downS.radius * Math.sin(this.downS.phi);
    const theta0 = safeAcos(z, r_zx);
    this.downS.theta = x > 0 ? theta0 : 2 * Math.PI - theta0;
    this.updateFromDownS();
  }

  /**
   * Synchronize from "up" to "down" with reversing the direction.
   */
  syncUpToDown() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.downS.radius = this.upS.radius;
    if (this.isSyncAngle) {
      this.downS.phi = reversePI(this.upS.phi);
      this.downS.theta = rotatePI(this.upS.theta);
    }
    this.downV.setFromSpherical(this.downS);
    this.downR.copy(this.getR(this.downV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
  }
  /**
   * Synchronize from "down" to "up" with reversing the direction.
   */
  syncDownToUp() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.upS.radius = this.downS.radius;
    if (this.isSyncAngle) {
      this.upS.phi = reversePI(this.downS.phi);
      this.upS.theta = rotatePI(this.downS.theta);
    }
    this.upV.setFromSpherical(this.upS);
    this.upR.copy(this.getR(this.upV));
    this.upPos.copy(this.middlePos.clone().add(this.upV));
  }

  /**
   * Get each rotation angle as THREE.Vector3.
   * x:
   *   The rotation angle of upV around the x (right) axis.
   *   This angle is right-handed and starts at positive y.
   * y:
   *   The rotation angle of upV around the y (up) axis.
   *   This angle is right-handed and starts at positive z.
   * z:
   *   The rotation angle of upV around the z (front) axis.
   *   This angle is right-handed and starts at positive x.
   *
   * @param {THREE.Vector3} v
   * @returns {THREE.Vector3}
   */
  getR(v) {
    return new THREE.Vector3(
      THREE.MathUtils.radToDeg(Math.atan2(-v.z, -v.y) + Math.PI),
      THREE.MathUtils.radToDeg(Math.atan2(-v.x, -v.z) + Math.PI),
      THREE.MathUtils.radToDeg(Math.atan2(-v.y, -v.x) + Math.PI)
    );
  }
}
