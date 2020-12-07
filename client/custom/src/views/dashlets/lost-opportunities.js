/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2020 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: https://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

define('custom:views/dashlets/lost-opportunities', ['crm:views/dashlets/abstract/chart', 'lib!d3'], function (Dep) {

    return Dep.extend({

        name: 'Lost Opportunities',

        url: function () {
            var url = 'Opportunity/action/reportLostOpportunities'
            return url;
        },

        isNoData: function () {
            return this.isEmpty;
        },

        prepareData: function (response) {
            if (response.dataList.length) {
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
            }

            return response.dataList.map(item => ({
                name: item.reason,
                value: parseFloat(item.amount),
                count: item.count,
            }));
        },

        setup: function () {
            this.chartData = [];
        },

        draw: function () {
            data = this.chartData;

            var width = 450
            height = 450
            margin = 40

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            var radius = Math.min(width, height) / 2 - margin

            // append the svg object to the div called 'my_dataviz'
            var svg = d3.create("div")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Create dummy data
            var data = { a: 9, b: 20, c: 30, d: 8, e: 12 }

            // set the color scale
            var color = d3.scaleOrdinal()
                .domain(data)
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

            // Compute the position of each group on the pie:
            var pie = d3.pie()
                .value(function (d) { return d.value; })
            var data_ready = pie(d3.entries(data))

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg
                .selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', d3.arc()
                    .innerRadius(100)         // This is the size of the donut hole
                    .outerRadius(radius)
                )
                .attr('fill', function (d) { return (color(d.data.key)) })
                .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)

            this.$container.empty();
            this.$container.get(0).append(svg.node());

            this.adjustLegend();
        },
    });
});
