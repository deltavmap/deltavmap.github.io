const arr = [
  { id: 'Sun', label: 'Sun', nodeType: 'surface', parent: 'SunSys', color: 'yellow' },
  { id: 'LSunO', label: 'Low Sun Orbit', nodeType: 'orbit', parent: 'SunSys', altitude: '10000' },
  { id: 'SunT', label: 'Sun Transfer', nodeType: 'orbit-transfer', parent: 'SunSys' },

  { id: 'Merc', label: 'Mercury', nodeType: 'surface', parent: 'MercurySys', color: 'brown' },
  { id: 'LMercO', label: 'Low Mercury Orbit', nodeType: 'orbit', parent: 'MercurySys', altitude: '100' },
  { id: 'MercCE', label: 'Mercury Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'MercurySys' },
  { id: 'MercT', label: 'Mercury Transfer', nodeType: 'orbit-transfer', parent: 'SunSys' },

  { id: 'Venus', label: 'Venus', nodeType: 'surface', parent: 'VenusSys', color: 'lightyellow' },
  { id: 'LVenusO', label: 'Low Venus Orbit', nodeType: 'orbit', parent: 'VenusSys', altitude: '400' },
  { id: 'VenusCE', label: 'Venus Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'VenusSys' },
  { id: 'VenusT', label: 'Venus Transfer', nodeType: 'orbit-transfer', parent: 'SunSys' },

  { id: 'Earth', label: 'Earth', nodeType: 'surface', parent: 'EarthSys', color: 'blue' },
  { id: 'LEO', label: 'Low Earth Orbit', nodeType: 'orbit', parent: 'EarthSys', altitude: 250 },
  { id: 'GTO', label: 'Geostationary Transfer Orbit', nodeType: 'orbit-transfer', parent: 'EarthSys' },
  { id: 'GEO', label: 'Geostationary Earth Orbit', nodeType: 'orbit-stationary', parent: 'EarthSys' },
  { id: 'EarthCE', label: 'Earth Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'EarthSys' },
  { id: 'MoonT', label: 'Moon Transfer', nodeType: 'orbit-transfer', parent: 'EarthSys' },

  { id: 'Moon', label: 'Moon', nodeType: 'surface', parent: 'MoonSys', color: '#aaa' },
  { id: 'LMoonO', label: 'Low Moon Orbit', nodeType: 'orbit', parent: 'MoonSys' },
  { id: 'MoonCE', label: 'Moon Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'MoonSys' },
  { id: 'EarthMoonL1', label: 'Earth Moon L1', nodeType: 'orbit', parent: 'MoonSys' },
  { id: 'EarthMoonL2', label: 'Earth Moon L2', nodeType: 'orbit', parent: 'MoonSys' },

  { id: 'Mars', label: 'Mars', nodeType: 'surface', parent: 'MarsSys', color: 'orange' },
  { id: 'LMarsO', label: 'Low Mars Orbit', nodeType: 'orbit', parent: 'MarsSys', altitude: 200 },
  { id: 'PhobosT', label: 'Phobos Transfer Orbit', nodeType: 'orbit-transfer', parent: 'MarsSys', altitude: 1 },
  { id: 'DeimosT', label: 'Deimos Transfer Orbit', nodeType: 'orbit-transfer', parent: 'MarsSys', altitude: 1 },
  { id: 'MarsCE', label: 'Mars Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'MarsSys' },
  { id: 'MarsT', label: 'Mars Transfer', nodeType: 'orbit-transfer', parent: 'SunSys' },

  { id: 'Deimos', label: 'Deimos', nodeType: 'surface', parent: 'DeimosSys', color: 'grey' },
  { id: 'LDeimosO', label: 'Low Deimos Orbit', nodeType: 'orbit', parent: 'DeimosSys' },
  { id: 'DeimosCE', label: 'Deimos Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'DeimosSys' },

  { id: 'Phobos', label: 'Phobos', nodeType: 'surface', parent: 'PhobosSys', color: 'grey' },
  { id: 'LPhobosO', label: 'Low Phobos Orbit', nodeType: 'orbit', parent: 'PhobosSys' },
  { id: 'PhobosCE', label: 'Phobos Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'PhobosSys' },

  { id: 'Vesta', label: 'Vesta', nodeType: 'surface', parent: 'VestaSys', color: 'grey' },
  { id: 'LVestaO', label: 'Low Vesta Orbit', nodeType: 'orbit', parent: 'VestaSys', altitude: 20 },
  { id: 'VestaCE', label: 'Vesta Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'VestaSys' },
  { id: 'VestaT', label: 'Vesta Transfer', nodeType: 'orbit-transfer', parent: 'SunSys' },

  { id: 'Ceres', label: 'Ceres', nodeType: 'surface', parent: 'CeresSys', color: 'grey' },
  { id: 'LCeresO', label: 'Low Ceres Orbit', nodeType: 'orbit', parent: 'CeresSys', altitude: 20 },
  { id: 'CeresCE', label: 'Ceres Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'CeresSys' },
  { id: 'CeresT', label: 'Ceres Transfer', nodeType: 'orbit-transfer', parent: 'SunSys' }
]

// convert array to object
const orbitsObject = {}
arr.map(node => {
  orbitsObject[node.id] = node
})

export default orbitsObject
