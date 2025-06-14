
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    LayersIcon, PaletteIcon, TypeIcon, ImagePlayIcon, Settings2Icon, RotateCcwIcon, Trash2Icon,
    CaseSensitiveIcon, PilcrowIcon, CombineIcon, UnderlineIcon, StrikethroughIcon, BoldIcon,
    ItalicIcon, Square as SquareIconLucide, Palette, Copy as CopyIcon, ChevronsUp, ChevronUp, ChevronDown, ChevronsDown, ShapesIcon, DropletsIcon
} from 'lucide-react';
import type { CanvasElement, TextElement, ImageElement, ShapeElement } from '@/types/canvas';

interface PropertiesSidebarProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
}

const CustomCornerRadiusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 5S15 5 15 10H9S9 15 5 15" />
  </svg>
);

const FONT_FAMILIES = [
  'PT Sans', 'Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman',
  'Poppins', 'Archivo', 'Montserrat', 'Lato', 'Roboto', 'Open Sans', 'Oswald', 'Source Sans Pro'
].sort();

const FONT_WEIGHTS = [
  { label: 'Thin (100)', value: '100' },
  { label: 'Extra Light (200)', value: '200' },
  { label: 'Light (300)', value: '300' },
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra Bold (800)', value: '800' },
  { label: 'Black (900)', value: '900' },
];


export function PropertiesSidebar({
    elements, selectedElement, updateElement, deleteElement, selectElement,
    bringForward, sendBackward, bringToFront, sendToBack
}: PropertiesSidebarProps) {

  const handleInputChange = (property: keyof CanvasElement | keyof TextElement | keyof ImageElement | keyof ShapeElement, value: any) => {
    if (selectedElement) {
        if (typeof value === 'string' && (property === 'letterSpacing' || property === 'lineHeight' || property === 'borderRadius' || property === 'borderWidth' || property === 'shadowOffsetX' || property === 'shadowOffsetY' || property === 'shadowBlur' || property === 'shadowSpreadRadius' || property === 'strokeWidth' || property === 'cornerRadius' || property === 'filterBlur' || property === 'fontSize')) {
            const numValue = parseFloat(value);
            updateElement(selectedElement.id, { [property]: isNaN(numValue) ? 0 : numValue });
        } else {
            updateElement(selectedElement.id, { [property]: value });
        }
    }
  };

  const handleSliderChange = (property: keyof CanvasElement | keyof TextElement | keyof ImageElement | keyof ShapeElement, value: number[]) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [property]: value[0] });
    }
  };

  const getLayerName = (element: CanvasElement): string => {
    if (element.type === 'text') {
      return `Text: ${(element as TextElement).content.substring(0, 20)}${(element as TextElement).content.length > 20 ? '...' : ''}`;
    }
    if (element.type === 'image') {
      const imgEl = element as ImageElement;
      if (imgEl.src.startsWith('data:')) return 'Image: Uploaded';
      if (imgEl['data-ai-hint']) return `Image: ${imgEl['data-ai-hint']}`;
      return `Image: ${imgEl.src.substring(imgEl.src.lastIndexOf('/') + 1).substring(0,20)}...`;
    }
    if (element.type === 'shape') {
        const shapeEl = element as ShapeElement;
        if (shapeEl['data-ai-hint'] === 'blur layer effect') return 'Layer: Blur Effect';
        return `Shape: ${shapeEl.shapeType}`;
    }
    return `Element: ${element.id.substring(0, 8)}`;
  };


  const renderTextProperties = (element: TextElement) => (
    <div className="space-y-3 p-3 border rounded-md bg-muted/20">
      <h4 className="font-medium text-sm flex items-center gap-2"><TypeIcon className="h-4 w-4" /> Text Properties</h4>
      <div className="space-y-1">
        <Label htmlFor="text-content" className="text-xs">Content (Editable on Canvas)</Label>
        <Textarea
          id="text-content"
          value={element.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Enter text"
          className="h-20 text-xs"
          readOnly // Content is edited directly on canvas
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
          value={[element.fontSize]}
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
         <Select
            value={element.fontFamily}
            onValueChange={(value: string) => handleInputChange('fontFamily', value)}
            >
            <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select Font Family" />
            </SelectTrigger>
            <SelectContent>
                {FONT_FAMILIES.map(font => (
                    <SelectItem key={font} value={font} style={{fontFamily: font}}>
                        {font}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
            <Label htmlFor="text-align" className="text-xs">Align</Label>
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
        <div className="space-y-1">
            <Label htmlFor="font-weight" className="text-xs flex items-center gap-1"><BoldIcon className="h-3 w-3" />Weight</Label>
            <Select
                value={element.fontWeight}
                onValueChange={(value: string) => handleInputChange('fontWeight', value)}
            >
                <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                    {FONT_WEIGHTS.map(weight => (
                        <SelectItem key={weight.value} value={weight.value} style={{fontWeight: weight.value}}>
                            {weight.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
         <div className="space-y-1">
            <Label htmlFor="font-style" className="text-xs flex items-center gap-1"><ItalicIcon className="h-3 w-3" />Style</Label>
            <Select
            value={element.fontStyle}
            onValueChange={(value: 'normal' | 'italic') => handleInputChange('fontStyle', value)}
            >
            <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="space-y-1">
            <Label htmlFor="text-decoration" className="text-xs flex items-center gap-1"><UnderlineIcon className="h-3 w-3" />Decoration</Label>
            <Select
            value={element.textDecoration}
            onValueChange={(value: 'none' | 'underline' | 'line-through') => handleInputChange('textDecoration', value)}
            >
            <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Decoration" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="line-through">Strikethrough</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="letter-spacing" className="text-xs flex items-center gap-1"><CaseSensitiveIcon className="h-3 w-3" />Letter Spacing (px)</Label>
        <Input
          id="letter-spacing"
          type="number"
          value={element.letterSpacing}
          onChange={(e) => handleInputChange('letterSpacing', e.target.value)}
          className="h-8 text-xs"
          step="0.1"
        />
        <Slider
          value={[element.letterSpacing]}
          min={-5}
          max={20}
          step={0.1}
          onValueChange={(value) => handleSliderChange('letterSpacing', value)}
          className="mt-1"
        />
      </div>
       <div className="space-y-1">
        <Label htmlFor="line-height" className="text-xs flex items-center gap-1"><PilcrowIcon className="h-3 w-3" />Line Height</Label>
        <Input
          id="line-height"
          type="number"
          value={element.lineHeight}
          onChange={(e) => handleInputChange('lineHeight', e.target.value)}
          className="h-8 text-xs"
          step="0.1"
        />
        <Slider
          value={[element.lineHeight]}
          min={0.8}
          max={3}
          step={0.1}
          onValueChange={(value) => handleSliderChange('lineHeight', value)}
          className="mt-1"
        />
      </div>
      <div className="pt-2 space-y-1">
        <h5 className="text-xs font-medium flex items-center gap-1 mb-1"><CopyIcon className="h-3 w-3 text-muted-foreground" /> Text Shadow</h5>
        <div className="grid grid-cols-2 gap-2">
            <div>
                <Label htmlFor="text-shadow-offset-x" className="text-xs">Offset X (px)</Label>
                <Input id="text-shadow-offset-x" type="number" value={element.shadowOffsetX || 0} onChange={(e) => handleInputChange('shadowOffsetX', parseFloat(e.target.value))} className="h-8 text-xs" />
                <Slider value={[element.shadowOffsetX || 0]} min={-20} max={20} step={1} onValueChange={(value) => handleSliderChange('shadowOffsetX', value)} className="mt-1" />
            </div>
            <div>
                <Label htmlFor="text-shadow-offset-y" className="text-xs">Offset Y (px)</Label>
                <Input id="text-shadow-offset-y" type="number" value={element.shadowOffsetY || 0} onChange={(e) => handleInputChange('shadowOffsetY', parseFloat(e.target.value))} className="h-8 text-xs" />
                <Slider value={[element.shadowOffsetY || 0]} min={-20} max={20} step={1} onValueChange={(value) => handleSliderChange('shadowOffsetY', value)} className="mt-1" />
            </div>
        </div>
        <Label htmlFor="text-shadow-blur" className="text-xs mt-2">Blur (px)</Label>
        <Input id="text-shadow-blur" type="number" value={element.shadowBlur || 0} onChange={(e) => handleInputChange('shadowBlur', parseFloat(e.target.value))} className="h-8 text-xs" min="0" />
        <Slider value={[element.shadowBlur || 0]} max={30} step={1} onValueChange={(value) => handleSliderChange('shadowBlur', value)} className="mt-1" />

        <Label htmlFor="text-shadow-color" className="text-xs mt-2 flex items-center gap-1"><Palette className="h-3 w-3 text-muted-foreground" />Color</Label>
        <Input id="text-shadow-color" type="color" value={element.shadowColor || '#00000000'} onChange={(e) => handleInputChange('shadowColor', e.target.value)} className="h-8 p-1" />
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
          disabled={element.src.startsWith('data:')}
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
        <Label htmlFor="object-fit" className="text-xs flex items-center gap-1"><CombineIcon className="h-3 w-3" />Object Fit</Label>
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

      <div className="pt-2 space-y-1">
        <h5 className="text-xs font-medium flex items-center gap-1 mb-1"><SquareIconLucide className="h-3 w-3 text-muted-foreground" /> Border</h5>
        <Label htmlFor="border-width" className="text-xs">Width (px)</Label>
        <Input id="border-width" type="number" value={element.borderWidth || 0} onChange={(e) => handleInputChange('borderWidth', e.target.value)} className="h-8 text-xs" min="0" />
        <Slider value={[element.borderWidth || 0]} max={50} step={1} onValueChange={(value) => handleSliderChange('borderWidth', value)} className="mt-1" />

        <Label htmlFor="border-color" className="text-xs mt-2 flex items-center gap-1"><Palette className="h-3 w-3 text-muted-foreground" />Color</Label>
        <Input id="border-color" type="color" value={element.borderColor || '#000000'} onChange={(e) => handleInputChange('borderColor', e.target.value)} className="h-8 p-1" />
      </div>

      <div className="pt-2 space-y-1">
        <h5 className="text-xs font-medium flex items-center gap-1 mb-1"><CopyIcon className="h-3 w-3 text-muted-foreground" /> Shadow</h5>
        <div className="grid grid-cols-2 gap-2">
            <div>
                <Label htmlFor="shadow-offset-x" className="text-xs">Offset X (px)</Label>
                <Input id="shadow-offset-x" type="number" value={element.shadowOffsetX || 0} onChange={(e) => handleInputChange('shadowOffsetX', e.target.value)} className="h-8 text-xs" />
                <Slider value={[element.shadowOffsetX || 0]} min={-50} max={50} step={1} onValueChange={(value) => handleSliderChange('shadowOffsetX', value)} className="mt-1" />
            </div>
            <div>
                <Label htmlFor="shadow-offset-y" className="text-xs">Offset Y (px)</Label>
                <Input id="shadow-offset-y" type="number" value={element.shadowOffsetY || 0} onChange={(e) => handleInputChange('shadowOffsetY', e.target.value)} className="h-8 text-xs" />
                <Slider value={[element.shadowOffsetY || 0]} min={-50} max={50} step={1} onValueChange={(value) => handleSliderChange('shadowOffsetY', value)} className="mt-1" />
            </div>
        </div>
        <Label htmlFor="shadow-blur" className="text-xs mt-2">Blur (px)</Label>
        <Input id="shadow-blur" type="number" value={element.shadowBlur || 0} onChange={(e) => handleInputChange('shadowBlur', e.target.value)} className="h-8 text-xs" min="0" />
        <Slider value={[element.shadowBlur || 0]} max={100} step={1} onValueChange={(value) => handleSliderChange('shadowBlur', value)} className="mt-1" />

        <Label htmlFor="shadow-spread" className="text-xs mt-2">Spread (px)</Label>
        <Input id="shadow-spread" type="number" value={element.shadowSpreadRadius || 0} onChange={(e) => handleInputChange('shadowSpreadRadius', e.target.value)} className="h-8 text-xs" />
        <Slider value={[element.shadowSpreadRadius || 0]} min={-50} max={50} step={1} onValueChange={(value) => handleSliderChange('shadowSpreadRadius', value)} className="mt-1" />

        <Label htmlFor="shadow-color" className="text-xs mt-2 flex items-center gap-1"><Palette className="h-3 w-3 text-muted-foreground" />Color</Label>
        <Input id="shadow-color" type="color" value={element.shadowColor || '#00000000'} onChange={(e) => handleInputChange('shadowColor', e.target.value)} className="h-8 p-1" />
      </div>

      <div className="pt-2 space-y-1">
        <Label htmlFor="border-radius" className="text-xs flex items-center gap-1">
          <CustomCornerRadiusIcon className="h-3 w-3" />Border Radius (px)
        </Label>
        <Input
          id="border-radius"
          type="number"
          value={element.borderRadius || 0}
          onChange={(e) => handleInputChange('borderRadius', parseInt(e.target.value, 10) || 0)}
          className="h-8 text-xs"
          min="0"
        />
        <Slider
          value={[element.borderRadius || 0]}
          max={100}
          step={1}
          onValueChange={(value) => handleSliderChange('borderRadius', value)}
          className="mt-1"
        />
      </div>
      <div className="pt-2 space-y-1">
        <Label htmlFor="image-filter-blur" className="text-xs flex items-center gap-1"><DropletsIcon className="h-3 w-3 text-muted-foreground" />Filter Blur (px)</Label>
        <Input id="image-filter-blur" type="number" value={element.filterBlur || 0} onChange={(e) => handleInputChange('filterBlur', e.target.value)} className="h-8 text-xs" min="0" />
        <Slider value={[element.filterBlur || 0]} max={50} step={1} onValueChange={(value) => handleSliderChange('filterBlur', value)} className="mt-1" />
      </div>
    </div>
  );

  const renderShapeProperties = (element: ShapeElement) => (
    <div className="space-y-3 p-3 border rounded-md bg-muted/20">
      <h4 className="font-medium text-sm flex items-center gap-2"><ShapesIcon className="h-4 w-4" /> Shape Properties ({element.shapeType})</h4>
       <div className="space-y-1">
        <Label htmlFor="shape-fill-color" className="text-xs flex items-center gap-1"><Palette className="h-3 w-3 text-muted-foreground" />Fill Color</Label>
        <Input
          id="shape-fill-color"
          type="color"
          value={element.fillColor}
          onChange={(e) => handleInputChange('fillColor', e.target.value)}
          className="h-8 p-1"
        />
      </div>
      <div className="pt-2 space-y-1">
        <h5 className="text-xs font-medium flex items-center gap-1 mb-1"><SquareIconLucide className="h-3 w-3 text-muted-foreground" /> Stroke</h5>
        <Label htmlFor="shape-stroke-width" className="text-xs">Width (px)</Label>
        <Input id="shape-stroke-width" type="number" value={element.strokeWidth || 0} onChange={(e) => handleInputChange('strokeWidth', e.target.value)} className="h-8 text-xs" min="0" />
        <Slider value={[element.strokeWidth || 0]} max={50} step={1} onValueChange={(value) => handleSliderChange('strokeWidth', value)} className="mt-1" />

        <Label htmlFor="shape-stroke-color" className="text-xs mt-2 flex items-center gap-1"><Palette className="h-3 w-3 text-muted-foreground" />Color</Label>
        <Input id="shape-stroke-color" type="color" value={element.strokeColor || '#000000'} onChange={(e) => handleInputChange('strokeColor', e.target.value)} className="h-8 p-1" />
      </div>
      {element.shapeType === 'rectangle' && (
        <div className="pt-2 space-y-1">
          <Label htmlFor="shape-border-radius" className="text-xs flex items-center gap-1">
            <CustomCornerRadiusIcon className="h-3 w-3" />Corner Radius (px)
          </Label>
          <Input
            id="shape-border-radius"
            type="number"
            value={element.cornerRadius || 0}
            onChange={(e) => handleInputChange('cornerRadius', parseInt(e.target.value, 10) || 0)}
            className="h-8 text-xs"
            min="0"
          />
          <Slider
            value={[element.cornerRadius || 0]}
            max={100}
            step={1}
            onValueChange={(value) => handleSliderChange('cornerRadius', value)}
            className="mt-1"
          />
        </div>
      )}
       <div className="pt-2 space-y-1">
        <h5 className="text-xs font-medium flex items-center gap-1 mb-1"><CopyIcon className="h-3 w-3 text-muted-foreground" /> Shadow</h5>
        <div className="grid grid-cols-2 gap-2">
            <div>
                <Label htmlFor="shape-shadow-offset-x" className="text-xs">Offset X (px)</Label>
                <Input id="shape-shadow-offset-x" type="number" value={element.shadowOffsetX || 0} onChange={(e) => handleInputChange('shadowOffsetX', e.target.value)} className="h-8 text-xs" />
                <Slider value={[element.shadowOffsetX || 0]} min={-50} max={50} step={1} onValueChange={(value) => handleSliderChange('shadowOffsetX', value)} className="mt-1" />
            </div>
            <div>
                <Label htmlFor="shape-shadow-offset-y" className="text-xs">Offset Y (px)</Label>
                <Input id="shape-shadow-offset-y" type="number" value={element.shadowOffsetY || 0} onChange={(e) => handleInputChange('shadowOffsetY', e.target.value)} className="h-8 text-xs" />
                <Slider value={[element.shadowOffsetY || 0]} min={-50} max={50} step={1} onValueChange={(value) => handleSliderChange('shadowOffsetY', value)} className="mt-1" />
            </div>
        </div>
        <Label htmlFor="shape-shadow-blur" className="text-xs mt-2">Blur (px)</Label>
        <Input id="shape-shadow-blur" type="number" value={element.shadowBlur || 0} onChange={(e) => handleInputChange('shadowBlur', e.target.value)} className="h-8 text-xs" min="0" />
        <Slider value={[element.shadowBlur || 0]} max={100} step={1} onValueChange={(value) => handleSliderChange('shadowBlur', value)} className="mt-1" />

        <Label htmlFor="shape-shadow-spread" className="text-xs mt-2">Spread (px)</Label>
        <Input id="shape-shadow-spread" type="number" value={element.shadowSpreadRadius || 0} onChange={(e) => handleInputChange('shadowSpreadRadius', e.target.value)} className="h-8 text-xs" />
        <Slider value={[element.shadowSpreadRadius || 0]} min={-50} max={50} step={1} onValueChange={(value) => handleSliderChange('shadowSpreadRadius', value)} className="mt-1" />

        <Label htmlFor="shape-shadow-color" className="text-xs mt-2 flex items-center gap-1"><Palette className="h-3 w-3 text-muted-foreground" />Color</Label>
        <Input id="shape-shadow-color" type="color" value={element.shadowColor || '#00000000'} onChange={(e) => handleInputChange('shadowColor', e.target.value)} className="h-8 p-1" />
      </div>
      <div className="pt-2 space-y-1">
        <Label htmlFor="shape-filter-blur" className="text-xs flex items-center gap-1"><DropletsIcon className="h-3 w-3 text-muted-foreground" />Filter Blur (px)</Label>
        <Input id="shape-filter-blur" type="number" value={element.filterBlur || 0} onChange={(e) => handleInputChange('filterBlur', e.target.value)} className="h-8 text-xs" min="0" />
        <Slider value={[element.filterBlur || 0]} max={50} step={1} onValueChange={(value) => handleSliderChange('filterBlur', value)} className="mt-1" />
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

  const reversedElements = elements.slice().reverse();
  const selectedElementIndexInReversed = selectedElement ? reversedElements.findIndex(el => el.id === selectedElement.id) : -1;
  const totalElements = elements.length;

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
          {selectedElement?.type === 'shape' && renderShapeProperties(selectedElement as ShapeElement)}
        </CardContent>
      </ScrollArea>
       <CardHeader className="pb-3 pt-4 border-b border-t">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <LayersIcon className="h-5 w-5 text-primary" /> Layers
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-[0.5_1_auto] min-h-[150px]">
        <CardContent className="p-4">
          {elements.length === 0 && <p className="text-sm text-muted-foreground text-center">No layers yet.</p>}
          <div className="space-y-1">
            {reversedElements.map((element, index) => (
              <div
                key={element.id}
                className={`p-2 border rounded-md text-xs flex items-center justify-between cursor-pointer transition-colors
                            ${selectedElement?.id === element.id ? 'bg-primary/20 border-primary' : 'bg-card hover:bg-muted/50'}`}
                onClick={() => selectElement(element.id)}
              >
                <span className="truncate flex-1 mr-1" title={getLayerName(element)}>{getLayerName(element)}</span>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); bringToFront(element.id); }} title="Bring to Front" disabled={index === 0}>
                    <ChevronsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); bringForward(element.id); }} title="Bring Forward" disabled={index === 0}>
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); sendBackward(element.id); }} title="Send Backward" disabled={index === totalElements - 1}>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); sendToBack(element.id); }} title="Send to Back" disabled={index === totalElements - 1}>
                    <ChevronsDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-destructive/20 hover:text-destructive ml-1"
                    onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
                    title={`Delete ${element.type}`}
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
