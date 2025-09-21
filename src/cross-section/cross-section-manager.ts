import type GUI from "lil-gui";
import { deleteFolder } from "src/main/gui";
import { disposeGroup, objectMap } from "src/main/utils";
import type { Materials } from "src/material/materials";
import * as THREE from "three";
import { createAllEdges } from "./centerline/edges";
import {
  convertToTriangularPolygonIndices,
  createIndicesMap,
} from "./intersection/indices";
import {
  IntersectionLoopPicker,
  type IntersectionLoopPickerJSON,
} from "./intersection/intersection-loop-picker";
import { createAllIntersectionLoops } from "./intersection/intersection-loops";
import { createAllIntersections } from "./intersection/intersections";
import { FreePlane, type FreePlaneJSON } from "./plane/free-plane";
import { VerticalPlane, type VerticalPlaneJSON } from "./plane/vertical-plane";

/**
 * A class for managing the increase/decrease of cross sections.
 *
 * ```js
 * import { CrossSectionManager } from "./src/cross-section/cross-section-manager";
 * const crossSectionManager = new CrossSectionManager();
 * ```
 */
export class CrossSectionManager {
  /**
   * The cross sections.
   */
  crossSections: {
    [k: string]: {
      plane: FreePlane | VerticalPlane;
      ilp: IntersectionLoopPicker;
    };
  };

  /**
   * Secret field.
   * This function is used by createIlpsGroup() in src/cross-section/cross-section-manager.ts.
   * This function is used by addCrossSection() in src/cross-section/cross-section-manager.ts.
   * Set it in advance using createIlpsGroup() in src/cross-section/cross-section-manager.ts.
   */
  _addIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createIlpsGroup() in src/cross-section/cross-section-manager.ts.
   * This function is used by removeCrossSection() in src/cross-section/cross-section-manager.ts.
   * Set it in advance using createIlpsGroup() in src/cross-section/cross-section-manager.ts.
   */
  _removeIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createIlpsGroup() in src/cross-section/cross-section-manager.ts.
   * Set it in advance using createIlpsGroup() in src/cross-section/cross-section-manager.ts.
   */
  _updateIlpGroup: (k: string) => void;

  // TODO: add planeToIntersectionLoopPickerConverter
  /**
   * Constructs a new cross section manager.
   *
   * @param crossSections - {@link CrossSectionManager#crossSections}
   */
  constructor(
    crossSections: {
      [k: string]: {
        plane: FreePlane | VerticalPlane;
        ilp: IntersectionLoopPicker;
      };
    } = {}
  ) {
    this.crossSections = crossSections;
    this._addIlpGroup = () => {};
    this._removeIlpGroup = () => {};
    this._updateIlpGroup = () => {};
  }

  // TODO: test
  /**
   * Create the intersection loop pickers group.
   */
  createIlpsGroup(
    positions: THREE.BufferAttribute,
    ms: Materials
  ): THREE.Group {
    const parent = new THREE.Group();
    const children: { [k: string]: THREE.Group } = {};

    // This function is used by createIlpsGroup() in src/cross-section/cross-section-manager.ts.
    // This function is used by addCrossSection() in src/cross-section/cross-section-manager.ts.
    this._addIlpGroup = (k: string) => {
      const p = this.crossSections[k].plane;
      const ilp = this.crossSections[k].ilp;
      children[k] = ilp.createGroup(p, positions, ms);
      parent.add(children[k]);
    };
    Object.keys(this.crossSections).map((k) => this._addIlpGroup(k));

    // This function is used by createIlpsGroup() in src/cross-section/cross-section-manager.ts.
    // This function is used by removeCrossSection() in src/cross-section/cross-section-manager.ts.
    this._removeIlpGroup = (k: string) => {
      parent.remove(children[k]);
      disposeGroup(children[k]);
      delete children[k];
    };

    // This function is used by setGUI() in src/cross-section/cross-section-manager.ts.
    this._updateIlpGroup = (k: string) => {
      this._removeIlpGroup(k);
      this._addIlpGroup(k);
    };

    return parent;
  }

  // TODO: test
  /**
   * Set GUI.
   *
   * @param name - The cross section manager folder name used in the GUI.
   */
  setGUI(gui: GUI, name = "CrossSectionManager") {
    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    Object.entries(this.crossSections).forEach(([k, cs]) => {
      // _updateIlpGroup: Set it in advance using createIlpsGroup() in src/cross-section/cross-section-manager.ts.
      cs.ilp.setGUI(folder, `ilp${k}`, k, this._updateIlpGroup);
    });
  }

  // TODO: test
  /**
   * Create a plane to an intersection loop picker converter.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param indices - The results of geometry.getIndex().
   */
  static createPlaneToIntersectionLoopPickerConverter(
    positions: THREE.BufferAttribute,
    indices: THREE.BufferAttribute
  ): (plane: FreePlane | VerticalPlane) => IntersectionLoopPicker {
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
      return new IntersectionLoopPicker(allIntersectionLoops);
    };
  }

  // TODO: test
  /**
   * Add a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  addCrossSection(
    key: string,
    plane: FreePlane | VerticalPlane,
    ilp: IntersectionLoopPicker
  ) {
    this.crossSections[key] = { plane, ilp };
    this._addIlpGroup(key); // Set it in advance using createIlpsGroup() in src/cross-section/cross-section-manager.ts.
  }

  // TODO: test
  /**
   * Remove a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  removeCrossSection(key: string) {
    this._removeIlpGroup(key); // Set it in advance using createIlpsGroup() in src/cross-section/cross-section-manager.ts.
    delete this.crossSections[key];
  }

  /**
   * Returns a new cross section manager with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): CrossSectionManager {
    return new CrossSectionManager().copy(this);
  }

  /**
   * Copies the values of the given cross section manager to this instance.
   *
   * @param source - The cross section manager to copy.
   * @return  A reference to this cross section manager.
   */
  copy(source: CrossSectionManager): this {
    this.crossSections = objectMap(source.crossSections, (v) => ({
      plane: v.plane.clone(),
      ilp: v.ilp.clone(),
    }));

    return this;
  }

  /**
   * Serializes the cross section manager into JSON.
   *
   * @return  A JSON object representing the serialized cross section manager.
   */
  toJSON(): CrossSectionManagerJSON {
    return {
      crossSections: objectMap(this.crossSections, (v) => ({
        plane: v.plane.toJSON(),
        ilp: v.ilp.toJSON(),
      })),
    };
  }

  /**
   * Deserializes the cross section manager from the given JSON.
   *
   * @param json - The JSON holding the serialized cross section manager.
   * @return  A reference to this cross section manager.
   */
  fromJSON(json: CrossSectionManagerJSON): this {
    this.crossSections = objectMap(json.crossSections, (v) => {
      let plane: FreePlane | VerticalPlane;
      if (v.plane.type === "FreePlane") {
        plane = new FreePlane().fromJSON(v.plane as FreePlaneJSON);
      } else if (v.plane.type === "VerticalPlane") {
        plane = new VerticalPlane().fromJSON(v.plane as VerticalPlaneJSON);
      } else {
        console.error(`\
!(v.plane.type === "FreePlane") && !(v.plane.type === "VerticalPlane")
- v.plane: ${JSON.stringify(v.plane)}
`);
        plane = new FreePlane();
      }
      return {
        plane,
        ilp: new IntersectionLoopPicker().fromJSON(v.ilp),
      };
    });

    return this;
  }
}

/**
 * The {@link CrossSectionManager} JSON interface.
 */
export interface CrossSectionManagerJSON {
  /** {@link CrossSectionManager#crossSections} */
  crossSections: {
    [k: string]: {
      plane: FreePlaneJSON | VerticalPlaneJSON;
      ilp: IntersectionLoopPickerJSON;
    };
  };
}
