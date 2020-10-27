odoo.define('pos_loyalty_extended.pos_loyalty_extended', function(require){
"use strict";

var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var rpc = require('web.rpc');
var utils = require('web.utils');

var round_pr = utils.round_precision;

var QWeb = core.qweb;
var _t = core._t;

models.load_fields('res.partner', ['is_vip_customer']);

screens.set_pricelist_button.include({
    button_click: function () {
        var self = this;

        var pricelists = _.map(self.pos.pricelists, function (pricelist) {
            return {
                label: pricelist.name,
                item: pricelist
            };
        });
// To disable the pricelist modification by user.
//-------------------------------------------------
//        self.gui.show_popup('selection',{
//            title: _t('Select pricelist'),
//            list: pricelists,
//            confirm: function (pricelist) {
//                var order = self.pos.get_order();
//                order.set_pricelist(pricelist);
//            },
//            is_selected: function (pricelist) {
//                return pricelist.id === self.pos.get_order().pricelist.id;
//            }
//        });
//-------------------------------------------------
    },
});
screens.OrderWidget.include({
    update_summary: function(){
        this._super();

        var order = this.pos.get_order();

        var $loypoints = $(this.el).find('.summary .loyalty-points');

        if(this.pos.loyalty && order.get_client() && order.get_client().is_vip_customer){
            var points_won      = order.get_won_points();
            var points_spent    = order.get_spent_points();
            var points_total    = order.get_new_total_points();
            $loypoints.replaceWith($(QWeb.render('LoyaltyPoints',{
                widget: this,
                rounding: this.pos.loyalty.rounding,
                points_won: points_won,
                points_spent: points_spent,
                points_total: points_total,
            })));
            $loypoints = $(this.el).find('.summary .loyalty-points');
            $loypoints.removeClass('oe_hidden');

            if(points_total < 0){
                $loypoints.addClass('negative');
            }else{
                $loypoints.removeClass('negative');
            }
        }else{
            $loypoints.empty();
            $loypoints.addClass('oe_hidden');
        }

        if (this.pos.loyalty &&
            this.getParent().action_buttons &&
            this.getParent().action_buttons.loyalty &&
            order.get_client() && order.get_client().is_vip_customer) {

            var rewards = order.get_available_rewards();
            this.getParent().action_buttons.loyalty.highlight(!!rewards.length);
        }
    },
});
var _super = models.Order;
models.Order = models.Order.extend({
    /* The total of points won, excluding the points spent on rewards */
    get_won_points: function(){
        if (this.pos.loyalty && this.get_client() && !this.get_client().is_vip_customer) {
            return 0;
        }
        return _super.prototype.get_won_points.apply(this, arguments);
    },

    /* The total number of points spent on rewards */
    get_spent_points: function() {
        if (this.pos.loyalty && this.get_client() && !this.get_client().is_vip_customer) {
            return 0;
        }
        return _super.prototype.get_spent_points.apply(this, arguments);
    },

    /* The total number of points lost or won after the order is validated */
    get_new_points: function() {
        if (this.pos.loyalty && this.get_client() && !this.get_client().is_vip_customer) {
            return 0;
        }
        return _super.prototype.get_new_points.apply(this, arguments);
    },

    /* The total number of points that the customer will have after this order is validated */
    get_new_total_points: function() {
        if (this.pos.loyalty && this.get_client() && !this.get_client().is_vip_customer) {
            return 0;
        }
        return _super.prototype.get_new_total_points.apply(this, arguments);
    },

    /* The number of loyalty points currently owned by the customer */
    get_current_points: function(){
        return (this.get_client() && this.get_client().is_vip_customer) ? this.get_client().loyalty_points : 0;
    },

    /* The total number of points spendable on rewards */
    get_spendable_points: function(){
        if (this.pos.loyalty && this.get_client() && !this.get_client().is_vip_customer) {
            return 0;
        }
        return _super.prototype.get_spendable_points.apply(this, arguments);
    },
    get_available_rewards: function(){
        var client = this.get_client();
        if (client && !client.is_vip_customer) {
            return [];
        }
        return _super.prototype.get_available_rewards.apply(this, arguments);
    },
    set_client: function(client){
        if (client && this.pos.config.vip_prod_id){
            var self = this;
            var vip_prod = _.find(this.orderlines.models, function(ol){ return ol.product.id == self.pos.config.vip_prod_id[0]});
            if (vip_prod && !client.is_vip_customer){
                rpc.query({
                    model: 'res.partner',
                    method: 'set_vip_customer',
                    args: [client.id, this.pos.config.vip_pricelist_id[0]],
                }).then(function(partner_is_customer){
                    client.is_vip_customer = partner_is_customer;
                });
            }
        }
        return _super.prototype.set_client.apply(this, arguments);
    },
    add_product: function(product, options){
        var result = _super.prototype.add_product.apply(this, arguments);
        if (product.id === this.pos.config.vip_prod_id[0]) {
            var pl_id = this.pos.config.vip_pricelist_id[0];
            this.set_pricelist(_.find(this.pos.pricelists, function(pl){ return pl.id == pl_id}))
        }
        if (this.get_client() && !this.get_client().is_vip_customer) {
            self = this;
            var client = this.get_client();
            rpc.query({
                model: 'res.partner',
                method: 'set_vip_customer',
                args: [client.id, this.pricelist.id],
            }).then(function(partner_is_customer){
                client.is_vip_customer = partner_is_customer;
                self.set_client(client);
            });
        }
        return result;
    }
});
});