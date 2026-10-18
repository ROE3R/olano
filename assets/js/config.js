/* OLANO_CONFIG: versioned business rules (PRD §17: jangan hardcode di UI).
   Ubah angka di sini, bukan di HTML. Naikkan `version` tiap ubah. */
(function (w) {
  const OLANO_CONFIG = {
    version: "2.2.0",
    brand: { name: "Olano", domain: "olano.xyz" },

    /* --- paket & harga (F6/§6) --- */
    pricing: {
      currency: "IDR",
      gratis: 0,
      proPerOutlet: 50000,
      trialDays: 14,
      jasaPajak: 250000, // Rp250rb+/bln (basic)
    },

    /* --- kuota AI per outlet per bulan (config berversi) --- */
    aiQuota: {
      photoOps: 60,       // F6
      tanyaMessages: 300, // F9
      aiCostCeilingPerOutlet: 12500, // target biaya AI ≤ Rp12.5rb
    },

    /* --- MESIN PAJAK (F10): PP 20/2026 ---
       PPh Final 0,5% tersedia untuk OP, PT Perorangan, Koperasi
       dengan omzet tahunan s.d. Rp4,8 miliar. OP bebas s.d. Rp500 juta.
       PT/CV/Firma TIDAK bisa PPh Final → skema umum (pajak atas laba). */
    tax: {
      ppNumber: "PP 20/2026",
      rate: 0.005,          // 0,5%
      exemptionOP: 500000000,   // OP bebas s.d. Rp500jt
      ceiling: 4800000000,      // > Rp4,8M keluar skema final
      koperasiMaxYears: 4,      // koperasi maks 4 tahun sejak terdaftar
      effectiveDate: "1 Januari 2026",
      // batasan per jenis WP
      types: {
        OP:          { final: true,  freeUpto: 500000000 },
        PT_PERORANGAN: { final: true, freeUpto: 0 },
        KOPERASI:   { final: true, freeUpto: 0, maxYears: 4 },
        PT:          { final: false },
        CV:          { final: false },
        FIRMA:       { final: false },
        BELUM_TAHU:  { final: false, needEducation: true },
      },
      deadlineConfigKey: "tax_rules.deadlines", // diisi admin (F10)
    },

    /* --- QRIS MDR (F3) berlaku sejak 1 Oktober 2026 ---
       MDR ditanggung merchant, TIDAK boleh dibebankan ke konsumen. */
    qrisMDR: {
      effective: "1 Oktober 2026",
      mikro:  { limit: 500000,  rate: 0.003 }, // ≤ Rp500rb 0%, > Rp500rb 0,3%
      kmb:    { limit: 100000,  rate: 0.007 }, // usaha kecil/mdn/besar: ≤ Rp100rb 0%, > Rp100rb 0,7%
      categories: ["MIKRO", "KMB"],
      note: "Tarif sejak 1 Okt 2026. MDR ditanggung merchant, jangan dibebankan ke konsumen.",
      featureFlag_qrisAmountInjection: true, // F3: ON sejak QRIS dinamis (nominal per transaksi, payload EMVCo + CRC16)
    },

    /* --- HPP / harga jual (F7) --- */
    pricingAdvice: {
      scenarios: {
        aman:       { label: "Aman",       margin: 0.30 },
        kompetitif: { label: "Kompetitif", margin: 0.20 },
        premium:    { label: "Premium",    margin: 0.45 },
      },
      ingredientRiseAlert: 0.10, // F7: alert bahan naik ≥ 10%, maks 1 email/hari
    },

    /* --- platform commission (analisa GoFood/Grab, F7 + gofood tool) --- */
    platform: {
      commissionRange: { low: 0.20, high: 0.30 },
      promos: ["GRAB", "GOFOOD"],
      note: "Komisi platform 20–30% dipotong dari harga jual; HPP tetap. Hitung margin bersih per saluran.",
    },

    /* --- skor kesehatan (F8) bobot --- */
    healthWeights: {
      profitabilitas: 25, tren: 20, arusKas: 20, stok: 15, pencatatan: 10, pajak: 10,
    },
    healthGrades: [
      { min: 80, label: "Sehat" },
      { min: 60, label: "Cukup" },
      { min: 40, label: "Perlu perhatian" },
      { min: 0,  label: "Kritis" },
    ],

    /* --- WhatsApp layanan (F11): nomor live — satu nomor utk semua layanan --- */
    wa: {
      // K1: nomor 6285111044407 (dikonfirmasi owner 18 Okt 2026).
      pajak: "6285111044407",   // nomor 6285111044407 (dikonfirmasi owner 18 Okt 2026)
      website: "6285111044407", // nomor 6285111044407 (dikonfirmasi owner 18 Okt 2026)
      services: ["pajak_rekap", "website_custom"],
    },

    /* --- POS / offline (F2) --- */
    pos: {
      maxProductsGratis: 50,
      stockWarn: 80,       // % storage
      clockDriftWarnMin: 5,
      syncBackoffBase: 1000,
      currency: "IDR",
      timezoneExamples: ["WIB", "WITA", "WIT"],
      payMethods: ["TUNAI", "QRIS", "TRANSFER", "LAINNYA"],
    },

    /* --- website builder: status template (sumber kebenaran copy "1 siap + sisanya coming soon") --- */
    website: {
      templates: {
        ready: [{ slug: "katalog", name: "Katalog", status: "siap" }],
        comingSoon: ["menu-resto","link-in-bio","jasa-booking","portofolio","promo-event","profil-usaha","landing-produk"],
        /* Roadmap keluarga layout: target per bulan, label "Target" (bukan janji). */
        roadmap: [
          { slug: "menu-resto",     target: "Nov 2026" },
          { slug: "link-in-bio",    target: "Nov 2026" },
          { slug: "jasa-booking",   target: "Des 2026" },
          { slug: "portofolio",     target: "Des 2026" },
          { slug: "promo-event",    target: "Jan 2027" },
          { slug: "profil-usaha",   target: "Jan 2027" },
          { slug: "landing-produk", target: "Feb 2027" },
        ],
        totalPlanned: 50,
      },
    },

    /* --- testimoni: CONTOH berlabel eksplisit, bukan kutipan asli (satu tempat edit = swap) --- */
    testimonials: {
      label: "contoh",
      swapNote: "Ganti dengan kutipan pemilik toko yang benar-benar memakai Olano - satu tempat, tanpa rebuild.",
      quotes: [
        { initials: "PD", name: "Pak Darmawan", store: "Kopi Senja, Bandung",
          quote: "Tutup buku dulu 40 menit, sekarang 5 menit. Rekapnya sudah jadi sendiri, saya tinggal cek." },
        { initials: "MS", name: "Mbak Sari", store: "Keripik Sari, Malang",
          quote: "Internet mati dua jam, warung tetap jalan. Pas nyala lagi, transaksinya masuk sendiri." },
        { initials: "BR", name: "Bu Rina", store: "Batik Rina, Solo",
          quote: "Saya tidak paham aplikasi. Anak saya pasang, sorenya saya sudah bisa jualan sendiri." },
        { initials: "AH", name: "Arief Hidayat", store: "Sembako Barokah, Bekasi",
          quote: "Stok di buku sering beda Rp200-300rb tiap bulan. Sekarang selisihnya kelihatan di mana hilangnya." },
        { initials: "NF", name: "Nurul Fadhilah", store: "Katering Bu Nur, Surabaya",
          quote: "Pajak dan pembukuan saya serahkan ke Olano. Lapor bulanan selesai tiga hari, saya tidak perlu ke kantor pajak." },
        { initials: "JW", name: "Joko Wibowo", store: "Toko Bangunan Joko, Semarang",
          quote: "Website custom-nya jadi seminggu, katalognya nyambung ke stok kasir. Tidak perlu update dobel." },
        { initials: "RS", name: "Rizky Saputra", store: "Ayam Geprek Rizky, Depok",
          quote: "Omzet GoFood naik 38% dalam dua bulan. Yang penting marginnya ikut naik, bukan cuma ramai." },
        { initials: "LW", name: "Lina Wijaya", store: "Toko Kue Lina, Tangerang",
          quote: "Dulu saya kira untung di GrabFood. Ternyata setelah komisi malah tipis. Sekarang harganya sudah dibenahi." },
        { initials: "HS", name: "Hendra Susanto", store: "Laundry Bersih Express, Medan",
          quote: "Tiga cabang, satu laporan. Saya bisa lihat cabang mana yang stoknya bocor dari HP." },
      ],
    },
  };

  w.OLANO_CONFIG = OLANO_CONFIG;

  /* Helper format: dipindah ke config.js supaya POS PWA bisa jalan offline
     tanpa bergantung shared.js (yang di-cache terpisah). */
  w.OLANO = {
    rp: function (n, dec) {
      n = Number(n) || 0; dec = dec == null ? 0 : dec;
      return "Rp" + n.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    },
    num: function (n) { return Number(n || 0).toLocaleString("id-ID"); },
    short: function (n) {
      n = Number(n) || 0;
      if (n >= 1e9) return (n / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " M";
      if (n >= 1e6) return (n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
      if (n >= 1e3) return (n / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb";
      return String(n);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
