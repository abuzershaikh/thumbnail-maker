
# YouTube Thumbnail Maker - Firebase Studio

This is a Next.js application built in Firebase Studio that allows users to create custom YouTube thumbnails with an intuitive drag-and-drop interface. It supports saving and loading projects using Firebase Storage.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Firebase Setup (Required for Save/Load)](#firebase-setup-required-for-saveload)
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
  - [Saving Projects to Firebase](#saving-projects-to-firebase)
  - [Loading Projects from Firebase](#loading-projects-from-firebase)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Bulk Thumbnail Generation](#bulk-thumbnail-generation)
- [Tech Stack](#tech-stack)

## Overview

The YouTube Thumbnail Maker provides a user-friendly interface to design compelling thumbnails for YouTube videos. Users can add text, images, and shapes, customize their properties, arrange them on a 16:9 canvas, export the final design as a PNG or JPG image, and save/load their work using Firebase Storage.

## Core Features

*   **Intuitive Interface**: Easy-to-use drag-and-drop canvas.
*   **Element Customization**: Detailed control over properties of text, images, and shapes.
*   **Layer Management**: Reorder and manage elements easily.
*   **Image Upload**: Use custom images for elements or canvas background.
*   **Background Options**: Set solid color or image background for the canvas.
*   **Real-time Preview**: See changes instantly on the canvas.
*   **Export Options**: Save thumbnails as PNG or JPG.
*   **Project Save/Load**: Save your work to Firebase Storage and load it back anytime.
*   **Responsive Design**: Adapts to different screen sizes.
*   **Light/Dark Theme**: Supports both light and dark color schemes.
*   **Bulk Generation**: Quickly create multiple thumbnails based on uploaded app icons and names.

## Firebase Setup (Required for Save/Load)

To use the "Save Project" and "Load Project" features, you need to set up Firebase:

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2.  **Enable Firebase Storage**: In your Firebase project, navigate to "Storage" and click "Get started". Follow the setup wizard. You might need to choose a location for your storage bucket.
3.  **Configure Security Rules (Development)**: For initial development and testing, you can set your Storage security rules to allow public read/write. **IMPORTANT**: For a production application, you MUST configure more secure rules, typically involving user authentication. A simple rule for development could be:
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write: if true; // Allows all users to read and write
        }
      }
    }
    ```
    Apply this in `Firebase Console > Storage > Rules`.
4.  **Get Firebase Configuration**:
    *   In your Firebase project settings (click the gear icon next to "Project Overview"), find your web app's configuration.
    *   Click on "Add app" and choose the web platform (</>) if you haven't already.
    *   Register your app and Firebase will provide you with a `firebaseConfig` object.
5.  **Update `.env` file**: Copy the configuration values into the `.env` file at the root of this project:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    ```
    Replace `YOUR_...` with your actual Firebase project values.
6.  **Restart your development server** for the environment variables to take effect.

Without these steps, the "Save Project" and "Load Project" buttons will show an error message.

## Layout

The application is divided into several main sections:

### Header

Located at the top, the header contains:
*   **App Title**: "YouTube Thumbnail Maker" with a YouTube icon.
*   **Save Project Button**: Opens a dialog to save the current canvas state (elements, background) to Firebase Storage under a user-defined project name.
*   **Load Project Button**: Opens a dialog to load a previously saved project from Firebase Storage by entering its name.
*   **Export PNG Button**: Exports the current canvas content as a PNG file.
*   **Export JPG Button**: Exports the current canvas content as a JPG file.
*   **Clear Canvas Button**: Clears all elements from the canvas, resets the background to default white, and removes any background image. Resets to the initial placeholder elements.

### Elements Sidebar

Located on the left side, this sidebar allows users to add new elements to the canvas:
*   **Add Text**: Adds a new text element with default properties.
*   **Add Image**: Adds a placeholder image element.
*   **Add Rectangle**: Adds a new rectangle shape element.
*   **Add Blur Layer**: Adds a semi-transparent rectangle with a blur filter.
*   **Upload Image**: Allows users to upload their own image from their computer, which is then added to the canvas as an image element.
*   **Upload App Icons (PNG)**: An input field to select multiple PNG files (presumably app icons).
*   **Generate All Thumbnails Button**: After selecting app icons, this button iterates through them, places each icon onto the canvas with its filename (as app name), and triggers a PNG export for each.
*   **Canvas Background**:
    *   **Solid Color**: A color picker to set a solid background color for the canvas.
    *   **Upload Background Image**: Allows users to upload an image to be used as the canvas background.
    *   **Remove Background Image**: If a background image is set, this button removes it.

### Canvas Area

The central part of the application, where the thumbnail is designed:
*   **16:9 Aspect Ratio**: Represents the standard YouTube thumbnail size.
*   **Drag and Drop**: Elements can be moved around the canvas.
*   **Resize**: Elements can be resized using a handle when selected.
*   **Direct Text Editing**: Text elements can be edited directly on the canvas.
*   **Contextual Actions**:
    *   **Deselect**: Clicking on the canvas background deselects the current element.
    *   **Add Text (Double Click)**: Double-clicking an empty area of the canvas adds text.
*   **Placeholder Text**: Displays "Your Thumbnail Canvas (1280x720)" if the canvas is empty and has no background image.

### Properties Sidebar

Located on the right side, this sidebar dynamically displays properties for the currently selected element or layer management tools.

*   **No Element Selected**: Shows "No element selected".
*   **Element Selected**: Displays specific properties based on the element type.
    *   **Common Properties (All Elements)**: Position, Size, Rotation.
    *   **Text Element Properties**: See [Text Elements](#text-elements).
    *   **Image Element Properties**: See [Image Elements](#image-elements).
    *   **Shape Element (Rectangle) Properties**: See [Shape Elements (Rectangle)](#shape-elements-rectangle).
*   **Layers Panel**:
    *   Displays a list of all elements on the canvas.
    *   **Selection**: Clicking an element in the list selects it.
    *   **Reordering Controls**: Bring to Front, Bring Forward, Send Backward, Send to Back.
    *   **Delete Element**: Deletes the element.

## Element Types

### Text Elements

*   **Content**: The actual text.
*   **Font Size (px)**
*   **Color**
*   **Font Family**
*   **Alignment**: Left, Center, Right.
*   **Font Weight**
*   **Font Style**: Normal, Italic.
*   **Text Decoration**: None, Underline, Strikethrough.
*   **Letter Spacing (px)**
*   **Line Height**
*   **Text Shadow**: Offset X, Offset Y, Blur, Color.

### Image Elements

*   **Source URL**
*   **Alt Text**
*   **Object Fit**: Cover, Contain, Fill, None, Scale Down.
*   **Border**: Width, Color.
*   **Shadow**: Offset X, Offset Y, Blur, Spread, Color.
*   **Border Radius (px)**
*   **Filter Blur (px)**

### Shape Elements (Rectangle)

*   **Fill Color**
*   **Stroke**: Width, Color.
*   **Corner Radius (px)**
*   **Shadow**: Offset X, Offset Y, Blur, Spread, Color.
*   **Filter Blur (px)**

## Key Functionalities

### Adding Elements

*   Use buttons in the **Elements Sidebar**.
*   Upload custom images.
*   Double-click canvas for text.

### Selecting Elements

*   Click on canvas or in Layers Panel.
*   Selected element has a dashed border.

### Manipulating Elements

*   Move, Resize, Rotate.
*   Edit properties in the Properties Sidebar.

### Layer Management

*   View and reorder layers in Properties Sidebar.
*   Delete elements via trash icon or "Delete"/"Backspace" key.

### Canvas Customization

*   Set solid background color or upload a background image.
*   Clear canvas to reset to default.

### Exporting Thumbnails

*   Click "Export PNG" or "Export JPG" in the header.
*   Images are downloaded at 2x resolution.

### Saving Projects to Firebase

*   Click the "Save Project" button in the header.
*   A dialog will prompt for a project name.
*   The current state of the canvas (all elements, background color, background image) is saved as a JSON file to `thumbnails/{projectName}.json` in your Firebase Storage bucket.
*   **Note**: Requires Firebase to be set up correctly (see [Firebase Setup](#firebase-setup-required-for-saveload)).

### Loading Projects from Firebase

*   Click the "Load Project" button in the header.
*   A dialog will prompt for the name of the project to load.
*   The application fetches the corresponding JSON file from Firebase Storage and restores the canvas state.
*   **Note**: Requires Firebase to be set up correctly.

### Keyboard Shortcuts

*   **Delete/Backspace**: Deletes the currently selected element (if not actively editing text in an input field).

### Bulk Thumbnail Generation

*   Allows users to upload multiple PNG app icons.
*   For each icon, the system:
    1.  Sets the uploaded icon as the `icon-placeholder` image element.
    2.  Sets the filename (without .png extension) as the content of the `app-name-placeholder` text element.
    3.  Automatically exports the canvas as a PNG named `{original_filename}.png`.
*   This feature relies on the presence of elements with specific IDs: `icon-placeholder` (for the image) and `app-name-placeholder` (for the text). If these are deleted or their IDs changed, this feature may not work as expected.

## Tech Stack

*   **Next.js**: React framework.
*   **React**: JavaScript library for UI.
*   **TypeScript**: Typed JavaScript.
*   **ShadCN UI**: UI components.
*   **Tailwind CSS**: CSS framework.
*   **Lucide React**: Icon library.
*   **html2canvas**: For exporting canvas as image.
*   **Firebase SDK (Storage)**: For saving and loading projects.
*   **Genkit (for AI)**: Set up but not actively used for core thumbnail features.
