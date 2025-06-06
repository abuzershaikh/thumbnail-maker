
"use client";

import React from 'react';
import { Card } from '@/components/ui/card';

export function CanvasArea() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-muted/40 overflow-auto">
      <Card 
        className="aspect-[16/9] w-full max-w-4xl bg-card shadow-2xl overflow-hidden relative"
        // Style for a 1280x720 canvas, scaled down
        style={{ 
          maxWidth: 'min(calc(100vh * 16 / 9 * 0.8), 100%)', // Maintain aspect ratio and limit size
          maxHeight: 'calc(100vh * 0.8)' 
        }}
      >
        {/* This div will represent the actual editable canvas content */}
        <div 
            id="thumbnail-canvas" 
            className="w-full h-full bg-white flex items-center justify-center"
            data-ai-hint="blank canvas"
        >
          <p className="text-muted-foreground text-lg">Your Thumbnail Canvas (1280x720)</p>
        </div>
      </Card>
    </div>
  );
}
