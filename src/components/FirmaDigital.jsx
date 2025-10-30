// src/components/FirmaDigital.js
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import trimCanvas from "trim-canvas";

const FirmaDigital = ({ onGuardarFirma }) => {
    const sigCanvas = useRef(null);
    const [firmaURL, setFirmaURL] = useState(null);

    const limpiar = () => {
        sigCanvas.current.clear();
        setFirmaURL(null);
    };

    const guardar = () => {
        if (!sigCanvas.current.isEmpty()) {
            const trimmed = trimCanvas(sigCanvas.current.getCanvas());
            const dataURL = trimmed.toDataURL("image/png");
            setFirmaURL(dataURL);
            onGuardarFirma(dataURL);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 mt-4">
            {!firmaURL ? (
                <>
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        backgroundColor="#fff"
                        canvasProps={{
                            width: 400,
                            height: 200,
                            className:
                                "border-2 border-gray-400 rounded-lg shadow-sm bg-white cursor-crosshair",
                        }}
                    />
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={limpiar}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm rounded-md"
                        >
                            Limpiar
                        </button>
                        <button
                            onClick={guardar}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md"
                        >
                            Guardar firma
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <p className="text-green-600 mb-2">Firma guardada ✅</p>
                    <img
                        src={firmaURL}
                        alt="Firma"
                        className="border-2 border-gray-400 rounded-lg mx-auto"
                        style={{ width: "250px" }}
                    />
                </div>
            )}
        </div>
    );
};

export default FirmaDigital;
