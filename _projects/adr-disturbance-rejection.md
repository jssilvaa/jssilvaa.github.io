---
layout:      page
title:       Active Disturbance Rejection for Humanoid Balance
description:  A 6-D wrench observer and capture-point stepping on a whole-body nonlinear-MPC humanoid (Unitree G1) — with a live WebAssembly companion you can run in the browser.
img:         assets/img/adr_strip.png
importance:  1
category:    robotics
---

<a class="btn btn-primary" href="https://jssilvaa.github.io/adr-web/" target="_blank" rel="noopener">Launch the interactive demo &rarr;</a>

<img class="img-fluid rounded z-depth-1" src="{{ '/assets/gif/adr_recovery.gif' | relative_url }}" alt="The G1 takes a reactive step to absorb a push and returns to balance." />
<div class="caption">A push too large to absorb in place: the controller steps, catches the fall, and recovers.</div>

A standing humanoid is an inverted pendulum that must not fall. When something pushes it — a shove,
a dropped payload, a contact it never planned for — the controller has to react to a force it cannot
directly measure, and decide within a few tens of milliseconds whether it can recover by leaning or
whether it must take a step. This project builds and evaluates that reaction on a whole-body
**nonlinear MPC** running on the Unitree G1.

### What the system does

- **It estimates the unseen push.** A 6-D *centroidal-momentum observer* watches the gap between the
  robot's measured momentum rate and what the model predicts from the contact forces, and reconstructs
  the external wrench acting on the body — no force sensor on the disturbance required. It detects a
  step change in about 24 ms.
- **It feeds that estimate forward.** The reconstructed wrench enters the MPC's momentum dynamics, so
  the controller anticipates the disturbance instead of only chasing the error it produces. This
  extends the range of impulsive pushes the robot can absorb *in place* — and, perhaps surprisingly,
  the band-limited observer estimate does this slightly better than a perfect (oracle) wrench, because
  it does not feed sensor spikes straight into the contact-force limits.
- **It steps when it has to.** Past the in-place envelope, a capture-point trigger on a
  filtered centre-of-mass velocity commits the robot to a recovery step through the planner's existing
  walking machinery. This roughly **doubles** the sagittal push the robot can survive.

The control stack is a centroidal whole-body MPC (35-state, solved by multiple-shooting SQP on HPIPM,
1.2 s horizon at 80 Hz, median **4.9 ms** per solve) feeding a 500 Hz tracking loop, evaluated in a
MuJoCo simulation of the full G1.

{% include figure.liquid loading="eager" path="assets/img/adr_envelope.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">
  Reactive stepping roughly doubles the sagittal recovery envelope; lateral is neutral, since a wide
  stance already absorbs side pushes.
</div>

### Run the analysis yourself

The companion site is not a video — it is the analysis, live. The linear-inverted-pendulum reduction
the theory rests on is compiled from the project's C++ to **WebAssembly** and driven in your browser:
a push-recovery sandbox, three interactive widgets for the core results (the divergent capture-point
mode and its sensitive dependence; the *real* observer band-limiting a sharp impulse; the level-crossing
floor that sets the stepping trigger), and a three.js replay of the actual simulated recoveries built
from the simulator's own body poses.

The live widgets deliberately claim only what the reduced model genuinely shows; the full recovery
*envelope*, where feedforward and stepping extend the reachable push, comes from the whole-body
simulation and is shown through measured figures and the 3-D replay.

<a class="btn btn-primary" href="https://jssilvaa.github.io/adr-web/" target="_blank" rel="noopener">Launch the interactive demo &rarr;</a>
<a class="btn btn-secondary" href="https://jssilvaa.github.io/adr-web/assets/report.pdf" target="_blank" rel="noopener">Read the report (PDF)</a>
