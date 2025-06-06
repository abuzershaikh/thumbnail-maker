
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { LayersIcon, PaletteIcon, AlignCenterIcon, TypeIcon } from 'lucide-react';

export function PropertiesSidebar() {
  return (
    <Card className="w-72 border-l-0 border-t-0 border-b-0 rounded-none shadow-none flex flex-col">
      <CardHeader className="pb-3 pt-4 border-b">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <PaletteIcon className="h-5 w-5 text-primary" /> Properties
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-6">
          {/* Placeholder for selected element properties */}
          <div className="space-y-3 p-3 border rounded-md bg-muted/20">
            <h4 className="font-medium text-sm flex items-center gap-2"><TypeIcon className="h-4 w-4" /> Text Properties</h4>
            <div className="space-y-1">
              <Label htmlFor="text-content" className="text-xs">Content</Label>
              <Input id="text-content" placeholder="Enter text" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="font-size" className="text-xs">Font Size</Label>
              <Slider id="font-size" defaultValue={[16]} max={72} step={1} />
            </div>
             <div className="space-y-1">
              <Label htmlFor="text-color" className="text-xs">Color</Label>
              <Input id="text-color" type="color" defaultValue="#333333" className="h-8 p-1" />
            </div>
          </div>

          <div className="space-y-3 p-3 border rounded-md bg-muted/20">
            <h4 className="font-medium text-sm flex items-center gap-2"><AlignCenterIcon className="h-4 w-4" /> Alignment & Position</h4>
             <div className="space-y-1">
              <Label htmlFor="pos-x" className="text-xs">X Position</Label>
              <Input id="pos-x" type="number" defaultValue={0} className="h-8 text-xs" />
            </div>
             <div className="space-y-1">
              <Label htmlFor="pos-y" className="text-xs">Y Position</Label>
              <Input id="pos-y" type="number" defaultValue={0} className="h-8 text-xs" />
            </div>
          </div>
        </CardContent>
      </ScrollArea>
       <CardHeader className="pb-3 pt-4 border-b border-t">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <LayersIcon className="h-5 w-5 text-primary" /> Layers
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Layer management will appear here.</p>
          {/* Placeholder for layers */}
           <div className="mt-2 space-y-2">
            <div className="p-2 border rounded-md text-xs bg-card hover:bg-accent/10">Layer 1: Text Element</div>
            <div className="p-2 border rounded-md text-xs bg-card hover:bg-accent/10">Layer 2: Image Element</div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
