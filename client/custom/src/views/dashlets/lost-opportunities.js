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

define('custom:views/dashlets/lost-opportunities', ['crm:views/dashlets/abstract/chart', 'lib!d3', 'lib!vega'], function (Dep) {

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

            var yourVlSpec = {
                width: '100%',
                height: '100%',
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                description: 'A simple bar chart with embedded data.',
                data: {
                    values: [
                        { a: 'A', b: 28 },
                        { a: 'B', b: 55 },
                        { a: 'C', b: 43 },
                        { a: 'D', b: 91 },
                        { a: 'E', b: 81 },
                        { a: 'F', b: 53 },
                        { a: 'G', b: 19 },
                        { a: 'H', b: 87 },
                        { a: 'I', b: 52 }
                    ]
                },
                mark: {
                    type: "line",
                    interpolate: "monotone"
                },
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'quantitative' }
                }
            };

            this.$container.empty();
            vegaEmbed(this.$container.get(0), yourVlSpec);

            this.adjustLegend();
        },
    });
});
