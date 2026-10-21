# Bencho PRO: brief desain yang diambil

Sumber: /api/block-source bencho.dev lewat akun Pro (5 akun farm, `/root/bencho-farm/`).
81 blok Pro; 27 dibaca penuh (TSX). Di bawah ini brief aslinya, apa adanya, sebagai acuan
komentar/keputusan desain untuk port vanilla di Olano.

## Blok Pro yang TSX-nya berhasil dibaca

### asset-swap  (20467 chars)
```
══ Asset swap ═══════════════════════════════════════════
   Two rounded slabs, one over the other, each holding a coin and
   an amount, and an arrow on the seam saying which way the swap
   goes. Press the arrow and it turns to point the other way.
   The slabs and the coins in them stay exactly where they are:
   only the direction changes, and the labels with it — whichever
   slab the arrow leaves is "You pay", the one it points at is
   "You receive".

   ── THE ARROW KEEPS TURNING ONE WAY ──────────────────────
   Half a turn every press, counted up rather than flipped
   between 0 and 180, so the second press carries on round
   instead of unwinding back the way it came.

   ── THE SLAB IS THE PICKER ───────────────────────────────
   Press a coin and the slab it sits in grows — the same element,
   its height animated — until it covers the whole block: the top
   slab down over the bottom one, the bottom slab up over the top.
   Its own face fades out and the list of coins loads inside it;
   pick one and it shrinks back to a slab. Nothing is laid over
   it and nothing replaces it. Picking
   the coin already on the other slab swaps the two, which is
   what every exchang
```

### card-swap  (6391 chars)
```
══ Card swap ════════════════════════════════════════════
   A stack of photo cards in depth, each a step further back and up
   to the right, slanted. Every few seconds the front card goes
   straight to the back and the rest step forward. Pointing at the
   stack pauses it; press the front card, or drag and fling it, to
   send it back yourself.

   ── A CARD IS ITS SLOT ──────────────────────────────────
   The order is the only state: which card is in front, which is
   behind it. A slot is a fixed transform, so moving a card is
   changing its slot and letting the transition carry it — the card
   sent back takes the back slot's paint order AT ONCE and travels
   there behind the others. That needs the paint order to be the
   z-index and not the depth, so the stage is flat (no preserve-3d)
   and the perspective sits on the stage itself, aimed at the
   block's middle as it was when it sat on .csw.
```

### drag-ball  (13492 chars)
```
══ Dragging ball ════════════════════════════════════════
   One circle, and the only thing it does is follow your
   finger. What makes it worth a card is the TRAIL: the ball
   itself is pinned to the pointer with no lag at all, and a
   second body chases it a beat behind, so the goo between them
   stretches into a tail while you are moving and collapses
   back into a circle the moment you stop.

   Which is the same construction as the liquid toggle's
   straggler, with the drag standing in for the spring: there
   the thumb was thrown to a destination, here it is held.

   ── the rules this obeys ────────────────────────────────
   The bodies are in FLOW, both in one grid cell — an
   absolutely positioned child measures as a zero-radius box
   and the filter draws nothing. The group's fill is OPAQUE,
   because the contrast step erases anything under about 0.39
   alpha. And the layer takes the 1/k correction, because
   `move` measures screen pixels and every card here is drawn
   at a fraction of its size.
```

### emoji-reactions  (18781 chars)
```
══ Emoji reactions ══════════════════════════════════════
   A message, the reactions under it, and a button that turns the
   MESSAGE ITSELF into a pill of emoji. Pick one and it FLIES from
   the pill down to its chip, lands with a squash, and the count
   rolls up — and the pill turns back into the message.

   ── THE MESSAGE BECOMES THE PICKER ──────────────────────
   One surface, two contents. Opening, the message's pill eases
   to the width of the emoji row while its words fade and blur
   away and the emoji rise in, one after another; closing runs it
   back. Nothing appears from nowhere above the row — the thing
   you were reacting to is what offers the reactions.

   ── ONE EMOJI AT A TIME ─────────────────────────────────
   The emoji under the pointer is big and every other one is its
   own size — no falloff into the neighbours, and a quick pop
   rather than a slow grow, so it is always clear which one a
   press will pick. A small label names it.

   ── A REACTION TRAVELS ──────────────────────────────────
   The chip it is going to is laid out first, with its emoji held
   back, so the landing spot is a real measured place; then a
   copy arcs there from where you
```

### eye-tracker  (19327 chars)
```
══ Eye tracker ═══════════════════════════════════════════
   A ball with two eyes that watches your cursor, wherever it is
   on the page.

   ── THE EYES ARE ON THE BALL, NOT IN FRONT OF IT ───────────
   The easy version slides two shapes toward the pointer, and it
   reads as stickers on a disc. Here each eye is a point on the
   sphere's surface: looking left turns the ball, so an eye
   travels along the curve, and the one heading for the rim
   moves less and narrows as it turns away from you while the
   other swings wide. That foreshortening is the whole trick —
   it is what makes a flat circle read as something round.

   One turn (yaw and pitch) is the state, sprung toward where
   the pointer is; both eyes are read off it, so they can never
   disagree. It relaxes back to facing you when the pointer
   leaves the window, and it blinks on its own now and then.

   Written straight to the DOM every frame, never through state:
   a pointer move is not a render.
```

### folding-bill  (23894 chars)
```
══ Folding bill ═════════════════════════════════════════
   A one-dollar bill blown in glass that you can take hold of:
   drag it and it bends after your hand, fold a corner over and
   it creases, let go and it eases flat and floats back.

   ── IT IS CLOTH ─────────────────────────────────────────
   The bill is a grid of points joined by springs that hold
   their length — along the grid, across its diagonals, and
   two points apart for bending — integrated with Verlet and
   relaxed a dozen times a frame. Nothing about folding is
   written anywhere: take hold of one point and move it, and
   the rest follow because the springs will not stretch. The
   bending springs are the Stiffness knob, paper at one end and
   silk at the other.

   ── AND IT WANTS TO BE FLAT ─────────────────────────────
   Every point is pulled, gently, toward where it sits on a flat
   bill in the middle of the frame. Held, that pull nearly lets
   go so the hand wins; released, it smooths the folds out and
   brings the bill home, at the rate Settle sets.

   ── THE GLASS IS LIGHT AND A BUMP ───────────────────────
   No refraction: a pale, glossy surface under a studio of soft
   lights, with the r
```

### heat-word  (16112 chars)
```
══ Heat word ════════════════════════════════════════════
   A big word in flat, dull grey — until the hand comes. Around
   the cursor the word turns into a heat map of its own shape:
   deep navy in the middle of every stroke, through blue, cyan,
   yellow, orange and red, to a pink rim. Right under the pointer
   the heat opens up and the strokes thin, like something melting;
   leave and it fades back to grey. Press it and the next shape
   melts in.

   ── A FIELD, THEN A PALETTE ─────────────────────────────
   The word is drawn once, blurred, into a grey field: bright in
   the thick of a stroke, fading at its edge. The cursor adds a
   soft round of heat to that field. Every pixel's brightness is
   then looked up in a 256-entry table of colours. Two strokes
   close together overlap in the field, so they fuse where the
   heat pools — that is the liquid, and nothing animates it but
   the field.

   ── THE BLUR IS A SHADOW ────────────────────────────────
   ctx.filter is not in every Safari, shadowBlur is. The word is
   drawn far off the canvas with its shadow thrown back on, so
   only the blurred shadow lands.
```

### image-compare  (7052 chars)
```
══ Image compare ════════════════════════════════════════
   One picture, two states of it, and a line to drag across.
   Left of the line is the raw shot, right of it the edit. Drag
   slowly and it stays where you leave it; flick it and it
   glides to the edge you threw it at.

   ── TWO PICTURES, ONE FRAME ─────────────────────────────
   The x-ray and the colour photograph are the same scene at the
   same size, so the two halves line up exactly and the line
   reads as seeing through the picture.

   ── THE LINE IS JELLY ───────────────────────────────────
   The knob is exactly where the finger is; the two ends of the
   line are not. They follow it on an under-damped spring, so a
   hard swing leaves them behind and the line bows into a curve,
   then wobbles straight when you stop. The before layer is cut
   along the SAME curve — clip-path: path(), in the block's own
   pixels — so the picture's edge bends with the line rather than
   the line bending over a straight cut.

   ── THE LAYERS DRIFT ────────────────────────────────────
   The back layer moves a few pixels against the line as it
   goes, so the wipe reads as two sheets with depth between them
   rather than a 
```

### label-input  (7350 chars)
```
══ Label input ══════════════════════════════════════════
   A field whose label is its placeholder until you are in it.
   On focus the label lifts into the top edge with a small hop
   running along its letters, the outline darkens in place, and
   the top line parts under the label from its middle outward.

   ── ONE THING MOVES ─────────────────────────────────────
   It used to DRAW its outline out of the notch, both ways
   round the field — and that was the field performing, which
   is too much for a thing you focus forty times a day. Now the
   outline is always whole; focus only changes its ink and
   opens the gap. The label is the event, and the line makes
   room for it.

   The gap is two short paths across the notch, each from the
   middle to one side, retracted from the middle outward by a
   negative dash offset.
```

### liq-create  (12541 chars)
```
══ Liquid ═══════════════════════════════════════════════
   Three metaball studies: a toggle, a reorderable list, and
   a create menu.

   RECONSTRUCTED. The original file was destroyed; this is
   rebuilt against the surviving stylesheet, which specifies
   the geometry, the layering and the timing exactly. The
   behaviour matches what index.css and the catalog demos
   require. The original's internal reasoning is not
   recoverable and is not reproduced here.

   ── the shared constraint ───────────────────────────────
   Everything on a filtered layer must be OPAQUE. The goo
   filter thresholds alpha, so a translucent fill under it
   disappears. That is why each of these has two layers: an
   opaque blob layer that carries the filter, and an unfiltered
   layer above it carrying the text — antialiased type would
   be eaten by the same threshold.
```

### liq-toggle  (14971 chars)
```
── what this block expects the page to provide ───────

#liq-goo — an SVG filter the stylesheet points at. Mount it once,
   anywhere in the page, inside an <svg width="0" height="0"
   style={{ position: "absolute" }}><defs>…</defs></svg>:

   <filter id="liq-goo" x="-50%" y="-50%" width="200%" height="200%"
           colorInterpolationFilters="sRGB">
     <feGaussianBlur in="SourceGraphic" stdDeviation={7} result="smear" />
     <feColorMatrix
       in="smear"
       type="matrix"
       values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
     />
   </filter>
```

### one-time-code  (15973 chars)
```
══ One-time code ════════════════════════════════════════
   Six small cells and a caret. Digits rise into their cells;
   a right code draws the cells together until they fuse into
   one capsule that says so, and a wrong one sends a shiver
   down the row and drains the digits out.

   ── SIX CELLS, ONE FIELD ────────────────────────────────
   The same call the sign-in sheet makes, for the same reasons:
   six real inputs break paste, autofill from the notification,
   backspace and screen readers. So there is one invisible
   input over the row and the cells are drawn underneath it.

   ── THE MERGE IS THE GOO'S ──────────────────────────────
   The cells sit under a blur-and-threshold filter, far enough
   apart that it never bridges them. Verifying slides them to
   the middle while a capsule grows out of the same point: as
   they close, the filter joins them, and what is left is one
   shape. Nobody draws the in-between — it is the filter
   deciding when two things are close enough to be one.

   ── THE ANSWER IS A KNOB ────────────────────────────────
   A code nobody on the wall can know is not a demonstration.
   Accept and Reject are the two things the component does
 
```

### rolling-counter  (13015 chars)
```
══ Rolling counter ══════════════════════════════════════
   A number between a minus and a plus. Every digit is a strip
   of 0–9 behind a window, and changing the number rolls the
   strips to their new digits like an odometer.

   ── EACH COLUMN COUNTS, IT DOES NOT SHOW ───────────────
   A column's target is not its digit but the number of whole
   tens, hundreds… in the value: 1284 is 1284 for the ones
   column, 128 for the tens, 12 for the hundreds. So 9 → 10 is
   the ones column moving FORWARD one more step (9 → 0) and the
   tens moving forward one — never a strip running back down
   through eight digits to reach zero. The strip is 0–9 and a
   second 0, and where it sits is the count taken round ten.

   ── ONE SPRING PER COLUMN, AND THEY GO IN TURN ─────────
   A change reaches the ones first and each column to the left
   a little later — Stagger — so a carry reads as a carry,
   rippling up the number, rather than the whole row jumping.

   ── THREE WAYS TO CHANGE IT ────────────────────────────
   Press a button for one step; hold it and it repeats, faster
   and in bigger steps the longer you hold. Or take the number
   itself and drag it up or down, a step every f
```

### slide-confirm  (21080 chars)
```
══ Slide to confirm ═════════════════════════════════════
   A handle you push across a track. It follows the finger
   exactly, and past the mark it takes over and finishes the
   journey itself.

   THE HANDLE BECOMES THE ANSWER. On commit it does not hand
   over to a tick somewhere else — it unfurls leftward and
   fills the track it was crossing, and the arrow it was
   carrying becomes a check. One object changing shape, which
   is the case a morph is actually for, and the reason this
   needs no second element to say "done".

   The right edge does not move while that happens: the width
   grows by exactly what the offset loses. So the handle
   arrives, plants itself, and opens out behind it.
```

### stacked-bars  (11177 chars)
```
══ Stacked bars ═════════════════════════════════════════
   An alert-volume card: a stack of four sources for every day (or
   week), and under the baseline the few that were escalated.

   ── RUN ALONG IT ────────────────────────────────────────
   The column under the pointer gets a ring round its whole stack,
   the rest step back (their colour mixed toward the slab, never
   faded), and one tooltip glides beside it on a spring with the
   date, the total and what made it up.

   ── DAY / WEEK ──────────────────────────────────────────
   Swaps the dataset; every segment eases to its new height and
   offset a beat after its left neighbour. The same transition
   grows the bars out of the baseline the first time the card is
   seen.
```

### step-player  (20106 chars)
```
══ Step player ══════════════════════════════════════════
   A row of dots and a play button. The dot for the current
   step is stretched into a bar that fills while the step runs;
   when it is full the bar eases over to the next dot, and a
   small wave runs through the dots it crossed.

   ── EVERY DOT IS A PILL WITH TWO EDGES ──────────────────
   There is no separate "active bar" travelling over the dots.
   Each dot is a pill with a left and a right edge, and the
   current step is simply the dot whose slot is wide. Changing
   step changes two slot widths and every edge eases to where
   its slot now is — which is what moves the bar, shrinks the
   old one and slides the dots in between.

   ── THE WAKE ────────────────────────────────────────────
   Chosen on the canvas from six ways of changing step, and
   then from seven kinds of ripple. The dots the bar passed
   over stand up and settle one after another, in the order it
   crossed them, and the bar it landed on answers last — a
   boat's wake rather than a stone dropped in a pond.

   Wake is also the knob, and its two ends were two of the
   seven: at 100 the whole wake, at 0 only the dot beside the
   landing moves
```

### time-scrubber  (11532 chars)
```
══ Time scrubber ════════════════════════════════════════
   A time over a ruler. Drag the ruler under the centre mark and
   the time runs with it; fling it and it coasts, then settles on
   the nearest step.

   ── ONE SPRING FOR THE THROW AND THE SNAP ───────────────
   On release the landing is decided at once: where the ruler
   would coast to at the speed it was let go, rounded to the
   nearest step. Then one spring carries it there, starting with
   the hand's own velocity — so a flick coasts and a slow
   release just settles, and there is no seam between "gliding"
   and "snapping" because they are the same motion.

   ── A DIAL SEEN FROM THE FRONT ──────────────────────────
   Ticks at the centre stand tall and dark and fall away toward
   the edges, in height and in ink, which is what makes a flat
   strip read as the face of a wheel. Only the ticks near the
   window are drawn at all, so a day of them costs thirty.
```

### toast-stack  (6703 chars)
```
══ Toast stack ══════════════════════════════════════════
   Three toasts, always: the newest in front, the two before it
   tucked behind with a sliver of each showing above it, a step
   smaller each and a barely-there grey (the reference's tones). Point at the stack and it
   fans out into a list; move away and it gathers back up.

   ── ONE SPRING, THREE PLACES ────────────────────────────
   A toast's place is worked out from how far back it is and
   whether the stack is open, and Framer springs it there. Opening,
   closing, a toast leaving and the next arriving are all the same
   move — every toast heading for its new place on the same spring,
   a touch under critical so it settles with a hint of give.

   ── HOVER IS THE WHOLE FRAME ────────────────────────────
   The stack opens about its middle, so the front toast moves when
   it opens. Hovering the toasts themselves would let the list slide
   out from under the pointer and close again; the frame is the
   list's own size, so hovering it is hovering the list. Pointer
   over/out with a containment test rather than enter/leave, so the
   wall's demonstration — which dispatches its own pointer events,
   and leaves wit
```

### todo-tower  (46766 chars)
```
══ Todo tower ════════════════════════════════════════════
   A list stacked like bricks, under gravity. Check one off and
   it is pulled out; take one out by hand and the rest come
   down after it. Pick anything up off the floor and put it
   back, or throw it.

   ── THE CARDS ARE RIGID BODIES NOW, AND THEY TURN ────────
   The version before this was bodies too, but only x and y:
   a card could slide off another and drop, and it dropped
   level, because nothing in it knew what an angle was. What
   was asked for next is the part that model could not fake —
   a card that is mostly hanging off the one under it TIPS,
   turning about the edge it was resting on, and goes over
   onto the floor on its side.

   That is torque, and torque needs a real solver, so the
   physics moved out to lab/rigid.ts: rotated boxes, contacts
   clipped to the faces that are actually touching, friction,
   and impulses solved together so a stack can stand. Nothing
   in this file decides that a card tips. It tips because its
   centre of mass is past the edge of its support and gravity
   does the rest.

   ── THE WHOLE CARD IS THE ROOM ───────────────────────────
   The block keeps its own fixe
```

### upload-dropzone  (16259 chars)
```
══ Upload dropzone ══════════════════════════════════════
   A drop box, and three files lying on a tray under it. Pick
   one up and carry it into the box: it uploads there — name,
   a rolling percentage, a bar — ticks, and goes back to the
   tray so you can do it again.

   ── NO REAL FILES ───────────────────────────────────────
   The files are part of the block. Nothing is read from the
   desktop and nothing is sent anywhere; the drag is an ordinary
   pointer drag inside the block, which is also what lets the
   wall's scripted cursor demonstrate it.

   ── THE BOX INHALES, AND SWALLOWS ───────────────────────
   A plain filled box, no edge. A file carried over it is
   answered before it is let go: the box grows with a small
   bounce and the arrow lifts toward the hand. Let go and the
   file is SUCKED in — it accelerates toward the box's middle,
   shrinking and drawing out long as it goes — and the box gives
   a little gulp before the upload appears in it. Let go
   anywhere else and the file springs home.

   ── ONE OF THEM IS TOO BIG ──────────────────────────────
   The limit is fixed at 5 MB and the video is always over it,
   so dropping it shakes the box, says s
```

### voice-note  (14097 chars)
```
══ Voice note ═══════════════════════════════════════════
   Hold to record. The pill opens into a bar and the level
   rises in it as bars, newest on the right. Let go and the
   recording becomes a clip: press play and the bars light up
   as the playhead passes them, drag across them to scrub.
   Slide left while holding and it is thrown away — the bars
   collapse and the pill closes back to where it started.

   ── A CONCEPT, NOT A RECORDER ───────────────────────
   Nothing listens. The level is a stand-in shaped like speech —
   syllables inside phrases, with pauses — so the block is about
   the gesture and the shapes, and asks nobody for a microphone.

   ── THE PLAYHEAD IS A NUMBER, NOT A RENDER ──────────────
   Progress is one CSS variable on the wave, and each bar
   decides its own brightness from it and its index in calc().
   Playing costs no React renders at all.
```

### wake-slider  (6061 chars)
```
══ Wake slider ══════════════════════════════════════════
   A range with no thumb: a row of thin bars, solid up to the
   value and faint after it, with the reading beside them. Drag
   anywhere along it. Drag slowly and the bars simply fill; drag
   fast and every bar the value sweeps past springs up, taller the
   faster you went, and settles back — a wake left behind the hand.

   ── EACH BAR HOLDS A LITTLE ENERGY ──────────────────────
   When the value crosses a bar, that bar takes energy from the
   speed of the drag. Every frame all of it decays at the same
   rate, so the bars crossed longest ago have fallen furthest: the
   tallest ones are always at the hand and the run tails off
   behind it. That falloff IS the wake; nothing draws it.

   ── WRITTEN, NOT RENDERED ───────────────────────────────
   The heights change every frame, so they go straight onto each
   bar's transform from a ref. React renders when the value
   changes, which is what the reading and the colours need, and
   the loop runs only while some bar still has energy.
```

## Blok Pro yang 403 (gate server-side, bukan kebocoran)
access-request, activity-stack, ai-chat-input, album-shelf, ascii-wake, avatar-group, billing-card, blast-radius, blocks-loader, blueprint-loader, bounce-loader, browser-tabs, budget-slider, call-island, card-fan, card-stack, code-reveal, collapsing-sidebar, connect-sources, copy-field, country-wheel, date-reel, dot-globe, dot-loader, dot-swarm, edge-light, falling-text, faq-accordion, feedback-bar, flight-island, foggy-word, fold-dropdown, form-error, heart-rate, hold-delete, hub-diagram, icon-bar, image-shimmer, line-sidebar, line-sphere, liq-arrange, load-cards, magnetic-dots, mb-holo, morph-loader, music-island, option-wheel, orbit-cards, page-peel, password-strength, pay-button, picker-wheel, pill-accordion, pixel-loader, price-flow, profile-card, progressive-blur, radial-pop-out, resizable-panels, resize-frame, scratch-card, segment-timer, share-pill, shimmer-text, skeleton-morph, split-view, sweep-button, swipe-deck, swipe-row, tab-bar, tag-input, text-blur, text-fade, text-rise, trace-loader, tree-view, voice-chat, wave-loader, world-clock