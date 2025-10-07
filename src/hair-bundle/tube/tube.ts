import type { GUI } from "lil-gui";
import { deleteFolder } from "src/main/gui";
import * as THREE from "three";
import { Curve2 } from "../curve/curve-2";
import { Curve3 } from "../curve/curve-3";
import {
  defaultTubeGeometryParameters,
  TubeGeometry,
  type TubeGeometryParameters,
  type TubeGeometryParametersJSON,
} from "./tube-geometry";

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
   * The TubeGeometry parameters.
   */
  parameters: TubeGeometryParameters;

  /**
   * Secret field.
   * This function is used by setGUI() in src/curve/tube.ts.
   * Set it in advance using createGeometry() in src/curve/tube.ts.
   */
  _updateGeometry: () => void;

  /**
   * Constructs a new tube.
   *
   * @param parameters - The TubeGeometry parameters.
   */
  constructor(parameters = defaultTubeGeometryParameters) {
    this.parameters = parameters;
    this._updateGeometry = () => {};
  }

  /**
   * Create geometry.
   */
  createGeometry(group: THREE.Group) {
    // biome-ignore lint/complexity/noUselessThisAlias: to leave t(=this) alive.
    const t = this;
    const p = t.parameters;

    // This function is used by setGUI() in src/curve/tube.ts.
    t._updateGeometry = () => {
      const geometry = new TubeGeometry(
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
      );

      if ("parameters" in geometry) {
        Object.assign(p, geometry.parameters);
      }

      if (
        "geometry" in group.children[0] &&
        group.children[0].geometry instanceof THREE.BufferGeometry
      ) {
        group.children[0].geometry.dispose();
        group.children[0].geometry = geometry;
      }
    };
    t._updateGeometry();
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
      t._updateGeometry(); // Set it in advance using createGeometry() in src/curve/tube.ts.
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
    this.parameters = {
      axis: source.parameters.axis.clone(),
      cross: source.parameters.cross.clone(),
      axisSegments: source.parameters.axisSegments,
      crossSegments: source.parameters.crossSegments,
      scaleN: source.parameters.scaleN,
      xScaleN: source.parameters.xScaleN,
      yScaleN: source.parameters.yScaleN,
      xCurvatureN: source.parameters.xCurvatureN,
      yCurvatureN: source.parameters.yCurvatureN,
      tiltN: source.parameters.tiltN,
      scaleC: source.parameters.scaleC.clone(),
      xScaleC: source.parameters.xScaleC.clone(),
      yScaleC: source.parameters.yScaleC.clone(),
      xCurvatureC: source.parameters.xCurvatureC.clone(),
      yCurvatureC: source.parameters.yCurvatureC.clone(),
      tiltC: source.parameters.tiltC.clone(),
      curvatureOrder: source.parameters.curvatureOrder,
    };

    return this;
  }

  /**
   * Serializes the tube into JSON.
   *
   * @return  A JSON object representing the serialized tube.
   */
  toJSON(): TubeGeometryParametersJSON {
    return {
      axis: this.parameters.axis.toJSON(),
      cross: this.parameters.cross.toJSON(),
      axisSegments: this.parameters.axisSegments,
      crossSegments: this.parameters.crossSegments,
      scaleN: this.parameters.scaleN,
      xScaleN: this.parameters.xScaleN,
      yScaleN: this.parameters.yScaleN,
      xCurvatureN: this.parameters.xCurvatureN,
      yCurvatureN: this.parameters.yCurvatureN,
      tiltN: this.parameters.tiltN,
      scaleC: this.parameters.scaleC.toJSON(),
      xScaleC: this.parameters.xScaleC.toJSON(),
      yScaleC: this.parameters.yScaleC.toJSON(),
      xCurvatureC: this.parameters.xCurvatureC.toJSON(),
      yCurvatureC: this.parameters.yCurvatureC.toJSON(),
      tiltC: this.parameters.tiltC.toJSON(),
      curvatureOrder: this.parameters.curvatureOrder,
    };
  }

  /**
   * Deserializes the tube from the given JSON.
   *
   * @param json - The JSON holding the serialized tube.
   * @return  A reference to this tube.
   */
  fromJSON(json: TubeGeometryParametersJSON): this {
    const p = this.parameters;

    p.axis = new Curve3().fromJSON(json.axis);
    p.cross = new Curve2().fromJSON(json.cross);
    p.axisSegments = json.axisSegments;
    p.crossSegments = json.crossSegments;
    p.scaleN = json.scaleN;
    p.xScaleN = json.xScaleN;
    p.yScaleN = json.yScaleN;
    p.xCurvatureN = json.xCurvatureN;
    p.yCurvatureN = json.yCurvatureN;
    p.tiltN = json.tiltN;
    p.scaleC = new Curve2().fromJSON(json.scaleC);
    p.xScaleC = new Curve2().fromJSON(json.xScaleC);
    p.yScaleC = new Curve2().fromJSON(json.yScaleC);
    p.xCurvatureC = new Curve2().fromJSON(json.xCurvatureC);
    p.yCurvatureC = new Curve2().fromJSON(json.yCurvatureC);
    p.tiltC = new Curve2().fromJSON(json.tiltC);
    p.curvatureOrder = json.curvatureOrder;

    return this;
  }
}
