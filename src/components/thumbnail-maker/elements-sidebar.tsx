
"use client";

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextIcon, ImageIcon, UploadCloudIcon, Palette, Square as SquareIcon, Trash2Icon, DropletsIcon } from 'lucide-react';
import type { ElementType, ShapeType } from '@/types/canvas';
import type { AddElementOptions } from '@/components/thumbnail-maker/thumbnail-layout';

interface ElementsSidebarProps {
  addElement: (type: ElementType, shapeType?: ShapeType, options?: AddElementOptions) => void;
  onImageUpload: (dataUrl: string) => void;
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
  canvasBackgroundImage: string | null;
  setCanvasBackgroundImage: (url: string | null) => void;
  generateThumbnails: (files: FileList | null) => Promise<void>;
}

const ElementButton = ({ label, icon: Icon, onClick, "data-ai-hint": dataAiHint }: { label: string; icon: React.ElementType, onClick: () => void, "data-ai-hint"?: string }) => (
  <Button
    variant="outline"
    className="w-full justify-start p-4 h-auto text-left mb-2 shadow-sm hover:shadow-md transition-shadow"
    onClick={onClick}
    data-ai-hint={dataAiHint}
  >
    <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
    <span className="font-body">{label}</span>
  </Button>
);

export function ElementsSidebar({
  addElement,
  onImageUpload,
  canvasBackgroundColor,
  setCanvasBackgroundColor,
  canvasBackgroundImage,
  setCanvasBackgroundImage,
  generateThumbnails,
}: ElementsSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleBgUploadClick = () => {
    bgFileInputRef.current?.click();
  };

  const handleBgFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCanvasBackgroundImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      if (bgFileInputRef.current) {
        bgFileInputRef.current.value = "";
      }
    }
  };

  const handleAddBlurLayer = () => {
    addElement('shape', 'rectangle', {
      initialProps: {
        fillColor: 'rgba(220, 220, 220, 0.4)', 
        strokeWidth: 0,
        filterBlur: 5, 
        width: 30, 
        height: 30,
        'data-ai-hint': 'blur layer effect'
      }
    });
  };


  return (
    <Card className="w-72 border-r-0 border-t-0 border-b-0 rounded-none shadow-none flex flex-col">
      <CardHeader className="pb-3 pt-4 border-b">
        <CardTitle className="text-lg font-headline">Elements</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-3">
          <ElementButton label="Add Text" icon={TextIcon} onClick={() => addElement('text')} data-ai-hint="add text element button" />
          <ElementButton label="Add Image" icon={ImageIcon} onClick={() => addElement('image')} data-ai-hint="add placeholder image button" />
          <ElementButton label="Add Rectangle" icon={SquareIcon} onClick={() => addElement('shape', 'rectangle')} data-ai-hint="add rectangle shape button"/>
          <ElementButton label="Add Blur Layer" icon={DropletsIcon} onClick={handleAddBlurLayer} data-ai-hint="add blur layer button"/>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <ElementButton label="Upload Image" icon={UploadCloudIcon} onClick={handleUploadClick} data-ai-hint="upload custom image button" />

          <div className="mt-4">
            <Label htmlFor="bulk-image-upload" className="text-sm font-medium text-muted-foreground">Upload App Icons (PNG):</Label>
            <Input
              type="file"
              id="bulk-image-upload"
              multiple
              accept="image/png"
              className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
            <Button
              variant="default"
              className="w-full mt-3 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => generateThumbnails(selectedFiles)}
              disabled={!selectedFiles || selectedFiles.length === 0}
              data-ai-hint="generate all thumbnails button"
            >
              Generate All Thumbnails
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Canvas Background
            </h3>
            <div className="space-y-1">
              <Label htmlFor="background-color" className="text-xs">Solid Color</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md">
                <Input
                  id="background-color"
                  type="color"
                  value={canvasBackgroundColor}
                  onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                  className="h-8 w-10 p-1 border-none"
                />
                <span className="text-xs font-mono">{canvasBackgroundColor.toUpperCase()}</span>
              </div>
            </div>
            <input
                type="file"
                ref={bgFileInputRef}
                onChange={handleBgFileChange}
                accept="image/*"
                className="hidden"
            />
             <Button
                variant="outline"
                className="w-full justify-start p-4 h-auto text-left mt-3 mb-2 shadow-sm hover:shadow-md transition-shadow"
                onClick={handleBgUploadClick}
                data-ai-hint="upload background image button"
              >
              <UploadCloudIcon className="mr-3 h-5 w-5 text-muted-foreground" />
              Upload Background Image
            </Button>
            {canvasBackgroundImage && (
                 <Button
                    variant="outline"
                    className="w-full justify-start p-3 h-auto text-left text-xs shadow-sm hover:shadow-md transition-shadow hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setCanvasBackgroundImage(null)}
                    data-ai-hint="remove background image button"
                >
                  <Trash2Icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                  Remove Background Image
                </Button>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
