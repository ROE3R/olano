#!/bin/bash
# Olano audit baseline inventory (Lampiran C style) - grep bukti "sebelum"
cd /root/olano
OUT=audit/before
mkdir -p "$OUT"
F="index.html kasir.html app/kasir.html umkm.html pajak.html website.html templates/katalog.html analisa-delivery.html ai.html automation.html naik-kelas.html tentang.html kebijakan-privasi.html syarat-ketentuan.html alat/kalkulator-pph-final-umkm.html alat/kalkulator-hpp-harga-jual.html alat/kalkulator-biaya-qris.html alat/kalkulator-margin-delivery.html"
{
echo "# OLANO AUDIT - BASELINE INVENTORY"
echo "# generated: $(date -u '+%Y-%m-%d %H:%M UTC')  HEAD: $(git rev-parse --short HEAD)"
echo
echo "## [P0-06] href kosong atau '#'"
grep -nE 'href="#"|href=""' $F | grep -vE 'skiplink|skip-link' || echo "(none)"
echo
echo "## [P0-06] Penyebutan WhatsApp / wa.me (audit tautan)"
grep -niE 'whatsapp|wa\.me' $F || echo "(none)"
echo
echo "## [P0-04] dinamis / statis"
grep -niE 'dinamis|statis' $F | grep -v 'QRIS statis dari bank mana' || echo "(none)"
echo
echo "## [P0-01] Durasi PPh final (4 tahun / tanpa batas / PP)"
grep -niE '4 tahun|batas waktu|tanpa batas|maks\.|PP ?20/?2026' $F | head -40 || echo "(none)"
echo
echo "## [P0-05] Angka template"
grep -nE '9 keluarga|Tujuh|50 template|Coming soon|coming soon|Segera hadir' $F || echo "(none)"
echo
echo "## [P0-03] Contoh angka kunci"
grep -nE 'Rp91\.667|Rp166\.667|Rp11\.700|Rp16\.714|Rp14\.625|Rp21\.273|22,4%|24,3%|63,6%|Rp0,00' $F || echo "(none)"
echo
echo "## [P1-02] Label tombol (inventaris)"
grep -hoE '(<a[^>]*class="btn[^"]*"[^>]*>|<button[^>]*>)[^<>]{2,45}' $F | sed 's/<[^>]*>//' | sort | uniq -c | sort -rn
echo
echo "## [P1-05] 'Anda' per file"
for f in $F; do c=$(grep -oE '\bAnda\b' "$f" | wc -l); [ "$c" -gt 0 ] && echo "$f: $c"; done; echo "(selesai)"
echo
echo "## [P1-06] Jargon dev di UI"
grep -niE 'IndexedDB|client_uuid|ULID|payload|RLS|audit log|KPI|PWA v[0-9]+| BOM|Overhead|vault|injection|berversi|LocalBusiness' $F | head -30 || echo "(none)"
echo
echo "## [P1-07] 'coming soon' vs 'segera hadir'"
echo "-- coming soon:"; grep -icE 'coming soon' $F | grep -v ':0' || echo "(0)"
echo "-- segera hadir:"; grep -icE 'segera hadir' $F | grep -v ':0' || echo "(0)"
echo
echo "## [P1-08] Format uang"
grep -ohE 'Rp ?[0-9][0-9.,]*( ?(juta|jt|miliar|M|ribu|rb))?' $F | sort | uniq -c | sort -rn
echo
echo "## [P1-04] <title> semua halaman"
grep -H '<title>' $F
echo
echo "## [P1-04] tagline footer (varian)"
grep -hoE 'Kasir,[^<]{5,80}' $F | sort | uniq -c
echo
echo "## [P0-10] Klaim teknis"
grep -niE 'enkripsi|Terenkripsi|<50 ?ms|<300 ?ms|<100 ?ms|3 menit|100% offline|1 Oktober|Oktobor' $F | head -30 || echo "(none)"
echo
echo "## Link eksternal + anchor inventory"
grep -hoE 'href="[^"]+"' $F | sort | uniq -c | sort -rn | head -60
} 2>&1 | tee "$OUT/grep-inventory.txt" | head -80
