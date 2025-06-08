
# YouTube Thumbnail Maker - Firebase Studio

This is a Next.js application built in Firebase Studio that allows users to create custom YouTube thumbnails with an intuitive drag-and-drop interface.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Layout](#layout)
  - [Header](#header)
  - [Elements Sidebar](#elements-sidebar)
  - [Canvas Area](#canvas-area)
  - [Properties Sidebar](#properties-sidebar)
- [Element Types](#element-types)
  - [Text Elements](#text-elements)
  - [Image Elements](#image-elements)
  - [Shape Elements (Rectangle)](#shape-elements-rectangle)
- [Key Functionalities](#key-functionalities)
  - [Adding Elements](#adding-elements)
  - [Selecting Elements](#selecting-elements)
  - [Manipulating Elements](#manipulating-elements)
  - [Layer Management](#layer-management)
  - [Canvas Customization](#canvas-customization)
  - [Exporting Thumbnails](#exporting-thumbnails)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#tech-stack)

## Overview

The YouTube Thumbnail Maker provides a user-friendly interface to design compelling thumbnails for YouTube videos. Users can add text, images, and shapes, customize their properties, arrange them on a 16:9 canvas, and export the final design as a PNG or JPG image.

## Core Features

*   **Intuitive Interface**: Easy-to-use drag-and-drop canvas.
*   **Element Customization**: Detailed control over properties of text, images, and shapes.
*   **Layer Management**: Reorder and manage elements easily.
*   **Image Upload**: Use custom images for elements or canvas background.
*   **Background Options**: Set solid color or image background for the canvas.
*   **Real-time Preview**: See changes instantly on the canvas.
*   **Export Options**: Save thumbnails as PNG or JPG.
*   **Responsive Design**: Adapts to different screen sizes.
*   **Light/Dark Theme**: Supports both light and dark color schemes.

## Layout

The application is divided into several main sections:

### Header

Located at the top, the header contains:
*   **App Title**: "YouTube Thumbnail Maker" with a YouTube icon.
*   **Save as PNG Button**: Exports the current canvas content as a PNG file.
*   **Save as JPG Button**: Exports the current canvas content as a JPG file.
*   **Clear Canvas Button**: Clears all elements from the canvas, resets the background to default white, and removes any background image.

### Elements Sidebar

Located on the left side, this sidebar allows users to add new elements to the canvas:
*   **Add Text**: Adds a new text element with default properties.
*   **Add Image**: Adds a placeholder image element.
*   **Add Rectangle**: Adds a new rectangle shape element.
*   **Add Blur Layer**: Adds a semi-transparent rectangle with a blur filter, useful for creating depth or highlighting effects.
*   **Upload Image**: Allows users to upload their own image from their computer, which is then added to the canvas as an image element.
*   **Canvas Background**:
    *   **Solid Color**: A color picker to set a solid background color for the canvas.
    *   **Upload Background Image**: Allows users to upload an image to be used as the canvas background.
    *   **Remove Background Image**: If a background image is set, this button removes it (the canvas then reverts to the selected solid color).

### Canvas Area

The central part of the application, where the thumbnail is designed:
*   **16:9 Aspect Ratio**: Represents the standard YouTube thumbnail size (visually scaled).
*   **Drag and Drop**: Elements can be moved around the canvas.
*   **Resize**: Elements can be resized using a handle in their bottom-right corner when selected.
*   **Direct Text Editing**: Text elements can be edited directly on the canvas by double-clicking or when selected.
*   **Contextual Actions**:
    *   **Deselect**: Clicking on the canvas background (outside any element) deselects the currently selected element.
    *   **Add Text (Double Click)**: Double-clicking on an empty area of the canvas adds a new text element at that position.
*   **Placeholder Text**: Displays "Your Thumbnail Canvas (1280x720)" if the canvas is empty and has no background image, guiding the user.

### Properties Sidebar

Located on theright side, this sidebar dynamically displays properties for the currently selected element or layer management tools.

*   **No Element Selected**: Shows "No element selected".
*   **Element Selected**: Displays specific properties based on the element type.
    *   **Common Properties (All Elements)**:
        *   **Position (X, Y %)**: Adjusts the top-left corner position of the element.
        *   **Size (Width, Height %)**: Adjusts the dimensions of the element.
        *   **Rotation (°)**: Rotates the element.
    *   **Text Element Properties**: See [Text Elements](#text-elements).
    *   **Image Element Properties**: See [Image Elements](#image-elements).
    *   **Shape Element (Rectangle) Properties**: See [Shape Elements (Rectangle)](#shape-elements-rectangle).
*   **Layers Panel**:
    *   Displays a list of all elements on the canvas, with the top-most element in the list being the visually top-most layer.
    *   **Element Naming**: Shows a preview or name (e.g., text content, image source hint, shape type).
    *   **Selection**: Clicking an element in the list selects it on the canvas.
    *   **Reordering Controls**:
        *   **Bring to Front** (`ChevronsUp` icon): Moves the selected element to the very top layer.
        *   **Bring Forward** (`ChevronUp` icon): Moves the selected element one layer up.
        *   **Send Backward** (`ChevronDown` icon): Moves the selected element one layer down.
        *   **Send to Back** (`ChevronsDown` icon): Moves the selected element to the very bottom layer.
    *   **Delete Element** (`Trash2Icon` icon): Deletes the element from the canvas.

## Element Types

### Text Elements

*   **Content**: The actual text. Editable directly on the canvas when selected.
*   **Font Size (px)**: Size of the text.
*   **Color**: Text color.
*   **Font Family**: Choose from a predefined list of web-safe and Google Fonts.
*   **Alignment**: Left, Center, Right.
*   **Font Weight**: From Thin (100) to Black (900).
*   **Font Style**: Normal, Italic.
*   **Text Decoration**: None, Underline, Strikethrough.
*   **Letter Spacing (px)**: Adjusts space between characters.
*   **Line Height**: Adjusts space between lines of text.
*   **Text Shadow**:
    *   **Offset X (px)**
    *   **Offset Y (px)**
    *   **Blur (px)**
    *   **Color**

### Image Elements

*   **Source URL**: URL of the image. Can be an external link or a data URI for uploaded images.
*   **Alt Text**: Alternative text for the image.
*   **Object Fit**: Controls how the image fits within its bounds (Cover, Contain, Fill, None, Scale Down).
*   **Border**:
    *   **Width (px)**
    *   **Color**
*   **Shadow**:
    *   **Offset X (px)**
    *   **Offset Y (px)**
    *   **Blur (px)**
    *   **Spread (px)**
    *   **Color**
*   **Border Radius (px)**: Rounds the corners of the image.
*   **Filter Blur (px)**: Applies a Gaussian blur effect to the image.

### Shape Elements (Rectangle)

*   **Fill Color**: The main color of the rectangle.
*   **Stroke**:
    *   **Width (px)**: Thickness of the border.
    *   **Color**: Color of the border.
*   **Corner Radius (px)**: Rounds the corners of therectangle.
*   **Shadow**:
    *   **Offset X (px)**
    *   **Offset Y (px)**
    *   **Blur (px)**
    *   **Spread (px)**
    *   **Color**
*   **Filter Blur (px)**: Applies a Gaussian blur effect to the shape. Useful for the "Blur Layer" feature.

## Key Functionalities

### Adding Elements

*   Use buttons in the **Elements Sidebar** to add predefined text, images, or shapes.
*   Upload custom images for elements or as a canvas background.
*   Double-click on the canvas to quickly add a text element.

### Selecting Elements

*   Click on an element on the canvas to select it.
*   Click on an element's entry in the **Layers Panel** in the Properties Sidebar.
*   A selected element is indicated by a dashed border.

### Manipulating Elements

*   **Move**: Click and drag a selected element.
*   **Resize**: Click and drag the resize handle (small circle at the bottom-right) of a selected element.
*   **Rotate**: Adjust the rotation slider/input in the Properties Sidebar.
*   **Edit Properties**: Use the controls in the Properties Sidebar to change various attributes of the selected element.

### Layer Management

*   View all elements as layers in the **Properties Sidebar**.
*   Reorder layers using the "Bring Forward", "Send Backward", "Bring to Front", and "Send to Back" buttons.
*   Delete elements using the trash icon in the layer list or by pressing the "Delete"/"Backspace" key.

### Canvas Customization

*   **Background Color**: Set any solid color using the color picker in the Elements Sidebar.
*   **Background Image**: Upload an image to serve as the background. This image will cover the entire canvas.
*   **Clear Canvas**: Reset the entire canvas to its default state using the "Clear Canvas" button in the header.

### Exporting Thumbnails

*   Click "Save as PNG" or "Save as JPG" in the header.
*   The thumbnail is generated at a higher resolution (2x the displayed canvas size) for better quality.
*   The image is downloaded to the user's computer.
*   *Note*: Exporting images with external sources (like default placeholders) can be affected by CORS policies. Uploaded images (data URIs) and generated elements export reliably.

### Keyboard Shortcuts

*   **Delete/Backspace**: Deletes the currently selected element (if not actively editing text in an input field).

## Tech Stack

*   **Next.js**: React framework for server-side rendering and static site generation.
*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Typed superset of JavaScript.
*   **ShadCN UI**: Re-usable UI components.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **Lucide React**: Icon library.
*   **html2canvas**: Library used for capturing the canvas area as an image for export.
*   **Genkit (for AI)**: Although not heavily used in the current feature set, the project is set up to integrate AI features via Genkit.
