export default function Home({ setPage, darkMode, setDarkMode, expenses }) {
  const today = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const todayTotal = today.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "0 0 100px", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--accent)", letterSpacing: -1 }}>RichLeaf</h1>
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 2, fontWeight: 600 }}>track it. control it.</p>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="clay-btn"
          style={{ background: "var(--card)", border: "2px solid var(--border)", borderRadius: 50, width: 48, height: 48, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Today Card */}
      <div className="clay-card" style={{ margin: "8px 24px 28px", padding: "28px 24px", background: "var(--accent)", border: "2px solid #15803d", boxShadow: "6px 6px 0px #15803d, 0 8px 32px rgba(74,222,128,0.2)" }}>
        <p style={{ color: "rgba(0,0,0,0.5)", fontSize: 13, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>TODAY'S SPENDING</p>
        <p style={{ fontSize: 48, fontWeight: 900, color: "#0d1f0d", letterSpacing: -2, lineHeight: 1 }}>
          ₹{todayTotal.toLocaleString()}
        </p>
        <p style={{ color: "rgba(0,0,0,0.4)", fontSize: 13, marginTop: 10, fontWeight: 700 }}>
          {today.length} transaction{today.length !== 1 ? "s" : ""} today
        </p>
      </div>

      {/* Main Buttons */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Record */}
        <button onClick={() => setPage("record")} className="clay-btn-accent"
          style={{ width: "100%", padding: "20px 24px", background: "var(--accent)", border: "2px solid #0a7330", borderRadius: 22, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 36, background: "rgba(0,0,0,0.12)", borderRadius: 16, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📝</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 19, fontWeight: 900, color: "#0d1f0d", margin: 0 }}>Record Expense</p>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "3px 0 0", fontWeight: 600 }}>snap or enter manually</p>
          </div>
        </button>

        {/* Report */}
        <button onClick={() => setPage("report")} className="clay-btn"
          style={{ width: "100%", padding: "20px 24px", background: "var(--card)", borderRadius: 22, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 36, background: "var(--bg2)", borderRadius: 16, width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📊</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 19, fontWeight: 900, color: "var(--text)", margin: 0 }}>My Report</p>
            <p style={{ fontSize: 13, color: "var(--text3)", margin: "3px 0 0", fontWeight: 600 }}>daily · weekly · monthly · yearly</p>
          </div>
        </button>

      </div>

      {/* Recent */}
      {expenses.length > 0 && (
        <div style={{ padding: "28px 24px 0" }}>
          <p style={{ color: "var(--text2)", fontSize: 15, fontWeight: 800, marginBottom: 14, letterSpacing: -0.5 }}>Recent</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {expenses.slice(0, 3).map(e => (
              <div key={e.id} className="clay-card-sm"
                style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28, background: "var(--bg2)", borderRadius: 12, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid var(--border)" }}>{e.category.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{e.category.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{e.note || "No note"}</p>
                  </div>
                </div>
                <p style={{ color: "var(--accent)", fontWeight: 900, fontSize: 17, margin: 0 }}>₹{e.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Button */}
      <button onClick={() => setPage("profile")} className="clay-btn"
        style={{ position: "fixed", bottom: 28, right: 24, width: 58, height: 58, borderRadius: 50, background: "var(--card)", fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
        👤
      </button>

    </div>
  );
}