---
layout: post
title: "Your Compiler's Register Problem Is a Coloring Problem"
date: 2026-05-16
tags: [compilers, embedded-systems]
description: "How Chaitin unified register allocation and spilling via graph coloring."
math: true 
---

## The Problem

You've written a tight inner loop. It has 40 live values. Your target has 32 registers. Something has to go to memory — but _what_, and _when_? Pre-Chaitin compilers answered this with local heuristics bolted on after the register assignment already failed: spill the most recently used value, or the one with the longest live range, or whatever the implementer guessed would hurt least. The result was redundant load/store pairs in the worst place possible — inside the hot path — and a compiler architecture where the spill logic was decoupled from the allocation logic, so they couldn't reason about each other. You paid in code quality and in compile time.

## The Idea

Chaitin's insight is that register allocation _is_ graph coloring, exactly, and that spilling belongs inside the coloring algorithm, not after it.

Build an **interference graph** $G = (V, E)$: one node per symbolic register, an edge between two nodes if they're ever simultaneously live. Now, assigning $k$ physical registers is equivalent to $k$-coloring $G$ — two nodes sharing an edge can't share a color. The coloring algorithm is simple: find any node with fewer than $k$ neighbors, remove it, recurse, then reinsert and assign it any color not taken by its neighbors. A free color is always guaranteed to exist because it has fewer than $k$ neighbors.

When every node has $k$ or more neighbors, the algorithm is _blocked_. This is where Chaitin integrates spilling: instead of bailing out, pick the node $v^*$ that minimizes

$$v^* = \arg\min_{v} \frac{\text{cost}(v)}{\deg(v)}$$

where $\text{cost}(v)$ weights each definition and use of $v$ by estimated execution frequency (approximated as $10^{\text{loop depth}}$), and $\deg(v)$ is how much interference pressure that register is exerting. Spill it: replace the global live range with short-lived temporaries — load before each use, store after each definition — rebuild the graph, and retry. The retry graph is strictly smaller. Repeat until coloring succeeds.

The cost/degree ratio captures exactly the right tradeoff: you want to evict the register that relieves the most pressure (high degree) for the least runtime cost (low execution-weighted use count). Loop-invariant values that can be recomputed fall to the bottom of the list immediately; values used in every iteration stay protected.

## Why It's Non-Obvious

The naive move is to separate concerns: do liveness analysis, do allocation, and if it fails, spill greedily and restart. Every compiler before this did exactly that. The problem is that spill decisions made _outside_ the coloring loop can't see which nodes are actually causing the blockage or how much pressure each one contributes. You end up spilling something that doesn't unblock the graph, or spilling a hot value when a cold one would have done.

The non-obvious move is recognizing that the degree of a node in the interference graph is already the right measure of allocation pressure — it's not a proxy, it's the actual constraint. Dividing cost by degree turns a graph property into a spill priority queue, and doing it _inside_ the simplification loop means every spill decision is made with current graph structure, not a stale snapshot from before coloring started.

## Caveats Worth Knowing

**The loop-depth frequency proxy is a heuristic.** Weighting by $10^{\text{depth}}$ works well for regular loop nests but mispredicts for cold branches inside hot loops, or any control flow that doesn't nest cleanly. Profile-guided optimization replaces this proxy with measured frequencies — straightforward in principle, but it requires PGO infrastructure and a representative workload.

**Coalescing is conservative.** Chaitin merges copy-related registers ($r_i \leftarrow r_j$) only when they don't already interfere. He never breaks an existing interference to enable a merge. On SSA-form IR with many $\phi$-copies, this leaves copy-elimination on the table. George & Appel's iterated coalescing (1996) addresses this, but it's a substantially more complex algorithm.

**The memory footprint is quadratic.** The interference graph is stored as a $|V| \times |V|$ bit matrix for $O(1)$ adjacency queries. For large functions with many symbolic registers, this becomes the binding constraint. Chaitin notes it explicitly — it's not a theoretical concern, it's a practical one on the machines of 1982, and it resurfaces today in functions with very large register pressure (e.g., auto-vectorized code with wide SIMD temporaries).

## What I'd Explore Next

The obvious extension is swapping the loop-depth proxy for real profile data and measuring how much spill quality improves on irregular control flow — the kind you see in state machines or parsers, where the hot path isn't a clean loop nest. My prior is that the gains are significant and that most compilers are leaving code quality on the floor here.

The other thread is the interaction with register-classed architectures: modern targets have separate integer, FP, and vector register files, which partition the interference graph into disconnected subgraphs with different $k$ for each. The cost/degree heuristic should generalize cleanly, but the coalescing logic gets more complicated when a copy crosses class boundaries (e.g., a float moved into a vector register). Worth working through against a real RISC-V V-extension backend.