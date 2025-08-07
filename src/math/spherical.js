import * as THREE from "three";

/**
 * Serializes the spherical into JSON.
 *
 * @param {THREE.Spherical} s
 * @return {Object} A JSON object representing the serialized spherical.
 */
export function sphericalToJSON(s) {
  const data = {};

  data.radius = s.radius;
  data.phi = s.phi;
  data.theta = s.theta;

  return data;
}

/**
 * Deserializes the spherical from the given JSON.
 *
 * @param {THREE.Spherical} s
 * @param {Object} json - The JSON holding the serialized spherical.
 */
export function sphericalFromJSON(s, json) {
  s.set(json.radius, json.phi, json.theta);
}
