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

define('views/settings/fields/tab-list', 'views/fields/array', function (Dep) {

    return Dep.extend({

        addItemModalView: 'views/settings/modals/tab-list-field-add',

        setupOptions: function () {

            this.params.options = Object.keys(this.getMetadata().get('scopes')).filter(function (scope) {
                if (this.getMetadata().get('scopes.' + scope + '.disabled')) return;
                return this.getMetadata().get('scopes.' + scope + '.tab');
            }, this).sort(function (v1, v2) {
                return this.translate(v1, 'scopeNamesPlural').localeCompare(this.translate(v2, 'scopeNamesPlural'));
            }.bind(this));

            this.params.options.push('_delimiter_');
            this.params.options.push('_delimiter-ext_');

            this.translatedOptions = {};

            this.params.options.forEach(function (item) {
                this.translatedOptions[item] = this.translate(item, 'scopeNamesPlural');
            }, this);

            this.translatedOptions['_delimiter_'] = '. . .';
            this.translatedOptions['_delimiter-ext_'] = '. . .';
        },

        addValue: function (value) {
            if (value && typeof value === 'object') {
                if (!value.id) {
                    value.id = Math.floor(Math.random() * 1000000 + 1).toString();
                }

                var html = this.getItemHtml(value);

                this.$list.append(html);

                this.selected.push(value);

                this.trigger('change');

                return;
            }

            Dep.prototype.addValue.call(this, value);
        },

        removeValue: function (value) {
            var index = this.getGroupIndexById(value);

            if (~index) {
                this.$list.children('[data-value="' + value + '"]').remove();

                this.selected.splice(index, 1);
                this.trigger('change');

                return;
            }

            Dep.prototype.removeValue.call(this, value);
        },

        getItemHtml: function (value) {
            if (value && typeof value === 'object') {
                return this.getGroupItemHtml(value);
            }

            return Dep.prototype.getItemHtml.call(this, value);
        },

        getGroupItemHtml: function (item) {
            var label = this.escapeValue(item.label || '');

            var html = '<div class="list-group-item" data-value="' + item.id + '" style="cursor: default;">' +
                '<a href="javascript:" class="" data-value="' + item.id + '" ' +
                    'data-action="editGroup" style="margin-right: 7px;">' +
                '<span class="fas fa-pencil-alt fa-sm"></span>' +
                '</a>' +
                label +
                '&nbsp;' +
                '<a href="javascript:" class="pull-right" data-value="' + item.id + '" data-action="removeValue">' +
                '<span class="fas fa-times"></span>' +
                '</a>' +
                '</div>';

            return html;
        },

        fetchFromDom: function () {
            var selected = [];

            this.$el.find('.list-group .list-group-item').each(function (i, el) {
                var value = $(el).data('value').toString();

                var groupItem = this.getGroupValueById(value);

                if (groupItem) {
                    selected.push(groupItem);

                    return;
                }

                selected.push(value);
            }.bind(this));

            this.selected = selected;
        },

        getGroupIndexById: function (id) {
            for (var i = 0; i < this.selected.length; i++) {
                var item = this.selected[i];

                if (item && typeof item === 'object') {
                    if (item.id === id) {
                        return i;
                    }
                }
            }

            return -1;
        },

        getGroupValueById: function (id) {
            for (var item of this.selected) {
                if (item && typeof item === 'object') {
                    if (item.id === id) {
                        return item;
                    }
                }
            }

            return null;
        },

    });
});
