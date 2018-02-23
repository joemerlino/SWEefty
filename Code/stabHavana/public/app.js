import moment from 'moment';
import chrome from 'ui/chrome';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
// const Chart = require('chart.js');

// const d3 = require('d3-selection');

import ddd from './data';
console.log(ddd);

import * as $ from 'jquery';
import {select, selectAll, enter, attr, call, on, append, nodes, data, event} from 'd3-selection';
import {scaleOrdinal, range} from 'd3-scale';

import {forceSimulation, force, forceManyBody, forceCenter, forceLink, alphaTarget} from 'd3-force';
import {restart} from 'd3-timer';
import {json} from 'd3-fetch';
import {drag} from 'd3-drag';

var d3 = Object.assign( {
    select,
    selectAll,
    enter,
    attr,
    call,
    on,
    append,
    nodes,
    data,
    event,
    scaleOrdinal,
    range,
    forceSimulation,
    force,
    forceManyBody,
    forceCenter,
    forceLink,
    alphaTarget,
    restart,
    json,
    drag
});

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/stabHavana/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiModules
.get('app/stabHavana', [])
.controller('stabHavanaHelloWorld', function ($scope, $route, $interval) {
  $scope.title = 'Stab Havana';
  $scope.description = 'An awesome Kibana plugin';

  const currentTime = moment($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  const unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width / 2, height / 2));

// fetch('miserables.json').then(graph => {

// d3.json('miserables.json', function(error, graph) {
// if (error) throw error;

var link = svg.append("g")
  .attr("class", "links")
.selectAll("line")
.data(ddd.links)
.enter().append("line")
  .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

var node = svg.append("g")
  .attr("class", "nodes")
.selectAll("circle")
.data(ddd.nodes)
.enter().append("circle")
  .attr("r", 10)
  .attr("fill", function(d) { return color(d.group); })
  .call(function() {
      d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged);
        // .on("end", dragended));
  });
  // .call(d3.drag()
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended));

node.append("title")
  .text(function(d) { return d.id; });

simulation
  .nodes(ddd.nodes)
  .on("tick", ticked);

simulation.force("link")
  .links(ddd.links);

function ticked() {
link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}
// });

function dragstarted(d) {
    console.log("dragstarted");
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    console.log("dragged");
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    console.log("dragended");
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}



});
