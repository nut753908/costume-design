import type GUI from "lil-gui";
import { deleteFolder } from "src/main/gui";
import { disposeGroup, objectMap } from "src/main/utils";
import type { ArrowHelperWithCallbacks } from "src/object-3d/arrow-helper";
import type { PlaneHelperWithCallbacks } from "src/object-3d/plane-helper";
import * as THREE from "three";
import { FreePlane, type FreePlaneJSON } from "./free-plane";
import { Plane } from "./plane";
import { VerticalPlane, type VerticalPlaneJSON } from "./vertical-plane";

/**
 * A class for managing the increase/decrease of planes at infinity.
 *
 * ```js
 * import { PlaneManager } from "./src/cross-section/plane/plane-manager";
 * const points = [ new THREE.Vector3( 1, 2, 3 ), new THREE.Vector3( 1, 2, 4 ) ];
 * const curves = {
 *   a: createLinePath( points ),
 *   b: new THREE.CatmullRomCurve3( points ),
 * };
 * const planeManager = new PlaneManager( curves );
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
   * This function is used by addFreePlane() in src/cross-section/plane/plane-manager.ts.
   * This function is used by addVerticalPlane() in src/cross-section/plane/plane-manager.ts.
   * Set it in advance using createPlanesGroup() in src/cross-section/plane/plane-manager.ts.
   */
  _addPlaneGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by removePlane() in src/cross-section/plane/plane-manager.ts.
   * Set it in advance using createPlanesGroup() in src/cross-section/plane/plane-manager.ts.
   */
  _removePlaneGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by addFreePlane() in src/cross-section/plane/plane-manager.ts.
   * This function is used by addVerticalPlane() in src/cross-section/plane/plane-manager.ts.
   * Set it manually in src/main.ts.
   */
  _addCrossSection: (key: string, plane: FreePlane | VerticalPlane) => void;

  /**
   * Secret field.
   * This function is used by removePlane() in src/cross-section/plane/plane-manager.ts.
   * Set it manually in src/main.ts.
   */
  _removeCrossSection: (key: string) => void;

  /**
   * Secret field.
   * This function is used by setGUI() in src/cross-section/plane/plane-manager.ts.
   * Set it manually in src/main.ts.
   */
  _updateCrossSection: (key: string, plane: FreePlane | VerticalPlane) => void;

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
    this._addPlaneGroup = () => {};
    this._removePlaneGroup = () => {};
    this._addCrossSection = () => {};
    this._removeCrossSection = () => {};
    this._updateCrossSection = () => {};
  }

  /**
   * Create the planes group.
   */
  createPlanesGroup(
    planeHelper: PlaneHelperWithCallbacks,
    arrowHelper: ArrowHelperWithCallbacks
  ): THREE.Group {
    const parent = new THREE.Group();
    const children: { [k: string]: THREE.Group } = {};

    // This function is used by createPlanesGroup() in src/cross-section/plane/plane-manager.ts.
    // This function is used by addFreePlane() in src/cross-section/plane/plane-manager.ts.
    // This function is used by addVerticalPlane() in src/cross-section/plane/plane-manager.ts.
    this._addPlaneGroup = (k: string) => {
      const p = this.planes[k];
      children[k] = p.createGroup(k, planeHelper, arrowHelper);
      parent.add(children[k]);
    };
    Object.keys(this.planes).map((k) => this._addPlaneGroup(k));

    // This function is used by removePlane() in src/cross-section/plane/plane-manager.ts.
    this._removePlaneGroup = (k: string) => {
      parent.remove(children[k]);
      disposeGroup(children[k]);
      delete children[k];
      Plane.removeCallbacks(k, planeHelper, arrowHelper);
    };

    return parent;
  }

  /**
   * Set GUI.
   */
  setGUI(gui: GUI) {
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

    deleteFolder(gui, "PlaneManager");
    const folder = gui.addFolder("PlaneManager");
    folder.add(obj, "addFreePlane");
    const cAVP = folder.add(obj, "addVerticalPlane");
    const cRP = folder.add(obj, "removePlane");
    let cCK = folder.add(obj, "curveKey").name("addVerticalPlane curveKey");
    let cPK = folder.add(obj, "planeKey").name("removePlane key");
    updateEnabled();
    updateOptions();

    function update() {
      updateEnabled();
      updateOptions();
      updatePlanesFolder();
    }
    function updateEnabled() {
      pm.curveKeys.includes(obj.curveKey) ? cAVP.enable() : cAVP.disable();
      pm.planeKeys.includes(obj.planeKey) ? cRP.enable() : cRP.disable();
    }
    function updateOptions() {
      cCK = cCK.options(pm.curveKeys).onChange(updateEnabled);
      cPK = cPK.options(pm.planeKeys).onChange(updateEnabled);
    }
    function updatePlanesFolder() {
      deleteFolder(folder, null, "plane");
      Object.entries(pm.planes).forEach(([k, p]) => {
        p.setGUI(folder, `plane${k}`, () => {
          pm._updateCrossSection(k, p); // Set it manually in src/main.ts.
        });
      });
    }
  }

  /**
   * Add the free plane to this.planes.
   */
  addFreePlane() {
    const key = `[${this.planeNextIndex}] {FreePlane}`;
    this.planes[key] = new FreePlane();
    this._addPlaneGroup(key); // Set it in advance using createPlanesGroup() in src/cross-section/plane/plane-manager.ts.
    this._addCrossSection(key, this.planes[key]); // Set it manually in src/main.ts.
    this.planeNextIndex += 1;
  }

  /**
   * Add the vertical plane to this.planes.
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
    this._addPlaneGroup(planeKey); // Set it in advance using createPlanesGroup() in src/cross-section/plane/plane-manager.ts.
    this._addCrossSection(planeKey, this.planes[planeKey]); // Set it manually in src/main.ts.
    this.planeNextIndex += 1;
  }

  /**
   * Remove the plane from this.planes.
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
    this._removePlaneGroup(key); // Set it in advance using createPlanesGroup() in src/cross-section/plane/plane-manager.ts.
    this._removeCrossSection(key); // Set it manually in src/main.ts.
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
  copy(source: PlaneManager): this {
    this.curves = objectMap(source.curves, (v) => v.clone());
    this.planes = objectMap(source.planes, (v) => v.clone());
    this.planeNextIndex = source.planeNextIndex;

    return this;
  }

  /**
   * Serializes the plane manager into JSON.
   *
   * @return  A JSON object representing the serialized plane manager.
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
   * @param json - The JSON holding the serialized plane manager.
   * @return  A reference to this plane manager.
   */
  fromJSON(json: PlaneManagerJSON): this {
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
