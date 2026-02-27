export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  product?: {
    id: string;
    handle: string;
    title: string;
  };
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  /** Shopify product tags, e.g. "fieldnotes", "basecamp", "conditions". */
  tags?: string[];
  featuredImage?: {
    url: string;
    altText: string | null;
  };
  /** Product images (from images(first: N)); detail page uses full set, list/collection may have first 2. */
  images?: ProductImage[];
  priceRange: {
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    subtotalAmount: Money;
  };
  merchandise: ProductVariant;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
};

export type ShopifyUserError = {
  field?: string[] | null;
  message: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: {
    url: string;
    altText: string | null;
  };
  products?: Product[];
};

