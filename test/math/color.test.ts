import { createColor } from "src/math/color";
import * as THREE from "three";
import { expect, test } from "vitest";

test("createColor()", () => {
  const hex = 0x123456;
  const color = createColor(hex);
  expect(color.getHex(THREE.LinearSRGBColorSpace)).toBe(hex);
});
