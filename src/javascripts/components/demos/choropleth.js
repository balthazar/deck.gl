import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay, ChoroplethLayer} from 'deck.gl';

import {readableInteger} from '../../utils/format-utils';
import {MAPBOX_STYLES} from '../../constants/defaults';

const COLORS = [
  [153,213,148],
  [254,224,139],
  [213,62,79]
];

const TYPES = [
  'Residential',
  'Public',
  'Commercial'
]

export default class ChoroplethDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static get data() {
    return {
      url: 'data/choropleth-data.txt',
      worker: 'workers/choropleth-data-decoder.js'
    };
  }

  static get parameters() {
    return {};
  }

  static get viewport() {
    return {
      mapStyle: MAPBOX_STYLES.LIGHT,
      longitude: 139.741,
      latitude: 35.686,
      zoom: 14,
      pitch: 0,
      bearing: 0
    };
  }

  static renderInfo(meta) {
    return (
      <div>
        <h3>Building Types In Tokyo</h3>
        <p>
        {
          COLORS.map((c, i) => (
            <div key={i}>
              <div className="legend" style={{marginRight: '12px', background: `rgb(${c.join(',')})`}} />
              { TYPES[i] }
            </div>
          ))
        }
        </p>
        <div className="layout">
          <div className="stat col-1-2">
            Buildings<b>{ readableInteger(meta.count) || 0 }</b>
          </div>
          <div className="stat col-1-2">
            Vertices<b>{ readableInteger(meta.vertexCount || 0) }</b>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {viewport, params, data} = this.props;

    if (!data) {
      return null;
    }

    const layers = data.map((d, i) => new ChoroplethLayer({
      id: `buildings-${i}`,
      ...viewport,
      data: d,
      getColor: f => COLORS[f.properties.value]
    }));

    return (
      <DeckGLOverlay {...viewport} layers={ layers } />
    );
  }
}
