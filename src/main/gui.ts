import type { GUI } from "lil-gui";

export interface guiJSON {
  controllers: { [_name: string]: boolean | string | number };
  folders: { [_title: string]: guiJSON };
}

const foldersToSave = [
  "(fixed)",
  "LinesGroup",
  "PointsGroup",
  "PlanesGroup",
  "TubeGroup",
];

/**
 * Save GUI states of only the specified folders.
 */
export function saveGui(gui: GUI): guiJSON {
  const guiObj = gui.save() as guiJSON;
  const folders: guiJSON["folders"] = {};
  foldersToSave.forEach((k) => {
    folders[k] = guiObj.folders[k];
  });
  guiObj.folders = folders;
  return guiObj;
}

export interface closedJSON {
  _closed: boolean;
  folders: { [_title: string]: closedJSON };
}

/**
 * Save closed states recursively.
 */
export function saveClosed(gui: GUI): closedJSON {
  const folders: closedJSON["folders"] = {};
  gui.folders.forEach((f) => {
    folders[f._title] = saveClosed(f);
  });
  return {
    _closed: gui._closed,
    folders: folders,
  };
}

/**
 * Load closed states recursively.
 */
export function loadClosed(gui: GUI, closedObj: closedJSON) {
  gui.open(!closedObj._closed);
  gui.folders.map((f) => loadClosed(f, closedObj.folders[f._title]));
}

/**
 * Delete the child folders from the specified parent folder.
 *
 * @param parent - The parent of the deletion folder.
 * @param _title - The title of the deletion folder.
 * @param titleStart - The starting string for the title of the deletion folder.
 */
export function deleteFolder(
  parent: GUI,
  _title: string | null,
  titleStart: string | null = null
) {
  if (_title) {
    Array.from(parent.children)
      .filter((v) => "_title" in v && v._title === _title)
      .map((v) => v.destroy());
  } else if (titleStart) {
    Array.from(parent.children)
      .filter((v) => "_title" in v && v._title.startsWith(titleStart))
      .map((v) => v.destroy());
  }
}

/**
 * Close the folder while avoiding open/close events.
 */
export function closeFolder(folder: GUI) {
  if (!folder.parent) {
    folder.close();
    return;
  }
  const func = folder.parent._callOnOpenClose;
  folder.parent._callOnOpenClose = () => {};
  folder.close();
  folder.parent._callOnOpenClose = func;
}
