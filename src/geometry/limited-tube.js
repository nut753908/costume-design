import { TubeGeometry } from "./tube.js";
import { Curve3 } from "../curve/curve-3.js";
import { Curve2 } from "../curve/curve-2.js";
import { constant0Curve3 } from "../curve/samples/curve-3.js";
import {
  smallCircleCurve2,
  constant1Curve2,
  constant0Curve2,
} from "../curve/samples/curve-2.js";

// TODO: Add clone(), toJSON(), and fromJSON().
/**
 * A geometry class for representing a tube with curve type restricted to Curve{3,2}.
 *
 * ```js
 * import { constant0Curve3 } from "./src/curve/sample/curve-3.js";
 * import { smallCircleCurve2, constant1Curve2, constant0Curve2 } from "./src/curve/samples/curve-2.js";
 * import { LimitedTubeGeometry } from "./src/geometry/limited-tube.js";
 *
 * const axis = constant0Curve3.clone();
 * const cross = smallCircleCurve2.clone();
 * const scaleC = constant1Curve2.clone();
 * const xScaleC = constant1Curve2.clone();
 * const yScaleC = constant1Curve2.clone();
 * const curvatureC = constant0Curve2.clone();
 * const tiltC = constant0Curve2.clone();
 * const geometry = new LimitedTubeGeometry( axis, cross, 4, 8, 1, 1, 1, 0, 0, scaleC, xScaleC, yScaleC, tiltC, curvatureC );
 * const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 * const mesh = new THREE.Mesh( geometry, material );
 * scene.add( mesh );
 * ```
 *
 * @augments TubeGeometry
 */
export class LimitedTubeGeometry extends TubeGeometry {
  /**
   * Constructs a new limited tube geometry.
   *
   * This class has the same parameters as TubeGeometry.
   * The parameter changes from this class to TubeGeometry are:
   *
   * - Types
   *           axis: THREE.Curve<THREE.Vector3> -> Curve3
   *          cross: THREE.Curve<THREE.Vector2> -> Curve2
   *         scaleC: THREE.Curve<THREE.Vector2> -> Curve2
   *        xScaleC: THREE.Curve<THREE.Vector2> -> Curve2
   *        yScaleC: THREE.Curve<THREE.Vector2> -> Curve2
   *     curvatureC: THREE.Curve<THREE.Vector2> -> Curve2
   *          tiltC: THREE.Curve<THREE.Vector2> -> Curve2
   *
   * @param {Curve3} [axis] - A 3D axial curve that passes through the center of the tube.
   * @param {Curve2} [cross] - A 2D cross-sectional curve perpendicular to the axis.
   * @param {number} [axisSegments=4] - The number of faces along the axis.
   * @param {number} [crossSegments=8] - The number of faces on the cross section.
   * @param {number} [scaleN=1] - The cross section scale ratio.
   * @param {number} [xScaleN=1] - The cross section scale ratio in the x direction.
   * @param {number} [yScaleN=1] - The cross section scale ratio in the y direction.
   * @param {number} [curvatureN=0] - The curvature of the cross section in the y direction.
   * @param {number} [tiltN=0] - The circumferential inclination angle of the cross section (in degrees).
   * @param {Curve2} [scaleC] - The cross section scale ratio. Only the y component is used for the scale.
   * @param {Curve2} [xScaleC] - The cross section scale ratio in the x direction. Only the y component is used for the scale.
   * @param {Curve2} [yScaleC] - The cross section scale ratio in the y direction. Only the y component is used for the scale.
   * @param {Curve2} [curvatureC] - The curvature of the cross section in the y direction. Only the y component is used for the curvature.
   * @param {Curve2} [tiltC] - The circumferential inclination angle of the cross section (in degrees). Only the y component is used for the angle.
   */
  constructor(
    axis = constant0Curve3.clone(),
    cross = smallCircleCurve2.clone(),
    axisSegments = 4,
    crossSegments = 8,
    scaleN = 1,
    xScaleN = 1,
    yScaleN = 1,
    curvatureN = 0,
    tiltN = 0,
    scaleC = constant1Curve2.clone(),
    xScaleC = constant1Curve2.clone(),
    yScaleC = constant1Curve2.clone(),
    curvatureC = constant0Curve2.clone(),
    tiltC = constant0Curve2.clone()
  ) {
    super(
      axis,
      cross,
      axisSegments,
      crossSegments,
      scaleN,
      xScaleN,
      yScaleN,
      curvatureN,
      tiltN,
      scaleC,
      xScaleC,
      yScaleC,
      curvatureC,
      tiltC
    );

    this.type = "LimitedTubeGeometry";
  }

  /**
   * Copies the values of the given limited tube geometry to this instance.
   *
   * @param {LimitedTubeGeometry} source - The limited tube geometry to copy.
   * @returns {LimitedTubeGeometry} A reference to this limited tube geometry.
   */
  copy(source) {
    super.copy(source);

    return this;
  }
}
