import {
  mdiAntenna,
  mdiAnvil,
  mdiBank,
  mdiBook,
  mdiBottleSodaClassic,
  mdiBottleWine,
  mdiBreadSlice,
  mdiCar,
  mdiCigar,
  mdiCodeBraces,
  mdiCog,
  mdiDiamondStone,
  mdiFactory,
  mdiFlask,
  mdiFoodDrumstick,
  mdiGasStation,
  mdiGuitarAcoustic,
  mdiHammerWrench,
  mdiAccountHardHat,
  mdiHeartPulse,
  mdiLasso,
  mdiLaptop,
  mdiLightbulbOn,
  mdiPalette,
  mdiPill,
  mdiPistol,
  mdiPurse,
  mdiRug,
  mdiScaleBalance,
  mdiSchool,
  mdiSilverwareForkKnife,
  mdiSoccer,
  mdiSofa,
  mdiSprayBottle,
  mdiSprout,
  mdiStethoscope,
  mdiStore,
  mdiTruckDelivery,
  mdiTshirtCrew,
  mdiWall,
} from "@mdi/js";

// These compact stamp silhouettes cover objects that Material Design Icons
// does not represent plainly enough at the overview's small display size.
const mdiRubberRoll =
  "M4 5.5H16.5A6.5 6.5 0 1 1 16.5 18.5H4A2 2 0 0 1 2 16.5V7.5A2 2 0 0 1 4 5.5Z" +
  "M16.5 8A4 4 0 1 0 16.5 16A4 4 0 0 0 16.5 8Z" +
  "M16.5 10.5A1.5 1.5 0 1 1 16.5 13.5A1.5 1.5 0 0 1 16.5 10.5Z";

const mdiComb =
  "M4 3H20A2 2 0 0 1 22 5V8H4A2 2 0 0 1 2 6V5A2 2 0 0 1 4 3Z" +
  "M4 8H6V20A1 1 0 0 1 4 20V8Z" +
  "M8 8H10V18A1 1 0 0 1 8 18V8Z" +
  "M12 8H14V16A1 1 0 0 1 12 16V8Z" +
  "M16 8H18V14A1 1 0 0 1 16 14V8Z" +
  "M20 8H22V12A1 1 0 0 1 20 12V8Z";

const mdiThreadSpool =
  "M5 3H19A2 2 0 0 1 19 7H17L16 9V11H22V13H16V15L17 17H19" +
  "A2 2 0 0 1 19 21H5A2 2 0 0 1 5 17H7L8 15V9L7 7H5A2 2 0 0 1 5 3Z" +
  "M8 10H16V11H8ZM8 13H16V14H8Z";

const mdiPillow =
  "M5.3 3.6C9 5 15 5 18.7 3.6C20.4 5.5 20.4 8 20 12" +
  "C20.4 16 20.4 18.5 18.7 20.4C15 19 9 19 5.3 20.4" +
  "C3.6 18.5 3.6 16 4 12C3.6 8 3.6 5.5 5.3 3.6Z" +
  "M7.25 7.25C6.6 10.1 6.6 13.9 7.25 16.75C10.1 16.1 13.9 16.1 16.75 16.75" +
  "C16.1 13.9 16.1 10.1 16.75 7.25C13.9 7.9 10.1 7.9 7.25 7.25Z";

// mdiSoccer intentionally leaves its front-facing panel open. This overlay
// fills just that pentagon while preserving the familiar ball construction.
const mdiSoccerFrontPanel = "M12 8.43L15.62 10.97L14.25 15H9.75L8.38 10.97Z";

// A sew-on button is a more immediate symbol for Nice Class 26 than a needle:
// buttons are specifically named in the class heading, and the four holes keep
// the silhouette recognizable even at the compact overview size.
const mdiSewOnButton =
  "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" +
  "M8.5,7A1.5,1.5 0 1,1 8.5,10A1.5,1.5 0 1,1 8.5,7Z" +
  "M15.5,7A1.5,1.5 0 1,1 15.5,10A1.5,1.5 0 1,1 15.5,7Z" +
  "M8.5,14A1.5,1.5 0 1,1 8.5,17A1.5,1.5 0 1,1 8.5,14Z" +
  "M15.5,14A1.5,1.5 0 1,1 15.5,17A1.5,1.5 0 1,1 15.5,14Z";

export const groupAccents = {
  science: "#9b3c32",
  technology: "#285f85",
  culture: "#704875",
  materials: "#746421",
  lifestyle: "#9a572f",
  food: "#36704b",
  commerce: "#8a610d",
  infrastructure: "#267177",
  knowledge: "#59488c",
  care: "#8d3c58",
} as const;

export type GroupName = keyof typeof groupAccents;

export type ClassMeta = {
  shortName: string;
  icon: string;
  iconOverlay?: string;
  fillRule?: "evenodd";
  group: GroupName;
};

export const classMeta: ClassMeta[] = [
  { shortName: "Chemicals", icon: mdiFlask, group: "science" },
  { shortName: "Paints", icon: mdiPalette, group: "science" },
  { shortName: "Cosmetics & cleaning", icon: mdiSprayBottle, group: "science" },
  { shortName: "Oils & fuels", icon: mdiGasStation, group: "science" },
  { shortName: "Pharma", icon: mdiPill, group: "science" },
  { shortName: "Metal goods", icon: mdiAnvil, group: "technology" },
  { shortName: "Machinery", icon: mdiCog, group: "technology" },
  { shortName: "Hand tools", icon: mdiHammerWrench, group: "technology" },
  { shortName: "Tech & software", icon: mdiLaptop, group: "technology" },
  { shortName: "Medical devices", icon: mdiStethoscope, group: "technology" },
  { shortName: "Lighting & heating", icon: mdiLightbulbOn, group: "technology" },
  { shortName: "Vehicles", icon: mdiCar, group: "technology" },
  { shortName: "Firearms", icon: mdiPistol, group: "technology" },
  { shortName: "Jewelry", icon: mdiDiamondStone, group: "culture" },
  { shortName: "Musical instruments", icon: mdiGuitarAcoustic, group: "culture" },
  { shortName: "Paper goods", icon: mdiBook, group: "culture" },
  { shortName: "Rubber & plastics", icon: mdiRubberRoll, fillRule: "evenodd", group: "materials" },
  { shortName: "Leather goods", icon: mdiPurse, group: "materials" },
  { shortName: "Building materials", icon: mdiWall, group: "materials" },
  { shortName: "Furniture", icon: mdiSofa, group: "materials" },
  { shortName: "Housewares", icon: mdiComb, group: "materials" },
  { shortName: "Ropes & fibers", icon: mdiLasso, group: "materials" },
  { shortName: "Yarns & threads", icon: mdiThreadSpool, fillRule: "evenodd", group: "materials" },
  { shortName: "Textiles", icon: mdiPillow, fillRule: "evenodd", group: "materials" },
  { shortName: "Clothing", icon: mdiTshirtCrew, group: "lifestyle" },
  { shortName: "Trims & fasteners", icon: mdiSewOnButton, group: "lifestyle" },
  { shortName: "Floor coverings", icon: mdiRug, group: "lifestyle" },
  { shortName: "Toys & sports", icon: mdiSoccer, iconOverlay: mdiSoccerFrontPanel, group: "lifestyle" },
  { shortName: "Meat & dairy", icon: mdiFoodDrumstick, group: "food" },
  { shortName: "Staple foods", icon: mdiBreadSlice, group: "food" },
  { shortName: "Farm goods", icon: mdiSprout, group: "food" },
  { shortName: "Soft drinks", icon: mdiBottleSodaClassic, group: "food" },
  { shortName: "Alcoholic drinks", icon: mdiBottleWine, group: "food" },
  { shortName: "Tobacco", icon: mdiCigar, group: "food" },
  { shortName: "Business", icon: mdiStore, group: "commerce" },
  { shortName: "Finance", icon: mdiBank, group: "commerce" },
  { shortName: "Construction", icon: mdiAccountHardHat, group: "infrastructure" },
  { shortName: "Telecoms", icon: mdiAntenna, group: "infrastructure" },
  { shortName: "Transport", icon: mdiTruckDelivery, group: "infrastructure" },
  { shortName: "Material treatment", icon: mdiFactory, group: "infrastructure" },
  { shortName: "Education & entertainment", icon: mdiSchool, group: "knowledge" },
  { shortName: "Science & tech", icon: mdiCodeBraces, group: "knowledge" },
  { shortName: "Food & lodging", icon: mdiSilverwareForkKnife, group: "care" },
  { shortName: "Health & beauty", icon: mdiHeartPulse, group: "care" },
  { shortName: "Legal & security", icon: mdiScaleBalance, group: "care" },
];
