import * as THREE from "three";

import { TubeGeometry } from "../geometry/tube.js";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";
import { Curve } from "./curve.js";
import { Curve3 } from "./curve-3.js";
import { Curve2 } from "./curve-2.js";

/**
 * A class for managing TubeGeometry.
 *
 * ```js
 * import { Tube } from "./src/curve/tube.js";
 * const t = new Tube();
 * ```
 */
export class Tube {
  /**
   * Constructs a new tube.
   *
   * @param {Object} parameters - The Parameters for TubeGeometry.
   */
  constructor(parameters = {}) {
    /**
     * The Parameters for TubeGeometry.
     *
     * @type {Object}
     */
    this.parameters = parameters;

    /**
     * Secret field.
     * This function is used by setGUI() in ./src/curve/tube.js.
     * Set it in advance using createGeometry() in ./src/curve/tube.js.
     *
     * @type {()=>void}
     */
    this._updateGeometry = () => {};
  }

  /**
   * Create geometry.
   *
   * @param {THREE.Group} group
   */
  createGeometry(group) {
    const t = this;
    const p = t.parameters;

    // This function is used by setGUI() in ./src/curve/tube.js.
    (t._updateGeometry = () => {
      const geometry =
        Object.keys(p).length !== 0
          ? new TubeGeometry(
              p.axis,
              p.cross,
              p.axisSegments,
              p.crossSegments,
              p.scaleN,
              p.xScaleN,
              p.yScaleN,
              p.xCurvatureN,
              p.yCurvatureN,
              p.tiltN,
              p.scaleC,
              p.xScaleC,
              p.yScaleC,
              p.xCurvatureC,
              p.yCurvatureC,
              p.tiltC,
              p.curvatureOrder
            )
          : new TubeGeometry();

      Object.assign(p, geometry.parameters);

      group.children[0].geometry.dispose();
      group.children[1].geometry.dispose();

      group.children[0].geometry = new THREE.WireframeGeometry(geometry);
      group.children[1].geometry = geometry;

      // Add VertexNormalsHelper for debugging.
      if (group.children[2]) {
        group.children[2].dispose();
      }
      group.children[2] = new VertexNormalsHelper(
        group.children[1],
        0.05,
        0xff0000
      );
    })();
  }

  /**
   * Set GUI.
   *
   * @param {GUI} gui
   */
  setGUI(gui) {
    const t = this;
    const p = t.parameters;

    const folder = gui.addFolder("t");
    p.axis.setGUI(folder, "axis", update, true);
    p.cross.setGUI(folder, "cross", update, true);
    folder.add(p, "axisSegments").min(1).step(1).onChange(update);
    folder.add(p, "crossSegments").min(3).step(1).onChange(update);
    folder.add(p, "scaleN").min(0).step(0.01).onChange(update);
    folder.add(p, "xScaleN").min(0).step(0.01).onChange(update);
    folder.add(p, "yScaleN").min(0).step(0.01).onChange(update);
    folder.add(p, "xCurvatureN").step(0.01).onChange(update);
    folder.add(p, "yCurvatureN").step(0.01).onChange(update);
    folder.add(p, "tiltN", -180, 180, 1).onChange(update);
    p.scaleC.setGUI(folder, "scaleC", update, true);
    p.xScaleC.setGUI(folder, "xScaleC", update, true);
    p.yScaleC.setGUI(folder, "yScaleC", update, true);
    p.xCurvatureC.setGUI(folder, "xCurvatureC", update, true);
    p.yCurvatureC.setGUI(folder, "yCurvatureC", update, true);
    p.tiltC.setGUI(folder, "tiltC", update, true);
    folder.add(p, "curvatureOrder", ["xy", "yx"]).onChange(update);

    function update() {
      t._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/tube.js.
    }
  }

  /**
   * Returns a new tube with copied values from this instance.
   *
   * @return {Tube} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given tube to this instance.
   *
   * @param {Tube} source - The tube to copy.
   * @returns {Tube} A reference to this tube.
   */
  copy(source) {
    this.parameters = Object.assign({}, source.parameters);

    Object.entries(source.parameters).forEach(([k, v]) => {
      if (v instanceof Curve) this.parameters[k] = v.clone();
    });

    return this;
  }

  /**
   * Serializes the tube into JSON.
   *
   * @return {Object} A JSON object representing the serialized tube.
   */
  toJSON() {
    const data = Object.assign({}, this.parameters);

    Object.entries(this.parameters).forEach(([k, v]) => {
      if (v instanceof Curve) data[k] = v.toJSON();
    });

    return data;
  }

  /**
   * Deserializes the tube from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized tube.
   * @return {Tube} A reference to this tube.
   */
  fromJSON(json) {
    const p = this.parameters;

    p.axis = (p.axis ?? new Curve3()).fromJSON(json.axis);
    p.cross = (p.cross ?? new Curve2()).fromJSON(json.cross);
    p.axisSegments = json.axisSegments;
    p.crossSegments = json.crossSegments;
    p.scaleN = json.scaleN;
    p.xScaleN = json.xScaleN;
    p.yScaleN = json.yScaleN;
    p.xCurvatureN = json.xCurvatureN;
    p.yCurvatureN = json.yCurvatureN;
    p.tiltN = json.tiltN;
    p.scaleC = (p.scaleC ?? new Curve2()).fromJSON(json.scaleC);
    p.xScaleC = (p.xScaleC ?? new Curve2()).fromJSON(json.xScaleC);
    p.yScaleC = (p.yScaleC ?? new Curve2()).fromJSON(json.yScaleC);
    p.xCurvatureC = (p.xCurvatureC ?? new Curve2()).fromJSON(json.xCurvatureC);
    p.yCurvatureC = (p.yCurvatureC ?? new Curve2()).fromJSON(json.yCurvatureC);
    p.tiltC = (p.tiltC ?? new Curve2()).fromJSON(json.tiltC);
    p.curvatureOrder = json.curvatureOrder;

    return this;
  }
}
