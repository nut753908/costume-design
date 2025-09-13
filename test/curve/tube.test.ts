import { smallCircleCurve2 } from "src/curve/samples/curve-2";
import { constant0Curve3 } from "src/curve/samples/curve-3";
import { Tube } from "src/curve/tube";
import type {
  TubeGeometryParameters,
  TubeGeometryParametersJSON,
} from "src/geometry/tube";
import { describe, expect, test } from "vitest";

describe("Tube", () => {
  describe("constructor()", () => {
    test("set params", () => {
      const parameters: TubeGeometryParameters = {
        axis: constant0Curve3.clone(),
        cross: smallCircleCurve2.clone(),
        axisSegments: 1,
        crossSegments: 3,
        scaleN: 2,
        xScaleN: 2,
        yScaleN: 2,
        xCurvatureN: 1,
        yCurvatureN: 1,
        tiltN: 1,
        scaleC: smallCircleCurve2.clone(),
        xScaleC: smallCircleCurve2.clone(),
        yScaleC: smallCircleCurve2.clone(),
        xCurvatureC: smallCircleCurve2.clone(),
        yCurvatureC: smallCircleCurve2.clone(),
        tiltC: smallCircleCurve2.clone(),
        curvatureOrder: "yx",
      };
      const t = new Tube(parameters);
      expect(t.parameters).toEqual(parameters);
    });
  });

  test("clone()", () => {
    const parameters: TubeGeometryParameters = {
      axis: constant0Curve3.clone(),
      cross: smallCircleCurve2.clone(),
      axisSegments: 1,
      crossSegments: 3,
      scaleN: 2,
      xScaleN: 2,
      yScaleN: 2,
      xCurvatureN: 1,
      yCurvatureN: 1,
      tiltN: 1,
      scaleC: smallCircleCurve2.clone(),
      xScaleC: smallCircleCurve2.clone(),
      yScaleC: smallCircleCurve2.clone(),
      xCurvatureC: smallCircleCurve2.clone(),
      yCurvatureC: smallCircleCurve2.clone(),
      tiltC: smallCircleCurve2.clone(),
      curvatureOrder: "yx",
    };
    const t1 = new Tube(parameters);
    const t2 = t1.clone();
    expect(JSON.stringify(t1)).toEqual(JSON.stringify(t2));
  });

  test("copy()", () => {
    const parameters: TubeGeometryParameters = {
      axis: constant0Curve3.clone(),
      cross: smallCircleCurve2.clone(),
      axisSegments: 1,
      crossSegments: 3,
      scaleN: 2,
      xScaleN: 2,
      yScaleN: 2,
      xCurvatureN: 1,
      yCurvatureN: 1,
      tiltN: 1,
      scaleC: smallCircleCurve2.clone(),
      xScaleC: smallCircleCurve2.clone(),
      yScaleC: smallCircleCurve2.clone(),
      xCurvatureC: smallCircleCurve2.clone(),
      yCurvatureC: smallCircleCurve2.clone(),
      tiltC: smallCircleCurve2.clone(),
      curvatureOrder: "yx",
    };
    const t1 = new Tube(parameters);
    const t2 = new Tube().copy(t1);
    expect(JSON.stringify(t1)).toEqual(JSON.stringify(t2));
  });

  const _json: TubeGeometryParametersJSON = {
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
    scaleC: smallCircleCurve2.toJSON(),
    xScaleC: smallCircleCurve2.toJSON(),
    yScaleC: smallCircleCurve2.toJSON(),
    xCurvatureC: smallCircleCurve2.toJSON(),
    yCurvatureC: smallCircleCurve2.toJSON(),
    tiltC: smallCircleCurve2.toJSON(),
    curvatureOrder: "yx",
  };

  test("toJSON()", () => {
    const parameters: TubeGeometryParameters = {
      axis: constant0Curve3.clone(),
      cross: smallCircleCurve2.clone(),
      axisSegments: 1,
      crossSegments: 3,
      scaleN: 2,
      xScaleN: 2,
      yScaleN: 2,
      xCurvatureN: 1,
      yCurvatureN: 1,
      tiltN: 1,
      scaleC: smallCircleCurve2.clone(),
      xScaleC: smallCircleCurve2.clone(),
      yScaleC: smallCircleCurve2.clone(),
      xCurvatureC: smallCircleCurve2.clone(),
      yCurvatureC: smallCircleCurve2.clone(),
      tiltC: smallCircleCurve2.clone(),
      curvatureOrder: "yx",
    };
    const t1 = new Tube(parameters);
    const json1 = t1.toJSON();
    const json2 = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const t1 = new Tube().fromJSON(_json);
    const parameters: TubeGeometryParameters = {
      axis: constant0Curve3.clone(),
      cross: smallCircleCurve2.clone(),
      axisSegments: 1,
      crossSegments: 3,
      scaleN: 2,
      xScaleN: 2,
      yScaleN: 2,
      xCurvatureN: 1,
      yCurvatureN: 1,
      tiltN: 1,
      scaleC: smallCircleCurve2.clone(),
      xScaleC: smallCircleCurve2.clone(),
      yScaleC: smallCircleCurve2.clone(),
      xCurvatureC: smallCircleCurve2.clone(),
      yCurvatureC: smallCircleCurve2.clone(),
      tiltC: smallCircleCurve2.clone(),
      curvatureOrder: "yx",
    };
    const t2 = new Tube(parameters);
    expect(JSON.stringify(t1)).toBe(JSON.stringify(t2));
  });
});
