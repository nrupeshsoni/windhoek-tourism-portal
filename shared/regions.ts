/**
 * Namibia's 14 Administrative Regions
 * Used for filtering listings by region
 */

export interface Region {
  id: string;
  name: string;
  capital: string;
  description: string;
  highlights: string[];
}

export const NAMIBIA_REGIONS: Region[] = [
  {
    id: "erongo",
    name: "Erongo",
    capital: "Swakopmund",
    description: "Coastal region known for adventure activities, German colonial architecture, and the Namib Desert",
    highlights: ["Swakopmund", "Walvis Bay", "Spitzkoppe", "Skeleton Coast"],
  },
  {
    id: "hardap",
    name: "Hardap",
    capital: "Mariental",
    description: "Home to the Fish River Canyon, Africa's largest canyon, and the Hardap Dam",
    highlights: ["Fish River Canyon", "Hardap Dam", "Brukkaros Crater"],
  },
  {
    id: "karas",
    name: "//Karas",
    capital: "Keetmanshoop",
    description: "Southern region featuring the Quiver Tree Forest and Ai-Ais Hot Springs",
    highlights: ["Quiver Tree Forest", "Ai-Ais Hot Springs", "Lüderitz", "Kolmanskop"],
  },
  {
    id: "kavango-east",
    name: "Kavango East",
    capital: "Rundu",
    description: "Lush region along the Okavango River with rich cultural heritage",
    highlights: ["Okavango River", "Popa Falls", "Traditional Villages"],
  },
  {
    id: "kavango-west",
    name: "Kavango West",
    capital: "Nkurenkuru",
    description: "Western Kavango region with riverside communities and wildlife",
    highlights: ["Okavango River", "Community Conservancies"],
  },
  {
    id: "khomas",
    name: "Khomas",
    capital: "Windhoek",
    description: "Central region containing Namibia's capital city and surrounding highlands",
    highlights: ["Windhoek", "Daan Viljoen Game Park", "Heroes' Acre"],
  },
  {
    id: "kunene",
    name: "Kunene",
    capital: "Opuwo",
    description: "Remote northwestern region home to the Himba people and desert-adapted elephants",
    highlights: ["Epupa Falls", "Himba Villages", "Damaraland", "Desert Elephants"],
  },
  {
    id: "ohangwena",
    name: "Ohangwena",
    capital: "Eenhana",
    description: "Northern region bordering Angola with traditional Owambo culture",
    highlights: ["Ondangwa", "Traditional Homesteads"],
  },
  {
    id: "omaheke",
    name: "Omaheke",
    capital: "Gobabis",
    description: "Eastern region known for cattle ranching and Kalahari landscapes",
    highlights: ["Kalahari Desert", "Buitepos Border Post"],
  },
  {
    id: "omusati",
    name: "Omusati",
    capital: "Outapi",
    description: "Northwestern region with traditional Owambo culture and seasonal wetlands",
    highlights: ["Ruacana Falls", "Oshanas (Seasonal Wetlands)"],
  },
  {
    id: "oshana",
    name: "Oshana",
    capital: "Oshakati",
    description: "Central northern region with Namibia's second-largest city",
    highlights: ["Oshakati", "Ondangwa", "Traditional Markets"],
  },
  {
    id: "oshikoto",
    name: "Oshikoto",
    capital: "Tsumeb",
    description: "Region featuring Etosha National Park's eastern section and mining heritage",
    highlights: ["Etosha National Park", "Lake Otjikoto", "Tsumeb Museum"],
  },
  {
    id: "otjozondjupa",
    name: "Otjozondjupa",
    capital: "Otjiwarongo",
    description: "Central region with game farms, cheetah conservation, and Waterberg Plateau",
    highlights: ["Waterberg Plateau", "AfriCat Foundation", "Okonjima"],
  },
  {
    id: "zambezi",
    name: "Zambezi",
    capital: "Katima Mulilo",
    description: "Northeastern panhandle region with lush wetlands and four rivers",
    highlights: ["Caprivi Strip", "Bwabwata National Park", "Zambezi River"],
  },
];

// Map common location names to regions
export const LOCATION_TO_REGION: Record<string, string> = {
  // Erongo
  "swakopmund": "erongo",
  "walvis bay": "erongo",
  "walvis": "erongo",
  "spitzkoppe": "erongo",
  "henties bay": "erongo",
  "skeleton coast": "erongo",
  "usakos": "erongo",
  "karibib": "erongo",
  "omaruru": "erongo",
  
  // Hardap
  "mariental": "hardap",
  "fish river": "hardap",
  "maltahohe": "hardap",
  "stampriet": "hardap",
  "rehoboth": "hardap",
  
  // //Karas
  "keetmanshoop": "karas",
  "luderitz": "karas",
  "lüderitz": "karas",
  "kolmanskop": "karas",
  "ai-ais": "karas",
  "aus": "karas",
  "karasburg": "karas",
  "oranjemund": "karas",
  
  // Kavango East
  "rundu": "kavango-east",
  "divundu": "kavango-east",
  "popa falls": "kavango-east",
  
  // Kavango West
  "nkurenkuru": "kavango-west",
  
  // Khomas
  "windhoek": "khomas",
  "daan viljoen": "khomas",
  "hosea kutako": "khomas",
  
  // Kunene
  "opuwo": "kunene",
  "epupa": "kunene",
  "damaraland": "kunene",
  "khorixas": "kunene",
  "sesfontein": "kunene",
  "palmwag": "kunene",
  "twyfelfontein": "kunene",
  
  // Ohangwena
  "eenhana": "ohangwena",
  "ondangwa": "ohangwena",
  
  // Omaheke
  "gobabis": "omaheke",
  "buitepos": "omaheke",
  
  // Omusati
  "outapi": "omusati",
  "ruacana": "omusati",
  
  // Oshana
  "oshakati": "oshana",
  
  // Oshikoto
  "tsumeb": "oshikoto",
  "etosha": "oshikoto",
  "otjikoto": "oshikoto",
  "namutoni": "oshikoto",
  
  // Otjozondjupa
  "otjiwarongo": "otjozondjupa",
  "waterberg": "otjozondjupa",
  "okonjima": "otjozondjupa",
  "grootfontein": "otjozondjupa",
  "okahandja": "otjozondjupa",
  
  // Zambezi (Caprivi)
  "katima mulilo": "zambezi",
  "katima": "zambezi",
  "caprivi": "zambezi",
  "zambezi": "zambezi",
  "kongola": "zambezi",
  
  // Special areas
  "sossusvlei": "hardap",
  "sesriem": "hardap",
  "namib-naukluft": "hardap",
  "naukluft": "hardap",
  "solitaire": "hardap",
};

// Get region by ID
export const getRegionById = (id: string): Region | undefined => {
  return NAMIBIA_REGIONS.find(r => r.id === id);
};

// Get region ID from location string
export const getRegionFromLocation = (location: string): string | undefined => {
  const normalized = location.toLowerCase().trim();
  
  // Direct match
  if (LOCATION_TO_REGION[normalized]) {
    return LOCATION_TO_REGION[normalized];
  }
  
  // Partial match
  for (const [key, regionId] of Object.entries(LOCATION_TO_REGION)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return regionId;
    }
  }
  
  return undefined;
};

export default NAMIBIA_REGIONS;
