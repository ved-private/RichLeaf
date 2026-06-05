import { useState, useEffect, useRef } from "react";
const tabs = ["Daily", "Weekly", "Monthly", "Yearly"];
function PieChart({ data, total }) {
  const canvasRef = useRef();
  const colors = ["#ff0000","#ff8c00","#fffb00","#00ff04","#00eeff","#002fff","#aa00ff","#ff00aa","#ffffff"];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    const cx = 110, cy = 110, r = 90;
    ctx.clearRect(0, 0, 220, 220);
    let start = -Math.PI / 2;
    data.forEach((d, i) => {
      const slice = (d.total / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = "#0d1f0d";
      ctx.lineWidth = 3;
      ctx.stroke();
      // % label on slice
      const midAngle = start + slice / 2;
      const lx = cx + Math.cos(midAngle) * 65;
      const ly = cy + Math.sin(midAngle) * 65;
      const pct = Math.round((d.total / total) * 100);
      if (pct > 5) {
        ctx.fillStyle = "#0d1f0d";
        ctx.font = "bold 11px Nunito, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${pct}%`, lx, ly);
      }
      start += slice;
    });
    // Center hole
    ctx.beginPath();
    ctx.arc(cx, cy, 48, 0, 2 * Math.PI);
    ctx.fillStyle = "var(--bg)";
    ctx.fill();
    // Center text
    ctx.fillStyle = "var(--accent)";
    ctx.font = "bold 13px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TOTAL", cx, cy - 8);
    ctx.font = "bold 11px Nunito, sans-serif";
    ctx.fillStyle = "#4ade80";
    ctx.fillText(`₹${total.toLocaleString()}`, cx, cy + 8);
  }, [data, total]);
  return <canvas ref={canvasRef} width={220} height={220} style={{ display: "block", margin: "0 auto" }} />;
}
export default function Report({ setPage, expenses, deleteExpense, categories }) {
  const [tab, setTab] = useState("Daily");
  const [showDelete, setShowDelete] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const now = new Date();
  const filtered = expenses.filter(e => {
    const d = new Date(e.date);
    if (tab === "Daily") return d.toDateString() === now.toDateString();
    if (tab === "Weekly") { const w = new Date(); w.setDate(now.getDate() - 7); return d >= w; }
    if (tab === "Monthly") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (tab === "Yearly") return d.getFullYear() === now.getFullYear();
    return true;
  });
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  const onlineTotal = filtered.filter(e => e.paymentMode === "online").reduce((s, e) => s + e.amount, 0);
  const offlineTotal = filtered.filter(e => e.paymentMode !== "online").reduce((s, e) => s + e.amount, 0);
  const byCategory = filtered.reduce((acc, e) => {
    const key = e.category.label;
    if (!acc[key]) acc[key] = { ...e.category, total: 0, count: 0 };
    acc[key].total += e.amount;
    acc[key].count += 1;
    return acc;
  }, {});
  const catData = Object.values(byCategory).sort((a, b) => b.total - a.total);
  const colors = ["#ff0000","#ff9900","#ffee00","#04ff00","#00eeff","#0008ff","#9500ff","#ff00b7","#ffffff"];
  const downloadPDF = async () => {
    setDownloading(true);
    try {
      // Load jsPDF if not already loaded
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = res;
          script.onerror = rej;
          document.head.appendChild(script);
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210;
      const margin = 18;
      let y = 0;
      const addPage = () => { doc.addPage(); y = 20; };
      const checkY = (needed = 12) => { if (y + needed > 275) addPage(); };
      const rupee = (n) => `Rs. ${Number(n).toLocaleString("en-IN")}`;
      const stripEmoji = (str) => str.replace(/\p{Emoji}/gu, "").trim() || str;
      const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      // ── HEADER ────────────────────────────────────────────
      doc.setFillColor(20, 83, 45);
doc.roundedRect(0, 0, W, 36, 0, 0, "F");
doc.setFillColor(74, 222, 128);
doc.rect(0, 33, W, 3, "F");
      // Leaf logo — green circle with leaf emoji
doc.setFillColor(74, 222, 128);
doc.circle(margin + 6, 17, 7, "F");
doc.setFillColor(20, 83, 45);
doc.circle(margin + 6, 17, 5.5, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(8);
doc.setTextColor(74, 222, 128);
doc.text("RL", margin + 3.3, 19);
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.setTextColor(74, 222, 128);
doc.text("RichLeaf", margin + 16, 18);

doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.setTextColor(167, 243, 208);
doc.text("track it. control it.", margin + 16, 25);

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(255, 255, 255);
doc.text(`${tab.toUpperCase()} REPORT`, W - margin, 16, { align: "right" });
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.setTextColor(167, 243, 208);
doc.text(dateStr, W - margin, 23, { align: "right" });

y = 41;

      y = 55;

      // ── TOTAL CARD ────────────────────────────────────────
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y, W - margin * 2, 30, 4, 4, "F");
      doc.setDrawColor(134, 239, 172);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y, W - margin * 2, 30, 4, 4, "S");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 150, 100);
      doc.text(`${tab.toUpperCase()} TOTAL SPENDING`, margin + 10, y + 9);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(20, 83, 45);
      doc.text(rupee(total), margin + 10, y + 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 150, 100);
      doc.text(`${filtered.length} transaction${filtered.length !== 1 ? "s" : ""}`, W - margin - 10, y + 20, { align: "right" });

y += 30;
      // ── PAYMENT METHOD ────────────────────────────────────
      if (filtered.length > 0) {
        checkY(22);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(20, 83, 45);
        doc.text("Payment Methods", margin, y);
        y += 7;;

        const halfW = (W - margin * 2 - 8) / 2;

        // Online card
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, y, halfW, 16, 3, 3, "F");
        doc.setDrawColor(134, 239, 172);
        doc.roundedRect(margin, y, halfW, 16, 3, 3, "S");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(80, 120, 80);
        doc.text("Online", margin + 4, y + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 83, 45);
        doc.text(rupee(onlineTotal), margin + 4, y + 13);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 150, 100);
        doc.text(`${total > 0 ? Math.round((onlineTotal / total) * 100) : 0}%`, margin + halfW - 8, y + 13, { align: "right" });

        // Cash card
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin + halfW + 8, y, halfW, 16, 3, 3, "F");
        doc.setDrawColor(134, 239, 172);
        doc.roundedRect(margin + halfW + 8, y, halfW, 16, 3, 3, "S");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(80, 120, 80);
        doc.text("Cash", margin + halfW + 12, y + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 83, 45);
        doc.text(rupee(offlineTotal), margin + halfW + 12, y + 13);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 150, 100);
        doc.text(`${total > 0 ? Math.round((offlineTotal / total) * 100) : 0}%`, margin + halfW * 2 + 4, y + 13, { align: "right" });

y += 20;      }

      // ── PIE CHART ─────────────────────────────────────────
      const canvas = document.querySelector("canvas");
      if (canvas && catData.length > 0) {
        checkY(70);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(20, 83, 45);
        doc.text("Spending Breakdown", margin, y);
        y += 6;
        const chartImg = canvas.toDataURL("image/png");
doc.addImage(chartImg, "PNG", margin, y, 70, 70);
// Legend next to chart
let ly = y + 8;
catData.forEach((c, i) => {
  if (i > 5) return;
  const pct = Math.round((c.total / total) * 100);
  const col = colors[i % colors.length];
  const rgb = col === "#4ade80" ? [74,222,128] : col === "#22c55e" ? [34,197,94] : col === "#86efac" ? [134,239,172] : col === "#bbf7d0" ? [187,247,208] : col === "#166534" ? [22,101,52] : col === "#15803d" ? [21,128,61] : [22,163,74];
  doc.setFillColor(...rgb);
doc.circle(margin + 76, ly + 2, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 50, 30);
doc.text(`${c.label.replace(/\p{Emoji}/gu, "").trim()} ${pct}%`, margin + 82, ly + 3.5);
  ly += 10;
});
y += 70;      }

      // ── CATEGORY BREAKDOWN ────────────────────────────────
      if (catData.length > 0) {
        checkY(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(20, 83, 45);
        doc.text("Category Breakdown", margin, y);
        y += 7;;

        // Header row
        doc.setFillColor(20, 83, 45);
        doc.roundedRect(margin, y, W - margin * 2, 8, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("Category", margin + 4, y + 5.5);
        doc.text("Expenses", margin + 75, y + 5.5);
        doc.text("%", margin + 115, y + 5.5);
        doc.text("Amount", W - margin - 4, y + 5.5, { align: "right" });
        y += 7;;

        catData.forEach((cat, i) => {
          checkY(9);
          doc.setFillColor(...(i % 2 === 0 ? [240, 253, 244] : [255, 255, 255]));
          doc.rect(margin, y, W - margin * 2, 8, "F");

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(30, 50, 30);
          doc.text(stripEmoji(cat.label), margin + 4, y + 5.5);

          doc.setTextColor(80, 120, 80);
          doc.text(`${cat.count}`, margin + 75, y + 5.5);

          doc.setTextColor(100, 150, 100);
          doc.text(`${Math.round((cat.total / total) * 100)}%`, margin + 115, y + 5.5);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(20, 83, 45);
          doc.text(rupee(cat.total), W - margin - 4, y + 5.5, { align: "right" });

          y += 7;;
        });

        doc.setDrawColor(134, 239, 172);
        doc.setLineWidth(0.5);
        doc.line(margin, y, W - margin, y);
        y += 12;
      }

      // ── ALL TRANSACTIONS ──────────────────────────────────
      if (filtered.length > 0) {
        checkY(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(20, 83, 45);
        doc.text("All Transactions", margin, y);
        y += 7;;

        // Header row
        doc.setFillColor(20, 83, 45);
        doc.roundedRect(margin, y, W - margin * 2, 8, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("Date", margin + 4, y + 5.5);
        doc.text("Category", margin + 32, y + 5.5);
        doc.text("Mode", margin + 80, y + 5.5);
        doc.text("Note", margin + 100, y + 5.5);
        doc.text("Amount", W - margin - 4, y + 5.5, { align: "right" });
        y += 7;;

        filtered.forEach((e, i) => {
          checkY(9);
          doc.setFillColor(...(i % 2 === 0 ? [240, 253, 244] : [255, 255, 255]));
          doc.rect(margin, y, W - margin * 2, 8, "F");

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(80, 100, 80);
          doc.text(new Date(e.date).toLocaleDateString("en-IN"), margin + 4, y + 5.5);

          doc.setTextColor(30, 50, 30);
          doc.text(stripEmoji(e.category.label), margin + 32, y + 5.5);

          doc.setTextColor(80, 120, 80);
          doc.text(e.paymentMode === "online" ? "Online" : "Cash", margin + 80, y + 5.5);

          doc.setTextColor(100, 130, 100);
          const noteText = e.note ? (e.note.length > 18 ? e.note.substring(0, 18) + "..." : e.note) : "-";
          doc.text(noteText, margin + 100, y + 5.5);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(20, 83, 45);
          doc.text(rupee(e.amount), W - margin - 4, y + 5.5, { align: "right" });

          y += 7;;
        });

        doc.setDrawColor(134, 239, 172);
        doc.setLineWidth(0.5);
        doc.line(margin, y, W - margin, y);
        y += 12;
      }

      // ── EMPTY STATE ───────────────────────────────────────
      if (filtered.length === 0) {
        checkY(20);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.setTextColor(150, 180, 150);
        doc.text(`No expenses recorded for this ${tab.toLowerCase()} period.`, W / 2, y + 10, { align: "center" });
      }

      // ── FOOTER (every page) ───────────────────────────────
      const pageCount = doc.internal.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);

        doc.setFillColor(20, 83, 45);
        doc.rect(0, 284, W, 13, "F");
        doc.setFillColor(74, 222, 128);
        doc.rect(0, 284, W, 1.5, "F");

        // Small logo icon in footer
        doc.setFillColor(74, 222, 128);
        doc.circle(margin + 4, 290.5, 4, "F");
        doc.setFillColor(20, 83, 45);
        doc.circle(margin + 4, 290.5, 2.8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(4.5);
        doc.setTextColor(74, 222, 128);
        doc.text("Rs", margin + 2.2, 291.7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(74, 222, 128);
        doc.text("RichLeaf", margin + 10, 291.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(167, 243, 208);
        doc.text("track it. control it.", margin + 10, 295);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(167, 243, 208);
        doc.text(`Page ${p} of ${pageCount}`, W - margin, 292, { align: "right" });
      }

      const filename = `RichLeaf-${tab}-Report-${now.toLocaleDateString("en-IN").replace(/\//g, "-")}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again.");
    }
    setDownloading(false);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "52px 24px 40px", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 16, padding: 0, fontWeight: 800, fontFamily: "Nunito" }}>← Back</button>
        <button onClick={downloadPDF} disabled={downloading} className="clay-btn-accent"
          style={{ padding: "10px 18px", background: "var(--accent)", border: "2px solid #15803d", borderRadius: 14, fontSize: 13, fontWeight: 900, color: "#0d1f0d", opacity: downloading ? 0.7 : 1, fontFamily: "Nunito" }}>
          {downloading ? "⏳ Generating..." : "📄 PDF"}
        </button>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", marginBottom: 22, letterSpacing: -1 }}>My Report</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, background: "var(--card)", borderRadius: 18, padding: 5, border: "2px solid var(--border)", boxShadow: "4px 4px 0 var(--border)" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "10px 0", borderRadius: 13, border: t === tab ? "2px solid #15803d" : "2px solid transparent", background: t === tab ? "var(--accent)" : "transparent", color: t === tab ? "#0d1f0d" : "var(--text3)", fontWeight: 900, fontSize: 13, boxShadow: t === tab ? "3px 3px 0 #15803d" : "none", transition: "all 0.15s", fontFamily: "Nunito" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="clay-card" style={{ padding: 24, marginBottom: 16, background: "var(--accent)", border: "2px solid #15803d", boxShadow: "6px 6px 0 #15803d" }}>
        <p style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, margin: 0, fontWeight: 700, letterSpacing: 1 }}>{tab.toUpperCase()} SPENDING</p>
        <p style={{ color: "#0d1f0d", fontSize: 44, fontWeight: 900, margin: "6px 0 4px", letterSpacing: -2 }}>₹{total.toLocaleString()}</p>
        <p style={{ color: "rgba(0,0,0,0.4)", fontSize: 13, margin: 0, fontWeight: 700 }}>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Online vs Cash */}
      {filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          {[
            { icon: "📱", label: "Online", value: onlineTotal, pct: total > 0 ? Math.round((onlineTotal / total) * 100) : 0 },
            { icon: "💵", label: "Cash", value: offlineTotal, pct: total > 0 ? Math.round((offlineTotal / total) * 100) : 0 },
          ].map(p => (
            <div key={p.label} className="clay-card-sm" style={{ padding: 16, textAlign: "center" }}>
              <p style={{ fontSize: 26, margin: "0 0 6px" }}>{p.icon}</p>
              <p style={{ color: "var(--text3)", fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>{p.label}</p>
              <p style={{ color: "var(--accent)", fontWeight: 900, fontSize: 18, margin: "0 0 2px" }}>₹{p.value.toLocaleString()}</p>
              <p style={{ color: "var(--text3)", fontSize: 12, fontWeight: 700, margin: 0 }}>{p.pct}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Pie Chart */}
      {catData.length > 0 && (
        <div className="clay-card" style={{ padding: 20, marginBottom: 22 }}>
          <p style={{ color: "var(--text2)", fontSize: 15, fontWeight: 900, marginBottom: 16, letterSpacing: -0.5 }}>Spending Breakdown</p>
          <PieChart data={catData} total={total} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {catData.map((c, i) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 50, background: colors[i % colors.length], flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>{c.icon} {c.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {catData.length > 0 && (
        <>
          <p style={{ color: "var(--text2)", fontSize: 15, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5 }}>By Category</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {catData.map((cat, i) => (
              <div key={cat.label} className="clay-card-sm" style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 26, background: "var(--bg2)", borderRadius: 12, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)", flexShrink: 0 }}>{cat.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: "var(--text)", fontSize: 15 }}>{cat.label}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{cat.count} expense{cat.count > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "var(--accent)", fontWeight: 900, fontSize: 17, margin: 0 }}>₹{cat.total.toLocaleString()}</p>
                    <p style={{ color: "var(--text3)", fontSize: 12, margin: 0, fontWeight: 700 }}>{Math.round((cat.total / total) * 100)}%</p>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--bg3)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.round((cat.total / total) * 100)}%`, background: colors[i % colors.length], borderRadius: 6, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All Transactions */}
      {filtered.length > 0 && (
        <>
          <p style={{ color: "var(--text2)", fontSize: 15, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5 }}>All Transactions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(e => (
              <div key={e.id} className="clay-card-sm" style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22, background: "var(--bg2)", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)", flexShrink: 0 }}>{e.category.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{e.category.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>
                      {e.paymentMode === "online" ? "📱" : "💵"} {e.note || "No note"} · {new Date(e.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ color: "var(--accent)", fontWeight: 900, fontSize: 16, margin: 0 }}>₹{e.amount.toLocaleString()}</p>
                  <button onClick={() => setShowDelete(e.id)} style={{ background: "none", border: "none", fontSize: 16, padding: 4, color: "var(--text3)" }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Empty */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <p style={{ fontSize: 52, marginBottom: 16 }}>🌿</p>
          <p style={{ color: "var(--text3)", fontSize: 16, fontWeight: 700 }}>No expenses {tab.toLowerCase()}</p>
        </div>
      )}
      {/* Delete Modal */}
      {showDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
          <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", background: "var(--card)", borderRadius: "28px 28px 0 0", padding: 28, border: "2px solid var(--border)", borderBottom: "none" }}>
            <h3 style={{ color: "var(--text)", marginBottom: 8, fontWeight: 900, fontSize: 20 }}>Delete Expense?</h3>
            <p style={{ color: "var(--text3)", marginBottom: 24, fontWeight: 600 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDelete(null)} className="clay-btn"
                style={{ flex: 1, padding: 16, borderRadius: 16, background: "var(--bg2)", color: "var(--text3)", fontSize: 15, fontWeight: 800, fontFamily: "Nunito" }}>Cancel</button>
              <button onClick={() => { deleteExpense(showDelete); setShowDelete(null); }}
                style={{ flex: 1, padding: 16, borderRadius: 16, border: "2px solid #c62828", background: "var(--danger)", color: "#fff", fontSize: 15, fontWeight: 900, boxShadow: "4px 4px 0 #c62828", fontFamily: "Nunito" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}