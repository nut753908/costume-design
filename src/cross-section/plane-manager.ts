import type GUI from "lil-gui";
import * as THREE from "three";
import { closeFolder, deleteFolder } from "../main/gui";
import { objectMap } from "../main/utils";
import { isInvalidIndex } from "../math/utils";
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
  planes: (FreePlane | VerticalPlane)[];

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
    planes: (FreePlane | VerticalPlane)[] = []
  ) {
    this.curves = curves;
    this.planes = planes;
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
      child = createPlanesGroup(
        gui,
        // TODO: Change the planes type from Array to Object.
        Object.fromEntries(pm.planes.map((p, i) => [i, p])),
        planeHelper,
        arrowHelper
      );
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
      planeIndex: 0,
      removePlane: () => {
        pm.removePlane(obj.planeIndex);
        update();
      },
    };

    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(obj, "addFreePlane");
    const cAVP = folder.add(obj, "addVerticalPlane");
    const cRP = folder.add(obj, "removePlane");
    let cCK = folder.add(obj, "curveKey").name("addVerticalPlane curveKey");
    let cPI = folder.add(obj, "planeIndex").name("removePlane index");
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
      pm.planeIndices.includes(obj.planeIndex) ? cRP.enable() : cRP.disable();
    }
    function updateOptions() {
      cCK = cCK.options(pm.curveKeys).onChange(updateEnabled);
      cPI = cPI.options(pm.planeIndices).onChange(updateEnabled);
    }
  }

  /**
   * add the free plane to this.planes.
   */
  addFreePlane() {
    this.planes.push(new FreePlane());
  }

  /**
   * add the vertical plane to this.planes.
   *
   * @param curveKey - The curve key in this.curves.
   */
  addVerticalPlane(curveKey: string) {
    if (!this.curveKeys.includes(curveKey)) {
      console.error(`\
!(curveKey in this.curves)
- curveKey: ${curveKey}
- this.curveKeys: ${JSON.stringify(this.curveKeys)}
`);
      return;
    }
    this.planes.push(new VerticalPlane(this.curves[curveKey]));
  }

  /**
   * remove the plane from this.planes.
   *
   * @param index - The plane index in this.planes.
   */
  removePlane(index: number) {
    if (isInvalidIndex(index, 0, this.planes.length - 1)) return;
    this.planes.splice(index, 1);
  }

  /**
   * Get the curve keys in this.curves.
   */
  get curveKeys(): string[] {
    return Object.keys(this.curves);
  }

  /**
   * Get the plane indices in this.planes.
   */
  get planeIndices(): number[] {
    return this.planes.map((_, i) => i);
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
    this.planes = source.planes.map((v) => v.clone());

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
      planes: this.planes.map((v) => v.toJSON()),
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
    this.planes = json.planes.map((v) => {
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
  planes: (FreePlaneJSON | VerticalPlaneJSON)[];
}
