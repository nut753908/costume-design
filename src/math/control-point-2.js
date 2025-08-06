import * as THREE from "three";

import { Circular } from "./circular.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

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

  /**
   * Set GUI with updateGeometry.
   *
   * @param {GUI} gui
   * @param {(cp:ControlPoint2)=>void} updateGeometry - A callback that can update the geometry.
   */
  setGUI(gui, updateGeometry) {
    const cp = this;

    updateGeometry(cp); // First, update the geometry.

    const folder = gui.addFolder("cp");
    folder.add(cp.middlePos, "x", -1, 1).name("middle.x").onChange(uMP);
    folder.add(cp.middlePos, "y", -1, 1).name("middle.y").onChange(uMP);
    folder.add(cp, "isSync");
    folder.add(cp.leftPos, "x", -1, 1).name("left.x").onChange(uLP);
    folder.add(cp.leftPos, "y", -1, 1).name("left.y").onChange(uLP);
    folder.add(cp.leftC, "radius", 0, 1).name("left.radius").onChange(uLS);
    folder.add(cp.leftC, "angle", 0, 360).name("left.angle").onChange(uLS);
    folder.addFolder("---").close(); // separator
    folder.add(cp.rightPos, "x", -1, 1).name("right.x").onChange(uRP);
    folder.add(cp.rightPos, "y", -1, 1).name("right.y").onChange(uRP);
    folder.add(cp.rightC, "radius", 0, 1).name("right.radius").onChange(uRS);
    folder.add(cp.rightC, "angle", 0, 360).name("right.angle").onChange(uRS);

    const upDownControllers = folder.controllers.filter(
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
      updateGeometry(cp);
      upDownControllers.forEach((c) => c.updateDisplay());
    }
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
   * Then synchronize from "left" to "right" only if this.isSync = true.
   */
  updateFromLeftPos() {
    this.leftV.copy(this.leftPos.clone().sub(this.middlePos));
    this.leftC.setFromVector2(this.leftV);
    if (this.isSync) this.syncLeftToRight();
  }
  /**
   * Update "leftV" and "leftPos" from "leftC".
   * Then synchronize from "left" to "right" only if this.isSync = true.
   */
  updateFromLeftC() {
    this.leftV.set(this.leftC.x(), this.leftC.y());
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
    if (this.isSync) this.syncLeftToRight();
  }
  /**
   * Update "rightV" and "rightC" from "rightPos".
   * Then synchronize from "right" to "left" only if this.isSync = true.
   */
  updateFromRightPos() {
    this.rightV.copy(this.rightPos.clone().sub(this.middlePos));
    this.rightC.setFromVector2(this.rightV);
    if (this.isSync) this.syncRightToLeft();
  }
  /**
   * Update "rightV" and "rightPos" from "rightC".
   * Then synchronize from "right" to "left" only if this.isSync = true.
   */
  updateFromRightC() {
    this.rightV.set(this.rightC.x(), this.rightC.y());
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
    if (this.isSync) this.syncRightToLeft();
  }

  /**
   * Synchronize from "left" to "right" with reversing the direction.
   */
  syncLeftToRight() {
    this.rightV.copy(this.leftV.clone().negate());
    this.rightC.setFromVector2(this.rightV);
    this.rightC.radius = this.leftC.radius; // Avoid float rounding errors.
    this.rightPos.copy(this.middlePos.clone().add(this.rightV));
  }
  /**
   * Synchronize from "right" to "left" with reversing the direction.
   */
  syncRightToLeft() {
    this.leftV.copy(this.rightV.clone().negate());
    this.leftC.setFromVector2(this.leftV);
    this.leftC.radius = this.rightC.radius; // Avoid float rounding errors.
    this.leftPos.copy(this.middlePos.clone().add(this.leftV));
  }
}
