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
 * Save GUI states of only the specified folders.
 *
 * @param {GUI} gui
 * @returns {Object} guiObj
 */
export function saveGui(gui) {
  const guiObj = gui.save();
  const folders = {};
  ["(fixed)", "LinesGroup", "PlanesGroup", "TubeGroup"].forEach(
    (k) => (folders[k] = guiObj.folders[k])
  );
  guiObj.folders = folders;
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
 * Save closed states recursively.
 *
 * @param {GUI} gui
 * @returns {Object} closedObj
 */
export function saveClosed(gui) {
  const folders = {};
  gui.folders.forEach((f) => (folders[f._title] = saveClosed(f)));
  return {
    _closed: gui._closed,
    folders: folders,
  };
}

/**
 * Load closed states recursively.
 *
 * @param {GUI} gui
 * @param {Object} closedObj
 */
export function loadClosed(gui, closedObj) {
  gui.open(!closedObj._closed);
  gui.folders.map((f) => loadClosed(f, closedObj.folders[f._title]));
}

/**
 * Delete the child folders from the specified parent folder.
 *
 * @param {GUI} parent - The parent of the deletion folder.
 * @param {string} _title - The title of the deletion folder.
 * @param {?string} [titleStart=null] - The starting string for the title of the deletion folder.
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
 * Close the folder while avoiding open/close events.
 *
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
