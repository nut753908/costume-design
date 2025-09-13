import { ControlPoint3 } from "src/curve/control-point-3";
import { Curve3 } from "src/curve/curve-3";
import {
  circleCurve2,
  constant0Curve2,
  constant1Curve2,
  smallCircleCurve2,
} from "src/curve/samples/curve-2";
import { constant0Curve3 } from "src/curve/samples/curve-3";
import {
  computeFrenetFrames,
  TubeBaseGeometry,
  type TubeBaseGeometryJSON,
} from "src/geometry/tube-base";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("TubeBaseGeometry", () => {
  describe("constructor()", () => {
    test("set params", () => {
      const axis = constant0Curve3.clone();
      const cross = smallCircleCurve2.clone();
      const scaleC = constant1Curve2.clone();
      const xScaleC = constant1Curve2.clone();
      const yScaleC = constant1Curve2.clone();
      const xCurvatureC = constant0Curve2.clone();
      const yCurvatureC = constant0Curve2.clone();
      const tiltC = constant0Curve2.clone();
      const g = new TubeBaseGeometry(
        axis,
        cross,
        1,
        3,
        2,
        2,
        2,
        1,
        1,
        1,
        scaleC,
        xScaleC,
        yScaleC,
        xCurvatureC,
        yCurvatureC,
        tiltC,
        "yx"
      );
      const p = g.parameters;
      expect(p.axis).toEqual(axis);
      expect(p.cross).toEqual(cross);
      expect(p.axisSegments).toBe(1);
      expect(p.crossSegments).toBe(3);
      expect(p.scaleN).toBe(2);
      expect(p.xScaleN).toBe(2);
      expect(p.yScaleN).toBe(2);
      expect(p.xCurvatureN).toBe(1);
      expect(p.yCurvatureN).toBe(1);
      expect(p.tiltN).toBe(1);
      expect(p.scaleC).toEqual(scaleC);
      expect(p.xScaleC).toEqual(xScaleC);
      expect(p.yScaleC).toEqual(yScaleC);
      expect(p.xCurvatureC).toEqual(xCurvatureC);
      expect(p.yCurvatureC).toEqual(yCurvatureC);
      expect(p.tiltC).toEqual(tiltC);
      expect(p.curvatureOrder).toBe("yx");
    });
  });

  test("clone()", () => {
    const axis = constant0Curve3.clone();
    const cross = smallCircleCurve2.clone();
    const scaleC = constant1Curve2.clone();
    const xScaleC = constant1Curve2.clone();
    const yScaleC = constant1Curve2.clone();
    const xCurvatureC = constant0Curve2.clone();
    const yCurvatureC = constant0Curve2.clone();
    const tiltC = constant0Curve2.clone();
    const g1 = new TubeBaseGeometry(
      axis,
      cross,
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      scaleC,
      xScaleC,
      yScaleC,
      xCurvatureC,
      yCurvatureC,
      tiltC,
      "yx"
    );
    const g2 = g1.clone();
    g2.uuid = g1.uuid;
    expect(JSON.stringify(g1)).toEqual(JSON.stringify(g2));
  });

  test("copy()", () => {
    const axis = constant0Curve3.clone();
    const cross = smallCircleCurve2.clone();
    const scaleC = constant1Curve2.clone();
    const xScaleC = constant1Curve2.clone();
    const yScaleC = constant1Curve2.clone();
    const xCurvatureC = constant0Curve2.clone();
    const yCurvatureC = constant0Curve2.clone();
    const tiltC = constant0Curve2.clone();
    const g1 = new TubeBaseGeometry(
      axis,
      cross,
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      scaleC,
      xScaleC,
      yScaleC,
      xCurvatureC,
      yCurvatureC,
      tiltC,
      "yx"
    );
    const g2 = new TubeBaseGeometry().copy(g1);
    g2.uuid = g1.uuid;
    expect(JSON.stringify(g1)).toEqual(JSON.stringify(g2));
  });

  const _json: TubeBaseGeometryJSON = {
    metadata: {
      version: 4.7,
      type: "BufferGeometry",
      generator: "BufferGeometry.toJSON",
    },
    uuid: "", // (unknown)
    type: "TubeBaseGeometry",
    axis: constant0Curve3.toJSON(),
    cross: smallCircleCurve2.toJSON(),
    axisSegments: 1,
    crossSegments: 3,
    scaleN: 2,
    xScaleN: 2,
    yScaleN: 2,
    xCurvatureN: 1,
    yCurvatureN: 1,
    tiltN: 1,
    scaleC: constant1Curve2.toJSON(),
    xScaleC: constant1Curve2.toJSON(),
    yScaleC: constant1Curve2.toJSON(),
    xCurvatureC: constant0Curve2.toJSON(),
    yCurvatureC: constant0Curve2.toJSON(),
    tiltC: constant0Curve2.toJSON(),
    curvatureOrder: "yx",
  };

  test("toJSON()", () => {
    const axis = constant0Curve3.clone();
    const cross = smallCircleCurve2.clone();
    const scaleC = constant1Curve2.clone();
    const xScaleC = constant1Curve2.clone();
    const yScaleC = constant1Curve2.clone();
    const xCurvatureC = constant0Curve2.clone();
    const yCurvatureC = constant0Curve2.clone();
    const tiltC = constant0Curve2.clone();
    const g1 = new TubeBaseGeometry(
      axis,
      cross,
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      scaleC,
      xScaleC,
      yScaleC,
      xCurvatureC,
      yCurvatureC,
      tiltC,
      "yx"
    );
    const json1 = g1.toJSON();
    const json2 = _json;
    json2.uuid = json1.uuid;
    expect(json1).toEqual(json2);
  });
});

describe("computeFrenetFrames()", () => {
  test("verify that the returned values ​​of Curve{3,2} are the same", () => {
    const curve2 = circleCurve2.clone();
    const curve3 = new Curve3(
      curve2.cps.map(
        (cp) =>
          new ControlPoint3(
            new THREE.Vector3(cp.middlePos.x, cp.middlePos.y, 0),
            new THREE.Vector3(cp.leftPos.x, cp.leftPos.y, 0),
            new THREE.Vector3(cp.rightPos.x, cp.rightPos.y, 0),
            cp.isSyncRadius,
            cp.isSyncAngle
          )
      )
    );
    const segments = 8; // any number
    const frames3 = curve3.computeFrenetFrames(segments);
    const frames2 = computeFrenetFrames(curve2, segments);
    expect(frames3).toEqual(frames2);
  });
});
