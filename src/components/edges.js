export default [
  ['LSunO', 'Sun', 440, 0],
  ['SunT', 'LSunO', 178, 0],
  ['SunT', 'MercuryT', 15.74, 0],

  ['LMercuryO', 'Mercury', 3.06, 0],
  ['MercuryCE', 'LMercuryO', 1.22, 0],
  ['MercuryT', 'MercuryCE', 6.31, 0],

  ['MercuryT', 'VenusT', 2.06, 1],
  ['LVenusO', 'Venus', 27, 1],
  ['VenusCE', 'LVenusO', 2.94, 0],
  ['VenusT', 'VenusCE', 0.36, 1],

  ['LEO', 'Earth', 9, 1],
  ['GTO', 'LEO', 2.44, 0],
  ['GEO', 'GTO', 1.47, 0],
  ['MoonT', 'GTO', 0.68, 0],
  ['EarthCE', 'MoonT', 0.09, 0],
  ['VenusT', 'EarthCE', 0.28, 2],

  ['LMoonO', 'Moon', 1.72, 0],
  ['MoonCE', 'LMoonO', 0.68, 0],
  ['MoonT', 'MoonCE', 0.14, 0],
  ['MoonT', 'EarthMoonL1', 0.58, 0],
  ['MoonT', 'EarthMoonL2', 0.35, 0],
  ['EarthMoonL1', 'LMoonO', 0.64, 0],
  ['EarthMoonL2', 'LMoonO', 0.64, 0],
  ['LMoonO', 'NRHO', 0.73, 0],
  ['MoonT', 'NRHO', 0.83, 0],

  ['MarsT', 'EarthCE', 0.39, 2],
  ['MarsT', 'MarsCE', 0.67, 1],
  ['MarsCE', 'DeimosT', 0.34, 0],
  ['DeimosT', 'PhobosT', 0.4, 0],
  ['PhobosT', 'LMarsO', 0.7, 0],
  ['LMarsO', 'Mars', 3.6, 1],

  ['LDeimosO', 'Deimos', 0.004, 0],
  ['DeimosCE', 'LDeimosO', 0.002, 0],
  ['DeimosT', 'DeimosCE', 0.65, 0],

  ['LPhobosO', 'Phobos', 0.006, 0],
  ['PhobosCE', 'LPhobosO', 0.003, 0],
  ['PhobosT', 'PhobosCE', 0.54, 0],

  ['LVestaO', 'Vesta', 0.16, 0],
  ['VestaCE', 'LVestaO', 0.1, 0],
  ['VestaT', 'VestaCE', 4.11, 0],

  ['LCeresO', 'Ceres', 0.27, 0],
  ['CeresCE', 'LCeresO', 0.15, 0],
  ['CeresT', 'CeresCE', 4.39, 0],

  ['VestaT', 'MarsT', 0.92, 0],
  ['CeresT', 'VestaT', 0.38]
]
