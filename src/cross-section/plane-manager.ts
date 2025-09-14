import type GUI from "lil-gui";
import * as THREE from "three";
import { closeFolder, deleteFolder } from "../main/gui";
import { objectMap } from "../main/utils";
import type { ArrowHelperWithCallbacks } from "../object-3d/arrow-helper";
import { createPlanesGroup } from "../object-3d/group/planes";
import type { PlaneHelperWithCallbacks } from "../object-3d/plane-helper";
import { FreePlane, type FreePlaneJSON } from "./free-plane";
import { VerticalPlane, type VerticalPlaneJSON } from "./vertical-plane";

/**
 * A class for managing the increase/decrease of planes at infinity.
 *
 * ```js
 * import { PlaneManager } from "./src/cross-section/plane-manager";
 * const planeManager = new PlaneManager();
 * ```
 */
export class PlaneManager {
  /**
   * The curves to create a vertical plane.
   */
  curves: {
    [k: string]: THREE.CurvePath<THREE.Vector3> | THREE.CatmullRomCurve3;
  };

  /**
   * The planes at infinity.
   */
  planes: { [k: string]: FreePlane | VerticalPlane };

  /**
   * The next index of the planes.
   */
  planeNextIndex: number;

  /**
   * Secret field.
   * This function is used by setGUI() in ./src/cross-section/plane-manager.ts.
   * Set it in advance using createPlanesGroup() in ./src/cross-section/plane-manager.ts.
   */
  _updatePlanesGroup: () => void;

  /**
   * Constructs a new plane manager.
   *
   * @param curves - {@link PlaneManager#curves}
   * @param planes - {@link PlaneManager#planes}
   */
  constructor(
    curves: {
      [k: string]: THREE.CurvePath<THREE.Vector3> | THREE.CatmullRomCurve3;
    } = {},
    planes: { [k: string]: FreePlane | VerticalPlane } = {}
  ) {
    this.curves = curves;
    this.planes = planes;
    this.planeNextIndex = this.planeKeys.length;
    this._updatePlanesGroup = () => {};
  }

  /**
   * Create the planes group.
   */
  createPlanesGroup(
    gui: GUI,
    planeHelper: PlaneHelperWithCallbacks,
    arrowHelper: ArrowHelperWithCallbacks
  ): THREE.Group {
    // biome-ignore lint/complexity/noUselessThisAlias: to leave pm(=this) alive.
    const pm = this;
    const parent = new THREE.Group();
    let child: THREE.Group;

    // This function is used by setGUI() in ./src/cross-section/plane-manager.ts.
    pm._updatePlanesGroup = () => {
      if (child !== undefined) {
        if ("dispose" in child && child.dispose instanceof Function) {
          child.dispose();
        }
        parent.remove(child);
      }
      // TODO: Maintain group visible settings.
      child = createPlanesGroup(gui, pm.planes, planeHelper, arrowHelper);
      parent.add(child);
    };
    pm._updatePlanesGroup();

    return parent;
  }

  /**
   * Set GUI.
   *
   * @param name - The curve folder name used in the GUI.
   * @param updateCallback - The callback that is invoked after updating plane manager.
   * @param isClose - Whether to close the folder.
   */
  setGUI(
    gui: GUI,
    name = "PlaneManager",
    updateCallback = () => {},
    isClose = false
  ) {
    const pm = this;

    const obj = {
      addFreePlane: () => {
        pm.addFreePlane();
        update();
      },
      curveKey: pm.curveKeys[0] ?? "",
      addVerticalPlane: () => {
        pm.addVerticalPlane(obj.curveKey);
        update();
      },
      planeKey: pm.planeKeys[0] ?? "",
      removePlane: () => {
        pm.removePlane(obj.planeKey);
        obj.planeKey = "";
        update();
      },
    };

    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(obj, "addFreePlane");
    const cAVP = folder.add(obj, "addVerticalPlane");
    const cRP = folder.add(obj, "removePlane");
    let cCK = folder.add(obj, "curveKey").name("addVerticalPlane curveKey");
    let cPK = folder.add(obj, "planeKey").name("removePlane key");
    updateEnabled();
    updateOptions();
    if (isClose) closeFolder(folder);

    function update() {
      updateEnabled();
      updateOptions();
      pm._updatePlanesGroup(); // Set it in advance using createPlanesGroup() in ./src/cross-section/plane-manager.ts.
      updateCallback();
    }
    function updateEnabled() {
      pm.curveKeys.includes(obj.curveKey) ? cAVP.enable() : cAVP.disable();
      pm.planeKeys.includes(obj.planeKey) ? cRP.enable() : cRP.disable();
    }
    function updateOptions() {
      cCK = cCK.options(pm.curveKeys).onChange(updateEnabled);
      cPK = cPK.options(pm.planeKeys).onChange(updateEnabled);
    }
  }

  /**
   * add the free plane to this.planes.
   */
  addFreePlane() {
    const key = `[${this.planeNextIndex}] {FreePlane}`;
    this.planes[key] = new FreePlane();
    this.planeNextIndex += 1;
  }

  /**
   * add the vertical plane to this.planes.
   *
   * @param curveKey - The curve key in this.curves.
   */
  addVerticalPlane(curveKey: string) {
    if (!this.curveKeys.includes(curveKey)) {
      console.error(`\
if (!this.curveKeys.includes(curveKey))
- curveKey: ${curveKey}
- this.curveKeys: ${JSON.stringify(this.curveKeys)}
`);
      return;
    }
    const planeKey = `[${this.planeNextIndex}] ${curveKey} {VerticalPlane}`;
    this.planes[planeKey] = new VerticalPlane(this.curves[curveKey]);
    this.planeNextIndex += 1;
  }

  /**
   * remove the plane from this.planes.
   *
   * @param key - The plane key in this.planes.
   */
  removePlane(key: string) {
    if (!this.planeKeys.includes(key)) {
      console.error(`\
if (!this.planeKeys.includes(key))
- key: ${key}
- this.planeKeys: ${JSON.stringify(this.planeKeys)}
`);
    }
    delete this.planes[key];
  }

  /**
   * Get the curve keys in this.curves.
   */
  get curveKeys(): string[] {
    return Object.keys(this.curves);
  }

  /**
   * Get the plane keys in this.planes.
   */
  get planeKeys(): string[] {
    return Object.keys(this.planes);
  }

  /**
   * Returns a new plane manager with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): PlaneManager {
    return new PlaneManager().copy(this);
  }

  /**
   * Copies the values of the given plane manager to this instance.
   *
   * @param source - The plane manager to copy.
   * @return  A reference to this plane manager.
   */
  copy(source: PlaneManager): PlaneManager {
    this.curves = objectMap(source.curves, (v) => v.clone());
    this.planes = objectMap(source.planes, (v) => v.clone());
    this.planeNextIndex = source.planeNextIndex;

    return this;
  }

  /**
   * Serializes the plane manager into JSON.
   *
   * @return {Object} A JSON object representing the serialized plane manager.
   */
  toJSON(): PlaneManagerJSON {
    return {
      curves: objectMap(this.curves, (v) => v.toJSON()),
      planes: objectMap(this.planes, (v) => v.toJSON()),
      planeNextIndex: this.planeNextIndex,
    };
  }

  /**
   * Deserializes the plane manager from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized plane manager.
   * @return {PlaneManager} A reference to this plane manager.
   */
  fromJSON(json: PlaneManagerJSON): PlaneManager {
    this.curves = objectMap(json.curves, (v) => {
      if (v.type === "CurvePath") {
        return new THREE.CurvePath<THREE.Vector3>().fromJSON(
          v as THREE.CurvePathJSON
        );
      } else if (v.type === "CatmullRomCurve3") {
        return new THREE.CatmullRomCurve3().fromJSON(v as THREE.CurveJSON);
      } else {
        console.error(`\
!(v.type === "CurvePath") && !(v.type === "CatmullRomCurve3")
- v: ${JSON.stringify(v)}
`);
        return new THREE.CurvePath<THREE.Vector3>();
      }
    });
    this.planes = objectMap(json.planes, (v) => {
      if (v.type === "FreePlane") {
        return new FreePlane().fromJSON(v as FreePlaneJSON);
      } else if (v.type === "VerticalPlane") {
        return new VerticalPlane().fromJSON(v as VerticalPlaneJSON);
      } else {
        console.error(`\
!(v.type === "FreePlane") && !(v.type === "VerticalPlane")
- v: ${JSON.stringify(v)}
`);
        return new FreePlane();
      }
    });
    this.planeNextIndex = json.planeNextIndex;

    return this;
  }
}

/**
 * The {@link PlaneManager} JSON interface.
 */
export interface PlaneManagerJSON {
  /** {@link PlaneManager#curves} */
  curves: { [k: string]: THREE.CurvePathJSON | THREE.CurveJSON };
  /** {@link PlaneManager#planes} */
  planes: { [k: string]: FreePlaneJSON | VerticalPlaneJSON };
  /** {@link PlaneManager#planeNextIndex} */
  planeNextIndex: number;
}
