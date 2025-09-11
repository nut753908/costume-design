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
    ["1", null, 1, 0, 0],
    [null, "1", 1, 1, 0],
  ])(
    "_title:%o, titleStart:%o, count1:%i, count12:%i, count21:%i",
    (_title, titleStart, count1, count12, count21) => {
      const parent = new GUI({ autoPlace: false });
      const child1 = parent.addFolder("1");
      const child12 = parent.addFolder("12");
      const child21 = parent.addFolder("21");
      const spy1 = vi.spyOn(child1, "destroy");
      const spy12 = vi.spyOn(child12, "destroy");
      const spy21 = vi.spyOn(child21, "destroy");
      deleteFolder(parent, _title, titleStart);
      expect(spy1).toHaveBeenCalledTimes(count1);
      expect(spy12).toHaveBeenCalledTimes(count12);
      expect(spy21).toHaveBeenCalledTimes(count21);
      spy1.mockReset();
      spy12.mockReset();
      spy21.mockReset();
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
