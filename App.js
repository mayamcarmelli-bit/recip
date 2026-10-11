import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  Flower,
  Flower2,
  Leaf,
  Sprout,
  Clover,
  Heart,
  Star,
  Sun,
} from "lucide-react";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAs8yn5Y7gj9excvtj2AwNkjH0m0K_kxJQ",
  authDomain: "recipes-4f233.firebaseapp.com",
  projectId: "recipes-4f233",
  storageBucket: "recipes-4f233.firebasestorage.app",
  messagingSenderId: "854186432052",
  appId: "1:854186432052:web:712f76ce18b2119c3d1c61",
  measurementId: "G-NME5Y0KL39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Initial Data (Default Recipes) ---
const initialRecipes = [
  {
    id: "local-1",
    title: "עוגת נמסיס שוקולד",
    titleEn: "Chocolate Nemesis Cake",
    category: "מתוק",
    difficulty: "בינוני",
    color: "#F5CEC7",
    flower: "orchid",
    yieldNum: 10,
    yieldUnit: "פרוסות",
    yieldUnitEn: "slices",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "6 ביצים (גודל L)",
      "1 כוס סוכר לבן",
      "300 גרם שוקולד מריר",
      "200 גרם חמאה",
      "70 גרם קמח שקדים (1/3 כוס)",
    ],
    instructions: [
      "מחממים תנור ל-170 מעלות.",
      "מקציפים במיקסר את הביצים והסוכר במשך 8 דקות.",
      "ממיסים את השוקולד המריר והחמאה.",
      "מאחדים בעדינות את התערובות, ומוסיפים קמח שקדים.",
      "אופים כ-35 דקות.",
    ],
    substitutes:
      "העוגה מטבעה ללא קמח (ללא גלוטן). לגרסת פרווה: שמן קוקוס או נטורינה במקום חמאה.",
  },
  {
    id: "local-2",
    title: "עוגת ריקוטה ותאנים",
    titleEn: "Ricotta & Fig Cake",
    category: "מתוק/מלוח",
    difficulty: "קל",
    color: "#EBA5A5",
    flower: "daisy",
    yieldNum: 8,
    yieldUnit: "מנות",
    yieldUnitEn: "servings",
    image:
      "https://images.unsplash.com/photo-1632516447820-22c7104b2811?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "2 ביצים",
      "1 כוס גבינת ריקוטה",
      "1 כוס סוכר לבן",
      "1/3 כוס שמן זית",
      "1.5 כוסות קמח לבן",
      "1.5 כפיות אבקת אפייה",
      "7 תאנים טריות (או פירות עונה: שזיפים/אפרסקים)",
    ],
    instructions: [
      "מחממים תנור ל-175 מעלות ומשמנים תבנית.",
      "טורפים ריקוטה, סוכר ושמן זית. מוסיפים ביצים.",
      "מערבבים יבשים בנפרד ומקפלים לבלילה.",
      "מסדרים תאנים מעל.",
      "אופים 45 דקות.",
    ],
    substitutes:
      "גרסה מלוחה: להוריד סוכר ווניל. להחליף ריקוטה ביוגורט יווני לא ממותק, שמנת חמוצה או גבינת עזים. להוסיף פרמזן ועשבי תיבול.",
  },
  {
    id: "local-3",
    title: "בראוניז מושחת",
    titleEn: "Decadent Brownies",
    category: "מתוק",
    difficulty: "קל",
    color: "#A4BDA8",
    flower: "tulip",
    yieldNum: 16,
    yieldUnit: "ריבועים",
    yieldUnitEn: "squares",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "200 גרם שוקולד מריר",
      "150 גרם חמאה",
      "3 ביצים",
      "1 כוס סוכר",
      "3/4 כוס קמח",
    ],
    instructions: [
      "מחממים תנור ל-160 מעלות.",
      "ממיסים שוקולד וחמאה.",
      "טורפים ביצים וסוכר ומוסיפים לשוקולד.",
      "מקפלים את הקמח.",
      "אופים 25 דקות בלבד.",
    ],
    substitutes: "ללא גלוטן: קמח תמי/קונדיטור. פרווה: שמן קוקוס.",
  },
  {
    id: "local-4",
    title: "מוס שוקולד מריר",
    titleEn: "Dark Chocolate Mousse",
    category: "קינוח כוסות",
    difficulty: "בינוני",
    color: "#FABB92",
    flower: "rose",
    yieldNum: 6,
    yieldUnit: "כוסות",
    yieldUnitEn: "cups",
    image:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "250 גרם שוקולד מריר איכותי",
      "4 ביצים מופרדות",
      "2 כפות סוכר",
      '1 מיכל (250 מ"ל) שמנת מתוקה',
    ],
    instructions: [
      "ממיסים את השוקולד ומצננים מעט.",
      "מקציפים חלבונים וסוכר לקצף יציב.",
      "טורפים את החלמונים לתוך השוקולד המומס.",
      "מקציפים שמנת מתוקה לקצפת רכה.",
      "מקפלים הכל יחד בעדינות ומקררים מינימום 4 שעות.",
    ],
    substitutes: "פרווה: להשתמש בשמנת צמחית איכותית.",
  },
];

export default function App() {
  const [lang, setLang] = useState("he");
  const [dbRecipes, setDbRecipes] = useState([]);

  // Header Customization State
  const [headerConfig, setHeaderConfig] = useState({
    title: "ספר המתכונים שלי",
    subtitle: "אוסף פרטי באווירה רומנטית 🌸",
    bgColor: "#FABB92",
    leftIcon: "flower2",
    rightIcon: "sun",
  });

  const [hiddenLocal, setHiddenLocal] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hiddenRecipes")) || [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [scale, setScale] = useState(1);
  const [customScaleText, setCustomScaleText] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const [activeTimer, setActiveTimer] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState("");
  const timerInterval = useRef(null);

  // --- Recipe Form State ---
  const initialFormState = {
    title: "",
    titleEn: "",
    category: "מתוק",
    difficulty: "קל",
    color: "#F5CEC7",
    flower: "daisy",
    yieldNum: 1,
    yieldUnit: "מנות",
    yieldUnitEn: "servings",
    image: "",
    ingredientsText: "",
    instructionsText: "",
    substitutes: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recipes and header settings from Firebase
  useEffect(() => {
    const q = query(collection(db, "recipes"));
    const unsubscribeRecipes = onSnapshot(q, (querySnapshot) => {
      const recipesArr = [];
      querySnapshot.forEach((doc) => {
        recipesArr.push({ id: doc.id, ...doc.data() });
      });
      setDbRecipes(recipesArr);
    });

    const headerRef = doc(db, "settings", "header");
    const unsubscribeHeader = onSnapshot(headerRef, (docSnap) => {
      if (docSnap.exists()) {
        setHeaderConfig(docSnap.data());
      }
    });

    return () => {
      unsubscribeRecipes();
      unsubscribeHeader();
    };
  }, []);

  const visibleInitialRecipes = initialRecipes.filter(
    (r) => !hiddenLocal.includes(r.id)
  );
  const allRecipes = [...visibleInitialRecipes, ...dbRecipes];

  const hideLocalRecipe = (id) => {
    const updated = [...hiddenLocal, id];
    setHiddenLocal(updated);
    localStorage.setItem("hiddenRecipes", JSON.stringify(updated));
  };

  const handleHeaderSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "header"), headerConfig);
      alert(
        lang === "he"
          ? "עיצוב כותרת האתר עודכן בהצלחה! ✨"
          : "Header updated successfully! ✨"
      );
    } catch (error) {
      alert("Error updating header: " + error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ingredientsArray = formData.ingredientsText
      .split("\n")
      .filter((line) => line.trim() !== "");
    const instructionsArray = formData.instructionsText
      .split("\n")
      .filter((line) => line.trim() !== "");

    const recipeData = {
      title: formData.title,
      titleEn: formData.titleEn,
      category: formData.category,
      difficulty: formData.difficulty,
      color: formData.color,
      flower: formData.flower,
      yieldNum: Number(formData.yieldNum),
      yieldUnit: formData.yieldUnit,
      yieldUnitEn: formData.yieldUnitEn,
      image: formData.image,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      substitutes: formData.substitutes,
      updatedAt: new Date(),
    };

    try {
      if (editingId) {
        if (editingId.toString().startsWith("local-")) {
          await addDoc(collection(db, "recipes"), {
            ...recipeData,
            createdAt: new Date(),
          });
          hideLocalRecipe(editingId);
        } else {
          await updateDoc(doc(db, "recipes", editingId), recipeData);
        }
        alert(
          lang === "he"
            ? "המתכון עודכן בהצלחה!"
            : "Recipe updated successfully!"
        );
      } else {
        await addDoc(collection(db, "recipes"), {
          ...recipeData,
          createdAt: new Date(),
        });
        alert(
          lang === "he" ? "המתכון נוסף בהצלחה!" : "Recipe added successfully!"
        );
      }
      setFormData(initialFormState);
      setEditingId(null);
    } catch (error) {
      alert("Error saving recipe: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleEditClick = (recipe) => {
    setFormData({
      title: recipe.title || "",
      titleEn: recipe.titleEn || "",
      category: recipe.category || "מתוק",
      difficulty: recipe.difficulty || "קל",
      color: recipe.color || "#F5CEC7",
      flower: recipe.flower || "daisy",
      yieldNum: recipe.yieldNum || 1,
      yieldUnit: recipe.yieldUnit || "מנות",
      yieldUnitEn: recipe.yieldUnitEn || "servings",
      image: recipe.image || "",
      ingredientsText: (recipe.ingredients || []).join("\n"),
      instructionsText: (recipe.instructions || []).join("\n"),
      substitutes: recipe.substitutes || "",
    });
    setEditingId(recipe.id);
    closeRecipe();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (recipe) => {
    const confirmDelete = window.confirm(
      lang === "he"
        ? "האם את בטוחה שאת רוצה למחוק את המתכון הזה?"
        : "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    if (recipe.id.toString().startsWith("local-")) {
      hideLocalRecipe(recipe.id);
    } else {
      try {
        await deleteDoc(doc(db, "recipes", recipe.id));
      } catch (error) {
        alert("Error deleting recipe: " + error.message);
      }
    }
    closeRecipe();
  };

  const handlePrint = () => window.print();

  const startTimer = (minutes) => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    let seconds = minutes * 60;
    setActiveTimer(seconds);
    timerInterval.current = setInterval(() => {
      seconds -= 1;
      setActiveTimer(seconds);
      if (seconds <= 0) {
        clearInterval(timerInterval.current);
        alert(lang === "he" ? "הטיימר סיים! ⏰" : "Timer is done! ⏰");
        setActiveTimer(null);
      }
    }, 1000);
  };

  useEffect(() => {
    if (activeTimer !== null) {
      const m = Math.floor(activeTimer / 60);
      const s = activeTimer % 60;
      setTimerDisplay(`${m}:${s < 10 ? "0" : ""}${s}`);
    }
  }, [activeTimer]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }, []);

  const t = (heText, enText) => (lang === "he" ? heText : enText || heText);

  const filteredRecipes = allRecipes.filter((r) => {
    const queryStr = searchQuery.toLowerCase();
    const nameMatch =
      (r.title || "").toLowerCase().includes(queryStr) ||
      (r.titleEn || "").toLowerCase().includes(queryStr);
    const catMatch = (r.category || "").toLowerCase().includes(queryStr);
    const ingMatchHe =
      r.ingredients &&
      r.ingredients.some((i) => i.toLowerCase().includes(queryStr));
    return nameMatch || catMatch || ingMatchHe;
  });

  const handleScaleIngredient = (ingredient, currentScale) => {
    return ingredient.replace(/[\d./]+/g, (match) => {
      if (match.includes("/")) return match;
      const num = parseFloat(match);
      if (isNaN(num)) return match;
      return (Math.round(num * currentScale * 100) / 100).toString();
    });
  };

  const closeRecipe = () => {
    setSelectedRecipe(null);
    setScale(1);
    setCustomScaleText("");
    setFocusMode(false);
  };

  const renderInstructionWithTimer = (text) => {
    const regex = /(\d+)\s*(דקות|min(?:utes)?)/gi;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      parts.push(text.substring(lastIndex, match.index));
      const mins = parseInt(match[1], 10);
      parts.push(
        <button
          key={match.index}
          onClick={() => startTimer(mins)}
          className="inline-block bg-white/40 px-2 py-0.5 rounded-md font-bold text-[#D35400] hover:bg-white/70 transition cursor-pointer shadow-sm border border-white"
          title="לחץ להפעלת טיימר"
        >
          ⏱️ {match[0]}
        </button>
      );
      lastIndex = regex.lastIndex;
    }
    parts.push(text.substring(lastIndex));
    return parts;
  };

  const getDynamicIcon = (iconName, props) => {
    const iconProps = { className: props.className, strokeWidth: 1.5 };
    switch (iconName) {
      case "orchid":
        return <Flower2 {...iconProps} />;
      case "tulip":
        return <Flower {...iconProps} />;
      case "rose":
        return <Heart {...iconProps} />;
      case "leaf":
        return <Leaf {...iconProps} />;
      case "sprout":
        return <Sprout {...iconProps} />;
      case "clover":
        return <Clover {...iconProps} />;
      case "heart":
        return <Heart {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      case "sun":
      default:
        return <Sun {...iconProps} />;
    }
  };

  return (
    <div
      dir={lang === "he" ? "rtl" : "ltr"}
      className="min-h-screen font-sans bg-[#FDFBF7] text-[#2C3E50] print:bg-white print:text-black"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&family=Frank+Ruhl+Libre:wght@400;700&display=swap');
        .font-serif-hebrew { font-family: 'Frank Ruhl Libre', serif; }
        .font-sans-hebrew { font-family: 'Assistant', sans-serif; }
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } .modal-content { height: auto !important; overflow: visible !important; position: static !important; } }
      `,
        }}
      />

      <div className={`${selectedRecipe ? "no-print" : ""}`}>
        <header
          className="relative w-full py-16 flex flex-col items-center justify-center text-center overflow-hidden rounded-b-[3rem] shadow-sm transition-colors duration-500"
          style={{ backgroundColor: headerConfig.bgColor }}
        >
          <div className="absolute top-4 left-10 w-32 h-32 text-white/30 pointer-events-none">
            {getDynamicIcon(headerConfig.leftIcon, {
              className: "w-full h-full",
            })}
          </div>
          <div className="absolute bottom-4 right-10 w-40 h-40 text-white/30 pointer-events-none">
            {getDynamicIcon(headerConfig.rightIcon, {
              className: "w-full h-full",
            })}
          </div>

          <button
            onClick={() => setLang(lang === "he" ? "en" : "he")}
            className="absolute top-6 right-6 bg-white/30 px-4 py-2 rounded-full font-bold shadow-sm backdrop-blur-md hover:bg-white/50 transition"
          >
            🌐 {lang === "he" ? "English" : "עברית"}
          </button>
          <button
            onClick={() => {
              setAdminMode(!adminMode);
              setEditingId(null);
              setFormData(initialFormState);
            }}
            className="absolute top-6 left-6 text-2xl opacity-40 hover:opacity-100 transition"
            title="ניהול האתר"
          >
            {adminMode ? "🔓" : "🔒"}
          </button>

          <h1 className="font-serif-hebrew text-5xl md:text-6xl text-white mb-2 z-10 drop-shadow-md">
            {headerConfig.title}
          </h1>
          <p className="font-sans-hebrew text-lg text-white/90 z-10">
            {headerConfig.subtitle}
          </p>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* Admin Dashboard */}
          {adminMode && (
            <div className="bg-[#2C3E50] text-white p-8 rounded-3xl mb-12 shadow-xl border-4 border-[#FABB92] space-y-10">
              {/* Header Customization Form */}
              <div className="border-b border-gray-600 pb-8">
                <h2 className="text-2xl font-serif-hebrew text-[#FABB92] mb-4">
                  ✨ עריכת כותרת, צבע ואייקונים באתר
                </h2>
                <form
                  onSubmit={handleHeaderSave}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans-hebrew"
                >
                  <input
                    type="text"
                    placeholder="כותרת ראשית"
                    className="p-3 rounded-xl text-black"
                    value={headerConfig.title}
                    onChange={(e) =>
                      setHeaderConfig({
                        ...headerConfig,
                        title: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="כותרת משנה"
                    className="p-3 rounded-xl text-black"
                    value={headerConfig.subtitle}
                    onChange={(e) =>
                      setHeaderConfig({
                        ...headerConfig,
                        subtitle: e.target.value,
                      })
                    }
                  />

                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
                    <label className="text-sm">צבע רקע כותרת:</label>
                    <input
                      type="color"
                      value={headerConfig.bgColor}
                      onChange={(e) =>
                        setHeaderConfig({
                          ...headerConfig,
                          bgColor: e.target.value,
                        })
                      }
                      className="rounded h-10 w-12 cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-2 items-center bg-white/10 px-4 py-2 rounded-xl">
                    <label className="text-sm">אייקונים צדדיים:</label>
                    <select
                      className="p-2 rounded-lg text-black text-sm flex-1"
                      value={headerConfig.leftIcon}
                      onChange={(e) =>
                        setHeaderConfig({
                          ...headerConfig,
                          leftIcon: e.target.value,
                        })
                      }
                    >
                      <option value="flower2">סחלב 🌸</option>
                      <option value="sun">שמש ☀️</option>
                      <option value="heart">לב 🤍</option>
                      <option value="star">כוכב ⭐</option>
                      <option value="tulip">טוליפ 🌷</option>
                      <option value="clover">תלתן 🍀</option>
                    </select>
                    <select
                      className="p-2 rounded-lg text-black text-sm flex-1"
                      value={headerConfig.rightIcon}
                      onChange={(e) =>
                        setHeaderConfig({
                          ...headerConfig,
                          rightIcon: e.target.value,
                        })
                      }
                    >
                      <option value="sun">שמש ☀️</option>
                      <option value="flower2">סחלב 🌸</option>
                      <option value="heart">לב 🤍</option>
                      <option value="star">כוכב ⭐</option>
                      <option value="tulip">טוליפ 🌷</option>
                      <option value="clover">תלתן 🍀</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="md:col-span-2 bg-[#FABB92] text-gray-900 font-bold px-6 py-3 rounded-xl text-lg hover:bg-[#e8aa82] transition shadow-md"
                  >
                    💾 שמור שינויי עיצוב וכותרת
                  </button>
                </form>
              </div>

              {/* Add / Edit Recipe Form */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-serif-hebrew text-[#FABB92]">
                    {editingId ? "עריכת מתכון ✏️" : "הוספת מתכון חדש 📝"}
                  </h2>
                  {editingId && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setFormData(initialFormState);
                      }}
                      className="text-sm bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition"
                    >
                      ביטול עריכה
                    </button>
                  )}
                </div>

                <form
                  onSubmit={handleFormSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans-hebrew"
                >
                  <input
                    required
                    type="text"
                    placeholder="שם המתכון (עברית)"
                    className="p-3 rounded-xl text-black"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="שם המתכון (אנגלית - אופציונלי)"
                    className="p-3 rounded-xl text-black"
                    value={formData.titleEn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleEn: e.target.value })
                    }
                  />

                  <div className="flex gap-4">
                    <select
                      className="p-3 rounded-xl text-black flex-1"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="מתוק">מתוק</option>
                      <option value="מלוח">מלוח</option>
                      <option value="מתוק/מלוח">מתוק/מלוח</option>
                      <option value="קינוח כוסות">קינוח כוסות</option>
                      <option value="מאפה">מאפה</option>
                      <option value="עיקרית">עיקרית</option>
                    </select>
                    <select
                      className="p-3 rounded-xl text-black flex-1"
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({ ...formData, difficulty: e.target.value })
                      }
                    >
                      <option value="קל">קל</option>
                      <option value="בינוני">בינוני</option>
                      <option value="מורכב">מורכב</option>
                    </select>
                  </div>

                  <input
                    required
                    type="url"
                    placeholder="קישור ישיר לתמונה (מסתיים ב-.jpg/.png)"
                    className="p-3 rounded-xl text-black"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />

                  <div className="flex gap-4">
                    <input
                      required
                      type="number"
                      placeholder="כמות יוצאת (למשל: 10)"
                      className="p-3 rounded-xl text-black flex-1"
                      value={formData.yieldNum}
                      onChange={(e) =>
                        setFormData({ ...formData, yieldNum: e.target.value })
                      }
                    />
                    <input
                      required
                      type="text"
                      placeholder="יחידת מידה (למשל: פרוסות)"
                      className="p-3 rounded-xl text-black flex-1"
                      value={formData.yieldUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, yieldUnit: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-4 md:col-span-2">
                    <label className="flex items-center gap-2">
                      צבע כרטיסייה:{" "}
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="rounded h-10 w-10 cursor-pointer"
                      />
                    </label>
                    <select
                      className="p-2 rounded-xl text-black flex-1"
                      value={formData.flower}
                      onChange={(e) =>
                        setFormData({ ...formData, flower: e.target.value })
                      }
                    >
                      <option value="sun">שמש ☀️</option>
                      <option value="orchid">סחלב 🌸</option>
                      <option value="tulip">טוליפ 🌷</option>
                      <option value="rose">ורד 🌹</option>
                      <option value="leaf">עלה 🍃</option>
                      <option value="sprout">נבט 🌱</option>
                      <option value="clover">תלתן 🍀</option>
                      <option value="heart">לב 🤍</option>
                      <option value="star">כוכב ⭐</option>
                    </select>
                  </div>

                  <textarea
                    required
                    placeholder="מצרכים (כל מצרך בשורה נפרדת)"
                    className="p-3 rounded-xl text-black h-32 md:col-span-2"
                    value={formData.ingredientsText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ingredientsText: e.target.value,
                      })
                    }
                  ></textarea>
                  <textarea
                    required
                    placeholder="אופן ההכנה (כל שלב בשורה נפרדת)"
                    className="p-3 rounded-xl text-black h-32 md:col-span-2"
                    value={formData.instructionsText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instructionsText: e.target.value,
                      })
                    }
                  ></textarea>
                  <input
                    type="text"
                    placeholder="תחליפים ורעיונות (אופציונלי)"
                    className="p-3 rounded-xl text-black md:col-span-2"
                    value={formData.substitutes}
                    onChange={(e) =>
                      setFormData({ ...formData, substitutes: e.target.value })
                    }
                  />

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className={`md:col-span-2 font-bold py-4 rounded-xl transition text-xl ${
                      editingId
                        ? "bg-[#A4BDA8] hover:bg-[#8da390] text-white"
                        : "bg-[#FABB92] hover:bg-[#e8aa82] text-white"
                    }`}
                  >
                    {isSubmitting
                      ? "שומר..."
                      : editingId
                      ? "💾 שמור שינויי מתכון"
                      : "✨ הוסף מתכון לספר ✨"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-12 max-w-md mx-auto px-4">
            <input
              type="text"
              placeholder={t(
                "חיפוש מתכון, מרכיב או קטגוריה...",
                "Search recipe, ingredient, category..."
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full shadow-md border border-gray-200 text-gray-700 font-sans-hebrew focus:outline-none focus:ring-4 focus:ring-[#FABB92]/30 bg-white"
            />
            <span className="absolute top-3 left-8 text-gray-400">🔍</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="cursor-pointer rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-transform transform hover:-translate-y-1 p-8 relative"
                style={{ backgroundColor: recipe.color }}
              >
                {getDynamicIcon(recipe.flower, {
                  className:
                    "absolute -top-10 -left-10 w-48 h-48 text-white opacity-20 pointer-events-none",
                })}
                <h3 className="font-serif-hebrew text-3xl mb-4 relative z-10">
                  {t(recipe.title, recipe.titleEn)}
                </h3>
                <div className="flex gap-2 relative z-10">
                  <span className="bg-white/50 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {recipe.difficulty}
                  </span>
                  <span className="bg-white/50 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {recipe.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-[#2C3E50]/70 backdrop-blur-md z-50 flex justify-center items-center p-2 sm:p-4 print:p-0 print:bg-white print:static modal-content overflow-hidden">
          <div
            className={`bg-[#FDFBF7] w-full max-w-4xl h-full max-h-[95vh] rounded-[2rem] shadow-2xl relative flex flex-col print:h-auto print:shadow-none print:max-w-full ${
              focusMode ? "max-w-full max-h-screen rounded-none" : ""
            }`}
          >
            <div className="absolute top-10 left-4 w-64 h-64 text-black opacity-[0.03] pointer-events-none z-0 print:opacity-10">
              {getDynamicIcon(selectedRecipe.flower, {
                className: "w-full h-full",
              })}
            </div>
            <Sun
              className="absolute bottom-10 right-4 w-64 h-64 text-black opacity-[0.03] pointer-events-none z-0 print:opacity-10"
              strokeWidth={1}
            />

            <div className="no-print flex justify-between items-center p-4 border-b border-gray-200 bg-[#FDFBF7]/90 backdrop-blur-sm rounded-t-[2rem] z-20 sticky top-0">
              <button
                onClick={closeRecipe}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-full font-bold text-xl transition flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex gap-3">
                {adminMode && (
                  <div className="flex gap-2 mr-4 border-l border-gray-300 pl-4">
                    <button
                      onClick={() => handleDelete(selectedRecipe)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-full font-bold text-sm hover:bg-red-200 transition"
                    >
                      🗑️ {t("מחק", "Delete")}
                    </button>
                    <button
                      onClick={() => handleEditClick(selectedRecipe)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm hover:bg-blue-200 transition"
                    >
                      ✏️ {t("ערוך", "Edit")}
                    </button>
                  </div>
                )}

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-100 rounded-full font-bold text-sm hover:bg-gray-200 transition"
                >
                  🖨️ {t("הדפסה", "Print")}
                </button>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                    focusMode
                      ? "bg-[#2C3E50] text-white"
                      : "bg-[#EBA5A5]/30 text-[#2C3E50]"
                  }`}
                >
                  🧑‍🍳 {t("מצב אפייה", "Bake Mode")}
                </button>
              </div>
            </div>

            <div
              className={`overflow-y-auto p-6 md:p-10 relative z-10 flex-1 print:overflow-visible print:p-0 ${
                focusMode ? "text-xl md:text-2xl" : ""
              }`}
            >
              <h2
                className={`font-serif-hebrew text-center mb-2 ${
                  focusMode ? "text-6xl" : "text-4xl md:text-5xl"
                }`}
              >
                {t(selectedRecipe.title, selectedRecipe.titleEn)}
              </h2>

              <div className="no-print flex flex-wrap justify-center items-center gap-4 mb-8 mt-4 bg-white/60 p-4 rounded-2xl shadow-sm border border-white">
                <div className="font-bold text-[#2C3E50]">
                  🍽️ {t("יוצא:", "Yield:")}{" "}
                  {Math.round(selectedRecipe.yieldNum * scale * 100) / 100}{" "}
                  {t(selectedRecipe.yieldUnit, selectedRecipe.yieldUnitEn)}
                </div>
                <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">
                    {t("הכפלת כמויות:", "Scale:")}
                  </span>
                  {[0.5, 1, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setScale(num);
                        setCustomScaleText("");
                      }}
                      className={`px-3 py-1 rounded-lg font-bold transition shadow-sm border ${
                        scale === num && customScaleText === ""
                          ? "bg-[#FABB92] text-white border-[#FABB92]"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      x{num}
                    </button>
                  ))}
                  <input
                    type="number"
                    placeholder={t("אחר", "Custom")}
                    value={customScaleText}
                    onChange={(e) => {
                      setCustomScaleText(e.target.value);
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val > 0) setScale(val);
                    }}
                    className={`w-16 px-2 py-1 text-center rounded-lg border font-bold shadow-sm ${
                      customScaleText !== ""
                        ? "bg-[#FABB92] text-white border-[#FABB92]"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  />
                </div>
              </div>

              {selectedRecipe.image && (
                <div className="w-full flex justify-center mb-10">
                  <img
                    src={selectedRecipe.image}
                    alt="Recipe"
                    className={`w-full object-cover rounded-[2rem] shadow-xl border-4 border-white ${
                      focusMode ? "h-96 max-w-2xl" : "h-64 max-w-md"
                    }`}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-white/70 p-6 md:p-8 rounded-3xl shadow-sm border border-white backdrop-blur-sm print:shadow-none print:border-none print:bg-transparent">
                  <h3 className="font-serif-hebrew text-3xl mb-6 border-b-2 border-[#FABB92] inline-block pb-1">
                    {t("מצרכים", "Ingredients")}
                  </h3>
                  <ul className="space-y-4 font-sans-hebrew">
                    {(selectedRecipe.ingredients || []).map((ing, i) => (
                      <li
                        key={i}
                        className="flex gap-3 items-start border-b border-gray-100 pb-2 print:border-none"
                      >
                        <span className="text-[#FABB92] mt-1">✿</span>
                        <span className="font-semibold">
                          {handleScaleIngredient(ing, scale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {selectedRecipe.substitutes && (
                    <div className="mt-8 p-4 bg-[#F5CEC7]/20 border border-[#F5CEC7] rounded-2xl text-sm md:text-base font-bold text-gray-700 shadow-inner print:border-none print:bg-gray-100">
                      💡{" "}
                      <span className="text-[#D35400]">
                        {t("תחליפים ורעיונות:", "Substitutes & Ideas:")}
                      </span>
                      <br />
                      {selectedRecipe.substitutes}
                    </div>
                  )}
                </div>

                <div className="bg-white/70 p-6 md:p-8 rounded-3xl shadow-sm border border-white backdrop-blur-sm print:shadow-none print:border-none print:bg-transparent">
                  <h3 className="font-serif-hebrew text-3xl mb-6 border-b-2 border-[#A4BDA8] inline-block pb-1">
                    {t("אופן הכנה", "Instructions")}
                  </h3>
                  <div className="space-y-6 font-sans-hebrew">
                    {(selectedRecipe.instructions || []).map((inst, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="font-serif-hebrew font-bold text-2xl text-[#A4BDA8]">
                          {i + 1}.
                        </span>
                        <p className="leading-relaxed pt-1">
                          {renderInstructionWithTimer(inst)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTimer !== null && (
        <div className="no-print fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#2C3E50] text-white px-8 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-4 border-2 border-[#FABB92] animate-bounce-slow">
          <span className="text-2xl">⏳</span>
          <span className="font-bold text-3xl font-mono tracking-wider">
            {timerDisplay}
          </span>
          <button
            onClick={() => setActiveTimer(null)}
            className="ml-4 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
