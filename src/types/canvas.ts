
export type ElementType = 'text' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // percentage of canvas width, 0-100
  y: number; // percentage of canvas height, 0-100
  width: number; // percentage of canvas width, 0-100
  height: number; // percentage of canvas height, 0-100
  rotation: number; // degrees
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number; // in px, will be scaled by browser due to parent scaling
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  letterSpacing: number; // in px
  lineHeight: number; // unitless multiplier, e.g., 1.2
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: number; // in pixels
}

export type CanvasElement = TextElement | ImageElement;
