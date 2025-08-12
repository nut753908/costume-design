import { LimitedTubeGeometry } from "../geometry/limited-tube.js";

/**
 * A class for managing LimitedTubeGeometry.
 *
 * ```js
 * import { LimitedTubeGeometry } from "./src/geometry/limited-tube.js";
 * import { LimitedTube } from "./src/curve/limited-tube.js";
 *
 * const geometry = new LimitedTubeGeometry();
 * const lt = new LimitedTube( geometry );
 * ```
 */
export class LimitedTube {
  /**
   * Constructs a new limited tube.
   *
   * @param {LimitedTubeGeometry} [geometry] - A geometry class for representing a tube with curve type restricted to Curve{3,2}.
   */
  constructor(geometry = new LimitedTubeGeometry()) {
    /**
     * A geometry class for representing a tube with curve type restricted to Curve{3,2}.
     *
     * @type {LimitedTubeGeometry}
     */
    this.geometry = geometry;

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

    // This function is used by setGUI() in ./src/curve/limited-tube.js.
    (lt._updateGeometry = () => {
      group.children.forEach((v) => {
        v.geometry.dispose();
        v.geometry = geometry;
      });
    })();
  }

  // TODO: Add this to the scene.
  // TODO: Set _updateCpsGroup for each curve.
  // TODO: Add functions to change curve type between number and Curve{3,2}.
  /**
   * Set GUI.
   *
   * @param {GUI} gui
   */
  setGUI(gui) {
    const lt = this;
    const p = lt.geometry.parameters;

    const pi = Math.PI;
    const folder = gui.addFolder("lt");
    p.axis.setGUI(gui, "axis", update);
    p.cross.setGUI(gui, "cross", update);
    folder.add(p, "axisSegments").min(1).step(1).onChange(update);
    folder.add(p, "crossSegments").min(1).step(1).onChange(update);
    typeof p.scale === "number"
      ? folder.add(p, "scale").min(1).step(0.01).onChange(update)
      : p.scale.setGUI(gui, "scale", update);
    typeof p.xScale === "number"
      ? folder.add(p, "xScale").min(1).step(0.01).onChange(update)
      : p.xScale.setGUI(gui, "xScale", update);
    typeof p.yScale === "number"
      ? folder.add(p, "yScale").min(1).step(0.01).onChange(update)
      : p.yScale.setGUI(gui, "yScale", update);
    typeof p.tilt === "number"
      ? folder.add(p, "tilt", -pi, pi, 0.01).step(0.01).onChange(update)
      : p.tilt.setGUI(gui, "tilt", update);

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
