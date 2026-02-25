import {
  shopifyQuery,
  ShopifyGraphQLClientError,
  type ShopifyGraphQLError
} from './client';
import { logShopify } from './logger';
import {
  PRODUCT_LIST_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
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
  Collection,
  Money,
  ShopifyUserError
} from './types';
import { isCartNotFoundFromMessage } from '$lib/server/cartCookie';

/** Structured error for API routes: code + message + suggested HTTP status. */
export type ShopifyStructuredError = {
  code: string;
  message: string;
  requestId?: string;
};

type ProductListResponse = {
  products: {
    edges: { node: ProductNode }[];
  };
};

type ProductByHandleResponse = {
  product: ProductNode | null;
};

type CollectionsListResponse = {
  collections: {
    edges: { node: CollectionNode }[];
  };
};

type CollectionByHandleResponse = {
  collection: CollectionWithProductsNode | null;
};

type CollectionNode = {
  id: string;
  handle: string;
  title: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
};

type CollectionWithProductsNode = CollectionNode & {
  description?: string | null;
  products: {
    edges: { node: ProductNode }[];
  };
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

type ProductImageNode = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
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
  images?: {
    edges: { node: ProductImageNode }[];
  };
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
  /** Set when ok is false; use for consistent API error JSON and status. */
  error?: ShopifyStructuredError;
  /** Suggested HTTP status (400 user/validation, 502 upstream). */
  status?: number;
};

function mapProduct(node: ProductNode): Product {
  const images =
    node.images?.edges?.map(({ node: img }) => ({
      url: img.url,
      altText: img.altText,
      ...(img.width != null && { width: img.width }),
      ...(img.height != null && { height: img.height })
    })) ?? undefined;
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
    images: images?.length ? images : undefined,
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

function mapCollection(node: CollectionNode): Collection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    image: node.image
      ? { url: node.image.url, altText: node.image.altText }
      : undefined
  };
}

function mapCollectionWithProducts(node: CollectionWithProductsNode): Collection {
  return {
    ...mapCollection(node),
    description: node.description || undefined,
    products: node.products.edges.map(({ node: p }) => mapProduct(p))
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

function userErrorMessage(userErrors: ShopifyUserError[]): string {
  return userErrors.map((e) => e.message).join('; ') || 'Validation failed';
}

function extractMutationPayload<T extends { userErrors: ShopifyUserError[] }>(
  root: T | undefined,
  errors?: ShopifyGraphQLError[]
): ShopifyOperationResult<T> {
  if (!root) {
    const message = errors?.map((e) => e.message).join('; ') ?? 'Unknown Shopify mutation error';
    const cartNotFound = isCartNotFoundFromMessage(undefined, errors);
    return {
      ok: false,
      data: undefined,
      userErrors: [],
      errors: errors ?? [{ message: 'Unknown Shopify mutation error' }],
      error: {
        code: cartNotFound ? 'CART_NOT_FOUND' : 'SHOPIFY_ERROR',
        message
      },
      status: cartNotFound ? 404 : 502
    };
  }

  const hasUserErrors = root.userErrors && root.userErrors.length > 0;
  const hasGraphQLErrors = Boolean(errors?.length);

  if (hasUserErrors) {
    const message = userErrorMessage(root.userErrors);
    const cartNotFound = isCartNotFoundFromMessage(undefined, root.userErrors);
    return {
      ok: false,
      data: root,
      userErrors: root.userErrors,
      errors,
      error: {
        code: cartNotFound ? 'CART_NOT_FOUND' : 'USER_ERROR',
        message
      },
      status: cartNotFound ? 404 : 400
    };
  }
  if (hasGraphQLErrors) {
    const message = errors!.map((e) => e.message).join('; ') || 'GraphQL error';
    const cartNotFound = isCartNotFoundFromMessage(undefined, errors ?? undefined);
    return {
      ok: false,
      data: root,
      userErrors: root.userErrors,
      errors,
      error: {
        code: cartNotFound ? 'CART_NOT_FOUND' : 'SHOPIFY_ERROR',
        message
      },
      status: cartNotFound ? 404 : 502
    };
  }
  return {
    ok: true,
    data: root,
    userErrors: root.userErrors,
    errors: undefined,
    error: undefined,
    status: undefined
  };
}

function wrapClientError(e: unknown, operationName: string): ShopifyOperationResult<never> {
  if (e instanceof ShopifyGraphQLClientError) {
    const err = e as ShopifyGraphQLClientError;
    logShopify('error', err.requestId, err.operationName ?? operationName, err.message, {
      status: err.status,
      errors: err.errors
    });
    const cartNotFound = isCartNotFoundFromMessage(err.message, err.errors);
    return {
      ok: false,
      data: undefined,
      errors: err.errors,
      error: {
        code: cartNotFound ? 'CART_NOT_FOUND' : 'SHOPIFY_ERROR',
        message: err.message,
        requestId: err.requestId
      },
      status: cartNotFound ? 404 : (err.status >= 400 && err.status < 500 ? err.status : 502)
    };
  }
  const message = e instanceof Error ? e.message : 'Unknown error';
  logShopify('error', 'unknown', operationName, message);
  return {
    ok: false,
    data: undefined,
    error: { code: 'SHOPIFY_ERROR', message },
    status: 502
  };
}

const OP_GET_PRODUCTS = 'ProductList';

export async function getProducts(
  first = 20
): Promise<ShopifyOperationResult<Product[]>> {
  try {
    const res = await shopifyQuery<ProductListResponse>({
      query: PRODUCT_LIST_QUERY,
      variables: { first },
      operationName: OP_GET_PRODUCTS
    });

    if (!res.data?.products) {
      return {
        ok: false,
        data: [],
        error: { code: 'SHOPIFY_ERROR', message: 'Failed to fetch products' },
        status: 502
      };
    }

    const products = res.data.products.edges.map(
      (edge: { node: ProductNode }) => mapProduct(edge.node)
    );
    return { ok: true, data: products };
  } catch (e) {
    return wrapClientError(e, OP_GET_PRODUCTS) as ShopifyOperationResult<Product[]>;
  }
}

const OP_GET_PRODUCT_BY_HANDLE = 'ProductByHandle';

export async function getProductByHandle(
  handle: string
): Promise<ShopifyOperationResult<Product | null>> {
  try {
    const res = await shopifyQuery<ProductByHandleResponse>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      operationName: OP_GET_PRODUCT_BY_HANDLE
    });

    const productNode = res.data?.product ?? null;
    return {
      ok: true,
      data: productNode ? mapProduct(productNode) : null
    };
  } catch (e) {
    return wrapClientError(e, OP_GET_PRODUCT_BY_HANDLE) as ShopifyOperationResult<Product | null>;
  }
}

const OP_GET_COLLECTIONS = 'CollectionsList';

export async function getCollections(
  first = 20
): Promise<ShopifyOperationResult<Collection[]>> {
  try {
    const res = await shopifyQuery<CollectionsListResponse>({
      query: COLLECTIONS_QUERY,
      variables: { first },
      operationName: OP_GET_COLLECTIONS
    });

    if (!res.data?.collections) {
      return {
        ok: false,
        data: [],
        error: { code: 'SHOPIFY_ERROR', message: 'Failed to fetch collections' },
        status: 502
      };
    }

    const collections = res.data.collections.edges.map(
      (edge: { node: CollectionNode }) => mapCollection(edge.node)
    );
    return { ok: true, data: collections };
  } catch (e) {
    return wrapClientError(e, OP_GET_COLLECTIONS) as ShopifyOperationResult<Collection[]>;
  }
}

const OP_GET_COLLECTION_BY_HANDLE = 'CollectionByHandle';

export async function getCollectionByHandle(
  handle: string,
  productsFirst = 50
): Promise<ShopifyOperationResult<Collection | null>> {
  try {
    const res = await shopifyQuery<CollectionByHandleResponse>({
      query: COLLECTION_BY_HANDLE_QUERY,
      variables: { handle, productsFirst },
      operationName: OP_GET_COLLECTION_BY_HANDLE
    });

    const node = res.data?.collection ?? null;
    return {
      ok: true,
      data: node ? mapCollectionWithProducts(node) : null
    };
  } catch (e) {
    return wrapClientError(e, OP_GET_COLLECTION_BY_HANDLE) as ShopifyOperationResult<Collection | null>;
  }
}

const OP_GET_CART = 'CartQuery';

export async function getCart(
  cartId: string
): Promise<ShopifyOperationResult<Cart | null>> {
  try {
    const res = await shopifyQuery<CartResponse>({
      query: CART_QUERY,
      variables: { id: cartId },
      operationName: OP_GET_CART
    });

    const cartNode = res.data?.cart ?? null;
    return {
      ok: true,
      data: cartNode ? mapCart(cartNode) : null
    };
  } catch (e) {
    return wrapClientError(e, OP_GET_CART) as ShopifyOperationResult<Cart | null>;
  }
}

const OP_CART_CREATE = 'CartCreate';

export async function createCart(
  lines?: CartLineInput[]
): Promise<ShopifyOperationResult<Cart>> {
  try {
    const res = await shopifyQuery<CartCreateResponse>({
      query: CART_CREATE_MUTATION,
      variables: { input: { lines } },
      operationName: OP_CART_CREATE
    });

    const payload = extractMutationPayload(res.data?.cartCreate, res.errors);

    if (!payload.ok || !payload.data?.cart) {
      return {
        ok: false,
        data: undefined,
        userErrors: payload.userErrors,
        errors: payload.errors,
        error: payload.error,
        status: payload.status ?? 502
      };
    }

    return {
      ok: true,
      data: mapCart(payload.data.cart),
      userErrors: payload.userErrors
    };
  } catch (e) {
    return wrapClientError(e, OP_CART_CREATE) as ShopifyOperationResult<Cart>;
  }
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

const OP_CART_LINES_ADD = 'CartLinesAdd';

export async function addToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number
): Promise<ShopifyOperationResult<Cart>> {
  try {
    const res = await shopifyQuery<CartLinesChangeResponse>({
      query: CART_LINES_ADD_MUTATION,
      variables: { cartId, lines: [{ merchandiseId, quantity }] },
      operationName: OP_CART_LINES_ADD
    });

    const payload = extractMutationPayload(res.data?.cartLinesAdd, res.errors);

    if (!payload.ok || !payload.data?.cart) {
      return {
        ok: false,
        data: undefined,
        userErrors: payload.userErrors,
        errors: payload.errors,
        error: payload.error,
        status: payload.status ?? 502
      };
    }

    return {
      ok: true,
      data: mapCart(payload.data.cart),
      userErrors: payload.userErrors
    };
  } catch (e) {
    return wrapClientError(e, OP_CART_LINES_ADD) as ShopifyOperationResult<Cart>;
  }
}

const OP_CART_LINES_UPDATE = 'CartLinesUpdate';

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<ShopifyOperationResult<Cart>> {
  try {
    const res = await shopifyQuery<CartLinesChangeResponse>({
      query: CART_LINES_UPDATE_MUTATION,
      variables: { cartId, lines },
      operationName: OP_CART_LINES_UPDATE
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
        errors: payload.errors,
        error: payload.error,
        status: payload.status ?? 502
      };
    }

    return {
      ok: true,
      data: mapCart(payload.data.cart),
      userErrors: payload.userErrors
    };
  } catch (e) {
    return wrapClientError(e, OP_CART_LINES_UPDATE) as ShopifyOperationResult<Cart>;
  }
}

const OP_CART_LINES_REMOVE = 'CartLinesRemove';

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyOperationResult<Cart>> {
  try {
    const res = await shopifyQuery<CartLinesChangeResponse>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds },
      operationName: OP_CART_LINES_REMOVE
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
        errors: payload.errors,
        error: payload.error,
        status: payload.status ?? 502
      };
    }

    return {
      ok: true,
      data: mapCart(payload.data.cart),
      userErrors: payload.userErrors
    };
  } catch (e) {
    return wrapClientError(e, OP_CART_LINES_REMOVE) as ShopifyOperationResult<Cart>;
  }
}

export type {
  Product,
  ProductVariant,
  Cart,
  CartLine,
  Money,
  ShopifyUserError
};

