import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ru", label: "Русский" },
  { code: "sw", label: "Kiswahili" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const T: Record<LangCode, Dict> = {
  en: {
    "nav.home": "Home", "nav.sources": "Sources", "nav.glossary": "Glossary", "nav.about": "About",
    "footer.data": "Data: REST Countries · World Bank Open Data · UN",
    "lang.label": "Language",
    "search.placeholder": "Search a country (e.g. Sweden) — press \"/\" to focus",
    "section.byRegion": "Browse by region",
    "section.favourites": "★ Your favourites",
    "section.mostPopulous": "Most populous",
    "section.leastPopulous": "Least populous",
    "country.back": "Back to search",
    "country.fav.add": "☆ Add favourite", "country.fav.remove": "★ Favourited",
    "country.share": "↗ Share", "country.newSearch": "New search",
    "country.capital": "Capital", "country.area": "Area", "country.languages": "Languages",
    "country.population": "Population", "country.density": "Density", "country.timezones": "Timezones",
    "country.recentIndicators": "Recent indicators",
    "country.loading": "Loading…",
    "funfact.title": "Did you know?",
    "funfact.loading": "Finding a fun fact…",
    "funfact.close": "Close",
    "funfact.error": "Couldn't fetch a fact right now.",
  },
  es: {
    "nav.home": "Inicio", "nav.sources": "Fuentes", "nav.glossary": "Glosario", "nav.about": "Acerca",
    "footer.data": "Datos: REST Countries · Banco Mundial · ONU",
    "lang.label": "Idioma",
    "search.placeholder": "Busca un país (ej. Suecia) — pulsa \"/\" para enfocar",
    "section.byRegion": "Explorar por región",
    "section.favourites": "★ Tus favoritos",
    "section.mostPopulous": "Más poblados",
    "section.leastPopulous": "Menos poblados",
    "country.back": "Volver a la búsqueda",
    "country.fav.add": "☆ Añadir a favoritos", "country.fav.remove": "★ En favoritos",
    "country.share": "↗ Compartir", "country.newSearch": "Nueva búsqueda",
    "country.capital": "Capital", "country.area": "Área", "country.languages": "Idiomas",
    "country.population": "Población", "country.density": "Densidad", "country.timezones": "Husos horarios",
    "country.recentIndicators": "Indicadores recientes",
    "country.loading": "Cargando…",
    "funfact.title": "¿Sabías que…?",
    "funfact.loading": "Buscando un dato curioso…",
    "funfact.close": "Cerrar",
    "funfact.error": "No se pudo obtener un dato ahora.",
  },
  fr: {
    "nav.home": "Accueil", "nav.sources": "Sources", "nav.glossary": "Glossaire", "nav.about": "À propos",
    "footer.data": "Données : REST Countries · Banque mondiale · ONU",
    "lang.label": "Langue",
    "search.placeholder": "Cherchez un pays (ex. Suède) — appuyez sur \"/\"",
    "section.byRegion": "Parcourir par région",
    "section.favourites": "★ Vos favoris",
    "section.mostPopulous": "Plus peuplés",
    "section.leastPopulous": "Moins peuplés",
    "country.back": "Retour à la recherche",
    "country.fav.add": "☆ Ajouter aux favoris", "country.fav.remove": "★ Favori",
    "country.share": "↗ Partager", "country.newSearch": "Nouvelle recherche",
    "country.capital": "Capitale", "country.area": "Superficie", "country.languages": "Langues",
    "country.population": "Population", "country.density": "Densité", "country.timezones": "Fuseaux horaires",
    "country.recentIndicators": "Indicateurs récents",
    "country.loading": "Chargement…",
    "funfact.title": "Le saviez-vous ?",
    "funfact.loading": "Recherche d'une anecdote…",
    "funfact.close": "Fermer",
    "funfact.error": "Impossible d'obtenir une anecdote.",
  },
  de: {
    "nav.home": "Start", "nav.sources": "Quellen", "nav.glossary": "Glossar", "nav.about": "Über",
    "footer.data": "Daten: REST Countries · Weltbank · UN",
    "lang.label": "Sprache",
    "search.placeholder": "Land suchen (z. B. Schweden) — \"/\" zum Fokussieren",
    "section.byRegion": "Nach Region",
    "section.favourites": "★ Deine Favoriten",
    "section.mostPopulous": "Bevölkerungsreichste",
    "section.leastPopulous": "Bevölkerungsärmste",
    "country.back": "Zurück zur Suche",
    "country.fav.add": "☆ Zu Favoriten", "country.fav.remove": "★ Favorit",
    "country.share": "↗ Teilen", "country.newSearch": "Neue Suche",
    "country.capital": "Hauptstadt", "country.area": "Fläche", "country.languages": "Sprachen",
    "country.population": "Bevölkerung", "country.density": "Dichte", "country.timezones": "Zeitzonen",
    "country.recentIndicators": "Aktuelle Indikatoren",
    "country.loading": "Lädt…",
    "funfact.title": "Wussten Sie schon?",
    "funfact.loading": "Suche eine Kuriosität…",
    "funfact.close": "Schließen",
    "funfact.error": "Konnte keine Information laden.",
  },
  pt: {
    "nav.home": "Início", "nav.sources": "Fontes", "nav.glossary": "Glossário", "nav.about": "Sobre",
    "footer.data": "Dados: REST Countries · Banco Mundial · ONU",
    "lang.label": "Idioma",
    "search.placeholder": "Busque um país (ex. Suécia) — \"/\" para focar",
    "section.byRegion": "Por região",
    "section.favourites": "★ Seus favoritos",
    "section.mostPopulous": "Mais populosos",
    "section.leastPopulous": "Menos populosos",
    "country.back": "Voltar à busca",
    "country.fav.add": "☆ Adicionar favorito", "country.fav.remove": "★ Favorito",
    "country.share": "↗ Compartilhar", "country.newSearch": "Nova busca",
    "country.capital": "Capital", "country.area": "Área", "country.languages": "Idiomas",
    "country.population": "População", "country.density": "Densidade", "country.timezones": "Fusos horários",
    "country.recentIndicators": "Indicadores recentes",
    "country.loading": "Carregando…",
    "funfact.title": "Você sabia?",
    "funfact.loading": "Buscando curiosidade…",
    "funfact.close": "Fechar",
    "funfact.error": "Não foi possível obter um dado.",
  },
  it: {
    "nav.home": "Home", "nav.sources": "Fonti", "nav.glossary": "Glossario", "nav.about": "Info",
    "footer.data": "Dati: REST Countries · Banca Mondiale · ONU",
    "lang.label": "Lingua",
    "search.placeholder": "Cerca un paese (es. Svezia) — \"/\" per il focus",
    "section.byRegion": "Per regione",
    "section.favourites": "★ Preferiti",
    "section.mostPopulous": "Più popolosi",
    "section.leastPopulous": "Meno popolosi",
    "country.back": "Torna alla ricerca",
    "country.fav.add": "☆ Aggiungi ai preferiti", "country.fav.remove": "★ Preferito",
    "country.share": "↗ Condividi", "country.newSearch": "Nuova ricerca",
    "country.capital": "Capitale", "country.area": "Area", "country.languages": "Lingue",
    "country.population": "Popolazione", "country.density": "Densità", "country.timezones": "Fusi orari",
    "country.recentIndicators": "Indicatori recenti",
    "country.loading": "Caricamento…",
    "funfact.title": "Lo sapevi?",
    "funfact.loading": "Cerco una curiosità…",
    "funfact.close": "Chiudi",
    "funfact.error": "Impossibile recuperare un fatto.",
  },
  hi: {
    "nav.home": "मुखपृष्ठ", "nav.sources": "स्रोत", "nav.glossary": "शब्दावली", "nav.about": "परिचय",
    "footer.data": "डेटा: REST Countries · विश्व बैंक · संयुक्त राष्ट्र",
    "lang.label": "भाषा",
    "search.placeholder": "देश खोजें (जैसे स्वीडन) — \"/\" दबाएँ",
    "section.byRegion": "क्षेत्र अनुसार देखें",
    "section.favourites": "★ आपके पसंदीदा",
    "section.mostPopulous": "सर्वाधिक जनसंख्या",
    "section.leastPopulous": "न्यूनतम जनसंख्या",
    "country.back": "खोज पर वापस",
    "country.fav.add": "☆ पसंदीदा में जोड़ें", "country.fav.remove": "★ पसंदीदा",
    "country.share": "↗ साझा करें", "country.newSearch": "नई खोज",
    "country.capital": "राजधानी", "country.area": "क्षेत्रफल", "country.languages": "भाषाएँ",
    "country.population": "जनसंख्या", "country.density": "घनत्व", "country.timezones": "समय क्षेत्र",
    "country.recentIndicators": "हालिया संकेतक",
    "country.loading": "लोड हो रहा है…",
    "funfact.title": "क्या आप जानते हैं?",
    "funfact.loading": "रोचक तथ्य खोजा जा रहा है…",
    "funfact.close": "बंद करें",
    "funfact.error": "अभी तथ्य नहीं मिल सका।",
  },
  bn: {
    "nav.home": "হোম", "nav.sources": "উৎস", "nav.glossary": "শব্দকোষ", "nav.about": "পরিচিতি",
    "footer.data": "তথ্য: REST Countries · বিশ্ব ব্যাংক · জাতিসংঘ",
    "lang.label": "ভাষা",
    "search.placeholder": "দেশ খুঁজুন (যেমন সুইডেন) — \"/\" চাপুন",
    "section.byRegion": "অঞ্চল অনুসারে",
    "section.favourites": "★ আপনার প্রিয়",
    "section.mostPopulous": "সর্বাধিক জনবহুল",
    "section.leastPopulous": "সর্বনিম্ন জনবহুল",
    "country.back": "অনুসন্ধানে ফিরুন",
    "country.fav.add": "☆ প্রিয়তে যোগ করুন", "country.fav.remove": "★ প্রিয়",
    "country.share": "↗ শেয়ার", "country.newSearch": "নতুন অনুসন্ধান",
    "country.capital": "রাজধানী", "country.area": "ক্ষেত্রফল", "country.languages": "ভাষা",
    "country.population": "জনসংখ্যা", "country.density": "ঘনত্ব", "country.timezones": "সময় অঞ্চল",
    "country.recentIndicators": "সাম্প্রতিক সূচক",
    "country.loading": "লোড হচ্ছে…",
    "funfact.title": "জানেন কি?",
    "funfact.loading": "মজার তথ্য খোঁজা হচ্ছে…",
    "funfact.close": "বন্ধ",
    "funfact.error": "তথ্য আনা যায়নি।",
  },
  ar: {
    "nav.home": "الرئيسية", "nav.sources": "المصادر", "nav.glossary": "المعجم", "nav.about": "حول",
    "footer.data": "البيانات: REST Countries · البنك الدولي · الأمم المتحدة",
    "lang.label": "اللغة",
    "search.placeholder": "ابحث عن بلد (مثل السويد) — اضغط \"/\"",
    "section.byRegion": "تصفح حسب المنطقة",
    "section.favourites": "★ المفضلة",
    "section.mostPopulous": "الأكثر سكاناً",
    "section.leastPopulous": "الأقل سكاناً",
    "country.back": "العودة للبحث",
    "country.fav.add": "☆ أضف للمفضلة", "country.fav.remove": "★ مفضلة",
    "country.share": "↗ مشاركة", "country.newSearch": "بحث جديد",
    "country.capital": "العاصمة", "country.area": "المساحة", "country.languages": "اللغات",
    "country.population": "السكان", "country.density": "الكثافة", "country.timezones": "المناطق الزمنية",
    "country.recentIndicators": "أحدث المؤشرات",
    "country.loading": "جارٍ التحميل…",
    "funfact.title": "هل تعلم؟",
    "funfact.loading": "جارٍ البحث عن معلومة…",
    "funfact.close": "إغلاق",
    "funfact.error": "تعذّر جلب معلومة.",
  },
  zh: {
    "nav.home": "首页", "nav.sources": "数据来源", "nav.glossary": "术语", "nav.about": "关于",
    "footer.data": "数据：REST Countries · 世界银行 · 联合国",
    "lang.label": "语言",
    "search.placeholder": "搜索国家（例如：瑞典） — 按 \"/\" 聚焦",
    "section.byRegion": "按地区浏览",
    "section.favourites": "★ 你的收藏",
    "section.mostPopulous": "人口最多",
    "section.leastPopulous": "人口最少",
    "country.back": "返回搜索",
    "country.fav.add": "☆ 加入收藏", "country.fav.remove": "★ 已收藏",
    "country.share": "↗ 分享", "country.newSearch": "新搜索",
    "country.capital": "首都", "country.area": "面积", "country.languages": "语言",
    "country.population": "人口", "country.density": "密度", "country.timezones": "时区",
    "country.recentIndicators": "近期指标",
    "country.loading": "加载中…",
    "funfact.title": "你知道吗？",
    "funfact.loading": "正在寻找有趣的事实…",
    "funfact.close": "关闭",
    "funfact.error": "暂时无法获取。",
  },
  ja: {
    "nav.home": "ホーム", "nav.sources": "出典", "nav.glossary": "用語集", "nav.about": "概要",
    "footer.data": "データ：REST Countries · 世界銀行 · 国連",
    "lang.label": "言語",
    "search.placeholder": "国を検索（例：スウェーデン） —「/」でフォーカス",
    "section.byRegion": "地域別に見る",
    "section.favourites": "★ お気に入り",
    "section.mostPopulous": "人口の多い国",
    "section.leastPopulous": "人口の少ない国",
    "country.back": "検索に戻る",
    "country.fav.add": "☆ お気に入りに追加", "country.fav.remove": "★ お気に入り",
    "country.share": "↗ 共有", "country.newSearch": "新しい検索",
    "country.capital": "首都", "country.area": "面積", "country.languages": "言語",
    "country.population": "人口", "country.density": "人口密度", "country.timezones": "タイムゾーン",
    "country.recentIndicators": "最新の指標",
    "country.loading": "読み込み中…",
    "funfact.title": "知っていましたか？",
    "funfact.loading": "豆知識を探しています…",
    "funfact.close": "閉じる",
    "funfact.error": "情報を取得できませんでした。",
  },
  ru: {
    "nav.home": "Главная", "nav.sources": "Источники", "nav.glossary": "Словарь", "nav.about": "О проекте",
    "footer.data": "Данные: REST Countries · Всемирный банк · ООН",
    "lang.label": "Язык",
    "search.placeholder": "Найдите страну (напр. Швеция) — нажмите \"/\"",
    "section.byRegion": "По регионам",
    "section.favourites": "★ Избранное",
    "section.mostPopulous": "Самые населённые",
    "section.leastPopulous": "Наименее населённые",
    "country.back": "Назад к поиску",
    "country.fav.add": "☆ В избранное", "country.fav.remove": "★ В избранном",
    "country.share": "↗ Поделиться", "country.newSearch": "Новый поиск",
    "country.capital": "Столица", "country.area": "Площадь", "country.languages": "Языки",
    "country.population": "Население", "country.density": "Плотность", "country.timezones": "Часовые пояса",
    "country.recentIndicators": "Последние показатели",
    "country.loading": "Загрузка…",
    "funfact.title": "А вы знали?",
    "funfact.loading": "Ищем интересный факт…",
    "funfact.close": "Закрыть",
    "funfact.error": "Не удалось получить факт.",
  },
  sw: {
    "nav.home": "Mwanzo", "nav.sources": "Vyanzo", "nav.glossary": "Kamusi", "nav.about": "Kuhusu",
    "footer.data": "Data: REST Countries · Benki ya Dunia · UN",
    "lang.label": "Lugha",
    "search.placeholder": "Tafuta nchi (mfano Sweden) — bonyeza \"/\"",
    "section.byRegion": "Kwa eneo",
    "section.favourites": "★ Vipendwa vyako",
    "section.mostPopulous": "Wenye watu wengi",
    "section.leastPopulous": "Wenye watu wachache",
    "country.back": "Rudi kwenye utafutaji",
    "country.fav.add": "☆ Ongeza kipendwa", "country.fav.remove": "★ Kipendwa",
    "country.share": "↗ Shiriki", "country.newSearch": "Tafuta tena",
    "country.capital": "Mji mkuu", "country.area": "Eneo", "country.languages": "Lugha",
    "country.population": "Idadi ya watu", "country.density": "Msongamano", "country.timezones": "Kanda za saa",
    "country.recentIndicators": "Viashiria vya hivi karibuni",
    "country.loading": "Inapakia…",
    "funfact.title": "Je, ulijua?",
    "funfact.loading": "Inatafuta ukweli wa kuvutia…",
    "funfact.close": "Funga",
    "funfact.error": "Imeshindikana kupata ukweli.",
  },
};

const KEY = "vitalstats:lang";
const EVT = "vitalstats:lang-changed";

const Ctx = createContext<{ lang: LangCode; setLang: (l: LangCode) => void; t: (k: string) => string }>({
  lang: "en", setLang: () => {}, t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as LangCode | null;
      if (saved && T[saved]) setLangState(saved);
    } catch { /* ignore */ }
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<LangCode>).detail;
      if (next && T[next]) setLangState(next);
    };
    window.addEventListener(EVT, onChange);
    return () => window.removeEventListener(EVT, onChange);
  }, []);

  const setLang = (l: LangCode) => {
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
    setLangState(l);
    window.dispatchEvent(new CustomEvent(EVT, { detail: l }));
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const t = (k: string) => T[lang]?.[k] ?? T.en[k] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
