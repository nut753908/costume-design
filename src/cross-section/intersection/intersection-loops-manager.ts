import type GUI from "lil-gui";
import { deleteFolder } from "src/main/gui";
import { disposeGroup, objectMap } from "src/main/utils";
import type { Materials } from "src/material/materials";
import * as THREE from "three";
import { createAllEdges } from "../centerline/edges";
import {
  createAllIntersectionLoops,
  IntersectionLoops,
  type IntersectionLoopsJSON,
} from "../intersection/intersection-loops";
import { FreePlane, type FreePlaneJSON } from "../plane/free-plane";
import { VerticalPlane, type VerticalPlaneJSON } from "../plane/vertical-plane";
import { convertToTriangularPolygonIndices, createIndicesMap } from "./indices";
import { createAllIntersections } from "./intersections";

/**
 * A class for managing the increase/decrease of intersection loops.
 *
 * ```js
 * import { IntersectionLoopsManager } from "./src/cross-section/intersection/intersection-loops-manager";
 * const intersectionLoopsManager = new IntersectionLoopsManager();
 * ```
 */
export class IntersectionLoopsManager {
  /**
   * The planes at infinity.
   */
  planes: { [k: string]: FreePlane | VerticalPlane };

  /**
   * The intersection loops list.
   */
  intersectionLoopsList: { [k: string]: IntersectionLoops };

  /**
   * Secret field.
   * This function is used by createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
   * This function is used by addPlaneAndIntersectionLoops() in src/cross-section/intersection/intersection-loops-manager.ts.
   * Set it in advance using createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
   */
  _addGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
   * This function is used by removePlaneAndIntersectionLoops() in src/cross-section/intersection/intersection-loops-manager.ts.
   * Set it in advance using createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
   */
  _removeGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
   * Set it in advance using createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
   */
  _updateGroup: (k: string) => void;

  // TODO: add planeToIntersectionLoopsConverter
  /**
   * Constructs a new intersection loops manager.
   *
   * @param planes - {@link IntersectionLoopsManager#planes}
   * @param intersectionLoopsList - {@link IntersectionLoopsManager#intersectionLoopsList}
   */
  constructor(
    planes: { [k: string]: FreePlane | VerticalPlane } = {},
    intersectionLoopsList: { [k: string]: IntersectionLoops } = {}
  ) {
    this.planes = planes;
    this.intersectionLoopsList = intersectionLoopsList;
    this._addGroup = () => {};
    this._removeGroup = () => {};
    this._updateGroup = () => {};
  }

  // TODO: test
  /**
   * Create the group.
   */
  createGroup(positions: THREE.BufferAttribute, ms: Materials): THREE.Group {
    const parent = new THREE.Group();
    const children: { [k: string]: THREE.Group } = {};

    // This function is used by createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
    // This function is used by addPlaneAndIntersectionLoops() in src/cross-section/intersection/intersection-loops-manager.ts.
    this._addGroup = (k: string) => {
      if (!(k in this.planes)) {
        console.error(`\
!(k in this.planes)
- k: ${k}
- this.planes: ${JSON.stringify(this.planes)}
`);
        return;
      }
      if (!(k in this.intersectionLoopsList)) {
        console.error(`\
!(k in this.intersectionLoopsList)
- k: ${k}
- this.intersectionLoopsList: ${JSON.stringify(this.intersectionLoopsList)}
`);
        return;
      }
      const p = this.planes[k];
      const ils = this.intersectionLoopsList[k];
      children[k] = ils.createGroup(p, positions, ms);
      parent.add(children[k]);
    };
    Object.keys(this.intersectionLoopsList).map((k) => this._addGroup(k));

    // This function is used by createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
    // This function is used by removePlaneAndIntersectionLoops() in src/cross-section/intersection/intersection-loops-manager.ts.
    this._removeGroup = (k: string) => {
      parent.remove(children[k]);
      disposeGroup(children[k]);
      delete children[k];
    };

    // This function is used by setGUI() in src/cross-section/intersection/intersection-loops-manager.ts.
    this._updateGroup = (k: string) => {
      this._removeGroup(k);
      this._addGroup(k);
    };

    return parent;
  }

  // TODO: test
  /**
   * Set GUI.
   *
   * @param name - The intersection loops manager folder name used in the GUI.
   */
  setGUI(gui: GUI, name = "IntersectionLoopsManager") {
    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    Object.entries(this.intersectionLoopsList).forEach(([k, ils]) => {
      // _updateGroup: Set it in advance using createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
      ils.setGUI(folder, `intersectionLoops${k}`, k, this._updateGroup);
    });
  }

  // TODO: test
  /**
   * Create a plane to intersection loops converter.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param indices - The results of geometry.getIndex().
   */
  static createPlaneToIntersectionLoopsConverter(
    positions: THREE.BufferAttribute,
    indices: THREE.BufferAttribute
  ): (plane: FreePlane | VerticalPlane) => IntersectionLoops {
    const triangularPolygonIndices = convertToTriangularPolygonIndices(indices);
    const allEdges = createAllEdges(triangularPolygonIndices);
    const indicesMap = createIndicesMap(triangularPolygonIndices);
    return (plane: FreePlane | VerticalPlane) => {
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const allIntersectionLoops = createAllIntersectionLoops(
        indicesMap,
        allIntersections
      );
      return new IntersectionLoops(allIntersectionLoops);
    };
  }

  // TODO: test
  /**
   * Add a plane and intersection loops.
   *
   * @param key - The key in both this.planes and this.intersectionLoops.
   */
  addPlaneAndIntersectionLoops(
    key: string,
    plane: FreePlane | VerticalPlane,
    intersectionLoops: IntersectionLoops
  ) {
    this.planes[key] = plane;
    this.intersectionLoopsList[key] = intersectionLoops;
    this._addGroup(key); // Set it in advance using createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
  }

  // TODO: test
  /**
   * Remove a plane and intersection loops.
   *
   * @param key - The key in both this.planes and this.intersectionLoops.
   */
  removePlaneAndIntersectionLoops(key: string) {
    this._removeGroup(key); // Set it in advance using createGroup() in src/cross-section/intersection/intersection-loops-manager.ts.
    delete this.planes[key];
    delete this.intersectionLoopsList[key];
  }

  /**
   * Returns a new intersection loops manager with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): IntersectionLoopsManager {
    return new IntersectionLoopsManager().copy(this);
  }

  /**
   * Copies the values of the given intersection loops manager to this instance.
   *
   * @param source - The intersection loops manager to copy.
   * @return  A reference to this intersection loops manager.
   */
  copy(source: IntersectionLoopsManager): this {
    this.planes = objectMap(source.planes, (v) => v.clone());
    this.intersectionLoopsList = objectMap(source.intersectionLoopsList, (v) =>
      v.clone()
    );

    return this;
  }

  /**
   * Serializes the intersection loops manager into JSON.
   *
   * @return  A JSON object representing the serialized intersection loops manager.
   */
  toJSON(): IntersectionLoopsManagerJSON {
    return {
      planes: objectMap(this.planes, (v) => v.toJSON()),
      intersectionLoopsList: objectMap(this.intersectionLoopsList, (v) =>
        v.toJSON()
      ),
    };
  }

  /**
   * Deserializes the intersection loops manager from the given JSON.
   *
   * @param json - The JSON holding the serialized intersection loops manager.
   * @return  A reference to this intersection loops manager.
   */
  fromJSON(json: IntersectionLoopsManagerJSON): this {
    this.planes = objectMap(json.planes, (v) => {
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
    this.intersectionLoopsList = objectMap(json.intersectionLoopsList, (v) =>
      new IntersectionLoops().fromJSON(v)
    );

    return this;
  }
}

/**
 * The {@link IntersectionLoopsManager} JSON interface.
 */
export interface IntersectionLoopsManagerJSON {
  /** {@link IntersectionLoopsManager#planes} */
  planes: { [k: string]: FreePlaneJSON | VerticalPlaneJSON };
  /** {@link IntersectionLoopsManager#intersectionLoopsList} */
  intersectionLoopsList: { [k: string]: IntersectionLoopsJSON };
}
