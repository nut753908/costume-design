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
 *   new THREE.Vector3(-1, 0, 0),
 *   new THREE.Vector3(1, 0, 0),
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
   * @param {THREE.Vector3} [leftPos] - The position of leftside control point.
   * @param {THREE.Vector3} [rightPos] - The position of rightside control point.
   * @param {boolean} [isSyncRadius=true] - Whether to synchronize the "left" and "right" radius.
   * @param {boolean} [isSyncAngle=true] - Whether to synchronize the "left" and "right" angle.
   */
  constructor(
    middlePos = new THREE.Vector3(0, 0, 0),
    leftPos = new THREE.Vector3(-1, 0, 0),
    rightPos = new THREE.Vector3(1, 0, 0),
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
     * The position of leftside control point.
     *
     * @type {THREE.Vector3}
     */
    this.initLeft(leftPos);

    /**
     * The position of rightside control point.
     *
     * @type {THREE.Vector3}
     */
    this.initRight(rightPos);

    /**
     * Whether to synchronize the "left" and "right" radius.
     *
     * @type {boolean}
     */
    this.isSyncRadius = isSyncRadius;

    /**
     * Whether to synchronize the "left" and "right" angle.
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
   * Initialize "left".
   * "leftV" is "leftPos - middlePos" and its type is THREE.'V'ector3.
   * "leftS" is "leftPos - middlePos" and its type is THREE.'S'pherical.
   * "leftA" represents each angle of "leftV" as THREE.Vector3.
   *   "leftA.x" is the angle around the x axis.
   *   "leftA.y" is the angle around the y axis.
   *   "leftA.z" is the angle around the z axis.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} leftPos - The position of leftside control point.
   */
  initLeft(leftPos) {
    this.leftPos = leftPos;
    this.leftV = leftPos.clone().sub(this.middlePos);
    this.leftS = new THREE.Spherical().setFromVector3(this.leftV);
    this.leftA = this.getA(this.leftV);
  }
  /**
   * Initialize "right".
   * "rightV" is "rightPos - middlePos" and its type is THREE.'V'ector3.
   * "rightS" is "rightPos - middlePos" and its type is THREE.'S'pherical.
   * "rightA" represents each angle of "rightV" as THREE.Vector3.
   *   "rightA.x" is the angle around the x axis.
   *   "rightA.y" is the angle around the y axis.
   *   "rightA.z" is the angle around the z axis.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector3} rightPos - The position of rightside control point.
   */
  initRight(rightPos) {
    this.rightPos = rightPos;
    this.rightV = rightPos.clone().sub(this.middlePos);
    this.rightS = new THREE.Spherical().setFromVector3(this.rightV);
    this.rightA = this.getA(this.rightV);
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
    folder.add(cp.leftPos, "x").step(0.01).name("left.x").onChange(uUP);
    folder.add(cp.leftPos, "y").step(0.01).name("left.y").onChange(uUP);
    folder.add(cp.leftPos, "z").step(0.01).name("left.z").onChange(uUP);
    _tmp = folder.add(cp.leftS, "radius").min(0).step(0.01);
    _tmp.name("left.radius").onChange(uUS);
    folder.add(cp.leftA, "x", 0, 360, 1).name("left.Ax").onChange(uUAx);
    folder.add(cp.leftA, "y", 0, 360, 1).name("left.Ay").onChange(uUAy);
    folder.add(cp.leftA, "z", 0, 360, 1).name("left.Az").onChange(uUAz);
    folder.add(cp.rightPos, "x").step(0.01).name("right.x").onChange(uDP);
    folder.add(cp.rightPos, "y").step(0.01).name("right.y").onChange(uDP);
    folder.add(cp.rightPos, "z").step(0.01).name("right.z").onChange(uDP);
    _tmp = folder.add(cp.rightS, "radius").min(0).step(0.01);
    _tmp.name("right.radius").onChange(uDS);
    folder.add(cp.rightA, "x", 0, 360, 1).name("right.Ax").onChange(uDAx);
    folder.add(cp.rightA, "y", 0, 360, 1).name("right.Ay").onChange(uDAy);
    folder.add(cp.rightA, "z", 0, 360, 1).name("right.Az").onChange(uDAz);

    const leftRightControllers = folder.controllers.filter(
      (c) => c._name.startsWith("left.") || c._name.startsWith("right.")
    );

    function uMP() /* updateFromMiddlePos */ {
      updateFrom("middlePos");
    }
    function uUP() /* updateFromLeftPos */ {
      updateFrom("leftPos");
    }
    function uUS() /* updateFromLeftS */ {
      updateFrom("leftS");
    }
    function uUAx() /* updateFromLeftAx */ {
      updateFrom("leftAx");
    }
    function uUAy() /* updateFromLeftAy */ {
      updateFrom("leftAy");
    }
    function uUAz() /* updateFromLeftAz */ {
      updateFrom("leftAz");
    }
    function uDP() /* updateFromRightPos */ {
      updateFrom("rightPos");
    }
    function uDS() /* updateFromRightS */ {
      updateFrom("rightS");
    }
    function uDAx() /* updateFromRightAx */ {
      updateFrom("rightAx");
    }
    function uDAy() /* updateFromRightAy */ {
      updateFrom("rightAy");
    }
    function uDAz() /* updateFromRightAz */ {
      updateFrom("rightAz");
    }
    /**
     * @param {"middlePos"|"leftPos"|"leftS"|"leftAx"|"leftAy"|"leftAz"|"rightPos"|"rightS"|"rightAx"|"rightAy"|"rightAz"} key - A key to pass to this.updateFrom.
     */
    function updateFrom(key) {
      cp.updateFrom[key]();
      cp._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/control-point-3.js.
      leftRightControllers.forEach((c) => c.updateDisplay());
      updateCallback();
    }
  }

  /**
   * Get points.
   *
   * @returns {Array<THREE.Vector3>}
   */
  getPoints() {
    return [this.leftPos, this.middlePos, this.rightPos];
  }

  updateFrom = {
    middlePos: () => this.updateFromMiddlePos(),
    leftPos: () => this.updateFromLeftPos(),
    leftS: () => this.updateFromLeftS(),
    leftAx: () => this.updateFromLeftAx(),
    leftAy: () => this.updateFromLeftAy(),
    leftAz: () => this.updateFromLeftAz(),
    rightPos: () => this.updateFromRightPos(),
    rightS: () => this.updateFromRightS(),
    rightAx: () => this.updateFromRightAx(),
    rightAy: () => this.updateFromRightAy(),
    rightAz: () => this.updateFromRightAz(),
  };

  /**
   * Update "leftPos" and "rightPos" from "middlePos".
   */
  updateFromMiddlePos() {
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
  }
  /**
   * Update "leftV", "leftS" and "leftA" from "leftPos".
   */
  updateFromLeftPos() {
    this.leftV.copy(this.leftPos.clone().sub(this.middlePos));
    this.leftS.setFromVector3(this.leftV);
    this.leftA.copy(this.getA(this.leftV));
    this.syncLeftToRight();
  }
  /**
   * Update "leftV", "leftA" and "leftPos" from "leftS".
   */
  updateFromLeftS() {
    this.leftV.setFromSpherical(this.leftS);
    this.leftA.copy(this.getA(this.leftV));
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
    this.syncLeftToRight();
  }
  /**
   * Update "leftS" from "leftAx" and the previous "leftS" and call updateFromLeftS().
   */
  updateFromLeftAx() {
    const x = this.leftV.x;
    const r_yz = Math.sqrt(this.leftS.radius ** 2 - x ** 2);
    const Ax = THREE.MathUtils.degToRad(this.leftA.x);
    const y = r_yz * Math.cos(Ax);
    const z = r_yz * Math.sin(Ax);
    this.leftS.phi = safeAcos(y, this.leftS.radius);
    this.leftS.theta = atan2In2PI(x, z);
    this.updateFromLeftS();
  }
  /**
   * Update "leftS" from "leftAy" and the previous "leftS" and call leftdateFromLeftS().
   */
  updateFromLeftAy() {
    this.leftS.theta = THREE.MathUtils.degToRad(this.leftA.y);
    this.updateFromLeftS();
  }
  /**
   * Update "leftS" from "leftAy" and the previous "leftS" and call updateFromLeftS().
   */
  updateFromLeftAz() {
    const z = this.leftV.z;
    const r_xy = Math.sqrt(this.leftS.radius ** 2 - z ** 2);
    const Az = THREE.MathUtils.degToRad(this.leftA.z);
    const x = r_xy * Math.cos(Az);
    const y = r_xy * Math.sin(Az);
    this.leftS.phi = safeAcos(y, this.leftS.radius);
    this.leftS.theta = atan2In2PI(x, z);
    this.updateFromLeftS();
  }
  /**
   * Update "rightV", "rightS" and "rightA" from "rightPos".
   */
  updateFromRightPos() {
    this.rightV.copy(this.rightPos.clone().sub(this.middlePos));
    this.rightS.setFromVector3(this.rightV);
    this.rightA.copy(this.getA(this.rightV));
    this.syncRightToLeft();
  }
  /**
   * Update "rightV", "rightA" and "rightPos" from "rightS".
   */
  updateFromRightS() {
    this.rightV.setFromSpherical(this.rightS);
    this.rightA.copy(this.getA(this.rightV));
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
    this.syncRightToLeft();
  }
  /**
   * Update "rightS" from "rightAx" and the previous "rightS" and call updateFromRightS().
   */
  updateFromRightAx() {
    const x = this.rightV.x;
    const r_yz = Math.sqrt(this.rightS.radius ** 2 - x ** 2);
    const Ax = THREE.MathUtils.degToRad(this.rightA.x);
    const y = r_yz * Math.cos(Ax);
    const z = r_yz * Math.sin(Ax);
    this.rightS.phi = safeAcos(y, this.rightS.radius);
    this.rightS.theta = atan2In2PI(x, z);
    this.updateFromRightS();
  }
  /**
   * Update "rightS" from "rightAy" and the previous "rightS" and call updateFromRightS().
   */
  updateFromRightAy() {
    this.rightS.theta = THREE.MathUtils.degToRad(this.rightA.y);
    this.updateFromRightS();
  }
  /**
   * Update "rightS" from "rightAz" and the previous "rightS" and call updateFromRightS().
   */
  updateFromRightAz() {
    const z = this.rightV.z;
    const r_xy = Math.sqrt(this.rightS.radius ** 2 - z ** 2);
    const Az = THREE.MathUtils.degToRad(this.rightA.z);
    const x = r_xy * Math.cos(Az);
    const y = r_xy * Math.sin(Az);
    this.rightS.phi = safeAcos(y, this.rightS.radius);
    this.rightS.theta = atan2In2PI(x, z);
    this.updateFromRightS();
  }

  /**
   * Synchronize from "left" to "right" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  syncLeftToRight() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.rightS.radius = this.leftS.radius;
    if (this.isSyncAngle) {
      this.rightS.phi = reverseInPI(this.leftS.phi);
      this.rightS.theta = rotatePI(this.leftS.theta);
    }
    this.rightV.setFromSpherical(this.rightS);
    this.rightA.copy(this.getA(this.rightV));
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
  }
  /**
   * Synchronize from "right" to "left" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  syncRightToLeft() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.leftS.radius = this.rightS.radius;
    if (this.isSyncAngle) {
      this.leftS.phi = reverseInPI(this.rightS.phi);
      this.leftS.theta = rotatePI(this.rightS.theta);
    }
    this.leftV.setFromSpherical(this.leftS);
    this.leftA.copy(this.getA(this.leftV));
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
  }

  /**
   * Get each angle as THREE.Vector3.
   * x:
   *   The angle of v around the x (right) axis.
   *   This angle is right-handed and starts at positive y.
   * y:
   *   The angle of v around the y (up) axis.
   *   This angle is right-handed and starts at positive z.
   * z:
   *   The angle of v around the z (front) axis.
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
    this.leftPos.copy(source.leftPos);
    this.leftV.copy(source.leftV);
    this.leftS.copy(source.leftS);
    this.leftA.copy(source.leftA);
    this.rightPos.copy(source.rightPos);
    this.rightV.copy(source.rightV);
    this.rightS.copy(source.rightS);
    this.rightA.copy(source.rightA);
    this.isSyncRadius = source.isSyncRadius;
    this.isSyncAngle = source.isSyncAngle;

    return this;
  }

  /**
   * Serializes the ControlPoint3 into JSON.
   *
   * @return {Object} A JSON object representing the serialized ControlPoint3.
   */
  toJSON() {
    const data = {};

    data.middlePos = this.middlePos.toArray();
    data.leftPos = this.leftPos.toArray();
    data.leftV = this.leftV.toArray();
    data.leftS = sphericalToJSON(this.leftS);
    data.leftA = this.leftA.toArray();
    data.rightPos = this.rightPos.toArray();
    data.rightV = this.rightV.toArray();
    data.rightS = sphericalToJSON(this.rightS);
    data.rightA = this.rightA.toArray();
    data.isSyncRadius = this.isSyncRadius;
    data.isSyncAngle = this.isSyncAngle;

    return data;
  }

  /**
   * Deserializes the ControlPoint3 from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized ControlPoint3.
   * @return {ControlPoint3} A reference to this ControlPoint3.
   */
  fromJSON(json) {
    this.middlePos.fromArray(json.middlePos);
    this.leftPos.fromArray(json.leftPos);
    this.leftV.fromArray(json.leftV);
    sphericalFromJSON(this.leftS, json.leftS);
    this.leftA.fromArray(json.leftA);
    this.rightPos.fromArray(json.rightPos);
    this.rightV.fromArray(json.rightV);
    sphericalFromJSON(this.rightS, json.rightS);
    this.rightA.fromArray(json.rightA);
    this.isSyncRadius = json.isSyncRadius;
    this.isSyncAngle = json.isSyncAngle;

    return this;
  }
}
