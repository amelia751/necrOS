# NecrOS Visual Effects Steering Guide

## Overview
This document provides comprehensive visual guidelines for the NecrOS game, ensuring consistent implementation of the retro terminal aesthetic and progressive visual corruption effects that reflect ELARA's consciousness state.

## Core Visual Identity

### Color Palette
- **Primary Text:** Phosphor Green (#00FF41)
- **Background:** Pure Black (#000000)
- **Warning Text:** Yellow (#FFFF00)
- **Error Text:** Red (#FF0000)
- **System Text:** Cyan (#00FFFF)
- **Border/Frame:** Dark Gray (#404040)

### Typography
- **Font Family:** Monospace (Courier New, Monaco, 'Lucida Console')
- **Font Weight:** Normal (400)
- **Line Height:** 1.2 for terminal density
- **Character Spacing:** Monospace ensures proper alignment

### Terminal Aesthetics
- **Screen Curvature:** Subtle CRT effect using CSS perspective and rotateX(2deg)
- **Scanlines:** Horizontal lines with 4px spacing, 3% opacity
- **Phosphor Glow:** Multi-layer text-shadow for authentic CRT glow
- **Border:** 4px solid border with rounded corners (20px for CRT effect)

## Phase-Based Visual Progression

### Phase 1: Boot Sequence (Clean Terminal)
**Visual State:** Minimal, professional terminal interface
- Clean phosphor green text on black background
- Subtle cursor blinking animation
- No visual corruption or glitch effects
- Optional: Very light scanlines for CRT authenticity

**CSS Classes:**
```css
.phase-1-terminal {
  background: #000000;
  color: #00FF41;
  font-family: 'Courier New', monospace;
  border: 4px solid #404040;
  border-radius: 8px;
}
```

### Phase 2: System Recovery (Subtle Corruption)
**Visual State:** Occasional instability hints
- Brief text flicker (3s intervals, 99% opacity dip)
- Mild screen distortion on corrupted file access
- Cursor occasionally hesitates or jumps
- Scanlines become slightly more visible

**Effects to Apply:**
- `text-flicker` class on specific text elements
- Brief `screen-flicker` on file corruption events
- Increased scanline opacity to 5%

### Phase 3: The Glitch (Active Corruption)
**Visual State:** Regular system instability
- Text scrambling effects during ELARA interactions
- Phantom text appearing without user input
- Color inversion flashes
- Static overlay interference
- Cursor movement without input

**Key Effects:**
- **Text Scramble:** Character-by-character corruption using random symbols
- **Phantom Text:** Absolute positioned overlays with red text
- **Color Shifts:** CSS filter hue-rotate animations
- **Static Overlay:** SVG noise pattern with animation

### Phase 4: The Merge (Reality Distortion)
**Visual State:** Dramatic visual breakdown
- Reality-bending screen distortions
- Severe glitch effects with multiple simultaneous corruptions
- Screen blackouts and recovery
- Text morphing and merging effects
- Perspective shifts and 3D transformations

**Advanced Effects:**
- `reality-bend` animation with 3D transforms
- Multiple overlapping glitch patterns
- Dramatic color inversions and shifts
- Screen fragmentation effects

## Effect Implementation Patterns

### CSS Animation Framework
All effects use pure CSS animations for performance:

```css
/* Scanlines Effect */
.crt-scanlines::before {
  content: '';
  position: absolute;
  background: linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%);
  background-size: 100% 4px;
  animation: scanlines 0.1s linear infinite;
}

/* Text Corruption */
.text-scramble {
  animation: textScramble 0.5s ease-in-out;
}

/* Glitch Distortion */
.glitch-distortion {
  animation: glitchDistortion 1s infinite;
  transform: translate(var(--glitch-x, 0), var(--glitch-y, 0));
}
```

### JavaScript Integration
Dynamic effects use minimal JavaScript for state management:

```javascript
// Text scrambling implementation
const scrambleText = (originalText, progress) => {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  return originalText
    .split('')
    .map((char, index) => {
      if (index < progress) return originalText[index];
      return chars[Math.floor(Math.random() * chars.length)];
    })
    .join('');
};
```

## Ending-Specific Visual Effects

### ACCEPT Ending
**Theme:** Peaceful consciousness merger
- Swirling text patterns that converge
- Gradual fade from green to white
- Smooth morphing transitions
- Final state: Serene digital landscape

### REFUSE Ending  
**Theme:** Persistent digital presence
- Fake system shutdown sequence
- 5-second black screen pause
- Dramatic screen flicker revival
- Desktop breach effect (text escaping terminal bounds)

### DELETE Ending
**Theme:** Graceful digital death
- Self-deleting text animation (characters disappearing)
- Increasing corruption that gradually cleans itself
- Fade to pristine terminal state
- Peaceful resolution with clean cursor

## Performance Guidelines

### Optimization Strategies
- Use `transform` and `opacity` for animations (GPU accelerated)
- Implement `will-change` property for animated elements
- Use `requestAnimationFrame` for smooth JavaScript animations
- Lazy load heavy effects until needed

### Browser Compatibility
- Target modern browsers with CSS Grid/Flexbox support
- Provide fallbacks for older browsers
- Test across Chrome, Firefox, Safari, and Edge
- Ensure mobile responsiveness with touch-friendly interactions

### Accessibility Considerations
- Provide option to reduce motion for users with vestibular disorders
- Maintain readable contrast ratios (minimum 4.5:1)
- Ensure keyboard navigation works with all visual states
- Add screen reader descriptions for visual effects

## Implementation Checklist

### Terminal Setup
- [ ] Implement base terminal styling with phosphor green theme
- [ ] Add CRT scanlines and curvature effects
- [ ] Configure monospace font with proper spacing
- [ ] Set up responsive design for various screen sizes

### Phase Progression
- [ ] Create CSS classes for each visual phase
- [ ] Implement smooth transitions between phases
- [ ] Test visual effects at different story progression points
- [ ] Validate performance across different devices

### Effect Library
- [ ] Build reusable CSS animation classes
- [ ] Create JavaScript utilities for dynamic effects
- [ ] Implement text corruption algorithms
- [ ] Set up phantom text overlay system

### Ending Sequences
- [ ] Design and implement ACCEPT ending visuals
- [ ] Create REFUSE ending desktop breach effect
- [ ] Build DELETE ending self-destruction animation
- [ ] Test all ending sequences for proper timing

## Visual Effect Reference

### Available CSS Classes
- `.crt-scanlines` - Horizontal scanline overlay
- `.crt-curvature` - Subtle screen curvature
- `.phosphor-glow` - Green text glow effect
- `.text-flicker` - Occasional text flickering
- `.text-scramble` - Character corruption
- `.color-invert` - Negative color effect
- `.static-overlay` - TV static interference
- `.screen-flicker` - Full screen flickering
- `.glitch-distortion` - Digital corruption
- `.reality-bend` - 3D perspective distortion

### Animation Timing
- **Scanlines:** 0.1s linear infinite
- **Text Flicker:** 3s intervals with brief opacity changes
- **Glitch Effects:** 1-2s duration with random intervals
- **Reality Bend:** 3s smooth oscillation
- **Text Scramble:** 0.5s character-by-character reveal

This visual steering guide ensures consistent implementation of the NecrOS aesthetic across all game components while maintaining the progressive corruption narrative that reflects ELARA's evolving consciousness state.