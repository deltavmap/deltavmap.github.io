(function(e){function t(t){for(var s,o,i=t[0],l=t[1],c=t[2],u=0,p=[];u<i.length;u++)o=i[u],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&p.push(r[o][0]),r[o]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(e[s]=l[s]);d&&d(t);while(p.length)p.shift()();return n.push.apply(n,c||[]),a()}function a(){for(var e,t=0;t<n.length;t++){for(var a=n[t],s=!0,i=1;i<a.length;i++){var l=a[i];0!==r[l]&&(s=!1)}s&&(n.splice(t--,1),e=o(o.s=a[0]))}return e}var s={},r={app:0},n=[];function o(t){if(s[t])return s[t].exports;var a=s[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=e,o.c=s,o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(a,s,function(t){return e[t]}.bind(null,s));return a},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var d=l;n.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"56d7":function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var s=a("2b0e"),r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",[a("DeltaVMap")],1)},n=[],o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"page-container"}},[e._m(0),a("div",{staticClass:"controls text-left"},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.$vuetify.breakpoint.mdAndUp||!e.selectedA,expression:"$vuetify.breakpoint.mdAndUp || !selectedA"}],staticClass:"controls__section controls__section--origin"},[a("label",{staticClass:"controls__label"},[e._v("origin")]),a("div",{staticClass:"controls__value ",class:{"controls__value--active":e.selectedA}},[a("span",{directives:[{name:"show",rawName:"v-show",value:!e.selectedAText,expression:"!selectedAText"}],staticClass:"controls__placeholder controls__placeholder--origin"},[e._v("Select origin")]),e._v(" ​"+e._s(e.selectedAText)+" ")])]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.$vuetify.breakpoint.mdAndUp||e.selectedA&&!e.selectedB,expression:"$vuetify.breakpoint.mdAndUp || (selectedA && !selectedB)"}],staticClass:"controls__section controls__section--destination"},[a("label",{staticClass:"controls__label"},[e._v("destination")]),a("div",{staticClass:"controls__value ",class:{"controls__value--active":e.selectedB}},[a("span",{directives:[{name:"show",rawName:"v-show",value:!e.selectedBText,expression:"!selectedBText"}],staticClass:"controls__placeholder controls__placeholder--destination"},[e._v("Select destination")]),e._v(" ​"+e._s(e.selectedBText)+" ")])]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.$vuetify.breakpoint.mdAndUp||e.selectedA&&e.selectedB,expression:"$vuetify.breakpoint.mdAndUp || (selectedA && selectedB)"}],staticClass:"controls__section"},[a("label",{staticClass:"controls__label"},[e._v("delta v")]),a("div",{staticClass:"controls__value",class:{"controls__value--active":e.deltaV}},[e._v("​"+e._s(e.deltaVText))])]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.$vuetify.breakpoint.mdAndUp||e.selectedA&&e.selectedB,expression:"$vuetify.breakpoint.mdAndUp || (selectedA && selectedB)"}],staticClass:"controls__section controls__aerobraking",class:{"controls__aerobraking--active":e.aeroBrakingAvailable}},[a("div",{staticClass:"controls__value"},[a("span",{staticClass:"controls__aerobraking_check"},[e._v("✓")]),a("span",{staticClass:"controls__aerobraking_label"},[e._v("Aero-breaking "),a("span",{directives:[{name:"show",rawName:"v-show",value:!e.aeroBrakingAvailable,expression:"!aeroBrakingAvailable"}]},[e._v("un")]),e._v("available ")])])]),a("div",{staticClass:"controls__section controls__buttons d-flex justify-space-between"},[a("div",[a("v-btn",{attrs:{small:"",color:"grey lighten-1",disabled:!e.selectedA||!e.selectedB},on:{click:e.reverseSelectedNodes}},[e._v("reverse")])],1),a("div",[a("v-btn",{attrs:{small:"",color:"grey lighten-1",disabled:!e.selectedA&&!e.selectedB},on:{click:e.clearSelectedNodes}},[e._v("clear")])],1),a("div",[a("about-dialog")],1)])]),a("div",{staticClass:"map-container",class:{"map-container--visible":e.cytoscapeLoaded}},[a("div",{staticClass:"map",class:{"path-selected":e.pathSelected},attrs:{id:"map"}})])])},i=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("h1",{staticClass:"site-title"},[a("span",{staticClass:"site-icon"},[e._v("Delta V Map")])])}],l=a("2909"),c=(a("99af"),a("b680"),a("d81d"),a("44e1")),d=a.n(c),u=a("0f53"),p=a.n(u),h=[{id:"Sun",label:"Sun",nodeType:"surface",parent:"SunSys",color:"yellow"},{id:"LSunO",label:"Low Sun Orbit",nodeType:"orbit",parent:"SunSys",altitude:"10000"},{id:"SunT",label:"Sun Transfer",nodeType:"orbit-transfer",parent:"SunSys"},{id:"Merc",label:"Mercury",nodeType:"surface",parent:"MercurySys",color:"brown"},{id:"LMercO",label:"Low Mercury Orbit",nodeType:"orbit",parent:"MercurySys",altitude:"100"},{id:"MercCE",label:"Mercury Capture/Escape",nodeType:"orbit-capture-escape",parent:"MercurySys"},{id:"MercT",label:"Mercury Transfer",nodeType:"orbit-transfer",parent:"SunSys"},{id:"Venus",label:"Venus",nodeType:"surface",parent:"VenusSys",color:"lightyellow"},{id:"LVenusO",label:"Low Venus Orbit",nodeType:"orbit",parent:"VenusSys",altitude:"400"},{id:"VenusCE",label:"Venus Capture/Escape",nodeType:"orbit-capture-escape",parent:"VenusSys"},{id:"VenusT",label:"Venus Transfer",nodeType:"orbit-transfer",parent:"SunSys"},{id:"Earth",label:"Earth",nodeType:"surface",parent:"EarthSys",color:"blue"},{id:"LEO",label:"Low Earth Orbit",nodeType:"orbit",parent:"EarthSys",altitude:250},{id:"GTO",label:"Geostationary Transfer Orbit",nodeType:"orbit-transfer",parent:"EarthSys"},{id:"GEO",label:"Geostationary Earth Orbit",nodeType:"orbit-stationary",parent:"EarthSys"},{id:"EarthCE",label:"Earth Capture/Escape",nodeType:"orbit-capture-escape",parent:"EarthSys"},{id:"MoonT",label:"Moon Transfer",nodeType:"orbit-transfer",parent:"EarthSys"},{id:"Moon",label:"Moon",nodeType:"surface",parent:"MoonSys",color:"#aaa"},{id:"LMoonO",label:"Low Moon Orbit",nodeType:"orbit",parent:"MoonSys"},{id:"MoonCE",label:"Moon Capture/Escape",nodeType:"orbit-capture-escape",parent:"MoonSys"},{id:"EarthMoonL1",label:"Earth Moon L1",nodeType:"orbit",parent:"MoonSys"},{id:"EarthMoonL2",label:"Earth Moon L2",nodeType:"orbit",parent:"MoonSys"},{id:"Mars",label:"Mars",nodeType:"surface",parent:"MarsSys",color:"orange"},{id:"LMarsO",label:"Low Mars Orbit",nodeType:"orbit",parent:"MarsSys",altitude:200},{id:"PhobosT",label:"Phobos Transfer Orbit",nodeType:"orbit-transfer",parent:"MarsSys",altitude:1},{id:"DeimosT",label:"Deimos Transfer Orbit",nodeType:"orbit-transfer",parent:"MarsSys",altitude:1},{id:"MarsCE",label:"Mars Capture/Escape",nodeType:"orbit-capture-escape",parent:"MarsSys"},{id:"MarsT",label:"Mars Transfer",nodeType:"orbit-transfer",parent:"SunSys"},{id:"Deimos",label:"Deimos",nodeType:"surface",parent:"DeimosSys",color:"grey"},{id:"LDeimosO",label:"Low Deimos Orbit",nodeType:"orbit",parent:"DeimosSys"},{id:"DeimosCE",label:"Deimos Capture/Escape",nodeType:"orbit-capture-escape",parent:"DeimosSys"},{id:"Phobos",label:"Phobos",nodeType:"surface",parent:"PhobosSys",color:"grey"},{id:"LPhobosO",label:"Low Phobos Orbit",nodeType:"orbit",parent:"PhobosSys"},{id:"PhobosCE",label:"Phobos Capture/Escape",nodeType:"orbit-capture-escape",parent:"PhobosSys"},{id:"Vesta",label:"Vesta",nodeType:"surface",parent:"VestaSys",color:"grey"},{id:"LVestaO",label:"Low Vesta Orbit",nodeType:"orbit",parent:"VestaSys",altitude:20},{id:"VestaCE",label:"Vesta Capture/Escape",nodeType:"orbit-capture-escape",parent:"VestaSys"},{id:"VestaT",label:"Vesta Transfer",nodeType:"orbit-transfer",parent:"SunSys"},{id:"Ceres",label:"Ceres",nodeType:"surface",parent:"CeresSys",color:"grey"},{id:"LCeresO",label:"Low Ceres Orbit",nodeType:"orbit",parent:"CeresSys",altitude:20},{id:"CeresCE",label:"Ceres Capture/Escape",nodeType:"orbit-capture-escape",parent:"CeresSys"},{id:"CeresT",label:"Ceres Transfer",nodeType:"orbit-transfer",parent:"SunSys"}],b=[["LSunO","Sun",440,0],["SunT","LSunO",178,0],["SunT","MercT",15.74,0],["LMercO","Merc",3.06,0],["MercCE","LMercO",1.22,0],["MercT","MercCE",6.31,0],["MercT","VenusT",2.06,1],["LVenusO","Venus",27,1],["VenusCE","LVenusO",2.94,0],["VenusT","VenusCE",.36,1],["LEO","Earth",9,1],["GTO","LEO",2.44,0],["GEO","GTO",1.47,0],["MoonT","GTO",.68,0],["EarthCE","MoonT",.09,0],["VenusT","EarthCE",.28,2],["LMoonO","Moon",1.72,0],["MoonCE","LMoonO",.68,0],["MoonT","MoonCE",.14,0],["MoonT","EarthMoonL1",.58,0],["MoonT","EarthMoonL2",.35,0],["EarthMoonL1","LMoonO",.64,0],["EarthMoonL2","LMoonO",.64,0],["MarsT","EarthCE",.39,2],["MarsT","MarsCE",.67,1],["MarsCE","DeimosT",.34,0],["DeimosT","PhobosT",.4,0],["PhobosT","LMarsO",.7,0],["LMarsO","Mars",3.6,1],["LDeimosO","Deimos",.004,0],["DeimosCE","LDeimosO",.002,0],["DeimosT","DeimosCE",.65,0],["LPhobosO","Phobos",.006,0],["PhobosCE","LPhobosO",.003,0],["PhobosT","PhobosCE",.54,0],["LVestaO","Vesta",.16,0],["VestaCE","LVestaO",.1,0],["VestaT","VestaCE",4.11,0],["LCeresO","Ceres",.27,0],["CeresCE","LCeresO",.15,0],["CeresT","CeresCE",4.39,0],["VestaT","MarsT",.92,0],["CeresT","VestaT",.38]],y=function(e){console.log("data() creating jupiterSystem");var t=e.planetXR,a=e.planetY;e.jupiterSystem=e.createOuterPlanetMoonSystem("Jupiter",!0,!0,"CeresT",!1,1.4,.27,"orange",[[.19,"Himalia",2.87,.02,5,.04],[.93,"Calisto",4.03,.7,100,1.75],[.8,"Ganymede",4.79,.79,100,1.95],[1.06,"Europa",5.92,.58,100,1.44],[1.56,"Io",5.79,.73,100,1.78],[4.65,"Almathea",6.31,.01,10,.02]],8.02,2e3,33,t,a,1),e.addFixedNodeConstraints(e.jupiterSystem.positionConstraints);var s=t,r=e.planetY+3*e.planetYDelta;e.saturnSystem=e.createOuterPlanetMoonSystem("Saturn",!1,!0,"JupiterT",!0,.99,.42,"burlywood",[[.3,"Iapetus",2.16,.16,50,.41],[.56,"Titan",2.2,.66,1e3,7.6,1],[1.04,"Rhea",4.01,.18,50,.45],[.67,"Dione",4.23,.14,50,.36],[.62,"Tethys",4.29,.11,50,.27],[.64,"Enceladus",4.27,.07,20,.16],[.87,"Mimas",4.02,.04,20,.1]],5.52,2e3,19,s,r,0),e.addFixedNodeConstraints(e.saturnSystem.positionConstraints);var n=t,o=r+e.planetYDelta;e.uranusSystem=e.createOuterPlanetMoonSystem("Uranus",!0,!0,"SaturnT",!0,.69,.51,"#C6ECEF",[[.46,"Oberon",1.63,.21,50,.53],[.15,"Titania",1.78,.22,50,56],[.36,"Umbriel",2.24,.15,50,.37],[.35,"Ariel",2.31,.16,50,.39],[.55,"Miranda",2.61,.05,20,.13]],4.26,1e3,15,n,o,2),e.addFixedNodeConstraints(e.uranusSystem.positionConstraints);var i=t,l=o+3*e.planetYDelta;e.neptuneSystem=e.createOuterPlanetMoonSystem("Neptune",!1,!0,"UranusT",!0,.27,.35,"#66A4FE",[[.05,"Nereid",.87,.04,10,.09],[.74,"Triton",1.71,.41,100,1.05],[1.38,"Proteus",2.9,.05,20,.11]],4.58,1e3,16,i,l,4),e.addFixedNodeConstraints(e.neptuneSystem.positionConstraints);var c=t,d=l+e.planetYDelta;e.plutoSystem=e.createOuterPlanetMoonSystem("Pluto",!0,!1,"NeptuneT",!0,.11,2.7,"#372614",[[.04,"Charon",.02,.16,50,.42]],.31,100,.89,c,d,6),e.addFixedNodeConstraints(e.plutoSystem.positionConstraints);var u=t,p=d+e.planetYDelta;e.haumeaSystem=e.createOuterPlanetMoonSystem("Haumea",!1,!1,"PlutoT",!1,.03,2.92,"grey",[],.21,50,.1,u,p,7),e.addFixedNodeConstraints(e.haumeaSystem.positionConstraints);var h=t,b=p+e.planetYDelta;e.makemakeSystem=e.createOuterPlanetMoonSystem("Makemake",!1,!1,"HaumeaT",!1,.02,2.86,"grey",[],.21,50,.36,h,b,7),e.addFixedNodeConstraints(e.makemakeSystem.positionConstraints)},f=function(e,t){t.pathColor;var a=t.originColor,s=t.destinationColor,r="#eee",n="#333",o=e.opacityLevel;return[{selector:"*",style:{"transition-property":"color, background-opacity, border-color, line-color, opacity, line-opacity, text-background-color","transition-duration":"0.1s"}},{selector:"node",style:{width:"80px",height:"80px",label:"data(label)",color:n,"border-width":"4px","text-background-shape":"round-rectangle","text-background-color":r,"text-background-padding":"10px","text-wrap":"wrap","text-margin-y":-25,"text-max-width":"80px","background-opacity":0}},{selector:'node[nodeType != "system"]',css:{"border-color":r,opacity:1,"text-background-opacity":1}},{selector:'.path-selected node[nodeType != "system"]',css:{opacity:o}},{selector:".node-on-path",style:{opacity:1,"border-opacity":1,"text-background-opacity":1}},{selector:"node[nodeType = 'surface']",style:{"background-color":function(e){return e._private.data.color},"background-fill":"linear-gradient","background-gradient-direction":"to-bottom-right","background-gradient-stop-colors":function(e){return"white "+e._private.data.color+" black"},"background-opacity":1},css:{height:"20px",width:"20px","border-width":0}},{selector:'node[nodeType = "system"]',css:{"text-background-shape":"round-rectangle","text-background-color":n,color:r,width:"1px"}},{selector:'.path-selected, .path-selected node[nodeType = "system"]',css:{"border-opacity":o,"text-opacity":o}},{selector:"edge",style:{label:"data(label)",width:4,"text-background-padding":"5px","text-background-color":r,"text-background-shape":"round-rectangle",color:n,"text-background-opacity":1,"line-color":r,"target-arrow-color":r,"source-arrow-color":r,"target-arrow-shape":"none","source-arrow-shape":"none","curve-style":"bezier"}},{selector:".node-on-path",style:{"border-color":n,"border-style":"solid","text-background-color":n,color:"white"}},{selector:".origin-node",style:{"border-color":a,"border-style":"solid","text-background-color":"#ddd",color:n}},{selector:".destination-node",style:{"border-color":s,"border-style":"solid","text-background-color":"#ddd",color:n}},{selector:".edge-on-path",style:{color:"white","text-background-color":n,"line-color":n,"target-arrow-color":n,"source-arrow-color":n,"line-style":"solid","line-dash-pattern":[4,16]}},{selector:'edge[ab = "true"]',style:{"target-arrow-shape":"tee"}},{selector:'edge[ab = "both"]',style:{"target-arrow-shape":"tee","source-arrow-shape":"tee"}},{selector:'edge[ab = "reverse"]',style:{"target-arrow-shape":"none","source-arrow-shape":"tee"}}]},v=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-dialog",{staticClass:"about-dialog",attrs:{width:"500"},scopedSlots:e._u([{key:"activator",fn:function(t){var s=t.on,r=t.attrs;return[a("v-btn",e._g(e._b({staticClass:"about-dialog__button",attrs:{small:"",color:"grey lighten-1"}},"v-btn",r,!1),s),[e._v(" About ")])]}}]),model:{value:e.dialogOpen,callback:function(t){e.dialogOpen=t},expression:"dialogOpen"}},[a("v-card",[a("v-container",{staticClass:"px-8 py-8"},[a("h2",{staticClass:"mb-4"},[e._v("About "),a("span",{staticClass:"text-uppercase"},[e._v("delta v map")])]),a("p",[e._v("How to use this app:")]),a("p",[a("ol",[a("li",[e._v("Click on the origin")]),a("li",[e._v("Click on the destination")])])]),a("p",[e._v(" This will calculate the total delta-v requirement for a Hohman transfer for that particular journey. ")]),a("p",{staticClass:"px-4 py-3 grey lighten-3"},[a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Delta-v"}},[e._v("Delta-v")]),e._v(" is the change of velocity required to move from one orbit to another ")]),a("p",{staticClass:"px-4 py-3 grey lighten-3"},[e._v(" A "),a("a",{attrs:{href:""}},[e._v("Hohmann transfer orbit")]),e._v(" is normally the most practical and efficient way to get from A to B ")]),a("p",[e._v("Press "),a("span",{staticClass:"button"},[e._v("reverse")]),e._v(" to swap the original and destination. This may affect whether "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Aerobraking"}},[e._v("aerobraking")]),e._v(" is available ")]),a("p",[e._v("Press "),a("span",{staticClass:"button"},[e._v("clear")]),e._v(" to reset the app")]),a("div",[a("h3",[e._v("Issues")]),a("p",[e._v("To report any problems or make feature requests, please record them is the issue tracker for this project on "),a("a",{attrs:{href:"https://github.com/deltavmap/deltavmap.github.io/issues"}},[e._v(" Github ")])])]),a("div",[a("h3",[e._v("Credits")]),a("p",[e._v("The values used in this app are based on the values from this map: "),a("a",{attrs:{href:"https://imgur.com/a/6bb3a"}},[e._v("KSP Delta-v map for Real Solar System")])]),a("p",[e._v("This app was made with "),a("ul",[a("li",[a("a",{attrs:{href:"https://vuejs.org/"}},[e._v("Vue")])]),a("li",[a("a",{attrs:{href:"https://vuetifyjs.com/en/"}},[e._v("Vuetify")])]),a("li",[a("a",{attrs:{href:"https://js.cytoscape.org/"}},[e._v("Cytoscape.js")])])])]),a("p",[e._v("Icons made by "),a("a",{attrs:{href:"https://creativemarket.com/Becris",title:"Becris"}},[e._v(" Becris ")]),e._v(" from "),a("a",{attrs:{href:"https://www.flaticon.com/",title:"Flaticon"}},[e._v(" www.flaticon.com ")])])])]),a("v-divider"),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"primary",text:""},on:{click:function(t){e.dialog=!1}}},[e._v(" close ")])],1)],1)],1)},m=[],S={data:function(){return{dialogOpen:!1}}},g=S,C=(a("faed"),a("2877")),T=a("6544"),O=a.n(T),_=a("8336"),M=a("b0af"),E=a("99d9"),w=a("a523"),D=a("169a"),k=a("ce7e"),x=a("2fa4"),A=Object(C["a"])(g,v,m,!1,null,"276b36be",null),j=A.exports;O()(A,{VBtn:_["a"],VCard:M["a"],VCardActions:E["a"],VContainer:w["a"],VDialog:D["a"],VDivider:k["a"],VSpacer:x["a"]}),d.a.use(p.a);var V={pathColor:"mediumpurple",originColor:"lightskyblue",destinationColor:"orange"},L={components:{AboutDialog:j},data:function(){return{svg:null,width:500,selectedA:null,selectedB:null,deltaV:null,fixedNodeConstraints:[],orbits:[],deltas:[],jupiterSystem:[],saturnSystem:[],uranusSystem:[],colDelta:250,planetY:0,planetYDelta:350,pathSelected:!1,aeroBrakingAvailable:!1,opacityLevel:.1,cytoscapeLoaded:!1}},computed:{formattedData:function(){var e=this.formatSystems(this.systems),t=this.formatOrbits(this.orbits),a=this.formatDeltas(this.deltas);return[].concat(Object(l["a"])(e),Object(l["a"])(t),Object(l["a"])(a),Object(l["a"])(this.jupiterSystem.nodesAndEdges),Object(l["a"])(this.saturnSystem.nodesAndEdges),Object(l["a"])(this.uranusSystem.nodesAndEdges),Object(l["a"])(this.neptuneSystem.nodesAndEdges),Object(l["a"])(this.plutoSystem.nodesAndEdges),Object(l["a"])(this.haumeaSystem.nodesAndEdges),Object(l["a"])(this.makemakeSystem.nodesAndEdges))},selectedAText:function(){return this.selectedA?this.selectedA.label:""},selectedBText:function(){return this.selectedB?this.selectedB.label:""},deltaVText:function(){return this.deltaV?this.deltaV.toFixed(2)+" km/s":""}},methods:{setPlanetY:function(e){return this.planetY=e,this.planetY},incPlanetYDelta:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.planetYDelta;return this.setPlanetY(this.planetY+e),this.planetY},createFixedNodeConstraints:function(){var e=this,t=function(t){return t*e.colDelta},a=t(-3),s=t(3),r=this.incPlanetYDelta,n=t(-2),o=t(2),i=t(-1),l=t(1),c=t(0),d=[],u=function(e,t,a){d.push({nodeId:e,position:{x:t,y:a}})};u("Sun",t(2),this.planetY),u("LSunO",t(1),this.planetY),u("SunT",t(0),this.planetY),u("Merc",a,r()),u("LMercO",n,this.planetY),u("MercCE",i,this.planetY),u("MercT",c,this.planetY),u("Venus",s,r()),u("LVenusO",o,this.planetY),u("VenusCE",l,this.planetY),u("VenusT",c,this.planetY);var p=r();u("MoonT",t(-2),p),u("EarthMoonL1",t(-3),p-this.planetYDelta),u("EarthMoonL2",t(-3),p+this.planetYDelta),u("Moon",t(-5),p),u("LMoonO",t(-4),p),u("MoonCE",t(-3),this.planetY);var h=r(2*this.planetYDelta),b=t(-4),y=t(-3);u("Earth",b,h),u("LEO",y,h),u("EarthCE",0,p),u("GTO",t(-2),h),u("GEO",t(-1),h);var f=r(this.planetYDelta);u("Deimos",t(5),f),u("MarsCE",t(1),f),u("MarsT",c,this.planetY),u("LDeimosO",t(4),this.planetY),u("DeimosCE",t(3),this.planetY),u("DeimosT",t(2),this.planetY),f-=this.planetYDelta,u("Phobos",t(5),f),u("LPhobosO",t(4),f),u("PhobosCE",t(3),f),u("PhobosT",t(2),f),f-=this.planetYDelta,u("Mars",t(3),f),u("LMarsO",t(2),f);var v=r();u("VestaT",0,v),u("VestaCE",i,v),u("LVestaO",n,v),u("Vesta",a,v);var m=r();return u("CeresT",0,m),u("CeresCE",l,m),u("LCeresO",o,m),u("Ceres",s,m),r(),this.planetXR=0,d},getFixedNodeConstraints:function(){return this.fixedNodeConstraints},addFixedNodeConstraint:function(e){this.fixedNodeConstraints.push(e)},addFixedNodeConstraints:function(e){var t=this;e.map((function(e){return t.addFixedNodeConstraint(e)}))},createSystem:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return{id:e,label:t,parent:a,selected:!1,nodeType:"system"}},createFurnishedSystem:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return this.furnishSystemObject(this.formatData(this.createSystem(e,t,a)))},createOuterPlanetMoonSystem:function(e,t,a,s,r,n,o,i,c,d,u,p,h,b,y){var f,v,m=this,S=[],g=function(e,t,a){S.push({nodeId:e,position:{x:t,y:a}})},C=function(e){return h+e*m.colDelta},T=0,O=t?-1:1,_=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return T+=O*e,T},M=e+"Sys",E=this.createFurnishedSystem(M,e+" System","SunSys"),w=this.furnishedOrbitObject({id:e,label:e,nodeType:"surface",parent:M,color:i}),D=e+"T",k=this.furnishedOrbitObject({id:D,label:e+" Transfer",nodeType:"orbit-transfer",parent:"SunSys"});g(D,C(0),b),v=r?a?2:1:a?3:0;var x=a?1:0,A=this.furnishedDeltaObject(D,s,n,v),j=e+"CE",V=this.furnishedOrbitObject({id:j,label:e+" Capture/Escape",nodeType:"orbit-capture-escape",parent:M});_(),g(j,C(T),b);var L=this.furnishedDeltaObject(D,j,o,x);_();var B=b,P=B+-O*this.planetYDelta,Y=P+-O*this.planetYDelta,N=Y+-O*this.planetYDelta,F=V,$=o,R=c.map((function(e){var t=e[1],a="undefined"!==typeof e[6]&&e[6],s=m.furnishedOrbitObject({id:t+"T",label:t+" Transfer",nodeType:"orbit-transfer",parent:M}),r=m.furnishedDeltaObject(F.data.id,s.data.id,$,x);g(s.data.id,C(T),B);var n=m.furnishedOrbitObject({id:t+"T",label:t+" Transfer",nodeType:"orbit-transfer",parent:M}),o=m.furnishedOrbitObject({id:t+"CE",label:t+" Capture/Escape",nodeType:"orbit-capture-escape",parent:M}),i=m.furnishedDeltaObject(n.data.id,o.data.id,e[2],a);g(o.data.id,C(T),P);var l=m.furnishedOrbitObject({id:"L"+t+"O",label:"Low "+t+" Orbit",nodeType:"orbit",parent:M,altitude:e[4]});g(l.data.id,C(T),Y);var c=m.furnishedDeltaObject(o.data.id,l.data.id,e[3],a),d=m.furnishedOrbitObject({id:t,label:t,nodeType:"surface",parent:M,color:"#807E7F"});g(d.data.id,C(T),N);var u=m.furnishedDeltaObject(l.data.id,d.data.id,e[5],a);return F=s,$=e[0],_(),[s,r,n,i,o,c,l,d,u]})),I="L"+e+"O";g(I,C(T),b),g(e,C(_()),b);var G=[E,w,k,A,V,L].concat(Object(l["a"])((f=[]).concat.apply(f,Object(l["a"])(R))),[this.furnishedOrbitObject({id:I,label:"Low "+e+" Orbit",nodeType:"orbit",parent:M,altitude:u}),this.furnishedDeltaObject(F.data.id,I,d,x),this.furnishedDeltaObject(I,e,p,x)]);return{nodesAndEdges:G,positionConstraints:S}},formatData:function(e){return{data:e}},formatDataArray:function(e){var t=this;return e.map((function(e){return t.formatData(e)}))},furnishSystemObject:function(e){var t=e;return t.events=!1,t.classes="top-center",t.grabbable=!1,t.selectable=!1,t.pannable=!0,t},furnishedSystemObject:function(e){return this.furnishSystemObject(this.formatData(e))},formatSystems:function(e){var t=this;return e.map((function(e){return t.furnishedSystemObject(e)}))},furnishOrbitObject:function(e){var t=e;return t.classes="top-center",t.grabbable=!1,t.selectable=!1,"undefined"!==typeof t.data.altitude&&(t.data.label=t.data.label+" ("+t.data.altitude+"km)"),t},furnishedOrbitObject:function(e){return this.furnishOrbitObject(this.formatData(e))},formatOrbits:function(e){var t=this;return e.map((function(e){return t.furnishedOrbitObject(e)}))},createDeltaObject:function(e,t,a){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;switch(s){case 0:s="false";break;case 1:s="true";break;case 2:s="both";break;case 3:s="reverse";break}return{source:e,target:t,dv:a,ab:s}},createDeltaDataObject:function(e,t,a){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return{data:this.createDeltaObject(e,t,a,s)}},furnishDeltaObject:function(e){return e.data.label=e.data.dv,e.selectable=!1,e},furnishedDeltaObject:function(e,t,a){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return this.furnishDeltaObject(this.createDeltaDataObject(e,t,a,s))},formatDeltas:function(e){var t=this,a=e.map((function(e){return t.createDeltaObject(e[0],e[1],e[2],e[3])}));return this.formatDataArray(a).map((function(e){return t.furnishDeltaObject(e)}))},createData:function(){this.systems=[this.createSystem("SunSys","Sun System"),this.createSystem("MercurySys","Mercury System","SunSys"),this.createSystem("VenusSys","Venus System","SunSys"),this.createSystem("EarthSys","Earth System","SunSys"),this.createSystem("MoonSys","Moon System","EarthSys"),this.createSystem("DeimosSys","Deimos System","MarsSys"),this.createSystem("MarsSys","Mars System","SunSys"),this.createSystem("PhobosSys","Phobos System","MarsSys"),this.createSystem("VestaSys","Vesta System","SunSys"),this.createSystem("CeresSys","Ceres System","SunSys")],this.orbits=h,this.deltas=b,this.fixedNodeConstraints=this.createFixedNodeConstraints(),y(this)},handleBothTerminalsAlreadySelected:function(e){this.clearSelectedNodes(),this.selectedA=e,this.selectedB=null,this.deltaV=null;var t=this.cy.$("#"+e.id);t.addClass("node-on-path"),t.addClass("origin-node")},handleReceivedOriginTerminal:function(e){this.selectedA=e;var t=this.cy.$("#"+e.id);t.addClass("node-on-path"),t.addClass("origin-node")},testIfAeroBrakingIsAvailable:function(e,t){"both"===e.ab?this.aeroBrakingAvailable=!0:(t.id===e.source&&"true"===e.ab&&(this.aeroBrakingAvailable=!0),t.id===e.target&&"reverse"===e.ab&&(this.aeroBrakingAvailable=!0))},handleReceivedDestinationTerminal:function(e){var t=this;t.aeroBrakingAvailable=!1,t.pathSelected=!0,t.selectedB=e;var a=t.cy.elements().dijkstra("#".concat(t.selectedA.id),(function(e){return parseFloat(e._private.data.dv)}),!1);t.cy.$("#"+t.selectedB.id).addClass("destination-node"),t.cy.batch((function(){t.cy.$("#SunSys").addClass("path-selected")}));var s=a.pathTo("#".concat(t.selectedB.id)),r=null;s.map((function(e){var a=e._private.data,s=a.id,n=t.cy.$("#"+s);if(e._private.data.nodeType)n.addClass("node-on-path"),r=a;else if(n.addClass("edge-on-path"),!1===t.aeroBrakingAvailable){var o=e._private.data;t.testIfAeroBrakingIsAvailable(o,r)}})),t.cy.batch((function(){var e=t.cy.$("edge"),a=t.cy.$(".edge-on-path"),s=e.difference(a);s.css("opacity",t.opacityLevel)})),t.deltaV=a.distanceTo("#".concat(t.selectedB.id))},nodeSelected:function(e){var t=e._private.data;"system"!==t.nodeType?this.selectedA&&this.selectedB?this.handleBothTerminalsAlreadySelected(t):this.selectedA?this.handleReceivedDestinationTerminal(t):this.handleReceivedOriginTerminal(t):this.clearSelectedNodes()},findById:function(e){return this.cy.$("#"+e)},findByClass:function(e){return this.cy.$("."+e)},findAndRemoveClass:function(e){this.findByClass(e).removeClass(e)},reverseSelectedNodes:function(){var e=this.selectedA,t=this.selectedB;this.findAndRemoveClass("origin-node"),this.findAndRemoveClass("destination-node"),this.selectedA=t,this.selectedB=e,this.findById(this.selectedA.id).addClass("origin-node"),this.findById(this.selectedB.id).addClass("destination-node"),this.handleReceivedDestinationTerminal(this.selectedB)},clearSelectedNodes:function(){this.pathSelected=!1,this.selectedA=null,this.selectedB=null,this.deltaV=null,this.aeroBrakingAvailable=!1,clearInterval(this.interval);var e=this;this.cy.batch((function(){e.cy.$(":selected").unselect(),e.findAndRemoveClass("origin-node"),e.findAndRemoveClass("destination-node"),e.findAndRemoveClass("node-on-path"),e.findAndRemoveClass("edge-on-path"),e.findAndRemoveClass("path-selected"),e.cy.$("edge").css("opacity",1)}))}},mounted:function(){var e=this,t=this;t.createData();var a=document.getElementById("map"),s=d()({container:a,elements:this.formattedData,wheelSensitivity:.25,style:f(this,V),layout:{name:"fcose",quality:"proof",edgeElasticity:.1,nodeRepulsion:4e4,nodeSeparation:200,fixedNodeConstraint:this.getFixedNodeConstraints()}});window.cy=s,t.cy=s,s.on("mouseover","node",(function(){a.style.cursor="pointer"})),s.on("mouseout","node",(function(){a.style.cursor="default"})),s.on("tap","node[type != 'system']",(function(e){t.nodeSelected(e.target)})),setTimeout((function(){e.cytoscapeLoaded=!0}),1e3)}},B=L,P=(a("aa85"),Object(C["a"])(B,o,i,!1,null,null,null)),Y=P.exports;O()(P,{VBtn:_["a"]});var N={name:"App",components:{DeltaVMap:Y}},F=N,$=a("7496"),R=Object(C["a"])(F,r,n,!1,null,null,null),I=R.exports;O()(R,{VApp:$["a"]});var G=a("9483");Object(G["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var U=a("f309");s["a"].use(U["a"]);var H=new U["a"]({});s["a"].config.productionTip=!1,new s["a"]({vuetify:H,render:function(e){return e(I)}}).$mount("#app")},aa85:function(e,t,a){"use strict";a("e92d")},e92d:function(e,t,a){},f6ff:function(e,t,a){},faed:function(e,t,a){"use strict";a("f6ff")}});
//# sourceMappingURL=app.a146ac80.js.map