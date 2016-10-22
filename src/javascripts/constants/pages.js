function getGithubUrl(filename) {
  return `https://raw.githubusercontent.com/uber/deck.gl/dev/docs/${filename}`
}

function generatePath(tree) {
  if (Array.isArray(tree)) {
    tree.forEach(branch => generatePath(branch));
  }
  if (tree.children) {
    generatePath(tree.children);
  }
  if (tree.name) {
    tree.path = tree.name.match(/(([A-Z]|^)[a-z]+|\d+)/g).join('-').toLowerCase();
  }
  return tree;
}

export const examplePages = generatePath([
  {
    name: 'Core Layers',
    children: [
      {
        name: 'ScatterplotLayer',
        content: {
          demo: 'ScatterplotDemo',
          code: 'docs/scatterplot.md'
        }
      },
      {
        name: 'ArcLayer',
        content: {
          demo: 'ArcDemo',
          code: 'docs/arc.md'
        }
      },
      {
        name: 'ChoroplethLayer',
        content: {
          demo: 'ChoroplethDemo',
          code: 'docs/choropleth.md'
        }
      },
      {
        name: 'GridLayer',
        content: {
          demo: 'GridDemo',
          code: 'docs/grid.md'
        }
      }
    ]
  },
  {
    name: 'Example Layers',
    children: [
      {
        name: 'Trip Routes',
        content: {
          demo: 'HeroDemo',
          code: 'docs/grid.md'
        }
      }
    ]
  }
]);

export const docPages = generatePath([
  {
    name: 'Overview',
    children: [
      {
        name: 'Overview',
        content: 'docs/overview.md'
      }
    ]
  },
  {
    name: 'Layers',
    children: [
      {
        name: 'Using Layers',
        content: getGithubUrl('using-layers.md')
      },
      {
        name: 'The Layer Class',
        content: getGithubUrl('layer.md')
      },
      {
        name: 'Coordinate Systems',
        content: getGithubUrl('coordinate-systems.md')
      }
    ]
  },
  {
    name: 'Creating Custom Layers',
    children: [
      {
        name: 'Custom Layers',
        content: getGithubUrl('custom-layers.md')
      },
      {
        name: 'Layer Lifecycle',
        content: getGithubUrl('layer-lifecycle.md')
      },
      {
        name: 'Attribute Management',
        content: getGithubUrl('attribute-management.md')
      },
      {
        name: 'Writing Shaders',
        content: getGithubUrl('writing-shaders.md')
      }
    ]
  },
  {
    name: 'Usage',
    children: [
      {
        name: 'Using With React',
        content: getGithubUrl('using-with-react.md')
      },
      {
        name: 'Using With MapboxGL',
        content: getGithubUrl('using-with-mapbox-gl.md')
      },
      {
        name: 'Using Standalone',
        content: getGithubUrl('using-standalone.md')
      }
    ]
  },
  {
    name: 'Advanced Topics',
    children: [
      {
        name: 'Tips and Tricks',
        content: getGithubUrl('tips-and-tricks.md')
      },
      {
        name: 'Performance',
        content: getGithubUrl('performance.md')
      }
    ]
  }
]);

export const layerDocPages = generatePath([
  {
    name: 'Core Layers',
    children: [
      {
        name: 'ArcLayer',
        content: getGithubUrl('layers/arc-layer.md')
      },
      {
        name: 'ChoroplethLayer',
        content: getGithubUrl('layers/choropleth-layer.md')
      },
      {
        name: 'GridLayer',
        content: getGithubUrl('layers/grid-layer.md')
      },
      {
        name: 'LineLayer',
        content: getGithubUrl('layers/line-layer.md')
      },
      {
        name: 'ScatterplotLayer',
        content: getGithubUrl('layers/scatterplot-layer.md')
      }
    ]
  },
  {
    name: '64bit Layers',
    children: [
      {
        name: 'Overview',
        content: getGithubUrl('layers/64bit-layers.md')
      }
    ]
  },
  {
    name: 'Sample Layers',
    children: [
      {
        name: 'Overview',
        content: getGithubUrl('layers/sample-layers.md')
      }
    ]
  }
]);
