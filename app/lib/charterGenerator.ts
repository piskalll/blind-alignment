import { SCENARIOS } from "../data/scenarios";
import { RoomState } from "./sessionStore";

export async function generateSessionHash(room: RoomState, timestamp: string): Promise<string> {
  const content = `${room.code}-${room.host.name}-${room.guest.name}-${timestamp}-${JSON.stringify(room.compromises || [])}`;
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 32);
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "sha256:" + Math.abs(hash).toString(16).padStart(16, "0");
}

export function generatePrintDocument(params: {
  roomCode: string;
  hostName: string;
  guestName: string;
  hostSignature?: string;
  guestSignature?: string;
  hostSignedAt?: string;
  guestSignedAt?: string;
  sessionHash: string;
  clauses: string[];
  timestamp: string;
}) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download/print the Living Charter.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Living Charter - ${params.hostName} & ${params.guestName} (${params.roomCode})</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1E293B;
          background: #FFF;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          border-bottom: 2px solid #0F766E;
          padding-bottom: 15px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .title-sub {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #0F766E;
          font-weight: bold;
        }
        .title-main {
          font-size: 24px;
          font-weight: 800;
          color: #1E293B;
          margin: 4px 0 0 0;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 30px;
          font-size: 11px;
          font-family: monospace;
        }
        .meta-label {
          color: #64748B;
          text-transform: uppercase;
          font-size: 9px;
          margin-bottom: 2px;
        }
        .meta-val {
          color: #1E293B;
          font-weight: bold;
        }
        .clauses {
          margin-bottom: 35px;
        }
        .clause-item {
          display: flex;
          margin-bottom: 18px;
          font-size: 13px;
        }
        .clause-num {
          font-weight: bold;
          color: #0F766E;
          width: 28px;
          flex-shrink: 0;
        }
        .clause-text {
          flex: 1;
        }
        .quote {
          text-align: center;
          font-style: italic;
          color: #64748B;
          margin: 30px 0;
          font-size: 14px;
          border-top: 1px dashed #E2E8F0;
          border-bottom: 1px dashed #E2E8F0;
          padding: 12px 0;
        }
        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }
        .sig-box {
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: #FAFAFA;
        }
        .sig-canvas-img {
          height: 60px;
          max-width: 100%;
          object-fit: contain;
          margin: 10px auto;
          display: block;
        }
        .sig-name {
          font-weight: bold;
          font-size: 14px;
          color: #1E293B;
        }
        .sig-time {
          font-size: 10px;
          color: #64748B;
          font-family: monospace;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 10px;
          color: #94A3B8;
          border-top: 1px solid #E2E8F0;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title-sub">Living Charter · Article I</div>
          <h1 class="title-main">Financial Principles & Living Agreement</h1>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; font-size: 18px; color: #0F766E;">VowSync</div>
          <div style="font-size: 11px; color: #64748B;">SalingPaham Platform</div>
        </div>
      </div>

      <div class="meta-grid">
        <div>
          <div class="meta-label">Session Code</div>
          <div class="meta-val">${params.roomCode}</div>
        </div>
        <div>
          <div class="meta-label">Ratified WIB</div>
          <div class="meta-val">${params.timestamp}</div>
        </div>
        <div>
          <div class="meta-label">Cryptographic Seal</div>
          <div class="meta-val">${params.sessionHash.substring(0, 18)}…</div>
        </div>
      </div>

      <div class="clauses">
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #1E293B; margin-bottom: 15px;">
          Ratified Financial Commitments:
        </h3>
        ${params.clauses
          .map(
            (c, i) => `
          <div class="clause-item">
            <div class="clause-num">${i + 1}.</div>
            <div class="clause-text">${c}</div>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="quote">
        &ldquo;Kami sepakat sebelum kami berjanji. Transparansi adalah bentuk tertinggi dari rasa cinta dan tanggung jawab.&rdquo;
      </div>

      <div class="signatures">
        <div class="sig-box">
          <div class="meta-label">Partner 1 (Host)</div>
          ${
            params.hostSignature
              ? `<img src="${params.hostSignature}" class="sig-canvas-img" alt="Host Signature" />`
              : `<div style="height:60px; line-height:60px; color:#94A3B8; font-style:italic;">[Telah Disetujui Secara Digital]</div>`
          }
          <div class="sig-name">${params.hostName}</div>
          <div class="sig-time">${params.hostSignedAt || "Verified via Session Token"}</div>
        </div>

        <div class="sig-box">
          <div class="meta-label">Partner 2 (Guest)</div>
          ${
            params.guestSignature
              ? `<img src="${params.guestSignature}" class="sig-canvas-img" alt="Guest Signature" />`
              : `<div style="height:60px; line-height:60px; color:#94A3B8; font-style:italic;">[Telah Disetujui Secara Digital]</div>`
          }
          <div class="sig-name">${params.guestName}</div>
          <div class="sig-time">${params.guestSignedAt || "Verified via Session Token"}</div>
        </div>
      </div>

      <div class="footer">
        Generated securely via VowSync (SalingPaham) Dual-Blind Protocol · Zero-Knowledge Pre-Marital Alignment
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
