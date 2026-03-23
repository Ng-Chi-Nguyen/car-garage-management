import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.join(__dirname, '../src/app/routeManifest.js');
const manifestContent = fs.readFileSync(manifestPath, 'utf-8');

const requiredKeys = [
  'ng_nh_p_gms_enterprise',
  'dashboard_t_ng_quan_gms',
  'tr_ng_th_i_x_ng_gms',
  'ti_p_nh_n_xe_m_i_gms',
  'modal_l_p_phi_u_ti_p_nh_n_gms',
  'l_p_phi_u_s_a_ch_a_gms',
  'qu_n_l_kho_v_t_t_gms',
  'th_kho_chi_ti_t_gms',
  'thu_ti_n_v_c_ng_n_gms',
  'in_quy_t_to_n_gms',
  'danh_s_ch_kh_ch_h_ng_gms',
  'h_s_kh_ch_h_ng_chi_ti_t_gms',
  'b_o_c_o_kh_ch_h_ng_chuy_n_s_u_gms',
  'c_i_t_h_th_ng_gms',
  'nh_t_k_thao_t_c_gms'
];

// Extract exportKeys from manifest (primitive regex)
const regex = /exportKey:\s*['"]([^'"]+)['"]/g;
const foundKeys = [];
let match;

while ((match = regex.exec(manifestContent)) !== null) {
  foundKeys.push(match[1]);
}

// Check missing
const missing = requiredKeys.filter(k => !foundKeys.includes(k));
if (missing.length > 0) {
  console.error(`Missing keys: ${missing.join(', ')}`);
  process.exit(1);
}

// Check duplicates
const duplicates = foundKeys.filter((item, index) => foundKeys.indexOf(item) !== index);
if (duplicates.length > 0) {
  console.error(`Duplicate keys: ${duplicates.join(', ')}`);
  process.exit(1);
}

// Check mechanic_flow absent
if (foundKeys.some(k => k.includes('mechanic_flow'))) {
  console.error('mechanic_flow must be absent from route inventory');
  process.exit(1);
}

console.log('Verified 15 Stitch routes (mechanic_flow excluded)');
process.exit(0);
