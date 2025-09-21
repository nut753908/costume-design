import type { Controller, GUI } from "lil-gui";
import { deleteFolder } from "src/main/gui";
import { disposeGroup } from "src/main/utils";
import type { Materials } from "src/material/materials";
import * as THREE from "three";
import type { FreePlane } from "../plane/free-plane";
import type { VerticalPlane } from "../plane/vertical-plane";
import {
  IntersectionLoop,
  type IntersectionLoopJSON,
} from "./intersection-loop";

/**
 * The intersection loop picker.
 *
 * ```js
 * import { EdgeIntersection } from "./src/cross-section/intersection/edge-intersection";
 * import { VertexIntersection } from "./src/cross-section/intersection/vertex-intersection";
 * import { IntersectionLoop } from "./src/cross-section/intersection/intersection-loop";
 * import { IntersectionLoopPicker } from "./src/cross-section/intersection/intersection-loop-picker";
 * const intersections = [
 *   new EdgeIntersection( 1, 3, 0.5, true ),
 *   new EdgeIntersection( 0, 3, 0.75, true ),
 *   new VertexIntersection( 2, true ),
 * ];
 * const intersectionLoop = new IntersectionLoop( intersections, true );
 * const intersectionLoopPicker = new IntersectionLoopPicker( [ intersectionLoop ], "all", [] );
 * ```
 */
export class IntersectionLoopPicker {
  /**
   * The intersection loops.
   */
  intersectionLoops: IntersectionLoop[];

  /**
   * The method for selecting intersection loops.
   */
  selection: "all" | "including plane" | "excluding plane" | "some";

  /**
   * The specified indices of the intersection loops.
   * This is only used if the selection is "some".
   */
  indices: number[];

  /**
   * Secret field.
   * This function is used by setGUI() in src/cross-section/intersection/intersection-loop-picker.ts.
   * Set it in advance using createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
   */
  _updateGroup: () => void;

  /**
   * Constructs a new intersection loop picker.
   *
   * @param intersectionLoops - {@link IntersectionLoopPicker#intersectionLoops}
   * @param selection - {@link IntersectionLoopPicker#selection}
   * @param indices - {@link IntersectionLoopPicker#indices}
   */
  constructor(
    intersectionLoops: IntersectionLoop[] = [],
    selection: IntersectionLoopPicker["selection"] = "all",
    indices: number[] = []
  ) {
    this.intersectionLoops = intersectionLoops;
    this.selection = selection;
    this.indices = indices;
    this._updateGroup = () => {};
  }

  // TODO: test
  /**
   * Create the group.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param ms - The materials.
   */
  createGroup(
    plane: FreePlane | VerticalPlane,
    positions: THREE.BufferAttribute,
    ms: Materials
  ): THREE.Group {
    const group = new THREE.Group();

    // This function is used by setGUI() in src/cross-section/intersection/intersection-loop-picker.ts.
    this._updateGroup = () => {
      disposeGroup(group);
      group.clear();
      this.getSelectedIntersectionLoops(plane, positions).forEach((il) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(il.getPoints(positions));
        group.add(new THREE.Points(geometry, ms.points.points));
        group.add(new THREE.Line(geometry, ms.points.line));
      });
    };
    this._updateGroup();

    return group;
  }

  // TODO: test
  /**
   * Set GUI.
   *
   * @param name - The intersection loop picker folder name used in the GUI.
   * @param key - The key for the callback.
   * @param updateCallback - The callback that is invoked after updating intersection loop picker.
   */
  setGUI(
    gui: GUI,
    name = "IntersectionLoopPicker",
    key = "IntersectionLoopPicker",
    updateCallback = (_key: string) => {}
  ) {
    const ils = this;

    const checklist = Object.fromEntries(
      [...Array(ils.intersectionLoops.length)].map((_, i) => [i, false])
    );
    ils.indices
      .filter((i) => i < ils.intersectionLoops.length)
      .forEach((i) => {
        checklist[i] = true;
      });

    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder
      .add(ils, "selection")
      .options(IntersectionLoopPicker.getSelections())
      .onChange(uS);
    // TODO: support for changing intersectionLoops.length
    const iFolder = folder.addFolder("indices");
    Object.keys(checklist).map((i) => iFolder.add(checklist, i).onChange(uI));
    updateHidden();

    function updateHidden() {
      ils.selection === "some" ? iFolder.show() : iFolder.hide();
    }
    function uS() /* updateSelection */ {
      updateHidden();
      ils._updateGroup(); // Set it in advance using createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
      updateCallback(key);
    }
    function uI(e: {
      object: object;
      property: string;
      value: boolean;
      controller: Controller;
    }) /* updateIndices */ {
      const i = ils.indices.indexOf(Number(e.property));
      if (e.value) {
        if (i === -1) ils.indices.push(Number(e.property));
      } else {
        if (i !== -1) ils.indices.splice(i, 1);
      }
      ils._updateGroup(); // Set it in advance using createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
      updateCallback(key);
    }
  }

  /**
   * Get the strings that can be used as a selection.
   */
  static getSelections(): IntersectionLoopPicker["selection"][] {
    return ["all", "including plane", "excluding plane", "some"];
  }

  /**
   * Get the selected intersection loops as the selection.
   *
   * @param positions - The results of geometry.getAttribute("position").
   */
  getSelectedIntersectionLoops(
    plane: FreePlane | VerticalPlane,
    positions: THREE.BufferAttribute
  ): IntersectionLoop[] {
    const list = this.intersectionLoops;
    switch (this.selection) {
      case "all":
        return list;
      case "including plane":
        return list.filter((v) => v.inLoop(plane, positions));
      case "excluding plane":
        return list.filter((v) => !v.inLoop(plane, positions));
      case "some":
        return this.indices.filter((i) => i < list.length).map((i) => list[i]);
    }
  }

  /**
   * Returns a new intersection loop picker with copied values from this instance.
   *
   * @return  A clone of this instance.
   */
  clone(): IntersectionLoopPicker {
    return new IntersectionLoopPicker().copy(this);
  }

  /**
   * Copies the values of the given intersection loop picker to this instance.
   *
   * @param source - The intersection loop picker to copy.
   * @return  A reference to this intersection loop picker.
   */
  copy(source: IntersectionLoopPicker): this {
    this.intersectionLoops = source.intersectionLoops.map((il) => il.clone());
    this.selection = source.selection;
    this.indices = source.indices;

    return this;
  }

  /**
   * Serializes the intersection loop picker into JSON.
   *
   * @return  A JSON object representing the serialized intersection loop picker.
   */
  toJSON(): IntersectionLoopPickerJSON {
    return {
      intersectionLoops: this.intersectionLoops.map((il) => il.toJSON()),
      selection: this.selection,
      indices: this.indices,
    };
  }

  /**
   * Deserializes the intersection loop picker from the given JSON.
   *
   * @param json - The JSON holding the serialized intersection loop picker.
   * @return  A reference to this intersection loop picker.
   */
  fromJSON(json: IntersectionLoopPickerJSON): this {
    this.intersectionLoops = json.intersectionLoops.map((il) =>
      new IntersectionLoop().fromJSON(il)
    );
    this.selection = json.selection;
    this.indices = json.indices;

    return this;
  }
}

/**
 * The {@link IntersectionLoopPicker} JSON interface.
 */
export interface IntersectionLoopPickerJSON {
  /** {@link IntersectionLoopPicker#intersectionLoops} */
  intersectionLoops: IntersectionLoopJSON[];
  /** {@link IntersectionLoopPicker#selection} */
  selection: IntersectionLoopPicker["selection"];
  /** {@link IntersectionLoopPicker#indices} */
  indices: number[];
}
