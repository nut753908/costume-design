import { Area, type AreaJSON } from "src/cross-section/cross-section-manager";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { IntersectionLoopPicker } from "src/cross-section/intersection/intersection-loop-picker";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("Area", () => {
  test("constructor()", () => {
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
    const area = new Area(crossSections);
    expect(area.crossSections).toEqual(crossSections);
  });

  test("clone()", () => {
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
    const area1 = new Area(crossSections);
    const area2 = area1.clone();
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    expect(area1).toEqual(area2);
  });

  test("copy()", () => {
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
    const area1 = new Area(crossSections);
    const area2 = new Area().copy(area1);
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
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
          selection: "some",
          indices: [0],
        },
      },
    },
  };

  test("toJSON()", () => {
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
    const json1 = new Area(crossSections).toJSON();
    const json2: AreaJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const area1 = new Area().fromJSON(_json);
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
    const area2 = new Area(crossSections);
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    expect(area1).toEqual(area2);
  });
});
