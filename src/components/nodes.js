const array = [
  { id: 'Sun', label: 'Sun', nodeType: 'surface', parent: 'MilkyWay', color: 'yellow' },
  { id: 'LSunO', label: 'Low Sun Orbit', nodeType: 'orbit', parent: 'Sun', altitude: '10000' },
  { id: 'SunT', label: 'Sun Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

  { id: 'Merc', label: 'Mercury', nodeType: 'surface', parent: 'Sun', color: '#7E7878' },
  { id: 'LMercO', label: 'Low Mercury Orbit', nodeType: 'orbit', parent: 'Mercury', altitude: '100' },
  { id: 'MercCE', label: 'Mercury Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Mercury' },
  { id: 'MercT', label: 'Mercury Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

  { id: 'Venus', label: 'Venus', nodeType: 'surface', parent: 'Sun', color: '#D7C9AF', atmosphere: true },
  { id: 'LVenusO', label: 'Low Venus Orbit', nodeType: 'orbit', parent: 'Venus', altitude: '400' },
  { id: 'VenusCE', label: 'Venus Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Venus' },
  { id: 'VenusT', label: 'Venus Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

  { id: 'Earth', label: 'Earth', nodeType: 'surface', parent: 'Sun', color: '#539DE4', atmosphere: true },
  { id: 'LEO', label: 'Low Earth Orbit', nodeType: 'orbit', parent: 'Earth', altitude: 250 },
  { id: 'GTO', label: 'Geostationary Transfer Orbit', nodeType: 'orbit-transfer', parent: 'Earth' },
  { id: 'GEO', label: 'Geostationary Earth Orbit', nodeType: 'orbit-stationary', parent: 'Earth' },
  { id: 'EarthCE', label: 'Earth Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Earth' },
  { id: 'MoonT', label: 'Moon Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

  { id: 'Moon', label: 'Moon', nodeType: 'surface', parent: 'Earth', color: '#aaa' },
  { id: 'LMoonO', label: 'Low Moon Orbit', nodeType: 'orbit', parent: 'Moon' },
  { id: 'MoonCE', label: 'Moon Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Moon' },
  { id: 'EarthMoonL1', label: 'Earth Moon L1', nodeType: 'orbit', parent: 'Moon' },
  { id: 'EarthMoonL2', label: 'Earth Moon L2', nodeType: 'orbit', parent: 'Moon' },

  { id: 'Vesta', label: 'Vesta', nodeType: 'surface', parent: 'Sun', color: 'grey' },
  { id: 'LVestaO', label: 'Low Vesta Orbit', nodeType: 'orbit', parent: 'Vesta', altitude: 20 },
  { id: 'VestaCE', label: 'Vesta Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Vesta' },
  { id: 'VestaT', label: 'Vesta Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

  { id: 'Ceres', label: 'Ceres', nodeType: 'surface', parent: 'Sun', color: 'grey' },
  { id: 'LCeresO', label: 'Low Ceres Orbit', nodeType: 'orbit', parent: 'Ceres', altitude: 20 },
  { id: 'CeresCE', label: 'Ceres Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Ceres' },
  { id: 'CeresT', label: 'Ceres Transfer', nodeType: 'orbit-transfer', parent: 'Sun' }
]

// convert array to object
const object = {}
array.map(node => {
  object[node.id] = node
})

export default object
