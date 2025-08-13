import * as THREE from "three";

import { LimitedTubeGeometry } from "../geometry/limited-tube.js";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";
import { Curve } from "./curve.js";
import { Curve3 } from "./curve-3.js";
import { Curve2 } from "./curve-2.js";

/**
 * A class for managing LimitedTubeGeometry.
 *
 * ```js
 * import { LimitedTube } from "./src/curve/limited-tube.js";
 * const lt = new LimitedTube();
 * ```
 */
export class LimitedTube {
  /**
   * Constructs a new limited tube.
   *
   * @param {Object} parameters - The Parameters for LimitedTubeGeometry.
   */
  constructor(parameters = {}) {
    /**
     * The Parameters for LimitedTubeGeometry.
     *
     * @type {Object}
     */
    this.parameters = parameters;

    /**
     * Secret field.
     * This function is used by setGUI() in ./src/curve/limited-tube.js.
     * Set it in advance using createGeometry() in ./src/curve/limited-tube.js.
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
    const lt = this;
    const p = lt.parameters;

    // This function is used by setGUI() in ./src/curve/limited-tube.js.
    (lt._updateGeometry = () => {
      const geometry =
        Object.keys(p).length !== 0
          ? new LimitedTubeGeometry(
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
          : new LimitedTubeGeometry();

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
    const lt = this;
    const p = lt.parameters;

    const folder = gui.addFolder("lt");
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
      lt._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/limited-tube.js.
    }
  }

  /**
   * Returns a new limited tube with copied values from this instance.
   *
   * @return {LimitedTube} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }

  /**
   * Copies the values of the given limited tube to this instance.
   *
   * @param {LimitedTube} source - The limited tube to copy.
   * @returns {LimitedTube} A reference to this limited tube.
   */
  copy(source) {
    this.parameters = Object.assign({}, source.parameters);

    Object.entries(source.parameters).forEach(([k, v]) => {
      if (v instanceof Curve) this.parameters[k] = v.clone();
    });

    return this;
  }

  /**
   * Serializes the limited tube into JSON.
   *
   * @return {Object} A JSON object representing the serialized limited tube.
   */
  toJSON() {
    const data = Object.assign({}, this.parameters);

    Object.entries(this.parameters).forEach(([k, v]) => {
      if (v instanceof Curve) data[k] = v.toJSON();
    });

    return data;
  }

  /**
   * Deserializes the limited tube from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized limited tube.
   * @return {LimitedTube} A reference to this limited tube.
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
