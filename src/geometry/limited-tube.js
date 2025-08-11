import { TubeGeometry } from "./tube.js";
import { Curve3 } from "../curve/curve-3.js";
import { Curve2 } from "../curve/curve-2.js";
import { screwShapedCurve3 } from "../curve/samples/curve-3.js";
import { smallCircleCurve2 } from "../curve/samples/curve-2.js";

/**
 * A geometry class for representing a tube with curve type restricted to Curve{3,2}.
 *
 * ```js
 * import { screwShapedCurve3 } from "./src/curve/sample/curve-3.js";
 * import { smallCircleCurve2 } from "./src/curve/samples/curve-2.js";
 * import { LimitedTubeGeometry } from "./src/geometry/limited-tube.js";
 *
 * const axis = screwShapedCurve3.clone();
 * const cross = smallCircleCurve2.clone();
 * const geometry = new LimitedTubeGeometry( axis, cross, 12, 8, 1, 1, 1, 0 );
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
   * This class has the same parameters as TubeGeometry, so please refer to that.
   * The parameter changes from this class to TubeGeometry are:
   *
   * - Explanations
   *      (all): exists -> nothing
   *
   * - Types
   *       axis: THREE.Curve<THREE.Vector3> -> Curve3
   *      cross: THREE.Curve<THREE.Vector2> -> Curve2
   *      scale: THREE.Curve<THREE.Vector2> -> Curve2
   *     xScale: THREE.Curve<THREE.Vector2> -> Curve2
   *     yScale: THREE.Curve<THREE.Vector2> -> Curve2
   *       tilt: THREE.Curve<THREE.Vector2> -> Curve2
   *
   * @param {Curve3} [axis]
   * @param {Curve2} [cross]
   * @param {number} [axisSegments=12]
   * @param {number} [crossSegments=8]
   * @param {number|Curve2} [scale=1]
   * @param {number|Curve2} [xScale=1]
   * @param {number|Curve2} [yScale=1]
   * @param {number|Curve2} [tilt=0]
   */
  constructor(
    axis = screwShapedCurve3.clone(),
    cross = smallCircleCurve2.clone(),
    axisSegments = 12,
    crossSegments = 8,
    scale = 1,
    xScale = 1,
    yScale = 1,
    tilt = 0
  ) {
    super(
      axis,
      cross,
      axisSegments,
      crossSegments,
      scale,
      xScale,
      yScale,
      tilt
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
