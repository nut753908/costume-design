import type { GUI } from "lil-gui";
import * as THREE from "three";

export function createAxesHelper(gui: GUI): THREE.AxesHelper {
  const obj = { size: 1 };
  const helper = new THREE.AxesHelper(obj.size);
  {
    const folder = gui.addFolder("THREE.AxesHelper").close();
    folder.add(helper, "visible");
    folder.add(obj, "size").step(0.01).onChange(uS);

    function uS() /* updateSize */ {
      const vertices = [
        [0, 0, 0, obj.size, 0, 0],
        [0, 0, 0, 0, obj.size, 0],
        [0, 0, 0, 0, 0, obj.size],
      ].flat();
      helper.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      );
    }
  }
  return helper;
}
