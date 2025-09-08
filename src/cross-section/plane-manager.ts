// TODO: test constructor(), clone(), copy(), toJSON(), fromJSON()
// TODO: add addFreePlane(), addVerticalPlane(curveKey), removePlane(planeIndex), getCurveKeys(), getPlaneIndices()

import * as THREE from "three";
import { objectMap } from "../main/utils";
import { FreePlane, type FreePlaneJSON } from "./free-plane";
import { VerticalPlane, type VerticalPlaneJSON } from "./vertical-plane";

/**
 * A class for managing the increase/decrease of planes at infinity.
 *
 * ```js
 * import { PlaneManager } from "./src/cross-section/plane-manager";
 * const planeManager = new PlaneManager();
 * ```
 */
export class PlaneManager {
  /**
   * The curves to create a vertical plane.
   */
  curves: {
    [k: number | string]:
      | THREE.CurvePath<THREE.Vector3>
      | THREE.CatmullRomCurve3;
  };

  /**
   * The planes at infinity.
   */
  planes: (FreePlane | VerticalPlane)[];

  /**
   * Constructs a new plane manager.
   *
   * @param curves - {@link PlaneManager#curves}
   * @param planes - {@link PlaneManager#planes}
   */
  constructor(
    curves: {
      [k: number | string]:
        | THREE.CurvePath<THREE.Vector3>
        | THREE.CatmullRomCurve3;
    } = {},
    planes: (FreePlane | VerticalPlane)[] = []
  ) {
    this.curves = curves;
    this.planes = planes;
  }

  /**
   * Returns a new plane manager with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): PlaneManager {
    return new PlaneManager().copy(this);
  }

  /**
   * Copies the values of the given plane manager to this instance.
   *
   * @param source - The plane manager to copy.
   * @return  A reference to this plane manager.
   */
  copy(source: PlaneManager): PlaneManager {
    this.curves = objectMap(source.curves, (v) => v.clone());
    this.planes = source.planes.map((v) => v.clone());

    return this;
  }

  /**
   * Serializes the plane manager into JSON.
   *
   * @return {Object} A JSON object representing the serialized plane manager.
   */
  toJSON(): PlaneManagerJSON {
    return {
      curves: objectMap(this.curves, (v) => v.toJSON()),
      planes: this.planes.map((v) => v.toJSON()),
    };
  }

  /**
   * Deserializes the plane manager from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized plane manager.
   * @return {PlaneManager} A reference to this plane manager.
   */
  fromJSON(json: PlaneManagerJSON): PlaneManager {
    this.curves = objectMap(json.curves, (v) => {
      if (v.type === "CurvePath") {
        return new THREE.CurvePath<THREE.Vector3>().fromJSON(
          v as THREE.CurvePathJSON
        );
      } else if (v.type === "CatmullRomCurve3") {
        return new THREE.CatmullRomCurve3().fromJSON(v as THREE.CurveJSON);
      } else {
        console.error(`\
!(v.type === "CurvePath") && !(v.type === "CatmullRomCurve3")
- v: ${JSON.stringify(v)}
`);
        return new THREE.CurvePath<THREE.Vector3>();
      }
    });
    this.planes = json.planes.map((v) => {
      if (v.type === "FreePlane") {
        return new FreePlane().fromJSON(v as FreePlaneJSON);
      } else if (v.type === "VerticalPlane") {
        return new VerticalPlane().fromJSON(v as VerticalPlaneJSON);
      } else {
        console.error(`\
!(v.type === "FreePlane") && !(v.type === "VerticalPlane")
- v: ${JSON.stringify(v)}
`);
        return new FreePlane();
      }
    });

    return this;
  }
}

/**
 * The {@link PlaneManager} JSON interface.
 */
export interface PlaneManagerJSON {
  /** {@link PlaneManager#curves} */
  curves: {
    [k: number | string]: THREE.CurvePathJSON | THREE.CurveJSON;
  };
  /** {@link PlaneManager#planes} */
  planes: (FreePlaneJSON | VerticalPlaneJSON)[];
}
