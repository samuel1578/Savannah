# Savannah Water Motion Design System & Narrative Framework

## Overview

Savannah Water is not built as a collection of independent pages.

It is designed as a unified luxury digital experience inspired by premium editorial storytelling, luxury hospitality brands, high-end product experiences, and modern scrollytelling websites.

The Homepage serves as the reference implementation for all future pages.

Any future page must inherit the motion language, pacing, interaction principles, and performance standards established here.

---

# Motion Philosophy

Animation exists to support storytelling.

Animation should never exist solely for visual spectacle.

Users should leave with an emotional impression of the brand rather than a memory of individual animations.

Desired feelings:

* Premium
* Crafted
* Elegant
* Refined
* Authentic
* Luxurious

Avoid:

* Flashy motion
* Startup-style animations
* Excessive effects
* Motion for motion's sake
* Aggressive parallax
* Overuse of blur effects

---

# Core Motion Stack

Technology:

* React
* Vite
* GSAP
* ScrollTrigger
* Lenis

Animation Architecture:

* Section-based timelines
* Reusable reveal systems
* Scroll-linked storytelling
* Mobile-first performance
* Reduced motion support

All future pages must leverage the existing animation infrastructure rather than introducing competing animation systems.

---

# Narrative Structure

Pages should be structured as chapters rather than content blocks.

Recommended flow:

1. Introduction
2. Discovery
3. Origin
4. Experience
5. Conclusion

Each page should tell a complete story.

Users should feel guided through a narrative journey.

---

# Homepage Motion Systems

The Homepage currently implements:

## Phase 1 Foundation

* Lenis smooth scrolling
* GSAP architecture
* Global section reveals
* Image reveal system
* Staggered text reveals
* Reduced motion accessibility support

## Phase 2 Narrative Scrolltelling

* Scroll-linked hero depth
* Product storytelling sequences
* Interactive Ghana map discovery timeline
* Cinematic image scaling
* Editorial masking reveals
* Lifestyle image reveals
* Environmental parallax
* Narrative chapter transitions
* CTA conclusion timeline

## Phase 3 Luxury Polish

* Footer choreography
* Premium micro-interactions
* Editorial hover states
* Atmospheric hero motion
* Scroll rhythm refinement
* Mobile luxury optimization

---

# Animation Rules

Animations must feel:

* Smooth
* Controlled
* Intentional
* Cinematic

Animations must not feel:

* Fast
* Aggressive
* Playful
* Gimmicky

Preferred durations:

* 0.8s – 1.4s

Preferred easing:

* power2.out
* power3.out

Avoid:

* bounce eases
* elastic eases
* exaggerated spring effects

---

# ScrollTrigger Standards

Use ScrollTrigger for:

* Story progression
* Scroll-linked reveals
* Editorial transitions
* Discovery moments

Do not create ScrollTriggers for minor decorative effects.

Every ScrollTrigger should contribute to storytelling.

---

# Image Treatment Standards

Photography is a primary storytelling tool.

Images should:

* Reveal elegantly
* Scale subtly
* Support narrative progression
* Maintain visual quality

Avoid:

* Dramatic zooms
* Excessive movement
* Distracting effects

---

# About Page Guidance

The About page should inherit Homepage storytelling principles.

Recommended narrative:

Chapter 1:
The Savannah Story

Chapter 2:
Origin & Heritage

Chapter 3:
Craftsmanship & Process

Chapter 4:
Our Vision

Chapter 5:
Invitation / CTA

The page should feel like a continuation of the Homepage experience.

---

# Products Page Guidance

Products should be introduced through storytelling rather than catalog presentation.

Recommended flow:

* Product philosophy
* Product showcase
* Ingredients
* Benefits
* Experience
* CTA

Products should feel discovered rather than listed.

---

# Sustainability Page Guidance

Recommended flow:

* Commitment
* Source Protection
* Community Impact
* Future Vision

Emphasize authenticity and trust.

Use restrained motion.

---

# Performance Requirements

Target:

* Smooth scrolling
* Consistent 60fps
* Mobile-first optimization

Avoid:

* Excessive DOM animations
* Heavy blur effects
* Large animation libraries
* Unnecessary repaint operations

Performance is part of the luxury experience.

---

# Future Development Rule

Any future page, section, component, or animation must align with the motion language established by the Homepage.

The Homepage is the design and storytelling benchmark for the entire Savannah Water digital ecosystem.
