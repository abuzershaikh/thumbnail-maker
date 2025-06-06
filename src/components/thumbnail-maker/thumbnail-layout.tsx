
"use client";

import React, { useState, useCallback } from 'react';
import { ElementsSidebar } from '@/components/thumbnail-maker/elements-sidebar';
import { CanvasArea } from '@/components/thumbnail-maker/canvas-area';
import { PropertiesSidebar } from '@/components/thumbnail-maker/properties-sidebar';
import { Youtube } from 'lucide-react';
import type { CanvasElement, ElementType, TextElement, ImageElement, ShapeElement, ShapeType } from '@/types/canvas';

export default function ThumbnailMakerLayout() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<string>('#FFFFFF');
  const [canvasBackgroundImage, setCanvasBackgroundImage] = useState<string | null>(null);

  const addElement = useCallback((type: ElementType, shapeType?: ShapeType) => {
    const newId = crypto.randomUUID();
    let newElement: CanvasElement;

    const defaultProps = {
      id: newId,
      x: 10,
      y: 10,
      width: type === 'text' ? 30 : (type === 'shape' ? 20 : 40),
      height: type === 'text' ? 10 : (type === 'shape' ? 20 : 30),
      rotation: 0,
    };

    if (type === 'text') {
      newElement = {
        ...defaultProps,
        type: 'text',
        content: 'New Text',
        fontSize: 24,
        fontFamily: 'PT Sans',
        color: '#333333',
        textAlign: 'left',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        letterSpacing: 0,
        lineHeight: 1.2,
      } as TextElement;
    } else if (type === 'image') {
      newElement = {
        ...defaultProps,
        type: 'image',
        src: 'https://placehold.co/400x300.png',
        alt: 'Placeholder Image',
        objectFit: 'cover',
        borderRadius: 0,
        borderWidth: 0,
        borderColor: '#000000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowSpreadRadius: 0,
        shadowColor: '#00000000', // Transparent default shadow
        'data-ai-hint': 'abstract background',
      } as ImageElement;
    } else if (type === 'shape' && shapeType === 'rectangle') {
      newElement = {
        ...defaultProps,
        type: 'shape',
        shapeType: 'rectangle',
        fillColor: '#CCCCCC',
        strokeColor: '#333333',
        strokeWidth: 1,
        cornerRadius: 0,
      } as ShapeElement;
    }
     else {
      return;
    }

    setElements((prevElements) => [...prevElements, newElement]);
    setSelectedElementId(newId);
  }, []);

  const handleImageUpload = useCallback((dataUrl: string) => {
    const newId = crypto.randomUUID();
    const newElement: ImageElement = {
      id: newId,
      type: 'image',
      src: dataUrl,
      alt: 'Uploaded image',
      x: 10,
      y: 10,
      width: 40,
      height: 30,
      rotation: 0,
      objectFit: 'contain',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '#000000',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowSpreadRadius: 0,
      shadowColor: '#00000000',
    };
    setElements((prevElements) => [...prevElements, newElement]);
    setSelectedElementId(newId);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      )
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const bringForward = useCallback((id: string) => {
    setElements(prevElements => {
      const index = prevElements.findIndex(el => el.id === id);
      if (index === -1 || index === prevElements.length - 1) return prevElements;
      const newElements = [...prevElements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      return newElements;
    });
  }, []);

  const sendBackward = useCallback((id: string) => {
    setElements(prevElements => {
      const index = prevElements.findIndex(el => el.id === id);
      if (index === -1 || index === 0) return prevElements;
      const newElements = [...prevElements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      return newElements;
    });
  }, []);

  const bringToFront = useCallback((id: string) => {
    setElements(prevElements => {
      const element = prevElements.find(el => el.id === id);
      if (!element) return prevElements;
      const newElements = prevElements.filter(el => el.id !== id);
      return [...newElements, element];
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setElements(prevElements => {
      const element = prevElements.find(el => el.id === id);
      if (!element) return prevElements;
      const newElements = prevElements.filter(el => el.id !== id);
      return [element, ...newElements];
    });
  }, []);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-16 border-b bg-card flex items-center px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Youtube className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold font-headline">YouTube Thumbnail Maker</h1>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <ElementsSidebar
          addElement={addElement}
          onImageUpload={handleImageUpload}
          setCanvasBackgroundColor={setCanvasBackgroundColor}
          canvasBackgroundColor={canvasBackgroundColor}
          setCanvasBackgroundImage={setCanvasBackgroundImage}
          canvasBackgroundImage={canvasBackgroundImage}
        />
        <CanvasArea
          elements={elements}
          selectedElementId={selectedElementId}
          selectElement={selectElement}
          updateElement={updateElement}
          canvasBackgroundColor={canvasBackgroundColor}
          canvasBackgroundImage={canvasBackgroundImage}
        />
        <PropertiesSidebar
          elements={elements}
          selectedElement={selectedElement}
          updateElement={updateElement}
          deleteElement={deleteElement}
          selectElement={selectElement}
          bringForward={bringForward}
          sendBackward={sendBackward}
          bringToFront={bringToFront}
          sendToBack={sendToBack}
        />
      </main>
    </div>
  );
}
