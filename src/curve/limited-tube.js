import * as THREE from "three";

import { LimitedTubeGeometry } from "../geometry/limited-tube.js";

// TODO: Fix copy().
// TODO: Add clone(), toJSON(), and fromJSON().
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
              p.tiltN,
              p.scaleC,
              p.xScaleC,
              p.yScaleC,
              p.tiltC
            )
          : new LimitedTubeGeometry();

      Object.assign(p, geometry.parameters);

      group.children[0].geometry.dispose();
      group.children[1].geometry.dispose();

      group.children[0].geometry = new THREE.WireframeGeometry(geometry);
      group.children[1].geometry = geometry;
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
    folder.add(p, "tiltN", -180, 180, 1).onChange(update);
    p.scaleC.setGUI(folder, "scaleC", update, true);
    p.xScaleC.setGUI(folder, "xScaleC", update, true);
    p.yScaleC.setGUI(folder, "yScaleC", update, true);
    p.tiltC.setGUI(folder, "tiltC", update, true);

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
