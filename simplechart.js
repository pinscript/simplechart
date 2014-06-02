// The MIT License (MIT)
// 
// Copyright (c) 2014 Alexander Nyquist
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function () {
    "use strict";

    var defaultWidth = 400,
        defaultHeight =  250;

    var lineChart = function (containerId, data, options) {
        var element = document.getElementById(containerId);
        if (!element) {
            alert("Chart container not found. Did you misspell '" + containerId + "'? Make sure to run this method when the DOM is loaded.");
            return;
        }

        var elementWidth = (parseInt(element.style.width, 10) || defaultWidth),
            elementHeight = (parseInt(element.style.height, 10) || defaultHeight),
            margin = { top: 10, right: 25, bottom: 30, left: 25 },
            width = elementWidth - margin.left - margin.right,
            height = elementHeight - margin.top - margin.bottom,
            opts = {
                area: merge(options, "area", true),
                smooth: merge(options, "smooth", false),
                points: merge(options, "points", true),
                pointSize: merge(options, "pointSize", 4),
                dateFormat: merge(options, "dateFormat", "%Y-%m-%d"),
                title: merge(options, "title", function (date, count) {
                    return date + ": " + count;
                })
            };

        var dateFormat = d3.time.format(opts.dateFormat);
        
        var x = d3.time.scale()
                    .range([0, width]);
                    
        var y = d3.scale.linear()
                    .range([0, height]);
                
        var xAxis = d3.svg.axis()
            .scale(x)
            .tickFormat(d3.time.format("%d"))
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(5)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.count); });
            
        if (opts.smooth) {
            line = line.interpolate("monotone");
        }
            
        var svg = d3.select(element).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var min = 0xffffff;
        var max = 0;
        
        var wrapped = [];
        for (var key in data) {
            var value = +data[key];
            wrapped.push({
                date: dateFormat.parse(key),
                count: value
            });
            
            if(value < min) {
                min = value;
            } else if(value > max) {
                max = value;
            }
        }
        
        x.domain([wrapped[0].date, wrapped[wrapped.length - 1].date]);
        y.domain([max, min]);

        // Fill
        if (opts.area) {        
            var area = d3.svg.area()
                        .x(function (d) { return x(d.date); })
                        .y0(height)
                        .y1(function (d) { return y(d.count); });
                        
            if (opts.smooth) {
                area = area.interpolate("monotone");
            }

            svg.append("path")
              .attr("class", "sc-area")
              .attr("clip-path", "url(#clip)")
              .attr("d", area(wrapped));
        }

        // Axises
        svg.append("g")
            .attr("class", "x sc-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y sc-axis")
            .call(yAxis);

        // Line
        svg.append("path")
            .datum(wrapped)
            .attr("class", "sc-line")
            .attr("d", line);
        
        // Points
        if(opts.points) {        
            svg.selectAll("data-point")
                .data(wrapped)
                .enter()
                .append("svg:circle")
                .attr("class", "sc-point")
                .attr("cx", function (a) {
                    return x(a.date);
                })
                .attr("cy", function (a) {
                    return y(a.count) + 1;
                })
                .attr("r", opts.pointSize)
                .on("mouseenter", function () {
                    d3.select(this).attr("r", opts.pointSize + 2);
                })
                .on("mouseleave", function () {
                    d3.select(this).attr("r", opts.pointSize);
                })
                .append("svg:title")
                    .text(function (d) {
                        return opts.title(dateFormat(d.date), d.count);
                    });
        }
    };

    function merge(obj, key, defaultValue) {
        if (!obj) {
            return defaultValue;
        }

        if (obj.hasOwnProperty(key)) {
            return obj[key];
        }

        return defaultValue;
    }

    // Exports
    window.SimpleChart = {
        Line: lineChart
    };
})();