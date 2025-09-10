import GUI from "lil-gui";
import { createToonMaterial } from "src/material/toon";
import * as THREE from "three";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest";

describe("createToonMaterial()", () => {
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
      });
  });

  afterEach(() => spy.mockReset());

  test("default params", () => {
    let color: THREE.Color;
    const gui = new GUI({ autoPlace: false });
    const m = createToonMaterial(gui);
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title.startsWith("toonMaterial")).toBeTruthy();
    color = m.uniforms.baseColor.value;
    expect(color.getHex(THREE.LinearSRGBColorSpace)).toBe(0xfcd7e9);
    color = m.uniforms.shadeColor.value;
    expect(color.getHex(THREE.LinearSRGBColorSpace)).toBe(0xf8c1de);
    expect(m.side).toBe(THREE.FrontSide);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("specified params", () => {
    let color: THREE.Color;
    const gui = new GUI({ autoPlace: false });
    const name = "sample";
    const baseColorHex = 0x123456;
    const shadeColorHex = 0xabcdef;
    const side = THREE.DoubleSide;
    const m = createToonMaterial(gui, name, baseColorHex, shadeColorHex, side);
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title.startsWith(name)).toBeTruthy();
    color = m.uniforms.baseColor.value;
    expect(color.getHex(THREE.LinearSRGBColorSpace)).toBe(baseColorHex);
    color = m.uniforms.shadeColor.value;
    expect(color.getHex(THREE.LinearSRGBColorSpace)).toBe(shadeColorHex);
    expect(m.side).toBe(side);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
