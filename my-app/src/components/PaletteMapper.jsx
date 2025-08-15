import { useRef, useState, useEffect } from "react";
import { processImageCanvas, setActivePalette } from "../utils/PaletteMapper";
import './PaletteMapper.css'

export default function PaletteMapper() {
    const canvasRef = useRef(null);
    const offscreenRef = useRef(null); // para guardar la imagen procesada

    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState("https://media.themoviedb.org/t/p/w227_and_h127_bestv2/rFK1jT4iXRcTuc8AFHvLdpiDDD7.jpg");
    const [fileName, setFileName] = useState("");
    const [scale, setScale] = useState(64);
    const [palette, setPalette] = useState("free");
    const [pixelScale, setPixelScale] = useState(1);
    const [useRule, setUseRule] = useState(false);

    // guardar imagen procesada en offscreen
    useEffect(() => {
        if (!canvasRef.current) return;
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = canvasRef.current;
            if (!offscreenRef.current) offscreenRef.current = document.createElement("canvas");
            const off = offscreenRef.current;

            processImageCanvas(img, off, scale);
            canvas.width = off.width;
            canvas.height = off.height;

            // dibujar imagen inicial
            const ctx = canvas.getContext("2d");
            ctx.drawImage(off, 0, 0);
        };

        if (imgFile) {
            const objectURL = URL.createObjectURL(imgFile);
            img.src = objectURL;
            setFileName(imgFile.name);
        } else if (imgURL) {
            img.src = imgURL;
            setFileName("Imagen desde URL");
        }
    }, [imgFile, imgURL, scale, palette]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImgFile(file);
        setImgURL("");
    };

    const handleURLChange = (e) => setImgURL(e.target.value);

    const handlePaletteChange = (e) => {
        const p = e.target.value;
        setPalette(p);
        setActivePalette(p);
    };

    const handleMouseMove = (e) => {
        if (!canvasRef.current || !offscreenRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const ctx = canvas.getContext("2d");

        // dibujar imagen original desde offscreen
        ctx.drawImage(offscreenRef.current, 0, 0);

        if (useRule == false)
            return;

        const colIndex = Math.floor(mouseX / pixelScale);
        const rowIndex = Math.floor(mouseY / pixelScale);

        // dibujar columna
        for (let y = 0; y < canvas.height; y += pixelScale) {
            const row = Math.floor(y / pixelScale);
            const relativeRow = row - rowIndex;

            if (relativeRow % 5 === 0) {
                ctx.fillStyle = (relativeRow % 2 === 0) ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
            } else {
                ctx.fillStyle = (relativeRow % 2 === 0) ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)";
            }

            ctx.fillRect(colIndex * pixelScale, y, pixelScale, pixelScale);
        }

        // dibujar fila
        for (let x = 0; x < canvas.width; x += pixelScale) {
            const col = Math.floor(x / pixelScale);
            const relativeCol = col - colIndex;

            if (relativeCol % 5 === 0) {
                ctx.fillStyle = (relativeCol % 2 === 0) ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
            } else {
                ctx.fillStyle = (relativeCol % 2 === 0) ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)";
            }

            ctx.fillRect(x, rowIndex * pixelScale, pixelScale, pixelScale);
        }
    };

    const handleMouseLeave = () => {
        if (!canvasRef.current || !offscreenRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(offscreenRef.current, 0, 0);
    };

    return (
        <div className="main-container">

            <div className="side-bar">
                <h1 className="Title">Pixel Art Palette Mapper</h1>
                <h1 className="Title">For WPlace</h1>
                <div>
                    <div className="input-div">
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label>Image URL:</label>
                            <input
                                type="text"
                                placeholder="Pega la URL de la imagen"
                                value={imgURL}
                                onChange={handleURLChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="img_scale">Scale:</label>
                            <input
                                type="number"
                                id="img_scale"
                                value={scale}
                                onChange={(e) => setScale(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label htmlFor="palette">Palette:</label>
                            <select
                                id="palette"
                                value={palette}
                                onChange={handlePaletteChange}
                            >
                                <option value="free">Free Palette</option>
                                <option value="freeBasic">Free Basic Palette</option>
                                <option value="paid">Paid Palette</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="useRule">Use Rule:</label>
                            <input
                                type="checkbox"
                                id="useRule"
                                checked={useRule}
                                onChange={(e) => setUseRule(e.target.checked)}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={512}
                    height={512}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                />
            </div>


        </div>
    );
}