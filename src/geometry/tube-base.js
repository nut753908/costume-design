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
 * import { TubeBaseGeometry } from "./src/geometry/tube-base.js";
 *
 * const axis = constant0Curve3.clone();
 * const cross = smallCircleCurve2.clone();
 * const scaleC = constant1Curve2.clone();
 * const xScaleC = constant1Curve2.clone();
 * const yScaleC = constant1Curve2.clone();
 * const xCurvatureC = constant0Curve2.clone();
 * const yCurvatureC = constant0Curve2.clone();
 * const tiltC = constant0Curve2.clone();
 * const geometry = new TubeBaseGeometry( axis, cross, 4, 8, 1, 1, 1, 0, 0, 0, scaleC, xScaleC, yScaleC, xCurvatureC, yCurvatureC, tiltC, "xy" );
 * const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 * const mesh = new THREE.Mesh( geometry, material );
 * scene.add( mesh );
 * ```
 *
 * @augments THREE.BufferGeometry
 */
export class TubeBaseGeometry extends THREE.BufferGeometry {
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
   * @param {number} [xCurvatureN=0] - The curvature of the cross section in the x direction.
   * @param {number} [yCurvatureN=0] - The curvature of the cross section in the y direction.
   * @param {number} [tiltN=0] - The circumferential inclination angle of the cross section (in degrees).
   * @param {THREE.Curve<THREE.Vector2>} [scaleC] - The cross section scale ratio. Only the y component is used for the scale.
   * @param {THREE.Curve<THREE.Vector2>} [xScaleC] - The cross section scale ratio in the x direction. Only the y component is used for the scale.
   * @param {THREE.Curve<THREE.Vector2>} [yScaleC] - The cross section scale ratio in the y direction. Only the y component is used for the scale.
   * @param {THREE.Curve<THREE.Vector2>} [xCurvatureC] - The curvature of the cross section in the x direction. Only the y component is used for the curvature.
   * @param {THREE.Curve<THREE.Vector2>} [yCurvatureC] - The curvature of the cross section in the y direction. Only the y component is used for the curvature.
   * @param {THREE.Curve<THREE.Vector2>} [tiltC] - The circumferential inclination angle of the cross section (in degrees). Only the y component is used for the angle.
   * @param {"xy"|"yx"} [curvatureOrder] - The order in which curvature is applied. "xy" is x to y. "yx" is y to x.
   */
  constructor(
    axis = constant0Curve3.clone(),
    cross = smallCircleCurve2.clone(),
    axisSegments = 4,
    crossSegments = 8,
    scaleN = 1,
    xScaleN = 1,
    yScaleN = 1,
    xCurvatureN = 0,
    yCurvatureN = 0,
    tiltN = 0,
    scaleC = constant1Curve2.clone(),
    xScaleC = constant1Curve2.clone(),
    yScaleC = constant1Curve2.clone(),
    xCurvatureC = constant0Curve2.clone(),
    yCurvatureC = constant0Curve2.clone(),
    tiltC = constant0Curve2.clone(),
    curvatureOrder = "xy"
  ) {
    super();

    this.type = "TubeBaseGeometry";

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
      xCurvatureN: xCurvatureN,
      yCurvatureN: yCurvatureN,
      tiltN: tiltN,
      scaleC: scaleC,
      xScaleC: xScaleC,
      yScaleC: yScaleC,
      xCurvatureC: xCurvatureC,
      yCurvatureC: yCurvatureC,
      tiltC: tiltC,
      curvatureOrder: curvatureOrder,
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

    const CPsAfter = [];

    // helper variable

    const vertex = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const uv = new THREE.Vector2();
    let AP = new THREE.Vector3();
    let _P = new THREE.Vector2();

    let scale;
    let xScale;
    let yScale;
    let xCurvature;
    let yCurvature;
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
        xCurvature = xCurvatureN + xCurvatureC.getPointAt(u, _P).y;
        yCurvature = yCurvatureN + yCurvatureC.getPointAt(u, _P).y;
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
          const CPy = CP.y; // Used in applyCurvatureToCB() below.
          if (curvatureOrder === "xy") {
            applyXCurvatureToCP(xCurvature, CP);
            applyYCurvatureToCP(yCurvature, CP);
          } else if (curvatureOrder === "yx") {
            applyYCurvatureToCP(yCurvature, CP);
            applyXCurvatureToCP(xCurvature, CP);
          }
          CP.rotateAround(center, tilt);
          CPsAfter.push(CP.clone());

          const CB = CBs[j].clone();
          CB.x *= yScale;
          CB.y *= xScale;
          if (curvatureOrder === "xy") {
            applyXCurvatureToCB(xCurvature, CPy, CB);
            applyYCurvatureToCB(yCurvature, CPx, CB);
          } else if (curvatureOrder === "yx") {
            applyYCurvatureToCB(yCurvature, CPx, CB);
            applyXCurvatureToCB(xCurvature, CPy, CB);
          }
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

      const axisLengthSegment = axis.getLength() / axisSegments;
      let c, xy, z;

      for (let i = 0; i <= axisSegments; i++) {
        const AT = axisFrames.tangents[i];

        for (let j = 0; j <= crossSegments; j++) {
          const n0 = (crossSegments + 1) * i + j;
          if (i === 0) {
            const n22 = n0;
            const n32 = (crossSegments + 1) * (i + 1) + j;
            if (j === 0) {
              const n23 = (crossSegments + 1) * i + (j + 1);
              const CPsAfter3_n23 = new THREE.Vector3(
                CPsAfter[n23].x,
                CPsAfter[n23].y,
                0
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const CPsAfter3_n32 = new THREE.Vector3(
                CPsAfter[n32].x,
                CPsAfter[n32].y,
                axisLengthSegment
              );
              const v2322 = CPsAfter3_n23.clone().sub(CPsAfter3_n22);
              const v3222 = CPsAfter3_n32.clone().sub(CPsAfter3_n22);
              c = v2322.cross(v3222);
            } else {
              const n21 = (crossSegments + 1) * i + (j - 1);
              const CPsAfter3_n21 = new THREE.Vector3(
                CPsAfter[n21].x,
                CPsAfter[n21].y,
                0
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const CPsAfter3_n32 = new THREE.Vector3(
                CPsAfter[n32].x,
                CPsAfter[n32].y,
                axisLengthSegment
              );
              const v2122 = CPsAfter3_n21.clone().sub(CPsAfter3_n22);
              const v3222 = CPsAfter3_n32.clone().sub(CPsAfter3_n22);
              c = v3222.cross(v2122);
            }
            xy = Math.sqrt(c.x ** 2 + c.y ** 2);
            z = c.z;
          } else if (i === axisSegments) {
            const n12 = (crossSegments + 1) * (i - 1) + j;
            const n22 = n0;
            if (j === 0) {
              const n23 = (crossSegments + 1) * i + (j + 1);
              const CPsAfter3_n23 = new THREE.Vector3(
                CPsAfter[n23].x,
                CPsAfter[n23].y,
                0
              );
              const CPsAfter3_n12 = new THREE.Vector3(
                CPsAfter[n12].x,
                CPsAfter[n12].y,
                -axisLengthSegment
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const v2322 = CPsAfter3_n23.clone().sub(CPsAfter3_n22);
              const v1222 = CPsAfter3_n12.clone().sub(CPsAfter3_n22);
              c = v1222.cross(v2322);
            } else {
              const n21 = (crossSegments + 1) * i + (j - 1);
              const CPsAfter3_n21 = new THREE.Vector3(
                CPsAfter[n21].x,
                CPsAfter[n21].y,
                0
              );
              const CPsAfter3_n12 = new THREE.Vector3(
                CPsAfter[n12].x,
                CPsAfter[n12].y,
                -axisLengthSegment
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const v2122 = CPsAfter3_n21.clone().sub(CPsAfter3_n22);
              const v1222 = CPsAfter3_n12.clone().sub(CPsAfter3_n22);
              c = v2122.cross(v1222);
            }
            xy = Math.sqrt(c.x ** 2 + c.y ** 2);
            z = c.z;
          } else {
            const n12 = (crossSegments + 1) * (i - 1) + j;
            const n22 = n0;
            if (j === 0) {
              const n23 = (crossSegments + 1) * i + (j + 1);
              const CPsAfter3_n23 = new THREE.Vector3(
                CPsAfter[n23].x,
                CPsAfter[n23].y,
                0
              );
              const CPsAfter3_n12 = new THREE.Vector3(
                CPsAfter[n12].x,
                CPsAfter[n12].y,
                -axisLengthSegment
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const v2322 = CPsAfter3_n23.clone().sub(CPsAfter3_n22);
              const v1222 = CPsAfter3_n12.clone().sub(CPsAfter3_n22);
              c = v1222.cross(v2322);
            } else {
              const n21 = (crossSegments + 1) * i + (j - 1);
              const CPsAfter3_n21 = new THREE.Vector3(
                CPsAfter[n21].x,
                CPsAfter[n21].y,
                0
              );
              const CPsAfter3_n12 = new THREE.Vector3(
                CPsAfter[n12].x,
                CPsAfter[n12].y,
                -axisLengthSegment
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const v2122 = CPsAfter3_n21.clone().sub(CPsAfter3_n22);
              const v1222 = CPsAfter3_n12.clone().sub(CPsAfter3_n22);
              c = v2122.cross(v1222);
            }
            const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2);
            const z1 = c.z;
            const n32 = (crossSegments + 1) * (i + 1) + j;
            if (j === 0) {
              const n23 = (crossSegments + 1) * i + (j + 1);
              const CPsAfter3_n23 = new THREE.Vector3(
                CPsAfter[n23].x,
                CPsAfter[n23].y,
                0
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const CPsAfter3_n32 = new THREE.Vector3(
                CPsAfter[n32].x,
                CPsAfter[n32].y,
                axisLengthSegment
              );
              const v2322 = CPsAfter3_n23.clone().sub(CPsAfter3_n22);
              const v3222 = CPsAfter3_n32.clone().sub(CPsAfter3_n22);
              c = v2322.cross(v3222);
            } else {
              const n21 = (crossSegments + 1) * i + (j - 1);
              const CPsAfter3_n21 = new THREE.Vector3(
                CPsAfter[n21].x,
                CPsAfter[n21].y,
                0
              );
              const CPsAfter3_n22 = new THREE.Vector3(
                CPsAfter[n22].x,
                CPsAfter[n22].y,
                0
              );
              const CPsAfter3_n32 = new THREE.Vector3(
                CPsAfter[n32].x,
                CPsAfter[n32].y,
                axisLengthSegment
              );
              const v2122 = CPsAfter3_n21.clone().sub(CPsAfter3_n22);
              const v3222 = CPsAfter3_n32.clone().sub(CPsAfter3_n22);
              c = v3222.cross(v2122);
            }
            const xy2 = Math.sqrt(c.x ** 2 + c.y ** 2);
            const z2 = c.z;
            xy = (xy1 + xy2) / 2;
            z = (z1 + z2) / 2;
          }
          normal.x = normals[n0 * 3] + (z / xy) * AT.x;
          normal.y = normals[n0 * 3 + 1] + (z / xy) * AT.y;
          normal.z = normals[n0 * 3 + 2] + (z / xy) * AT.z;
          normal.normalize();
          normals[n0 * 3] = normal.x;
          normals[n0 * 3 + 1] = normal.y;
          normals[n0 * 3 + 2] = normal.z;
        }
      }

      /**
       * Apply the xCurvature to CP(Cross Point).
       *
       * @param {number} xCurvature
       * @param {THREE.Vector2} CP
       */
      function applyXCurvatureToCP(xCurvature, CP) {
        if (xCurvature === 0) return;
        const r = 1 / xCurvature;
        const rMinuxX = r - CP.x;
        const theta = CP.y * xCurvature;
        CP.x = r - rMinuxX * Math.cos(theta);
        CP.y = rMinuxX * Math.sin(theta);
      }

      /**
       * Apply the yCurvature to CP(Cross Point).
       *
       * @param {number} yCurvature
       * @param {THREE.Vector2} CP
       */
      function applyYCurvatureToCP(yCurvature, CP) {
        if (yCurvature === 0) return;
        const r = 1 / yCurvature;
        const rMinuxY = r - CP.y;
        const theta = CP.x * yCurvature;
        CP.x = rMinuxY * Math.sin(theta);
        CP.y = r - rMinuxY * Math.cos(theta);
      }

      /**
       * Apply the xCurvature to CB(Cross Binormal).
       *
       * @param {number} xCurvature
       * @param {number} CPy - The y value of CP(Cross Point) before appling the tilt.
       * @param {THREE.Vector2} CB
       */
      function applyXCurvatureToCB(xCurvature, CPy, CB) {
        if (xCurvature === 0) return;
        const theta = CPy * xCurvature;
        CB.rotateAround(center, -theta);
      }

      /**
       * Apply the yCurvature to CB(Cross Binormal).
       *
       * @param {number} yCurvature
       * @param {number} CPx - The x value of CP(Cross Point) before appling the tilt.
       * @param {THREE.Vector2} CB
       */
      function applyYCurvatureToCB(yCurvature, CPx, CB) {
        if (yCurvature === 0) return;
        const theta = CPx * yCurvature;
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
   * @param {TubeBaseGeometry} source - The tube geometry to copy.
   * @returns {TubeBaseGeometry} A reference to this tube geometry.
   */
  copy(source) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    Object.entries(source.parameters).forEach(([k, v]) => {
      if (v instanceof THREE.Curve) this.parameters[k] = v.clone();
    });

    return this;
  }

  /**
   * Serializes the tube geometry into JSON.
   *
   * @return {Object} A JSON object representing the serialized tube geometry.
   */
  toJSON() {
    const data = super.toJSON();

    Object.entries(this.parameters).forEach(([k, v]) => {
      if (v instanceof THREE.Curve) data[k] = v.toJSON();
    });

    return data;
  }
}
