
"use client";

import React, { useState, useCallback } from 'react';
import { ElementsSidebar } from '@/components/thumbnail-maker/elements-sidebar';
import { CanvasArea } from '@/components/thumbnail-maker/canvas-area';
import { PropertiesSidebar } from '@/components/thumbnail-maker/properties-sidebar';
import { Youtube } from 'lucide-react';
import type { CanvasElement, ElementType, TextElement, ImageElement } from '@/types/canvas';

export default function ThumbnailMakerLayout() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<string>('#FFFFFF'); // Default white

  const addElement = useCallback((type: ElementType) => {
    const newId = crypto.randomUUID();
    let newElement: CanvasElement;

    const defaultProps = {
      id: newId,
      x: 10,
      y: 10,
      width: type === 'text' ? 30 : 40, // %
      height: type === 'text' ? 10 : 30, // %
      rotation: 0,
    };

    if (type === 'text') {
      newElement = {
        ...defaultProps,
        type: 'text',
        content: 'New Text',
        fontSize: 24, // px
        fontFamily: 'PT Sans',
        color: '#333333',
        textAlign: 'left',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        letterSpacing: 0, // px
        lineHeight: 1.2, // unitless multiplier,
      } as TextElement;
    } else if (type === 'image') {
      newElement = {
        ...defaultProps,
        type: 'image',
        src: 'https://placehold.co/400x300.png',
        alt: 'Placeholder Image',
        objectFit: 'cover',
        borderRadius: 0,
        'data-ai-hint': 'abstract background',
      } as ImageElement;
    } else {
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
        />
        <CanvasArea
          elements={elements}
          selectedElementId={selectedElementId}
          selectElement={selectElement}
          updateElement={updateElement}
          canvasBackgroundColor={canvasBackgroundColor}
        />
        <PropertiesSidebar
          elements={elements}
          selectedElement={selectedElement}
          updateElement={updateElement}
          deleteElement={deleteElement}
          selectElement={selectElement}
        />
      </main>
    </div>
  );
}
