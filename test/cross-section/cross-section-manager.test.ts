import {
  CrossSectionManager,
  type CrossSectionManagerJSON,
} from "src/cross-section/cross-section-manager";
import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { IntersectionLoopPicker } from "src/cross-section/intersection/intersection-loops";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("CrossSectionManager", () => {
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
    const ils = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoopPicker: ils },
    };
    const csm = new CrossSectionManager(crossSections);
    expect(csm.crossSections).toEqual(crossSections);
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
    const ils = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoopPicker: ils },
    };
    const csm1 = new CrossSectionManager(crossSections);
    const csm2 = csm1.clone();
    csm2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      csm1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    csm2.crossSections["[0] {FreePlane}"].intersectionLoopPicker._updateGroup =
      csm1.crossSections["[0] {FreePlane}"].intersectionLoopPicker._updateGroup;
    csm2._addGroup = csm1._addGroup;
    csm2._removeGroup = csm1._removeGroup;
    csm2._updateGroup = csm1._updateGroup;
    expect(csm1).toEqual(csm2);
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
    const ils = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoopPicker: ils },
    };
    const csm1 = new CrossSectionManager(crossSections);
    const csm2 = new CrossSectionManager().copy(csm1);
    csm2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      csm1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    csm2.crossSections["[0] {FreePlane}"].intersectionLoopPicker._updateGroup =
      csm1.crossSections["[0] {FreePlane}"].intersectionLoopPicker._updateGroup;
    csm2._addGroup = csm1._addGroup;
    csm2._removeGroup = csm1._removeGroup;
    csm2._updateGroup = csm1._updateGroup;
    expect(csm1).toEqual(csm2);
  });

  const _json: CrossSectionManagerJSON = {
    crossSections: {
      "[0] {FreePlane}": {
        plane: {
          type: "FreePlane",
          normal: [1, 0, 0],
          point: [2, 3, 4],
          inverted: false,
        },
        intersectionLoopPicker: {
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
    const ils = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoopPicker: ils },
    };
    const json1 = new CrossSectionManager(crossSections).toJSON();
    const json2: CrossSectionManagerJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const csm1 = new CrossSectionManager().fromJSON(_json);
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
    const ils = new IntersectionLoopPicker([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoopPicker: ils },
    };
    const csm2 = new CrossSectionManager(crossSections);
    csm2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      csm1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    csm2.crossSections["[0] {FreePlane}"].intersectionLoopPicker._updateGroup =
      csm1.crossSections["[0] {FreePlane}"].intersectionLoopPicker._updateGroup;
    csm2._addGroup = csm1._addGroup;
    csm2._removeGroup = csm1._removeGroup;
    csm2._updateGroup = csm1._updateGroup;
    expect(csm1).toEqual(csm2);
  });
});
