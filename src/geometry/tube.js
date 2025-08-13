import * as THREE from "three";

import { constant0Curve3 } from "../curve/samples/curve-3.js";
import {
  smallCircleCurve2,
  constant1Curve2,
  constant0Curve2,
} from "../curve/samples/curve-2.js";

/**
 * A geometry class for representing a tube.
 *
 * ```js
 * import { constant0Curve3 } from "./src/curve/sample/curve-3.js";
 * import { smallCircleCurve2, constant1Curve2, constant0Curve2 } from "./src/curve/samples/curve-2.js";
 * import { TubeGeometry } from "./src/geometry/tube.js";
 *
 * const axis = constant0Curve3.clone();
 * const cross = smallCircleCurve2.clone();
 * const scaleC = constant1Curve2.clone();
 * const xScaleC = constant1Curve2.clone();
 * const yScaleC = constant1Curve2.clone();
 * const curvatureC = constant0Curve2.clone();
 * const tiltC = constant0Curve2.clone();
 * const geometry = new TubeGeometry( axis, cross, 4, 8, 1, 1, 1, 0, 0, scaleC, xScaleC, yScaleC, curvatureC, tiltC );
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
   * @param {THREE.Curve<THREE.Vector3>} [axis] - A 3D axial curve that passes through the center of the tube.
   * @param {THREE.Curve<THREE.Vector2>} [cross] - A 2D cross-sectional curve perpendicular to the axis.
   * @param {number} [axisSegments=4] - The number of faces along the axis.
   * @param {number} [crossSegments=8] - The number of faces on the cross section.
   * @param {number} [scaleN=1] - The cross section scale ratio.
   * @param {number} [xScaleN=1] - The cross section scale ratio in the x direction.
   * @param {number} [yScaleN=1] - The cross section scale ratio in the y direction.
   * @param {number} [curvatureN=0] - The curvature of the cross section in the y direction.
   * @param {number} [tiltN=0] - The circumferential inclination angle of the cross section (in degrees).
   * @param {THREE.Curve<THREE.Vector2>} [scaleC] - The cross section scale ratio. Only the y component is used for the scale.
   * @param {THREE.Curve<THREE.Vector2>} [xScaleC] - The cross section scale ratio in the x direction. Only the y component is used for the scale.
   * @param {THREE.Curve<THREE.Vector2>} [yScaleC] - The cross section scale ratio in the y direction. Only the y component is used for the scale.
   * @param {THREE.Curve<THREE.Vector2>} [curvatureC] - The curvature of the cross section in the y direction. Only the y component is used for the curvature.
   * @param {THREE.Curve<THREE.Vector2>} [tiltC] - The circumferential inclination angle of the cross section (in degrees). Only the y component is used for the angle.
   */
  constructor(
    axis = constant0Curve3.clone(),
    cross = smallCircleCurve2.clone(),
    axisSegments = 4,
    crossSegments = 8,
    scaleN = 1,
    xScaleN = 1,
    yScaleN = 1,
    curvatureN = 0,
    tiltN = 0,
    scaleC = constant1Curve2.clone(),
    xScaleC = constant1Curve2.clone(),
    yScaleC = constant1Curve2.clone(),
    curvatureC = constant0Curve2.clone(),
    tiltC = constant0Curve2.clone()
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
      scaleN: scaleN,
      xScaleN: xScaleN,
      yScaleN: yScaleN,
      curvatureN: curvatureN,
      tiltN: tiltN,
      scaleC: scaleC,
      xScaleC: xScaleC,
      yScaleC: yScaleC,
      curvatureC: curvatureC,
      tiltC: tiltC,
    };

    cross.getTangentAt = function (u, optionalTarget) {
      const t = this.getUtoTmapping(u);
      const p = this.getTangent(t, optionalTarget);
      return new THREE.Vector3(p.x, p.y, 0); // Change from Vector2 to Vector3 before computeFrenetFrames().
    };

    const axisFrames = axis.computeFrenetFrames(axisSegments, false);
    const crossFrames = cross.computeFrenetFrames(crossSegments, false);

    const CPs = cross.getSpacedPoints(crossSegments);
    const CBs = crossFrames.binormals.map((b) => new THREE.Vector2(b.x, b.y));

    const center = new THREE.Vector2(0, 0);

    // helper variable

    const vertex = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const uv = new THREE.Vector2();
    let AP = new THREE.Vector3();
    let _P = new THREE.Vector2();

    let scale;
    let xScale;
    let yScale;
    let curvature;
    let tilt;

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

        const u = i / axisSegments;
        AP = axis.getPointAt(u, AP);
        scale = scaleN * scaleC.getPointAt(u, _P).y;
        xScale = xScaleN * xScaleC.getPointAt(u, _P).y;
        yScale = yScaleN * yScaleC.getPointAt(u, _P).y;
        curvature = curvatureN + curvatureC.getPointAt(u, _P).y;
        tilt = THREE.MathUtils.degToRad(tiltN + tiltC.getPointAt(u, _P).y);

        // retrieve corresponding normal and binormal

        const AN = axisFrames.normals[i];
        const AB = axisFrames.binormals[i];

        // generate normals and vertices for the current segment

        for (let j = 0; j <= crossSegments; j++) {
          const CP = CPs[j].clone();
          CP.multiplyScalar(scale);
          CP.x *= xScale;
          CP.y *= yScale;
          const CPx = CP.x; // Used in applyCurvatureToCB() below.
          applyCurvatureToCP(curvature, CP);
          CP.rotateAround(center, tilt);

          const CB = CBs[j].clone();
          CB.x *= yScale;
          CB.y *= xScale;
          applyCurvatureToCB(curvature, CPx, CB);
          CB.rotateAround(center, tilt);

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

      /**
       * Apply the curvature to CP(Cross Point).
       *
       * @param {number} curvature
       * @param {THREE.Vector2} CP
       */
      function applyCurvatureToCP(curvature, CP) {
        if (curvature === 0) return;
        const r = 1 / curvature;
        const rMinuxY = r - CP.y;
        const theta = CP.x * curvature;
        CP.x = rMinuxY * Math.sin(theta);
        CP.y = r - rMinuxY * Math.cos(theta);
      }

      /**
       * Apply the curvature to CB(Cross Binormal).
       *
       * @param {number} curvature
       * @param {number} CPx - The x value of CP(Cross Point) before appling the tilt.
       * @param {THREE.Vector2} CB
       */
      function applyCurvatureToCB(curvature, CPx, CB) {
        if (curvature === 0) return;
        const theta = CPx * curvature;
        CB.rotateAround(center, theta);
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

  /**
   * Copies the values of the given tube geometry to this instance.
   *
   * @param {TubeGeometry} source - The tube geometry to copy.
   * @returns {TubeGeometry} A reference to this tube geometry.
   */
  copy(source) {
    super.copy(source);

    this.parameters.axis.copy(source.parameters.axis);
    this.parameters.cross.copy(source.parameters.cross);
    this.parameters.axisSegments = source.parameters.axisSegments;
    this.parameters.crossSegments = source.parameters.crossSegments;
    this.parameters.scaleN = source.parameters.scaleN;
    this.parameters.xScaleN = source.parameters.xScaleN;
    this.parameters.yScaleN = source.parameters.yScaleN;
    this.parameters.curvatureN = source.parameters.curvatureN;
    this.parameters.tiltN = source.parameters.tiltN;
    this.parameters.scaleC.copy(source.parameters.scaleC);
    this.parameters.xScaleC.copy(source.parameters.xScaleC);
    this.parameters.yScaleC.copy(source.parameters.yScaleC);
    this.parameters.curvatureC.copy(source.parameters.curvatureC);
    this.parameters.tiltC.copy(source.parameters.tiltC);

    return this;
  }
}
