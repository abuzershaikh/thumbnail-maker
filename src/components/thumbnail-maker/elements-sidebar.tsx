
"use client";

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TextIcon, ImageIcon, ShapesIcon, UploadCloudIcon } from 'lucide-react';
import type { ElementType } from '@/types/canvas';

interface ElementsSidebarProps {
  addElement: (type: ElementType) => void;
  onImageUpload: (dataUrl: string) => void;
}

const ElementButton = ({ label, icon: Icon, onClick }: { label: string; icon: React.ElementType, onClick: () => void }) => (
  <Button 
    variant="outline" 
    className="w-full justify-start p-4 h-auto text-left mb-2 shadow-sm hover:shadow-md transition-shadow"
    onClick={onClick}
  >
    <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
    <span className="font-body">{label}</span>
  </Button>
);

export function ElementsSidebar({ addElement, onImageUpload }: ElementsSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Reset file input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
          <ElementButton label="Add Text" icon={TextIcon} onClick={() => addElement('text')} />
          <ElementButton label="Add Image" icon={ImageIcon} onClick={() => addElement('image')} />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <ElementButton label="Upload Image" icon={UploadCloudIcon} onClick={handleUploadClick} />
          
          <ElementButton label="Shapes" icon={ShapesIcon} onClick={() => {/* TODO: Implement shapes */ alert("Shapes functionality not yet implemented.");}} />
          
          <div>
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground mt-4">Background</h3>
            <Button variant="outline" className="w-full justify-start p-4 h-auto text-left mb-2 shadow-sm hover:shadow-md transition-shadow" onClick={() => alert("Background color functionality not yet implemented.")}>
              Set Background Color
            </Button>
             <Button variant="outline" className="w-full justify-start p-4 h-auto text-left mb-2 shadow-sm hover:shadow-md transition-shadow" onClick={() => alert("Background image functionality not yet implemented.")}>
              Upload Background Image
            </Button>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
