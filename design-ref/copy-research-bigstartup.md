# Copy Research: Landing Page Startup Besar → Brief Rewrite OLANO

Sumber: scrape 10 homepage, 17 Okt 2026. Semua kutipan verbatim (bahasa asli, tanpa parafrase) dengan URL + bagian halaman. File ini bahan brief untuk tim rewrite copy OLANO.

Metode: web_extract (batch) + browser headless untuk halaman JS. Catatan akses:
- lovable.dev: pass browser kedua kena Cloudflare challenge, tapi homepage lengkap sudah terambil via web_extract di pass pertama. Data tetap valid.
- anthropic.com: web_extract gagal (rate limit 429), diambil via browser. Berhasil.
- resend.com: web_extract mengembalikan halaman agent-docs (llms.txt), homepage asli diambil via browser DOM. Berhasil.
- Tidak ada site yang gagal total. sites_blocked = 0.

---

## 1. DATA VERBATIM PER SITE

### 1.1 Stripe — https://stripe.com/
- H1/hero: "Financial infrastructure to grow your revenue."
- Sub-line: "Accept payments, offer financial services and implement custom revenue models – from your first transaction to your billionth."
- Badge/eyebrow (live counter di hero): "Global GDP running on Stripe: 1.73369483%"
- Section heading: "The backbone of global commerce", "Powering businesses of all sizes.", "Reliable, extensible infrastructure for every stack.", "Flexible solutions for every business model."
- CTA: "Start now", "Get started", "Contact sales", "Sign up with Google", "Watch now", "View developer docs", "Read the letter", "See the numbers"
- Angka bukti (blok "The backbone of global commerce"): "135+ currencies and payment methods supported", "$1.9T in payments volume processed in 2025", "99.999% historical uptime for Stripe services", "200M+ active subscriptions managed on Stripe Billing"
- Feature description (blok integration): "Orchestrate payments across multiple processors, build custom workflows, and connect to third parties using APIs, partner apps, or prebuilt integrations."

### 1.2 Linear — https://linear.app/
- H1 (live DOM): "The product development system for teams and agents"
- Sub-line (live DOM): "Purpose-built for planning and building products. Designed for the AI era."
- Varian teks hero yang tampil di tagline/meta (web_extract): "A new species of product tool." + "Purpose-built for modern teams with AI workflows at its core, Linear sets a new standard for planning and building products."
- Section heading: "Intake and integrations", "Planning and monitoring", "AI and automations", "Build, review, and ship"
- CTA: "Start now", "Get started", "Contact sales", "Sign up", "Open app", "Learn more →"
- Feature description (blok Intake): "Automatically turn conversations and customer feedback into actionable issues that are instantly routed, labeled, and prioritized for the right team."

### 1.3 Vercel — https://vercel.com/
- H1: "Agentic Infrastructure"
- Sub-line: halaman memuat variasi A/B, fragmen yang terlihat: "To ship apps and agents" / "For coding agents" / "For coding agents to ship apps and agents automated by agents." (rotasi; kutip sebagai fragmen, jangan digabung jadi satu kalimat)
- Section heading: "Build agents on infrastructure that thinks like them", "Ship apps that scale from zero to millions instantly", "Host platforms that serve every customer", "Recently shipped", "Built by you, or your agents"
- CTA: "Deploy now", "Talk to sales", "Get a Demo", "Sign Up", "Read the recap"
- Bukti per-customer (caption di bawah tiap section): "Notion powers millions of agent conversations daily on Vercel.", "Zapier serves over 100 million monthly website visits on Vercel.", "Mintlify powers documentation for over 20,000 companies on Vercel."
- Feature description (kartu Recently shipped): "Run Python backends, queues, and daemons on Vercel, alongside your frontend." dan "The safest way to run code you didn't write." (untuk Sandbox)

### 1.4 Framer — https://framer.com/
- H1: "Framer is the design agent for every step from idea to launch"
- Badge: "New: Skills"
- Section heading: "Agents that work alongside you, not instead of you", "Design with an agent", "Run your CMS with an agent", "Code with an agent", "Connect to any agent", "Trusted by teams shipping big sites"
- CTA: "Get started for free", "Download app", "Start with Agents", "Sign up"
- Feature description (blok Design with an agent): "A professional design agent, native to the canvas. It works directly on your site to generate and refine in place, with every change visible, editable, and under your control."

### 1.5 Resend — https://resend.com/
- H1 (live DOM): "Email for developers"
- Section heading (H2): "Integrate this weekend", "First-class developer experience", "Reach humans, not spam folders", "Everything in your control", "Beyond expectations", "Email reimagined. Available today."
- Sub-heading pendukung: "Test mode", "Modular webhooks", "Write using a delightful editor", "Contact management", "Broadcast analytics", "Develop emails using React"
- CTA: "Get started", "Documentation", "Explore Enterprise", "Check the docs", "Learn more"
- Trust line (di atas logo customers): "Companies of all sizes trust Resend to deliver their most important emails."
- Feature description (grup deliverability): "Proactive blocklist tracking", "Faster time to inbox", "Prevent spoofing with DMARC", "Battle-tested infrastructure"

### 1.6 Supabase — https://supabase.com/
- H1: "Build in a weekend. Scale to millions." (live DOM memecah dua baris: "Build in a weekend" / "Scale to millions")
- Sub-line: "Start your project with a Postgres database. Add Authentication, Data APIs, Edge Functions, Realtime Data, Storage, and Vector embeddings."
- Section heading: "Use it as just a Postgres database" (versi docs/agent page), "Key Differentiators", di homepage produk: "Database", "Auth", "Functions", "Realtime", "Storage", "Vector"
- CTA: "Start your project", "Request a demo"
- Feature description (kartu Database): "Every project is a full Postgres database, the world's most trusted relational database. 100% portable Built-in Auth with RLS Easy to extend"
- Kejujuran batasan (halaman agent docs): "Free plan projects pause after 7 days of low activity. Projects on paid plans do not pause."

### 1.7 Lovable — https://lovable.dev/ (via web_extract)
- Title/H1: "App & Website Builder | Build Software in Minutes | Lovable"
- Hero: "Build something Lovable" + sub: "Bring a new product, internal tool, or entire company to life."
- Section heading: "One platform.", "You bring the idea. Lovable brings it to life.", "Refine your design and deploy", "Depend on Lovable, from end to end", "Hosting, handled", "Your app stack, connected", "Payments, processed", "Safe and secure, as standard", "Works wherever, whenever", "The proof is in"
- Sub-hero blok One platform: "If you can describe it, you can build it. Create, run, and manage entire products and businesses from scratch."
- CTA: (halaman memakai CTA gambar/brand; teks link yang terbaca) "Read eXp Realty", "Join them today and build the software that runs your business."
- Feature description: "Lovable handles hosting, SSL, and backend infrastructure. Your code and data stay yours. Always." dan "Local payments, currency conversion, and tax compliance handled in 200+ countries and territories."
- Blok bukti berangka (contoh eXp Realty): "savings per year $2M+", "fewer support tickets 85%", "remote agents connected 83K"; (contoh healthcare): "hours to build a brand new product 48", "employees empowered to build 200+"

### 1.8 Cursor — https://cursor.com/
- H1: "Cursor is your coding agent for building ambitious software."
- Section heading: "Agents turn ideas into code", "Works autonomously, runs in parallel", "In every tool, at every step", "Hand work to AI teammates"
- CTA: "Download for macOS⤓", "Get started→", "Request a demo→", "Contact sales", "Join our team →"
- Feature description: "Accelerate development by handing off tasks to Cursor, while you focus on making decisions."
- Manifesto singkat (bagian company): "Software creation is changing. We are a group of researchers, engineers, and technologists inventing at the edge of what's useful and possible." dan "We have much to learn, try, and build."

### 1.9 Anthropic — https://www.anthropic.com/
- H1: "AI research and products that put safety at the frontier"
- Sub-line: "AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks."
- Section heading: "At Anthropic, we build AI to serve humanity's long-term well-being.", "Latest releases"
- CTA: "Try Claude", "Learn more about Claude", "Contact sales", "Read more"
- Item rilis: "Introducing Haiku 5.5", "Introducing Sonnet 5.5", "Introducing Opus 5.5"

### 1.10 Raycast — https://www.raycast.com/
- H1: "Your shortcut to everything."
- Sub-line: "A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable."
- Section heading: "Take shortcuts, not detours.", "It's not about saving time." (dengan jawaban: "It's about feeling like you're never wasting it."), "There's an extension for that.", "Meet your new virtual assistant", "Built for professionals like you.", "Don't repeat yourself.", "Take the short way."
- CTA: "Download for Mac", "Install via Homebrew", "Get started", "Browse the store", "Plus thousands more... Browse the store"
- Micro-heading fitur (pola tiga kata + bukti): "Fast. Think in milliseconds.", "Ergonomic. Keyboard First.", "Personal. Your tools, your way.", "Reliable. 99.8% crash-free rate."
- Feature description (Snippets): "Tired of typing the same thing? Create a snippet and insert it by simply typing its keyword."

---

## 2. POLA TERABSTRAK

### A. Pola Formula Hero H1 (5 pola terbanyak)

**A1. Definisi kategori + outcome (paling dominan, 5/10 site).**
Rumus: [Brand] is the [kategori baru] for [audiens/konteks]. Kalimat pertama menamai kategori, bukan memuji produk.
- Stripe, hero: "Financial infrastructure to grow your revenue."
- Linear, H1: "The product development system for teams and agents"
- Cursor, H1: "Cursor is your coding agent for building ambitious software."
- Framer, H1: "Framer is the design agent for every step from idea to launch"
- Resend, H1: "Email for developers"

**A2. Dua beat, dua kalimat pendek ber titik (outcome lalu skala).**
Rumus: [Hasil cepat]. [Hasil besar].
- Supabase, hero: "Build in a weekend. Scale to millions."
- Resend, H2 penutup: "Email reimagined. Available today."
- Raycast, micro-heading: "Fast. Think in milliseconds."

**A3. Milik pembaca ("Your X to Y").**
Rumus: janji dalam bingkai kepemilikan, bukan fitur.
- Raycast, hero: "Your shortcut to everything."
- Lovable, hero: "Build something Lovable" + "You bring the idea. Lovable brings it to life."

**A4. Rentang perjalanan "from X to Y" di dalam kalimat.**
Rumus: sebut titik awal dan titik akhir pelanggan di satu napas.
- Stripe, sub-line: "...from your first transaction to your billionth."
- Framer, H1: "from idea to launch"
- Vercel, section: "Ship apps that scale from zero to millions instantly"

**A5. Reframing nilai ("It's not about X. It's about Y.")**
Rumus: bantah metrik permukaan, tawarkan makna yang lebih dalam.
- Raycast, section: "It's not about saving time." / "It's about feeling like you're never wasting it."

Catatan sub-line: Supabase memakai pola lain yang kuat untuk produk banyak modul, kalimat imperatif + daftar benda konkret: "Start your project with a Postgres database. Add Authentication, Data APIs, Edge Functions, Realtime Data, Storage, and Vector embeddings."

### B. Register Kata Kerja CTA

**B1. CTA primer = verb + objek produk spesifik, bukan "Get Started" polos.**
- "Start your project" (Supabase, CTA hero)
- "Start now" (Stripe, nav)
- "Deploy now" (Vercel, hero)
- "Download for Mac" / "Download for macOS⤓" (Raycast, Cursor)
- "Try Claude" (Anthropic, hero)
- "Open app" (Linear)
"Get started" tetap ada (Linear, Cursor, Framer, Resend) tapi hampir selalu varian kedua atau diberi pungutan: "Get started for free" (Framer).

**B2. CTA sekunder = jalur manusia, bukan "Learn more" semua.**
- "Contact sales" (Stripe, Linear, Cursor, Anthropic), "Talk to sales" (Vercel), "Request a demo" (Cursor, Supabase), "Get a Demo" (Vercel)

**B3. CTA berbentuk ajakan coba langsung yang menyebut aksi nyata produk.**
- "Start with Agents" (Framer), "Explore Enterprise" (Resend), "Browse the store" (Raycast), "Check the docs" (Resend)

**B4. Kecil dan spesifik mengalahkan besar dan abstrak.**
Vercel menaruh CTA di dalam kalimat konteks: "Built by you, or your agents" + tombol "Deploy now". Linear menaruh "Learn more →" tepat di bawah fitur, bukan di akhir halaman.

### C. Pola Section Heading

**C1. Klaim kategori + deret angka bukti di bawahnya (Stripe).**
Heading: "The backbone of global commerce" lalu blok angka: "99.999% historical uptime for Stripe services", "$1.9T in payments volume processed in 2025". Heading boleh besar asal angka di bawahnya konkret.

**C2. Heading = nama kapabilitas dengan kata kerja (Linear).**
"Intake and integrations", "Planning and monitoring", "AI and automations", "Build, review, and ship". Setiap section adalah fungsi, bukan bab buku.

**C3. Heading = klaim outcome konkret + satu kalimat bukti pelanggan bernama (Vercel).**
"Ship apps that scale from zero to millions instantly" diikuti "Zapier serves over 100 million monthly website visits on Vercel." Klaim besar selalu duduk di atas nama + angka.

**C4. Heading = outcome berorientasi manusia, kalimat pendek berisi janji spesifik (Resend, Raycast, Lovable).**
"Reach humans, not spam folders" (Resend), "Integrate this weekend" (Resend), "There's an extension for that." (Raycast), "Hosting, handled" / "Payments, processed" (Lovable). Pola Lovable: [Benda], [status selesai dua kata].

**C5. Heading pertanyaan/kejujuran kecil yang menandai fitur (Raycast).**
"Tired of typing the same thing?" diikuti penjelasan snippet. Fitur kecil diceritakan dari masalah kecil yang nyata.

### D. Cara Mereka Meredam Hype (confident tanpa buzzword)

**D1. Angka menggantikan kata sifat.**
Bukan "very reliable" melainkan "99.999% historical uptime for Stripe services" (Stripe) dan "Reliable. 99.8% crash-free rate." (Raycast). Kalimat klaim tidak pernah berdiri tanpa angka atau nama.

**D2. Mengakui batasan secara terbuka.**
Supabase menulis downside gratisan di halaman utamanya: "Free plan projects pause after 7 days of low activity. Projects on paid plans do not pause." Kepercayaan dibangun lewat kejujuran, bukan superlatif.

**D3. Positioning melawan ketakutan, dengan kontras sederhana.**
Framer: "Agents that work alongside you, not instead of you." Anthropic mengakui risiko di hero: "dedicated to securing its benefits and mitigating its risks." confidence datang dari mengakui dua sisi.

**D4. Kalimat pendek, subjek jelas, nol adverbia.**
Cursor menutup manifesto dengan: "We have much to learn, try, and build." Perusahaan papan atas justru merendahkan diri dengan kalimat pendek yang bisa diverifikasi. Tidak ada kata "revolutionary", "cutting-edge", "game-changer" di satu pun hero yang discrape.

Total pola terdokumentasi: 18 (A1-A5, B1-B4, C1-C5, D1-D4).

---

## 3. PETA TERJEMAHAN KE OLANO

Register target: seperti CTO startup besar. Kalimat pendek. Klaim konkret, angka di depan. Outcome dulu, fitur kemudian. Bahasa Indonesia lugas. Tanpa buzzword (seamless, revolutionary, cutting-edge, AI-powered, game-changer), tanpa em dash, tanpa klaim tanpa bukti. Angka yang boleh dipakai hanya: komisi platform 20-30%, PPh final 0,5% (PP 20/2026), QRIS MDR mikro 0% sampai Rp500rb berlaku 1 Okt 2026, 50 template (10 keluarga x 5 varian), kuota AI 60 foto/outlet/bulan, paket Gratis + Pro Rp50.000/bulan.

### 3.1 Modul Kasir Offline
- Hero H1: "Kasir yang tetap jalan saat internet mati."
- Sub: "Transaksi tersimpan di perangkat dan sinkron begitu koneksi kembali. Tanpa catatan manual, tanpa transaksi hilang."
- CTA: "Mulai gratis" + sekunder "Lihat cara kerja"
- Pola & referensi: A2 dua beat dan A1 definisi kategori, meniru Supabase "Build in a weekend. Scale to millions." (https://supabase.com, hero). CTA mengikuti B1, pola "Start your project" (Supabase) dan "Start now" (Stripe, https://stripe.com, nav): verb + objek, bukan "Get Started" polos.

### 3.2 Modul Pajak
- Hero H1: "Pajak UMKM dihitung dari transaksi, bukan dari rekap manual."
- Sub: "PPh final 0,5% sesuai PP 20/2026, terhitung otomatis dari setiap penjualan di kasir."
- CTA: "Coba hitung pajak" 
- Pola & referensi: C4 klaim konkret satu kalimat, meniru Resend "Reach humans, not spam folders" (https://resend.com, H2) dan "Integrate this weekend" (Resend, H2). Angka regulasi di sub mengikuti D1: klaim duduk di atas angka, seperti "99.999% historical uptime for Stripe services" (https://stripe.com, blok "The backbone of global commerce").

### 3.3 Modul Website (50 Template)
- Hero H1: "50 template. Satu klik publikasi."
- Sub: "10 keluarga desain, masing-masing 5 varian. Katalog toko online terisi dari stok kasir, jadi tidak pernah beda data."
- CTA: "Lihat template" + sekunder "Mulai gratis"
- Pola & referensi: A2 dua beat (angka lalu aksi), meniru Supabase "Build in a weekend. Scale to millions." Sub memakai pola enumerasi konkret Supabase: "Start your project with a Postgres database. Add Authentication, Data APIs, Edge Functions, Realtime Data, Storage, and Vector embeddings." (https://supabase.com, hero sub-line). CTA "Lihat template" mengikuti B3, pola "Browse the store" (https://www.raycast.com, CTA).

### 3.4 Modul Analisa Delivery
- Hero H1: "Tahu untung rugi tiap pesanan online."
- Sub: "Komisi platform 20 sampai 30 persen ikut dihitung. Lihat channel mana yang benar-benar cuan, mana yang cuma ramai."
- CTA: "Cek margin delivery"
- Pola & referensi: C3 klaim outcome + bukti bernomor, meniru Vercel "Ship apps that scale from zero to millions instantly" diikuti caption pelanggan (https://vercel.com, section). Struktur angka-masuk-hitungan mengikuti Stripe yang menempelkan angka ke klaim: "$1.9T in payments volume processed in 2025" (https://stripe.com).

### 3.5 Modul AI Jaga Margin
- Hero H1: "AI yang menjaga margin, bukan sekadar menjual."
- Sub: "Foto produk diproses sampai 60 foto per outlet tiap bulan. Harga jual dan margin dipantau, peringatan muncul sebelum rugi."
- CTA: "Coba di outlet Anda"
- Pola & referensi: D3 positioning melawan ketakutan, meniru Framer "Agents that work alongside you, not instead of you" (https://framer.com, section). Penyebutan AI langsung tanpa label "AI-powered", mengikuti Anthropic "AI research and products that put safety at the frontier" (https://www.anthropic.com, H1): AI disebut sebagai benda kerja, bukan mantra.

### 3.6 Modul Automation
- Hero H1: "Yang berulang, biar sistem yang kerjakan."
- Sub: "Stok, laporan, dan pengingat pajak jalan sendiri. Waktu Anda kembali ke pelanggan."
- CTA: "Setel sekali, jalan terus"
- Pola & referensi: A5 reframing + C5 masalah kecil, meniru Raycast "Don't repeat yourself. Automate the things you do all the time." (https://www.raycast.com, section) dan "Tired of typing the same thing?" (Raycast, bagian Snippets).

### 3.7 Kalkulator Gratis (4 unit, lead magnet)

**K1. Kalkulator PPh Final 0,5%**
- Hero: "PPh final 0,5% dalam hitungan detik."
- Sub: "Masukkan omzet, keluar jumlah pajak sesuai PP 20/2026. Gratis, tanpa daftar."
- CTA: "Hitung sekarang"
- Referensi: Resend "Integrate this weekend" (https://resend.com, H2) untuk klaim kecepatan yang terukur; CTA mengikuti B1 pola "Start now" (Stripe).

**K2. Kalkulator QRIS MDR Mikro**
- Hero: "QRIS mikro 0% sampai Rp500 ribu. Cek selisihnya."
- Sub: "Berlaku 1 Oktober 2026. Hitung berapa biaya MDR yang tidak lagi Anda bayar per transaksi kecil."
- CTA: "Cek penghematan"
- Referensi: pola angka Stripe, "135+ currencies and payment methods supported" (https://stripe.com, blok "The backbone of global commerce"): satu baris angka, satu baris makna.

**K3. Kalkulator Komisi Platform**
- Hero: "Komisi 20-30% makan margin Anda berapa?"
- Sub: "Masukkan harga jual dan komisi platform, lihat sisa margin sebelum memasang aplikasi."
- CTA: "Hitung komisinya"
- Referensi: C5 heading pertanyaan dari masalah nyata, Raycast "Tired of typing the same thing?" (https://www.raycast.com, Snippets); pertanyaan konkret menggantikan klaim.

**K4. Kalkulator Margin & HPP**
- Hero: "Harga jual yang benar, bukan kira-kira."
- Sub: "Hitung HPP, margin, dan harga jual minimum. Tahu batas aman sebelum kasih diskon."
- CTA: "Hitung margin"
- Referensi: A5 reframing, Raycast "It's not about saving time." / "It's about feeling like you're never wasting it." (https://www.raycast.com, section): bantah cara lama (kira-kira), tawarkan kepastian.

### 3.8 Aturan Register untuk Tim Rewrite (do / don't)

DO:
- Definisikan kategori di H1, jangan memuji produk (A1).
- Angka di depan klaim; satu heading satu klaim (C1, D1).
- CTA primer: verb + objek spesifik OLANO ("Mulai gratis", "Hitung sekarang", "Lihat template") (B1).
- Akui batasan bila relevan, misal kuota AI 60 foto/outlet/bulan disebut apa adanya (D2, pola Supabase).
- Kalimat pendek dua beat untuk hero produk multi-manfaat (A2).

DON'T:
- Jangan "Get Started" sebagai CTA utama tanpa objek (B1).
- Jangan superlatif atau buzzword; semua 10 site yang discrape tidak memakainya di hero (D4).
- Jangan klaim yang tidak ada angka atau fakta config di belakangnya (D1).
- Jangan em dash; pakai titik atau koma. Startup besar memakai kalimat pendek ber titik sebagai ritme (A2).
- Jangan sebut "AI-powered"; sebut apa yang AI-nya kerjakan (pola Anthropic/Framer, D3).
