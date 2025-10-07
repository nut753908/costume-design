import { Area, type AreaJSON } from "src/tight-clothing/area/area";
import { EdgeIntersection } from "src/tight-clothing/intersection/edge-intersection";
import { IntersectionLoop } from "src/tight-clothing/intersection/intersection-loop";
import { IntersectionLoopPicker } from "src/tight-clothing/intersection/intersection-loop-picker";
import { VertexIntersection } from "src/tight-clothing/intersection/vertex-intersection";
import { FreePlane } from "src/tight-clothing/plane/free-plane";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("Area", () => {
  test("constructor()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const indicesObj = Area.createIndicesObj(positions, indices);
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
    const area = new Area(indicesObj, crossSections, 0.002);
    expect(area.indicesObj).toEqual(indicesObj);
    expect(area.crossSections).toEqual(crossSections);
    expect(area.thickness).toEqual(0.002);
  });

  describe("createPlaneToIlp()", () => {
    describe("three triangular pyramids example", () => {
      // (Switch between index:0-3 and index:4-7 to see the sorting)
      const positionsArray = [
        [2, 0.5, 0.5],
        [3, 0, 0],
        [3, 0, 1],
        [3, 1, 0.5],
        //
        [0, 0, 0],
        [1, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        //
        [4, 0.5, 0],
        [5, 0, 0.5],
        [4, 0.5, 1],
        [5, 1, 0.5],
      ].flat();
      const positions = new THREE.Float32BufferAttribute(positionsArray, 3);
      const indicesArray = [
        [0, 1, 2],
        [0, 3, 1],
        [1, 3, 2],
        [2, 3, 0],
        //
        [4, 5, 6],
        [4, 7, 5],
        [5, 7, 6],
        [6, 7, 4],
        //
        [8, 9, 10],
        [8, 11, 9],
        [9, 11, 10],
        [10, 11, 8],
      ].flat();
      const indices = new THREE.Uint16BufferAttribute(indicesArray, 1);

      test("check algorithm", () => {
        const plane = new FreePlane(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0.5, 0)
        );
        expect(
          Area.createIndicesObj(positions, indices).planeToAllIls(plane)
        ).toEqual([
          new IntersectionLoop(
            [
              new EdgeIntersection(4, 7, 0.5, true),
              new EdgeIntersection(5, 7, 0.5, true),
              new EdgeIntersection(6, 7, 0.5, true),
            ],
            true
          ),
          new IntersectionLoop(
            [
              new EdgeIntersection(1, 3, 0.5, true),
              new EdgeIntersection(2, 3, 0.5, true),
              new VertexIntersection(0, true),
            ],
            true
          ),
          new IntersectionLoop(
            [
              new EdgeIntersection(9, 11, 0.5, true),
              new VertexIntersection(8, true),
              new VertexIntersection(10, true),
            ],
            true
          ),
        ]);
      });
    });
  });

  describe("addCrossSection()", () => {
    test("check keys and planes for cross section", () => {
      const area = new Area();
      expect(Object.keys(area.crossSections)).toEqual([]);

      const plane1 = new FreePlane(new THREE.Vector3(1, 0, 0));
      area.addCrossSection("a", plane1);
      expect(Object.keys(area.crossSections)).toEqual(["a"]);
      expect(area.crossSections.a.plane).toEqual(plane1);

      const plane2 = new FreePlane(new THREE.Vector3(0, 1, 0));
      area.addCrossSection("b", plane2);
      expect(Object.keys(area.crossSections)).toEqual(["a", "b"]);
      expect(area.crossSections.a.plane).toEqual(plane1);
      expect(area.crossSections.b.plane).toEqual(plane2);
    });
  });

  describe("removeCrossSection()", () => {
    test("check keys and planes for cross section", () => {
      const area = new Area();
      const plane1 = new FreePlane(new THREE.Vector3(1, 0, 0));
      const plane2 = new FreePlane(new THREE.Vector3(0, 1, 0));
      area.addCrossSection("a", plane1);
      area.addCrossSection("b", plane2);
      expect(Object.keys(area.crossSections)).toEqual(["a", "b"]);
      expect(area.crossSections.a.plane).toEqual(plane1);
      expect(area.crossSections.b.plane).toEqual(plane2);

      area.removeCrossSection("a");
      expect(Object.keys(area.crossSections)).toEqual(["b"]);
      expect(area.crossSections.b.plane).toEqual(plane2);

      area.removeCrossSection("b");
      expect(Object.keys(area.crossSections)).toEqual([]);
    });
  });

  describe("updateCrossSection()", () => {
    test("check keys and planes for cross section", () => {
      const area = new Area();
      const plane1 = new FreePlane(new THREE.Vector3(1, 0, 0));
      const plane2 = new FreePlane(new THREE.Vector3(0, 1, 0));
      area.addCrossSection("a", plane1);
      area.addCrossSection("b", plane2);
      expect(Object.keys(area.crossSections)).toEqual(["a", "b"]);
      expect(area.crossSections.a.plane).toEqual(plane1);
      expect(area.crossSections.b.plane).toEqual(plane2);

      const plane3 = new FreePlane(new THREE.Vector3(0, 0, 1));
      area.updateCrossSection("a", plane3);
      expect(Object.keys(area.crossSections)).toEqual(["a", "b"]);
      expect(area.crossSections.a.plane).toEqual(plane3);
      expect(area.crossSections.b.plane).toEqual(plane2);

      const plane4 = new FreePlane(new THREE.Vector3(-1, 0, 0));
      area.updateCrossSection("b", plane4);
      expect(Object.keys(area.crossSections)).toEqual(["a", "b"]);
      expect(area.crossSections.a.plane).toEqual(plane3);
      expect(area.crossSections.b.plane).toEqual(plane4);
    });
  });

  test("clone()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const indicesObj = Area.createIndicesObj(positions, indices);
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
    const area1 = new Area(indicesObj, crossSections, 0.002);
    const area2 = area1.clone();
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2.indicesObj = area1.indicesObj;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    area2._updateAreaGroup = area1._updateAreaGroup;
    area2._updateGUI = area1._updateGUI;
    expect(area1).toEqual(area2);
  });

  test("copy()", () => {
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const indicesObj = Area.createIndicesObj(positions, indices);
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
    const area1 = new Area(indicesObj, crossSections, 0.002);
    const area2 = new Area().copy(area1);
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2.indicesObj = area1.indicesObj;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    area2._updateAreaGroup = area1._updateAreaGroup;
    area2._updateGUI = area1._updateGUI;
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
    const indicesObj = Area.createIndicesObj(positions, indices);
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
    const json1 = new Area(indicesObj, crossSections, 0.002).toJSON();
    const json2: AreaJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const area1 = new Area().fromJSON(_json);
    const positions = new THREE.Float32BufferAttribute([], 3);
    const indices = new THREE.Uint16BufferAttribute([], 1);
    const indicesObj = Area.createIndicesObj(positions, indices);
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
    const area2 = new Area(indicesObj, crossSections, 0.002);
    area2.crossSections["[0] {FreePlane}"].plane._updateGroup =
      area1.crossSections["[0] {FreePlane}"].plane._updateGroup;
    area2.crossSections["[0] {FreePlane}"].ilp._updateGroup =
      area1.crossSections["[0] {FreePlane}"].ilp._updateGroup;
    area2.indicesObj = area1.indicesObj;
    area2._addIlpGroup = area1._addIlpGroup;
    area2._removeIlpGroup = area1._removeIlpGroup;
    area2._updateIlpGroup = area1._updateIlpGroup;
    area2._updateAreaGroup = area1._updateAreaGroup;
    area2._updateGUI = area1._updateGUI;
    expect(area1).toEqual(area2);
  });
});
