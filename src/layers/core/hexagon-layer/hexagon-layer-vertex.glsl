// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#define SHADER_NAME hexagon-layer-vertex-shader

// #pragma glslify: mercatorProject = require(deck.gl/shaderlib/mercator-project)
// #pragma glslify: getLightWeight = require(../../../shaderlib/light-weight)

attribute vec3 positions;
attribute vec3 normals;

attribute vec2 instancePositions;
attribute float instanceElevations;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldInverseTransposeMatrix;

uniform float radius;
uniform float opacity;
uniform float angle;
uniform float elevation;

uniform float renderPickingBuffer;
uniform vec3 selected;
uniform float enablePointLight;

varying vec4 vColor;

const vec3 ambientColor = vec3(0.8, 0.8, 0.8);
const vec3 pointLocation = vec3(1.5, 1.5, 5.);
const vec3 pointColor = vec3(0.7, 0.7, 0.7);
const vec3 pointSpecularColor = vec3(0.6, 0.6, 0.6);
const float shininess = 5.;

void main(void) {

  mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec4 rotatedPosition = vec4(vec2(rotationMatrix * positions.xz * radius), 0., 1.);

  vec2 pos = project_position(instancePositions.xy);

  vec4 centroidPosition = vec4(
    pos.xy,
    project_scale(instanceElevations * (positions.y + 0.5)) + 1.,
    0.
  );

  vec3 p = project_position(centroidPosition.xyz + rotatedPosition.xyz);

  gl_Position = project_to_clipspace(projectionMatrix * vec4(p, 1.));

  vec4 color = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;
  vec4 pickingColor = vec4(instancePickingColors / 255., 1.);

  vColor = mix(
    color,
    pickingColor,
    renderPickingBuffer
  );

  /*
  vec3 lightWeighting = getLightWeight(
    viewMatrix,
    worldMatrix,
    worldInverseTransposeMatrix,
    positions,
    normals,
    ambientColor,
    pointLocation,
    pointColor,
    pointSpecularColor,
    shininess
  );

  vColor = vec4(
    mix(
      mix(vec3(1), lightWeighting, enablePointLight),
      vec3(1),
      renderPickingBuffer
    ) * color.rgb,
    color.a * opacity
  );
  */
}
