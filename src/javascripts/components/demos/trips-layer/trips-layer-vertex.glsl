// Copyright (c) 2015 Uber Technologies, Inc.
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

#define SHADER_NAME trips-layer-vertex-shader

#pragma glslify: project = require(../../../../../node_modules/deck.gl/shaderlib/project)

attribute vec3 positions;
attribute vec3 colors;

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;
uniform float opacity;
uniform float currentTime;
uniform float trailLength;

varying float vTime;
varying vec4 vColor;

void main(void) {
  vec2 pt = project(positions.xy);

  gl_Position = projectionMatrix * vec4(pt, 1.0, 1.0);

  vColor = vec4(colors / 255.0, opacity);
  vTime = 1.0 - (currentTime - positions.z) / trailLength;
}
