import * as THREE from "three";

export function mean<TVector extends THREE.Vector3 | THREE.Vector2>(
  v1: TVector,
  v2: TVector,
): TVector {
  if (v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3) {
    return v1.clone().add(v2).divideScalar(2) as TVector;
  } else if (v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2) {
    return v1.clone().add(v2).divideScalar(2) as TVector;
  } else {
    console.error(`\
!(v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3)
&& !(v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2)
- v1: ${JSON.stringify(v1)}
- v2: ${JSON.stringify(v2)}
`);
    return v1 as TVector;
  }
}
