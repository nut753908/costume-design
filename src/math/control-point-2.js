import * as THREE from "three";

import { Circular } from "./circular.js";

/**
 * A class representing a 2D control point of curve.
 *
 * ```js
 * import { ControlPoint2 } from "./src/math/control-point-2.js";
 * const cp = new ControlPoint2(
 *   new THREE.Vector2(0, 0),
 *   new THREE.Vector2(1, 0),
 *   new THREE.Vector2(-1, 0),
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
   * @param {boolean} [isSync=true] - Whether to synchronize "left" and "right".
   */
  constructor(
    middlePos = new THREE.Vector2(0, 0),
    leftPos = new THREE.Vector2(1, 0),
    rightPos = new THREE.Vector2(-1, 0),
    isSync = true
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
     * Whether to synchronize "up" and "down".
     *
     * @type {boolean}
     */
    this.isSync = isSync;
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
   * @param {ControlPoint2} other - The ControlPoint2 to copy.
   * @returns {ControlPoint2} A reference to this ControlPoint2.
   */
  copy(other) {
    this.middlePos.copy(other.middlePos);
    this.leftPos.copy(other.leftPos);
    this.leftV.copy(other.leftV);
    this.leftC.copy(other.leftC);
    this.rightPos.copy(other.rightPos);
    this.rightV.copy(other.rightV);
    this.rightC.copy(other.rightC);
    this.isSync = other.isSync;

    return this;
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
}
