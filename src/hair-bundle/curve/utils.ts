import * as THREE from "three";

/**
 * Whether the index (including the min and the max) is invalid.
 *
 * @param index - The index of this.cps.
 * @param min - The min of the index.
 * @param max - The max of the index.
 */
export function isInvalidIndex(
  index: number,
  min: number,
  max: number
): boolean {
  if (!Number.isInteger(index)) {
    console.error(`the index(${index}) is not integer.`);
    return true;
  }
  if (!Number.isInteger(min)) {
    console.error(`the min(${min}) is not integer.`);
    return true;
  }
  if (!Number.isInteger(max)) {
    console.error(`the max(${max}) is not integer.`);
    return true;
  }
  if (index < min || index > max) {
    console.error(`the index(${index}) is out of range [${min},${max}].`);
    return true;
  }
  return false;
}

/**
 * Get the mean vector of v1 and v2.
 * v1, v2 and the return value must have a common type (THREE.Vector3 or THREE.Vector2).
 */
export function mean<TVector extends THREE.Vector3 | THREE.Vector2>(
  v1: TVector,
  v2: TVector
): TVector {
  if (v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3) {
    return v1.clone().add(v2).divideScalar(2) as TVector;
  }
  if (v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2) {
    return v1.clone().add(v2).divideScalar(2) as TVector;
  }
  console.error(`\
!(v1 instanceof THREE.Vector3 && v2 instanceof THREE.Vector3)
&& !(v1 instanceof THREE.Vector2 && v2 instanceof THREE.Vector2)
- v1: ${JSON.stringify(v1)}
- v2: ${JSON.stringify(v2)}
`);
  return v1;
}
