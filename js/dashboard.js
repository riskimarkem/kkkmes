// ============================================
//  DASHBOARD.JS v3 — KopKar MES (Enhanced Demo)
// ============================================

const _raw = sessionStorage.getItem('kmes_user');
if (!_raw) location.href = 'index.html';
const USER = JSON.parse(_raw);

// ============================================
//  INITIAL STATE (for Reset Demo feature)
// ============================================
const INITIAL_STATE = {
  PRODUCTS: [
    {kode:'BRG001',nama:'Kopi Kapal Api',    kat:'Minuman',   harga:15000,stok:48, emo:'☕'},
    {kode:'BRG002',nama:'Gula Pasir 1kg',    kat:'Sembako',   harga:14000,stok:32, emo:'🧂'},
    {kode:'BRG003',nama:'Sabun Lifebuoy',    kat:'Kebersihan',harga:7000, stok:60, emo:'🧼'},
    {kode:'BRG004',nama:'Mie Indomie Goreng',kat:'Snack',     harga:3500, stok:120,emo:'🍜'},
    {kode:'BRG005',nama:'Minyak Goreng 1L',  kat:'Sembako',   harga:17000,stok:25, emo:'🫙'},
    {kode:'BRG006',nama:'Teh Botol Sosro',   kat:'Minuman',   harga:5000, stok:72, emo:'🍵'},
    {kode:'BRG007',nama:'Sampo Rejoice',     kat:'Kebersihan',harga:12000,stok:15, emo:'🧴'},
    {kode:'BRG008',nama:'Beras Cap Jago 5kg',kat:'Sembako',   harga:65000,stok:10, emo:'🌾'},
    {kode:'BRG009',nama:'Chitato Sapi',      kat:'Snack',     harga:8000, stok:55, emo:'🥔'},
    {kode:'BRG010',nama:'Aqua 600ml',        kat:'Minuman',   harga:3000, stok:200,emo:'💧'},
    {kode:'BRG011',nama:'Detergen Rinso',    kat:'Kebersihan',harga:18000,stok:0,  emo:'🧽'},
    {kode:'BRG012',nama:'Wafer Tango Coklat',kat:'Snack',     harga:6000, stok:40, emo:'🍫'},
  ],
  PINJAMAN_DB: [
    {id:'LN-0023',nik:'29226',nama:'Riski Hariyanto',tujuan:'Renovasi Rumah',    nominal:10000000,tenor:24,cicilan:481667,lunas:8, status:'active',  tgl:'2024-01-15'},
    {id:'LN-0031',nik:'2002',nama:'Siti Rahayu',    tujuan:'Biaya Pendidikan',  nominal:5000000, tenor:12,cicilan:260417,lunas:3, status:'pending', tgl:'2025-03-10'},
    {id:'LN-0028',nik:'2003',nama:'Ahmad Fauzi',    tujuan:'Modal Usaha',       nominal:8000000, tenor:18,cicilan:407778,lunas:18,status:'done',    tgl:'2023-06-01'},
    {id:'LN-0035',nik:'2004',nama:'Dewi Lestari',   tujuan:'Biaya Kesehatan',   nominal:3000000, tenor:6, cicilan:162500,lunas:0, status:'approved',tgl:'2025-04-10'},
    {id:'LN-0037',nik:'29226',nama:'Riski Hariyanto',tujuan:'Kebutuhan Keluarga',nominal:2000000, tenor:6, cicilan:108333,lunas:0, status:'pending', tgl:'2025-04-18'},
  ],
  RW_BELANJA: [
    {id:'#TRX-0035',tgl:'10 Apr 2025',produk:'Kopi x2, Gula 1kg',   total:44000, status:'Selesai'},
    {id:'#TRX-0028',tgl:'05 Apr 2025',produk:'Sabun x3',             total:19950, status:'Selesai'},
    {id:'#TRX-0021',tgl:'01 Apr 2025',produk:'Mie x5, Teh Botol x2', total:25650, status:'Selesai'},
  ]
};

// ============================================
//  MOCK DATABASE
// ============================================
let PRODUCTS = JSON.parse(JSON.stringify(INITIAL_STATE.PRODUCTS));

const USERS_DATA = [
  {nik:'1001',nama:'Agus Susanto', dept:'Manajemen',role:'admin',   status:'aktif'},
  {nik:'1002',nama:'Rina Marlina', dept:'Manajemen',role:'admin',   status:'aktif'},
  {nik:'29226',nama:'Riski Hariyanto', dept:'Produksi', role:'karyawan',status:'aktif'},
  {nik:'2002',nama:'Siti Rahayu',  dept:'Keuangan', role:'karyawan',status:'aktif'},
  {nik:'2003',nama:'Ahmad Fauzi',  dept:'HRD',      role:'karyawan',status:'aktif'},
  {nik:'2004',nama:'Dewi Lestari', dept:'Marketing',role:'karyawan',status:'aktif'},
  {nik:'2005',nama:'Rudi Hartono', dept:'Produksi', role:'karyawan',status:'nonaktif'},
];

// SIMPANAN per karyawan (keyed by NIK)
const SIMPANAN_DB = {
  '29226':{ pokok:500000, wajib:2400000, sukarela:750000 },
  '2002':{ pokok:500000, wajib:1800000, sukarela:300000 },
  '2003':{ pokok:500000, wajib:1200000, sukarela:0 },
  '2004':{ pokok:500000, wajib:900000,  sukarela:1200000 },
  '2005':{ pokok:500000, wajib:600000,  sukarela:0 },
};
const SHU_RATE = 0.12; // 12% dari total simpanan (estimasi)

// PINJAMAN
let PINJAMAN_DB = JSON.parse(JSON.stringify(INITIAL_STATE.PINJAMAN_DB));

// RIWAYAT BELANJA
let RW_BELANJA = JSON.parse(JSON.stringify(INITIAL_STATE.RW_BELANJA));

const RW_CICILAN = [
  {id:'#CIC-024',tgl:'01 Apr 2025',ket:'Cicilan LN-0023 (ke-9)',  jml:481667,status:'Lunas'},
  {id:'#CIC-023',tgl:'01 Mar 2025',ket:'Cicilan LN-0023 (ke-8)',  jml:481667,status:'Lunas'},
  {id:'#CIC-022',tgl:'01 Feb 2025',ket:'Cicilan LN-0023 (ke-7)',  jml:481667,status:'Lunas'},
];
const MUTASI = [
  {tgl:'01 Apr 2025',ket:'Simpanan Wajib Bulan April',jenis:'Wajib',jml:200000},
  {tgl:'15 Mar 2025',ket:'Setoran Sukarela',           jenis:'Sukarela',jml:250000},
  {tgl:'01 Mar 2025',ket:'Simpanan Wajib Bulan Maret', jenis:'Wajib',jml:200000},
  {tgl:'10 Feb 2025',ket:'Setoran Sukarela',           jenis:'Sukarela',jml:500000},
  {tgl:'01 Feb 2025',ket:'Simpanan Wajib Bulan Feb',   jenis:'Wajib',jml:200000},
];

// STATE
let cart = [];
let activeFilter = 'semua';
let selectedTenor = 6;
let amortOpen = false;

// ============================================
//  DEMO ENHANCEMENTS
// ============================================
let resetClickCount = 0;
let resetTimer = null;
let activityInterval = null;

// Hidden Reset Feature (Triple-click logo)
function initResetFeature() {
  const logos = document.querySelectorAll('.brand-hex, .brand-hex-sm');
  logos.forEach(logo => {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      resetClickCount++;
      clearTimeout(resetTimer);
      
      if (resetClickCount === 3) {
        if (confirm('🔄 Reset semua data demo ke kondisi awal?\n\nSemua perubahan akan dikembalikan.')) {
          resetDemoData();
          showToast('✅ Data demo berhasil direset!', 'toast-ok');
        }
        resetClickCount = 0;
      } else {
        resetTimer = setTimeout(() => { resetClickCount = 0; }, 1000);
      }
    });
  });
}

function resetDemoData() {
  PRODUCTS = JSON.parse(JSON.stringify(INITIAL_STATE.PRODUCTS));
  PINJAMAN_DB = JSON.parse(JSON.stringify(INITIAL_STATE.PINJAMAN_DB));
  RW_BELANJA = JSON.parse(JSON.stringify(INITIAL_STATE.RW_BELANJA));
  cart = [];
  
  if (USER.role === 'admin') {
    renderAdminPinjaman();
    renderBarang(PRODUCTS);
    renderUsers();
    renderApproval();
  } else {
    renderSaldoWidget();
    renderKarPinjamanWidget();
    renderKarTxWidget();
    renderKatalog(PRODUCTS);
    renderPinjamanStatus();
    renderRwBelanja();
  }
}

// Real-time Activity Simulation (Admin only)
const ACTIVITY_TEMPLATES = [
  { msg: '{nama} baru saja melakukan setoran sukarela Rp {amount}', icon: '💰' },
  { msg: 'Stok {produk} menipis (tersisa {stok} unit)', icon: '⚠️' },
  { msg: '{nama} mengajukan pinjaman Rp {amount}', icon: '📝' },
  { msg: 'Transaksi belanja #{trx} senilai Rp {amount} berhasil', icon: '🛒' },
  { msg: 'Cicilan #{cic} dari {nama} telah dibayarkan', icon: '✅' },
];

function startActivitySimulation() {
  if (USER.role !== 'admin') return;
  
  const randomActivity = () => {
    const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
    const karyawan = USERS_DATA.filter(u => u.role === 'karyawan')[Math.floor(Math.random() * 4)];
    const produk = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    
    let msg = template.msg
      .replace('{nama}', karyawan.nama)
      .replace('{amount}', (Math.floor(Math.random() * 10) + 1) * 50000)
      .replace('{produk}', produk.nama)
      .replace('{stok}', Math.floor(Math.random() * 15) + 1)
      .replace('{trx}', String(Math.floor(Math.random() * 9000) + 1000))
      .replace('{cic}', String(Math.floor(Math.random() * 100) + 1));
    
    showToast(template.icon + ' ' + msg, 'toast-info', 4000);
  };
  
  // Random interval between 45-75 seconds
  activityInterval = setInterval(() => {
    randomActivity();
  }, (Math.random() * 30000) + 45000);
}

// ============================================
//  INIT
// ============================================
function init() {
  const role = USER.role;
  const initial = USER.nama.charAt(0).toUpperCase();

  // Sidebar user
  document.getElementById('sbAvatar').textContent = initial;
  document.getElementById('tbAvatar').textContent = initial;
  document.getElementById('sbUname').textContent  = USER.nama;
  const roleEl = document.getElementById('sbUrole');
  roleEl.textContent = role === 'admin' ? 'Administrator' : 'Karyawan';
  roleEl.className = 'sb-urole ' + role;

  // Greeting
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Selamat pagi,' : hour < 15 ? 'Selamat siang,' : hour < 18 ? 'Selamat sore,' : 'Selamat malam,';

  if (role === 'admin') {
    document.getElementById('navAdmin').style.display = 'block';
    document.getElementById('admGreet').textContent = greet;
    document.getElementById('admName').textContent  = USER.nama;
    renderAdminPinjaman();
    renderBarang(PRODUCTS);
    renderUsers();
    renderApproval();
    showSec('adm-home');
    
    // Start real-time activity simulation for admin
    startActivitySimulation();
  } else {
    document.getElementById('navKaryawan').style.display = 'block';
    document.getElementById('karGreet').textContent = greet;
    document.getElementById('karName').textContent  = USER.nama;
    renderSaldoWidget();
    renderKarPinjamanWidget();
    renderKarTxWidget();
    renderKatalog(PRODUCTS);
    renderPinjamanStatus();
    renderMutasi();
    renderRwBelanja();
    renderRwCicilan();
    showSec('kar-home');
  }

  // Initialize demo enhancements
  initResetFeature();
  initCharts();

  // Nav links
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const s = a.getAttribute('data-sec');
      if (s) showSec(s);
    });
  });

  // Sidebar
  document.getElementById('hamBtn').addEventListener('click', openSidebar);
  document.getElementById('sbClose').addEventListener('click', closeSidebar);
  document.getElementById('sbOverlay').addEventListener('click', closeSidebar);
  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearInterval(activityInterval);
    sessionStorage.removeItem('kmes_user');
    location.href = 'index.html';
  });

  // Forms
  document.getElementById('formBarang').addEventListener('submit', saveBarang);
  document.getElementById('loanForm').addEventListener('submit', submitLoan);
}

function openSidebar()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sbOverlay').classList.add('show'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sbOverlay').classList.remove('show'); }

const SEC_TITLES = {
  'adm-home':'Beranda','adm-barang':'Kelola Barang','adm-pengguna':'Kelola Pengguna',
  'adm-pinjaman':'Approval Pinjaman','adm-laporan':'Laporan',
  'kar-home':'Beranda','kar-simpanan':'Saldo Simpanan','kar-pinjaman':'Pinjaman',
  'kar-katalog':'Belanja Koperasi','kar-keranjang':'Keranjang','kar-riwayat':'Riwayat',
};

function showSec(id) {
  // Add skeleton loader simulation
  const targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.style.opacity = '0.3';
    setTimeout(() => {
      targetSection.style.opacity = '1';
    }, 600);
  }

  document.querySelectorAll('.sec').forEach(s => s.style.display = 'none');
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('data-sec') === id));
  document.getElementById('tbTitle').textContent = SEC_TITLES[id] || 'Dashboard';
  closeSidebar();
  if (id === 'kar-keranjang') renderCart();
  if (id === 'kar-simpanan')  renderSaldoDetail();
}

// ============================================
//  CHARTS & ANALYTICS
// ============================================
function initCharts() {
  // This will be loaded after Chart.js is included
  if (typeof Chart === 'undefined') return;
  
  // Tren Omset Bulanan (Line Chart)
  const ctxOmset = document.getElementById('chartOmset');
  if (ctxOmset) {
    new Chart(ctxOmset, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        datasets: [{
          label: 'Omset (juta)',
          data: [2.5, 3.1, 2.8, 3.5, 4.2, 3.9],
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: val => 'Rp ' + val + 'M' } }
        }
      }
    });
  }
  
  // Status Pinjaman (Pie Chart)
  const ctxPinjaman = document.getElementById('chartPinjaman');
  if (ctxPinjaman) {
    const active = PINJAMAN_DB.filter(p => p.status === 'active').length;
    const pending = PINJAMAN_DB.filter(p => p.status === 'pending').length;
    const done = PINJAMAN_DB.filter(p => p.status === 'done').length;
    
    new Chart(ctxPinjaman, {
      type: 'doughnut',
      data: {
        labels: ['Aktif', 'Menunggu', 'Lunas'],
        datasets: [{
          data: [active, pending, done],
          backgroundColor: ['#16a34a', '#f59e0b', '#3b82f6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

// PDF Export Simulation
function exportPDF(type) {
  showToast('⏳ Menyiapkan laporan...', 'toast-info');
  
  setTimeout(() => {
    // Simulate PDF generation
    const fileName = type === 'admin' ? 'Laporan_Admin_KopKar.pdf' : 'Struk_Transaksi.pdf';
    showToast('✅ ' + fileName + ' siap diunduh!', 'toast-ok');
    
    // In real implementation, use jsPDF here
    // For demo, just show the toast
  }, 1200);
}

// ============================================
//  SALDO & SIMPANAN
// ============================================
function getSimpanan() {
  const base = SIMPANAN_DB[USER.nik] || { pokok:500000, wajib:600000, sukarela:0 };
  const total = base.pokok + base.wajib + base.sukarela;
  const shu   = Math.round(total * SHU_RATE);
  return { ...base, total, shu };
}

function renderSaldoWidget() {
  const s = getSimpanan();
  document.getElementById('totalSaldo').textContent = rp(s.total);
  document.getElementById('saldoNIK').textContent   = 'NIK: ' + USER.nik;
  document.getElementById('simpPok').textContent    = rp(s.pokok);
  document.getElementById('simpWaj').textContent    = rp(s.wajib);
  document.getElementById('simpSuk').textContent    = rp(s.sukarela);
  document.getElementById('simpSHU').textContent    = rp(s.shu);
}

function renderSaldoDetail() {
  const s = getSimpanan();
  document.getElementById('detPok').textContent = rp(s.pokok);
  document.getElementById('detWaj').textContent = rp(s.wajib);
  document.getElementById('detSuk').textContent = rp(s.sukarela);
  document.getElementById('detTot').textContent = rp(s.total);
  document.getElementById('detSHU').textContent = rp(s.shu);
}

// ============================================
//  PINJAMAN (Karyawan view)
// ============================================
function renderKarPinjamanWidget() {
  const mine = PINJAMAN_DB.filter(p => p.nik === USER.nik);
  if (!mine.length) {
    document.getElementById('widPinjamanVal').textContent = 'Rp 0';
    document.getElementById('widPinjamanKet').textContent = 'Tidak ada pinjaman';
    return;
  }
  const active = mine.find(p => p.status === 'active');
  if (active) {
    const sisa = active.nominal - (active.lunas * active.cicilan);
    document.getElementById('widPinjamanVal').textContent = rp(sisa);
    document.getElementById('widPinjamanKet').textContent = `Sisa ${active.tenor - active.lunas} bulan`;
  } else {
    document.getElementById('widPinjamanVal').textContent = 'Rp 0';
    document.getElementById('widPinjamanKet').textContent = mine[0].status === 'pending' ? 'Menunggu approval' : 'Lunas';
  }
}

function renderKarTxWidget() {
  const cnt = RW_BELANJA.length;
  const sum = RW_BELANJA.reduce((s, t) => s + t.total, 0);
  document.getElementById('widTxCnt').textContent  = cnt + ' transaksi';
  document.getElementById('widTxVal').textContent = rp(sum);
}

function renderPinjamanStatus() {
  const cont = document.getElementById('myPinjamanCont');
  if (!cont) return;
  const mine = PINJAMAN_DB.filter(p => p.nik === USER.nik);
  if (!mine.length) {
    cont.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)">Belum ada pengajuan pinjaman.</div>';
    return;
  }
  cont.innerHTML = mine.map(p => {
    const sisa = p.nominal - (p.lunas * p.cicilan);
    const pct  = Math.round((p.lunas / p.tenor) * 100);
    const statusBadge = p.status === 'active' ? 'badge-warn' : p.status === 'pending' ? 'badge-pending' : p.status === 'approved' ? 'badge-ok' : 'badge-done';
    const statusLabel = p.status === 'active' ? 'Aktif' : p.status === 'pending' ? 'Menunggu' : p.status === 'approved' ? 'Disetujui' : 'Lunas';
    return `
      <div class="pcard">
        <div class="pcard-head">
          <div style="flex:1">
            <div class="pcard-id">${p.id}</div>
            <div class="pcard-tujuan">${p.tujuan}</div>
          </div>
          <span class="badge ${statusBadge}">${statusLabel}</span>
        </div>
        <div class="pcard-body">
          <div class="pcard-row"><span>Nominal Pinjaman</span><strong>${rp(p.nominal)}</strong></div>
          <div class="pcard-row"><span>Cicilan/bulan</span><strong>${rp(p.cicilan)}</strong></div>
          <div class="pcard-row"><span>Tenor</span><strong>${p.tenor} bulan</strong></div>
          ${p.status === 'active' || p.status === 'done' ? `<div class="pcard-row"><span>Sisa Hutang</span><strong style="color:var(--primary)">${rp(sisa)}</strong></div>` : ''}
        </div>
        ${p.status === 'active' || p.status === 'done' ? `<div class="pcard-prog">
          <div class="pprog-label"><span>Lunas ${p.lunas}/${p.tenor}</span><span>${pct}%</span></div>
          <div class="pprog-bar"><div class="pprog-fill" style="width:${pct}%"></div></div>
        </div>` : ''}
      </div>
    `;
  }).join('');
}

function renderMutasi() {
  const b = document.getElementById('tbMutasi');
  if (!b) return;
  b.innerHTML = MUTASI.map((m, i) => `<tr>
    <td>${i + 1}</td><td>${m.tgl}</td><td>${m.ket}</td>
    <td><span class="badge ${m.jenis === 'Wajib' ? 'badge-warn' : 'badge-ok'}">${m.jenis}</span></td>
    <td style="font-weight:700;color:var(--primary)">${rp(m.jml)}</td>
  </tr>`).join('');
}

// ============================================
//  ADMIN — OVERVIEW
// ============================================
function renderAdminPinjaman() {
  const totalPinjam = PINJAMAN_DB.reduce((s, p) => s + p.nominal, 0);
  const aktif       = PINJAMAN_DB.filter(p => p.status === 'active').length;
  const pending     = PINJAMAN_DB.filter(p => p.status === 'pending').length;
  
  document.getElementById('adm-total-pinjam').textContent = rp(totalPinjam);
  document.getElementById('adm-aktif').textContent        = aktif + ' pinjaman';
  document.getElementById('adm-pending').textContent      = pending + ' menunggu';
}

// ============================================
//  ADMIN — BARANG
// ============================================
function renderBarang(list) {
  const b = document.getElementById('tbodyBarang');
  if (!b) return;
  b.innerHTML = list.map((p, i) => `<tr>
    <td>${i + 1}</td><td>${p.emo} ${p.nama}</td><td>${p.kat}</td>
    <td>${rp(p.harga)}</td><td>${p.stok}</td>
    <td><button class="btn-s btn-edit" onclick="editBarang('${p.kode}')">Edit</button></td>
  </tr>`).join('');
}

function editBarang(kode) {
  const p = PRODUCTS.find(x => x.kode === kode);
  if (!p) return;
  document.getElementById('brgKode').value = p.kode;
  document.getElementById('brgNama').value = p.nama;
  document.getElementById('brgKat').value  = p.kat;
  document.getElementById('brgHarga').value = p.harga;
  document.getElementById('brgStok').value  = p.stok;
  document.getElementById('modalBarang').classList.add('show');
}

function closeBarangModal() {
  document.getElementById('modalBarang').classList.remove('show');
  document.getElementById('formBarang').reset();
}

function saveBarang(e) {
  e.preventDefault();
  const kode = document.getElementById('brgKode').value;
  const p = PRODUCTS.find(x => x.kode === kode);
  if (p) {
    p.nama  = document.getElementById('brgNama').value;
    p.kat   = document.getElementById('brgKat').value;
    p.harga = parseInt(document.getElementById('brgHarga').value);
    p.stok  = parseInt(document.getElementById('brgStok').value);
  }
  renderBarang(PRODUCTS);
  closeBarangModal();
  showToast('Barang berhasil diupdate ✓', 'toast-ok');
}

// ============================================
//  ADMIN — PENGGUNA
// ============================================
function renderUsers() {
  const b = document.getElementById('tbUsers');
  if (!b) return;
  b.innerHTML = USERS_DATA.map((u, i) => `<tr>
    <td>${i + 1}</td><td>${u.nik}</td><td>${u.nama}</td><td>${u.dept}</td>
    <td><span class="badge ${u.role === 'admin' ? 'badge-primary' : 'badge-ok'}">${u.role}</span></td>
    <td><span class="badge ${u.status === 'aktif' ? 'badge-ok' : 'badge-muted'}">${u.status}</span></td>
  </tr>`).join('');
}

// ============================================
//  ADMIN — APPROVAL
// ============================================
function renderApproval() {
  const cont = document.getElementById('approvalList');
  if (!cont) return;
  const pending = PINJAMAN_DB.filter(p => p.status === 'pending' || p.status === 'approved');
  if (!pending.length) {
    cont.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)">Tidak ada pengajuan menunggu.</div>';
    return;
  }
  cont.innerHTML = pending.map(p => {
    const u = USERS_DATA.find(x => x.nik === p.nik);
    return `
      <div class="appr-card">
        <div class="appr-head">
          <div style="flex:1">
            <div class="appr-id">${p.id}</div>
            <div class="appr-nama">${p.nama} <span class="appr-dept">(${u ? u.dept : 'N/A'})</span></div>
          </div>
          <span class="badge ${p.status === 'approved' ? 'badge-ok' : 'badge-pending'}">${p.status === 'approved' ? 'Disetujui' : 'Menunggu'}</span>
        </div>
        <div class="appr-body">
          <div class="appr-row"><span>Tujuan</span><strong>${p.tujuan}</strong></div>
          <div class="appr-row"><span>Nominal</span><strong>${rp(p.nominal)}</strong></div>
          <div class="appr-row"><span>Tenor</span><strong>${p.tenor} bulan</strong></div>
          <div class="appr-row"><span>Cicilan/bulan</span><strong>${rp(p.cicilan)}</strong></div>
          <div class="appr-row"><span>Tanggal Pengajuan</span><strong>${p.tgl}</strong></div>
        </div>
        ${p.status === 'pending' ? `<div class="appr-foot">
          <button class="btn-appr-reject" onclick="handleApproval('${p.id}','reject')">Tolak</button>
          <button class="btn-appr-ok" onclick="handleApproval('${p.id}','approve')">
            <span class="appr-btn-label">Setujui Pinjaman</span>
            <span class="appr-btn-spin" style="display:none">
              <svg class="spin-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:20px;height:20px">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.2"/>
                <path d="M12 2a10 10 0 0110 10" class="sp"/>
              </svg>
            </span>
          </button>
        </div>` : '<div class="appr-foot" style="justify-content:center;padding:12px;color:var(--success)">✓ Pinjaman telah disetujui</div>'}
      </div>
    `;
  }).join('');
}

function handleApproval(id, action) {
  const p = PINJAMAN_DB.find(x => x.id === id);
  if (!p) return;
  
  const btn = event.target.closest('.btn-appr-ok');
  if (btn && action === 'approve') {
    const label = btn.querySelector('.appr-btn-label');
    const spin = btn.querySelector('.appr-btn-spin');
    label.style.display = 'none';
    spin.style.display = 'flex';
    btn.disabled = true;
    
    setTimeout(() => {
      if (action === 'approve') p.status = 'approved';
      else p.status = 'rejected';
      renderApproval();
      renderAdminPinjaman();
      showToast(action === 'approve' ? `✓ Pinjaman ${id} disetujui` : `Pinjaman ${id} ditolak`, action === 'approve' ? 'toast-ok' : 'toast-err');
    }, 800);
  } else {
    if (action === 'approve') p.status = 'approved';
    else p.status = 'rejected';
    renderApproval();
    renderAdminPinjaman();
    showToast(action === 'approve' ? `✓ Pinjaman ${id} disetujui` : `Pinjaman ${id} ditolak`, action === 'approve' ? 'toast-ok' : 'toast-err');
  }
}

// ============================================
//  PENGAJUAN PINJAMAN (Karyawan)
// ============================================
function submitLoan(e) {
  e.preventDefault();
  const nominal = parseInt(document.getElementById('loanNominal').value);
  const tujuan  = document.getElementById('loanTujuan').value;
  const tenor   = selectedTenor;
  const bunga   = 0.01;
  const cicilan = Math.round((nominal * (1 + bunga * tenor)) / tenor);
  const newId   = 'LN-' + String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  
  PINJAMAN_DB.push({
    id: newId, nik: USER.nik, nama: USER.nama, tujuan, nominal, tenor, cicilan, lunas: 0, status: 'pending', tgl: today()
  });
  
  renderPinjamanStatus();
  showToast(`✓ Pinjaman ${newId} berhasil diajukan!`, 'toast-ok');
  document.getElementById('loanForm').reset();
  setTimeout(() => showSec('kar-pinjaman'), 1200);
}

function setTenor(btn, t) {
  selectedTenor = t;
  document.querySelectorAll('.tenor-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateSimulasi();
}

function updateSimulasi() {
  const nominal = parseInt(document.getElementById('loanNominal').value) || 0;
  const bunga   = 0.01;
  const cicilan = nominal > 0 ? Math.round((nominal * (1 + bunga * selectedTenor)) / selectedTenor) : 0;
  const total   = cicilan * selectedTenor;
  
  document.getElementById('simNominal').textContent = rp(nominal);
  document.getElementById('simTenor').textContent   = selectedTenor + ' bulan';
  document.getElementById('simCicilan').textContent = rp(cicilan);
  document.getElementById('simTotal').textContent   = rp(total);
}

function toggleAmort() {
  amortOpen = !amortOpen;
  const el = document.getElementById('amortTable');
  el.style.display = amortOpen ? 'block' : 'none';
  if (amortOpen) {
    const nominal = parseInt(document.getElementById('loanNominal').value) || 0;
    const bunga   = 0.01;
    const cicilan = nominal > 0 ? Math.round((nominal * (1 + bunga * selectedTenor)) / selectedTenor) : 0;
    let sisa = nominal;
    let html = '<table class="tbl"><thead><tr><th>Bln</th><th>Cicilan</th><th>Sisa</th></tr></thead><tbody>';
    for (let i = 1; i <= selectedTenor; i++) {
      sisa = Math.max(0, sisa - cicilan);
      html += `<tr><td>${i}</td><td>${rp(cicilan)}</td><td>${rp(sisa)}</td></tr>`;
    }
    html += '</tbody></table>';
    el.innerHTML = html;
  }
}

// ============================================
//  KATALOG & KERANJANG
// ============================================
function renderKatalog(list) {
  const g = document.getElementById('prodGrid');
  if (!g) return;
  const fl = activeFilter === 'semua' ? list : list.filter(p => p.kat === activeFilter);
  if (!fl.length) { g.innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--muted)">Produk tidak ditemukan.</div>`; return; }
  g.innerHTML = fl.map(p => `
    <div class="prod-card">
      <div class="prod-img">${p.emo}</div>
      <div class="prod-body">
        <div class="prod-cat">${p.kat}</div>
        <div class="prod-name">${p.nama}</div>
        <div class="prod-price">${rp(p.harga)}</div>
        <div class="prod-stok">${p.stok === 0 ? '❌ Habis' : `✅ Stok: ${p.stok}`}</div>
      </div>
      <div class="prod-foot">
        <button class="btn-add" ${p.stok === 0 ? 'disabled' : ''} onclick="addToCart('${p.kode}')">
          ${p.stok === 0 ? 'Habis' : '+ Keranjang'}
        </button>
      </div>
    </div>
  `).join('');
}

function setFtab(btn, kat) {
  activeFilter = kat;
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderKatalog(PRODUCTS);
}

function filterKatalog(q) {
  renderKatalog(PRODUCTS.filter(p => p.nama.toLowerCase().includes(q.toLowerCase())));
}

function addToCart(kode) {
  const p = PRODUCTS.find(x => x.kode === kode);
  if (!p) return;
  const ex = cart.find(c => c.kode === kode);
  if (ex) {
    if (ex.qty >= p.stok) { showToast('Stok tidak cukup!', 'toast-err'); return; }
    ex.qty++;
  } else { cart.push({ ...p, qty: 1 }); }
  updateCartUI();
  showToast(`${p.nama} ditambahkan ke keranjang ✓`, 'toast-ok');
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const amt   = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  document.getElementById('cartCnt').textContent = total;
  const fab = document.getElementById('cartFab');
  if (fab) {
    fab.style.display = total > 0 ? 'flex' : 'none';
    document.getElementById('cartFabTxt').textContent = total + ' item';
    document.getElementById('cartFabAmt').textContent = rp(amt);
  }
}

function renderCart() {
  const col    = document.getElementById('cartItemsCol');
  const sumCol = document.getElementById('cartSumCol');
  const empty  = document.getElementById('emptyCart');
  if (!col) return;

  const items = col.querySelectorAll('.cart-item');
  items.forEach(i => i.remove());

  if (!cart.length) {
    empty.style.display = 'block';
    if (sumCol) sumCol.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  if (sumCol) sumCol.style.display = 'block';

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="ci-icon">${item.emo}</div>
      <div class="ci-info">
        <div class="ci-name">${item.nama}</div>
        <div class="ci-price">${rp(item.harga)} / pcs</div>
      </div>
      <div class="ci-ctrl">
        <button class="qty-btn" onclick="chgQty('${item.kode}',-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="chgQty('${item.kode}',1)">+</button>
        <button class="ci-del" onclick="removeCart('${item.kode}')">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        </button>
      </div>
    `;
    col.insertBefore(el, empty);
  });

  const sub  = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  const disc = Math.round(sub * 0.05);
  const tot  = sub - disc;
  document.getElementById('cSubtotal').textContent = rp(sub);
  document.getElementById('cDiscount').textContent = '- ' + rp(disc);
  document.getElementById('cTotal').textContent    = rp(tot);
}

function chgQty(kode, delta) {
  const item = cart.find(c => c.kode === kode);
  const prod = PRODUCTS.find(p => p.kode === kode);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.kode !== kode);
  else if (prod && item.qty > prod.stok) { item.qty = prod.stok; showToast('Stok maksimum', 'toast-err'); }
  updateCartUI(); renderCart();
}

function removeCart(kode) {
  cart = cart.filter(c => c.kode !== kode);
  updateCartUI(); renderCart();
  showToast('Item dihapus ✓', 'toast-ok');
}

function checkout() {
  if (!cart.length) return;
  
  // Add artificial latency
  showToast('⏳ Memproses checkout...', 'toast-info');
  
  setTimeout(() => {
    const sub  = cart.reduce((s, c) => s + c.harga * c.qty, 0);
    const tot  = sub - Math.round(sub * 0.05);
    cart.forEach(item => {
      const p = PRODUCTS.find(x => x.kode === item.kode);
      if (p) p.stok = Math.max(0, p.stok - item.qty);
    });
    const txId = '#TRX-' + String(Math.floor(Math.random() * 9000) + 1000);
    RW_BELANJA.unshift({ id: txId, tgl: today(), produk: cart.map(c => `${c.nama} x${c.qty}`).join(', '), total: tot, status: 'Selesai' });
    cart = [];
    updateCartUI(); renderCart(); renderKatalog(PRODUCTS);
    renderKarTxWidget(); renderRwBelanja();
    showToast(`✅ Checkout ${txId} berhasil!`, 'toast-ok');
    setTimeout(() => showSec('kar-riwayat'), 1400);
  }, 800);
}

// ============================================
//  RIWAYAT
// ============================================
function setRtab(btn, tabId) {
  document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['rt-belanja', 'rt-cicilan'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function renderRwBelanja() {
  const b = document.getElementById('tbRwBelanja');
  if (!b) return;
  b.innerHTML = RW_BELANJA.map((t, i) => `<tr>
    <td>${i + 1}</td><td>${t.tgl}</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.produk}</td>
    <td style="font-weight:700;color:var(--primary)">${rp(t.total)}</td>
    <td><span class="badge badge-ok">${t.status}</span></td>
  </tr>`).join('');
}

function renderRwCicilan() {
  const b = document.getElementById('tbRwCicilan');
  if (!b) return;
  b.innerHTML = RW_CICILAN.map((t, i) => `<tr>
    <td>${i + 1}</td><td>${t.tgl}</td><td>${t.ket}</td>
    <td style="font-weight:700">${rp(t.jml)}</td>
    <td><span class="badge badge-ok">${t.status}</span></td>
  </tr>`).join('');
}

// ============================================
//  HELPERS
// ============================================
function rp(num) { return 'Rp ' + num.toLocaleString('id-ID'); }
function today() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
let _toastTimer;
function showToast(msg, cls = '', duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + cls;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.className = 'toast', duration);
}

// ============================================
//  START
// ============================================
init();
