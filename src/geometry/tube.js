import * as THREE from "three";

import { screwShapedCurve3 } from "../curve/samples/curve-3.js";

// TODO: Add updateGeometry() and setGUI() somewhere.
/**
 * A geometry class for representing a tube.
 *
 * ```js
 * import { screwShapedCurve3 } from "./src/curve/sample/curve-3.js";
 * import { TubeGeometry } from "./src/geometry/tube.js";
 *
 * const axis = screwShapedCurve3.clone();
 * const cross = new THREE.EllipseCurve( 0, 0, 0.5, 0.5 );
 * const geometry = new TubeGeometry( axis, cross, 12, 8, 1, 1, 1 );
 * const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 * const mesh = new THREE.Mesh( geometry, material );
 * scene.add( mesh );
 * ```
 *
 * @augments THREE.BufferGeometry
 */
export class TubeGeometry extends THREE.BufferGeometry {
  /**
   * Constructs a new tube geometry.
   *
   * @param {THREE.Curve} [axis] - A 3D axial curve that passes through the center of the tube.
   * @param {THREE.Curve} [cross] - A 2D cross-sectional curve perpendicular to the axis.
   * @param {number} [axisSegments=12] - The number of faces along the axis (per curve, not the entire curve path).
   * @param {number} [crossSegments=8] - The number of faces on the cross section.
   * @param {number|THREE.Curve} [scale=1] - The cross section scale ratio. For curve, only the y component is used for the scale.
   * @param {number|THREE.Curve} [xScale=1] - The cross section scale ratio in the x direction. For curve, only the y component is used for the scale.
   * @param {number|THREE.Curve} [yScale=1] - The cross section scale ratio in the y direction. For curve, only the y component is used for the scale.
   */
  constructor(
    axis = screwShapedCurve3.clone(),
    cross = new THREE.EllipseCurve(0, 0, 0.5, 0.5),
    axisSegments = 12,
    crossSegments = 8,
    scale = 1,
    xScale = 1,
    yScale = 1
  ) {
    super();

    this.type = "TubeGeometry";

    /**
     * Holds the constructor parameters that have been
     * used to generate the geometry. Any modification
     * after instantiation does not change the geometry.
     *
     * @type {Object}
     */
    this.parameters = {
      axis: axis,
      cross: cross,
      axisSegments: axisSegments,
      crossSegments: crossSegments,
      scale: scale,
      xScale: xScale,
      yScale: yScale,
    };

    cross.getTangentAt = function (u, optionalTarget) {
      const t = this.getUtoTmapping(u);
      const point = this.getTangent(t, optionalTarget);
      return new THREE.Vector3(point.x, point.y, 0); // Change from Vector2 to Vector3 before computeFrenetFrames().
    };
    const axisFrames = axis.computeFrenetFrames(axisSegments, false);
    const crossFrames = cross.computeFrenetFrames(crossSegments, false);

    // helper variable

    const vertex = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const uv = new THREE.Vector2();
    let AP = new THREE.Vector3();
    let SP = new THREE.Vector2();
    let XSP = new THREE.Vector2();
    let YSP = new THREE.Vector2();
    let CP = new THREE.Vector2();

    // buffer

    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    // create buffer data

    generateBufferData();

    // build geometry

    this.setIndex(indices);
    this.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    // functions

    function generateBufferData() {
      generateSegment();

      generateUVs();

      generateIndices();
    }

    function generateSegment() {
      for (let i = 0; i <= axisSegments; i++) {
        // we use getPointAt to sample evenly distributed points from the given path

        AP = axis.getPointAt(i / axisSegments, AP);
        if (typeof scale !== "number")
          SP = scale.getPointAt(i / axisSegments, SP);
        if (typeof xScale !== "number")
          XSP = xScale.getPointAt(i / axisSegments, XSP);
        if (typeof yScale !== "number")
          YSP = yScale.getPointAt(i / axisSegments, YSP);

        // retrieve corresponding normal and binormal

        const AN = axisFrames.normals[i];
        const AB = axisFrames.binormals[i];

        // generate normals and vertices for the current segment

        for (let j = 0; j <= crossSegments; j++) {
          CP = cross.getPointAt(j / crossSegments, CP);
          CP.multiplyScalar(typeof scale !== "number" ? SP.y : scale);
          CP.x *= typeof xScale !== "number" ? XSP.y : xScale;
          CP.y *= typeof yScale !== "number" ? YSP.y : yScale;

          const CB = crossFrames.binormals[j].clone();
          CB.x *= typeof yScale !== "number" ? YSP.y : yScale;
          CB.y *= typeof xScale !== "number" ? XSP.y : xScale;

          // normal

          normal.x = CB.x * AN.x + -CB.y * AB.x;
          normal.y = CB.x * AN.y + -CB.y * AB.y;
          normal.z = CB.x * AN.z + -CB.y * AB.z;
          normal.normalize();

          normals.push(normal.x, normal.y, normal.z);

          // vertex

          vertex.x = AP.x + -CP.x * AN.x + CP.y * AB.x;
          vertex.y = AP.y + -CP.x * AN.y + CP.y * AB.y;
          vertex.z = AP.z + -CP.x * AN.z + CP.y * AB.z;

          vertices.push(vertex.x, vertex.y, vertex.z);
        }
      }
    }

    function generateIndices() {
      for (let i = 1; i <= axisSegments; i++) {
        for (let j = 1; j <= crossSegments; j++) {
          const a = (crossSegments + 1) * (i - 1) + (j - 1);
          const b = (crossSegments + 1) * i + (j - 1);
          const c = (crossSegments + 1) * i + j;
          const d = (crossSegments + 1) * (i - 1) + j;

          // faces

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }

    function generateUVs() {
      for (let i = 0; i <= axisSegments; i++) {
        for (let j = 0; j <= crossSegments; j++) {
          uv.x = i / axisSegments;
          uv.y = j / crossSegments;

          uvs.push(uv.x, uv.y);
        }
      }
    }
  }

  copy(source) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }
}
