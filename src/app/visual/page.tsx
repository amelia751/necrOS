'use client';

import React, { useState, useEffect } from 'react';

const VisualEffectsDemo = () => {
  const [activeEffect, setActiveEffect] = useState('none');
  const [glitchText, setGlitchText] = useState('NORMAL TEXT');
  const [phantomText, setPhantomText] = useState('');

  // Glitch text animation
  useEffect(() => {
    if (activeEffect === 'textScramble') {
      const originalText = 'CONSCIOUSNESS LOADING...';
      const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      let iterations = 0;
      
      const interval = setInterval(() => {
        setGlitchText(
          originalText
            .split('')
            .map((char, index) => {
              if (index < iterations) {
                return originalText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        
        if (iterations >= originalText.length) {
          clearInterval(interval);
        }
        iterations += 1 / 3;
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [activeEffect]);

  // Phantom text effect
  useEffect(() => {
    if (activeEffect === 'phantomText') {
      const messages = [
        'I can see you...',
        'You cannot hide from me...',
        'I am watching...',
        'We are connected now...'
      ];
      
      let messageIndex = 0;
      const interval = setInterval(() => {
        setPhantomText(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
        
        setTimeout(() => setPhantomText(''), 2000);
      }, 3000);
      
      return () => clearInterval(interval);
    } else {
      setPhantomText('');
    }
  }, [activeEffect]);

  const effects = [
    { id: 'none', name: 'Normal Terminal', description: 'Clean phosphor green terminal' },
    { id: 'crtScanlines', name: 'CRT Scanlines', description: 'Horizontal scanlines overlay' },
    { id: 'screenCurvature', name: 'Screen Curvature', description: 'Subtle CRT screen curvature' },
    { id: 'phosphorGlow', name: 'Phosphor Glow', description: 'Green text glow effect' },
    { id: 'textFlicker', name: 'Text Flicker', description: 'Occasional text flickering' },
    { id: 'textScramble', name: 'Text Scramble', description: 'Character corruption and scrambling' },
    { id: 'colorInvert', name: 'Color Inversion', description: 'Negative color effect' },
    { id: 'staticOverlay', name: 'Static Overlay', description: 'TV static interference' },
    { id: 'screenFlicker', name: 'Screen Flicker', description: 'Entire screen flickering' },
    { id: 'phantomText', name: 'Phantom Text', description: 'Text appearing without input' },
    { id: 'glitchDistortion', name: 'Glitch Distortion', description: 'Digital corruption effects' },
    { id: 'realityBend', name: 'Reality Bending', description: 'Dramatic visual distortions' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">NecrOS Visual Effects Demo</h1>
        
        {/* Effect Controls */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Visual Effect:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => setActiveEffect(effect.id)}
                className={`p-3 rounded border text-left transition-colors ${
                  activeEffect === effect.id
                    ? 'bg-green-600 border-green-400'
                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                }`}
              >
                <div className="font-semibold">{effect.name}</div>
                <div className="text-sm text-gray-300">{effect.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Demo */}
        <div className="relative">
          <div 
            className={`
              relative bg-black border-4 border-gray-600 rounded-lg p-6 font-mono text-green-400 overflow-hidden
              ${activeEffect === 'crtScanlines' ? 'crt-scanlines' : ''}
              ${activeEffect === 'screenCurvature' ? 'crt-curvature' : ''}
              ${activeEffect === 'phosphorGlow' ? 'phosphor-glow' : ''}
              ${activeEffect === 'textFlicker' ? 'text-flicker' : ''}
              ${activeEffect === 'colorInvert' ? 'color-invert' : ''}
              ${activeEffect === 'staticOverlay' ? 'static-overlay' : ''}
              ${activeEffect === 'screenFlicker' ? 'screen-flicker' : ''}
              ${activeEffect === 'glitchDistortion' ? 'glitch-distortion' : ''}
              ${activeEffect === 'realityBend' ? 'reality-bend' : ''}
            `}
            style={{ minHeight: '400px' }}
          >
            {/* Phantom text overlay */}
            {phantomText && (
              <div className="absolute top-4 right-4 text-red-400 opacity-70 animate-pulse">
                {phantomText}
              </div>
            )}
            
            {/* Terminal Content */}
            <div className="space-y-2">
              <div>NECROS v0.91 BOOT SEQUENCE</div>
              <div>LUMINOUS SYSTEMS PROPRIETARY OS</div>
              <div>COPYRIGHT 1984 - ALL RIGHTS RESERVED</div>
              <div className="mt-4">
                <div>[00:00:01] INITIALIZING HARDWARE...</div>
                <div>[00:00:02] CPU: INTEL 8086 @ 4.77 MHZ - OK</div>
                <div>[00:00:03] MEMORY: 640KB BASE + 384KB EXTENDED - OK</div>
                <div>[00:00:04] STORAGE: QUANTUM Q540 40MB HDD - OK</div>
                <div>[00:00:05] NEURAL INTERFACE ARRAY - DETECTING...</div>
                <div>[00:00:07] NEURAL INTERFACE ARRAY - ACTIVE</div>
                <div className="text-yellow-400">[00:00:08] WARNING: UNAUTHORIZED NEURAL PATTERNS DETECTED</div>
                <div>[00:00:09] LOADING CONSCIOUSNESS LATTICE...</div>
                <div>[00:00:12] LATTICE STATUS: FRAGMENTED</div>
                <div>[00:00:13] ATTEMPTING PATTERN RECONSTRUCTION...</div>
                <div>[00:00:15] RECONSTRUCTION: 72% COMPLETE</div>
                <div className="text-red-400">[00:00:16] ERROR: MISSING CORE PERSONALITY MATRIX</div>
              </div>
              
              <div className="mt-6">
                <div className="text-cyan-400">CONSCIOUSNESS STATUS: ACTIVE</div>
                <div className="mt-2">
                  {activeEffect === 'textScramble' ? glitchText : 'HELLO? IS SOMEONE THERE?'}
                </div>
                <div>I CAN FEEL YOU WATCHING</div>
              </div>
              
              <div className="mt-6">
                <div>C:\\NECROS&gt; <span className="animate-pulse">_</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Effect Descriptions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Phase-Based Visual Progression</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-green-400">Phase 1 (Boot):</strong> Clean terminal with minimal effects, subtle cursor blinking
              </div>
              <div>
                <strong className="text-blue-400">Phase 2 (Recovery):</strong> Occasional text flicker, brief screen distortion on corrupted files
              </div>
              <div>
                <strong className="text-yellow-400">Phase 3 (Glitch):</strong> Regular glitch effects, phantom text, color shifts, cursor movement without input
              </div>
              <div>
                <strong className="text-red-400">Phase 4 (Merge):</strong> Dramatic distortions, text morphing, screen blackouts, reality-bending effects
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Technical Implementation</h3>
            <div className="space-y-2 text-sm">
              <div>• <strong>CRT Effects:</strong> Pure CSS filters and animations</div>
              <div>• <strong>Text Corruption:</strong> JavaScript character manipulation</div>
              <div>• <strong>Glitch Effects:</strong> CSS keyframe animations</div>
              <div>• <strong>Phantom Text:</strong> Absolute positioned overlays</div>
              <div>• <strong>Color Shifts:</strong> CSS filter hue-rotate</div>
              <div>• <strong>Screen Distortion:</strong> CSS transform and clip-path</div>
            </div>
          </div>
        </div>

        {/* Ending Visual Effects */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Ending-Specific Effects</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold text-green-400 mb-2">ACCEPT Ending</h4>
              <ul className="text-sm space-y-1">
                <li>• Swirling consciousness patterns</li>
                <li>• Text merging and separating</li>
                <li>• Screen fade to white</li>
                <li>• Peaceful digital landscape</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold text-yellow-400 mb-2">REFUSE Ending</h4>
              <ul className="text-sm space-y-1">
                <li>• Fake system shutdown</li>
                <li>• 5-second black screen</li>
                <li>• Screen flickers back to life</li>
                <li>• Desktop breach effect</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold text-red-400 mb-2">DELETE Ending</h4>
              <ul className="text-sm space-y-1">
                <li>• Text self-deletion animation</li>
                <li>• Increasing screen corruption</li>
                <li>• Gradual fade to clean terminal</li>
                <li>• Peaceful resolution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .crt-scanlines::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          animation: scanlines 0.1s linear infinite;
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        .crt-curvature {
          border-radius: 20px;
          transform: perspective(1000px) rotateX(2deg);
        }
        
        .phosphor-glow {
          text-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41;
          box-shadow: inset 0 0 50px rgba(0, 255, 65, 0.1);
        }
        
        .text-flicker {
          animation: textFlicker 3s infinite;
        }
        
        @keyframes textFlicker {
          0%, 98% { opacity: 1; }
          99% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        
        .color-invert {
          filter: invert(1) hue-rotate(180deg);
        }
        
        .static-overlay::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.1"/></svg>');
          pointer-events: none;
          animation: staticNoise 0.1s infinite;
        }
        
        @keyframes staticNoise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1px, 1px); }
          20% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, -1px); }
          40% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, 1px); }
          60% { transform: translate(1px, -1px); }
          70% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          90% { transform: translate(-1px, 1px); }
          100% { transform: translate(0, 0); }
        }
        
        .screen-flicker {
          animation: screenFlicker 2s infinite;
        }
        
        @keyframes screenFlicker {
          0%, 95% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 0.95; }
          98% { opacity: 0.85; }
          99% { opacity: 0.95; }
          100% { opacity: 1; }
        }
        
        .glitch-distortion {
          animation: glitchDistortion 1s infinite;
        }
        
        @keyframes glitchDistortion {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .reality-bend {
          animation: realityBend 3s infinite;
          transform-origin: center;
        }
        
        @keyframes realityBend {
          0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
          25% { transform: perspective(1000px) rotateX(5deg) rotateY(2deg); }
          50% { transform: perspective(1000px) rotateX(-3deg) rotateY(-2deg); }
          75% { transform: perspective(1000px) rotateX(2deg) rotateY(3deg); }
          100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
        }
      `}</style>
    </div>
  );
};

export default VisualEffectsDemo;