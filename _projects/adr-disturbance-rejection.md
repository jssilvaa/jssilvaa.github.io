---
layout:      page
title:       Active Disturbance Rejection for Humanoid Balance
description:  Giving a whole-body MPC humanoid a sense of touch — estimating unfelt pushes and rejecting them by leaning or stepping. With a live WebAssembly companion you can run in the browser.
img:         assets/img/adr_strip.png
importance:  1
category:    robotics
---

<style>
.adr-lead{font-size:1.22rem;line-height:1.6;font-weight:500;margin:.2rem 0 1.3rem}
.adr-lead strong{color:var(--global-theme-color)}
.adr-cta{display:flex;flex-wrap:wrap;gap:.7rem;margin:0 0 1.8rem}
.adr-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.72rem 1.3rem;border-radius:9px;font-weight:600;font-size:1rem;text-decoration:none;line-height:1;border:1.6px solid var(--global-theme-color);transition:transform .15s ease,filter .15s ease,background .15s ease,color .15s ease}
.adr-btn--primary{background:var(--global-theme-color);color:#fff}
.adr-btn--primary:hover{filter:brightness(1.13);transform:translateY(-1px);color:#fff;text-decoration:none}
.adr-btn--ghost{background:transparent;color:var(--global-theme-color)}
.adr-btn--ghost:hover{background:var(--global-theme-color);color:#fff;transform:translateY(-1px);text-decoration:none}
.adr-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:.8rem;margin:1.6rem 0 2rem}
.adr-stat{background:var(--global-card-bg-color);border:1px solid var(--global-divider-color);border-radius:11px;padding:1rem .9rem;text-align:center}
.adr-stat__n{font-size:1.7rem;font-weight:750;color:var(--global-theme-color);line-height:1.05}
.adr-stat__l{font-size:.82rem;color:var(--global-text-color-light);margin-top:.35rem;line-height:1.32}
.adr-frame{background:var(--global-card-bg-color);border:1px solid var(--global-divider-color);border-radius:13px;padding:.6rem;box-shadow:0 7px 24px rgba(0,0,0,.11);margin:1.3rem 0;overflow:hidden}
.adr-frame img{display:block;width:100%;height:auto;border-radius:8px}
.adr-frame figure{margin:0}
.adr-frame--dark{background:#0a0e15;border-color:#1b2433}
.adr-cap{font-size:.86rem;color:var(--global-text-color-light);text-align:center;margin:.6rem .4rem .2rem}
.adr-frame--dark .adr-cap{color:#9fb0c8}
.adr-cap b{color:var(--global-text-color)}
.adr-frame--dark .adr-cap b{color:#dce6f2}
.adr-points{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:1rem;margin:1.5rem 0}
.adr-point{background:var(--global-card-bg-color);border:1px solid var(--global-divider-color);border-left:3px solid var(--global-theme-color);border-radius:10px;padding:1rem 1.1rem}
.adr-point h4{margin:0 0 .4rem;font-size:1.02rem}
.adr-point p{margin:0;font-size:.91rem;color:var(--global-text-color-light);line-height:1.5}
.adr-timing{max-width:340px;margin-left:auto;margin-right:auto}
</style>

<p class="adr-lead">A standing humanoid is an inverted pendulum that must not fall. <strong>This project gives one a sense of touch it never had</strong> — it estimates the forces acting on the body that no sensor measures, and decides, within a few tens of milliseconds, whether to lean into a push or take a step.</p>

<div class="adr-cta">
  <a class="adr-btn adr-btn--primary" href="https://jssilvaa.github.io/adr-web/" target="_blank" rel="noopener">&#9654;&nbsp; Launch the interactive demo</a>
  <a class="adr-btn adr-btn--ghost" href="https://jssilvaa.github.io/adr-web/assets/report.pdf" target="_blank" rel="noopener">Read the report (PDF)</a>
</div>

<div class="adr-frame adr-frame--dark">
  <img src="{{ '/assets/gif/adr_recovery.gif' | relative_url }}" alt="The Unitree G1 takes a reactive step to absorb a push and returns to balance." />
  <div class="adr-cap">A push too large to absorb in place: the controller commits to a step, catches the fall, and returns to balance.</div>
</div>

<div class="adr-stats">
  <div class="adr-stat"><div class="adr-stat__n">4.9&nbsp;ms</div><div class="adr-stat__l">median MPC solve — inside the 80&nbsp;Hz budget</div></div>
  <div class="adr-stat"><div class="adr-stat__n">~24&nbsp;ms</div><div class="adr-stat__l">to sense an unmeasured push</div></div>
  <div class="adr-stat"><div class="adr-stat__n">&asymp;2&times;</div><div class="adr-stat__l">larger sagittal push survived by stepping</div></div>
  <div class="adr-stat"><div class="adr-stat__n">29&nbsp;DoF</div><div class="adr-stat__l">whole-body Unitree&nbsp;G1, in real time</div></div>
</div>

When something shoves a humanoid — a contact it never planned for, a payload, a person — the
controller has to react to a force it cannot directly measure, and choose its response before the
robot is already on the way down. This project builds and evaluates that reaction on a whole-body
**nonlinear MPC** running on the Unitree G1, and packages the core ideas into a companion you can run
live in your browser.

### Three reactions, one controller

<div class="adr-points">
  <div class="adr-point"><h4>Sense the push</h4><p>A 6-D centroidal-momentum observer reconstructs the external wrench from the gap between the robot's measured momentum rate and what the model predicts from contact forces — no sensor on the disturbance. It reacts in about 24&nbsp;ms.</p></div>
  <div class="adr-point"><h4>Lean into it</h4><p>That estimate is fed forward into the MPC's momentum dynamics, so the controller anticipates the disturbance instead of merely chasing the tracking error it leaves behind.</p></div>
  <div class="adr-point"><h4>Step when needed</h4><p>Past the in-place limit, a capture-point trigger commits the robot to a recovery step through the planner's existing walking machinery.</p></div>
</div>

### From a fall to a recovery

The same push, three controllers. With no disturbance handling the robot topples; sensing and
feeding the push forward lets it recover the identical shove in place; and when the push is simply too
large to absorb standing, it steps.

<div class="adr-frame adr-frame--dark">
{% include figure.liquid path="assets/img/adr_strip_baseline.png" class="img-fluid" zoomable=true alt="Baseline controller falls under a 110 N push." %}
  <div class="adr-cap"><b>Baseline.</b> A 110&nbsp;N sagittal push (&asymp;&#8531; body weight), no disturbance handling — the robot falls.</div>
</div>

<div class="adr-frame adr-frame--dark">
{% include figure.liquid path="assets/img/adr_strip_observer.png" class="img-fluid" zoomable=true alt="Observer feedforward recovers the same push in place." %}
  <div class="adr-cap"><b>Observer feedforward.</b> The <em>same</em> 110&nbsp;N push, now sensed and rejected — the robot leans and recovers in place.</div>
</div>

<div class="adr-frame adr-frame--dark">
{% include figure.liquid path="assets/img/adr_strip.png" class="img-fluid" zoomable=true alt="Reactive stepping catches a larger 200 N push." %}
  <div class="adr-cap"><b>Reactive stepping.</b> A larger 200&nbsp;N push — too big to absorb standing, so the robot steps and catches itself.</div>
</div>

### Sensing and rejecting the push

Feeding the estimated wrench forward extends the range of impulsive pushes the robot can absorb
without moving its feet. Perhaps surprisingly, the band-limited observer estimate does this *slightly
better* than a perfect ("oracle") wrench would: because it does not feed sensor spikes straight into
the contact-force limits, it stays away from saturation.

<div class="adr-frame">
{% include figure.liquid path="assets/img/adr_feedforward.png" class="img-fluid" zoomable=true alt="Fall rate vs push for baseline, oracle and observer feedforward." %}
  <div class="adr-cap">Left: fall rate versus sagittal push. The baseline is failing by 100&nbsp;N, while observer feedforward still recovers at 110&nbsp;N and edges out the oracle. Right: how far ahead the feedforward should look.</div>
</div>

### Stepping doubles the envelope

When leaning is not enough, the capture-point trigger commits to a step. This roughly **doubles** the
sagittal push the robot survives. Laterally it is neutral — a wide stance already absorbs side pushes,
so there is little left for a step to add.

<div class="adr-frame">
{% include figure.liquid path="assets/img/adr_envelope.png" class="img-fluid" zoomable=true alt="Fall rate vs push, with and without reactive stepping, sagittal and lateral." %}
  <div class="adr-cap">Fall rate versus push, with and without reactive stepping. Sagittally (left) stepping roughly doubles the survivable push; laterally (right) the two curves coincide.</div>
</div>

### Real-time, and robust to noise

All of this has to fit in real time. The whole-body MPC (35-state, multiple-shooting SQP on HPIPM,
1.2&nbsp;s horizon at 80&nbsp;Hz) feeds a 500&nbsp;Hz tracking loop on a MuJoCo G1.

<div class="adr-frame adr-frame--dark adr-timing">
{% include figure.liquid path="assets/img/adr_timing.png" class="img-fluid" zoomable=true alt="Per-solve MPC computation time across ~8000 solves." %}
  <div class="adr-cap">Each dot is one solve; rings mark milliseconds. Median 4.9&nbsp;ms (p95&nbsp;5.6&nbsp;ms) across ~8000 solves — well inside the 12.5&nbsp;ms budget.</div>
</div>

And it has to survive imperfect sensing. Under contact-force noise the observer's estimation error and
detection delay stay essentially flat, and the closed-loop recovery holds.

<div class="adr-frame">
{% include figure.liquid path="assets/img/adr_observer_noise.png" class="img-fluid" zoomable=true alt="Observer accuracy, detection delay and closed-loop fall rate across noise levels." %}
  <div class="adr-cap">Across noise levels the relative estimation error (a) and detection delay (b) stay flat; the closed-loop fall rate (d) holds — the robot still recovers a 100&nbsp;N push.</div>
</div>

### Run the analysis yourself

The companion site is not a video — it *is* the analysis, live. The linear-inverted-pendulum reduction
the theory rests on is compiled from the project's C++ to **WebAssembly** and driven in your browser:
a push-recovery sandbox, the full 29-DoF G1 stepping in the real MuJoCo engine, three interactive
widgets for the core results (the divergent capture-point mode and its sensitive dependence; the
*real* observer band-limiting a sharp impulse; the level-crossing floor that sets the stepping
trigger), and a 3-D replay of the actual simulated recoveries built from the simulator's own body
poses. The widgets claim only what the reduced model genuinely shows; the full recovery envelope comes
from the whole-body simulation, through the measured figures above and the replay.

<div class="adr-cta" style="margin-top:1.6rem">
  <a class="adr-btn adr-btn--primary" href="https://jssilvaa.github.io/adr-web/" target="_blank" rel="noopener">&#9654;&nbsp; Launch the interactive demo</a>
  <a class="adr-btn adr-btn--ghost" href="https://jssilvaa.github.io/adr-web/assets/report.pdf" target="_blank" rel="noopener">Read the report (PDF)</a>
</div>
