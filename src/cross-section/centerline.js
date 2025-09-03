import * as THREE from "three";

/**
 * The centerline of the edge loop stack.
 *
 * ```js
 * import { EdgeLoopStack } from "./src/cross-section/edge-loop-stack.js";
 * import { getCentroids } from "./src/cross-section/points.js";
 * import { Centerline } from "./src/cross-section/centerline.js";
 * const edgeLoopStack = new EdgeLoopStack( [ [ 0, 1, 2 ], [ 3, 4, 5 ] ], false );
 * const points = edgeLoopStack.getPoints();
 * const centroids = getCentroids(points);
 * const centerline = new Centerline( centroids );
 * ```
 */
export class Centerline {
  /**
   * Constructs a new centerline.
   *
   * @param {Array<THREE.Vector3>} centroids - The centroids of the edge loop stack.
   */
  constructor(centroids = []) {
    /**
     * The centroids of the edge loop stack.
     *
     * @type {Array<THREE.Vector3>}
     */
    this.centroids = centroids;
  }

  /**
   * Get the points.
   *
   * @returns {Array<THREE.Vector3>} The points.
   */
  getPoints() {
    return this.centroids.map((c) => c.clone());
  }

  /**
   * Returns a new centerline with copied values from this instance.
   *
   * @return {Centerline} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given centerline to this instance.
   *
   * @param {Centerline} source - The centerline to copy.
   * @returns {Centerline} A reference to this centerline.
   */
  copy(source) {
    this.centroids = [];

    for (let i = 0, l = source.centroids.length; i < l; i++) {
      const centroid = source.centroids[i];
      this.centroids.push(centroid.clone());
    }

    return this;
  }

  /**
   * Serializes the centerline into JSON.
   *
   * @return {Object} A JSON object representing the serialized centerline.
   */
  toJSON() {
    const data = {};

    data.centroids = [];

    for (let i = 0, l = this.centroids.length; i < l; i++) {
      const centroid = this.centroids[i];
      data.centroids.push(centroid.toArray());
    }

    return data;
  }

  /**
   * Deserializes the centerline from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized centerline.
   * @return {Centerline} A reference to this centerline.
   */
  fromJSON(json) {
    this.centroids = [];

    for (let i = 0, l = json.centroids.length; i < l; i++) {
      const centroid = json.centroids[i];
      this.centroids.push(new THREE.Vector3().fromArray(centroid));
    }

    return this;
  }
}
