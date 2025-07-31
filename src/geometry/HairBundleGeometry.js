import * as THREE from "three";
import { Float32BufferAttribute, Vector3 } from "three/webgpu";

/**
 * A geometry class for representing a hair bundle.
 *
 * ```js
 * import { HairBundleGeometry } from "./geometries/HairBundleGeometry.js";
 * const geometry = new HairBundleGeometry( 1, 1, 8, 1 );
 * const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
 * const hairBundle = new THREE.Mesh( geometry, material );
 * scene.add( hairBundle );
 * ```
 *
 * @augments THREE.BufferGeometry
 */
class HairBundleGeometry extends THREE.BufferGeometry {
  /**
   * Constructs a new hair bundle geometry.
   *
   * @param {number} [radius=1] - Radius of the hair bundle.
   * @param {number} [height=1] - Height of the hair bundle.
   * @param {number} [radialSegments=8] - Number of segmented faces around the circumference of the hair bundle.
   * @param {number} [heightSegments=1] - number of rows of faces along the height of the hair bundle.
   */
  constructor(radius = 1, height = 1, radialSegments = 32, heightSegments = 1) {
    super();

    this.type = "HairBundleGeometry";

    /**
     * Holds the constructor parameters that have been
     * used to generate the geometry. Any modification
     * after instantiation does not change the geometry.
     *
     * @type {Object}
     */
    this.parameters = {
      radius: radius,
      height: height,
      radialSegments: radialSegments,
      heightSegments: heightSegments,
    };

    radialSegments = Math.floor(radialSegments);
    heightSegments = Math.floor(heightSegments);

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    // helper variables

    let index = 0;
    const grid = [];
    const halfHeight = height / 2;

    const normal = new Vector3();
    const vertex = new Vector3();

    // generate vertices, normals, and uvs

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];

      const v = iy / heightSegments;

      for (let ix = 0; ix <= radialSegments; ix++) {
        const u = ix / radialSegments;

        const theta = u * Math.PI * 2;

        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        // vertex

        vertex.x = radius * sinTheta;
        vertex.y = -v * height + halfHeight;
        vertex.z = radius * cosTheta;
        vertices.push(vertex.x, vertex.y, vertex.z);

        // normal

        normal.set(sinTheta, 0, cosTheta);
        normals.push(normal.x, normal.y, normal.z);

        // uv

        uvs.push(u, 1 - v);

        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    // indices

    for (let ix = 0; ix < radialSegments; ix++) {
      for (let iy = 0; iy < heightSegments; iy++) {
        const a = grid[iy][ix];
        const b = grid[iy + 1][ix];
        const c = grid[iy + 1][ix + 1];
        const d = grid[iy][ix + 1];

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    // build geometry

    this.setIndex(indices);
    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }

  copy(source) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }

  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {HairBundleGeometry} A new instance.
   */
  static fromJSON(data) {
    return new HairBundleGeometry(
      data.radius,
      data.height,
      data.radialSegments,
      data.heightSegments
    );
  }
}

export { HairBundleGeometry };
