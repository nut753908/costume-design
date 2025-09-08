import * as THREE from "three";

import { constant0Curve3 } from "../curve/samples/curve-3";
import {
  smallCircleCurve2,
  constant1Curve2,
  constant0Curve2,
} from "../curve/samples/curve-2";

/**
 * A geometry class for representing a tube.
 *
 * ```js
 * import { constant0Curve3 } from "./src/curve/sample/curve-3";
 * import { smallCircleCurve2, constant1Curve2, constant0Curve2 } from "./src/curve/samples/curve-2";
 * import { TubeBaseGeometry } from "./src/geometry/tube-base";
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
  type: string;
  parameters: TubeBaseGeometryParameters;

  /**
   * Constructs a new tube geometry.
   *
   * @param axis - {@link TubeBaseGeometryParameters#axis}
   * @param cross - {@link TubeBaseGeometryParameters#cross}
   * @param axisSegments - {@link TubeBaseGeometryParameters#axisSegments}
   * @param crossSegments - {@link TubeBaseGeometryParameters#crossSegments}
   * @param scaleN - {@link TubeBaseGeometryParameters#scaleN}
   * @param xScaleN - {@link TubeBaseGeometryParameters#xScaleN}
   * @param yScaleN - {@link TubeBaseGeometryParameters#yScaleN}
   * @param xCurvatureN - {@link TubeBaseGeometryParameters#xCurvatureN}
   * @param yCurvatureN - {@link TubeBaseGeometryParameters#yCurvatureN}
   * @param tiltN - {@link TubeBaseGeometryParameters#tiltN}
   * @param scaleC - {@link TubeBaseGeometryParameters#scaleC}
   * @param xScaleC - {@link TubeBaseGeometryParameters#xScaleC}
   * @param yScaleC - {@link TubeBaseGeometryParameters#yScaleC}
   * @param xCurvatureC - {@link TubeBaseGeometryParameters#xCurvatureC}
   * @param yCurvatureC - {@link TubeBaseGeometryParameters#yCurvatureC}
   * @param tiltC - {@link TubeBaseGeometryParameters#tiltC}
   * @param curvatureOrder - {@link TubeBaseGeometryParameters#curvatureOrder}
   */
  constructor(
    axis: THREE.Curve<THREE.Vector3> = constant0Curve3.clone(),
    cross: THREE.Curve<THREE.Vector2> = smallCircleCurve2.clone(),
    axisSegments = 4,
    crossSegments = 8,
    scaleN = 1,
    xScaleN = 1,
    yScaleN = 1,
    xCurvatureN = 0,
    yCurvatureN = 0,
    tiltN = 0,
    scaleC: THREE.Curve<THREE.Vector2> = constant1Curve2.clone(),
    xScaleC: THREE.Curve<THREE.Vector2> = constant1Curve2.clone(),
    yScaleC: THREE.Curve<THREE.Vector2> = constant1Curve2.clone(),
    xCurvatureC: THREE.Curve<THREE.Vector2> = constant0Curve2.clone(),
    yCurvatureC: THREE.Curve<THREE.Vector2> = constant0Curve2.clone(),
    tiltC: THREE.Curve<THREE.Vector2> = constant0Curve2.clone(),
    curvatureOrder: "xy" | "yx" = "xy"
  ) {
    super();
    this.type = "TubeBaseGeometry";

    /**
     * Holds the constructor parameters that have been
     * used to generate the geometry. Any modification
     * after instantiation does not change the geometry.
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

    // FIXME:
    cross.getTangentAt = function (
      u: number,
      optionalTarget: THREE.Vector3
    ): THREE.Vector3 {
      const t = this.getUtoTmapping(u, 0);
      const p = this.getTangent(t, optionalTarget);
      return new THREE.Vector3(p.x, p.y, 0); // Change from Vector2 to Vector3 before computeFrenetFrames().
    };

    const axisFrames = axis.computeFrenetFrames(axisSegments, false);
    const crossFrames = cross.computeFrenetFrames(crossSegments, false);

    const CPs = cross.getSpacedPoints(crossSegments);
    const CBs = crossFrames.binormals.map((b) => new THREE.Vector2(b.x, b.y));

    const center = new THREE.Vector2(0, 0);

    const CPsA: THREE.Vector2[] = []; // A: After

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

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

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

      calculateCBzAndSetNormals();

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
          CPsA.push(CP.clone());

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

      /**
       * Apply the xCurvature to CP(Cross Point).
       */
      function applyXCurvatureToCP(xCurvature: number, CP: THREE.Vector2) {
        if (xCurvature === 0) return;
        const r = 1 / xCurvature;
        const rMinuxX = r - CP.x;
        const theta = CP.y * xCurvature;
        CP.x = r - rMinuxX * Math.cos(theta);
        CP.y = rMinuxX * Math.sin(theta);
      }

      /**
       * Apply the yCurvature to CP(Cross Point).
       */
      function applyYCurvatureToCP(yCurvature: number, CP: THREE.Vector2) {
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
       * @param CPy - The y value of CP(Cross Point) before appling the tilt.
       */
      function applyXCurvatureToCB(
        xCurvature: number,
        CPy: number,
        CB: THREE.Vector2
      ) {
        if (xCurvature === 0) return;
        const theta = CPy * xCurvature;
        CB.rotateAround(center, -theta);
      }

      /**
       * Apply the yCurvature to CB(Cross Binormal).
       *
       * @param CPx - The x value of CP(Cross Point) before appling the tilt.
       */
      function applyYCurvatureToCB(
        yCurvature: number,
        CPx: number,
        CB: THREE.Vector2
      ) {
        if (yCurvature === 0) return;
        const theta = CPx * yCurvature;
        CB.rotateAround(center, theta);
      }
    }

    function calculateCBzAndSetNormals() {
      const l = axis.getLength() / axisSegments; // l: axis length devided by axisSegments
      let c, r; // c: cross vector, r: CBz

      for (let i = 0; i <= axisSegments; i++) {
        const AT = axisFrames.tangents[i];

        for (let j = 0; j <= crossSegments; j++) {
          const n12 = (crossSegments + 1) * (i - 1) + j;
          const n21 = (crossSegments + 1) * i + (j - 1);
          const n22 = (crossSegments + 1) * i + j;
          const n23 = (crossSegments + 1) * i + (j + 1);
          const n32 = (crossSegments + 1) * (i + 1) + j;

          // Calculate CBz (as r).
          if (i === 0) {
            if (j === 0) {
              const CP23 = new THREE.Vector3(CPsA[n23].x, CPsA[n23].y, 0);
              const CP32 = new THREE.Vector3(CPsA[n32].x, CPsA[n32].y, l);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v23 = CP23.clone().sub(CP22);
              const v32 = CP32.clone().sub(CP22);
              c = v23.clone().cross(v32);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              r = z1 / xy1;
            } else if (j === crossSegments) {
              const CP32 = new THREE.Vector3(CPsA[n32].x, CPsA[n32].y, l);
              const CP21 = new THREE.Vector3(CPsA[n21].x, CPsA[n21].y, 0);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v32 = CP32.clone().sub(CP22);
              const v21 = CP21.clone().sub(CP22);
              c = v32.clone().cross(v21);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              r = z1 / xy1;
            } else {
              const CP23 = new THREE.Vector3(CPsA[n23].x, CPsA[n23].y, 0);
              const CP32 = new THREE.Vector3(CPsA[n32].x, CPsA[n32].y, l);
              const CP21 = new THREE.Vector3(CPsA[n21].x, CPsA[n21].y, 0);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v23 = CP23.clone().sub(CP22);
              const v32 = CP32.clone().sub(CP22);
              const v21 = CP21.clone().sub(CP22);
              c = v23.clone().cross(v32);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              c = v32.clone().cross(v21);
              const xy2 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z2 = c.z;
              r = (z1 + z2) / (xy1 + xy2);
            }
          } else if (i === axisSegments) {
            if (j === 0) {
              const CP12 = new THREE.Vector3(CPsA[n12].x, CPsA[n12].y, -l);
              const CP23 = new THREE.Vector3(CPsA[n23].x, CPsA[n23].y, 0);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v12 = CP12.clone().sub(CP22);
              const v23 = CP23.clone().sub(CP22);
              c = v12.clone().cross(v23);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              r = z1 / xy1;
            } else if (j === crossSegments) {
              const CP21 = new THREE.Vector3(CPsA[n21].x, CPsA[n21].y, 0);
              const CP12 = new THREE.Vector3(CPsA[n12].x, CPsA[n12].y, -l);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v21 = CP21.clone().sub(CP22);
              const v12 = CP12.clone().sub(CP22);
              c = v21.clone().cross(v12);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              r = z1 / xy1;
            } else {
              const CP21 = new THREE.Vector3(CPsA[n21].x, CPsA[n21].y, 0);
              const CP12 = new THREE.Vector3(CPsA[n12].x, CPsA[n12].y, -l);
              const CP23 = new THREE.Vector3(CPsA[n23].x, CPsA[n23].y, 0);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v21 = CP21.clone().sub(CP22);
              const v12 = CP12.clone().sub(CP22);
              const v23 = CP23.clone().sub(CP22);
              c = v21.clone().cross(v12);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              c = v12.clone().cross(v23);
              const xy2 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z2 = c.z;
              r = (z1 + z2) / (xy1 + xy2);
            }
          } else {
            if (j === 0) {
              const CP12 = new THREE.Vector3(CPsA[n12].x, CPsA[n12].y, -l);
              const CP23 = new THREE.Vector3(CPsA[n23].x, CPsA[n23].y, 0);
              const CP32 = new THREE.Vector3(CPsA[n32].x, CPsA[n32].y, l);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v12 = CP12.clone().sub(CP22);
              const v23 = CP23.clone().sub(CP22);
              const v32 = CP32.clone().sub(CP22);
              c = v12.clone().cross(v23);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              c = v23.clone().cross(v32);
              const xy2 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z2 = c.z;
              r = (z1 + z2) / (xy1 + xy2);
            } else if (j === crossSegments) {
              const CP32 = new THREE.Vector3(CPsA[n32].x, CPsA[n32].y, l);
              const CP21 = new THREE.Vector3(CPsA[n21].x, CPsA[n21].y, 0);
              const CP12 = new THREE.Vector3(CPsA[n12].x, CPsA[n12].y, -l);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v32 = CP32.clone().sub(CP22);
              const v21 = CP21.clone().sub(CP22);
              const v12 = CP12.clone().sub(CP22);
              c = v32.clone().cross(v21);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              c = v21.clone().cross(v12);
              const xy2 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z2 = c.z;
              r = (z1 + z2) / (xy1 + xy2);
            } else {
              const CP12 = new THREE.Vector3(CPsA[n12].x, CPsA[n12].y, -l);
              const CP23 = new THREE.Vector3(CPsA[n23].x, CPsA[n23].y, 0);
              const CP32 = new THREE.Vector3(CPsA[n32].x, CPsA[n32].y, l);
              const CP21 = new THREE.Vector3(CPsA[n21].x, CPsA[n21].y, 0);
              const CP22 = new THREE.Vector3(CPsA[n22].x, CPsA[n22].y, 0);
              const v12 = CP12.clone().sub(CP22);
              const v23 = CP23.clone().sub(CP22);
              const v32 = CP32.clone().sub(CP22);
              const v21 = CP21.clone().sub(CP22);
              c = v12.clone().cross(v23);
              const xy1 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z1 = c.z;
              c = v23.clone().cross(v32);
              const xy2 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z2 = c.z;
              c = v32.clone().cross(v21);
              const xy3 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z3 = c.z;
              c = v21.clone().cross(v12);
              const xy4 = Math.sqrt(c.x ** 2 + c.y ** 2) + Number.EPSILON;
              const z4 = c.z;
              r = (z1 + z2 + z3 + z4) / (xy1 + xy2 + xy3 + xy4);
            }
          }

          // Set normals.
          normal.x = normals[n22 * 3] + r * AT.x;
          normal.y = normals[n22 * 3 + 1] + r * AT.y;
          normal.z = normals[n22 * 3 + 2] + r * AT.z;
          normal.normalize();
          normals[n22 * 3] = normal.x;
          normals[n22 * 3 + 1] = normal.y;
          normals[n22 * 3 + 2] = normal.z;
        }
      }
    }

    function generateIndices() {
      for (let i = 1; i <= axisSegments; i++) {
        for (let j = 1; j <= crossSegments; j++) {
          // start the debug code
          if (j === crossSegments) {
            const a = (crossSegments + 1) * (i - 1) + (j - 1);
            const b = (crossSegments + 1) * i + (j - 1);
            const c = (crossSegments + 1) * i;
            const d = (crossSegments + 1) * (i - 1);

            indices.push(a, b, d);
            indices.push(b, c, d);
            continue;
          }
          // end the debug code
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
   * @param source - The tube geometry to copy.
   * @return  A reference to this tube geometry.
   */
  copy(source: TubeBaseGeometry): this {
    super.copy(source);
    this.parameters = {
      axis: source.parameters.axis.clone(),
      cross: source.parameters.cross.clone(),
      axisSegments: source.parameters.axisSegments,
      crossSegments: source.parameters.crossSegments,
      scaleN: source.parameters.scaleN,
      xScaleN: source.parameters.xScaleN,
      yScaleN: source.parameters.yScaleN,
      xCurvatureN: source.parameters.xCurvatureN,
      yCurvatureN: source.parameters.yCurvatureN,
      tiltN: source.parameters.tiltN,
      scaleC: source.parameters.scaleC.clone(),
      xScaleC: source.parameters.xScaleC.clone(),
      yScaleC: source.parameters.yScaleC.clone(),
      xCurvatureC: source.parameters.xCurvatureC.clone(),
      yCurvatureC: source.parameters.yCurvatureC.clone(),
      tiltC: source.parameters.tiltC.clone(),
      curvatureOrder: source.parameters.curvatureOrder,
    };

    return this;
  }

  /**
   * Serializes the tube geometry into JSON.
   *
   * @return  A JSON object representing the serialized tube geometry.
   */
  toJSON(): TubeBaseGeometryJSON {
    return {
      ...super.toJSON(),
      axis: this.parameters.axis.toJSON(),
      cross: this.parameters.cross.toJSON(),
      axisSegments: this.parameters.axisSegments,
      crossSegments: this.parameters.crossSegments,
      scaleN: this.parameters.scaleN,
      xScaleN: this.parameters.xScaleN,
      yScaleN: this.parameters.yScaleN,
      xCurvatureN: this.parameters.xCurvatureN,
      yCurvatureN: this.parameters.yCurvatureN,
      tiltN: this.parameters.tiltN,
      scaleC: this.parameters.scaleC.toJSON(),
      xScaleC: this.parameters.xScaleC.toJSON(),
      yScaleC: this.parameters.yScaleC.toJSON(),
      xCurvatureC: this.parameters.xCurvatureC.toJSON(),
      yCurvatureC: this.parameters.yCurvatureC.toJSON(),
      tiltC: this.parameters.tiltC.toJSON(),
      curvatureOrder: this.parameters.curvatureOrder,
    };
  }
}

/**
 * The interface for {@link TubeBaseGeometry} parameters.
 */
export interface TubeBaseGeometryParameters {
  /**
   * A 3D axial curve that passes through the center of the tube.
   */
  axis: THREE.Curve<THREE.Vector3>;

  /**
   * A 2D cross-sectional curve perpendicular to the axis.
   */
  cross: THREE.Curve<THREE.Vector2>;

  /**
   * The number of faces along the axis.
   */
  axisSegments: number;

  /**
   * The number of faces on the cross section.
   */
  crossSegments: number;

  /**
   * The cross section scale ratio.
   */
  scaleN: number;

  /**
   * The cross section scale ratio in the x direction.
   */
  xScaleN: number;

  /**
   * The cross section scale ratio in the y direction.
   */
  yScaleN: number;

  /**
   * The curvature of the cross section in the x direction.
   */
  xCurvatureN: number;

  /**
   * The curvature of the cross section in the y direction.
   */
  yCurvatureN: number;

  /**
   * The circumferential inclination angle of the cross section (in degrees).
   */
  tiltN: number;

  /**
   * The cross section scale ratio.
   * Only the y component is used for the scale.
   */
  scaleC: THREE.Curve<THREE.Vector2>;

  /**
   * The cross section scale ratio in the x direction.
   * Only the y component is used for the scale.
   */
  xScaleC: THREE.Curve<THREE.Vector2>;

  /**
   * The cross section scale ratio in the y direction.
   * Only the y component is used for the scale.
   */
  yScaleC: THREE.Curve<THREE.Vector2>;

  /**
   * The curvature of the cross section in the x direction.
   * Only the y component is used for the curvature.
   */
  xCurvatureC: THREE.Curve<THREE.Vector2>;

  /**
   * The curvature of the cross section in the y direction.
   * Only the y component is used for the curvature.
   */
  yCurvatureC: THREE.Curve<THREE.Vector2>;

  /**
   * The circumferential inclination angle of the cross section (in degrees).
   * Only the y component is used for the angle.
   */
  tiltC: THREE.Curve<THREE.Vector2>;

  /**
   * The order in which curvature is applied.
   * "xy" is x to y. "yx" is y to x.
   */
  curvatureOrder: "xy" | "yx";
}

/**
 * The {@link TubeBaseGeometryParameters} JSON interface.
 */
export interface TubeBaseGeometryParametersJSON {
  /** {@link TubeBaseGeometryParameters#axis} */
  axis: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#cross} */
  cross: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#axisSegments} */
  axisSegments: number;
  /** {@link TubeBaseGeometryParameters#crossSegments} */
  crossSegments: number;
  /** {@link TubeBaseGeometryParameters#scaleN} */
  scaleN: number;
  /** {@link TubeBaseGeometryParameters#xScaleN} */
  xScaleN: number;
  /** {@link TubeBaseGeometryParameters#yScaleN} */
  yScaleN: number;
  /** {@link TubeBaseGeometryParameters#xCurvatureN} */
  xCurvatureN: number;
  /** {@link TubeBaseGeometryParameters#yCurvatureN} */
  yCurvatureN: number;
  /** {@link TubeBaseGeometryParameters#tiltN} */
  tiltN: number;
  /** {@link TubeBaseGeometryParameters#scaleC} */
  scaleC: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#xScaleC} */
  xScaleC: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#yScaleC} */
  yScaleC: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#xCurvatureC} */
  xCurvatureC: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#yCurvatureC} */
  yCurvatureC: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#tiltC} */
  tiltC: THREE.CurveJSON;
  /** {@link TubeBaseGeometryParameters#curvatureOrder} */
  curvatureOrder: "xy" | "yx";
}

/**
 * The {@link TubeGeometry} JSON interface.
 */
export interface TubeBaseGeometryJSON
  extends THREE.BufferGeometryJSON,
    TubeBaseGeometryParametersJSON {}
