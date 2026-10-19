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

    const parentWidth =
      canvas.parentElement?.clientWidth || canvas.offsetWidth || 360;
    const parentHeight =
      canvas.parentElement?.clientHeight || canvas.offsetHeight || 112;

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

  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const isTouch = "touches" in e;
    const clientX = isTouch
      ? e.touches[0].clientX
      : (e as React.MouseEvent).clientX;
    const clientY = isTouch
      ? e.touches[0].clientY
      : (e as React.MouseEvent).clientY;

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
    <div className="bg-[#F8FAF7] border border-[#CBD5E1] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
          <Pen className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Tanda Tangan: {signerName}</span>
        </div>
        {saved ? (
          <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Tersimpan</span>
          </span>
        ) : (
          <span className="text-xs font-medium text-[#475569]">
            Gunakan jari atau tetikus
          </span>
        )}
      </div>

      <div className="relative border-2 border-dashed border-[#CBD5E1] rounded-lg bg-[#FFFFFF] overflow-hidden touch-none h-28">
        <canvas
          ref={canvasRef}
          aria-label={`Kanvas tanda tangan untuk ${signerName}`}
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#475569] text-xs font-serif italic">
            Goreskan tanda tangan Anda di area ini
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={clearCanvas}
          className="min-h-[44px] px-3 py-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-xs font-bold text-[#1E293B] flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#475569]" />
          <span>Ulangi</span>
        </button>

        {saved ? (
          <button
            type="button"
            onClick={handleUnlock}
            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[#0F766E] text-xs text-[#0F766E] hover:bg-[#F0FDFA] font-bold cursor-pointer"
          >
            Ubah Tanda Tangan
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasDrawn}
            className="min-h-[44px] px-4 py-2 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-[#FFFFFF] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Kunci Tanda Tangan</span>
          </button>
        )}
      </div>
    </div>
  );
};
