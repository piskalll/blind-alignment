"use client";

import React, { useRef, useState, useEffect } from "react";
import { Pen, RotateCcw, Check } from "lucide-react";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  signerName: string;
  initialSignature?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  signerName,
  initialSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!initialSignature);
  const [saved, setSaved] = useState(!!initialSignature);

  useEffect(() => {
    if (initialSignature) {
      setSaved(true);
      setHasDrawn(true);
    }
  }, [initialSignature]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use container width with robust fallback
    const parentWidth = canvas.parentElement?.clientWidth || canvas.offsetWidth || 360;
    const parentHeight = canvas.parentElement?.clientHeight || canvas.offsetHeight || 112;

    canvas.width = parentWidth;
    canvas.height = parentHeight;

    ctx.strokeStyle = "#0F766E";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const isTouch = "touches" in e;
    const clientX = isTouch ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (saved) return;
    if ("touches" in e && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || saved) return;
    if ("touches" in e && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Auto-save so user never loses their signature even if they forget to click 'Kunci'
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSaved(false);
    onSave("");
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setSaved(true);
    onSave(dataUrl);
  };

  const handleUnlock = () => {
    setSaved(false);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
          <Pen className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Tanda Tangan: {signerName}</span>
        </div>
        {saved ? (
          <span className="text-[11px] font-bold text-[#0F766E] flex items-center space-x-1">
            <Check className="w-3 h-3" />
            <span>Terkunci &amp; Tersimpan</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Gunakan jari / mouse</span>
        )}
      </div>

      <div className="relative border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden touch-none h-28">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: "none" }}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!hasDrawn && !saved && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-serif-quote">
            Goreskan tanda tangan di sini
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={clearCanvas}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Hapus / Ulangi</span>
        </button>

        {saved ? (
          <button
            type="button"
            onClick={handleUnlock}
            className="text-xs text-[#0F766E] hover:underline font-semibold cursor-pointer"
          >
            Ubah Tanda Tangan
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasDrawn}
            className="px-3.5 py-1.5 bg-[#0F766E] hover:bg-[#0D625C] disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Kunci Tanda Tangan</span>
          </button>
        )}
      </div>
    </div>
  );
};
