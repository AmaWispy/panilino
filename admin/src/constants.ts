export const EVENT_TYPES = [
    "Wedding",
    "Cumetrie",
    "Birthday",
    "Corporate Event",
    "Other",
];

export const CAKE_SHAPES = [
    "Square",
    "Round",
    "Rectangular",
    "Triangular",
    "Other models",
];

export const CAKE_LEVELS = [1, 2, 3, 4, 5, 6, "7+"];

export const FILLINGS = [
    "Alb negru",
    "Catifea roșie",
    "Chichiță de seară",
    "De casă",
    "Diplomat",
    "Evantai",
    "Gingășie",
    "Lady ananas",
    "Lady vișină",
    "Magie",
    "Nuvella",
    "Primăvara",
    "Prințul negru",
    "Sârbătoare",
    "Smântânel",
    "Șah-mat",
    "Tiramisu",
    "Tradițional cu nuca",
    "Tradițional cu vișină",
    "Fetita de lapte",
    "Praga - Catifea roșie",
    "Cu morcov",
    "Melancolie",
    "Fistic",
    "Alt continut",
];

export const FRUIT_ADDONS = [
    "Banana",
    "Cherry",
    "Kiwi",
    "Pineapple",
    "Chickpea",
];

export const DECOR_ADDONS = [
    "Fruit",
    "Sugar paste",
    "Cream",
];

/** Base URL for storage (images). VITE_API_URL is e.g. http://localhost:8000/api → base is http://localhost:8000 */
export const getStorageUrl = (path: string): string => {
  if (!path) return "";
  const api = typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL
    ? (import.meta as any).env.VITE_API_URL
    : "";
  const base = api.replace(/\/api\/?$/, "") || "http://localhost:8000";
  return `${base}/storage/${path}`;
};

export const ORDER_STATUSES = [
    { label: "Inregistrata", value: "inregistrata" },
    { label: "Transmisa catre producere", value: "transmisa_catre_producere" },
    { label: "Preluata producere", value: "preluata_producere" },
    { label: "In lucru", value: "in_lucru" },
    { label: "Gata de livrare", value: "gata_de_livrare" },
    { label: "Depozit Panilino", value: "depozit_panilino" },
    { label: "Showroom", value: "showroom" },
    { label: "Preluata sofer", value: "preluata_sofer" },
    { label: "Livrata", value: "livrata" },
];
