
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import type { CanvasElement, TextElement, ImageElement, ShapeElement } from '@/types/canvas';

interface CanvasAreaProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  canvasBackgroundColor: string;
  canvasBackgroundImage: string | null;
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

export function CanvasArea({ elements, selectedElementId, selectElement, updateElement, canvasBackgroundColor, canvasBackgroundImage }: CanvasAreaProps) {
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
    
    const resizeHandle = isSelected && (
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
    );

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
        alignItems: 'center', 
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
          {resizeHandle}
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
         borderRadius: imgEl.borderRadius ? `${imgEl.borderRadius}px` : '0px',
         border: `${imgEl.borderWidth || 0}px solid ${imgEl.borderColor || 'transparent'}`,
         boxShadow: imgEl.shadowColor !== '#00000000' && (imgEl.shadowBlur || imgEl.shadowOffsetX || imgEl.shadowOffsetY || imgEl.shadowSpreadRadius) ? 
           `${imgEl.shadowOffsetX || 0}px ${imgEl.shadowOffsetY || 0}px ${imgEl.shadowBlur || 0}px ${imgEl.shadowSpreadRadius || 0}px ${imgEl.shadowColor || 'transparent'}`
           : 'none',
       };
       if (isSelected && imageContainerStyle.border === '1px solid transparent') { // Default to primary dash if no custom border
        imageContainerStyle.border = '2px dashed hsl(var(--primary))';
       } else if (isSelected && imgEl.borderWidth && imgEl.borderWidth > 0) { // Use outline if custom border exists
        imageContainerStyle.outline = '2px dashed hsl(var(--primary))';
        imageContainerStyle.outlineOffset = `${imgEl.borderWidth}px`;
       }

      return (
        <div
          key={element.id}
          style={imageContainerStyle}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => e.stopPropagation()}
          data-ai-hint={imgEl.src.startsWith('data:') ? 'uploaded image' : (imgEl['data-ai-hint'] || 'placeholder image')}
        >
          <img
            src={imgEl.src}
            alt={imgEl.alt || 'Canvas image'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: imgEl.objectFit,
              pointerEvents: 'none',
              borderRadius: imgEl.borderRadius ? `${imgEl.borderRadius}px` : '0px', 
            }}
            draggable={false}
          />
          {resizeHandle}
        </div>
      );
    }

    if (element.type === 'shape' && element.shapeType === 'rectangle') {
      const shapeEl = element as ShapeElement;
      const shapeStyle: React.CSSProperties = {
        ...baseStyle,
        ...interactionStyle,
        backgroundColor: shapeEl.fillColor,
        border: `${shapeEl.strokeWidth}px solid ${shapeEl.strokeColor}`,
        borderRadius: `${shapeEl.cornerRadius || 0}px`,
        boxShadow: shapeEl.shadowColor !== '#00000000' && (shapeEl.shadowBlur || shapeEl.shadowOffsetX || shapeEl.shadowOffsetY || shapeEl.shadowSpreadRadius) ?
            `${shapeEl.shadowOffsetX || 0}px ${shapeEl.shadowOffsetY || 0}px ${shapeEl.shadowBlur || 0}px ${shapeEl.shadowSpreadRadius || 0}px ${shapeEl.shadowColor || 'transparent'}`
            : 'none',
      };
       if (isSelected && shapeStyle.border === '1px solid transparent') { // Default state if no border
        shapeStyle.border = '2px dashed hsl(var(--primary))';
       } else if (isSelected && shapeEl.strokeWidth && shapeEl.strokeWidth > 0) {
        shapeStyle.outline = '2px dashed hsl(var(--primary))';
        shapeStyle.outlineOffset = `${shapeEl.strokeWidth}px`;
       }
      return (
        <div
          key={element.id}
          style={shapeStyle}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
          onClick={(e) => e.stopPropagation()}
          data-ai-hint="rectangle shape"
        >
          {resizeHandle}
        </div>
      );
    }
    return null;
  };
  
  const finalCanvasBackgroundColor = canvasBackgroundImage ? 'transparent' : canvasBackgroundColor;

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-muted/40 overflow-auto" onClick={handleCanvasClick}>
      <Card
        className="aspect-[16/9] w-full max-w-4xl shadow-2xl overflow-hidden relative"
        style={{
          maxWidth: 'min(calc(100vh * 16 / 9 * 0.8), 100%)',
          maxHeight: 'calc(100vh * 0.8)',
          backgroundColor: finalCanvasBackgroundColor,
          backgroundImage: canvasBackgroundImage ? `url(${canvasBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
            id="thumbnail-canvas"
            ref={canvasRef}
            className="w-full h-full relative"
            data-ai-hint="youtube thumbnail design canvas"
        >
          {elements.length === 0 && !canvasBackgroundImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-lg" style={{color: finalCanvasBackgroundColor === '#FFFFFF' || finalCanvasBackgroundColor === '#FFF' || finalCanvasBackgroundColor.toLowerCase() === '#ffffff' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--background))'}}>
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
