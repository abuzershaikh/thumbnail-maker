
"use client";

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextIcon, ImageIcon, UploadCloudIcon, Palette, Square as SquareIcon, Trash2Icon } from 'lucide-react';
import type { ElementType } from '@/types/canvas';

interface ElementsSidebarProps {
  addElement: (type: ElementType, shapeType?: 'rectangle') => void;
  onImageUpload: (dataUrl: string) => void;
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
  canvasBackgroundImage: string | null;
  setCanvasBackgroundImage: (url: string | null) => void;
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
  setCanvasBackgroundImage
}: ElementsSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

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
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <ElementButton label="Upload Image" icon={UploadCloudIcon} onClick={handleUploadClick} data-ai-hint="upload custom image button" />
          
          <div>
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
