# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': "POS Loyalty for VIP Members",
    'version': '1.0',
    'depends': ['point_of_sale', 'pos_loyalty'],
    'author': 'Odoo Inc',
    'license': 'OEEL-1',
    'mainainer': 'Odoo Inc',
    'category': 'Sales/Point Of Sale',
    'description': """
POS Loyalty for VIP Members
===========================
- POS loyalty for VIP Members only.
- Restrict POS user from changing pricelist.
- Apply Loyalty Pricelist when customer purchases POS Loyalty product via POS.
- Change the customer's VIP flag if customer buys VIP product.
    """,
    # data files always loaded at installation
    'data': [
        'views/res_partner_views.xml',
        'views/pos_config_views.xml',
        'views/templates.xml',
    ],
}