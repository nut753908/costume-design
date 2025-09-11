import GUI from "lil-gui";
import {
  closeFolder,
  deleteFolder,
  loadClosed,
  saveClosed,
} from "src/main/gui";
import { describe, expect, test, vi } from "vitest";

test("saveClosed(), loadClosed()", () => {
  const parent = new GUI({ autoPlace: false });
  const child1 = parent.addFolder("1").close();
  const child2 = parent.addFolder("2");
  const grandchild1 = child2.addFolder("1").close();
  const grandchild2 = child2.addFolder("2");
  const closed = saveClosed(parent);

  parent.open();
  child1.open();
  child2.open();
  grandchild1.open();
  grandchild2.open();
  expect(saveClosed(parent)).not.toEqual(closed);

  loadClosed(parent, closed);
  expect(saveClosed(parent)).toEqual(closed);
});

describe("deleteFolder()", () => {
  test.each([
    [null, null, 0, 0, 0],
    ["A", null, 1, 0, 0],
    [null, "A", 1, 1, 0],
  ])(
    "_title:%o, titleStart:%o, countA:%i, countAB:%i, countBA:%i",
    (_title, titleStart, countA, countAB, countBA) => {
      const parent = new GUI({ autoPlace: false });
      const childA = parent.addFolder("A");
      const childAB = parent.addFolder("AB");
      const childBA = parent.addFolder("BA");
      const spyA = vi.spyOn(childA, "destroy");
      const spyAB = vi.spyOn(childAB, "destroy");
      const spyBA = vi.spyOn(childBA, "destroy");
      deleteFolder(parent, _title, titleStart);
      expect(spyA).toHaveBeenCalledTimes(countA);
      expect(spyAB).toHaveBeenCalledTimes(countAB);
      expect(spyBA).toHaveBeenCalledTimes(countBA);
      spyA.mockReset();
      spyAB.mockReset();
      spyBA.mockReset();
    }
  );
});

describe("closeFolder()", () => {
  test("without parent", () => {
    const folder = new GUI({ autoPlace: false });
    expect(folder._closed).toBeFalsy();
    closeFolder(folder);
    expect(folder._closed).toBeTruthy();
  });

  test("with parent", () => {
    const parent = new GUI({ autoPlace: false });
    const spy = vi.spyOn(parent, "_callOnOpenClose");
    const folder = parent.addFolder("1");
    expect(folder._closed).toBeFalsy();
    closeFolder(folder);
    expect(folder._closed).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockReset();
  });
});
