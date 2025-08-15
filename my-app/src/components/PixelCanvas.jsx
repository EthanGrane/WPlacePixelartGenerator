import { useRef, useEffect } from "react";
import { processImageCanvas, setPalette } from "../utils/PaletteMapper";

export default function PixelCanvas({ imgFile, imgURL, scale, useRule, palette }) {
    const canvasRef = useRef(null);
    const offscreenRef = useRef(null);

    useEffect(() => {
        console.log("useEffect")
        if (!canvasRef.current) return;
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            if (!offscreenRef.current) offscreenRef.current = document.createElement("canvas");
            const off = offscreenRef.current;

            processImageCanvas(img, off, scale);
            const ctx = canvasRef.current.getContext("2d");
            canvasRef.current.width = off.width;
            canvasRef.current.height = off.height;
            ctx.drawImage(off, 0, 0);
        };

        if (imgFile) img.src = URL.createObjectURL(imgFile);
        else if (imgURL) img.src = imgURL;
    }, [imgFile, imgURL, scale, palette]);

    const getPixelLuminosity = (ctx, x, y) => {
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        return 0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2];
    };

    const handleMouseMove = (e) => {
        if (!canvasRef.current || !offscreenRef.current || !useRule) return;

        const canvas = canvasRef.current;
        const off = offscreenRef.current;
        const rect = canvas.getBoundingClientRect();

        const ctx = canvas.getContext("2d");
        ctx.drawImage(off, 0, 0);

        const pixelScaleX = canvas.width / off.width;
        const pixelScaleY = canvas.height / off.height;

        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

        const colIndex = Math.floor(mouseX / pixelScaleX);
        const rowIndex = Math.floor(mouseY / pixelScaleY);

        const lightPixelColor = "rgba(255,255,255,0.6)";
        const darkPixelColor = "rgba(0,0,0,0.6)";

        // Dibujar línea vertical
        for (let y = 0; y < off.height; y++) {
            if(y % 2 === 0) continue;

            const lum = getPixelLuminosity(ctx, colIndex * pixelScaleX + pixelScaleX / 2, y * pixelScaleY + pixelScaleY / 2);
            ctx.fillStyle = lum < 128 ? lightPixelColor : darkPixelColor;
            ctx.fillRect(colIndex * pixelScaleX, y * pixelScaleY, pixelScaleX, pixelScaleY);
        }

        // Dibujar línea horizontal
        for (let x = 0; x < off.width; x++) {
            if(x % 2 === 0) continue;

            const lum = getPixelLuminosity(ctx, x * pixelScaleX + pixelScaleX / 2, rowIndex * pixelScaleY + pixelScaleY / 2);
            ctx.fillStyle = lum < 128 ? lightPixelColor : darkPixelColor;
            ctx.fillRect(x * pixelScaleX, rowIndex * pixelScaleY, pixelScaleX, pixelScaleY);
        }
    };



    const handleMouseLeave = () => {
        if (!canvasRef.current || !offscreenRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(offscreenRef.current, 0, 0);
    };

    return (
        <canvas
            ref={canvasRef}
            width={512}
            height={512}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
}