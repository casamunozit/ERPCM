# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _


class ResPartner(models.Model):
    _inherit = 'res.partner'

    is_vip_customer = fields.Boolean(string='VIP Customer?', copy=False, tracking=True)

    @api.model
    def set_vip_customer(self, partner_id):
        partner = self.browse(int(partner_id))
        partner.is_vip_customer = True
        return partner.is_vip_customer
