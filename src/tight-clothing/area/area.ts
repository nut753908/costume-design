import type GUI from "lil-gui";
import { deleteFolder } from "src/common/gui";
import type { Materials } from "src/common/material/materials";
import { disposeGroup, objectMap } from "src/common/utils";
import * as THREE from "three";
import type { Edge } from "../centerline/edge";
import { createAllEdges } from "../centerline/edges";
import { convertToLists, createIndicesMap } from "../intersection/indices";
import type { IntersectionLoop } from "../intersection/intersection-loop";
import {
  IntersectionLoopPicker,
  type IntersectionLoopPickerJSON,
} from "../intersection/intersection-loop-picker";
import {
  createAllIntersectionLoops,
  sortIntersectionLoops,
} from "../intersection/intersection-loops";
import { createAllIntersections } from "../intersection/intersections";
import { FreePlane, type FreePlaneJSON } from "../plane/free-plane";
import { VerticalPlane, type VerticalPlaneJSON } from "../plane/vertical-plane";
import { cutGeometryUsingIlsWithinArea } from "./cut";
import { extrudeGeometry } from "./extrude";
import { findGeometryWithinArea } from "./find";

/**
 * The area divided by cross sections.
 *
 * ```js
 * import { Area } from "./area";
 * const area = new Area();
 * ```
 */
export class Area {
  /**
   * The indices obj.
   */
  indicesObj: {
    nPolygonIndices: number[][];
    allEdges: Edge[];
    indicesMap: { [k: string]: number[][] };
    planeToAllIls: (plane: FreePlane | VerticalPlane) => IntersectionLoop[];
  };

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
   * This function is used by createIlpsGroup() in ./area.
   * This function is used by addCrossSection() in ./area.
   * Set it in advance using createIlpsGroup() in ./area.
   */
  _addIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by removeCrossSection() in ./area.
   * Set it in advance using createIlpsGroup() in ./area.
   */
  _removeIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by updateCrossSection() in ./area.
   * Set it in advance using createIlpsGroup() in ./area.
   */
  _updateIlpGroup: (k: string) => void;

  /**
   * Secret field.
   * This function is used by createAreaGroup() in ./area.
   * This function is used by setGUI() in ./area.
   * This function is used by addCrossSection() in ./area.
   * This function is used by removeCrossSection() in ./area.
   * This function is used by updateCrossSection() in ./area.
   * Set it in advance using createAreaGroup() in ./area.
   */
  _updateAreaGroup: () => void;

  /**
   * Secret field.
   * This function is used by setGUI() in ./area.
   * This function is used by addCrossSection() in ./area.
   * This function is used by removeCrossSection() in ./area.
   * This function is used by updateCrossSection() in ./area.
   * Set it in advance using setGUI() in ./area.
   */
  _updateGUI: () => void;

  /**
   * Constructs a new area.
   *
   * @param indicesObj - {@link Area#indicesObj}
   * @param crossSections - {@link Area#crossSections}
   * @param thickness - {@link Area#thickness}
   */
  constructor(
    indicesObj: Area["indicesObj"] = {
      nPolygonIndices: [],
      allEdges: [],
      indicesMap: {},
      planeToAllIls: () => [],
    },
    crossSections: Area["crossSections"] = {},
    thickness = 0.001
  ) {
    this.indicesObj = indicesObj;
    this.crossSections = crossSections;
    this.thickness = thickness;
    this._addIlpGroup = () => {};
    this._removeIlpGroup = () => {};
    this._updateIlpGroup = () => {};
    this._updateAreaGroup = () => {};
    this._updateGUI = () => {};
  }

  /**
   * Create area geometry.
   *
   * @param bodyGeometry - The body geometry.
   */
  createAreaGroup(bodyGeometry: THREE.BufferGeometry, group: THREE.Group) {
    // This function is used by updateCrossSection() in ./area.
    this._updateAreaGroup = () => {
      const obj = cutGeometryUsingIlsWithinArea(bodyGeometry, this);
      const foundGeometry = findGeometryWithinArea(obj.geometry, obj.area);
      const extrudedGeometry = extrudeGeometry(foundGeometry, this.thickness);

      if (
        "geometry" in group.children[0] &&
        group.children[0].geometry instanceof THREE.BufferGeometry
      ) {
        group.children[0].geometry.dispose();
        group.children[0].geometry = extrudedGeometry;
      }
    };
    this._updateAreaGroup();
  }

  /**
   * Create the intersection loop pickers group.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param ms - The materials.
   */
  createIlpsGroup(
    positions: THREE.Float32BufferAttribute,
    ms: Materials
  ): THREE.Group {
    const parent = new THREE.Group();
    const children: { [k: string]: THREE.Group } = {};

    // This function is used by createIlpsGroup() in ./area.
    // This function is used by addCrossSection() in ./area.
    this._addIlpGroup = (k: string) => {
      const p = this.crossSections[k].plane;
      const ilp = this.crossSections[k].ilp;
      children[k] = ilp.createGroup(p, positions, ms);
      parent.add(children[k]);
    };
    Object.keys(this.crossSections).map((k) => this._addIlpGroup(k));

    // This function is used by removeCrossSection() in ./area.
    this._removeIlpGroup = (k: string) => {
      parent.remove(children[k]);
      disposeGroup(children[k]);
      delete children[k];
    };

    // This function is used by updateCrossSection() in ./area.
    this._updateIlpGroup = (k: string) => {
      this._removeIlpGroup(k);
      this._addIlpGroup(k);
    };

    return parent;
  }

  /**
   * Set GUI.
   */
  setGUI(gui: GUI) {
    const area = this;

    // This function is used by setGUI() in ./area.
    // This function is used by addCrossSection() in ./area.
    // This function is used by removeCrossSection() in ./area.
    // This function is used by updateCrossSection() in ./area.
    area._updateGUI = () => {
      deleteFolder(gui, "Area");
      const folder = gui.addFolder("Area");
      folder.add(area, "thickness", 0, 0.01, 0.0001).onChange(uT);
      Object.entries(area.crossSections).forEach(([k, cs]) => {
        cs.ilp.setGUI(folder, `intersection loops${k}`, area._updateAreaGroup); // Set it in advance using createGroup() in ../intersection/intersection-loop-picker.
      });

      function uT() /* updateThickness */ {
        area._updateAreaGroup(); // Set it in advance using createAreaGroup() in ./area.
      }
    };
    area._updateGUI();
  }

  /**
   * Create an indices obj.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param indices - The results of geometry.getIndex().
   */
  static createIndicesObj(
    positions: THREE.Float32BufferAttribute,
    indices: THREE.Uint16BufferAttribute
  ): Area["indicesObj"] {
    const nPolygonIndices = convertToLists(indices, 3);
    const allEdges = createAllEdges(nPolygonIndices);
    const indicesMap = createIndicesMap(nPolygonIndices);
    const planeToAllIls = (plane: FreePlane | VerticalPlane) => {
      const allIntersections = createAllIntersections(
        plane,
        allEdges,
        positions
      );
      const allIls = createAllIntersectionLoops(indicesMap, allIntersections);
      return sortIntersectionLoops(allIls, positions);
    };
    return {
      nPolygonIndices,
      allEdges,
      indicesMap,
      planeToAllIls,
    };
  }

  /**
   * Add a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  addCrossSection(key: string, plane: FreePlane | VerticalPlane) {
    this.crossSections[key] = {
      plane,
      ilp: new IntersectionLoopPicker(
        this.indicesObj.planeToAllIls(plane),
        plane.defaultOption
      ),
    };
    this._updateGUI(); // Set it in advance using setGUI() in ./area.
    this._addIlpGroup(key); // Set it in advance using createIlpsGroup() in ./area.
    this._updateAreaGroup(); // Set it in advance using createAreaGroup() in ./area.
  }

  /**
   * Remove a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  removeCrossSection(key: string) {
    delete this.crossSections[key];
    this._updateGUI(); // Set it in advance using setGUI() in ./area.
    this._removeIlpGroup(key); // Set it in advance using createIlpsGroup() in ./area.
    this._updateAreaGroup(); // Set it in advance using createAreaGroup() in ./area.
  }

  /**
   * Update a cross section.
   *
   * @param key - The key in this.crossSections.
   */
  updateCrossSection(key: string, plane: FreePlane | VerticalPlane) {
    this.crossSections[key].plane = plane;
    this.crossSections[key].ilp.intersectionLoops =
      this.indicesObj.planeToAllIls(plane);
    this._updateGUI(); // Set it in advance using setGUI() in ./area.
    this._updateIlpGroup(key); // Set it in advance using createIlpsGroup() in ./area.
    this._updateAreaGroup(); // Set it in advance using createAreaGroup() in ./area.
  }

  /**
   * Returns a new area with copied values from this instance.
   * (NOTE: indicesObj and secret fields are not supported.)
   *
   * @return  A clone of this instance.
   */
  clone(): Area {
    return new Area().copy(this);
  }

  /**
   * Copies the values of the given area to this instance.
   * (NOTE: indicesObj and secret fields are not supported.)
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
   * (NOTE: indicesObj and secret fields are not supported.)
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
   * (NOTE: indicesObj and secret fields are not supported.)
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
