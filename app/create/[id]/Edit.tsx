'use client';

import React, {useEffect, useRef} from 'react';
import {fabric} from 'fabric';

const FabricCanvas = ({src}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true
        });

        fabric.Image.fromURL(src, function (img) {
            // Scale image to fit the canvas
            const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
            );
            img.set({scaleX: scale, scaleY: scale});
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });

        // Customize brush
        canvas.freeDrawingBrush.color = 'red';
        canvas.freeDrawingBrush.width = 10;

        return () => {
            canvas.dispose();
        };
    }, [src]);

    return (
        <canvas ref={canvasRef} width={800} height={600}/>
    );
};

export default FabricCanvas;
