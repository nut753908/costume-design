import * as THREE from "three";

import { ControlPoint3 } from "./control-point-3";
import { ControlPoint2 } from "./control-point-2";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { isInvalidIndex } from "../math/utils";

/**
 * A 3D/2D Cubic Bezier curve path using 3D/2D control points.
 * This is an abstract class for Curve3/Curve2.
 */
export class Curve extends THREE.CurvePath {
  /**
   * Constructs a new Curve.
   *
   * @param {Array<ControlPoint3>|Array<ControlPoint2>} [cps=[]] - The 3D/2D control points.
   */
  constructor(cps = []) {
    super();

    this.type = "Curve";

    /**
     * The 3D/2D control points.
     *
     * @type {Array<ControlPoint3>|Array<ControlPoint2>}
     */
    this.cps = cps;

    /**
     * Secret field.
     * This function is used by setGUI() in ./src/curve/curve.js.
     * Set it in advance using createGeometry() in ./src/curve/curve.js.
     *
     * @type {()=>void}
     */
    this._updateCurvesAndGeometry = () => {};

    /**
     * Secret field.
     * This function is used by setGUI() in ./src/curve/curve.js.
     * Set it in advance using createCpsGroup() in ./src/object-3d/group/curve.js.
     *
     * @type {()=>void}
     */
    this._updateCpsGroup = () => {};

    this.updateCurves();
  }

  /**
   * Get the class of this.curves[*].
   *
   * @returns {object} - Either CubicBezierCurve3 or CubicBezierCurve.
   */
  get curveClass() {
    console.warn("Curve: .curveClass not implemented.");
  }

  /**
   * Get the class of this.cps[*].
   *
   * @returns {object} - Either ControlPoint3 or ControlPoint2.
   */
  get cpClass() {
    console.warn("Curve: .cpClass not implemented.");
  }

  /**
   * Get the folder name used in setGUI().
   *
   * @return {string}
   */
  get name() {
    console.warn("Curve: .name not implemented.");
  }

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
        this.cps[i + 1].middlePos.clone()
      );
      this.curves.push(curve);
    }
    this.updateArcLengths();
  }

  /**
   * Create geometry.
   *
   * @param {THREE.Line} line
   */
  createGeometry(line) {
    const c = this;

    // This function is used by setGUI() in ./src/curve/curve.js.
    c._updateCurvesAndGeometry = () => {
      c.updateCurves();
      updateGeometry();
    };
    function updateGeometry() {
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints(c.getPoints());

      line.geometry.dispose();
      line.geometry = geometry;
    }
    updateGeometry();
  }

  /**
   * Set GUI.
   *
   * @param {GUI} gui
   */
  setGUI(gui) {
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

    const folder = gui.addFolder(c.name);
    folder.add(obj, "addCpToFirst");
    folder.add(obj, "addCpToLast");
    const cICP = folder.add(obj, "interpolateCp");
    const cRCP = folder.add(obj, "removeCp");
    let cII = folder.add(obj, "iIndex").name("interpolateCp index");
    let cRI = folder.add(obj, "rIndex").name("removeCp index");
    updateEnabled();
    updateOptions();
    updateCpsFolder();

    function updateIfCpsLengthChanges() {
      c._updateCpsGroup(); // Set it in advance using createCpsGroup() in ./src/object-3d/group/curve.js.
      updateEnabled();
      updateOptions();
      updateCpsFolder();
      c._updateCurvesAndGeometry(); // Set it in advance using createGeometry() in ./src/curve/curve.js.
    }
    function updateEnabled() {
      c.iIndexList.indexOf(obj.iIndex) !== -1 ? cICP.enable() : cICP.disable();
      c.rIndexList.indexOf(obj.rIndex) !== -1 ? cRCP.enable() : cRCP.disable();
    }
    function updateOptions() {
      cII = cII.options(c.iIndexList).onChange(updateEnabled);
      cRI = cRI.options(c.rIndexList).onChange(updateEnabled);
    }
    function updateCpsFolder() {
      Array.from(folder.children)
        .filter((v) => v._title === "cps")
        .forEach((v) => v.destroy());
      const cpsFolder = folder.addFolder("cps");
      c.cps.forEach((cp, i) => {
        // c._updateCurvesAndGeometry: Set it in advance using createGeometry() in ./src/curve/curve.js.
        cp.setGUI(cpsFolder, `${i}`, c._updateCurvesAndGeometry);
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
   * @param {number} index - The index of this.cps. It is used as reference for cp1, cp2 and cp3.
   */
  interpolateCp(index) {
    if (isInvalidIndex(index, 1, this.cps.length - 1)) return;
    this.cps.splice(index, 0, this.cps[index].clone());
    const cp1 = this.cps[index - 1];
    const cp2 = this.cps[index];
    const cp3 = this.cps[index + 1];

    const centerPos = cp1.rightPos.clone().add(cp3.leftPos).divideScalar(2);
    cp1.rightPos = cp1.middlePos.clone().add(cp1.rightPos).divideScalar(2);
    cp3.leftPos = cp3.leftPos.clone().add(cp3.middlePos).divideScalar(2);
    cp2.leftPos = cp1.rightPos.clone().add(centerPos).divideScalar(2);
    cp2.rightPos = centerPos.clone().add(cp3.leftPos).divideScalar(2);
    cp2.middlePos = cp2.leftPos.clone().add(cp2.rightPos).divideScalar(2);

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
   * @param {number} index - The index of this.cps.
   */
  removeCp(index) {
    if (isInvalidIndex(index, 0, this.cps.length - 1)) return;
    this.cps.splice(index, 1);
  }

  /**
   * Get the index list of interpolateCp(index).
   *
   * @returns {Array<number>}
   */
  get iIndexList() {
    return this.rIndexList.slice(1);
  }

  /**
   * Get the index list of removeCp(index).
   *
   * @returns {Array<number>}
   */
  get rIndexList() {
    return [...Array(this.cps.length).keys()];
  }

  /**
   * Returns a new Curve with copied values from this instance.
   *
   * @returns {Curve} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given Curve to this instance.
   *
   * @param {Curve} source - The Curve to copy.
   * @returns {Curve} A reference to this Curve.
   */
  copy(source) {
    super.copy(source);

    this.cps = [];

    for (let i = 0, l = source.cps.length; i < l; i++) {
      const cp = source.cps[i];
      this.cps.push(cp.clone());
    }

    return this;
  }

  /**
   * Serializes the Curve into JSON.
   *
   * @return {Object} A JSON object representing the serialized Curve.
   */
  toJSON() {
    const data = super.toJSON();

    data.cps = [];

    for (let i = 0, l = this.cps.length; i < l; i++) {
      const cp = this.cps[i];
      data.cps.push(cp.toJSON());
    }

    return data;
  }

  /**
   * Deserializes the Curve from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized Curve.
   * @return {Curve} A reference to this Curve.
   */
  fromJSON(json) {
    super.fromJSON(json);

    this.cps = [];

    for (let i = 0, l = json.cps.length; i < l; i++) {
      const cp = json.cps[i];
      this.cps.push(new this.cpClass().fromJSON(cp));
    }

    return this;
  }
}
