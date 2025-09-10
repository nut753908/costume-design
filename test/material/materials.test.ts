import GUI from "lil-gui";
import { createMaterials } from "src/material/materials";
import { test } from "vitest";

test("createMaterials()", () => {
  const gui = new GUI({ autoPlace: false });
  createMaterials(gui);
  // there is nothing to test
});
