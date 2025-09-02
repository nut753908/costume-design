import { GUI } from "lil-gui";

/**
 * guiObj = {
 *   controllers: {
 *     [_name]: [any]
 *   }
 *   folders: {
 *     [_title]: {
 *       controllers,
 *       folders
 *     }
 *   }
 * }
 */

/**
 * @param {GUI} gui
 * @returns {Object} guiObj
 */
export function saveGui(gui) {
  const guiObj = gui.save();
  guiObj.folders = [
    "THREE.Scene",
    "THREE.AxesHelper",
    "THREE.Material",
    "EdgesGroup",
    "TubeGroup",
  ].reduce((o, k) => ({ ...o, [k]: guiObj.folders[k] }), {});
  return guiObj;
}

/**
 * closedObj = {
 *   _closed: boolean,
 *   folders: {
 *     [_title]: {
 *       _closed: boolean,
 *       folders
 *     }
 *   }
 * }
 */

/**
 * @param {GUI} gui
 * @returns {Object} closedObj
 */
export function saveClosed(gui) {
  return {
    _closed: gui._closed,
    folders: gui.folders.reduce(
      (acc, f) => ({ ...acc, [f._title]: saveClosed(f) }),
      {}
    ),
  };
}

/**
 * @param {GUI} gui
 * @param {Object} closedObj
 */
export function loadClosed(gui, closedObj) {
  gui.open(!closedObj._closed);
  gui.folders.map((f) => loadClosed(f, closedObj.folders[f._title]));
}

/**
 * @param {GUI} parent - The parent of the deletion folder.
 * @param {string} _title - The title of the deletion folder.
 * @param {?string} titleStart - The starting string for the title of the deletion folder.
 */
export function deleteFolder(parent, _title, titleStart = null) {
  if (_title) {
    Array.from(parent.children)
      .filter((v) => v._title === _title)
      .forEach((v) => v.destroy());
  } else if (titleStart) {
    Array.from(parent.children)
      .filter((v) => v._title?.startsWith(titleStart))
      .forEach((v) => v.destroy());
  }
}

/**
 * @param {GUI} folder
 */
export function closeFolder(folder) {
  if (!folder.parent) {
    folder.close();
    return;
  }
  const func = folder.parent._callOnOpenClose;
  folder.parent._callOnOpenClose = () => {};
  folder.close();
  folder.parent._callOnOpenClose = func;
}
