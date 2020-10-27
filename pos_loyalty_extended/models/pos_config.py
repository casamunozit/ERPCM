# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _


class PosConfig(models.Model):
    _inherit = 'pos.config'

    vip_prod_id = fields.Many2one(comodel_name='product.product', string='VIP Product')
    vip_pricelist_id = fields.Many2one(comodel_name='product.pricelist', string='VIP Pricelist')


    def write(self, vals):
        result = super(PosConfig, self).write(vals)
        if vals.get('vip_pricelist_id'):
            for record in self:
                record.available_pricelist_ids |= record.vip_pricelist_id
        return result

