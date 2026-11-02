"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Pen, RotateCcw, Check, RefreshCw } from "lucide-react";

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

  const initContextStyles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#0F766E";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  // Synchronize canvas dimensions and load initial signature if provided
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parentWidth =
      canvas.parentElement?.clientWidth || canvas.offsetWidth || 360;
    const parentHeight =
      canvas.parentElement?.clientHeight || canvas.offsetHeight || 180;

    canvas.width = parentWidth;
    canvas.height = parentHeight;

    initContextStyles(ctx);

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        initContextStyles(ctx);
      };
      img.src = initialSignature;
      setSaved(true);
      setHasDrawn(true);
    }
  }, [initialSignature, initContextStyles]);

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

    initContextStyles(ctx);
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

  // Full reset allowing user to re-sign immediately
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initContextStyles(ctx);
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

  const handleUnlockAndReset = () => {
    clearCanvas();
  };

  return (
    <div className="bg-[#F8FAF7] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 space-y-3.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E293B]">
          <Pen className="w-4 h-4 text-[#0F766E]" />
          <span>Tanda Tangan: {signerName}</span>
        </div>
        {saved ? (
          <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
            <Check className="w-3.5 h-3.5" />
            <span>Tersimpan &amp; Terkunci</span>
          </span>
        ) : (
          <span className="text-xs font-medium text-[#475569]">
            Gunakan jari atau tetikus di dalam kotak
          </span>
        )}
      </div>

      {/* Canvas container: increased mobile height from h-28 to h-44 sm:h-52 */}
      <div className="relative border-2 border-dashed border-[#94A3B8] rounded-xl bg-[#FFFFFF] overflow-hidden touch-none h-44 sm:h-52 shadow-xs">
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
          className="w-full h-full cursor-crosshair touch-none block"
        />
        {!hasDrawn && !saved && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#64748B] text-xs sm:text-sm font-serif italic px-4 text-center">
            Bubuhkan tanda tangan Anda di area kanvas ini
          </div>
        )}
        {saved && (
          <div className="absolute top-2 right-2 pointer-events-none px-2 py-0.5 rounded bg-[#F8FAF7]/90 border border-[#CBD5E1] text-[11px] font-mono font-semibold text-[#0F766E]">
            Tanda Tangan Terkunci
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
        {saved ? (
          <button
            type="button"
            onClick={handleUnlockAndReset}
            className="min-h-[46px] px-4 py-2.5 rounded-lg border-2 border-[#0F766E] bg-[#FFFFFF] hover:bg-[#F0FDFA] text-xs sm:text-sm font-bold text-[#0F766E] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#0F766E]" />
            <span>Ulangi / Ambil Ulang Tanda Tangan</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={clearCanvas}
            disabled={!hasDrawn}
            className="min-h-[46px] px-4 py-2.5 rounded-lg border-2 border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] disabled:opacity-40 text-xs sm:text-sm font-bold text-[#1E293B] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#475569]" />
            <span>Bersihkan / Ulangi</span>
          </button>
        )}

        {!saved && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasDrawn}
            className="min-h-[46px] px-5 py-2.5 bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Kunci Tanda Tangan</span>
          </button>
        )}
      </div>
    </div>
  );
};
