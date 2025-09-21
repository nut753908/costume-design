import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { IntersectionLoops } from "src/cross-section/intersection/intersection-loops";
import {
  IntersectionLoopsManager,
  type IntersectionLoopsManagerJSON,
} from "src/cross-section/intersection/intersection-loops-manager";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { FreePlane } from "src/cross-section/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("IntersectionLoopsManager", () => {
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
    const ils = new IntersectionLoops([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoops: ils },
    };
    const ilsm = new IntersectionLoopsManager(crossSections);
    expect(ilsm.crossSections).toEqual(crossSections);
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
    const ils = new IntersectionLoops([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoops: ils },
    };
    const ilsm1 = new IntersectionLoopsManager(crossSections);
    const ilsm2 = ilsm1.clone();
    ilsm2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      ilsm1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    ilsm2.crossSections["[0] {FreePlane}"].intersectionLoops._updateGroup =
      ilsm1.crossSections["[0] {FreePlane}"].intersectionLoops._updateGroup;
    ilsm2._addGroup = ilsm1._addGroup;
    ilsm2._removeGroup = ilsm1._removeGroup;
    ilsm2._updateGroup = ilsm1._updateGroup;
    expect(ilsm1).toEqual(ilsm2);
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
    const ils = new IntersectionLoops([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoops: ils },
    };
    const ilsm1 = new IntersectionLoopsManager(crossSections);
    const ilsm2 = new IntersectionLoopsManager().copy(ilsm1);
    ilsm2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      ilsm1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    ilsm2.crossSections["[0] {FreePlane}"].intersectionLoops._updateGroup =
      ilsm1.crossSections["[0] {FreePlane}"].intersectionLoops._updateGroup;
    ilsm2._addGroup = ilsm1._addGroup;
    ilsm2._removeGroup = ilsm1._removeGroup;
    ilsm2._updateGroup = ilsm1._updateGroup;
    expect(ilsm1).toEqual(ilsm2);
  });

  const _json: IntersectionLoopsManagerJSON = {
    crossSections: {
      "[0] {FreePlane}": {
        plane: {
          type: "FreePlane",
          normal: [1, 0, 0],
          point: [2, 3, 4],
          inverted: false,
        },
        intersectionLoops: {
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
    const ils = new IntersectionLoops([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoops: ils },
    };
    const json1 = new IntersectionLoopsManager(crossSections).toJSON();
    const json2: IntersectionLoopsManagerJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const ilsm1 = new IntersectionLoopsManager().fromJSON(_json);
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
    const ils = new IntersectionLoops([il], "some", [0]);
    const crossSections = {
      "[0] {FreePlane}": { plane, intersectionLoops: ils },
    };
    const ilsm2 = new IntersectionLoopsManager(crossSections);
    ilsm2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      ilsm1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    ilsm2.crossSections["[0] {FreePlane}"].intersectionLoops._updateGroup =
      ilsm1.crossSections["[0] {FreePlane}"].intersectionLoops._updateGroup;
    ilsm2._addGroup = ilsm1._addGroup;
    ilsm2._removeGroup = ilsm1._removeGroup;
    ilsm2._updateGroup = ilsm1._updateGroup;
    expect(ilsm1).toEqual(ilsm2);
  });
});
