export default function (deltaVMap, { pathColor, originColor, destinationColor }) {
  const outlineColor = '#eee'
  const textBackgroundColor = '#333'
  const opacity = deltaVMap.opacityLevel
  return [
    {
      selector: '*',
      style: {
        'transition-property': 'color, background-opacity, border-color, line-color, opacity, line-opacity, text-background-color',
        'transition-duration': '0.1s'
      }
    },
    {
      selector: 'node',
      style: {
        width: '80px',
        height: '80px',
        label: 'data(label)',
        color: textBackgroundColor,
        'border-width': '4px',
        'text-background-shape': 'round-rectangle',
        'text-background-color': outlineColor,
        'text-background-padding': '10px',
        'text-wrap': 'wrap',
        'text-margin-y': -25,
        'text-max-width': '80px',
        'background-opacity': 0
      }
    },
    {
      selector: 'node[nodeType != "system"]',
      css: {
        'border-color': outlineColor,
        opacity: 1,
        'text-background-opacity': 1
      }
    },
    {
      selector: '.path-selected node[nodeType != "system"]',
      css: {
        opacity
      }
    },
    {
      selector: '.node-on-path',
      style: {
        opacity: 1,
        'border-opacity': 1,
        'text-background-opacity': 1
      }
    },
    {
      selector: "node[nodeType = 'surface']",
      style: {
        'background-color': function (ele) {
          return ele._private.data.color
        },
        'background-fill': 'linear-gradient',
        'background-gradient-direction': 'to-bottom-right',
        'background-gradient-stop-colors': function (ele) {
          return 'white ' + ele._private.data.color + ' black'
        },
        'background-opacity': 1
      },
      css: {
        height: '20px',
        width: '20px',
        'border-width': 0
      }
    },
    {
      selector: 'node[nodeType = "system"]',
      css: {
        'text-background-shape': 'round-rectangle',
        'text-background-color': textBackgroundColor,
        color: outlineColor,
        width: '1px'
      }
    },
    {
      selector: '.path-selected, .path-selected node[nodeType = "system"]',
      css: {
        'border-opacity': opacity,
        'text-opacity': opacity
      }
    },
    {
      selector: 'edge',
      style: {
        label: 'data(label)',
        width: 4,
        'text-background-padding': '5px',
        'text-background-color': outlineColor,
        'text-background-shape': 'round-rectangle',
        color: textBackgroundColor,
        'text-background-opacity': 1,
        'line-color': outlineColor,
        // 'line-style': 'dashed',
        // 'line-dash-pattern': [4, 32],
        'target-arrow-color': outlineColor,
        'source-arrow-color': outlineColor,
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'none',
        'curve-style': 'bezier'
      }
    },
    {
      selector: '.node-on-path',
      style: {
        'border-color': textBackgroundColor,
        'border-style': 'solid',
        'text-background-color': textBackgroundColor,
        color: 'white'
      }
    },
    {
      selector: '.origin-node',
      style: {
        'border-color': originColor,
        'border-style': 'solid',
        'text-background-color': '#ddd',
        color: textBackgroundColor
      }
    },
    {
      selector: '.destination-node',
      style: {
        'border-color': destinationColor,
        'border-style': 'solid',
        'text-background-color': '#ddd',
        color: textBackgroundColor
      }
    },
    {
      selector: '.edge-on-path',
      style: {
        // color: 'black',
        color: 'white',
        // 'text-background-color': pathColor,
        'text-background-color': textBackgroundColor,
        // 'line-color': pathColor,
        'line-color': textBackgroundColor,
        // 'target-arrow-color': pathColor,
        'target-arrow-color': textBackgroundColor,
        // 'source-arrow-color': pathColor,
        'source-arrow-color': textBackgroundColor,
        'line-style': 'solid',
        // 'line-style': 'dashed',
        // 'line-dash-offset': 3,
        'line-dash-pattern': [4, 16]
      }
    },
    {
      selector: 'edge[ab = "true"]',
      style: {
        'target-arrow-shape': 'tee'
      }
    },
    {
      selector: 'edge[ab = "both"]',
      style: {
        'target-arrow-shape': 'tee',
        'source-arrow-shape': 'tee'
      }
    },
    {
      selector: 'edge[ab = "reverse"]',
      style: {
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'tee'
      }
    }
  ]
}
