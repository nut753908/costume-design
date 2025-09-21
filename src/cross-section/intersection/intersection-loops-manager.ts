import { objectMap } from "src/main/utils";
import {
  IntersectionLoops,
  type IntersectionLoopsJSON,
} from "../intersection/intersection-loops";

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
   * The intersection loops list.
   */
  intersectionLoopsList: { [k: string]: IntersectionLoops };

  /**
   * Constructs a new intersection loops manager.
   *
   * @param intersectionLoopsList - {@link IntersectionLoopsManager#intersectionLoopsList}
   */
  constructor(intersectionLoopsList: { [k: string]: IntersectionLoops } = {}) {
    this.intersectionLoopsList = intersectionLoopsList;
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
  /** {@link IntersectionLoopsManager#intersectionLoopsList} */
  intersectionLoopsList: { [k: string]: IntersectionLoopsJSON };
}
