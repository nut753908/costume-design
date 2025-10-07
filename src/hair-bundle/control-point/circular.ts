import * as THREE from "three";

import { atan2In2PI } from "./utils";

/**
 * A class representing a circular as 2D Polar coodinate.
 *
 * ```js
 * import { Circular } from "./circular";
 * const circular = new Circular( 1, 0 );
 * ```
 */
export class Circular {
  /**
   * The radius of circular ([0,]).
   */
  radius: number;

  /**
   * The angle of circular in degrees ([0, 360]).
   * The angle starts at positive x and increases counterclockwise in x-y plane.
   * In this case, positive z points forward.
   */
  angle: number;

  /**
   * Constructs a new circular.
   *
   * @param radius - {@link Circular#radius}
   * @param angle - {@link Circular#angle}
   */
  constructor(radius = 1, angle = 0) {
    this.radius = radius;
    this.angle = angle;
  }

  /**
   * Get the x value as Cartesian coordinate.
   */
  get x(): number {
    return this.radius * Math.cos(THREE.MathUtils.degToRad(this.angle));
  }
  /**
   * Get the y value as Cartesian coordinate.
   */
  get y(): number {
    return this.radius * Math.sin(THREE.MathUtils.degToRad(this.angle));
  }

  /**
   * Set radius and angle from THREE.Vector2 v.
   */
  setFromVector2(v: THREE.Vector2): Circular {
    this.radius = Math.sqrt(v.x ** 2 + v.y ** 2);
    this.angle = THREE.MathUtils.radToDeg(atan2In2PI(v.y, v.x));

    return this;
  }

  /**
   * Returns a new circular with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): Circular {
    return new Circular().copy(this);
  }

  /**
   * Copies the values of the given circular to this instance.
   *
   * @param other - The circular to copy.
   * @return  A reference to this circular.
   */
  copy(other: Circular): Circular {
    this.radius = other.radius;
    this.angle = other.angle;

    return this;
  }

  /**
   * Serializes the circular into JSON.
   *
   * @return  A JSON object representing the serialized circular.
   */
  toJSON(): CircularJSON {
    return {
      radius: this.radius,
      angle: this.angle,
    };
  }

  /**
   * Deserializes the circular from the given JSON.
   *
   * @param json - The JSON holding the serialized circular.
   * @return  A reference to this circular.
   */
  fromJSON(json: CircularJSON): Circular {
    this.radius = json.radius;
    this.angle = json.angle;

    return this;
  }
}

/**
 * The {@link Circular} JSON interface.
 */
export interface CircularJSON {
  /** {@link Circular#radius} */
  radius: number;
  /** {@link Circular#angle} */
  angle: number;
}
