import { useState, useRef } from "react";

export default function Record({ setPage, addExpense, categories, addCategory }) {
  const [step, setStep] = useState("main");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("✨");
  const inputRef = useRef();

  const handleSnap = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setStep("category");
  };

  const handleSave = () => {
    if (!amount || !selectedCategory) return;
    addExpense({
      amount: Number(amount),
      category: selectedCategory,
      note,
      paymentMode,
      date: new Date().toISOString(),
      image: image || null,
    });
    setPage("home");
  };

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const newCat = { id: Date.now().toString(), icon: newCatIcon, label: newCatLabel.trim() };
    addCategory(newCat);
    setSelectedCategory(newCat);
    setShowAddCat(false);
    setNewCatLabel("");
  };

  const PaymentToggle = () => (
    <div style={{ marginBottom: 28 }}>
      <p style={{ color: "var(--text3)", marginBottom: 10, fontWeight: 700 }}>Payment Mode</p>
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { id: "online", icon: "📱", label: "Online" },
          { id: "offline", icon: "💵", label: "Cash" },
        ].map(m => (
          <button key={m.id} onClick={() => setPaymentMode(m.id)}
            className={paymentMode === m.id ? "clay-btn-accent" : "clay-btn"}
            style={{ flex: 1, padding: "14px 0", borderRadius: 16, border: `2px solid ${paymentMode === m.id ? "#15803d" : "var(--border)"}`, background: paymentMode === m.id ? "var(--accent)" : "var(--card)", color: paymentMode === m.id ? "#0d1f0d" : "var(--text)", fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Nunito" }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (step === "main") return (
    <div style={{ minHeight: "100vh", padding: "52px 24px 24px", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 16, marginBottom: 32, textAlign: "left", padding: 0, fontWeight: 800, fontFamily: "Nunito" }}>← Back</button>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", marginBottom: 6, letterSpacing: -1 }}>Record Expense</h2>
      <p style={{ color: "var(--text3)", marginBottom: 36, fontWeight: 600 }}>How do you want to add it?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button onClick={() => inputRef.current.click()} className="clay-btn-accent"
          style={{ padding: "22px 24px", background: "var(--accent)", border: "2px solid #15803d", borderRadius: 22, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 36, background: "rgba(0,0,0,0.12)", borderRadius: 16, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📸</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 19, fontWeight: 900, color: "#0d1f0d", margin: 0 }}>Snap a Photo</p>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "3px 0 0", fontWeight: 600 }}>take or pick from gallery</p>
          </div>
        </button>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handleSnap} style={{ display: "none" }} />
        <button onClick={() => setStep("category")} className="clay-btn"
          style={{ padding: "22px 24px", background: "var(--card)", borderRadius: 22, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 36, background: "var(--bg2)", borderRadius: 16, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✏️</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 19, fontWeight: 900, color: "var(--text)", margin: 0 }}>Enter Manually</p>
            <p style={{ fontSize: 13, color: "var(--text3)", margin: "3px 0 0", fontWeight: 600 }}>type category and amount</p>
          </div>
        </button>
      </div>
    </div>
  );

  if (step === "category") return (
    <div style={{ minHeight: "100vh", padding: "52px 24px 24px", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <button onClick={() => setStep("main")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 16, marginBottom: 24, textAlign: "left", padding: 0, fontWeight: 800, fontFamily: "Nunito" }}>← Back</button>
      {image && <img src={image} alt="snap" style={{ width: "100%", borderRadius: 22, maxHeight: 200, objectFit: "cover", marginBottom: 20, border: "2px solid var(--border)", boxShadow: "5px 5px 0 var(--border)" }} />}
      <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", marginBottom: 6, letterSpacing: -1 }}>Pick Category</h2>
      <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 24, fontWeight: 600 }}>Where did this money go?</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat)}
            className={selectedCategory?.id === cat.id ? "clay-btn-accent" : "clay-btn"}
            style={{ padding: "11px 18px", borderRadius: 50, border: `2px solid ${selectedCategory?.id === cat.id ? "#15803d" : "var(--border)"}`, background: selectedCategory?.id === cat.id ? "var(--accent)" : "var(--card)", color: selectedCategory?.id === cat.id ? "#0d1f0d" : "var(--text)", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, fontFamily: "Nunito" }}>
            {cat.icon} {cat.label}
          </button>
        ))}
        <button onClick={() => setShowAddCat(true)} className="clay-btn"
          style={{ padding: "11px 18px", borderRadius: 50, background: "var(--bg2)", color: "var(--text3)", fontSize: 14, fontWeight: 800, fontFamily: "Nunito" }}>
          ➕ Custom
        </button>
      </div>

      {showAddCat && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
          <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", background: "var(--card)", borderRadius: "28px 28px 0 0", padding: 28, border: "2px solid var(--border)", borderBottom: "none" }}>
            <h3 style={{ color: "var(--text)", marginBottom: 20, fontWeight: 900, fontSize: 20 }}>Add Custom Category</h3>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)}
                style={{ width: 64, padding: 12, fontSize: 26, textAlign: "center", background: "var(--bg2)", border: "2px solid var(--border)", borderRadius: 16, color: "var(--text)", boxShadow: "3px 3px 0 var(--border)" }} />
              <input value={newCatLabel} onChange={e => setNewCatLabel(e.target.value)}
                placeholder="Category name" style={{ flex: 1, padding: 14, fontSize: 16, background: "var(--bg2)", border: "2px solid var(--border)", borderRadius: 16, color: "var(--text)", outline: "none", fontWeight: 700, boxShadow: "3px 3px 0 var(--border)", fontFamily: "Nunito" }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAddCat(false)} className="clay-btn"
                style={{ flex: 1, padding: 16, borderRadius: 16, background: "var(--bg2)", color: "var(--text3)", fontSize: 15, fontWeight: 800, fontFamily: "Nunito" }}>Cancel</button>
              <button onClick={handleAddCategory} className="clay-btn-accent"
                style={{ flex: 1, padding: 16, borderRadius: 16, background: "var(--accent)", border: "2px solid #15803d", color: "#0d1f0d", fontSize: 15, fontWeight: 900, fontFamily: "Nunito" }}>Add ✅</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => { if (selectedCategory) setStep("amount"); }}
        className={selectedCategory ? "clay-btn-accent" : "clay-btn"}
        style={{ marginTop: "auto", width: "100%", padding: 18, background: selectedCategory ? "var(--accent)" : "var(--bg3)", border: `2px solid ${selectedCategory ? "#15803d" : "var(--border)"}`, borderRadius: 20, fontSize: 17, fontWeight: 900, color: selectedCategory ? "#0d1f0d" : "var(--text3)", fontFamily: "Nunito" }}>
        Next →
      </button>
    </div>
  );

  if (step === "amount") return (
    <div style={{ minHeight: "100vh", padding: "52px 24px 24px", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <button onClick={() => setStep("category")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 16, marginBottom: 32, textAlign: "left", padding: 0, fontWeight: 800, fontFamily: "Nunito" }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <span style={{ fontSize: 42, background: "var(--bg2)", borderRadius: 18, width: 68, height: 68, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)", boxShadow: "4px 4px 0 var(--border)", flexShrink: 0 }}>{selectedCategory.icon}</span>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", letterSpacing: -1 }}>{selectedCategory.label}</h2>
      </div>

      <PaymentToggle />

      <p style={{ color: "var(--text3)", marginBottom: 10, fontWeight: 700 }}>Amount (₹)</p>
      <input type="number" inputMode="numeric" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} autoFocus
        style={{ width: "100%", padding: "20px", fontSize: 52, fontWeight: 900, background: "var(--card)", border: "2px solid var(--accent)", borderRadius: 22, color: "var(--accent)", outline: "none", boxSizing: "border-box", marginBottom: 20, textAlign: "center", boxShadow: "5px 5px 0 #15803d", letterSpacing: -2, fontFamily: "Nunito" }} />

      <p style={{ color: "var(--text3)", marginBottom: 10, fontWeight: 700 }}>Note (optional)</p>
      <input type="text" placeholder="e.g. lunch at cafe" value={note} onChange={e => setNote(e.target.value)}
        style={{ width: "100%", padding: "16px", fontSize: 16, background: "var(--card)", border: "2px solid var(--border)", borderRadius: 18, color: "var(--text)", outline: "none", boxSizing: "border-box", marginBottom: 32, fontWeight: 700, boxShadow: "4px 4px 0 var(--border)", fontFamily: "Nunito" }} />

      <button onClick={() => { if (amount) setStep("confirm"); }}
        className={amount ? "clay-btn-accent" : "clay-btn"}
        style={{ width: "100%", padding: 18, background: amount ? "var(--accent)" : "var(--bg3)", border: `2px solid ${amount ? "#15803d" : "var(--border)"}`, borderRadius: 20, fontSize: 17, fontWeight: 900, color: amount ? "#0d1f0d" : "var(--text3)", fontFamily: "Nunito" }}>
        Next →
      </button>
    </div>
  );

  if (step === "confirm") return (
    <div style={{ minHeight: "100vh", padding: "52px 24px 24px", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <button onClick={() => setStep("amount")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 16, marginBottom: 28, textAlign: "left", padding: 0, fontWeight: 800, fontFamily: "Nunito" }}>← Back</button>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", marginBottom: 28, letterSpacing: -1 }}>Confirm ✅</h2>

      {image && <img src={image} alt="snap" style={{ width: "100%", borderRadius: 22, maxHeight: 200, objectFit: "cover", marginBottom: 20, border: "2px solid var(--border)", boxShadow: "5px 5px 0 var(--border)" }} />}

      <div className="clay-card" style={{ padding: 24, marginBottom: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { label: "Category", value: `${selectedCategory.icon} ${selectedCategory.label}` },
          { label: "Amount", value: `₹${Number(amount).toLocaleString()}`, big: true },
          { label: "Payment", value: paymentMode === "online" ? "📱 Online" : "💵 Cash" },
          { label: "Note", value: note || "—" },
          { label: "Date", value: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
        ].map((row, i, arr) => (
          <div key={row.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "var(--text3)", fontSize: 13, fontWeight: 700, margin: 0 }}>{row.label}</p>
              <p style={{ color: row.big ? "var(--accent)" : "var(--text)", fontWeight: row.big ? 900 : 700, fontSize: row.big ? 28 : 16, margin: 0 }}>{row.value}</p>
            </div>
            {i < arr.length - 1 && <div style={{ height: 1, background: "var(--border)", marginTop: 18 }} />}
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="clay-btn-accent"
        style={{ width: "100%", padding: 20, background: "var(--accent)", border: "2px solid #15803d", borderRadius: 22, fontSize: 18, fontWeight: 900, color: "#0d1f0d", fontFamily: "Nunito" }}>
        Save Expense 🌿
      </button>
    </div>
  );
}