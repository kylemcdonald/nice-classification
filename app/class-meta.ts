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
  image: string;
  group: GroupName;
};

const classDefinitions: Array<Omit<ClassMeta, "image">> = [
  { shortName: "Chemicals", group: "science" },
  { shortName: "Paints", group: "science" },
  { shortName: "Cosmetics & cleaning", group: "science" },
  { shortName: "Oils & fuels", group: "science" },
  { shortName: "Pharma", group: "science" },
  { shortName: "Metal goods", group: "technology" },
  { shortName: "Machinery", group: "technology" },
  { shortName: "Hand tools", group: "technology" },
  { shortName: "Tech & software", group: "technology" },
  { shortName: "Medical devices", group: "technology" },
  { shortName: "Lighting & heating", group: "technology" },
  { shortName: "Vehicles", group: "technology" },
  { shortName: "Firearms", group: "technology" },
  { shortName: "Jewelry", group: "culture" },
  { shortName: "Musical instruments", group: "culture" },
  { shortName: "Paper goods", group: "culture" },
  { shortName: "Rubber & plastics", group: "materials" },
  { shortName: "Leather goods", group: "materials" },
  { shortName: "Building materials", group: "materials" },
  { shortName: "Furniture", group: "materials" },
  { shortName: "Housewares", group: "materials" },
  { shortName: "Ropes & fibers", group: "materials" },
  { shortName: "Yarns & threads", group: "materials" },
  { shortName: "Textiles", group: "materials" },
  { shortName: "Clothing", group: "lifestyle" },
  { shortName: "Trims & fasteners", group: "lifestyle" },
  { shortName: "Floor coverings", group: "lifestyle" },
  { shortName: "Toys & sports", group: "lifestyle" },
  { shortName: "Meat & dairy", group: "food" },
  { shortName: "Staple foods", group: "food" },
  { shortName: "Farm goods", group: "food" },
  { shortName: "Soft drinks", group: "food" },
  { shortName: "Alcoholic drinks", group: "food" },
  { shortName: "Tobacco", group: "food" },
  { shortName: "Business", group: "commerce" },
  { shortName: "Finance", group: "commerce" },
  { shortName: "Construction", group: "infrastructure" },
  { shortName: "Telecoms", group: "infrastructure" },
  { shortName: "Transport", group: "infrastructure" },
  { shortName: "Material treatment", group: "infrastructure" },
  { shortName: "Education & entertainment", group: "knowledge" },
  { shortName: "Science & tech", group: "knowledge" },
  { shortName: "Food & lodging", group: "care" },
  { shortName: "Health & beauty", group: "care" },
  { shortName: "Legal & security", group: "care" },
];

export const classMeta: ClassMeta[] = classDefinitions.map((definition, index) => ({
  ...definition,
  image: `/class-icons/class-${String(index + 1).padStart(2, "0")}.png`,
}));
