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
 * The area divided by cross sections.
 *
 * ```js
 * import { Area } from "./src/cross-section/area";
 * const area = new Area();
 * ```
 */
export class Area {
  /**
   * The plane to intersection loop picker converter.
   */
  planeToIlp: (plane: FreePlane | VerticalPlane) => IntersectionLoopPicker;

  /**
   * The cross sections dividing the area.
   */
  crossSections: {
    [k: string]: {
      plane: FreePlane | VerticalPlane;
      ilp: IntersectionLoopPicker;
    };
  };

  /**
   * The thickness of the area.
   */
  thickness: number;

  /**
   * Secret field.
   * This function is used by createIlpsGroup() in src/cross-section/area.ts.
   * This function is used by addCrossSection() in src/cross-section/area.ts.
   * Set it in advance using createIlpsGroup() in src/cross-section/area.ts.
   */
  _addIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createIlpsGroup() in src/cross-section/area.ts.
   * This function is used by removeCrossSection() in src/cross-section/area.ts.
   * Set it in advance using createIlpsGroup() in src/cross-section/area.ts.
   */
  _removeIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createIlpsGroup() in src/cross-section/area.ts.
   * Set it in advance using createIlpsGroup() in src/cross-section/area.ts.
   */
  _updateIlpGroup: (k: string) => void;

  /**
   * Constructs a new area.
   *
   * @param planeToIlp - {@link Area#planeToIlp}
   * @param crossSections - {@link Area#crossSections}
   * @param thickness - {@link Area#thickness}
   */
  constructor(
    planeToIlp: Area["planeToIlp"] = () => new IntersectionLoopPicker(),
    crossSections: Area["crossSections"] = {},
    thickness = 0.001
  ) {
    this.crossSections = crossSections;
    this.thickness = thickness;
    this.planeToIlp = planeToIlp;
    this._addIlpGroup = () => {};
    this._removeIlpGroup = () => {};
    this._updateIlpGroup = () => {};
  }

  /**
   * Create the intersection loop pickers group.
   */
  createIlpsGroup(
    positions: THREE.BufferAttribute,
    ms: Materials
  ): THREE.Group {
    const parent = new THREE.Group();
    const children: { [k: string]: THREE.Group } = {};

    // This function is used by createIlpsGroup() in src/cross-section/area.ts.
    // This function is used by addCrossSection() in src/cross-section/area.ts.
    this._addIlpGroup = (k: string) => {
      const p = this.crossSections[k].plane;
      const ilp = this.crossSections[k].ilp;
      children[k] = ilp.createGroup(p, positions, ms);
      parent.add(children[k]);
    };
    Object.keys(this.crossSections).map((k) => this._addIlpGroup(k));

    // This function is used by createIlpsGroup() in src/cross-section/area.ts.
    // This function is used by removeCrossSection() in src/cross-section/area.ts.
    this._removeIlpGroup = (k: string) => {
      parent.remove(children[k]);
      disposeGroup(children[k]);
      delete children[k];
    };

    // This function is used by setGUI() in src/cross-section/area.ts.
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
   * @param name - The area folder name used in the GUI.
   */
  setGUI(gui: GUI, name = "Area") {
    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder.add(this, "thickness", 0, 1, 0.0001);
    Object.entries(this.crossSections).forEach(([k, cs]) => {
      // _updateIlpGroup: Set it in advance using createIlpsGroup() in src/cross-section/area.ts.
      cs.ilp.setGUI(folder, `intersection loops${k}`, () => {
        this.updateCrossSection(k, cs.plane);
      });
    });
  }

  // TODO: test
  /**
   * Create a plane to intersection loop picker converter.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param indices - The results of geometry.getIndex().
   */
  static createPlaneToIlp(
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
  addCrossSection(key: string, plane: FreePlane | VerticalPlane) {
    this.crossSections[key] = { plane, ilp: this.planeToIlp(plane) };
    this._addIlpGroup(key); // Set it in advance using createIlpsGroup() in src/cross-section/area.ts.
  }

  // TODO: test
  /**
   * Remove a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  removeCrossSection(key: string) {
    this._removeIlpGroup(key); // Set it in advance using createIlpsGroup() in src/cross-section/area.ts.
    delete this.crossSections[key];
  }

  // TODO: test
  /**
   * Update a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  updateCrossSection(key: string, plane: FreePlane | VerticalPlane) {
    this.removeCrossSection(key);
    this.addCrossSection(key, plane);
  }

  /**
   * Returns a new area with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): Area {
    return new Area().copy(this);
  }

  /**
   * Copies the values of the given area to this instance.
   *
   * @param source - The area to copy.
   * @return  A reference to this area.
   */
  copy(source: Area): this {
    this.crossSections = objectMap(source.crossSections, (v) => ({
      plane: v.plane.clone(),
      ilp: v.ilp.clone(),
    }));
    this.thickness = source.thickness;

    return this;
  }

  /**
   * Serializes the area into JSON.
   *
   * @return  A JSON object representing the serialized area.
   */
  toJSON(): AreaJSON {
    return {
      crossSections: objectMap(this.crossSections, (v) => ({
        plane: v.plane.toJSON(),
        ilp: v.ilp.toJSON(),
      })),
      thickness: this.thickness,
    };
  }

  /**
   * Deserializes the area from the given JSON.
   *
   * @param json - The JSON holding the serialized area.
   * @return  A reference to this area.
   */
  fromJSON(json: AreaJSON): this {
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
    this.thickness = json.thickness;

    return this;
  }
}

/**
 * The {@link Area} JSON interface.
 */
export interface AreaJSON {
  /** {@link Area#crossSections} */
  crossSections: {
    [k: string]: {
      plane: FreePlaneJSON | VerticalPlaneJSON;
      ilp: IntersectionLoopPickerJSON;
    };
  };
  /** {@link Area#thickness} */
  thickness: number;
}
