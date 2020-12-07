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

define('custom:views/dashlets/business-won', ['crm:views/dashlets/abstract/chart', 'lib!d3'], function (Dep) {

    return Dep.extend({

        name: 'BusinessWon',

        url: function () {
            var url = 'Opportunity/action/reportBusinessWon'
            return url;
        },

        isNoData: function () {
            return this.isEmpty;
        },

        prepareData: function (response) {
            if(response.dataList.length) {
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
            }

            return response.dataList.map(item => ({
                name: item.month,
                value: parseFloat(item.amount),
                count: 100,
            }));
        },

        setup: function () {
            this.chartData = [];
        },

        draw: function () {
            data = this.chartData;

            margin = ({ top: 10, right: 40, bottom: 30, left: 40 })
            height = 500
            width = 700
            color = "steelblue"

            y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([height - margin.bottom, margin.top])

            y2 = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count)]).nice()
                .range([height - margin.bottom, margin.top])

            x = d3.scaleBand()
                .domain(d3.range(data.length))
                .range([margin.left, width - margin.right])
                .padding(0.1)

            yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(null, data.format))
                .call(g => g.select(".domain").remove())
                .call(g => g.append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(data.y))

            yAxis2 = g => g
                .attr("transform", `translate(${width - margin.right},0)`)
                .call(d3.axisRight(y2).ticks(null, data.format))
                .call(g => g.select(".domain").remove())
                .call(g => g.append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(data.y))

            xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))

            const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width, height]);

            svg.append("g")
                .attr("fill", '#007bff')
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", (d, i) => x(i))
                .attr("y", d => y(d.value))
                .attr("width", x.bandwidth() / 2)
                .transition()
                .ease(d3.easeLinear)
                .duration(1000)
                .attr("height", d => y(0) - y(d.value));

            svg.append("g")
                .attr("fill", "#3ac47d")
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", (d, i) => x(i) + x.bandwidth() / 3)
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth() / 2)
                .transition()
                .ease(d3.easeLinear)
                .duration(2000)
                .attr("height", d => y(0) - y(d.count));

            svg.append("g")
                .call(xAxis);

            svg.append("g")
                .call(yAxis);

            svg.append("g")
                .call(yAxis2);

            node = svg.node()
            node.setAttribute("preserveAspectRatio", "none");
            node.setAttribute("width", "100%");
            node.setAttribute("height", "100%");
            this.$container.empty();
            this.$container.get(0).append(svg.node());

            this.adjustLegend();
        },
    });
});
