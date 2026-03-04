uniform float uTime;
uniform float uMouse;
uniform float uStrength;

varying vec2 vUv;

void main() {
	vUv = uv;
	vec3 pos = position;
	float dist = distance(uv, uMouse);
	pos.z += sin(dist * 10.0 - uTime * 2.0) * uStrength * (1.0 - smoothstep(0.0, 0.5, dist));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}