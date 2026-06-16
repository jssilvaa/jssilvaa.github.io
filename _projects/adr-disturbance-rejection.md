---
layout:      page
title:       Active Disturbance Rejection for Humanoid Balance
description:  External-wrench estimation and disturbance rejection for a whole-body MPC humanoid (Unitree G1), with reactive stepping and a live WebAssembly companion.
img:         assets/img/adr_strip.png
importance:  1
category:    robotics
---

<style>
.adr-lead{font-size:1.16rem;line-height:1.62;margin:.2rem 0 1.3rem;color:var(--global-text-color)}
.adr-cta{display:flex;flex-wrap:wrap;gap:.7rem;margin:0 0 1.8rem}
.adr-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.7rem 1.25rem;border-radius:9px;font-weight:600;font-size:.98rem;text-decoration:none;line-height:1;border:1.6px solid var(--global-theme-color);transition:transform .15s ease,filter .15s ease,background .15s ease,color .15s ease}
.adr-btn--primary{background:var(--global-theme-color);color:#fff}
.adr-btn--primary:hover{filter:brightness(1.13);transform:translateY(-1px);color:#fff;text-decoration:none}
.adr-btn--ghost{background:transparent;color:var(--global-theme-color)}
.adr-btn--ghost:hover{background:var(--global-theme-color);color:#fff;transform:translateY(-1px);text-decoration:none}
.adr-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:.8rem;margin:1.6rem 0 2rem}
.adr-stat{background:var(--global-card-bg-color);border:1px solid var(--global-divider-color);border-radius:11px;padding:1rem .9rem;text-align:center}
.adr-stat__n{font-size:1.65rem;font-weight:700;color:var(--global-theme-color);line-height:1.05}
.adr-stat__l{font-size:.82rem;color:var(--global-text-color-light);margin-top:.35rem;line-height:1.32}
.adr-frame{background:var(--global-card-bg-color);border:1px solid var(--global-divider-color);border-radius:13px;padding:.6rem;box-shadow:0 7px 24px rgba(0,0,0,.11);margin:1.3rem 0;overflow:hidden}
.adr-frame img{display:block;width:100%;height:auto;border-radius:8px}
.adr-frame figure{margin:0}
.adr-frame--dark{background:#0a0e15;border-color:#1b2433}
.adr-cap{font-size:.86rem;color:var(--global-text-color-light);text-align:center;margin:.6rem .4rem .2rem}
.adr-frame--dark .adr-cap{color:#9fb0c8}
.adr-cap i{color:var(--global-text-color);font-style:italic}
.adr-frame--dark .adr-cap i{color:#dce6f2}
.adr-points{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:1rem;margin:1.5rem 0}
.adr-point{background:var(--global-card-bg-color);border:1px solid var(--global-divider-color);border-left:3px solid var(--global-theme-color);border-radius:10px;padding:1rem 1.1rem}
.adr-point h4{margin:0 0 .4rem;font-size:1rem}
.adr-point p{margin:0;font-size:.91rem;color:var(--global-text-color-light);line-height:1.5}
.adr-timing{max-width:340px;margin-left:auto;margin-right:auto}
</style>

<p class="adr-lead">A standing humanoid is an unstable system: small disturbances grow unless they are actively corrected. This project estimates the external forces acting on the robot, which are not directly measured, and supplies that estimate to a whole-body model-predictive controller. The controller rejects the disturbance by redistributing contact forces when the push can be absorbed in place, and by stepping when it cannot. The work is implemented and evaluated on the Unitree G1, with a browser-based companion that runs the core analysis live.</p>

<div class="adr-cta">
  <a class="adr-btn adr-btn--primary" href="https://jssilvaa.github.io/adr-web/" target="_blank" rel="noopener">Launch the interactive demo</a>
  <a class="adr-btn adr-btn--ghost" href="https://jssilvaa.github.io/adr-web/assets/report.pdf" target="_blank" rel="noopener">Read the report (PDF)</a>
</div>

<div class="adr-frame adr-frame--dark">
  <img src="{{ '/assets/gif/adr_recovery.gif' | relative_url }}" alt="The Unitree G1 takes a reactive step to absorb a push and returns to balance." />
  <div class="adr-cap">A push beyond the in-place recovery limit: the controller commits to a step, arrests the fall, and returns to balance.</div>
</div>

<div class="adr-stats">
  <div class="adr-stat"><div class="adr-stat__n">4.9&nbsp;ms</div><div class="adr-stat__l">median MPC solve time (80&nbsp;Hz loop)</div></div>
  <div class="adr-stat"><div class="adr-stat__n">~24&nbsp;ms</div><div class="adr-stat__l">external-wrench detection latency</div></div>
  <div class="adr-stat"><div class="adr-stat__n">&asymp;2&times;</div><div class="adr-stat__l">sagittal recovery envelope with stepping</div></div>
  <div class="adr-stat"><div class="adr-stat__n">29&nbsp;DoF</div><div class="adr-stat__l">whole-body Unitree&nbsp;G1, real-time control</div></div>
</div>

### Method

The controller responds to an unplanned disturbance in three coordinated stages: it estimates the
force, accounts for it in the optimization, and steps if the force is too large to absorb in place.

<div class="adr-points">
  <div class="adr-point"><h4>Estimation</h4><p>A six-dimensional centroidal-momentum observer reconstructs the external wrench from the residual between the measured momentum rate and the model prediction from contact forces. No sensing of the disturbance itself is required; the estimate settles in roughly 24&nbsp;ms.</p></div>
  <div class="adr-point"><h4>Feedforward rejection</h4><p>The estimated wrench enters the controller's momentum dynamics as a feedforward term, so the optimizer accounts for the disturbance directly rather than only correcting the tracking error it induces.</p></div>
  <div class="adr-point"><h4>Reactive stepping</h4><p>When the disturbance exceeds the in-place recovery limit, a capture-point criterion triggers a recovery step, executed through the existing walking planner.</p></div>
</div>

### Disturbance regimes

The same disturbance produces qualitatively different outcomes depending on the controller. Without
disturbance handling the robot falls; with feedforward rejection it recovers the identical push
without moving its feet; and beyond the in-place limit it recovers by stepping.

<div class="adr-frame adr-frame--dark">
{% include figure.liquid path="assets/img/adr_strip_baseline.png" class="img-fluid" zoomable=true alt="Baseline controller falls under a 110 N push." %}
  <div class="adr-cap"><i>Baseline.</i> A 110&nbsp;N sagittal push (about one third of body weight) with no disturbance handling; the robot falls.</div>
</div>

<div class="adr-frame adr-frame--dark">
{% include figure.liquid path="assets/img/adr_strip_observer.png" class="img-fluid" zoomable=true alt="Feedforward rejection recovers the same push in place." %}
  <div class="adr-cap"><i>Feedforward rejection.</i> The same 110&nbsp;N push, estimated and rejected without moving the feet.</div>
</div>

<div class="adr-frame adr-frame--dark">
{% include figure.liquid path="assets/img/adr_strip.png" class="img-fluid" zoomable=true alt="Reactive stepping recovers a larger 200 N push." %}
  <div class="adr-cap"><i>Reactive stepping.</i> A 200&nbsp;N push, beyond the in-place limit; the robot recovers by stepping.</div>
</div>

### Wrench estimation and feedforward

Feeding the estimated wrench forward extends the range of impulsive pushes the robot can absorb
without stepping. The band-limited estimate performs marginally better than an exact (oracle) wrench:
because it does not propagate sensor spikes into the contact-force constraints, it avoids saturating
them.

<div class="adr-frame">
{% include figure.liquid path="assets/img/adr_feedforward.png" class="img-fluid" zoomable=true alt="Fall rate versus push for baseline, oracle and observer feedforward." %}
  <div class="adr-cap">Fall rate versus sagittal push magnitude. The baseline fails by 100&nbsp;N, whereas feedforward rejection still recovers at 110&nbsp;N and is on par with the oracle. The right panel shows the dependence on the feedforward horizon.</div>
</div>

### Reactive stepping

Beyond the in-place limit, the capture-point criterion commits to a recovery step, approximately
doubling the sagittal push the robot tolerates. In the lateral direction the effect is negligible, as
the nominal stance already provides a wide base of support.

<div class="adr-frame">
{% include figure.liquid path="assets/img/adr_envelope.png" class="img-fluid" zoomable=true alt="Fall rate versus push, with and without reactive stepping, sagittal and lateral." %}
  <div class="adr-cap">Fall rate versus push magnitude, with and without reactive stepping. Sagittally (left), stepping roughly doubles the tolerated push; laterally (right), the two curves coincide.</div>
</div>

### Computation and robustness

The controller runs in real time. The whole-body problem (35 states, multiple-shooting SQP on HPIPM,
1.2&nbsp;s horizon at 80&nbsp;Hz) feeds a 500&nbsp;Hz tracking loop on a MuJoCo model of the G1, solving
in a median of 4.9&nbsp;ms.

<div class="adr-frame adr-frame--dark adr-timing">
{% include figure.liquid path="assets/img/adr_timing.png" class="img-fluid" zoomable=true alt="Per-solve MPC computation time across about 8000 solves." %}
  <div class="adr-cap">Per-solve computation time over roughly 8000 solves; each marker is one solve and the rings denote milliseconds. Median 4.9&nbsp;ms (95th percentile 5.6&nbsp;ms), within the 12.5&nbsp;ms budget of the 80&nbsp;Hz loop.</div>
</div>

The estimator is also robust to sensing noise: across contact-force noise levels, both the relative
estimation error and the detection latency remain stable, and closed-loop recovery is preserved.

<div class="adr-frame">
{% include figure.liquid path="assets/img/adr_observer_noise.png" class="img-fluid" zoomable=true alt="Estimator accuracy, detection latency and closed-loop fall rate across noise levels." %}
  <div class="adr-cap">Estimator accuracy (a) and detection latency (b) remain approximately constant across noise levels, and the closed-loop fall rate (d) is preserved; the robot continues to recover a 100&nbsp;N push.</div>
</div>

### Interactive companion

The companion site runs the underlying analysis in the browser. The linear-inverted-pendulum reduction
on which the analysis rests is compiled from the project's C++ to WebAssembly and executed live,
alongside the full 29-degree-of-freedom G1 in the MuJoCo engine, three interactive views of the
central results (the divergent capture-point mode and its sensitivity, the observer's band-limiting of
an impulsive disturbance, and the level-crossing rate that sets the stepping threshold), and a
three-dimensional replay reconstructed from the simulator's recorded body poses. The interactive views
are restricted to what the reduced model rigorously supports; the full recovery envelope is
established by the whole-body simulation, through the figures above and the replay.

<div class="adr-cta" style="margin-top:1.6rem">
  <a class="adr-btn adr-btn--primary" href="https://jssilvaa.github.io/adr-web/" target="_blank" rel="noopener">Launch the interactive demo</a>
  <a class="adr-btn adr-btn--ghost" href="https://jssilvaa.github.io/adr-web/assets/report.pdf" target="_blank" rel="noopener">Read the report (PDF)</a>
</div>
