import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { safeAcos, atan2In2PI, reverseInPI, rotatePI } from "../math/utils.js";
import { sphericalToJSON, sphericalFromJSON } from "../math/spherical.js";

/**
 * A class representing a 3D control point of curve.
 *
 * ```js
 * import { ControlPoint3 } from "./src/curve/control-point-3.js";
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

    /**
     * Secret field.
     * This function is used by setGUI() in ./src/curve/control-point-3.js.
     * Set it in advance using createGeometry() in ./src/curve/control-point-3.js.
     *
     * @type {()=>void}
     */
    this._updateGeometry = () => {};
  }

  /**
   * Initialize "up".
   * "upV" is "upPos - middlePos" and its type is THREE.'V'ector3.
   * "upS" is "upPos - middlePos" and its type is THREE.'S'pherical.
   * "upA" represents each angle of "upV" as THREE.Vector3.
   *   "upA.x" is the angle around the x axis.
   *   "upA.y" is the angle around the y axis.
   *   "upA.z" is the angle around the z axis.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} upPos - The position of upside control point.
   */
  initUp(upPos) {
    this.upPos = upPos;
    this.upV = upPos.clone().sub(this.middlePos);
    this.upS = new THREE.Spherical().setFromVector3(this.upV);
    this.upA = this.getA(this.upV);
  }
  /**
   * Initialize "down".
   * "downV" is "downPos - middlePos" and its type is THREE.'V'ector3.
   * "downS" is "downPos - middlePos" and its type is THREE.'S'pherical.
   * "downA" represents each angle of "downV" as THREE.Vector3.
   *   "downA.x" is the angle around the x axis.
   *   "downA.y" is the angle around the y axis.
   *   "downA.z" is the angle around the z axis.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} downPos - The position of downside control point.
   */
  initDown(downPos) {
    this.downPos = downPos;
    this.downV = downPos.clone().sub(this.middlePos);
    this.downS = new THREE.Spherical().setFromVector3(this.downV);
    this.downA = this.getA(this.downV);
  }

  /**
   * Create geometry.
   *
   * @param {THREE.Group} group
   */
  createGeometry(group) {
    const cp = this;

    // This function is used by setGUI() in ./src/curve/control-point-3.js.
    (cp._updateGeometry = () => {
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints(cp.getPoints());

      group.children.forEach((v) => {
        v.geometry.dispose();
        v.geometry = geometry;
      });
    })();
  }

  /**
   * Set GUI.
   *
   * @param {GUI} gui
   * @param {string} name - The cp folder name used in the GUI.
   * @param {()=>void} updateCallback - The callback that is invoked after updating cp.
   */
  setGUI(gui, name = "cp3", updateCallback = () => {}) {
    const cp = this;

    let _tmp;
    const folder = gui.addFolder(name);
    folder.add(cp.middlePos, "x").step(0.01).name("middle.x").onChange(uMP);
    folder.add(cp.middlePos, "y").step(0.01).name("middle.y").onChange(uMP);
    folder.add(cp.middlePos, "z").step(0.01).name("middle.z").onChange(uMP);
    folder.add(cp, "isSyncRadius");
    folder.add(cp, "isSyncAngle");
    folder.add(cp.upPos, "x").step(0.01).name("up.x").onChange(uUP);
    folder.add(cp.upPos, "y").step(0.01).name("up.y").onChange(uUP);
    folder.add(cp.upPos, "z").step(0.01).name("up.z").onChange(uUP);
    _tmp = folder.add(cp.upS, "radius").min(0).step(0.01);
    _tmp.name("up.radius").onChange(uUS);
    folder.add(cp.upA, "x", 0, 360, 1).name("up.Ax").onChange(uUAx);
    folder.add(cp.upA, "y", 0, 360, 1).name("up.Ay").onChange(uUAy);
    folder.add(cp.upA, "z", 0, 360, 1).name("up.Az").onChange(uUAz);
    folder.add(cp.downPos, "x").step(0.01).name("down.x").onChange(uDP);
    folder.add(cp.downPos, "y").step(0.01).name("down.y").onChange(uDP);
    folder.add(cp.downPos, "z").step(0.01).name("down.z").onChange(uDP);
    _tmp = folder.add(cp.downS, "radius").min(0).step(0.01);
    _tmp.name("down.radius").onChange(uDS);
    folder.add(cp.downA, "x", 0, 360, 1).name("down.Ax").onChange(uDAx);
    folder.add(cp.downA, "y", 0, 360, 1).name("down.Ay").onChange(uDAy);
    folder.add(cp.downA, "z", 0, 360, 1).name("down.Az").onChange(uDAz);

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
    function uUAx() /* updateFromUpAx */ {
      updateFrom("upAx");
    }
    function uUAy() /* updateFromUpAy */ {
      updateFrom("upAy");
    }
    function uUAz() /* updateFromUpAz */ {
      updateFrom("upAz");
    }
    function uDP() /* updateFromDownPos */ {
      updateFrom("downPos");
    }
    function uDS() /* updateFromDownS */ {
      updateFrom("downS");
    }
    function uDAx() /* updateFromDownAx */ {
      updateFrom("downAx");
    }
    function uDAy() /* updateFromDownAy */ {
      updateFrom("downAy");
    }
    function uDAz() /* updateFromDownAz */ {
      updateFrom("downAz");
    }
    /**
     * @param {"middlePos"|"upPos"|"upS"|"upAx"|"upAy"|"upAz"|"downPos"|"downS"|"downAx"|"downAy"|"downAz"} key - A key to pass to this.updateFrom.
     */
    function updateFrom(key) {
      cp.updateFrom[key]();
      cp._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/control-point-3.js.
      upDownControllers.forEach((c) => c.updateDisplay());
      updateCallback();
    }
  }

  /**
   * Get points.
   *
   * @returns {Array<THREE.Vector3>}
   */
  getPoints() {
    return [this.upPos, this.middlePos, this.downPos];
  }

  updateFrom = {
    middlePos: () => this.updateFromMiddlePos(),
    upPos: () => this.updateFromUpPos(),
    upS: () => this.updateFromUpS(),
    upAx: () => this.updateFromUpAx(),
    upAy: () => this.updateFromUpAy(),
    upAz: () => this.updateFromUpAz(),
    downPos: () => this.updateFromDownPos(),
    downS: () => this.updateFromDownS(),
    downAx: () => this.updateFromDownAx(),
    downAy: () => this.updateFromDownAy(),
    downAz: () => this.updateFromDownAz(),
  };

  /**
   * Update "upPos" and "downPos" from "middlePos".
   */
  updateFromMiddlePos() {
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
  }
  /**
   * Update "upV", "upS" and "upA" from "upPos".
   */
  updateFromUpPos() {
    this.upV.copy(this.upPos.clone().sub(this.middlePos));
    this.upS.setFromVector3(this.upV);
    this.upA.copy(this.getA(this.upV));
    this.syncUpToDown();
  }
  /**
   * Update "upV", "upA" and "upPos" from "upS".
   */
  updateFromUpS() {
    this.upV.setFromSpherical(this.upS);
    this.upA.copy(this.getA(this.upV));
    this.upPos.copy(this.middlePos.clone().add(this.upV));
    this.syncUpToDown();
  }
  /**
   * Update "upS" from "upAx" and the previous "upS" and call updateFromUpS().
   */
  updateFromUpAx() {
    const x = this.upV.x;
    const r_yz = Math.sqrt(this.upS.radius ** 2 - x ** 2);
    const Ax = THREE.MathUtils.degToRad(this.upA.x);
    const y = r_yz * Math.cos(Ax);
    const z = r_yz * Math.sin(Ax);
    this.upS.phi = safeAcos(y, this.upS.radius);
    this.upS.theta = atan2In2PI(x, z);
    this.updateFromUpS();
  }
  /**
   * Update "upS" from "upAy" and the previous "upS" and call updateFromUpS().
   */
  updateFromUpAy() {
    this.upS.theta = THREE.MathUtils.degToRad(this.upA.y);
    this.updateFromUpS();
  }
  /**
   * Update "upS" from "upAy" and the previous "upS" and call updateFromUpS().
   */
  updateFromUpAz() {
    const z = this.upV.z;
    const r_xy = Math.sqrt(this.upS.radius ** 2 - z ** 2);
    const Az = THREE.MathUtils.degToRad(this.upA.z);
    const x = r_xy * Math.cos(Az);
    const y = r_xy * Math.sin(Az);
    this.upS.phi = safeAcos(y, this.upS.radius);
    this.upS.theta = atan2In2PI(x, z);
    this.updateFromUpS();
  }
  /**
   * Update "downV", "downS" and "downA" from "downPos".
   */
  updateFromDownPos() {
    this.downV.copy(this.downPos.clone().sub(this.middlePos));
    this.downS.setFromVector3(this.downV);
    this.downA.copy(this.getA(this.downV));
    this.syncDownToUp();
  }
  /**
   * Update "downV", "downA" and "downPos" from "downS".
   */
  updateFromDownS() {
    this.downV.setFromSpherical(this.downS);
    this.downA.copy(this.getA(this.downV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
    this.syncDownToUp();
  }
  /**
   * Update "downS" from "downAx" and the previous "downS" and call updateFromDownS().
   */
  updateFromDownAx() {
    const x = this.downV.x;
    const r_yz = Math.sqrt(this.downS.radius ** 2 - x ** 2);
    const Ax = THREE.MathUtils.degToRad(this.downA.x);
    const y = r_yz * Math.cos(Ax);
    const z = r_yz * Math.sin(Ax);
    this.downS.phi = safeAcos(y, this.downS.radius);
    this.downS.theta = atan2In2PI(x, z);
    this.updateFromDownS();
  }
  /**
   * Update "downS" from "downAy" and the previous "downS" and call updateFromDownS().
   */
  updateFromDownAy() {
    this.downS.theta = THREE.MathUtils.degToRad(this.downA.y);
    this.updateFromDownS();
  }
  /**
   * Update "downS" from "downAz" and the previous "downS" and call updateFromDownS().
   */
  updateFromDownAz() {
    const z = this.downV.z;
    const r_xy = Math.sqrt(this.downS.radius ** 2 - z ** 2);
    const Az = THREE.MathUtils.degToRad(this.downA.z);
    const x = r_xy * Math.cos(Az);
    const y = r_xy * Math.sin(Az);
    this.downS.phi = safeAcos(y, this.downS.radius);
    this.downS.theta = atan2In2PI(x, z);
    this.updateFromDownS();
  }

  /**
   * Synchronize from "up" to "down" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  syncUpToDown() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.downS.radius = this.upS.radius;
    if (this.isSyncAngle) {
      this.downS.phi = reverseInPI(this.upS.phi);
      this.downS.theta = rotatePI(this.upS.theta);
    }
    this.downV.setFromSpherical(this.downS);
    this.downA.copy(this.getA(this.downV));
    this.downPos.copy(this.middlePos.clone().add(this.downV));
  }
  /**
   * Synchronize from "down" to "up" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  syncDownToUp() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.upS.radius = this.downS.radius;
    if (this.isSyncAngle) {
      this.upS.phi = reverseInPI(this.downS.phi);
      this.upS.theta = rotatePI(this.downS.theta);
    }
    this.upV.setFromSpherical(this.upS);
    this.upA.copy(this.getA(this.upV));
    this.upPos.copy(this.middlePos.clone().add(this.upV));
  }

  /**
   * Get each angle as THREE.Vector3.
   * x:
   *   The angle of upV around the x (right) axis.
   *   This angle is right-handed and starts at positive y.
   * y:
   *   The angle of upV around the y (up) axis.
   *   This angle is right-handed and starts at positive z.
   * z:
   *   The angle of upV around the z (front) axis.
   *   This angle is right-handed and starts at positive x.
   *
   * @param {THREE.Vector3} v
   * @returns {THREE.Vector3}
   */
  getA(v) {
    return new THREE.Vector3(
      THREE.MathUtils.radToDeg(atan2In2PI(v.z, v.y)),
      THREE.MathUtils.radToDeg(atan2In2PI(v.x, v.z)),
      THREE.MathUtils.radToDeg(atan2In2PI(v.y, v.x))
    );
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
   * @param {ControlPoint3} source - The ControlPoint3 to copy.
   * @returns {ControlPoint3} A reference to this ControlPoint3.
   */
  copy(source) {
    this.middlePos.copy(source.middlePos);
    this.upPos.copy(source.upPos);
    this.upV.copy(source.upV);
    this.upS.copy(source.upS);
    this.upA.copy(source.upA);
    this.downPos.copy(source.downPos);
    this.downV.copy(source.downV);
    this.downS.copy(source.downS);
    this.downA.copy(source.downA);
    this.isSyncRadius = source.isSyncRadius;
    this.isSyncAngle = source.isSyncAngle;

    return this;
  }

  /**
   * Serializes the ControlPoint2 into JSON.
   *
   * @return {Object} A JSON object representing the serialized ControlPoint2.
   */
  toJSON() {
    const data = {};

    data.middlePos = this.middlePos.toArray();
    data.upPos = this.upPos.toArray();
    data.upV = this.upV.toArray();
    data.upS = sphericalToJSON(this.upS);
    data.upA = this.upA.toArray();
    data.downPos = this.downPos.toArray();
    data.downV = this.downV.toArray();
    data.downS = sphericalToJSON(this.downS);
    data.downA = this.downA.toArray();
    data.isSyncRadius = this.isSyncRadius;
    data.isSyncAngle = this.isSyncAngle;

    return data;
  }

  /**
   * Deserializes the ControlPoint2 from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized ControlPoint2.
   * @return {ControlPoint2} A reference to this ControlPoint2.
   */
  fromJSON(json) {
    this.middlePos.fromArray(json.middlePos);
    this.upPos.fromArray(json.upPos);
    this.upV.fromArray(json.upV);
    sphericalFromJSON(this.upS, json.upS);
    this.upA.fromArray(json.upA);
    this.downPos.fromArray(json.downPos);
    this.downV.fromArray(json.downV);
    sphericalFromJSON(this.downS, json.downS);
    this.downA.fromArray(json.downA);
    this.isSyncRadius = json.isSyncRadius;
    this.isSyncAngle = json.isSyncAngle;

    return this;
  }
}
