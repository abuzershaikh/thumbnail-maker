
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayersIcon, PaletteIcon, AlignCenterIcon, TypeIcon, ImagePlayIcon, Settings2Icon, RotateCcwIcon } from 'lucide-react';
import type { CanvasElement, TextElement, ImageElement } from '@/types/canvas';

interface PropertiesSidebarProps {
  selectedElement: CanvasElement | null;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export function PropertiesSidebar({ selectedElement, updateElement }: PropertiesSidebarProps) {

  const handleInputChange = (property: keyof CanvasElement, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [property]: value });
    }
  };

  const handleSliderChange = (property: keyof CanvasElement, value: number[]) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [property]: value[0] });
    }
  };

  const renderTextProperties = (element: TextElement) => (
    <div className="space-y-3 p-3 border rounded-md bg-muted/20">
      <h4 className="font-medium text-sm flex items-center gap-2"><TypeIcon className="h-4 w-4" /> Text Properties</h4>
      <div className="space-y-1">
        <Label htmlFor="text-content" className="text-xs">Content</Label>
        <Textarea 
          id="text-content" 
          value={element.content} 
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Enter text" 
          className="h-20 text-xs" 
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="font-size" className="text-xs">Font Size (px)</Label>
        <Input 
          id="font-size" 
          type="number"
          value={element.fontSize}
          onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value, 10) || 0)}
          className="h-8 text-xs"
        />
        <Slider 
          defaultValue={[element.fontSize]} 
          max={128} 
          step={1} 
          onValueChange={(value) => handleSliderChange('fontSize', value)}
          className="mt-1"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="text-color" className="text-xs">Color</Label>
        <Input 
          id="text-color" 
          type="color" 
          value={element.color}
          onChange={(e) => handleInputChange('color', e.target.value)}
          className="h-8 p-1" 
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="font-family" className="text-xs">Font Family</Label>
        <Input 
          id="font-family" 
          value={element.fontFamily}
          onChange={(e) => handleInputChange('fontFamily', e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="text-align" className="text-xs">Text Align</Label>
        <Select
          value={element.textAlign}
          onValueChange={(value: 'left' | 'center' | 'right') => handleInputChange('textAlign', value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderImageProperties = (element: ImageElement) => (
     <div className="space-y-3 p-3 border rounded-md bg-muted/20">
      <h4 className="font-medium text-sm flex items-center gap-2"><ImagePlayIcon className="h-4 w-4" /> Image Properties</h4>
      <div className="space-y-1">
        <Label htmlFor="image-src" className="text-xs">Source URL</Label>
        <Input 
          id="image-src" 
          value={element.src} 
          onChange={(e) => handleInputChange('src', e.target.value)}
          placeholder="Enter image URL" 
          className="h-8 text-xs" 
        />
      </div>
       <div className="space-y-1">
        <Label htmlFor="image-alt" className="text-xs">Alt Text</Label>
        <Input 
          id="image-alt" 
          value={element.alt || ''} 
          onChange={(e) => handleInputChange('alt', e.target.value)}
          placeholder="Enter alt text" 
          className="h-8 text-xs" 
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="object-fit" className="text-xs">Object Fit</Label>
        <Select
          value={element.objectFit}
          onValueChange={(value: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down') => handleInputChange('objectFit', value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Object Fit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="scale-down">Scale Down</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderCommonProperties = (element: CanvasElement) => (
    <div className="space-y-3 p-3 border rounded-md bg-muted/20">
      <h4 className="font-medium text-sm flex items-center gap-2"><Settings2Icon className="h-4 w-4" /> Common Properties</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="pos-x" className="text-xs">X (%)</Label>
          <Input id="pos-x" type="number" value={Number(element.x.toFixed(2))} onChange={(e) => handleInputChange('x', parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="pos-y" className="text-xs">Y (%)</Label>
          <Input id="pos-y" type="number" value={Number(element.y.toFixed(2))} onChange={(e) => handleInputChange('y', parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="width" className="text-xs">Width (%)</Label>
          <Input id="width" type="number" value={Number(element.width.toFixed(2))} onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="height" className="text-xs">Height (%)</Label>
          <Input id="height" type="number" value={Number(element.height.toFixed(2))} onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
        </div>
      </div>
       <div className="space-y-1">
        <Label htmlFor="rotation" className="text-xs flex items-center gap-1">
            <RotateCcwIcon className="h-3 w-3" /> Rotation (°)
        </Label>
        <Input 
          id="rotation" 
          type="number"
          value={element.rotation}
          onChange={(e) => handleInputChange('rotation', parseInt(e.target.value, 10) || 0)}
          className="h-8 text-xs"
        />
        <Slider 
          value={[element.rotation]} 
          min={0}
          max={360} 
          step={1} 
          onValueChange={(value) => handleSliderChange('rotation', value)}
          className="mt-1"
        />
      </div>
    </div>
  );

  return (
    <Card className="w-72 border-l-0 border-t-0 border-b-0 rounded-none shadow-none flex flex-col">
      <CardHeader className="pb-3 pt-4 border-b">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <PaletteIcon className="h-5 w-5 text-primary" /> Properties
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-6">
          {!selectedElement && <p className="text-sm text-muted-foreground text-center py-4">No element selected</p>}
          {selectedElement && renderCommonProperties(selectedElement)}
          {selectedElement?.type === 'text' && renderTextProperties(selectedElement as TextElement)}
          {selectedElement?.type === 'image' && renderImageProperties(selectedElement as ImageElement)}
        </CardContent>
      </ScrollArea>
       <CardHeader className="pb-3 pt-4 border-b border-t">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <LayersIcon className="h-5 w-5 text-primary" /> Layers
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-[0.5]"> {/* Smaller fixed size for layers for now */}
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Layer management (read-only for now).</p>
           <div className="mt-2 space-y-2">
            {/* Placeholder for layers - TODO: Implement dynamic layer list */}
            <div className="p-2 border rounded-md text-xs bg-card hover:bg-accent/10">Layer 1: Text Element</div>
            <div className="p-2 border rounded-md text-xs bg-card hover:bg-accent/10">Layer 2: Image Element</div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

    