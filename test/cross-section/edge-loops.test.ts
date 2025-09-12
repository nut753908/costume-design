import { EdgeLoop } from "src/cross-section/edge-loop";
import { createEdgeLoopsMap } from "src/cross-section/edge-loops";
import { expect, test } from "vitest";

test.todo("createAllEdgeLoops()");

test("createEdgeLoopsMap()", () => {
  const els = [
    new EdgeLoop([0, 1, 2, 3], false),
    new EdgeLoop([10, 11, 12, 13], true),
    new EdgeLoop([0, 1, 22], false),
  ];
  const expected = {
    "0,1": [els[0], els[2]],
    "1,0": [els[0], els[2]],
    "1,2": [els[0]],
    "2,1": [els[0]],
    "2,3": [els[0]],
    "3,2": [els[0]],
    "10,11": [els[1]],
    "11,10": [els[1]],
    "11,12": [els[1]],
    "12,11": [els[1]],
    "12,13": [els[1]],
    "13,12": [els[1]],
    "13,10": [els[1]],
    "10,13": [els[1]],
    "1,22": [els[2]],
    "22,1": [els[2]],
  };
  expect(createEdgeLoopsMap(els)).toEqual(expected);
});
