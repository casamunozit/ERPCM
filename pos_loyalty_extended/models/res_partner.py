# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _


class ResPartner(models.Model):
    _inherit = 'res.partner'

    is_vip_customer = fields.Boolean(string='VIP Customer?', copy=False, tracking=True)

    @api.model
    def set_vip_customer(self, partner_id, pricelist_id):
        partner = self.browse(int(partner_id))
        partner.write({
            'is_vip_customer': True,
            'property_product_pricelist': int(pricelist_id),
        })
        return partner.is_vip_customer
