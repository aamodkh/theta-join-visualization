// write your javascript code here.
// feel free to change the pre-set attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// your visualization
let svg = d3.select('#vis')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))


let squareLabel = svg.append('text')
  .attr('x', '30%')
  .attr('y', '35%')
  .attr('text-anchor', 'middle')
  .text('A')

let circleLabel = svg.append('text')
  .attr('x', '70%')
  .attr('y', '35%')
  .attr('text-anchor', 'middle')
  .text('B')

let rect = svg.append('rect')// The square we want to click on
  .attr('x', '20%')
  .attr('y', '40%')
  .attr('width', '20%')
  .attr('height', '20%')
  .attr('fill', 'yellow')

let circle = svg.append('circle') // The circle we want to change color when the square is clicked
  .attr('cx', '70%')
  .attr('cy', '50%')
  .attr('r', '10%')
  .attr('fill', 'blue')



