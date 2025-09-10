import GUI from "lil-gui";
import { createMaterials } from "src/material/materials";
import { expect, test, vi } from "vitest";

const getMsg = (key: string) =>
  `THREE.Material: parameter '${key}' has value of undefined.`;

const spy = vi
  .spyOn(console, "warn")
  .mockImplementationOnce((msg) => {
    expect(msg).toBe(getMsg("vertexShader"));
  })
  .mockImplementationOnce((msg) => {
    expect(msg).toBe(getMsg("fragmentShader"));
  })
  .mockImplementationOnce((msg) => {
    expect(msg).toBe(getMsg("vertexShader"));
  })
  .mockImplementationOnce((msg) => {
    expect(msg).toBe(getMsg("fragmentShader"));
  });

test("createMaterials()", () => {
  const gui = new GUI({ autoPlace: false });
  createMaterials(gui); // there is nothing to test
  expect(spy).toHaveBeenCalledTimes(4);
});
