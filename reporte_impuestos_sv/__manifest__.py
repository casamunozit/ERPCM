# -*- coding: utf-8 -*-
{
    'name': 'Reporte de Iva Para El Salvador',
    'version': '1.0',
    'category': 'Accounting',
    'description': '''\ Este modulo crea lo necesario para generar un
			reporte impreso de los libros de iva de ventas y compras''',
    'author': 'Intelitecsa(Francisco Trejo, Alberto Castro, Cesar Alvarenga)',
    'website': 'http://www.intelitecsa.com',
    'price': 350.00,
    'currency': 'USD',
    'license': 'GPL-3',
    'data': [
        'report/libro_iva_fcf.xml',
        'report/libro_iva_ccf.xml',
        'report/libro_iva_compras.xml',
        'report/report_libro_iva.xml',
        'report/libro_iva.xml',
        'views/libro_iva_view.xml',
        'views/libro_iva_detalle_consumidor_final.xml',
        'views/libro_iva_detalle_compra.xml',
        'views/libro_iva_detalle_credito_fiscal.xml',
        # 'views/wizard_tax_adjustments.xml',
        'security/ir.model.access.csv',
        'security/iva_security.xml',
        'views/libro_iva_compra_view.xml',
        'views/libro_iva_consumidor_final_view.xml',
        'views/libro_iva_credito_fiscal_view.xml',
    ],
    'demo': [
        'demo/facturas_compras.xml',
        'demo/facturas_credito_fiscales.xml',
        'demo/facturas_consumidor_final.xml'
    ],
    'depends': [
        'base',
        'account',
        'l10n_invoice_sv',
    ],
    'installable': True,
    'auto_install': False,
    'post_init_hook': 'drop_print',
}
