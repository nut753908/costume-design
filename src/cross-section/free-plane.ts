import * as THREE from "three";

import { Plane } from "./plane";

/**
 * A free plane at infinity.
 *
 * ```js
 * import { FreePlane } from "./src/cross-section/free-plane";
 * const normal = new THREE.Vector3( 0, 1, 0 );
 * const point = new THREE.Vector3( 0, 0, 0 );
 * const freePlane = new FreePlane( normal, point );
 * ```
 *
 * @augments Plane
 */
export class FreePlane extends Plane {
  type: string;

  /**
   * The normal direction of the plane. Must be a unit vector.
   */
  normal: THREE.Vector3;

  /**
   * The reference point on the plane.
   */
  point: THREE.Vector3;

  /**
   * Constructs a new free plane.
   *
   * @param normal - {@link FreePlane#normal}
   * @param point - {@link FreePlane#point}
   */
  constructor(
    normal = new THREE.Vector3(0, 1, 0),
    point = new THREE.Vector3(0, 0, 0)
  ) {
    super();
    this.type = "FreePlane";
    this.normal = normal;
    this.point = point;
  }

  /**
   * Get the normal direction of the plane.
   */
  getNormal(): THREE.Vector3 {
    return this.normal;
  }

  /**
   * Get the reference point on the plane.
   */
  getPoint(): THREE.Vector3 {
    return this.point;
  }

  /**
   * Returns a new free plane with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): FreePlane {
    return new FreePlane().copy(this);
  }

  /**
   * Copies the values of the given free plane to this instance.
   *
   * @param source - The free plane to copy.
   * @return  A reference to this free plane.
   */
  copy(source: FreePlane): FreePlane {
    this.normal.copy(source.normal);
    this.point.copy(source.point);

    return this;
  }

  /**
   * Serializes the free plane into JSON.
   *
   * @return  A JSON object representing the serialized free plane.
   */
  toJSON(): FreePlaneJSON {
    return {
      normal: this.normal.toArray(),
      point: this.point.toArray(),
      type: this.type,
    };
  }

  /**
   * Deserializes the free plane from the given JSON.
   *
   * @param json - The JSON holding the serialized free plane.
   * @return  A reference to this free plane.
   */
  fromJSON(json: FreePlaneJSON): FreePlane {
    this.normal.fromArray(json.normal);
    this.point.fromArray(json.point);

    return this;
  }
}

/**
 * The {@link FreePlane} JSON interface.
 */
export interface FreePlaneJSON {
  /** {@link FreePlane#type} */
  type: string;
  /** {@link FreePlane#normal} */
  normal: THREE.Vector3Tuple;
  /** {@link FreePlane#point} */
  point: THREE.Vector3Tuple;
}
