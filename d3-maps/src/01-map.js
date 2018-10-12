import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// define projection 
let projection = d3.geoMercator()

// define path to avoid ReferenceError: path is not defined
let path = d3.geoPath().projection(projection)
let lineWidthScale = d3.scaleLinear().domain([0,100]).range([0,20])

// colorScale
let colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 100])

// Experiment with adding .clamp(true) onto your scale. What changes?
//let colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 100]).clamp(true)

// read the data
Promise.all([
  d3.json(require('./data/world.topojson')),
  d3.csv(require('./data/world-cities.csv'))
]).then(ready)

let coordinateStore = d3.map()

function ready([json, datapoints]) {

  console.log('json', json.objects)

  let countries = topojson.feature(json, json.objects.countries)
  console.log('countries', countries)

  svg
    .append('g')
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'lightgrey')
    .style('fill', 'black')

  svg.selectAll('.city')
    .data(datapoints)
    .enter().append('circle')
    .attr('class', 'city')
    .attr('r', 1)
    .attr('transform', d => `translate(${projection([d.lng, d.lat])})`)
    .attr('fill', d => {
      return colorScale(d.population)
    })

}