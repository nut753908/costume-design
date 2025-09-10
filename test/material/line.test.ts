import GUI from "lil-gui";
import { createLineMaterial } from "src/material/line";
import * as THREE from "three";
import { describe, expect, test } from "vitest";

describe("createLineMaterial()", () => {
  test("default params", () => {
    const gui = new GUI({ autoPlace: false });
    const m = createLineMaterial(gui);
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe("lineMaterial");
    expect(m.color.getHex(THREE.LinearSRGBColorSpace)).toBe(0xffffff);
    expect(m.opacity).toBe(1);
  });

  test("specified params", () => {
    const gui = new GUI({ autoPlace: false });
    const name = "sample";
    const colorHex = 0x123456;
    const opacity = 0.5;
    const m = createLineMaterial(gui, name, colorHex, opacity);
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe(name);
    expect(m.color.getHex(THREE.LinearSRGBColorSpace)).toBe(colorHex);
    expect(m.opacity).toBe(opacity);
  });
});
