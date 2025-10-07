import type { GUI } from "lil-gui";
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
   * The option for picking intersection loops.
   */
  option: "all" | "including plane" | "excluding plane" | "some";

  /**
   * The specified indices of the intersection loops.
   * This is only used if the option is "some".
   */
  indices: number[];

  /**
   * Secret field.
   * This function is used by createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
   * This function is used by setGUI() in src/cross-section/intersection/intersection-loop-picker.ts.
   * Set it in advance using createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
   */
  _updateGroup: () => void;

  /**
   * Constructs a new intersection loop picker.
   *
   * @param intersectionLoops - {@link IntersectionLoopPicker#intersectionLoops}
   * @param option - {@link IntersectionLoopPicker#option}
   * @param indices - {@link IntersectionLoopPicker#indices}
   */
  constructor(
    intersectionLoops: IntersectionLoop[] = [],
    option: IntersectionLoopPicker["option"] = "all",
    indices: number[] = []
  ) {
    this.intersectionLoops = intersectionLoops;
    this.option = option;
    this.indices = indices;
    this._updateGroup = () => {};
  }

  /**
   * Create the group.
   *
   * @param positions - The results of geometry.getAttribute("position").
   * @param ms - The materials.
   */
  createGroup(
    plane: FreePlane | VerticalPlane,
    positions: THREE.Float32BufferAttribute,
    ms: Materials
  ): THREE.Group {
    const group = new THREE.Group();

    // This function is used by createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
    // This function is used by setGUI() in src/cross-section/intersection/intersection-loop-picker.ts.
    this._updateGroup = () => {
      disposeGroup(group);
      group.clear();
      this.getIlIndices(plane, positions)
        .map((i) => this.intersectionLoops[i])
        .forEach((il) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setFromPoints(il.getPoints(positions));
          group.add(new THREE.Points(geometry, ms.line.points));
          group.add(new THREE.Line(geometry, ms.line.line));
        });
    };
    this._updateGroup();

    return group;
  }

  /**
   * Set GUI.
   *
   * @param name - The intersection loop picker folder name used in the GUI.
   * @param updateCallback - The callback that is invoked after updating ilp.
   */
  setGUI(gui: GUI, name = "IntersectionLoopPicker", updateCallback = () => {}) {
    const ilp = this;

    const checklist = Object.fromEntries(
      [...Array(ilp.intersectionLoops.length)].map((_, i) => [i, false])
    );
    ilp.indices
      .filter((i) => i < ilp.intersectionLoops.length)
      .forEach((i) => {
        checklist[i] = true;
      });

    deleteFolder(gui, name);
    const folder = gui.addFolder(name);
    folder
      .add(ilp, "option")
      .options(IntersectionLoopPicker.getOptions())
      .onChange(uS);
    const iFolder = folder.addFolder("indices");
    Object.keys(checklist).map((i) =>
      iFolder.add(checklist, i).onChange(() => uI(i))
    );
    updateHidden();

    function updateHidden() {
      ilp.option === "some" ? iFolder.show() : iFolder.hide();
    }
    function uS() /* updateSelection */ {
      updateHidden();
      ilp._updateGroup(); // Set it in advance using createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
      updateCallback();
    }
    function uI(i: string) /* updateIndices */ {
      const index = ilp.indices.indexOf(Number(i));
      if (checklist[i]) {
        if (index === -1) ilp.indices.push(Number(i));
      } else {
        if (index !== -1) ilp.indices.splice(index, 1);
      }
      ilp._updateGroup(); // Set it in advance using createGroup() in src/cross-section/intersection/intersection-loop-picker.ts.
      updateCallback();
    }
  }

  /**
   * Get the strings that can be used as a option.
   */
  static getOptions(): IntersectionLoopPicker["option"][] {
    return ["all", "including plane", "excluding plane", "some"];
  }

  /**
   * Get the intersection loop indices.
   *
   * @param positions - The results of geometry.getAttribute("position").
   */
  getIlIndices(
    plane: FreePlane | VerticalPlane,
    positions: THREE.Float32BufferAttribute
  ): number[] {
    const list = this.intersectionLoops;
    switch (this.option) {
      case "all":
        return list.map((_, i) => i);
      case "including plane":
        return list
          .map<[boolean, number]>((v, i) => [v.inLoop(plane, positions), i])
          .filter((v) => v[0])
          .map((v) => v[1]);
      case "excluding plane":
        return list
          .map<[boolean, number]>((v, i) => [!v.inLoop(plane, positions), i])
          .filter((v) => v[0])
          .map((v) => v[1]);
      case "some":
        return this.indices.filter((i) => i < list.length);
    }
  }

  /**
   * Returns a new intersection loop picker with copied values from this instance.
   * (NOTE: Secret fields are not supported.)
   *
   * @return  A clone of this instance.
   */
  clone(): IntersectionLoopPicker {
    return new IntersectionLoopPicker().copy(this);
  }

  /**
   * Copies the values of the given intersection loop picker to this instance.
   * (NOTE: Secret fields are not supported.)
   *
   * @param source - The intersection loop picker to copy.
   * @return  A reference to this intersection loop picker.
   */
  copy(source: IntersectionLoopPicker): this {
    this.intersectionLoops = source.intersectionLoops.map((il) => il.clone());
    this.option = source.option;
    this.indices = source.indices;

    return this;
  }

  /**
   * Serializes the intersection loop picker into JSON.
   * (NOTE: Secret fields are not supported.)
   *
   * @return  A JSON object representing the serialized intersection loop picker.
   */
  toJSON(): IntersectionLoopPickerJSON {
    return {
      intersectionLoops: this.intersectionLoops.map((il) => il.toJSON()),
      option: this.option,
      indices: this.indices,
    };
  }

  /**
   * Deserializes the intersection loop picker from the given JSON.
   * (NOTE: Secret fields are not supported.)
   *
   * @param json - The JSON holding the serialized intersection loop picker.
   * @return  A reference to this intersection loop picker.
   */
  fromJSON(json: IntersectionLoopPickerJSON): this {
    this.intersectionLoops = json.intersectionLoops.map((il) =>
      new IntersectionLoop().fromJSON(il)
    );
    this.option = json.option;
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
  /** {@link IntersectionLoopPicker#option} */
  option: IntersectionLoopPicker["option"];
  /** {@link IntersectionLoopPicker#indices} */
  indices: number[];
}
