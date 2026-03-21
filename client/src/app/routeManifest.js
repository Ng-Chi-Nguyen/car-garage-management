/**
 * Route Manifest for GMS Enterprise
 * Maps Stitch exports to frontend routes and implementations.
 *
 * Note: The mechanic flow folder is intentionally excluded as it contains non-routeable support material.
 */

export const routeManifest = [
  {
    exportKey: 'ng_nh_p_gms_enterprise',
    path: '/login',
    layout: 'auth',
    componentPath: 'src/pages/auth/Login.jsx',
    group: 'auth'
  },
  {
    exportKey: 'dashboard_t_ng_quan_gms',
    path: '/dashboard',
    layout: 'app',
    componentPath: 'src/pages/dashboard/Dashboard.jsx',
    group: 'core'
  },
  {
    exportKey: 'tr_ng_th_i_x_ng_gms',
    path: '/workshop',
    layout: 'app',
    componentPath: 'src/pages/workshop/WorkshopStatus.jsx',
    group: 'workshop'
  },
  {
    exportKey: 'ti_p_nh_n_xe_m_i_gms',
    path: '/intake',
    layout: 'app',
    componentPath: 'src/pages/intake/intake-page.jsx',
    group: 'workshop'
  },
  {
    exportKey: 'modal_l_p_phi_u_ti_p_nh_n_gms',
    path: '/intake/new',
    layout: 'app',
    componentPath: 'src/pages/intake/intake-modal-page.jsx',
    group: 'workshop'
  },
  {
    exportKey: 'l_p_phi_u_s_a_ch_a_gms',
    path: '/repair-orders/new',
    layout: 'app',
    componentPath: 'src/pages/repair/repair-order-page.jsx',
    group: 'workshop'
  },
  {
    exportKey: 'qu_n_l_kho_v_t_t_gms',
    path: '/inventory',
    layout: 'app',
    componentPath: 'src/pages/inventory/InventoryManagement.jsx',
    group: 'inventory'
  },
  {
    exportKey: 'th_kho_chi_ti_t_gms',
    path: '/inventory/stock-card',
    layout: 'app',
    componentPath: 'src/pages/inventory/StockDetail.jsx',
    group: 'inventory'
  },
  {
    exportKey: 'thu_ti_n_v_c_ng_n_gms',
    path: '/finance/receivables',
    layout: 'app',
    componentPath: 'src/pages/payments/payments-page.jsx',
    group: 'finance'
  },
  {
    exportKey: 'in_quy_t_to_n_gms',
    path: '/finance/settlement/print',
    layout: 'app',
    componentPath: 'src/pages/settlement/settlement-page.jsx',
    group: 'finance'
  },
  {
    exportKey: 'danh_s_ch_kh_ch_h_ng_gms',
    path: '/customers',
    layout: 'app',
    componentPath: 'src/pages/customers/CustomerList.jsx',
    group: 'crm'
  },
  {
    exportKey: 'h_s_kh_ch_h_ng_chi_ti_t_gms',
    path: '/customers/detail',
    layout: 'app',
    componentPath: 'src/pages/customers/CustomerDetail.jsx',
    group: 'crm'
  },
  {
    exportKey: 'b_o_c_o_kh_ch_h_ng_chuy_n_s_u_gms',
    path: '/customers/analytics',
    layout: 'app',
    componentPath: 'src/pages/customers/CustomerAnalytics.jsx',
    group: 'crm'
  },
  {
    exportKey: 'c_i_t_h_th_ng_gms',
    path: '/settings',
    layout: 'app',
    componentPath: 'src/pages/settings/SystemSettings.jsx',
    group: 'system'
  },
  {
    exportKey: 'nh_t_k_thao_t_c_gms',
    path: '/settings/activity-log',
    layout: 'app',
    componentPath: 'src/pages/settings/ActivityLog.jsx',
    group: 'system'
  },
  {
    exportKey: null, // Not from Stitch export
    path: '*',
    layout: 'app',
    componentPath: 'src/pages/not-found.jsx',
    group: 'system'
  }
];
