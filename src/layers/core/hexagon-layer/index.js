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
/* eslint-disable func-style */

import {Layer} from '../../../lib';
import {assembleShaders} from '../../../shader-utils';
import {GL, Model, CylinderGeometry} from 'luma.gl';

const glslify = require('glslify');

const DEFAULT_COLOR = [150, 0, 0, 255];

const defaultGetCentroid = x => x.centroid;
const defaultGetElevation = x => x.elevation || 0;
const defaultGetColor = x => x.color || DEFAULT_COLOR;
const defaultGetVertices = x => x.vertices;

export default class HexagonLayer extends Layer {

  static layerName = 'HexagonLayer';

  /**
   * @classdesc
   * HexagonLayer
   *
   * @class
   * @param {object} opts
   *
   * @param {number} opts.dotRadius - hexagon radius
   * @param {number} opts.elevation - hexagon height
   *
   * @param {function} opts.onHexagonHovered(index, e) - popup selected index
   * @param {function} opts.onHexagonClicked(index, e) - popup selected index
   */
  constructor({
    vertices,
    dotRadius = 10,
    elevation = 100,
    enable3d = false,
    opacity = 0.6,
    getCentroid = defaultGetCentroid,
    getElevation = defaultGetElevation,
    getColor = defaultGetColor,
    getVertices = defaultGetVertices,
    ...props
  } = {}) {
    super({
      dotRadius,
      elevation,
      enable3d,
      opacity,
      vertices,
      getCentroid,
      getElevation,
      getColor,
      getVertices,
      ...props
    });
  }

  initializeState() {
    const {gl} = this.context;
    const {attributeManager} = this.state;

    this.setState({model: this.getModel(gl)});

    attributeManager.addInstanced({
      instancePositions: {size: 2, 0: 'x', 1: 'y'},
      instanceElevations: {size: 1, 0: 'z'},
      instanceColors: {size: 4, 0: 'red', 1: 'green', 2: 'blue', 3: 'alpha'}
    }, {
      instancePositions: {update: this.calculateInstancePositions},
      instanceElevations: {update: this.calculateInstanceElevations},
      instanceColors: {
        type: GL.UNSIGNED_BYTE,
        size: 4,
        update: this.calculateInstanceColors
      }
    });
  }

  updateState({oldProps, props, changeFlags}) {

    const {dataChanged, viewportChanged} = changeFlags;
    const {attributeManager} = this.state;

    if (dataChanged || viewportChanged) {
      this.calculateRadiusAndAngle();
    }

    if (dataChanged) {
      attributeManager.invalidateAll();
    }

    if (oldProps.opacity !== props.opacity ||
        oldProps.enablePointLight !== props.enablePointLight) {
      this.setUniforms({
        opacity: props.opacity,
        enablePointLight: props.enable3d ? 1 : 0
      });
    }
  }

  getModel(gl) {
    const geometry = new CylinderGeometry({
      radius: 1,
      topRadius: 1,
      bottomRadius: 1,
      topCap: true,
      bottomCap: true,
      height: 1,
      nradial: 6,
      nvertical: 1
    });

    return new Model({
      gl,
      id: this.props.id,
      ...assembleShaders(gl, {
        vs: glslify('./hexagon-layer-vertex.glsl'),
        fs: glslify('./hexagon-layer-fragment.glsl')
      }),
      geometry,
      isInstanced: true
    });
  }

  calculateInstancePositions(attribute) {
    const {data, getCentroid} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const hexagon of data) {
      const centroid = getCentroid(hexagon);
      value[i + 0] = centroid[0];
      value[i + 1] = centroid[1];
      i += size;
    }
  }

  calculateInstanceElevations(attribute) {
    const {data, getElevation} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const hexagon of data) {
      const elevation = getElevation(hexagon);
      value[i + 0] = elevation;
      i += size;
    }
  }

  calculateInstanceColors(attribute) {
    const {data, getColor} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const hexagon of data) {
      const color = getColor(hexagon);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? DEFAULT_COLOR[3] : color[3];
      i += size;
    }
  }

  // TODO this is the only place that uses hexagon vertices
  // consider move radius and angle calculation to the shader
  calculateRadiusAndAngle() {
    const {data, getVertices} = this.props;
    if (!data || data.length === 0) {
      return;
    }

    // Either get vertices from prop, or from first hexagon
    let {vertices} = this.props;
    if (!vertices) {
      const firstHexagon = this.getFirstObject();
      vertices = getVertices(firstHexagon);
    }
    const vertex0 = vertices[0];
    const vertex3 = vertices[3];

    // transform to space coordinates
    const [x0, y0] = this.project([vertex0[0], vertex0[1]]);
    const [x3, y3] = this.project([vertex3[0], vertex3[1]]);

    // distance between two close centroids
    const dx = x0 - x3;
    const dy = y0 - y3;
    const dxy = Math.sqrt(dx * dx + dy * dy);

    this.setUniforms({
      // Calculate angle that the perpendicular hexagon vertex axis is tilted
      angle: Math.acos(dx / dxy) * -Math.sign(dy) + Math.PI / 2,
      // Allow user to fine tune radius
      radius: dxy / 2 * Math.min(1, this.props.dotRadius)
    });
  }
}
