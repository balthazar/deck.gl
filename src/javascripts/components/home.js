import 'babel-polyfill';
import React, {Component} from 'react';

import Header from './header';
import stylesheet from '../constants/styles';

const DEMO_TAB = 0;
const CONTENT_TAB = 1;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.onscroll = this._onScroll.bind(this);
    this._onScroll();
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  _onScroll() {
    const y = window.pageYOffset;
    this.setState({atTop: y < 168});
  }

  render() {
    const {atTop} = this.state;
    return (
      <div className={`home-wrapper ${atTop ? 'top' : ''}`}>
        <style>{ stylesheet }</style>
        <Header />

        <section id="banner">
          <div className="container">
            <h1>deck.gl</h1>
            <p>Large-scale WebGL-powered Data Visualization</p>
            <button>Get started</button>
          </div>
        </section>

        <section id="features">
          <div className="container">
            <h2>deck.gl is a WebGL-powered framework for visual exploratory data analysis of large datasets.</h2>
            <hr className="short" />

            <h3>A Layered Approach to Visualization</h3>
            <p>Based on the notion of layers and instancing deck.gl is suitable to reason about and display data, perform
            on-the-fly aggregations and visually explore large datasets.
            </p>

            <h3>High-precision computations in the GPU</h3>
            <p>By emulating float64 computations in the GPU we support rendering datasets with unparalleled accuracy and performance.
            </p>

            <h3>Robust Architecture</h3>
            <p>deck.gl is built using the latest JavaScript standards, including ES2016 and a rich ecosystem of libraries and settings that enable easy debugging and profiling of WebGL applications.
            </p>

            <h3>Interoperability with Mapbox</h3>
            <p>
            deck.gl is interoperable with MapboxGL-js. We coordinate with Mapbox's camera system to provide compelling 2D and 3D visualizations on top of Mapbox's camera system.
            </p>
          </div>
          <div className="image" />
        </section>

        <hr />

        <section id="highlights">
          <div className="container text-center">
            <h4>Performance highlights</h4>
            <hr className="short" />
            <div className="layout">
              <div className="col-1-3">
                <img src="images/Icon-1.svg" />
                <h5>WebGL rendered</h5>
                <p>Tested, highly performant layers for core data
                   visualization use cases such as scatterplots, choropleths,
                   and more, as well as support for custom WebGL layers.
                </p>
              </div>

              <div className="col-1-3">
                <img src="images/Icon-2.svg" />
                <h5>React and MapboxGL friendly</h5>
                <p>Comes with strong React and MapboxGL integrations.
                   deck.gl is a particularly good match with React, supporting
                   efficient WebGL rendering in "data flow architecture"
                   applications.
                </p>
              </div>


              <div className="col-1-3">
                <img src="images/Icon-3.svg" />
                <h5>Automatic WebGL Buffer Management</h5>
                <p>Special focus on buffer management, allowing both automatic
                   buffer updates but also full application control of buffer
                   allocation and management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr />

        <section id="featured">
          <div className="container text-center">
            <h4>Featured</h4>
            <hr className="short" />
          </div>
        </section>

        <hr />

        <section id="concept">
          <div className="container text-center">
            <h4>How it works</h4>
            <hr className="short" />
            <div className="canvas position--relative">
              <img src="images/layers.png" />
              <div className="position--absolute left-top">
                <h5><i>01</i>deck.gl</h5>
                <p>Deck provides overlays that plug directly into react-map-gl’s
                   overlay model, enabling high-performance map visualizations
                </p>
              </div>

              <div className="position--absolute right-center">
                <h5><i>02</i>react-map-gl</h5>
                <p>A WebGL based vector tile mapping library. Provides a React
                   friendly API wrapper around Mapbox GL JS.
                </p>
              </div>
              <div className="position--absolute left-bottom">
                <h5><i>03</i>luma.gl</h5>
                <p>Our efficient and easy-to-use WebGL framework enabling
                   high-performance browser-based data visualizations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="footer">
          <div className="container text-center">
            <div className="logo">deck.gl</div>
            <hr className="short" />
            <h4>Made by</h4>
            <img src="images/uber-logo.png" />
          </div>
        </section>

      </div>
    )
  }
}
