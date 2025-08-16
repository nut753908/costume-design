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
 *
 * folders = {
 *   [_title]: {
 *     controllers,
 *     folders
 *   }
 * }
 */

/**
 * @param {Object} guiObj
 * @returns {Object} folders
 */
export function pickStaticFolders(guiObj) {
  return [
    "THREE.Scene",
    "THREE.AxesHelper",
    "THREE.Material",
    "TubeGroup",
  ].reduce((o, k) => ({ ...o, [k]: guiObj.folders[k] }), {});
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
    folders: (gui.folders ?? []).reduce(
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
