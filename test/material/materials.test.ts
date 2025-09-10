import GUI from "lil-gui";
import { createMaterials } from "src/material/materials";
import {
  afterEach,
  beforeEach,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

let spy: MockInstance;

beforeEach(() => {
  spy = vi
    .spyOn(document, "getElementById")
    .mockImplementationOnce((v) => {
      expect(v).toBe("toonVertex");
      return document.createElement("script");
    })
    .mockImplementationOnce((v) => {
      expect(v).toBe("toonFragment");
      return document.createElement("script");
    })
    .mockImplementationOnce((v) => {
      expect(v).toBe("toonVertex");
      return document.createElement("script");
    })
    .mockImplementationOnce((v) => {
      expect(v).toBe("toonFragment");
      return document.createElement("script");
    });
});

afterEach(() => spy.mockReset());

test("createMaterials()", () => {
  const gui = new GUI({ autoPlace: false });
  createMaterials(gui); // there is nothing to test
  expect(spy).toHaveBeenCalledTimes(4);
});
