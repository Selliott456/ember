import { shopifyQuery, type ShopifyGraphQLError } from './client';
import {
  PRODUCT_LIST_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  CART_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION
} from './queries';
import type {
  Product,
  ProductVariant,
  Cart,
  CartLine,
  Money,
  ShopifyUserError
} from './types';

type ProductListResponse = {
  products: {
    edges: { node: ProductNode }[];
  };
};

type ProductByHandleResponse = {
  product: ProductNode | null;
};

type CartResponse = {
  cart: CartNode | null;
};

type CartCreateResponse = {
  cartCreate: {
    cart: CartNode | null;
    userErrors: ShopifyUserError[];
  };
};

type CartLinesChangeResponse = {
  cartLinesAdd?: {
    cart: CartNode | null;
    userErrors: ShopifyUserError[];
  };
  cartLinesUpdate?: {
    cart: CartNode | null;
    userErrors: ShopifyUserError[];
  };
  cartLinesRemove?: {
    cart: CartNode | null;
    userErrors: ShopifyUserError[];
  };
};

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: Money;
  };
  variants: {
    edges: { node: ProductVariantNode }[];
  };
};

type ProductVariantNode = {
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

type CartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: {
          subtotalAmount: Money;
        };
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            handle: string;
            title: string;
          };
          price: Money;
          availableForSale?: boolean;
        };
      };
    }[];
  };
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type CartLineUpdateInput = {
  id: string;
  quantity?: number;
};

export type ShopifyOperationResult<T> = {
  ok: boolean;
  data?: T;
  userErrors?: ShopifyUserError[];
  errors?: ShopifyGraphQLError[];
};

function mapProduct(node: ProductNode): Product {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    featuredImage: node.featuredImage
      ? {
          url: node.featuredImage.url,
          altText: node.featuredImage.altText
        }
      : undefined,
    priceRange: {
      minVariantPrice: node.priceRange.minVariantPrice
    },
    variants: node.variants.edges.map(({ node: v }) => mapVariant(v))
  };
}

function mapVariant(node: ProductVariantNode): ProductVariant {
  return {
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    price: node.price,
    product: node.product
      ? {
          id: node.product.id,
          handle: node.product.handle,
          title: node.product.title
        }
      : undefined
  };
}

function mapCart(node: CartNode): Cart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    cost: {
      subtotalAmount: node.cost.subtotalAmount,
      totalAmount: node.cost.totalAmount
    },
    lines: node.lines.edges.map(({ node: line }) => ({
      id: line.id,
      quantity: line.quantity,
      cost: {
        subtotalAmount: line.cost.subtotalAmount
      },
      merchandise: mapVariant({
        id: line.merchandise.id,
        title: line.merchandise.title,
        availableForSale: line.merchandise.availableForSale ?? true,
        price: line.merchandise.price,
        product: line.merchandise.product
      })
    }))
  };
}

function extractMutationPayload<T extends { userErrors: ShopifyUserError[] }>(
  root: T | undefined,
  errors?: ShopifyGraphQLError[]
): ShopifyOperationResult<T> {
  if (!root) {
    return {
      ok: false,
      data: undefined,
      userErrors: [],
      errors: errors ?? [{ message: 'Unknown Shopify mutation error' }]
    };
  }

  const hasUserErrors = root.userErrors && root.userErrors.length > 0;

  return {
    ok: !hasUserErrors && !(errors && errors.length),
    data: root,
    userErrors: root.userErrors,
    errors
  };
}

export async function getProducts(
  first = 20
): Promise<ShopifyOperationResult<Product[]>> {
  const res = await shopifyQuery<ProductListResponse>({
    query: PRODUCT_LIST_QUERY,
    variables: { first }
  });

  if (!res.ok || !res.data?.products) {
    return {
      ok: false,
      data: [],
      errors: res.errors ?? [{ message: 'Failed to fetch products' }]
    };
  }

  const products = res.data.products.edges.map(({ node }) => mapProduct(node));

  return {
    ok: true,
    data: products
  };
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyOperationResult<Product | null>> {
  const res = await shopifyQuery<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle }
  });

  if (!res.ok) {
    return {
      ok: false,
      data: null,
      errors: res.errors ?? [{ message: 'Failed to fetch product' }]
    };
  }

  const productNode = res.data?.product ?? null;

  return {
    ok: true,
    data: productNode ? mapProduct(productNode) : null
  };
}

export async function getCart(
  cartId: string
): Promise<ShopifyOperationResult<Cart | null>> {
  const res = await shopifyQuery<CartResponse>({
    query: CART_QUERY,
    variables: { id: cartId }
  });

  if (!res.ok) {
    return {
      ok: false,
      data: null,
      errors: res.errors ?? [{ message: 'Failed to fetch cart' }]
    };
  }

  const cartNode = res.data?.cart ?? null;

  return {
    ok: true,
    data: cartNode ? mapCart(cartNode) : null
  };
}

export async function createCart(
  lines?: CartLineInput[]
): Promise<ShopifyOperationResult<Cart>> {
  const res = await shopifyQuery<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines
      }
    }
  });

  const payload = extractMutationPayload(res.data?.cartCreate, res.errors);

  if (!payload.ok || !payload.data?.cart) {
    return {
      ok: false,
      data: undefined,
      userErrors: payload.userErrors,
      errors: payload.errors
    };
  }

  return {
    ok: true,
    data: mapCart(payload.data.cart),
    userErrors: payload.userErrors
  };
}

export async function getOrCreateCart(
  cartId?: string | null
): Promise<ShopifyOperationResult<Cart>> {
  if (cartId) {
    const existing = await getCart(cartId);
    if (existing.ok && existing.data) {
      return existing as ShopifyOperationResult<Cart>;
    }
  }

  return createCart();
}

export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number
): Promise<ShopifyOperationResult<Cart>> {
  const res = await shopifyQuery<CartLinesChangeResponse>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }]
    }
  });

  const payload = extractMutationPayload(res.data?.cartLinesAdd, res.errors);

  if (!payload.ok || !payload.data?.cart) {
    return {
      ok: false,
      data: undefined,
      userErrors: payload.userErrors,
      errors: payload.errors
    };
  }

  return {
    ok: true,
    data: mapCart(payload.data.cart),
    userErrors: payload.userErrors
  };
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<ShopifyOperationResult<Cart>> {
  const res = await shopifyQuery<CartLinesChangeResponse>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines
    }
  });

  const payload = extractMutationPayload(
    res.data?.cartLinesUpdate,
    res.errors
  );

  if (!payload.ok || !payload.data?.cart) {
    return {
      ok: false,
      data: undefined,
      userErrors: payload.userErrors,
      errors: payload.errors
    };
  }

  return {
    ok: true,
    data: mapCart(payload.data.cart),
    userErrors: payload.userErrors
  };
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyOperationResult<Cart>> {
  const res = await shopifyQuery<CartLinesChangeResponse>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds
    }
  });

  const payload = extractMutationPayload(
    res.data?.cartLinesRemove,
    res.errors
  );

  if (!payload.ok || !payload.data?.cart) {
    return {
      ok: false,
      data: undefined,
      userErrors: payload.userErrors,
      errors: payload.errors
    };
  }

  return {
    ok: true,
    data: mapCart(payload.data.cart),
    userErrors: payload.userErrors
  };
}

export type {
  Product,
  ProductVariant,
  Cart,
  CartLine,
  Money,
  ShopifyUserError
};

