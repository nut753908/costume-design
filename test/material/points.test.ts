import GUI from "lil-gui";
import { createPointsMaterial } from "src/material/points";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("createPointsMaterial()", () => {
  test("default params", () => {
    const gui = new GUI({ autoPlace: false });
    const m = createPointsMaterial(gui);
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe("pointsMaterial");
    expect(m.color.getHex(THREE.LinearSRGBColorSpace)).toBe(0xffffff);
  });

  test("specified params", () => {
    const gui = new GUI({ autoPlace: false });
    const name = "sample";
    const colorHex = 0x123456;
    const m = createPointsMaterial(gui, name, colorHex);
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe(name);
    expect(m.color.getHex(THREE.LinearSRGBColorSpace)).toBe(colorHex);
  });
});
