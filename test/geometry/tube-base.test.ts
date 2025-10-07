import {
  computeFrenetFrames,
  TubeBaseGeometry,
  type TubeBaseGeometryJSON,
} from "src/geometry/tube-base";
import { ControlPoint3 } from "src/hair-bundle/curve/control-point-3";
import { Curve3 } from "src/hair-bundle/curve/curve-3";
import {
  circleCurve2,
  constant0Curve2,
  constant1Curve2,
  smallCircleCurve2,
} from "src/hair-bundle/curve/samples/curve-2";
import { constant0Curve3 } from "src/hair-bundle/curve/samples/curve-3";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("TubeBaseGeometry", () => {
  describe("constructor()", () => {
    test("check parameters", () => {
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

    describe("check indices, positions, normals, uvs", () => {
      test("default", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          4,
          8,
          1,
          1,
          1,
          0,
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const indices = g.getIndex();
        // 192 = 4(axisSegments) * 8(crossSegments) * 2(triangles) * 3(x,y,z)
        expect(indices?.count).toBe(192);
        expect(indices?.array).toEqual(
          new Uint16Array(
            [
              [0, 9, 1],
              [9, 10, 1],
              [1, 10, 2],
              [10, 11, 2],
              [2, 11, 3],
              [11, 12, 3],
              [3, 12, 4],
              [12, 13, 4],
              [4, 13, 5],
              [13, 14, 5],
              [5, 14, 6],
              [14, 15, 6],
              [6, 15, 7],
              [15, 16, 7],
              [7, 16, 8],
              [16, 17, 8],
              //
              [9, 18, 10],
              [18, 19, 10],
              [10, 19, 11],
              [19, 20, 11],
              [11, 20, 12],
              [20, 21, 12],
              [12, 21, 13],
              [21, 22, 13],
              [13, 22, 14],
              [22, 23, 14],
              [14, 23, 15],
              [23, 24, 15],
              [15, 24, 16],
              [24, 25, 16],
              [16, 25, 17],
              [25, 26, 17],
              //
              [18, 27, 19],
              [27, 28, 19],
              [19, 28, 20],
              [28, 29, 20],
              [20, 29, 21],
              [29, 30, 21],
              [21, 30, 22],
              [30, 31, 22],
              [22, 31, 23],
              [31, 32, 23],
              [23, 32, 24],
              [32, 33, 24],
              [24, 33, 25],
              [33, 34, 25],
              [25, 34, 26],
              [34, 35, 26],
              //
              [27, 36, 28],
              [36, 37, 28],
              [28, 37, 29],
              [37, 38, 29],
              [29, 38, 30],
              [38, 39, 30],
              [30, 39, 31],
              [39, 40, 31],
              [31, 40, 32],
              [40, 41, 32],
              [32, 41, 33],
              [41, 42, 33],
              [33, 42, 34],
              [42, 43, 34],
              [34, 43, 35],
              [43, 44, 35],
            ].flat()
          )
        );

        const positions = g.getAttribute("position");
        // 45 = (4(axisSegments) + 1) * (8(crossSegments) + 1)
        expect(positions.count).toBe(45);
        const expectedPositions = [
          [-0.5, 0.5, 0],
          [-0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0, 0.5, 0.5],
          [0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0.5, 0.5, 0],
          [0.5 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [0, 0.5, -0.5],
          [-0.5 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [-0.5, 0.5, 0],
          //
          [-0.5, 0.25, 0],
          [-0.5 * Math.SQRT1_2, 0.25, 0.5 * Math.SQRT1_2],
          [0, 0.25, 0.5],
          [0.5 * Math.SQRT1_2, 0.25, 0.5 * Math.SQRT1_2],
          [0.5, 0.25, 0],
          [0.5 * Math.SQRT1_2, 0.25, -0.5 * Math.SQRT1_2],
          [0, 0.25, -0.5],
          [-0.5 * Math.SQRT1_2, 0.25, -0.5 * Math.SQRT1_2],
          [-0.5, 0.25, 0],
          //
          [-0.5, 0, 0],
          [-0.5 * Math.SQRT1_2, 0, 0.5 * Math.SQRT1_2],
          [0, 0, 0.5],
          [0.5 * Math.SQRT1_2, 0, 0.5 * Math.SQRT1_2],
          [0.5, 0, 0],
          [0.5 * Math.SQRT1_2, 0, -0.5 * Math.SQRT1_2],
          [0, 0, -0.5],
          [-0.5 * Math.SQRT1_2, 0, -0.5 * Math.SQRT1_2],
          [-0.5, 0, 0],
          //
          [-0.5, -0.25, 0],
          [-0.5 * Math.SQRT1_2, -0.25, 0.5 * Math.SQRT1_2],
          [0, -0.25, 0.5],
          [0.5 * Math.SQRT1_2, -0.25, 0.5 * Math.SQRT1_2],
          [0.5, -0.25, 0],
          [0.5 * Math.SQRT1_2, -0.25, -0.5 * Math.SQRT1_2],
          [0, -0.25, -0.5],
          [-0.5 * Math.SQRT1_2, -0.25, -0.5 * Math.SQRT1_2],
          [-0.5, -0.25, 0],
          //
          [-0.5, -0.5, 0],
          [-0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0, -0.5, 0.5],
          [0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0.5, -0.5, 0],
          [0.5 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [0, -0.5, -0.5],
          [-0.5 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [-0.5, -0.5, 0],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        // 45 = (4(axisSegments) + 1) * (8(crossSegments) + 1)
        expect(normals.count).toBe(45);
        const expectedNormals = [
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });

        const uvs = g.getAttribute("uv");
        // 45 = (4(axisSegments) + 1) * (8(crossSegments) + 1)
        expect(uvs.count).toBe(45);
        expect(uvs.array).toEqual(
          new Float32Array(
            [
              [0, 0],
              [0, 0.125],
              [0, 0.25],
              [0, 0.375],
              [0, 0.5],
              [0, 0.625],
              [0, 0.75],
              [0, 0.875],
              [0, 1],
              //
              [0.25, 0],
              [0.25, 0.125],
              [0.25, 0.25],
              [0.25, 0.375],
              [0.25, 0.5],
              [0.25, 0.625],
              [0.25, 0.75],
              [0.25, 0.875],
              [0.25, 1],
              //
              [0.5, 0],
              [0.5, 0.125],
              [0.5, 0.25],
              [0.5, 0.375],
              [0.5, 0.5],
              [0.5, 0.625],
              [0.5, 0.75],
              [0.5, 0.875],
              [0.5, 1],
              //
              [0.75, 0],
              [0.75, 0.125],
              [0.75, 0.25],
              [0.75, 0.375],
              [0.75, 0.5],
              [0.75, 0.625],
              [0.75, 0.75],
              [0.75, 0.875],
              [0.75, 1],
              //
              [1, 0],
              [1, 0.125],
              [1, 0.25],
              [1, 0.375],
              [1, 0.5],
              [1, 0.625],
              [1, 0.75],
              [1, 0.875],
              [1, 1],
            ].flat()
          )
        );
      });

      test("if axisSegments is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1
          8,
          1,
          1,
          1,
          0,
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const indices = g.getIndex();
        // 48 = 1(axisSegments) * 8(crossSegments) * 2(triangles) * 3(x,y,z)
        expect(indices?.count).toBe(48);
        expect(indices?.array).toEqual(
          new Uint16Array(
            [
              [0, 9, 1],
              [9, 10, 1],
              [1, 10, 2],
              [10, 11, 2],
              [2, 11, 3],
              [11, 12, 3],
              [3, 12, 4],
              [12, 13, 4],
              [4, 13, 5],
              [13, 14, 5],
              [5, 14, 6],
              [14, 15, 6],
              [6, 15, 7],
              [15, 16, 7],
              [7, 16, 8],
              [16, 17, 8],
            ].flat()
          )
        );

        const positions = g.getAttribute("position");
        // 18 = (1(axisSegments) + 1) * (8(crossSegments) + 1)
        expect(positions.count).toBe(18);
        const expectedPositions = [
          [-0.5, 0.5, 0],
          [-0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0, 0.5, 0.5],
          [0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0.5, 0.5, 0],
          [0.5 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [0, 0.5, -0.5],
          [-0.5 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [-0.5, 0.5, 0],
          //
          [-0.5, -0.5, 0],
          [-0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0, -0.5, 0.5],
          [0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0.5, -0.5, 0],
          [0.5 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [0, -0.5, -0.5],
          [-0.5 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [-0.5, -0.5, 0],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        // 18 = (1(axisSegments) + 1) * (8(crossSegments) + 1)
        expect(normals.count).toBe(18);
        const expectedNormals = [
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });

        const uvs = g.getAttribute("uv");
        // 18 = (1(axisSegments) + 1) * (8(crossSegments) + 1)
        expect(uvs.count).toBe(18);
        expect(uvs.array).toEqual(
          new Float32Array(
            [
              [0, 0],
              [0, 0.125],
              [0, 0.25],
              [0, 0.375],
              [0, 0.5],
              [0, 0.625],
              [0, 0.75],
              [0, 0.875],
              [0, 1],
              //
              [1, 0],
              [1, 0.125],
              [1, 0.25],
              [1, 0.375],
              [1, 0.5],
              [1, 0.625],
              [1, 0.75],
              [1, 0.875],
              [1, 1],
            ].flat()
          )
        );
      });

      test("if crossSegments is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          4, // 8 -> 4
          1,
          1,
          1,
          0,
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const indices = g.getIndex();
        // 24 = 1(axisSegments) * 4(crossSegments) * 2(triangles) * 3(x,y,z)
        expect(indices?.count).toBe(24);
        expect(indices?.array).toEqual(
          new Uint16Array(
            [
              [0, 5, 1],
              [5, 6, 1],
              [1, 6, 2],
              [6, 7, 2],
              [2, 7, 3],
              [7, 8, 3],
              [3, 8, 4],
              [8, 9, 4],
            ].flat()
          )
        );

        const positions = g.getAttribute("position");
        // 10 = (1(axisSegments) + 1) * (4(crossSegments) + 1)
        expect(positions.count).toBe(10);
        const expectedPositions = [
          [-0.5, 0.5, 0],
          [0, 0.5, 0.5],
          [0.5, 0.5, 0],
          [0, 0.5, -0.5],
          [-0.5, 0.5, 0],
          //
          [-0.5, -0.5, 0],
          [0, -0.5, 0.5],
          [0.5, -0.5, 0],
          [0, -0.5, -0.5],
          [-0.5, -0.5, 0],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        // 10 = (1(axisSegments) + 1) * (4(crossSegments) + 1)
        expect(normals.count).toBe(10);
        const expectedNormals = [
          [-1, 0, 0],
          [0, 0, 1],
          [1, 0, 0],
          [0, 0, -1],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [0, 0, 1],
          [1, 0, 0],
          [0, 0, -1],
          [-1, 0, 0],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });

        const uvs = g.getAttribute("uv");
        // 10 = (1(axisSegments) + 1) * (4(crossSegments) + 1)
        expect(uvs.count).toBe(10);
        expect(uvs.array).toEqual(
          new Float32Array(
            [
              [0, 0],
              [0, 0.25],
              [0, 0.5],
              [0, 0.75],
              [0, 1],
              //
              [1, 0],
              [1, 0.25],
              [1, 0.5],
              [1, 0.75],
              [1, 1],
            ].flat()
          )
        );
      });

      test("if scaleN is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          8,
          0.1, // 1 -> 0.1
          1,
          1,
          0,
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const positions = g.getAttribute("position");
        const expectedPositions = [
          [-0.05, 0.5, 0],
          [-0.05 * Math.SQRT1_2, 0.5, 0.05 * Math.SQRT1_2],
          [0, 0.5, 0.05],
          [0.05 * Math.SQRT1_2, 0.5, 0.05 * Math.SQRT1_2],
          [0.05, 0.5, 0],
          [0.05 * Math.SQRT1_2, 0.5, -0.05 * Math.SQRT1_2],
          [0, 0.5, -0.05],
          [-0.05 * Math.SQRT1_2, 0.5, -0.05 * Math.SQRT1_2],
          [-0.05, 0.5, 0],
          //
          [-0.05, -0.5, 0],
          [-0.05 * Math.SQRT1_2, -0.5, 0.05 * Math.SQRT1_2],
          [0, -0.5, 0.05],
          [0.05 * Math.SQRT1_2, -0.5, 0.05 * Math.SQRT1_2],
          [0.05, -0.5, 0],
          [0.05 * Math.SQRT1_2, -0.5, -0.05 * Math.SQRT1_2],
          [0, -0.5, -0.05],
          [-0.05 * Math.SQRT1_2, -0.5, -0.05 * Math.SQRT1_2],
          [-0.05, -0.5, 0],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        const expectedNormals = [
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });
      });

      test("if xScaleN is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          8,
          1,
          0.1, // 1 -> 0.1
          1,
          0,
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const positions = g.getAttribute("position");
        const expectedPositions = [
          [-0.5, 0.5, 0],
          [-0.5 * Math.SQRT1_2, 0.5, 0.05 * Math.SQRT1_2],
          [0, 0.5, 0.05],
          [0.5 * Math.SQRT1_2, 0.5, 0.05 * Math.SQRT1_2],
          [0.5, 0.5, 0],
          [0.5 * Math.SQRT1_2, 0.5, -0.05 * Math.SQRT1_2],
          [0, 0.5, -0.05],
          [-0.5 * Math.SQRT1_2, 0.5, -0.05 * Math.SQRT1_2],
          [-0.5, 0.5, 0],
          //
          [-0.5, -0.5, 0],
          [-0.5 * Math.SQRT1_2, -0.5, 0.05 * Math.SQRT1_2],
          [0, -0.5, 0.05],
          [0.5 * Math.SQRT1_2, -0.5, 0.05 * Math.SQRT1_2],
          [0.5, -0.5, 0],
          [0.5 * Math.SQRT1_2, -0.5, -0.05 * Math.SQRT1_2],
          [0, -0.5, -0.05],
          [-0.5 * Math.SQRT1_2, -0.5, -0.05 * Math.SQRT1_2],
          [-0.5, -0.5, 0],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        const expectedNormals = [
          [-1, 0, 0],
          [-1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)], // 101 = 1^2+10^2
          [0, 0, 1],
          [1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)],
          [1, 0, 0],
          [1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [0, 0, -1],
          [-1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)],
          [0, 0, 1],
          [1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)],
          [1, 0, 0],
          [1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [0, 0, -1],
          [-1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [-1, 0, 0],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });
      });

      test("if yScaleN is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          8,
          1,
          1,
          0.1, // 1 -> 0.1
          0,
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const positions = g.getAttribute("position");
        const expectedPositions = [
          [-0.05, 0.5, 0],
          [-0.05 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0, 0.5, 0.5],
          [0.05 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0.05, 0.5, 0],
          [0.05 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [0, 0.5, -0.5],
          [-0.05 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [-0.05, 0.5, 0],
          //
          [-0.05, -0.5, 0],
          [-0.05 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0, -0.5, 0.5],
          [0.05 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0.05, -0.5, 0],
          [0.05 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [0, -0.5, -0.5],
          [-0.05 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [-0.05, -0.5, 0],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        const expectedNormals = [
          [-1, 0, 0],
          [-10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)], // 101 = 1^2+10^2
          [0, 0, 1],
          [10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)],
          [1, 0, 0],
          [10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [0, 0, -1],
          [-10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)],
          [0, 0, 1],
          [10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)],
          [1, 0, 0],
          [10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [0, 0, -1],
          [-10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [-1, 0, 0],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });
      });

      test("if xCurvatureN is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          8,
          1,
          0.1, // 1 -> 0.1 (keep it for this test)
          1,
          1, // 0 -> 1
          0,
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const positions = g.getAttribute("position");
        const _expectedPositionForScalingOnly = [
          [-0.5, 0.5, 0],
          [-0.5 * Math.SQRT1_2, 0.5, 0.05 * Math.SQRT1_2],
          [0, 0.5, 0.05],
          [0.5 * Math.SQRT1_2, 0.5, 0.05 * Math.SQRT1_2],
          [0.5, 0.5, 0],
          [0.5 * Math.SQRT1_2, 0.5, -0.05 * Math.SQRT1_2],
          [0, 0.5, -0.05],
          [-0.5 * Math.SQRT1_2, 0.5, -0.05 * Math.SQRT1_2],
          [-0.5, 0.5, 0],
          //
          [-0.5, -0.5, 0],
          [-0.5 * Math.SQRT1_2, -0.5, 0.05 * Math.SQRT1_2],
          [0, -0.5, 0.05],
          [0.5 * Math.SQRT1_2, -0.5, 0.05 * Math.SQRT1_2],
          [0.5, -0.5, 0],
          [0.5 * Math.SQRT1_2, -0.5, -0.05 * Math.SQRT1_2],
          [0, -0.5, -0.05],
          [-0.5 * Math.SQRT1_2, -0.5, -0.05 * Math.SQRT1_2],
          [-0.5, -0.5, 0],
        ];
        const expectedPositions = _expectedPositionForScalingOnly.flatMap(
          (list) => [
            (1 - list[2]) * Math.sin(list[0]),
            list[1],
            1 - (1 - list[2]) * Math.cos(list[0]),
          ]
        );
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        const expectedNormals = [
          [-1, 0, 0],
          [-1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)], // 101 = 1^2+10^2
          [0, 0, 1],
          [1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)],
          [1, 0, 0],
          [1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [0, 0, -1],
          [-1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)],
          [0, 0, 1],
          [1 / Math.sqrt(101), 0, 10 / Math.sqrt(101)],
          [1, 0, 0],
          [1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [0, 0, -1],
          [-1 / Math.sqrt(101), 0, -10 / Math.sqrt(101)],
          [-1, 0, 0],
        ].flatMap((list, i) => {
          const angle = -_expectedPositionForScalingOnly[i][0];
          const c = Math.cos(angle);
          const s = Math.sin(angle);
          return [
            list[2] * s + list[0] * c,
            list[1],
            list[2] * c - list[0] * s,
          ];
        });
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });
      });

      test("if yCurvatureN is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          8,
          1,
          1,
          0.1, // 1 -> 0.1 (keep it for this test)
          0,
          1, // 0 -> 1
          0,
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const positions = g.getAttribute("position");
        const _expectedPositionForScalingOnly = [
          [-0.05, 0.5, 0],
          [-0.05 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0, 0.5, 0.5],
          [0.05 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0.05, 0.5, 0],
          [0.05 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [0, 0.5, -0.5],
          [-0.05 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [-0.05, 0.5, 0],
          //
          [-0.05, -0.5, 0],
          [-0.05 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0, -0.5, 0.5],
          [0.05 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0.05, -0.5, 0],
          [0.05 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [0, -0.5, -0.5],
          [-0.05 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [-0.05, -0.5, 0],
        ];
        const expectedPositions = _expectedPositionForScalingOnly.flatMap(
          (list) => [
            1 - (1 - list[0]) * Math.cos(list[2]),
            list[1],
            (1 - list[0]) * Math.sin(list[2]),
          ]
        );
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        const expectedNormals = [
          [-1, 0, 0],
          [-10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)], // 101 = 1^2+10^2
          [0, 0, 1],
          [10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)],
          [1, 0, 0],
          [10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [0, 0, -1],
          [-10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [-1, 0, 0],
          //
          [-1, 0, 0],
          [-10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)],
          [0, 0, 1],
          [10 / Math.sqrt(101), 0, 1 / Math.sqrt(101)],
          [1, 0, 0],
          [10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [0, 0, -1],
          [-10 / Math.sqrt(101), 0, -1 / Math.sqrt(101)],
          [-1, 0, 0],
        ].flatMap((list, i) => {
          const angle = _expectedPositionForScalingOnly[i][2];
          const c = Math.cos(angle);
          const s = Math.sin(angle);
          return [
            list[2] * s + list[0] * c,
            list[1],
            list[2] * c - list[0] * s,
          ];
        });
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });
      });

      test("if tiltN is changed", () => {
        const g = new TubeBaseGeometry(
          constant0Curve3.clone(),
          smallCircleCurve2.clone(),
          1, // 4 -> 1 (keep it for readability)
          8,
          1,
          1,
          1,
          0,
          0,
          45, // 0 -> 45
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant1Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          constant0Curve2.clone(),
          "xy"
        );

        const positions = g.getAttribute("position");
        const expectedPositions = [
          [-0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0, 0.5, 0.5],
          [0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          [0.5, 0.5, 0],
          [0.5 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [0, 0.5, -0.5],
          [-0.5 * Math.SQRT1_2, 0.5, -0.5 * Math.SQRT1_2],
          [-0.5, 0.5, 0],
          [-0.5 * Math.SQRT1_2, 0.5, 0.5 * Math.SQRT1_2],
          //
          [-0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0, -0.5, 0.5],
          [0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
          [0.5, -0.5, 0],
          [0.5 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [0, -0.5, -0.5],
          [-0.5 * Math.SQRT1_2, -0.5, -0.5 * Math.SQRT1_2],
          [-0.5, -0.5, 0],
          [-0.5 * Math.SQRT1_2, -0.5, 0.5 * Math.SQRT1_2],
        ].flat();
        positions.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedPositions[i]);
        });

        const normals = g.getAttribute("normal");
        const expectedNormals = [
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          //
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
          [0, 0, 1],
          [Math.SQRT1_2, 0, Math.SQRT1_2],
          [1, 0, 0],
          [Math.SQRT1_2, 0, -Math.SQRT1_2],
          [0, 0, -1],
          [-Math.SQRT1_2, 0, -Math.SQRT1_2],
          [-1, 0, 0],
          [-Math.SQRT1_2, 0, Math.SQRT1_2],
        ].flat();
        normals.array.forEach((v, i) => {
          expect(v).toBeCloseTo(expectedNormals[i]);
        });
      });
    });
  });

  test("clone()", () => {
    const g1 = new TubeBaseGeometry(
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
    const g1 = new TubeBaseGeometry(
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
    const g1 = new TubeBaseGeometry(
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
