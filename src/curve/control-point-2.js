import * as THREE from "three";

import { Circular } from "../math/circular.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { rotate180 } from "../math/utils.js";

/**
 * A class representing a 2D control point of curve.
 *
 * ```js
 * import { ControlPoint2 } from "./src/curve/control-point-2.js";
 * const cp = new ControlPoint2(
 *   new THREE.Vector2(0, 0),
 *   new THREE.Vector2(-1, 0),
 *   new THREE.Vector2(1, 0),
 *   true,
 *   true
 * );
 * ```
 */
export class ControlPoint2 {
  /**
   * Constructs a new ControlPoint2.
   *
   * @param {THREE.Vector2} [middlePos] - The position of middle control point.
   * @param {THREE.Vector2} [leftPos] - The position of leftside control point.
   * @param {THREE.Vector2} [rightPos] - The position of rightside control point.
   * @param {boolean} [isSyncRadius=true] - Whether to synchronize the "left" and "right" radius.
   * @param {boolean} [isSyncAngle=true] - Whether to synchronize the "left" and "right" angle.
   */
  constructor(
    middlePos = new THREE.Vector2(0, 0),
    leftPos = new THREE.Vector2(-1, 0),
    rightPos = new THREE.Vector2(1, 0),
    isSyncRadius = true,
    isSyncAngle = true
  ) {
    /**
     * The position of middle control point.
     *
     * @type {THREE.Vector2}
     */
    this.middlePos = middlePos;

    /**
     * The position of leftside control point.
     *
     * @type {THREE.Vector2}
     */
    this.initLeft(leftPos);

    /**
     * The position of rightside control point.
     *
     * @type {THREE.Vector2}
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
  }

  /**
   * Initialize "left".
   * "leftV" is "leftPos - middlePos" and its type is THREE.'V'ector2.
   * "leftC" is "leftPos - middlePos" and its type is 'C'ircular.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector2} leftPos - The position of leftside control point.
   */
  initLeft(leftPos) {
    this.leftPos = leftPos;
    this.leftV = leftPos.clone().sub(this.middlePos);
    this.leftC = new Circular().setFromVector2(this.leftV);
  }
  /**
   * Initialize "right".
   * "rightV" is "rightPos - middlePos" and its type is THREE.'V'ector2.
   * "rightC" is "rightPos - middlePos" and its type is 'C'ircular.
   * Call it only once in this constructor.
   *
   * @param {THREE.Vector2} rightPos - The position of rightside control point.
   */
  initRight(rightPos) {
    this.rightPos = rightPos;
    this.rightV = rightPos.clone().sub(this.middlePos);
    this.rightC = new Circular().setFromVector2(this.rightV);
  }

  /**
   * Create geometry and set GUI.
   *
   * @param {GUI} gui
   * @returns {THREE.BufferGeometry}
   */
  createGeometry(gui) {
    const cp = this;

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(cp.getPoints());

    const folder = gui.addFolder("cp");
    folder.add(cp.middlePos, "x", -1, 1).name("middle.x").onChange(uMP);
    folder.add(cp.middlePos, "y", -1, 1).name("middle.y").onChange(uMP);
    folder.add(cp, "isSyncRadius");
    folder.add(cp, "isSyncAngle");
    folder.add(cp.leftPos, "x", -1, 1).name("left.x").onChange(uLP);
    folder.add(cp.leftPos, "y", -1, 1).name("left.y").onChange(uLP);
    folder.add(cp.leftC, "radius", 0, 1).name("left.radius").onChange(uLS);
    folder.add(cp.leftC, "angle", 0, 360).name("left.angle").onChange(uLS);
    folder.addFolder("---").close(); // separator
    folder.add(cp.rightPos, "x", -1, 1).name("right.x").onChange(uRP);
    folder.add(cp.rightPos, "y", -1, 1).name("right.y").onChange(uRP);
    folder.add(cp.rightC, "radius", 0, 1).name("right.radius").onChange(uRS);
    folder.add(cp.rightC, "angle", 0, 360).name("right.angle").onChange(uRS);

    const leftRightControllers = folder.controllers.filter(
      (c) => c._name.startsWith("left.") || c._name.startsWith("right.")
    );

    function uMP() /* updateFromMiddlePos */ {
      updateFrom("middlePos");
    }
    function uLP() /* updateFromLeftPos */ {
      updateFrom("leftPos");
    }
    function uLS() /* updateFromLeftC */ {
      updateFrom("leftC");
    }
    function uRP() /* updateFromRightPos */ {
      updateFrom("rightPos");
    }
    function uRS() /* updateFromRightC */ {
      updateFrom("rightC");
    }
    /**
     * @param {"middlePos"|"leftPos"|"leftC"|"leftPos"|"leftC"} key - A key to pass to this.updateFrom.
     */
    function updateFrom(key) {
      cp.updateFrom[key]();
      geometry.setFromPoints(cp.getPoints());
      leftRightControllers.forEach((c) => c.updateDisplay());
    }

    return geometry;
  }

  /**
   * Get points.
   *
   * @returns {Array<THREE.Vector2>}
   */
  getPoints() {
    return [this.leftPos, this.middlePos, this.rightPos];
  }

  updateFrom = {
    middlePos: () => this.updateFromMiddlePos(),
    leftPos: () => this.updateFromLeftPos(),
    leftC: () => this.updateFromLeftC(),
    rightPos: () => this.updateFromRightPos(),
    rightC: () => this.updateFromRightC(),
  };

  /**
   * Update "leftPos" and "rightPos" from "middlePos".
   */
  updateFromMiddlePos() {
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
  }
  /**
   * Update "leftV" and "leftC" from "leftPos".
   */
  updateFromLeftPos() {
    this.leftV.copy(this.leftPos.clone().sub(this.middlePos));
    this.leftC.setFromVector2(this.leftV);
    this.syncLeftToRight();
  }
  /**
   * Update "leftV" and "leftPos" from "leftC".
   */
  updateFromLeftC() {
    this.leftV.set(this.leftC.x, this.leftC.y);
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
    this.syncLeftToRight();
  }
  /**
   * Update "rightV" and "rightC" from "rightPos".
   */
  updateFromRightPos() {
    this.rightV.copy(this.rightPos.clone().sub(this.middlePos));
    this.rightC.setFromVector2(this.rightV);
    this.syncRightToLeft();
  }
  /**
   * Update "rightV" and "rightPos" from "rightC".
   */
  updateFromRightC() {
    this.rightV.set(this.rightC.x, this.rightC.y);
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
    this.syncRightToLeft();
  }

  /**
   * Synchronize from "left" to "right" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  syncLeftToRight() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.rightC.radius = this.leftC.radius;
    if (this.isSyncAngle) this.rightC.angle = rotate180(this.leftC.angle);
    this.rightV.set(this.rightC.x, this.rightC.y);
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
  }
  /**
   * Synchronize from "right" to "left" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  syncRightToLeft() {
    if (!this.isSyncRadius && !this.isSyncAngle) return;
    if (this.isSyncRadius) this.leftC.radius = this.rightC.radius;
    if (this.isSyncAngle) this.leftC.angle = rotate180(this.rightC.angle);
    this.leftV.set(this.leftC.x, this.leftC.y);
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
  }

  /**
   * Returns a new ControlPoint2 with copied values from this instance.
   *
   * @returns {ControlPoint2} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given ControlPoint2 to this instance.
   *
   * @param {ControlPoint2} source - The ControlPoint2 to copy.
   * @returns {ControlPoint2} A reference to this ControlPoint2.
   */
  copy(source) {
    this.middlePos.copy(source.middlePos);
    this.leftPos.copy(source.leftPos);
    this.leftV.copy(source.leftV);
    this.leftC.copy(source.leftC);
    this.rightPos.copy(source.rightPos);
    this.rightV.copy(source.rightV);
    this.rightC.copy(source.rightC);
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
    data.leftPos = this.leftPos.toArray();
    data.leftV = this.leftV.toArray();
    data.leftC = this.leftC.toJSON();
    data.rightPos = this.rightPos.toArray();
    data.rightV = this.rightV.toArray();
    data.rightC = this.rightC.toJSON();
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
    this.leftPos.fromArray(json.leftPos);
    this.leftV.fromArray(json.leftV);
    this.leftC.fromJSON(json.leftC);
    this.rightPos.fromArray(json.rightPos);
    this.rightV.fromArray(json.rightV);
    this.rightC.fromJSON(json.rightC);
    this.isSyncRadius = json.isSyncRadius;
    this.isSyncAngle = json.isSyncAngle;

    return this;
  }
}
