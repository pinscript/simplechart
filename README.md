Simplechart
===========

A wrapper arund d3.js for simple (at the moment only) line charts.

## Usage

This is the most basic line chart

![Simple line chart](http://i.imgur.com/RDrKofr.png "Simple line chart")
    <link rel="stylesheet" href="../simplechart.css" />
    <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
    <script type="text/javascript">
        var data = {
            "2014-01-01": 10,
            "2014-01-02": 12,
            "2014-01-03": 14,
            "2014-01-04": 12,
            "2014-01-05": 10,
            "2014-01-06": 8,
            "2014-01-07": 2,
        };
        
        window.onload = function() {
            SimpleChart.Line("chart", data);
        };
    </script>
    <body>
        <div id="chart" style="width: 1100px; height: 240px;"></div>
    </body>
    
    
More examples can be found in the examples directory.
