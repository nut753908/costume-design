import type * as THREE from "three";
import type { CurveJSON } from "../curve/curve";
import { Curve2 } from "../curve/curve-2";
import { Curve3 } from "../curve/curve-3";
import {
  constant0Curve2,
  constant1Curve2,
  smallCircleCurve2,
} from "../curve/sample-curve-2";
import { constant0Curve3 } from "../curve/sample-curve-3";
import { TubeBaseGeometry } from "./tube-base-geometry";

/**
 * A geometry class for representing a tube with curve type restricted to Curve{3,2}.
 *
 * ```js
 * import { constant0Curve3 } from "../curve/sample-curve-3";
 * import { smallCircleCurve2, constant1Curve2, constant0Curve2 } from "../curve/sample-curve-2";
 * import { TubeGeometry } from "./tube";
 *
 * const axis = constant0Curve3.clone();
 * const cross = smallCircleCurve2.clone();
 * const scaleC = constant1Curve2.clone();
 * const xScaleC = constant1Curve2.clone();
 * const yScaleC = constant1Curve2.clone();
 * const xCurvatureC = constant0Curve2.clone();
 * const yCurvatureC = constant0Curve2.clone();
 * const tiltC = constant0Curve2.clone();
 * const geometry = new TubeGeometry( axis, cross, 4, 8, 1, 1, 1, 0, 0, 0, scaleC, xScaleC, yScaleC, tiltC, xCurvatureC, yCurvatureC, "xy" );
 * const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 * const mesh = new THREE.Mesh( geometry, material );
 * scene.add( mesh );
 * ```
 *
 * @augments TubeBaseGeometry
 */
export class TubeGeometry extends TubeBaseGeometry {
  /**
   * Constructs a new tube geometry.
   *
   * This class has the same parameters as TubeBaseGeometry.
   * The parameter changes from this class to TubeBaseGeometry are:
   *
   * - Types
   *            axis: THREE.Curve<THREE.Vector3> -> Curve3
   *           cross: THREE.Curve<THREE.Vector2> -> Curve2
   *          scaleC: THREE.Curve<THREE.Vector2> -> Curve2
   *         xScaleC: THREE.Curve<THREE.Vector2> -> Curve2
   *         yScaleC: THREE.Curve<THREE.Vector2> -> Curve2
   *     xCurvatureC: THREE.Curve<THREE.Vector2> -> Curve2
   *     yCurvatureC: THREE.Curve<THREE.Vector2> -> Curve2
   *           tiltC: THREE.Curve<THREE.Vector2> -> Curve2
   *
   * @param axis - {@link TubeGeometryParameters#axis}
   * @param cross - {@link TubeGeometryParameters#cross}
   * @param axisSegments - {@link TubeGeometryParameters#axisSegments}
   * @param crossSegments - {@link TubeGeometryParameters#axcrossSegmentsis}
   * @param scaleN - {@link TubeGeometryParameters#scaleN}
   * @param xScaleN - {@link TubeGeometryParameters#xScaleN}
   * @param yScaleN - {@link TubeGeometryParameters#yScaleN}
   * @param xCurvatureN - {@link TubeGeometryParameters#xCurvatureN}
   * @param yCurvatureN - {@link TubeGeometryParameters#yCurvatureN}
   * @param tiltN - {@link TubeGeometryParameters#tiltN}
   * @param scaleC - {@link TubeGeometryParameters#scaleC}
   * @param xScaleC - {@link TubeGeometryParameters#xScaleC}
   * @param yScaleC - {@link TubeGeometryParameters#yScaleC}
   * @param xCurvatureC - {@link TubeGeometryParameters#xCurvatureC}
   * @param yCurvatureC - {@link TubeGeometryParameters#yCurvatureC}
   * @param tiltC - {@link TubeGeometryParameters#tiltC}
   * @param curvatureOrder - {@link TubeGeometryParameters#curvatureOrder}
   */
  constructor(
    axis: Curve3 = constant0Curve3.clone(),
    cross: Curve2 = smallCircleCurve2.clone(),
    axisSegments = 4,
    crossSegments = 8,
    scaleN = 1,
    xScaleN = 1,
    yScaleN = 1,
    xCurvatureN = 0,
    yCurvatureN = 0,
    tiltN = 0,
    scaleC: Curve2 = constant1Curve2.clone(),
    xScaleC: Curve2 = constant1Curve2.clone(),
    yScaleC: Curve2 = constant1Curve2.clone(),
    xCurvatureC: Curve2 = constant0Curve2.clone(),
    yCurvatureC: Curve2 = constant0Curve2.clone(),
    tiltC: Curve2 = constant0Curve2.clone(),
    curvatureOrder: "xy" | "yx" = "xy"
  ) {
    super(
      axis,
      cross,
      axisSegments,
      crossSegments,
      scaleN,
      xScaleN,
      yScaleN,
      xCurvatureN,
      yCurvatureN,
      tiltN,
      scaleC,
      xScaleC,
      yScaleC,
      xCurvatureC,
      yCurvatureC,
      tiltC,
      curvatureOrder
    );
    this.type = "TubeGeometry";
  }

  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param data - A JSON object representing the serialized tube geometry.
   * @return  A new instance.
   */
  static fromJSON(data: TubeGeometryJSON): TubeGeometry {
    return new TubeGeometry(
      new Curve3().fromJSON(data.axis),
      new Curve2().fromJSON(data.cross),
      data.axisSegments,
      data.crossSegments,
      data.scaleN,
      data.xScaleN,
      data.yScaleN,
      data.xCurvatureN,
      data.yCurvatureN,
      data.tiltN,
      new Curve2().fromJSON(data.scaleC),
      new Curve2().fromJSON(data.xScaleC),
      new Curve2().fromJSON(data.yScaleC),
      new Curve2().fromJSON(data.xCurvatureC),
      new Curve2().fromJSON(data.yCurvatureC),
      new Curve2().fromJSON(data.tiltC),
      data.curvatureOrder
    );
  }
}

/**
 * The interface for {@link TubeGeometry} parameters.
 */
export interface TubeGeometryParameters {
  /**
   * A 3D axial curve that passes through the center of the tube.
   */
  axis: Curve3;

  /**
   * A 2D cross-sectional curve perpendicular to the axis.
   */
  cross: Curve2;

  /**
   * The number of faces along the axis.
   */
  axisSegments: number;

  /**
   * The number of faces on the cross section.
   */
  crossSegments: number;

  /**
   * The cross section scale ratio.
   */
  scaleN: number;

  /**
   * The cross section scale ratio in the x direction.
   */
  xScaleN: number;

  /**
   * The cross section scale ratio in the y direction.
   */
  yScaleN: number;

  /**
   * The curvature of the cross section in the x direction.
   */
  xCurvatureN: number;

  /**
   * The curvature of the cross section in the y direction.
   */
  yCurvatureN: number;

  /**
   * The circumferential inclination angle of the cross section (in degrees).
   */
  tiltN: number;

  /**
   * The cross section scale ratio.
   * Only the y component is used for the scale.
   */
  scaleC: Curve2;

  /**
   * The cross section scale ratio in the x direction.
   * Only the y component is used for the scale.
   */
  xScaleC: Curve2;

  /**
   * The cross section scale ratio in the y direction.
   * Only the y component is used for the scale.
   */
  yScaleC: Curve2;

  /**
   * The curvature of the cross section in the x direction.
   * Only the y component is used for the curvature.
   */
  xCurvatureC: Curve2;

  /**
   * The curvature of the cross section in the y direction.
   * Only the y component is used for the curvature.
   */
  yCurvatureC: Curve2;

  /**
   * The circumferential inclination angle of the cross section (in degrees).
   * Only the y component is used for the angle.
   */
  tiltC: Curve2;

  /**
   * The order in which curvature is applied.
   * "xy" is x to y. "yx" is y to x.
   */
  curvatureOrder: "xy" | "yx";
}

export const defaultTubeGeometryParameters: TubeGeometryParameters = {
  axis: constant0Curve3.clone(),
  cross: smallCircleCurve2.clone(),
  axisSegments: 4,
  crossSegments: 8,
  scaleN: 1,
  xScaleN: 1,
  yScaleN: 1,
  xCurvatureN: 0,
  yCurvatureN: 0,
  tiltN: 0,
  scaleC: constant1Curve2.clone(),
  xScaleC: constant1Curve2.clone(),
  yScaleC: constant1Curve2.clone(),
  xCurvatureC: constant0Curve2.clone(),
  yCurvatureC: constant0Curve2.clone(),
  tiltC: constant0Curve2.clone(),
  curvatureOrder: "xy",
};

/**
 * The {@link TubeGeometryParameters} JSON interface.
 */
export interface TubeGeometryParametersJSON {
  /** {@link TubeGeometryParameters#axis} */
  axis: CurveJSON<3>;
  /** {@link TubeGeometryParameters#cross} */
  cross: CurveJSON<2>;
  /** {@link TubeGeometryParameters#axisSegments} */
  axisSegments: number;
  /** {@link TubeGeometryParameters#crossSegments} */
  crossSegments: number;
  /** {@link TubeGeometryParameters#scaleN} */
  scaleN: number;
  /** {@link TubeGeometryParameters#xScaleN} */
  xScaleN: number;
  /** {@link TubeGeometryParameters#yScaleN} */
  yScaleN: number;
  /** {@link TubeGeometryParameters#xCurvatureN} */
  xCurvatureN: number;
  /** {@link TubeGeometryParameters#yCurvatureN} */
  yCurvatureN: number;
  /** {@link TubeGeometryParameters#tiltN} */
  tiltN: number;
  /** {@link TubeGeometryParameters#scaleC} */
  scaleC: CurveJSON<2>;
  /** {@link TubeGeometryParameters#xScaleC} */
  xScaleC: CurveJSON<2>;
  /** {@link TubeGeometryParameters#yScaleC} */
  yScaleC: CurveJSON<2>;
  /** {@link TubeGeometryParameters#xCurvatureC} */
  xCurvatureC: CurveJSON<2>;
  /** {@link TubeGeometryParameters#yCurvatureC} */
  yCurvatureC: CurveJSON<2>;
  /** {@link TubeGeometryParameters#tiltC} */
  tiltC: CurveJSON<2>;
  /** {@link TubeGeometryParameters#curvatureOrder} */
  curvatureOrder: "xy" | "yx";
}

/**
 * The {@link TubeGeometry} JSON interface.
 */
export interface TubeGeometryJSON
  extends THREE.BufferGeometryJSON,
    TubeGeometryParametersJSON {}
