import { Area, type AreaJSON } from "src/cross-section/area";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { IntersectionLoopPicker } from "src/cross-section/intersection/intersection-loop-picker";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("Area", () => {
  test("constructor()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const planeToIlp = Area.createPlaneToIlp(positions, indices);
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = { "[0] {FreePlane}": { plane, ilp } };
    const area = new Area(planeToIlp, crossSections, 0.002);
    expect(area.planeToIlp).toEqual(planeToIlp);
    expect(area.crossSections).toEqual(crossSections);
    expect(area.thickness).toEqual(0.002);
  });

  test("clone()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const planeToIlp = Area.createPlaneToIlp(positions, indices);
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = { "[0] {FreePlane}": { plane, ilp } };
    const area1 = new Area(planeToIlp, crossSections, 0.002);
    const area2 = area1.clone();
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2.planeToIlp = area1.planeToIlp;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    expect(area1).toEqual(area2);
  });

  test("copy()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const planeToIlp = Area.createPlaneToIlp(positions, indices);
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = { "[0] {FreePlane}": { plane, ilp } };
    const area1 = new Area(planeToIlp, crossSections, 0.002);
    const area2 = new Area().copy(area1);
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2.planeToIlp = area1.planeToIlp;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    expect(area1).toEqual(area2);
  });

  const _json: AreaJSON = {
    crossSections: {
      "[0] {FreePlane}": {
        plane: {
          type: "FreePlane",
          normal: [1, 0, 0],
          point: [2, 3, 4],
          inverted: false,
        },
        ilp: {
          intersectionLoops: [
            {
              intersections: [
                {
                  type: "EdgeIntersection",
                  backV: 1,
                  frontV: 3,
                  u: 0.5,
                  checked: true,
                },
                {
                  type: "EdgeIntersection",
                  backV: 0,
                  frontV: 3,
                  u: 0.75,
                  checked: true,
                },
                {
                  type: "VertexIntersection",
                  v: 2,
                  checked: true,
                },
              ],
              closed: true,
            },
          ],
          option: "some",
          indices: [0],
        },
      },
    },
    thickness: 0.002,
  };

  test("toJSON()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const planeToIlp = Area.createPlaneToIlp(positions, indices);
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = { "[0] {FreePlane}": { plane, ilp } };
    const json1 = new Area(planeToIlp, crossSections, 0.002).toJSON();
    const json2: AreaJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const area1 = new Area().fromJSON(_json);
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const planeToIlp = Area.createPlaneToIlp(positions, indices);
    const plane = new FreePlane(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(2, 3, 4)
    );
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ilp = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = { "[0] {FreePlane}": { plane, ilp } };
    const area2 = new Area(planeToIlp, crossSections, 0.002);
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2.planeToIlp = area1.planeToIlp;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    expect(area1).toEqual(area2);
  });
});
