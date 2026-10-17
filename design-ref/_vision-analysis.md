### 1) HERO / SECTION HEADER
* **Overline & Headline:** Small uppercase blue tracker `"MODUL"`, followed directly by a bold, heavy-weight title: `"Enam modul. Satu aplikasi."` (left-aligned, black).
* **Subcopy:** A 3-line muted gray paragraph directly below the title explaining the module sorting logic and data source.
* **CTA & Product Image:** **None present.** The section transitions immediately from explanatory text into the module list without an interactive primary CTA or supporting product visual/mockup.

---

### 2) MODULE LIST (Rows 01–02 Visible)
* **Numbers:** Monospaced style aligned left of each title. `"01"` is highlighted in active primary blue; `"02"` is subdued in light, low-contrast gray.
* **Titles:** Bold, black headings placed beside the numbers (`Kasir`, `Pajak`).
* **Description:** 2–3 lines of regular sans-serif copy beneath each title outlining core features and constraints.
* **Chips/Badges:** Monospace-style data blocks showcasing inline calculations (`contoh · ...`):
  * **01:** High-contrast, solid blue rounded box with white text.
  * **02:** Low-contrast, light-blue tinted background with dark blue text.
* **Status / Action:** Left-aligned text link with an arrow (`Sudah jalan →`) positioned at the bottom of each module block (stacked rather than in a dedicated right column due to the mobile viewport).
* **Separators:** Subtle, light-gray full-width horizontal hairline dividers between modules.

---

### 3) 5 CONCRETE LAYOUT CRITIQUES

1. **Inconsistent Chip Hierarchy:** Row 01 uses a dense, saturated blue block, while Row 02 switches to a soft tint. This creates false visual weight, making Row 01 look accidentally selected or clicked rather than parallel in hierarchy.
2. **Broken Left Alignment Edge:** The index numbers (`01`, `02`) sit inline with the titles, but the descriptions, chips, and links wrap underneath the full width. Aligning text strictly beneath the title (indenting past the number) would create a cleaner vertical scanning line.
3. **Overpowered Chips vs. Core Copy:** The calculation chips take up significant vertical height and visual contrast, dominating over the actual module descriptions rather than acting as subtle supporting data.
4. **Weak Status Affordance:** `"Sudah jalan →"` sits loosely below the chip in faint gray. It is ambiguous whether this is an interactive link, a roadmap status tag, or secondary copy.
5. **Monotonous "Changelog" Template Feel:** Repeating identical vertical stacks of text-box-link with plain hairline rules feels like a raw document or release notes page rather than an engaging, polished SaaS product presentation.