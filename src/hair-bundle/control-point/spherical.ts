import * as THREE from "three";

/**
 * The class that extends from THREE.Spherical.
 *
 * ```js
 * import { Spherical } from "./spherical";
 * const spherical = new Spherical( 1, 0, 0 );
 * ```
 *
 * @augments THREE.Spherical
 */
export class Spherical extends THREE.Spherical {
  /**
   * Constructs a new spherical.
   *
   * @param radius - {@link THREE.Spherical#radius}
   * @param phi - {@link THREE.Spherical#phi}
   * @param theta - {@link THREE.Spherical#theta}
   */
  constructor(radius = 1, phi = 0, theta = 0) {
    super(radius, phi, theta);
  }

  /**
   * Serializes the spherical into JSON.
   *
   * @return  A JSON object representing the serialized spherical.
   */
  toJSON(): SphericalJSON {
    return {
      radius: this.radius,
      phi: this.phi,
      theta: this.theta,
    };
  }

  /**
   * Deserializes the spherical from the given JSON.
   *
   * @param json - The JSON holding the serialized spherical.
   * @return  A reference to this spherical.
   */
  fromJSON(json: SphericalJSON): Spherical {
    this.set(json.radius, json.phi, json.theta);

    return this;
  }
}

/**
 * The {@link THREE.Spherical} JSON interface.
 */
export interface SphericalJSON {
  /** {@link THREE.Spherical#radius} */
  radius: number;
  /** {@link THREE.Spherical#phi} */
  phi: number;
  /** {@link THREE.Spherical#theta} */
  theta: number;
}
