import * as THREE from "three";

import { LimitedTubeGeometry } from "../geometry/limited-tube.js";

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
              p.scale,
              p.xScale,
              p.yScale,
              p.tilt
            )
          : new LimitedTubeGeometry();

      Object.assign(p, geometry.parameters);

      group.children[0].geometry.dispose();
      group.children[1].geometry.dispose();

      group.children[0].geometry = new THREE.WireframeGeometry(geometry);
      group.children[1].geometry = geometry;
    })();
  }

  // TODO: Set _updateCpsGroup for each curve.
  // TODO: Add functions to change curve type between number and Curve{3,2}.
  /**
   * Set GUI.
   *
   * @param {GUI} gui
   */
  setGUI(gui) {
    const lt = this;
    const p = lt.parameters;

    const pi = Math.PI;
    const folder = gui.addFolder("lt");
    p.axis.setGUI(folder, "axis", update);
    p.cross.setGUI(folder, "cross", update);
    folder.add(p, "axisSegments").min(1).step(1).onChange(update);
    folder.add(p, "crossSegments").min(3).step(1).onChange(update);
    typeof p.scale === "number"
      ? folder.add(p, "scale").min(0).step(0.01).onChange(update)
      : p.scale.setGUI(folder, "scale", update);
    typeof p.xScale === "number"
      ? folder.add(p, "xScale").min(0).step(0.01).onChange(update)
      : p.xScale.setGUI(folder, "xScale", update);
    typeof p.yScale === "number"
      ? folder.add(p, "yScale").min(0).step(0.01).onChange(update)
      : p.yScale.setGUI(folder, "yScale", update);
    typeof p.tilt === "number"
      ? folder.add(p, "tilt", -pi, pi, 0.01).step(0.01).onChange(update)
      : p.tilt.setGUI(folder, "tilt", update);

    function update() {
      lt._updateGeometry(); // Set it in advance using createGeometry() in ./src/curve/limited-tube.js.
    }
  }

  /**
   * Copies the values of the given limited tube to this instance.
   *
   * @param {LimitedTube} source - The limited tube to copy.
   * @returns {LimitedTube} A reference to this limited tube.
   */
  copy(source) {
    super.copy(source);

    return this;
  }
}
