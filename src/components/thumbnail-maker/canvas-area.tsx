
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import type { CanvasElement, TextElement, ImageElement } from '@/types/canvas';

interface CanvasAreaProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  canvasBackgroundColor: string;
}

interface DraggingState {
  elementId: string;
  action: 'move' | 'resize';
  initialMouseX: number; 
  initialMouseY: number; 
  initialElementX: number; 
  initialElementY: number; 
  initialElementWidth?: number; 
  initialElementHeight?: number; 
}

const MIN_ELEMENT_SIZE_PERCENT = 5; 

export function CanvasArea({ elements, selectedElementId, selectElement, updateElement, canvasBackgroundColor }: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingState, setDraggingState] = useState<DraggingState | null>(null);

  const handleElementMouseDown = (
    e: React.MouseEvent,
    element: CanvasElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    selectElement(element.id);

    if (!canvasRef.current) return;

    setDraggingState({
      action: 'move',
      elementId: element.id,
      initialMouseX: e.clientX,
      initialMouseY: e.clientY,
      initialElementX: element.x,
      initialElementY: element.y,
    });
  };

  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    element: CanvasElement
  ) => {
    e.preventDefault();
    e.stopPropagation(); 
    selectElement(element.id); 

    if (!canvasRef.current) return;

    setDraggingState({
      action: 'resize',
      elementId: element.id,
      initialMouseX: e.clientX,
      initialMouseY: e.clientY,
      initialElementX: element.x,
      initialElementY: element.y,
      initialElementWidth: element.width,
      initialElementHeight: element.height,
    });
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!draggingState || !canvasRef.current) return;

      const canvasDOMRect = canvasRef.current.getBoundingClientRect();
      const canvasWidthPx = canvasDOMRect.width;
      const canvasHeightPx = canvasDOMRect.height;

      if (canvasWidthPx === 0 || canvasHeightPx === 0) return;

      const deltaMouseX = e.clientX - draggingState.initialMouseX;
      const deltaMouseY = e.clientY - draggingState.initialMouseY;
      
      const currentElement = elements.find(el => el.id === draggingState.elementId);
      if (!currentElement) return;

      if (draggingState.action === 'move') {
        const deltaPercentX = (deltaMouseX / canvasWidthPx) * 100;
        const deltaPercentY = (deltaMouseY / canvasHeightPx) * 100;

        let newX = draggingState.initialElementX + deltaPercentX;
        let newY = draggingState.initialElementY + deltaPercentY;

        newX = Math.max(0, Math.min(newX, 100 - currentElement.width));
        newY = Math.max(0, Math.min(newY, 100 - currentElement.height));
        
        newX = isNaN(newX) ? draggingState.initialElementX : newX;
        newY = isNaN(newY) ? draggingState.initialElementY : newY;

        updateElement(draggingState.elementId, { x: newX, y: newY });

      } else if (draggingState.action === 'resize' && draggingState.initialElementWidth !== undefined && draggingState.initialElementHeight !== undefined) {
        let newWidth = draggingState.initialElementWidth + (deltaMouseX / canvasWidthPx) * 100;
        let newHeight = draggingState.initialElementHeight + (deltaMouseY / canvasHeightPx) * 100;

        newWidth = Math.max(MIN_ELEMENT_SIZE_PERCENT, newWidth);
        newHeight = Math.max(MIN_ELEMENT_SIZE_PERCENT, newHeight);
        
        newWidth = Math.min(newWidth, 100 - currentElement.x);
        newHeight = Math.min(newHeight, 100 - currentElement.y);

        newWidth = isNaN(newWidth) ? draggingState.initialElementWidth : newWidth;
        newHeight = isNaN(newHeight) ? draggingState.initialElementHeight : newHeight;
        
        updateElement(draggingState.elementId, { width: newWidth, height: newHeight });
      }
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


  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current && !draggingState) { 
        selectElement(null);
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElementId === element.id;
    const isMovingThisElement = draggingState?.elementId === element.id && draggingState.action === 'move';
    const isResizingThisElement = draggingState?.elementId === element.id && draggingState.action === 'resize';

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      transform: `rotate(${element.rotation}deg)`,
      border: isSelected ? '2px dashed hsl(var(--primary))' : '1px solid transparent',
      boxSizing: 'border-box',
      overflow: 'hidden', 
    };

    const interactionStyle: React.CSSProperties = {
        cursor: isMovingThisElement ? 'grabbing' : (isResizingThisElement ? 'nwse-resize' : 'grab'),
    };

    if (element.type === 'text') {
      const textEl = element as TextElement;
      const textStyle: React.CSSProperties = {
        ...baseStyle,
        ...interactionStyle,
        fontSize: `${textEl.fontSize}px`, 
        fontFamily: textEl.fontFamily,
        color: textEl.color,
        textAlign: textEl.textAlign,
        fontWeight: textEl.fontWeight,
        fontStyle: textEl.fontStyle,
        textDecoration: textEl.textDecoration,
        letterSpacing: `${textEl.letterSpacing}px`,
        lineHeight: textEl.lineHeight,
        display: 'flex',
        alignItems: 'center', // Better vertical alignment for multi-line text
        justifyContent: textEl.textAlign === 'left' ? 'flex-start' : textEl.textAlign === 'right' ? 'flex-end' : 'center',
        padding: '2px', 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word', 
      };
      return (
        <div 
          key={element.id} 
          style={textStyle} 
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => e.stopPropagation()} 
          data-ai-hint="text content block"
        >
          {textEl.content}
          {isSelected && (
            <div
              onMouseDown={(e) => handleResizeHandleMouseDown(e, element)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '10px',
                height: '10px',
                backgroundColor: 'hsl(var(--primary))',
                border: '1px solid hsl(var(--background))',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                zIndex: 100, 
              }}
              data-ai-hint="resize handle"
            />
          )}
        </div>
      );
    }

    if (element.type === 'image') {
      const imgEl = element as ImageElement;
       const imageContainerStyle: React.CSSProperties = {
         ...baseStyle,
         ...interactionStyle,
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
       };
      return (
        <div 
          key={element.id} 
          style={imageContainerStyle} 
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => e.stopPropagation()} 
          data-ai-hint={imgEl.src.startsWith('data:') ? 'uploaded image' : 'placeholder image'}
        >
          <img 
            src={imgEl.src} 
            alt={imgEl.alt || 'Canvas image'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: imgEl.objectFit,
              pointerEvents: 'none', 
            }}
            draggable={false}
          />
          {isSelected && (
            <div
              onMouseDown={(e) => handleResizeHandleMouseDown(e, element)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '10px',
                height: '10px',
                backgroundColor: 'hsl(var(--primary))',
                border: '1px solid hsl(var(--background))',
                borderRadius: '50%',
                cursor: 'nwse-resize',
                zIndex: 100,
              }}
              data-ai-hint="resize handle"
            />
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-muted/40 overflow-auto" onClick={handleCanvasClick}>
      <Card 
        className="aspect-[16/9] w-full max-w-4xl shadow-2xl overflow-hidden relative"
        style={{ 
          maxWidth: 'min(calc(100vh * 16 / 9 * 0.8), 100%)', 
          maxHeight: 'calc(100vh * 0.8)', 
          backgroundColor: canvasBackgroundColor, 
        }}
      >
        <div 
            id="thumbnail-canvas" 
            ref={canvasRef}
            className="w-full h-full relative" 
            style={{ backgroundColor: canvasBackgroundColor }} 
            data-ai-hint="youtube thumbnail design canvas"
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-lg" style={{color: canvasBackgroundColor === '#FFFFFF' || canvasBackgroundColor === '#FFF' || canvasBackgroundColor.toLowerCase() === '#ffffff' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--background))'}}>
                Your Thumbnail Canvas (1280x720)
              </p>
            </div>
          )}
          {elements.map(renderElement)}
        </div>
      </Card>
    </div>
  );
}
