import { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import Home from "./pages/Home";
import Record from "./pages/Record";
import Report from "./pages/Report";
import Profile from "./pages/Profile";

const defaultCategories = [
  { id: "food", icon: "🍔", label: "Food" },
  { id: "groceries", icon: "🛒", label: "Groceries" },
  { id: "bills", icon: "⚡", label: "Bills" },
  { id: "medical", icon: "💊", label: "Medical" },
  { id: "investment", icon: "📈", label: "Investment" },
  { id: "clothes", icon: "👗", label: "Clothes" },
  { id: "appliances", icon: "🔌", label: "Appliances" },
  { id: "transport", icon: "🚗", label: "Transport" },
  { id: "others", icon: "📦", label: "Others" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("rl_expenses");
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("rl_categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    getRedirectResult(auth).then(result => {
      if (result?.user) {
        setUser(result.user);
        syncFromFirebase(result.user);
      }
    });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await syncFromFirebase(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "" : "light";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("rl_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("rl_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const handleOnline = async () => {
      if (user) {
        setSyncing(true);
        await syncToFirebase(user, expenses, categories);
        setSyncing(false);
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [user, expenses, categories]);

  const syncFromFirebase = async (u) => {
    try {
      setSyncing(true);
      const q = query(collection(db, "expenses"), where("uid", "==", u.uid));
      const snap = await getDocs(q);
      const firebaseExpenses = snap.docs.map(d => ({ ...d.data(), firestoreId: d.id }));
      if (firebaseExpenses.length > 0) {
        setExpenses(firebaseExpenses);
        localStorage.setItem("rl_expenses", JSON.stringify(firebaseExpenses));
      }
      const catDoc = await getDoc(doc(db, "categories", u.uid));
      if (catDoc.exists()) {
        setCategories(catDoc.data().list);
        localStorage.setItem("rl_categories", JSON.stringify(catDoc.data().list));
      }
    } catch (e) { console.log("Sync failed, using local data"); }
    setSyncing(false);
  };

  const syncToFirebase = async (u, exp, cats) => {
    if (!u) return;
    try {
      for (const e of exp) {
        if (!e.firestoreId) {
          const ref = await addDoc(collection(db, "expenses"), { ...e, uid: u.uid });
          e.firestoreId = ref.id;
        }
      }
      await setDoc(doc(db, "categories", u.uid), { list: cats });
      setExpenses([...exp]);
      localStorage.setItem("rl_expenses", JSON.stringify(exp));
    } catch (e) { console.log("Upload failed, saved locally"); }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (e) {
      console.log("Login failed", e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const addExpense = async (expense) => {
    const newExp = { ...expense, id: Date.now().toString() };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    if (user) await syncToFirebase(user, updated, categories);
  };

  const deleteExpense = async (id) => {
    const exp = expenses.find(e => e.id === id);
    if (exp?.firestoreId && user) {
      try { await deleteDoc(doc(db, "expenses", exp.firestoreId)); } catch (e) {}
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = async (cat) => {
    const updated = [...categories, cat];
    setCategories(updated);
    if (user) await syncToFirebase(user, expenses, updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      {syncing && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "var(--accent)", padding: "6px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "#0d1f0d", zIndex: 999 }}>
          🔄 Syncing with cloud...
        </div>
      )}
      {page === "home" && <Home setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} expenses={expenses} />}
      {page === "record" && <Record setPage={setPage} addExpense={addExpense} categories={categories} addCategory={addCategory} />}
      {page === "report" && <Report setPage={setPage} expenses={expenses} deleteExpense={deleteExpense} categories={categories} />}
      {page === "profile" && <Profile setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} expenses={expenses} user={user} handleGoogleLogin={handleGoogleLogin} handleLogout={handleLogout} syncing={syncing} />}
    </div>
  );
}