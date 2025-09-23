import type * as THREE from "three";

/**
 * Abstract class for EdgeIntersection and VertexIntersection.
 */
export abstract class Intersection {
  type: string;

  /**
   * Whether the intersection is checked when finding intersections.
   */
  checked: boolean;

  /**
   * Constructs a new intersection.
   *
   * @param checked - {@link Intersection#checked}
   */
  constructor(checked = false) {
    this.type = "Intersection";
    this.checked = checked;
  }

  /**
   * Get the point.
   */
  abstract getPoint(positions: THREE.Float32BufferAttribute): THREE.Vector3;

  /**
   * Get the normal on the point.
   */
  abstract getNormal(normals: THREE.BufferAttribute): THREE.Vector3;

  /**
   * Get the uv on the point.
   */
  abstract getUv(uvs: THREE.BufferAttribute): THREE.Vector2;

  /**
   * Return `true` if this intersection is equal with the given one.
   *
   * @param i - The intersection to test for equality.
   * @return  Whether this intersection is equal with the given one.
   */
  abstract equals(i: Intersection): boolean;

  /**
   * Whether one intersection has the other intersection.
   */
  abstract has(i: Intersection): boolean;

  /**
   * Return a string representing this intersection.
   */
  abstract toString(): string;
}

/**
 * The {@link Intersection} JSON interface.
 */
export interface IntersectionJSON {
  /** {@link Intersection#type} */
  type: string;
  /** {@link Intersection#checked} */
  checked: boolean;
}
