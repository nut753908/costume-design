import * as THREE from "three";

const frustumSize = 2;

export function createCamera(): THREE.OrthographicCamera {
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.OrthographicCamera(
    -(frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000,
  );
  camera.position.z = 500;
  return camera;
}

export function updateCamera(camera: THREE.OrthographicCamera) {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -(frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.updateProjectionMatrix();
}
