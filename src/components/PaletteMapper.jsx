import { useRef, useState, useEffect } from "react";
import { processImageCanvas, setActivePalette } from "../utils/PaletteMapper";
import './PaletteMapper.css';
import { motion } from "motion/react";

export default function PaletteMapper() {
    const canvasRef = useRef(null);
    const offscreenRef = useRef(null);

    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState("https://media.themoviedb.org/t/p/w227_and_h127_bestv2/rFK1jT4iXRcTuc8AFHvLdpiDDD7.jpg");
    const [fileName, setFileName] = useState("");
    const [scale, setScale] = useState(64);
    const [palette, setPalette] = useState("free");
    const [pixelScale, setPixelScale] = useState(1);
    const [useRule, setUseRule] = useState(false);

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
        ctx.drawImage(offscreenRef.current, 0, 0);

        if (!useRule) return;

        const colIndex = Math.floor(mouseX / pixelScale);
        const rowIndex = Math.floor(mouseY / pixelScale);

        for (let y = 0; y < canvas.height; y += pixelScale) {
            const row = Math.floor(y / pixelScale);
            const relativeRow = row - rowIndex;
            ctx.fillStyle = (relativeRow % 5 === 0)
                ? (relativeRow % 2 === 0 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)")
                : (relativeRow % 2 === 0 ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)");
            ctx.fillRect(colIndex * pixelScale, y, pixelScale, pixelScale);
        }

        for (let x = 0; x < canvas.width; x += pixelScale) {
            const col = Math.floor(x / pixelScale);
            const relativeCol = col - colIndex;
            ctx.fillStyle = (relativeCol % 5 === 0)
                ? (relativeCol % 2 === 0 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)")
                : (relativeCol % 2 === 0 ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)");
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
            <motion.div
                className="side-bar"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    className="Title"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Pixel Art Palette Mapper
                </motion.h1>

                <motion.h2
                    className="Title"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    For WPlace
                </motion.h2>

                <motion.div
                    className="input-div"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <label>Image URL:</label>
                    <input type="text" placeholder="Pega la URL de la imagen" value={imgURL} onChange={handleURLChange} />

                    <label htmlFor="img_scale">Scale:</label>
                    <motion.input
                        type="number"
                        id="img_scale"
                        value={scale}
                        whileFocus={{ scale: 1.05 }}
                        onChange={(e) => setScale(Number(e.target.value))}
                    />

                    <label htmlFor="palette">Palette:</label>
                    <motion.select
                        id="palette"
                        value={palette}
                        whileHover={{ scale: 1.05 }}
                        onChange={handlePaletteChange}
                    >
                        <option value="free">Free Palette</option>
                        <option value="freeBasic">Free Basic Palette</option>
                        <option value="paid">Paid Palette</option>
                    </motion.select>

                    <span>
                        <label htmlFor="useRule">Use Rule:</label>
                        <input
                            style={{ width: "auto" }}
                            type="checkbox"
                            id="useRule"
                            checked={useRule}
                            whileTap={{ scale: 1.2 }}
                            onChange={(e) => setUseRule(e.target.checked)}
                        />
                    </span>
                </motion.div>
            </motion.div>

            <motion.div
                className="canvas-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <canvas
                    ref={canvasRef}
                    width={512}
                    height={512}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                />
            </motion.div>
        </div>
    );
}
