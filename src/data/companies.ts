export type Company = {
  name: string;
  slug: string;
  type: string;
  location: string;
  description: string;
};

export const companies: Company[] = [
  {
    name: "Nyumbani Collection",
    slug: "nyumbani-collection",
    type: "Camp Brand",
    location: "Tanzania",
    description:
      "Nyumbani Collection operates several safari camps across northern Tanzania and hosts its trade profiles on the Safari Trade Directory.",
  },
];
