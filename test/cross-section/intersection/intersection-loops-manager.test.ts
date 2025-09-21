import { EdgeIntersection } from "src/cross-section/intersection/edge-intersection";
import { IntersectionLoop } from "src/cross-section/intersection/intersection-loop";
import { IntersectionLoops } from "src/cross-section/intersection/intersection-loops";
import {
  IntersectionLoopsManager,
  type IntersectionLoopsManagerJSON,
} from "src/cross-section/intersection/intersection-loops-manager";
import { VertexIntersection } from "src/cross-section/intersection/vertex-intersection";
import { describe, expect, test } from "vitest";

describe("IntersectionLoopsManager", () => {
  test("constructor()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils = new IntersectionLoops([il], "some", [0]);
    const ilsList = { a: ils };
    const ilsm = new IntersectionLoopsManager(ilsList);
    expect(ilsm.intersectionLoopsList).toEqual(ilsList);
  });

  test("clone()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils = new IntersectionLoops([il], "some", [0]);
    const ilsList = { a: ils };
    const ilsm1 = new IntersectionLoopsManager(ilsList);
    const ilsm2 = ilsm1.clone();
    ilsm2.intersectionLoopsList.a._updateGroup =
      ilsm1.intersectionLoopsList.a._updateGroup;
    expect(ilsm1).toEqual(ilsm2);
  });

  test("copy()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils = new IntersectionLoops([il], "some", [0]);
    const ilsList = { a: ils };
    const ilsm1 = new IntersectionLoopsManager(ilsList);
    const ilsm2 = new IntersectionLoopsManager().copy(ilsm1);
    ilsm2.intersectionLoopsList.a._updateGroup =
      ilsm1.intersectionLoopsList.a._updateGroup;
    expect(ilsm1).toEqual(ilsm2);
  });

  const _json: IntersectionLoopsManagerJSON = {
    intersectionLoopsList: {
      a: {
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
  };

  test("toJSON()", () => {
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils = new IntersectionLoops([il], "some", [0]);
    const ilsList = { a: ils };
    const json1 = new IntersectionLoopsManager(ilsList).toJSON();
    const json2: IntersectionLoopsManagerJSON = _json;
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const ilsm1 = new IntersectionLoopsManager().fromJSON(_json);
    const intersections = [
      new EdgeIntersection(1, 3, 0.5, true),
      new EdgeIntersection(0, 3, 0.75, true),
      new VertexIntersection(2, true),
    ];
    const il = new IntersectionLoop(intersections, true);
    const ils = new IntersectionLoops([il], "some", [0]);
    const ilsList = { a: ils };
    const ilsm2 = new IntersectionLoopsManager(ilsList);
    ilsm2.intersectionLoopsList.a._updateGroup =
      ilsm1.intersectionLoopsList.a._updateGroup;
    expect(ilsm1).toEqual(ilsm2);
  });
});
