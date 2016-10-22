import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay} from 'deck.gl';
import TripsLayer from './trips-layer/trips-layer';
import {MAPBOX_STYLES} from '../../constants/defaults';
import {readableInteger} from '../../utils/format-utils';
import ViewportAnimation from '../../utils/map-utils';

const BLENDING = {
  enable: true,
  blendFunc: ['SRC_ALPHA', 'ONE'],
  blendEquation: 'FUNC_ADD'
};

export default class HeroDemo extends Component {

  static get data() {
    return {
      url: 'data/hero-data.txt',
      worker: 'workers/hero-data-decoder.js?loop=3600&trail=180'
    };
  }

  static get parameters() {
    return {};
  }

  static get viewport() {
    return {
      mapStyle: MAPBOX_STYLES.DARK,
      longitude: -74.0,
      latitude: 40.74,
      zoom: 12,
      pitch: 0,
      bearing: 0
    };
  }

  static renderInfo(meta) {
    return (
      <div>
        <h3>Yellow Cab Vs. Green Cab Trips in Manhattan</h3>
        <p>June 16, 2016 21:00 - 22:00</p>
        <div className="layout">
          <div className="stat col-1-2">Trips
            <b>{ readableInteger(meta.trips || 0) }</b>
          </div>
          <div className="stat col-1-2">Vertices
            <b>{ readableInteger(meta.vertices || 0) }</b>
          </div>
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);

    const thisDemo = this;

    this.state = {
      time: 0
    };
    this.tween = ViewportAnimation.ease({time: 0}, {time: 3600}, 120000)
      .onUpdate(function() { thisDemo.setState(this) })
      .repeat(Infinity);
  }

  componentDidMount() {
    const thisDemo = this;
    this.tween.start();
  }

  componentWillUnmount() {
    this.tween.stop();
  }

  render() {
    const {viewport, data} = this.props;

    if (!data) {
      return null;
    }
    const layers = data.map((layerData, layerIndex) => new TripsLayer({
        id: `trips-${layerIndex}`,
        ...viewport,
        data: layerData,
        getPath: d => d.segments,
        getColor: d => d.vendor === 0 ? [253,128,93] : [23,184,190],
        opacity: 0.3,
        strokeWidth: 2,
        trailLength: 180,
        currentTime: this.state.time
      })
    );

    return (
      <DeckGLOverlay {...viewport} layers={ layers }
        blending={BLENDING}
       />
    );
  }
}
