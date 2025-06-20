
"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ElementsSidebar } from '@/components/thumbnail-maker/elements-sidebar';
import { CanvasArea } from '@/components/thumbnail-maker/canvas-area';
import { PropertiesSidebar } from '@/components/thumbnail-maker/properties-sidebar';
import { Youtube, Download, FileXIcon } from 'lucide-react';
import type { CanvasElement, ElementType, TextElement, ImageElement, ShapeElement, ShapeType } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

export interface AddElementOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  initialProps?: Partial<CanvasElement>;
}

const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';

const initialElements: CanvasElement[] = [
  {
    id: 'icon-placeholder',
    type: 'image',
    src: 'https://placehold.co/100x100.png?text=Icon',
    alt: 'App Icon Placeholder',
    x: 30,
    y: 30,
    width: 40,
    height: 40,
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
    filterBlur: 0,
  },
  {
    id: 'app-name-placeholder',
    type: 'text',
    content: 'App Name',
    x: 5, // Adjusted x to be (100 - 90) / 2 for centering
    y: 70, // Adjusted y position
    width: 90, // Changed width
    height: 15, // Changed height
    rotation: 0,
    fontSize: 20,
    fontFamily: 'PT Sans',
    color: '#333333',
    textAlign: 'right',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textDecoration: 'none',
    letterSpacing: 0,
    lineHeight: 1.2,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: '#00000000',
  }
];

export default function ThumbnailMakerLayout() {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<string>(DEFAULT_BACKGROUND_COLOR);
  const [canvasBackgroundImage, setCanvasBackgroundImage] = useState<string | null>(null);

  const addElement = useCallback((
    type: ElementType,
    shapeType?: ShapeType,
    options?: AddElementOptions
  ) => {
    const newId = (options?.initialProps as CanvasElement)?.id || crypto.randomUUID();

    let elementWidth: number;
    let elementHeight: number;

    if (type === 'text') {
      elementWidth = options?.width ?? 30;
      elementHeight = options?.height ?? 10;
    } else if (type === 'shape') {
      elementWidth = options?.width ?? 20;
      elementHeight = options?.height ?? 20;
    } else { // image
      elementWidth = options?.width ?? 40;
      elementHeight = options?.height ?? 30;
    }

    let posX = options?.x ?? 10;
    let posY = options?.y ?? 10;

    if (options?.x !== undefined) {
        posX = Math.max(0, Math.min(options.x, 100 - elementWidth));
    }
    if (options?.y !== undefined) {
        posY = Math.max(0, Math.min(options.y, 100 - elementHeight));
    }


    const baseProps: Partial<CanvasElement> = {
      id: newId,
      x: posX,
      y: posY,
      width: elementWidth,
      height: elementHeight,
      rotation: 0,
      ...options?.initialProps
    };

    let newElement: CanvasElement;

    if (type === 'text') {
      newElement = {
        type: 'text',
        content: 'New Text',
        fontSize: (options?.initialProps as TextElement)?.fontSize || 24,
        fontFamily: (options?.initialProps as TextElement)?.fontFamily || 'PT Sans',
        color: (options?.initialProps as TextElement)?.color || '#333333',
        textAlign: (options?.initialProps as TextElement)?.textAlign || 'left',
        fontWeight: (options?.initialProps as TextElement)?.fontWeight || '400',
        fontStyle: (options?.initialProps as TextElement)?.fontStyle || 'normal',
        textDecoration: (options?.initialProps as TextElement)?.textDecoration || 'none',
        letterSpacing: (options?.initialProps as TextElement)?.letterSpacing || 0,
        lineHeight: (options?.initialProps as TextElement)?.lineHeight || 1.2,
        shadowOffsetX: (options?.initialProps as TextElement)?.shadowOffsetX || 0,
        shadowOffsetY: (options?.initialProps as TextElement)?.shadowOffsetY || 0,
        shadowBlur: (options?.initialProps as TextElement)?.shadowBlur || 0,
        shadowColor: (options?.initialProps as TextElement)?.shadowColor || '#00000000',
        ...baseProps,
      } as TextElement;
    } else if (type === 'image') {
      newElement = {
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
        shadowColor: '#00000000',
        'data-ai-hint': 'abstract background',
        filterBlur: 0,
        ...baseProps,
      } as ImageElement;
    } else if (type === 'shape' && shapeType === 'rectangle') {
      newElement = {
        type: 'shape',
        shapeType: 'rectangle',
        fillColor: '#CCCCCC',
        strokeColor: '#333333',
        strokeWidth: 1,
        cornerRadius: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowSpreadRadius: 0,
        shadowColor: '#00000000',
        filterBlur: 0,
        ...baseProps,
      } as ShapeElement;
    }
    else {
      console.error("Attempted to add unknown element type or shapeType", type, shapeType);
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
      filterBlur: 0,
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const targetNodeName = (event.target as HTMLElement)?.nodeName;
      const isInputFocused = targetNodeName === 'INPUT' || targetNodeName === 'TEXTAREA';

      if (selectedElementId && (event.key === 'Delete' || event.key === 'Backspace') && !isInputFocused) {
        if (event.key === 'Backspace') {
          event.preventDefault(); 
        }
        deleteElement(selectedElementId);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElementId, deleteElement]);

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

  const handleExport = useCallback(async (format: 'png' | 'jpeg', filename?: string) => {
    const elementToCapture = document.getElementById('exportable-canvas-container');
    if (!elementToCapture) {
      console.error('Canvas element not found for export.');
      return;
    }

    const currentSelectedId = selectedElementId;
    setSelectedElementId(null); 

    await new Promise(resolve => setTimeout(resolve, 50)); 

    html2canvas(elementToCapture, {
        useCORS: true,
        logging: false,
        scale: 2, 
        backgroundColor: canvasBackgroundImage ? null : canvasBackgroundColor,
     }).then(canvas => {
      const image = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
      const link = document.createElement('a');
      link.download = filename || `thumbnail.${format}`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(err => {
        console.error('Error exporting canvas:', err);
    }).finally(() => {
        if (currentSelectedId) {
            setSelectedElementId(currentSelectedId);
        }
    });
  }, [selectedElementId, canvasBackgroundColor, canvasBackgroundImage]);


  const handleClearCanvas = useCallback(() => {
    setElements(initialElements); // Reset to initial placeholders
    setSelectedElementId(null);
    setCanvasBackgroundColor(DEFAULT_BACKGROUND_COLOR);
    setCanvasBackgroundImage(null);
  }, []);

  const generateThumbnails = useCallback(async (files: FileList | null) => {
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type !== 'image/png') {
        console.warn(`Skipping non-PNG file: ${file.name}`);
        continue;
      }

      let appName = file.name.replace(/\.png$/i, '');
      appName = appName.charAt(0).toUpperCase() + appName.slice(1);

      const reader = new FileReader();
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      updateElement('icon-placeholder', { src: imageDataUrl } as Partial<ImageElement>);
      updateElement('app-name-placeholder', { content: appName } as Partial<TextElement>);

      // Wait for UI to update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Call handleExport
      await handleExport('png', appName + '.png');
    }
  }, [updateElement, handleExport]); // Corrected dependencies for generateThumbnails


  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Youtube className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold font-headline">YouTube Thumbnail Maker</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('png')} data-ai-hint="save png button">
                <Download className="mr-2 h-4 w-4" /> Save as PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('jpeg')} data-ai-hint="save jpg button">
                <Download className="mr-2 h-4 w-4" /> Save as JPG
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearCanvas} data-ai-hint="clear canvas button">
                <FileXIcon className="mr-2 h-4 w-4" /> Clear Canvas
            </Button>
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
          generateThumbnails={generateThumbnails} // Pass generateThumbnails to ElementsSidebar
        />
        <CanvasArea
          elements={elements}
          selectedElementId={selectedElementId}
          selectElement={selectElement}
          updateElement={updateElement}
          canvasBackgroundColor={canvasBackgroundColor}
          canvasBackgroundImage={canvasBackgroundImage}
          addElement={addElement}
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
