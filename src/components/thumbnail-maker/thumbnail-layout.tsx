
"use client";

import React from 'react';
import { ElementsSidebar } from '@/components/thumbnail-maker/elements-sidebar';
import { CanvasArea } from '@/components/thumbnail-maker/canvas-area';
import { PropertiesSidebar } from '@/components/thumbnail-maker/properties-sidebar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube } from 'lucide-react';

export default function ThumbnailMakerLayout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="h-16 border-b bg-card flex items-center px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Youtube className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold font-headline">YouTube Thumbnail Maker</h1>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <ElementsSidebar />
        <CanvasArea />
        <PropertiesSidebar />
      </main>
    </div>
  );
}
