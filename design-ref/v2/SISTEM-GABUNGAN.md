# Sistem Desain Olano — gabungan SEMUA referensi

Bukan pilih satu. Tiap referensi punya peran yang berbeda, dan peran itu
tidak boleh saling menimpa. Semua angka di bawah hasil ukur
(`design-ref/v2/raw-measure.json`), bukan tebakan.

---

## Pembagian peran (mengikat)

| Referensi | Peran | Yang diambil | Yang TIDAK diambil |
|---|---|---|---|
| **sokudo.dev** | **Struktur** | grid, padding seksi 80/64, kartu radius 16 tanpa shadow, nav transparan, H1 48/28 | warna hitam, font Figtree (Olano pakai Aspekta) |
| **thedaydream.studio** | **Atmosfer** | 1 keyframe drift lambat (`cloud-drift` 9s) di halaman modul, whitespace lega, Aspekta | nav 28px (terlalu kecil untuk target sentuh) |
| **open-design.ai** | **Ritme harga** | padding seksi 56/56 mobile, CTA pill 44px, skala H1 besar di section harga | radius campur 24/22/8/6 (Olano: satu sistem) |
| **60fps.design** | **Motion state-change** | gerakan hanya saat ADA PERUBAHAN STATE (digit masuk, sel terisi, slide commit) | efek dekoratif (confetti, particles, goo) |
| **bencho.dev** | **Blok interaksi** | empty state, inline confirm, checklist, OTP satu-input, spring math | React + framer-motion (Olano vanilla) |
| **designeer.xyz** | Katalog ide | taksonomi Gestures/Patterns/Effects | — |
| **oyenza.com** | — | 403 Cloudflare, tidak terukur | — |

---

## Angka yang berlaku (satu sumber, tidak boleh beda per halaman)

### Tipografi
| Peran | Desktop | Mobile |
|---|---|---|
| H1 | 48px / lh 1.30 / w700 | 30px / lh 1.22 |
| H2 | 40px / w600 | 28px / w600 |
| Body | 16px / lh 1.55 | 15px / lh 1.55 |
| Font | **Aspekta** (1 family) | sama |

### Ruang
| Konteks | Desktop | Mobile |
|---|---|---|
| Padding seksi | 80/80 | 64/64 |
| Hero | 120/80 | 32/48 |
| Halaman modul (open-design) | 130/130 | **56/56** |
| Gap grid | 24px | 16px |

### Bentuk
| Elemen | Nilai | Sumber |
|---|---|---|
| Kartu | radius 16, border 1px, **tanpa shadow** | sokudo |
| Visual/gambar | radius 14 | sokudo |
| Tombol | pill 9999, tinggi 44–48 | sokudo + open-design |
| Input | radius 10 | — |

### Motion (anggaran keras)
| Jenis | Jumlah diizinkan | Sumber |
|---|---|---|
| Keyframe dekoratif | **1 per halaman** | daydream (2 total), sokudo (0) |
| Transisi interaktif | 150–220ms | sokudo 0.15–0.2s |
| Motion state-change | boleh, per kejadian | 60fps |
| Hover-lift kartu | **0** | tidak ada referensi yang pakai |
| Shadow pada elemen | ≤6% | sokudo 2.5%, open-design 6.4% |

---

## Yang sudah diterapkan

- H1 48/30, H2 clamp sesuai ukur — sokudo
- Padding seksi 80/64, hero 120/32 — sokudo
- Kartu tanpa shadow, `--sh-card: none` — sokudo
- Radius visual 14px, kartu 16px, pill 9999 — sokudo
- Keyframes 5 → 2 (`heroIn` + `cueDrop`) — anggaran daydream
- Hover-lift 5 aturan → 0 — semua referensi
- Shadow 2.2% elemen — di bawah semua referensi
- Empty state, inline confirm 2 ketukan, checklist, OTP satu-input, spring math — bencho
- Motion state-change di POS (digit pop, sel isi, coretan) — 60fps

## Yang masih harus masuk

1. **daydream**: drift lambat di halaman modul (`tool-hero` cloud) — 1 keyframe, 9s.
2. **open-design**: padding 56/56 di halaman modul, ritme section harga.
3. **umkm.html**: 10.11 layar → ≤9 (checklist baru menambah 515px).
