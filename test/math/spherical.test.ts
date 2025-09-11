import { Spherical } from "src/math/spherical";
import { describe, expect, test } from "vitest";

describe("Spherical", () => {
  test("constructor()", () => {
    const s = new Spherical(2, Math.PI / 2, Math.PI);
    expect(s.radius).toBe(2);
    expect(s.phi).toBe(Math.PI / 2);
    expect(s.theta).toBe(Math.PI);
  });

  test("toJSON()", () => {
    const json1 = new Spherical(2, Math.PI / 2, Math.PI).toJSON();
    const json2 = { radius: 2, phi: Math.PI / 2, theta: Math.PI };
    expect(json1).toEqual(json2);
  });

  test("fromJSON()", () => {
    const s1 = new Spherical().fromJSON({
      radius: 2,
      phi: Math.PI / 2,
      theta: Math.PI,
    });
    const s2 = new Spherical(2, Math.PI / 2, Math.PI);
    expect(s1).toEqual(s2);
  });
});
