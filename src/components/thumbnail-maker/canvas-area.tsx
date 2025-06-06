
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import type { CanvasElement, TextElement, ImageElement } from '@/types/canvas';

interface CanvasAreaProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export function CanvasArea({ elements, selectedElementId, selectElement, updateElement }: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingState, setDraggingState] = useState<{
    elementId: string;
    initialMouseX: number; // viewport clientX
    initialMouseY: number; // viewport clientY
    initialElementX: number; // percentage
    initialElementY: number; // percentage
  } | null>(null);

  const handleElementMouseDown = (
    e: React.MouseEvent,
    element: CanvasElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    selectElement(element.id);

    // Only proceed if canvasRef is available
    if (!canvasRef.current) return;

    setDraggingState({
      elementId: element.id,
      initialMouseX: e.clientX,
      initialMouseY: e.clientY,
      initialElementX: element.x,
      initialElementY: element.y,
    });
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!draggingState || !canvasRef.current) return;

      const canvasDOMRect = canvasRef.current.getBoundingClientRect();
      const canvasWidth = canvasDOMRect.width;
      const canvasHeight = canvasDOMRect.height;

      // Prevent division by zero or issues if canvas isn't rendered with dimensions
      if (canvasWidth === 0 || canvasHeight === 0) return;

      const deltaMouseX = e.clientX - draggingState.initialMouseX;
      const deltaMouseY = e.clientY - draggingState.initialMouseY;

      const deltaPercentX = (deltaMouseX / canvasWidth) * 100;
      const deltaPercentY = (deltaMouseY / canvasHeight) * 100;
      
      const currentElement = elements.find(el => el.id === draggingState.elementId);
      if (!currentElement) return;

      let newX = draggingState.initialElementX + deltaPercentX;
      let newY = draggingState.initialElementY + deltaPercentY;

      // Clamp values to keep element within canvas boundaries (top-left corner relative)
      newX = Math.max(0, Math.min(newX, 100 - currentElement.width));
      newY = Math.max(0, Math.min(newY, 100 - currentElement.height));
      
      // Ensure values are numbers, not NaN
      newX = isNaN(newX) ? draggingState.initialElementX : newX;
      newY = isNaN(newY) ? draggingState.initialElementY : newY;

      updateElement(draggingState.elementId, { x: newX, y: newY });
    };

    const handleDocumentMouseUp = () => {
      setDraggingState(null);
    };

    if (draggingState) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [draggingState, elements, updateElement]);


  const handleCanvasClick = () => {
    if (!draggingState) { // Only deselect if not ending a drag on the canvas
        selectElement(null);
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElementId === element.id;
    const isDraggingThisElement = draggingState?.elementId === element.id;

    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      transform: `rotate(${element.rotation}deg)`,
      cursor: isDraggingThisElement ? 'grabbing' : 'grab',
      border: isSelected ? '2px dashed hsl(var(--primary))' : '1px solid transparent',
      boxSizing: 'border-box',
      overflow: 'hidden', 
    };

    if (element.type === 'text') {
      const textEl = element as TextElement;
      const textStyle: React.CSSProperties = {
        ...style,
        fontSize: `${textEl.fontSize}px`,
        fontFamily: textEl.fontFamily,
        color: textEl.color,
        textAlign: textEl.textAlign,
        display: 'flex',
        alignItems: 'center',
        justifyContent: textEl.textAlign,
        padding: '2px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      };
      return (
        <div 
          key={element.id} 
          style={textStyle} 
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => e.stopPropagation()} // Prevent canvas click when clicking element
        >
          {textEl.content}
        </div>
      );
    }

    if (element.type === 'image') {
      const imgEl = element as ImageElement;
       const imageContainerStyle: React.CSSProperties = {
         ...style,
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
       };
      return (
        <div 
          key={element.id} 
          style={imageContainerStyle} 
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => e.stopPropagation()} // Prevent canvas click
          data-ai-hint="image element"
        >
          <img 
            src={imgEl.src} 
            alt={imgEl.alt || 'Canvas image'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: imgEl.objectFit,
              pointerEvents: 'none', // Prevent image's native drag behavior
            }}
            draggable={false}
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
          maxWidth: 'min(calc(100vh * 16 / 9 * 0.8), 100%)', // Maintain aspect ratio and limit size
          maxHeight: 'calc(100vh * 0.8)' 
        }}
      >
        <div 
            id="thumbnail-canvas" 
            ref={canvasRef}
            className="w-full h-full bg-white relative"
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
