---
name: Brutalist Archive
colors:
  paper: "#F4F3EF"
  ink: "#0D0D0D"
  rust: "#C94A29"
  cement: "#D4D2CD"
rounded:
  none: 0px
  sm: 2px
hypertokens:
  heavy-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    borderWidth: 3px
    borderColor: "{colors.ink}"
    boxShadow: "6px 6px 0px #000000"
    # Toggle the line below to test the broken reference linter rule:
    # outlineColor: "{colors.nonexistent}"
components:
  exhibit-card:
    style: "{hypertokens.heavy-card}"
    textColor: "{colors.ink}"
---

## Overview

A rigid, high-contrast visual identity inspired by raw industrial typography and modernist architecture. The design language utilizes thick borders, stark offsets, and zero corner curves to evoke an archival, physical printing aesthetic.

## Colors

The system uses mineral tones and high-contrast solids to mirror archival ink and concrete.

*   **Ink (#0D0D0D)**: Solid carbon black used for dense typography, heavy outlines, and solid shadows.
*   **Paper (#F4F3EF)**: An off-white pulpy surface serving as the baseline container background.
*   **Cement (#D4D2CD)**: Mid-tone concrete gray used for page foundations and background fills.
*   **Rust (#C94A29)**: A saturated oxide red reserved exclusively for focal actions and highlights.

## Shapes

Shapes follow a strict layout grid with sharp corners and heavy profiles.

*   **None (none)**: 0px curves. Default for all cards, containers, and buttons.
*   **Small (sm)**: 2px corners reserved for secondary metadata tags.

## Hypertokens

We define our core card presets as composite style mixins:

*   **Heavy Card (heavy-card)**: Stark paper surface, 0px sharp corners, 3px carbon border, and a heavy 6px black drop shadow offset.

## Components

*   **Exhibit Card**: Utilizes `heavy-card` styling for containers, housing metadata in Ink.
