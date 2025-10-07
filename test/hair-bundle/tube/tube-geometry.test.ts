import {
  constant0Curve2,
  constant1Curve2,
  smallCircleCurve2,
} from "src/hair-bundle/curve/sample-curve-2";
import { constant0Curve3 } from "src/hair-bundle/curve/sample-curve-3";
import {
  TubeGeometry,
  type TubeGeometryJSON,
} from "src/hair-bundle/tube/tube-geometry";
import { describe, expect, test } from "vitest";

describe("TubeGeometry", () => {
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
      const g = new TubeGeometry(
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
    const g1 = new TubeGeometry(
      constant0Curve3.clone(),
      smallCircleCurve2.clone(),
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      "yx"
    );
    const g2 = g1.clone();
    g2.uuid = g1.uuid;
    expect(JSON.stringify(g1)).toEqual(JSON.stringify(g2));
  });

  test("copy()", () => {
    const g1 = new TubeGeometry(
      constant0Curve3.clone(),
      smallCircleCurve2.clone(),
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      "yx"
    );
    const g2 = new TubeGeometry().copy(g1);
    g2.uuid = g1.uuid;
    expect(JSON.stringify(g1)).toEqual(JSON.stringify(g2));
  });

  const _json: TubeGeometryJSON = {
    metadata: {
      version: 4.7,
      type: "BufferGeometry",
      generator: "BufferGeometry.toJSON",
    },
    uuid: "", // (unknown)
    type: "TubeGeometry",
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
    const g1 = new TubeGeometry(
      constant0Curve3.clone(),
      smallCircleCurve2.clone(),
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      "yx"
    );
    const json1 = g1.toJSON();
    const json2 = _json;
    json2.uuid = json1.uuid;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const g1 = TubeGeometry.fromJSON(_json);
    const g2 = new TubeGeometry(
      constant0Curve3.clone(),
      smallCircleCurve2.clone(),
      1,
      3,
      2,
      2,
      2,
      1,
      1,
      1,
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant1Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      constant0Curve2.clone(),
      "yx"
    );
    g2.uuid = g1.uuid;
    expect(JSON.stringify(g1)).toBe(JSON.stringify(g2));
  });
});
