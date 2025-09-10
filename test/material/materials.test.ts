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

const getMsg = (key: string) =>
  `THREE.Material: parameter '${key}' has value of undefined.`;

let spy: MockInstance;

beforeEach(() => {
  spy = vi
    .spyOn(console, "warn")
    .mockImplementationOnce((v) => {
      expect(v).toBe(getMsg("vertexShader"));
    })
    .mockImplementationOnce((v) => {
      expect(v).toBe(getMsg("fragmentShader"));
    })
    .mockImplementationOnce((v) => {
      expect(v).toBe(getMsg("vertexShader"));
    })
    .mockImplementationOnce((v) => {
      expect(v).toBe(getMsg("fragmentShader"));
    });
});

afterEach(() => spy.mockReset());

test("createMaterials()", () => {
  const gui = new GUI({ autoPlace: false });
  createMaterials(gui); // there is nothing to test
  expect(spy).toHaveBeenCalledTimes(4);
});
