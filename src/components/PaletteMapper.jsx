import { useState } from "react";
import PixelCanvas from "./PixelCanvas";
import './PaletteMapper.css';

export default function PaletteMapper() {
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState("https://pbs.twimg.com/media/GR7l-3haMAA_a28.jpg");
    const [scale, setScale] = useState(64);
    const [palette, setPalette] = useState("free");
    const [useRule, setUseRule] = useState(false);

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
    };


    return (
        <div className="main-container">

            <div className="side-bar">
                <h1 className="Title">Pixel Art Palette Mapper</h1>
                <h1 className="Title">For WPlace</h1>

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

            <div className="canvas-container">
                <PixelCanvas
                    imgFile={imgFile}
                    imgURL={imgURL}
                    scale={scale}
                    useRule={useRule}
                    palette={palette}
                />

            </div>
        </div>
    );
}
