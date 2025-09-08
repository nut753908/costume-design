import * as THREE from "three";

import { ControlPoint3, type ControlPoint3JSON } from "./control-point-3";
import type { ControlPoint2, ControlPoint2JSON } from "./control-point-2";
import type { GUI } from "lil-gui";
import { deleteFolder, closeFolder } from "../main/gui";
import { isInvalidIndex } from "../math/utils";
import { mean } from "../math/vector";

/**
 * A 3D/2D Cubic Bezier curve path using 3D/2D control points.
 * This is an abstract class for Curve3/Curve2.
 *
 * @augments THREE.CurvePath<TVector>
 */
export abstract class Curve<T extends Types> extends THREE.CurvePath<
  TypeMap[T]["vector"]
> {
  /**
   * The 3D/2D control points.
   */
  cps: TypeMap[T]["cp"][];

  /**
   * Secret field.
   * This function is used by setGUI() in ./src/curve/curve.ts.
   * Set it in advance using createGeometry() in ./src/curve/curve.ts.
   */
  _updateGeometry: () => void;

  /**
   * Secret field.
   * This function is used by setGUI() in ./src/curve/curve.ts.
   * Set it in advance using createCpsGroup() in ./src/object-3d/group/curve.ts.
   */
  _updateCpsGroup: () => void;

  /**
   * Constructs a new Curve.
   *
   * @param cps - The 3D/2D control points.
   */
  constructor(cps: TypeMap[T]["cp"][] = []) {
    super();
    this.cps = cps;
    this._updateGeometry = () => {};
    this._updateCpsGroup = () => {};
    this.updateCurves();
  }

  /**
   * Get the class of this.curves[*].
   */
  abstract get curveClass(): new (
    v0: TypeMap[T]["vector"],
    v1: TypeMap[T]["vector"],
    v2: TypeMap[T]["vector"],
    v3: TypeMap[T]["vector"],
  ) => TypeMap[T]["curve"];

  /**
   * Get the class of this.cps[*].
   */
  abstract get cpClass(): new () => TypeMap[T]["cp"];

  /**
   * Update curves using this.cps.
   */
  updateCurves() {
    this.curves = [];
    for (let i = 0, l = this.cps.length - 1; i < l; i++) {
      const curve = new this.curveClass(
        this.cps[i].middlePos.clone(),
        this.cps[i].rightPos.clone(),
        this.cps[i + 1].leftPos.clone(),
        this.cps[i + 1].middlePos.clone(),
      );
      this.curves.push(curve);
    }
    this.updateArcLengths();
  }

  /**
   * Create geometry.
   */
  createGeometry(line: THREE.Line) {

    // This function is used by setGUI() in ./src/curve/curve.ts.
    (this._updateGeometry = () => {
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints(
        this.getPoints() as THREE.Vector3[] | THREE.Vector2[],
      );

      line.geometry.dispose();
      line.geometry = geometry;
    })();
  }

  /**
   * Set GUI.
   *
   * @param name - The curve folder name used in the GUI.
   * @param updateCallback - The callback that is invoked after updating curve.
   * @param isClose - Whether to close the folder.
   */
  setGUI(
    gui: GUI,
    name = this.type,
    updateCallback = () => {},
    isClose = false,
  ) {
    const c = this;

    const obj = {
      addCpToFirst: () => {
        c.addCpToFirst();
        updateIfCpsLengthChanges();
      },
      addCpToLast: () => {
        c.addCpToLast();
        updateIfCpsLengthChanges();
      },
      iIndex: 1,
      interpolateCp: () => {
        c.interpolateCp(obj.iIndex);
        updateIfCpsLengthChanges();
      },
      rIndex: 0,
      removeCp: () => {
        c.removeCp(obj.rIndex);
        updateIfCpsLengthChanges();
      },
    };

    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(obj, "addCpToFirst");
    folder.add(obj, "addCpToLast");
    const cICP = folder.add(obj, "interpolateCp");
    const cRCP = folder.add(obj, "removeCp");
    let cII = folder.add(obj, "iIndex").name("interpolateCp index");
    let cRI = folder.add(obj, "rIndex").name("removeCp index");
    updateEnabled();
    updateOptions();
    updateCpsFolder();
    if (isClose) closeFolder(folder);

    function updateIfCpsLengthChanges() {
      c._updateCpsGroup(); // Set it in advance using createCpsGroup() in ./src/object-3d/group/curve.ts.
      updateEnabled();
      updateOptions();
      updateCpsFolder();
      c.updateCurves();
      c._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/curve.ts.
      updateCallback();
    }
    function updateFromCp() {
      c.updateCurves();
      c._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/curve.ts.
      updateCallback();
    }
    function updateEnabled() {
      c.iIndexList.includes(obj.iIndex) ? cICP.enable() : cICP.disable();
      c.safeRIndexList.includes(obj.rIndex) ? cRCP.enable() : cRCP.disable();
    }
    function updateOptions() {
      cII = cII.options(c.iIndexList).onChange(updateEnabled);
      cRI = cRI.options(c.safeRIndexList).onChange(updateEnabled);
    }
    function updateCpsFolder() {
      deleteFolder(folder, null, "cp");
      c.cps.forEach((cp, i) => {
        cp.setGUI(folder, `cp${i}`, updateFromCp);
      });
    }
  }

  /**
   * Add cp to the beginning of this.cps.
   */
  addCpToFirst() {
    if (this.cps.length !== 0) {
      this.cps.unshift(this.cps[0].clone()); // Copy first cp.
    } else {
      this.cps.unshift(new this.cpClass());
    }
  }

  /**
   * Add cp to the end of this.cps.
   */
  addCpToLast() {
    if (this.cps.length !== 0) {
      this.cps.push(this.cps[this.cps.length - 1].clone()); // Copy last cp.
    } else {
      this.cps.push(new this.cpClass());
    }
  }

  /**
   * Interpolate cp2 using cp1 and cp3. This method also affects cp1 and cp3.
   *
   * @param index - The index of this.cps. It is used as reference for cp1, cp2 and cp3.
   */
  interpolateCp(index: number) {
    if (isInvalidIndex(index, 1, this.cps.length - 1)) return;
    this.cps.splice(index, 0, this.cps[index].clone());
    const cp1 = this.cps[index - 1];
    const cp2 = this.cps[index];
    const cp3 = this.cps[index + 1];

    const centerPos = mean<TypeMap[T]["vector"]>(cp1.rightPos, cp3.leftPos);
    cp1.rightPos = mean<TypeMap[T]["vector"]>(cp1.middlePos, cp1.rightPos);
    cp3.leftPos = mean<TypeMap[T]["vector"]>(cp3.leftPos, cp3.middlePos);
    cp2.leftPos = mean<TypeMap[T]["vector"]>(cp1.rightPos, centerPos);
    cp2.rightPos = mean<TypeMap[T]["vector"]>(centerPos, cp3.leftPos);
    cp2.middlePos = mean<TypeMap[T]["vector"]>(cp2.leftPos, cp2.rightPos);

    cp1.isSyncRadius = false;
    cp1.updateFromRightPos();

    cp2.isSyncRadius = false;
    cp2.isSyncAngle = false;
    cp2.updateFromLeftPos();
    cp2.updateFromRightPos();
    cp2.isSyncRadius = true;
    cp2.isSyncAngle = true;

    cp3.isSyncRadius = false;
    cp3.updateFromLeftPos();
  }

  /**
   * Remove this.cps[index].
   *
   * @param index - The index of this.cps.
   */
  removeCp(index: number) {
    if (isInvalidIndex(index, 0, this.cps.length - 1)) return;
    this.cps.splice(index, 1);
  }

  /**
   * Get the index list of interpolateCp(index).
   */
  get iIndexList(): number[] {
    return this.rIndexList.slice(1);
  }

  /**
   * Get the GUI-safe version of iIndexList.
   */
  get safeRIndexList(): number[] {
    return this.cps.length >= 3 ? this.rIndexList : [];
  }

  /**
   * Get the index list of removeCp(index).
   */
  get rIndexList(): number[] {
    return [...Array(this.cps.length).keys()];
  }

  /**
   * Copies the values of the given Curve to this instance.
   *
   * @param source - The Curve to copy.
   * @return  A reference to this Curve.
   */
  copy(source: Curve<T>): this {
    super.copy(source);
    this.cps = source.cps.map((cp) => cp.clone());
    this.updateCurves();

    return this;
  }

  /**
   * Serializes the Curve into JSON.
   *
   * @return  A JSON object representing the serialized Curve.
   */
  toJSON(): CurveJSON<T> {
    return {
      ...super.toJSON(),
      cps: this.cps.map((cp) => cp.toJSON()),
    };
  }

  /**
   * Deserializes the Curve from the given JSON.
   *
   * @param json - The JSON holding the serialized Curve.
   * @return  A reference to this Curve.
   */
  fromJSON(json: CurveJSON<T>): this {
    super.fromJSON(json);
    this.cps = json.cps.map((cp) => {
      const cpClass = new this.cpClass();
      if (cpClass instanceof ControlPoint3) {
        return cpClass.fromJSON(cp as ControlPoint3JSON);
      } else {
        return cpClass.fromJSON(cp as ControlPoint2JSON);
      }
    });
    this.updateCurves();

    return this;
  }
}

/**
 * The {@link Curve} JSON interface.
 */
export interface CurveJSON<T extends Types> extends THREE.CurvePathJSON {
  /** {@link Curve#cps} */
  cps: TypeMap[T]["cpJSON"][];
}

type TypeMap = {
  3: {
    vector: THREE.Vector3;
    curve: THREE.CubicBezierCurve3;
    cp: ControlPoint3;
    cpJSON: ControlPoint3JSON;
  };
  2: {
    vector: THREE.Vector2;
    curve: THREE.CubicBezierCurve;
    cp: ControlPoint2;
    cpJSON: ControlPoint2JSON;
  };
};
type Types = keyof TypeMap;
