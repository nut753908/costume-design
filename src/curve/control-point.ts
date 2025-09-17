import type { GUI } from "lil-gui";
import * as THREE from "three";

/**
 * Abstract class for ControlPoint{3,2}.
 */
export abstract class ControlPoint<
  TVector extends THREE.Vector3 | THREE.Vector2,
> {
  /**
   * The position of middle control point.
   */
  middlePos: TVector;

  /**
   * The position of leftside control point.
   */
  leftPos: TVector;

  /**
   * The position of rightside control point.
   */
  rightPos: TVector;

  /**
   * Whether to synchronize the "left" and "right" radius.
   */
  isSyncRadius: boolean;

  /**
   * Whether to synchronize the "left" and "right" angle.
   */
  isSyncAngle: boolean;

  /**
   * Secret field.
   * This function is used by setGUI() in src/curve/control-point-{3,2}.ts.
   * Set it in advance using createGeometry() in src/curve/control-point.ts.
   */
  _updateGeometry: () => void;

  /**
   * Constructs a new ControlPoint.
   *
   * @param middlePos - {@link ControlPoint#middlePos}
   * @param leftPos - {@link ControlPoint#leftPos}
   * @param rightPos - {@link ControlPoint#rightPos}
   * @param isSyncRadius - {@link ControlPoint#isSyncRadius}
   * @param isSyncAngle - {@link ControlPoint#isSyncAngle}
   */
  constructor(
    middlePos: TVector,
    leftPos: TVector,
    rightPos: TVector,
    isSyncRadius = true,
    isSyncAngle = true
  ) {
    this.middlePos = middlePos;
    this.leftPos = leftPos;
    this.rightPos = rightPos;
    this.isSyncRadius = isSyncRadius;
    this.isSyncAngle = isSyncAngle;
    this._updateGeometry = () => {};
  }

  /**
   * Create geometry.
   */
  createGeometry(group: THREE.Group) {
    // biome-ignore lint/complexity/noUselessThisAlias: to leave cp(=this) alive.
    const cp = this;

    // This function is used by setGUI() in src/curve/control-point-{3,2}.ts.
    cp._updateGeometry = () => {
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints(
        cp.getPoints() as THREE.Vector3[] | THREE.Vector2[]
      );

      group.children.forEach((v) => {
        if ("geometry" in v && v.geometry instanceof THREE.BufferGeometry) {
          v.geometry.dispose();
          v.geometry = geometry;
        }
      });
    };
    cp._updateGeometry();
  }

  /**
   * Set GUI.
   *
   * @param name - The cp folder name used in the GUI.
   * @param updateCallback - The callback that is invoked after updating cp.
   */
  abstract setGUI(gui: GUI, name: string, updateCallback: () => void): void;

  /**
   * Get points.
   */
  getPoints(): [TVector, TVector, TVector] {
    return [this.leftPos, this.middlePos, this.rightPos];
  }

  /**
   * Update "leftPos" and "rightPos" from "middlePos".
   */
  abstract updateFromMiddlePos(): void;

  /**
   * Update "left*" from "leftPos".
   */
  abstract updateFromLeftPos(): void;

  /**
   * Update "right*" from "rightPos".
   */
  abstract updateFromRightPos(): void;

  /**
   * Synchronize from "left" to "right" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  abstract syncLeftToRight(): void;

  /**
   * Synchronize from "right" to "left" with reversing the direction
   * only if this.isSyncRadius = true or this.isSyncAngle = true.
   */
  abstract syncRightToLeft(): void;
}
