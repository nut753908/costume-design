import { GUI } from "three/addons/libs/lil-gui.module.min.js";

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
