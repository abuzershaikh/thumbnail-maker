
"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import type { CanvasElement, TextElement, ImageElement } from '@/types/canvas';

interface CanvasAreaProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void; // For future drag support
}

export function CanvasArea({ elements, selectedElementId, selectElement, updateElement }: CanvasAreaProps) {
  
  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent click from bubbling to canvas if element is clicked
    selectElement(id);
  };

  const handleCanvasClick = () => {
    selectElement(null); // Deselect if canvas background is clicked
  };

  const renderElement = (element: CanvasElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      transform: `rotate(${element.rotation}deg)`,
      cursor: 'pointer',
      border: selectedElementId === element.id ? '2px dashed hsl(var(--primary))' : '1px solid transparent',
      boxSizing: 'border-box', // Important for width/height to include border
      overflow: 'hidden', // Clip content within element bounds
    };

    if (element.type === 'text') {
      const textEl = element as TextElement;
      const textStyle: React.CSSProperties = {
        ...style,
        fontSize: `${textEl.fontSize}px`, // Will scale with parent
        fontFamily: textEl.fontFamily,
        color: textEl.color,
        textAlign: textEl.textAlign,
        display: 'flex',
        alignItems: 'center', // Basic vertical centering
        justifyContent: textEl.textAlign,
        padding: '2px', // Small padding
        whiteSpace: 'pre-wrap', // Allow wrapping
        wordBreak: 'break-word',
      };
      return (
        <div key={element.id} style={textStyle} onClick={(e) => handleElementClick(e, element.id)}>
          {textEl.content}
        </div>
      );
    }

    if (element.type === 'image') {
      const imgEl = element as ImageElement;
       const imageStyle: React.CSSProperties = {
         ...style,
         display: 'flex', // For object-fit to work well with parent div
         justifyContent: 'center',
         alignItems: 'center',
       };
      return (
        <div key={element.id} style={imageStyle} onClick={(e) => handleElementClick(e, element.id)} data-ai-hint="image element">
          <img 
            src={imgEl.src} 
            alt={imgEl.alt || 'Canvas image'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: imgEl.objectFit 
            }}
            draggable={false} // Prevent native browser image drag
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-muted/40 overflow-auto" onClick={handleCanvasClick}>
      <Card 
        className="aspect-[16/9] w-full max-w-4xl bg-card shadow-2xl overflow-hidden relative"
        style={{ 
          maxWidth: 'min(calc(100vh * 16 / 9 * 0.8), 100%)',
          maxHeight: 'calc(100vh * 0.8)' 
        }}
      >
        <div 
            id="thumbnail-canvas" 
            className="w-full h-full bg-white relative" // Added relative positioning
            data-ai-hint="youtube thumbnail design"
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-lg">Your Thumbnail Canvas (1280x720)</p>
            </div>
          )}
          {elements.map(renderElement)}
        </div>
      </Card>
    </div>
  );
}
