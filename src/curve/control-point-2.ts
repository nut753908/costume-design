import type { Controller, GUI } from "lil-gui";
import * as THREE from "three";
import { closeFolder, deleteFolder } from "../main/gui";
import { Circular, type CircularJSON } from "../math/circular";
import { rotate180 } from "../math/utils";
import { ControlPoint } from "./control-point";

/**
 * A class representing a 2D control point of curve.
 *
 * ```js
 * import { ControlPoint2 } from "./src/curve/control-point-2";
 * const controlPoint2 = new ControlPoint2(
 *   new THREE.Vector2(0, 0),
 *   new THREE.Vector2(-1, 0),
 *   new THREE.Vector2(1, 0),
 *   true,
 *   true
 * );
 * ```
 */
export class ControlPoint2 extends ControlPoint<THREE.Vector2> {
  type: string;

  /**
   * This is "leftPos - middlePos" and its type is THREE.'V'ector2.
   */
  leftV: THREE.Vector2;

  /**
   * This is "leftPos - middlePos" and its type is 'C'ircular.
   */
  leftC: Circular;

  /**
   * This is "rightPos - middlePos" and its type is THREE.'V'ector2.
   */
  rightV: THREE.Vector2;

  /**
   * This is "rightPos - middlePos" and its type is 'C'ircular.
   */
  rightC: Circular;

  /**
   * Constructs a new ControlPoint2.
   *
   * @param middlePos - {@link ControlPoint#middlePos}
   * @param leftPos - {@link ControlPoint#leftPos}
   * @param rightPos - {@link ControlPoint#rightPos}
   * @param isSyncRadius - {@link ControlPoint#isSyncRadius}
   * @param isSyncAngle - {@link ControlPoint#isSyncAngle}
   */
  constructor(
    middlePos = new THREE.Vector2(0, 0),
    leftPos = new THREE.Vector2(-1, 0),
    rightPos = new THREE.Vector2(1, 0),
    isSyncRadius = true,
    isSyncAngle = true
  ) {
    super(middlePos, leftPos, rightPos, isSyncRadius, isSyncAngle);
    this.type = "ControlPoint2";
    this.leftV = leftPos.clone().sub(middlePos);
    this.leftC = new Circular().setFromVector2(this.leftV);
    this.rightV = rightPos.clone().sub(middlePos);
    this.rightC = new Circular().setFromVector2(this.rightV);
  }

  /**
   * Set GUI.
   *
   * @param name - The cp folder name used in the GUI.
   * @param updateCallback - The callback that is invoked after updating cp.
   */
  setGUI(gui: GUI, name = this.type, updateCallback = () => {}) {
    const cp = this;

    let _tmp: Controller;
    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(cp.middlePos, "x").step(0.01).name("middle.x").onChange(uMP);
    folder.add(cp.middlePos, "y").step(0.01).name("middle.y").onChange(uMP);
    folder.add(cp.leftPos, "x").step(0.01).name("left.x").onChange(uLP);
    folder.add(cp.leftPos, "y").step(0.01).name("left.y").onChange(uLP);
    folder.add(cp.rightPos, "x").step(0.01).name("right.x").onChange(uRP);
    folder.add(cp.rightPos, "y").step(0.01).name("right.y").onChange(uRP);
    folder.add(cp, "isSyncRadius");
    folder.add(cp, "isSyncAngle");
    const lFolder = folder.addFolder("local");
    closeFolder(lFolder);
    _tmp = lFolder.add(cp.leftC, "radius").min(0).step(0.01);
    _tmp.name("left.radius").onChange(uLC);
    _tmp = lFolder.add(cp.leftC, "angle").step(1);
    _tmp.name("left.angle").onChange(uLC);
    _tmp = lFolder.add(cp.rightC, "radius").min(0).step(0.01);
    _tmp.name("right.radius").onChange(uRC);
    _tmp = lFolder.add(cp.rightC, "angle").step(1);
    _tmp.name("right.angle").onChange(uRC);

    const leftRightControllers: Controller[] = [
      ...folder.controllers,
      ...lFolder.controllers,
    ].filter(
      (c) => c._name.startsWith("left.") || c._name.startsWith("right.")
    );

    function uMP() /* updateFromMiddlePos */ {
      updateFrom("middlePos");
    }
    function uLP() /* updateFromLeftPos */ {
      updateFrom("leftPos");
    }
    function uRP() /* updateFromRightPos */ {
      updateFrom("rightPos");
    }
    function uLC() /* updateFromLeftC */ {
      updateFrom("leftC");
    }
    function uRC() /* updateFromRightC */ {
      updateFrom("rightC");
    }
    /**
     * @param key - A key to pass to this.updateFrom.
     */
    function updateFrom(
      key: "middlePos" | "leftPos" | "rightPos" | "leftC" | "rightC"
    ) {
      cp.updateFrom[key]();
      cp._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/control-point-2.ts.
      leftRightControllers.map((c) => c.updateDisplay());
      updateCallback();
    }
  }

  updateFrom = {
    middlePos: () => this.updateFromMiddlePos(),
    leftPos: () => this.updateFromLeftPos(),
    rightPos: () => this.updateFromRightPos(),
    leftC: () => this.updateFromLeftC(),
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
   * Update "rightV" and "rightC" from "rightPos".
   */
  updateFromRightPos() {
    this.rightV.copy(this.rightPos.clone().sub(this.middlePos));
    this.rightC.setFromVector2(this.rightV);
    this.syncRightToLeft();
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
   * @return  A clone of this instance.
   */
  clone(): ControlPoint2 {
    return new ControlPoint2().copy(this);
  }

  /**
   * Copies the values of the given ControlPoint2 to this instance.
   *
   * @param source - The ControlPoint2 to copy.
   * @return  A reference to this ControlPoint2.
   */
  copy(source: ControlPoint2): this {
    this.middlePos.copy(source.middlePos);
    this.leftPos.copy(source.leftPos);
    this.rightPos.copy(source.rightPos);
    this.isSyncRadius = source.isSyncRadius;
    this.isSyncAngle = source.isSyncAngle;
    this.leftV.copy(source.leftV);
    this.rightV.copy(source.rightV);
    this.leftC.copy(source.leftC);
    this.rightC.copy(source.rightC);

    return this;
  }

  /**
   * Serializes the ControlPoint2 into JSON.
   *
   * @return  A JSON object representing the serialized ControlPoint2.
   */
  toJSON(): ControlPoint2JSON {
    return {
      middlePos: this.middlePos.toArray(),
      leftPos: this.leftPos.toArray(),
      rightPos: this.rightPos.toArray(),
      isSyncRadius: this.isSyncRadius,
      isSyncAngle: this.isSyncAngle,
      type: this.type,
      leftV: this.leftV.toArray(),
      leftC: this.leftC.toJSON(),
      rightV: this.rightV.toArray(),
      rightC: this.rightC.toJSON(),
    };
  }

  /**
   * Deserializes the ControlPoint2 from the given JSON.
   *
   * @param json - The JSON holding the serialized ControlPoint2.
   * @return  A reference to this ControlPoint2.
   */
  fromJSON(json: ControlPoint2JSON): this {
    this.middlePos.fromArray(json.middlePos);
    this.leftPos.fromArray(json.leftPos);
    this.rightPos.fromArray(json.rightPos);
    this.isSyncRadius = json.isSyncRadius;
    this.isSyncAngle = json.isSyncAngle;
    this.leftV.fromArray(json.leftV);
    this.leftC.fromJSON(json.leftC);
    this.rightV.fromArray(json.rightV);
    this.rightC.fromJSON(json.rightC);

    return this;
  }
}

/**
 * The {@link ControlPoint2} JSON interface.
 */
export interface ControlPoint2JSON {
  /** {@link ControlPoint#middlePos} */
  middlePos: THREE.Vector2Tuple;
  /** {@link ControlPoint#leftPos} */
  leftPos: THREE.Vector2Tuple;
  /** {@link ControlPoint#rightPos} */
  rightPos: THREE.Vector2Tuple;
  /** {@link ControlPoint#isSyncRadius} */
  isSyncRadius: boolean;
  /** {@link ControlPoint#isSyncAngle} */
  isSyncAngle: boolean;
  /** {@link ControlPoint2#type} */
  type: string;
  /** {@link ControlPoint2#leftV} */
  leftV: THREE.Vector2Tuple;
  /** {@link ControlPoint2#leftC} */
  leftC: CircularJSON;
  /** {@link ControlPoint2#rightV} */
  rightV: THREE.Vector2Tuple;
  /** {@link ControlPoint2#rightC} */
  rightC: CircularJSON;
}
