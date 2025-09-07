import * as THREE from "three";

import { Plane } from "./plane";

/**
 * A plane at infinity. The plane is perpendicular to the curve at position u.
 *
 * ```js
 * import { VerticalPlane } from "./src/cross-section/vertical-plane";
 * const points = [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) ];
 * const curve = new THREE.CatmullRomCurve3( points );
 * const verticalPlane = new VerticalPlane( curve, 0 );
 * ```
 *
 * @augments Plane
 */
export class VerticalPlane extends Plane {
  type: string;

  /**
   * The curve.
   */
  curve: THREE.CurvePath<THREE.Vector3> | THREE.CatmullRomCurve3;

  /**
   * The position on the curve according to the arc length. Must be in the range [0, 1].
   */
  u: number;

  /**
   * Constructs a new vertical plane.
   *
   * @param curve - {@link VerticalPlane#curve}
   * @param u - {@link VerticalPlane#u}
   */
  constructor(
    curve:
      | THREE.CurvePath<THREE.Vector3>
      | THREE.CatmullRomCurve3 = new THREE.CurvePath(),
    u = 0
  ) {
    super();
    this.type = "VerticalPlane";
    this.curve = curve;
    this.u = u;
  }

  /**
   * Get the normal direction of the plane.
   */
  getNormal(): THREE.Vector3 {
    return this.curve.getTangentAt(this.u);
  }

  /**
   * Get the reference point on the plane.
   */
  getPoint(): THREE.Vector3 {
    return this.curve.getPointAt(this.u);
  }

  /**
   * Returns a new vertical plane with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): VerticalPlane {
    return new VerticalPlane().copy(this);
  }

  /**
   * Copies the values of the given vertical plane to this instance.
   *
   * @param source - The vertical plane to copy.
   * @return  A reference to this vertical plane.
   */
  copy(source: VerticalPlane): VerticalPlane {
    this.curve.copy(source.curve);
    this.u = source.u;

    return this;
  }

  /**
   * Serializes the vertical plane into JSON.
   *
   * @return  A JSON object representing the serialized vertical plane.
   */
  toJSON(): VerticalPlaneJSON {
    return {
      type: this.type,
      curve: this.curve.toJSON(),
      u: this.u,
    };
  }

  /**
   * Deserializes the vertical plane from the given JSON.
   *
   * @param json - The JSON holding the serialized vertical plane.
   * @return  A reference to this vertical plane.
   */
  fromJSON(json: VerticalPlaneJSON): VerticalPlane {
    if (json.curve.type === "CurvePath") {
      this.curve = new THREE.CurvePath<THREE.Vector3>().fromJSON(
        json.curve as THREE.CurvePathJSON
      );
    } else if (json.curve.type === "CatmullRomCurve3") {
      this.curve = new THREE.CatmullRomCurve3().fromJSON(
        json.curve as THREE.CurveJSON
      );
    } else {
      console.error(`\
!(json.curve.type === "CurvePath") && !(json.curve.type === "CatmullRomCurve3")
- json.curve: ${JSON.stringify(json.curve)}
`);
      this.curve = new THREE.CurvePath<THREE.Vector3>();
    }
    this.u = json.u;

    return this;
  }
}

/**
 * The {@link VerticalPlane} JSON interface.
 */
export interface VerticalPlaneJSON {
  /** {@link VerticalPlane#type} */
  type: string;
  /** {@link VerticalPlane#curve} */
  curve: THREE.CurvePathJSON | THREE.CurveJSON;
  /** {@link VerticalPlane#u} */
  u: number;
}
