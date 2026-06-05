export default function Profile({ setPage, darkMode, setDarkMode, expenses, user, handleGoogleLogin, handleLogout, syncing }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: "100vh", padding: "52px 24px 40px", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 16, padding: 0, marginBottom: 28, textAlign: "left", fontWeight: 800, fontFamily: "Nunito" }}>← Back</button>

      {/* Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        {user?.photoURL ? (
          <img src={user.photoURL} alt="avatar" style={{ width: 90, height: 90, borderRadius: 50, marginBottom: 14, border: "3px solid var(--accent)", boxShadow: "5px 5px 0 #15803d" }} />
        ) : (
          <div style={{ width: 90, height: 90, borderRadius: 50, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, marginBottom: 14, border: "3px solid #15803d", boxShadow: "5px 5px 0 #15803d" }}>🌿</div>
        )}
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: -0.5 }}>{user?.displayName || "RichLeaf User"}</h2>
        <p style={{ color: "var(--text3)", fontSize: 14, marginTop: 4, fontWeight: 600 }}>{user?.email || "Not signed in"}</p>
        {syncing && <p style={{ color: "var(--accent)", fontSize: 13, marginTop: 8, fontWeight: 700 }}>🔄 Syncing...</p>}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}` },
          { label: "This Month", value: `₹${thisMonth.toLocaleString()}` },
          { label: "Transactions", value: expenses.length },
          { label: "Avg/Day", value: `₹${expenses.length > 0 ? Math.round(totalSpent / Math.max(1, Math.ceil((new Date() - new Date(expenses[expenses.length - 1]?.date)) / 86400000) + 1)).toLocaleString() : 0}` }
        ].map(s => (
          <div key={s.label} className="clay-card-sm" style={{ padding: 18 }}>
            <p style={{ color: "var(--text3)", fontSize: 12, margin: "0 0 6px", fontWeight: 700 }}>{s.label}</p>
            <p style={{ color: "var(--accent)", fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="clay-card" style={{ marginBottom: 16, overflow: "hidden" }}>
        <p style={{ color: "var(--text3)", fontSize: 11, fontWeight: 800, padding: "14px 20px 6px", letterSpacing: 2 }}>SETTINGS</p>

        {/* Dark Mode */}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, background: "var(--bg2)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)" }}>{darkMode ? "🌙" : "☀️"}</span>
            <p style={{ margin: 0, color: "var(--text)", fontWeight: 800 }}>{darkMode ? "Dark Mode" : "Light Mode"}</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ width: 54, height: 30, borderRadius: 50, border: "2px solid var(--border)", background: darkMode ? "var(--accent)" : "var(--bg3)", position: "relative", cursor: "pointer", boxShadow: "3px 3px 0 var(--border)" }}>
            <div style={{ width: 22, height: 22, borderRadius: 50, background: "#fff", position: "absolute", top: 2, left: darkMode ? 28 : 2, transition: "all 0.25s", boxShadow: "1px 1px 3px rgba(0,0,0,0.3)" }} />
          </button>
        </div>

        {/* Storage */}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, background: "var(--bg2)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)" }}>💾</span>
            <div>
              <p style={{ margin: 0, color: "var(--text)", fontWeight: 800, fontSize: 15 }}>Local Storage</p>
              <p style={{ margin: 0, color: "var(--text3)", fontSize: 12, fontWeight: 600 }}>offline data on this device</p>
            </div>
          </div>
          <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 900, padding: "5px 12px", borderRadius: 20, border: "2px solid #86efac", boxShadow: "2px 2px 0 #86efac" }}>ACTIVE</span>
        </div>

        {/* Google Sync */}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22, background: "var(--bg2)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)" }}>☁️</span>
            <div>
              <p style={{ margin: 0, color: "var(--text)", fontWeight: 800, fontSize: 15 }}>Google Sync</p>
              <p style={{ margin: 0, color: "var(--text3)", fontSize: 12, fontWeight: 600 }}>{user ? "synced to your account" : "sign in to enable"}</p>
            </div>
          </div>
          <span style={{ background: user ? "#dcfce7" : "var(--bg2)", color: user ? "#16a34a" : "var(--text3)", fontSize: 11, fontWeight: 900, padding: "5px 12px", borderRadius: 20, border: `2px solid ${user ? "#86efac" : "var(--border)"}`, boxShadow: `2px 2px 0 ${user ? "#86efac" : "var(--border)"}` }}>
            {user ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      {/* Login / Logout */}
      {!user ? (
        <button onClick={handleGoogleLogin} className="clay-btn-accent"
          style={{ width: "100%", padding: 18, background: "var(--accent)", border: "2px solid #15803d", borderRadius: 20, fontSize: 16, fontWeight: 900, color: "#0d1f0d", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          🔐 Sign in with Google
        </button>
      ) : (
        <button onClick={handleLogout}
          style={{ width: "100%", padding: 18, background: "transparent", border: "2px solid var(--danger)", borderRadius: 20, fontSize: 16, fontWeight: 900, color: "var(--danger)", marginBottom: 16, boxShadow: "4px 4px 0 var(--danger)", fontFamily: "Nunito" }}>
          Sign Out
        </button>
      )}

      <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 16 }}>
        <p style={{ color: "var(--accent)", fontSize: 20, marginBottom: 4, fontWeight: 900 }}>🌿 RichLeaf</p>
        <p style={{ color: "var(--text3)", fontSize: 13, fontWeight: 600 }}>track it. control it.</p>
        <p style={{ color: "var(--text3)", fontSize: 12, marginTop: 6, fontWeight: 600 }}>v1.0.0</p>
      </div>
    </div>
  );
}