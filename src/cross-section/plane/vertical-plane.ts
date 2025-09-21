import type GUI from "lil-gui";
import { deleteFolder } from "src/main/gui";
import * as THREE from "three";
import { Plane } from "./plane";

/**
 * A plane at infinity. The plane is perpendicular to the curve at position u.
 *
 * ```js
 * import { VerticalPlane } from "./src/cross-section/plane/vertical-plane";
 * const points = [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) ];
 * const curve = new THREE.CatmullRomCurve3( points );
 * const verticalPlane = new VerticalPlane( curve, 0 );
 * ```
 *
 * @augments Plane
 */
export class VerticalPlane extends Plane {
  type: string;

  /**
   * The curve.
   */
  curve: THREE.CurvePath<THREE.Vector3> | THREE.CatmullRomCurve3;

  /**
   * The position on the curve according to the arc length. Must be in the range [0, 1].
   */
  u: number;

  /**
   * Constructs a new vertical plane.
   *
   * @param curve - {@link VerticalPlane#curve}
   * @param u - {@link VerticalPlane#u}
   * @param inverted - {@link Plane#inverted}
   */
  constructor(
    curve:
      | THREE.CurvePath<THREE.Vector3>
      | THREE.CatmullRomCurve3 = new THREE.CurvePath(),
    u = 0,
    inverted = false
  ) {
    super(inverted);
    this.type = "VerticalPlane";
    this.curve = curve;
    this.u = u;
  }

  /**
   * Set GUI.
   *
   * @param name - The vertical plane folder name used in the GUI.
   * @param key - The key for the callback.
   * @param updateCallback - The callback that is invoked after updating plane.
   */
  setGUI(
    gui: GUI,
    name = this.type,
    key = this.type,
    updateCallback = (_key: string) => {}
  ) {
    const p = this;

    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(p, "u", 0, 1, 0.01).onChange(uU);
    folder.add(p, "inverted").onChange(uI);

    function uU() /* updateU */ {
      p._updateGroup(); // Set it in advance using createGroup() in src/cross-section/plane/plane.ts.
      updateCallback(key);
    }
    function uI() /* updateInverted */ {
      p._updateGroup(); // Set it in advance using createGroup() in src/cross-section/plane/plane.ts.
    }
  }

  /**
   * Get the normal direction of the plane.
   */
  getNormal(): THREE.Vector3 {
    return this.inverted
      ? this.curve.getTangentAt(this.u).negate()
      : this.curve.getTangentAt(this.u);
  }

  /**
   * Get the reference point on the plane.
   */
  getPoint(): THREE.Vector3 {
    return this.curve.getPointAt(this.u);
  }

  /**
   * Returns a new vertical plane with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): VerticalPlane {
    return new VerticalPlane().copy(this);
  }

  /**
   * Copies the values of the given vertical plane to this instance.
   *
   * @param source - The vertical plane to copy.
   * @return  A reference to this vertical plane.
   */
  copy(source: VerticalPlane): this {
    this.curve = source.curve.clone();
    this.u = source.u;
    this.inverted = source.inverted;

    return this;
  }

  /**
   * Serializes the vertical plane into JSON.
   *
   * @return  A JSON object representing the serialized vertical plane.
   */
  toJSON(): VerticalPlaneJSON {
    return {
      type: this.type,
      curve: this.curve.toJSON(),
      u: this.u,
      inverted: this.inverted,
    };
  }

  /**
   * Deserializes the vertical plane from the given JSON.
   *
   * @param json - The JSON holding the serialized vertical plane.
   * @return  A reference to this vertical plane.
   */
  fromJSON(json: VerticalPlaneJSON): this {
    if (json.curve.type === "CurvePath") {
      this.curve = new THREE.CurvePath<THREE.Vector3>().fromJSON(
        json.curve as THREE.CurvePathJSON
      );
    } else if (json.curve.type === "CatmullRomCurve3") {
      this.curve = new THREE.CatmullRomCurve3().fromJSON(
        json.curve as THREE.CurveJSON
      );
    } else {
      console.error(`\
!(json.curve.type === "CurvePath") && !(json.curve.type === "CatmullRomCurve3")
- json.curve: ${JSON.stringify(json.curve)}
`);
      this.curve = new THREE.CurvePath<THREE.Vector3>();
    }
    this.u = json.u;
    this.inverted = json.inverted;

    return this;
  }
}

/**
 * The {@link VerticalPlane} JSON interface.
 */
export interface VerticalPlaneJSON {
  /** {@link VerticalPlane#type} */
  type: string;
  /** {@link VerticalPlane#curve} */
  curve: THREE.CurvePathJSON | THREE.CurveJSON;
  /** {@link VerticalPlane#u} */
  u: number;
  /** {@link Plane#inverted} */
  inverted: boolean;
}
