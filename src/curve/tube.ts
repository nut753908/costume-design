import * as THREE from "three";

import { TubeGeometry } from "../geometry/tube";
import { GUI } from "lil-gui";
import { deleteFolder } from "../main/gui";
import { Curve } from "./curve";
import { Curve3 } from "./curve-3";
import { Curve2 } from "./curve-2";

/**
 * A class for managing TubeGeometry.
 *
 * ```js
 * import { Tube } from "./src/curve/tube";
 * const tube = new Tube();
 * ```
 */
export class Tube {
  /**
   * The Parameters for TubeGeometry.
   */
  parameters: { [k: string]: any }; // FIXME:

  /**
   * Secret field.
   * This function is used by setGUI() in ./src/curve/tube.js.
   * Set it in advance using createGeometry() in ./src/curve/tube.js.
   */
  _updateGeometry: () => void;

  /**
   * Constructs a new tube.
   *
   * @param parameters - The Parameters for TubeGeometry.
   */
  constructor(parameters = {}) {
    this.parameters = parameters;
    this._updateGeometry = () => {};
  }

  /**
   * Create geometry.
   *
   * @param group
   */
  createGeometry(group: THREE.Group) {
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

      if ("parameters" in geometry) {
        Object.assign(p, geometry.parameters);
      }

      if (
        "geometry" in group.children[0] &&
        group.children[0].geometry instanceof THREE.BufferGeometry
      ) {
        group.children[0].geometry.dispose();
        group.children[0].geometry = new THREE.WireframeGeometry(geometry);
      }
      if (
        "geometry" in group.children[1] &&
        group.children[1].geometry instanceof THREE.BufferGeometry
      ) {
        group.children[1].geometry.dispose();
        group.children[1].geometry = geometry;
      }
    })();
  }

  /**
   * Set GUI.
   */
  setGUI(gui: GUI) {
    const t = this;
    const p = t.parameters;

    deleteFolder(gui, "Tube");
    const folder = gui.addFolder("Tube");
    p.axis.setGUI(folder, "axis", update, true);
    p.cross.setGUI(folder, "cross", update, true);
    folder.add(p, "axisSegments").min(1).step(1).onChange(update);
    folder.add(p, "crossSegments").min(3).step(1).onChange(update);
    folder.add(p, "scaleN").min(0).step(0.01).onChange(update);
    folder.add(p, "xScaleN").min(0).step(0.01).onChange(update);
    folder.add(p, "yScaleN").min(0).step(0.01).onChange(update);
    folder.add(p, "xCurvatureN").step(0.01).onChange(update);
    folder.add(p, "yCurvatureN").step(0.01).onChange(update);
    folder.add(p, "tiltN").step(1).onChange(update);
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
   * @return  A clone of this instance.
   */
  clone(): Tube {
    return new Tube().copy(this);
  }

  /**
   * Copies the values of the given tube to this instance.
   *
   * @param source - The tube to copy.
   * @return  A reference to this tube.
   */
  copy(source: Tube): this {
    this.parameters = Object.assign({}, source.parameters);

    Object.entries(source.parameters).forEach(([k, v]) => {
      if (v instanceof Curve) this.parameters[k] = v.clone();
    });

    return this;
  }

  /**
   * Serializes the tube into JSON.
   *
   * @return  A JSON object representing the serialized tube.
   */
  // FIXME:
  toJSON(): TubeJSON {
    const data = Object.assign({}, this.parameters);

    Object.entries(this.parameters).forEach(([k, v]) => {
      if (v instanceof Curve) data[k] = v.toJSON();
    });

    return data;
  }

  /**
   * Deserializes the tube from the given JSON.
   *
   * @param json - The JSON holding the serialized tube.
   * @return  A reference to this tube.
   */
  // FIXME:
  fromJSON(json: TubeJSON): this {
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

/**
 * The {@link Tube} JSON interface.
 */
export interface TubeJSON {
  /** {@link Tube#parameters} */
  parameters: { [k: string]: any }; // FIXME:
}
