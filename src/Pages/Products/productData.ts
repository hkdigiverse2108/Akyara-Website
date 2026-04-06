import type { ProductCategory, ProductItem } from "../../Types";


const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const products: ProductItem[] = [
  {
    id: "product-1",
    name: "Classic Oxford Shirt",
    category: "Shirts",
    categoryLabel: "Tailored Shirts",
    price: "Rs 1,299",
    oldPrice: "Rs 1,699",
    badge: "Best Seller",
    image: assetUrl("assets/1.jpg"),
    description:
      "Structured everyday shirt with a crisp collar, breathable cotton finish, and a polished profile that moves from desk to dinner.",
    sku: "AKY-SH-2401",
    rating: 4.8,
    reviews: 412,
    availability: "In Stock",
    colors: [
      { name: "Teal", swatch: "#2d8f80" },
      { name: "Mist", swatch: "#dfe7f2" },
      { name: "Sunset", swatch: "#e06d42" },
      { name: "Butter", swatch: "#f3e089" },
      { name: "Lilac", swatch: "#ead9f9" },
      { name: "Navy", swatch: "#5a7ec1" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50"],
    gallery: [
      assetUrl("assets/1.jpg"),
      assetUrl("assets/2.jpg"),
      assetUrl("assets/3.jpg"),
      assetUrl("assets/4.jpg"),
      assetUrl("assets/5.jpg"),
      assetUrl("assets/8.jpg"),
    ],
  },
  {
    id: "product-2",
    name: "Relaxed Utility Shirt",
    category: "Shirts",
    categoryLabel: "Tailored Shirts",
    price: "Rs 1,149",
    badge: "New",
    image: assetUrl("assets/2.jpg"),
    description:
      "Relaxed silhouette built for easy layering, with a soft brushed feel and sharp stitch details for off-duty styling.",
    sku: "AKY-SH-2402",
    rating: 4.6,
    reviews: 188,
    availability: "In Stock",
    colors: [
      { name: "Sage", swatch: "#7fa07f" },
      { name: "Sand", swatch: "#e7dcc6" },
      { name: "Stone", swatch: "#c8cfda" },
      { name: "Ink", swatch: "#223047" },
    ],
    sizes: ["30", "32", "34", "36", "38", "40", "42", "44"],
    gallery: [
      assetUrl("assets/2.jpg"),
      assetUrl("assets/1.jpg"),
      assetUrl("assets/7.jpg"),
      assetUrl("assets/3.jpg"),
    ],
  },
  {
    id: "product-3",
    name: "Minimal Crew Tee",
    category: "T-Shirts",
    categoryLabel: "Everyday Tees",
    price: "Rs 799",
    oldPrice: "Rs 999",
    image: assetUrl("assets/3.jpg"),
    description:
      "Soft jersey tee with a clean neckline and an easy everyday fit, designed to layer smoothly under jackets or overshirts.",
    sku: "AKY-TS-1101",
    rating: 4.5,
    reviews: 206,
    availability: "In Stock",
    colors: [
      { name: "Forest", swatch: "#2f7d73" },
      { name: "Cloud", swatch: "#dce6f1" },
      { name: "Coral", swatch: "#e9784c" },
      { name: "Cream", swatch: "#f7efb0" },
      { name: "Periwinkle", swatch: "#6d8fd1" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gallery: [
      assetUrl("assets/3.jpg"),
      assetUrl("assets/4.jpg"),
      assetUrl("assets/8.jpg"),
      assetUrl("assets/6.jpg"),
    ],
  },
  {
    id: "product-4",
    name: "Weekend Graphic Tee",
    category: "T-Shirts",
    categoryLabel: "Everyday Tees",
    price: "Rs 899",
    badge: "Hot",
    image: assetUrl("assets/4.jpg"),
    description:
      "Garment-washed comfort with a bold front graphic and a relaxed drape that feels easy from brunch to late evenings.",
    sku: "AKY-TS-1102",
    rating: 4.7,
    reviews: 143,
    availability: "Low Stock",
    colors: [
      { name: "Black", swatch: "#1f2937" },
      { name: "Off White", swatch: "#f6f3ea" },
      { name: "Rust", swatch: "#d55f33" },
    ],
    sizes: ["S", "M", "L", "XL"],
    gallery: [
      assetUrl("assets/4.jpg"),
      assetUrl("assets/3.jpg"),
      assetUrl("assets/8.jpg"),
      assetUrl("assets/1.jpg"),
    ],
  },
  {
    id: "product-5",
    name: "Slim Taper Jeans",
    category: "Jeans",
    categoryLabel: "Modern Denim",
    price: "Rs 1,999",
    oldPrice: "Rs 2,399",
    badge: "Sale",
    image: assetUrl("assets/5.jpg"),
    description:
      "Stretch denim with a slim taper leg, balanced rise, and a dark-wash finish that works with sneakers or loafers alike.",
    sku: "AKY-JN-5101",
    rating: 4.8,
    reviews: 321,
    availability: "In Stock",
    colors: [
      { name: "Indigo", swatch: "#33568f" },
      { name: "Faded Blue", swatch: "#94b3df" },
      { name: "Charcoal", swatch: "#4b5563" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    gallery: [
      assetUrl("assets/5.jpg"),
      assetUrl("assets/6.jpg"),
      assetUrl("assets/3.jpg"),
      assetUrl("assets/2.jpg"),
    ],
  },
  {
    id: "product-6",
    name: "Relaxed Blue Denim",
    category: "Jeans",
    categoryLabel: "Modern Denim",
    price: "Rs 2,149",
    image: assetUrl("assets/6.jpg"),
    description:
      "Roomier fit through the thigh with a straight hem opening and a lighter wash made for easy seasonal styling.",
    sku: "AKY-JN-5102",
    rating: 4.4,
    reviews: 98,
    availability: "In Stock",
    colors: [
      { name: "Sky", swatch: "#9fc2eb" },
      { name: "Blue Grey", swatch: "#6f87a6" },
      { name: "Sand", swatch: "#ddd1bf" },
    ],
    sizes: ["30", "32", "34", "36", "38", "40", "42", "44"],
    gallery: [
      assetUrl("assets/6.jpg"),
      assetUrl("assets/5.jpg"),
      assetUrl("assets/4.jpg"),
      assetUrl("assets/8.jpg"),
    ],
  },
  {
    id: "product-7",
    name: "Tailored Stripe Shirt",
    category: "Shirts",
    categoryLabel: "Tailored Shirts",
    price: "Rs 1,399",
    badge: "Editor Pick",
    image: assetUrl("assets/7.jpg"),
    description:
      "Fine vertical stripes and refined tailoring give this shirt a sharper profile without sacrificing everyday comfort.",
    sku: "AKY-SH-2407",
    rating: 4.9,
    reviews: 267,
    availability: "In Stock",
    colors: [
      { name: "Sky Stripe", swatch: "#9ebfe8" },
      { name: "Mauve", swatch: "#cdbfe0" },
      { name: "Pearl", swatch: "#ece7dd" },
    ],
    sizes: ["30", "32", "34", "36", "38", "40", "42"],
    gallery: [
      assetUrl("assets/7.jpg"),
      assetUrl("assets/1.jpg"),
      assetUrl("assets/2.jpg"),
      assetUrl("assets/5.jpg"),
    ],
  },
  {
    id: "product-8",
    name: "Boxy Everyday Tee",
    category: "T-Shirts",
    categoryLabel: "Everyday Tees",
    price: "Rs 849",
    image: assetUrl("assets/8.jpg"),
    description:
      "Slightly boxy proportions with a premium hand-feel, durable rib neck, and a clean hem that sits just right.",
    sku: "AKY-TS-1108",
    rating: 4.3,
    reviews: 76,
    availability: "In Stock",
    colors: [
      { name: "Ice", swatch: "#d7e6f6" },
      { name: "Rose", swatch: "#f0d5e5" },
      { name: "Blue", swatch: "#6c8fc6" },
    ],
    sizes: ["S", "M", "L", "XL"],
    gallery: [
      assetUrl("assets/8.jpg"),
      assetUrl("assets/3.jpg"),
      assetUrl("assets/4.jpg"),
      assetUrl("assets/6.jpg"),
    ],
  },
];

export const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-[#111827]",
  New: "bg-[#0f9d58]",
  Hot: "bg-[#ef6b4a]",
  Sale: "bg-[#c62828]",
  "Editor Pick": "bg-[#7c3aed]",
};

export const getProductDetailPath = (id: string) => `/products/${id}`;

export const getProductsByCategory = (category: ProductCategory) =>
  category === "All" ? products : products.filter((product) => product.category === category);

export const getProductById = (id?: string) =>
  products.find((product) => product.id === id) ?? null;
