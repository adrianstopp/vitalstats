import { useEffect, useState } from "react";

const KEY = "vitalstats:favourites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(list: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("vitalstats:favourites-changed"));
}

export function useFavourites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    setFavs(read());
    const onChange = () => setFavs(read());
    window.addEventListener("vitalstats:favourites-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("vitalstats:favourites-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    favourites: favs,
    isFavourite: (code: string) => favs.includes(code),
    toggle: (code: string) => {
      const next = favs.includes(code) ? favs.filter((c) => c !== code) : [...favs, code];
      write(next);
    },
  };
}
