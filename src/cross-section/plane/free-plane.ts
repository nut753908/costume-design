import type GUI from "lil-gui";
import { deleteFolder } from "src/main/gui";
import * as THREE from "three";
import { Plane } from "./plane";

/**
 * A free plane at infinity.
 *
 * ```js
 * import { FreePlane } from "./src/cross-section/plane/free-plane";
 * const normal = new THREE.Vector3( 0, 1, 0 );
 * const point = new THREE.Vector3( 0, 0, 0 );
 * const freePlane = new FreePlane( normal, point );
 * ```
 *
 * @augments Plane
 */
export class FreePlane extends Plane {
  type: string;

  /**
   * The normal direction of the plane. Must be a unit vector.
   */
  normal: THREE.Vector3;

  /**
   * The reference point on the plane.
   */
  point: THREE.Vector3;

  /**
   * Constructs a new free plane.
   *
   * @param normal - {@link FreePlane#normal}
   * @param point - {@link FreePlane#point}
   * @param inverted - {@link Plane#inverted}
   */
  constructor(
    normal = new THREE.Vector3(0, 1, 0),
    point = new THREE.Vector3(0, 0, 0),
    inverted = false
  ) {
    super(inverted);
    this.type = "FreePlane";
    this.normal = normal;
    this.point = point;
  }

  /**
   * Set GUI.
   *
   * @param name - The free plane folder name used in the GUI.
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
    const nFolder = folder.addFolder("normal");
    nFolder.add(p.normal, "x").step(0.01).onChange(uN);
    nFolder.add(p.normal, "y").step(0.01).onChange(uN);
    nFolder.add(p.normal, "z").step(0.01).onChange(uN);
    const pFolder = folder.addFolder("point");
    pFolder.add(p.point, "x").step(0.01).onChange(uP);
    pFolder.add(p.point, "y").step(0.01).onChange(uP);
    pFolder.add(p.point, "z").step(0.01).onChange(uP);
    folder.add(p, "inverted").onChange(uI);

    function uN() /* updateNormal */ {
      p.normal.normalize();
      p._updateGroup();
      nFolder.controllers.map((c) => c.updateDisplay());
      updateCallback(key);
    }
    function uP() /* updatePoint */ {
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
    return this.inverted ? this.normal.clone().negate() : this.normal;
  }

  /**
   * Get the reference point on the plane.
   */
  getPoint(): THREE.Vector3 {
    return this.point;
  }

  /**
   * Returns a new free plane with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): FreePlane {
    return new FreePlane().copy(this);
  }

  /**
   * Copies the values of the given free plane to this instance.
   *
   * @param source - The free plane to copy.
   * @return  A reference to this free plane.
   */
  copy(source: FreePlane): this {
    this.normal.copy(source.normal);
    this.point.copy(source.point);
    this.inverted = source.inverted;

    return this;
  }

  /**
   * Serializes the free plane into JSON.
   *
   * @return  A JSON object representing the serialized free plane.
   */
  toJSON(): FreePlaneJSON {
    return {
      type: this.type,
      normal: this.normal.toArray(),
      point: this.point.toArray(),
      inverted: this.inverted,
    };
  }

  /**
   * Deserializes the free plane from the given JSON.
   *
   * @param json - The JSON holding the serialized free plane.
   * @return  A reference to this free plane.
   */
  fromJSON(json: FreePlaneJSON): this {
    this.normal.fromArray(json.normal);
    this.point.fromArray(json.point);
    this.inverted = json.inverted;

    return this;
  }
}

/**
 * The {@link FreePlane} JSON interface.
 */
export interface FreePlaneJSON {
  /** {@link FreePlane#type} */
  type: string;
  /** {@link FreePlane#normal} */
  normal: THREE.Vector3Tuple;
  /** {@link FreePlane#point} */
  point: THREE.Vector3Tuple;
  /** {@link Plane#inverted} */
  inverted: boolean;
}
