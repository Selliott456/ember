import { shopifyMutation, shopifyQuery } from './client';

export type CartId = string;

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
};

export type CartUpdateLineInput = {
  id: string;
  quantity?: number;
  attributes?: { key: string; value: string }[];
};

export type Cart = {
  id: CartId;
  checkoutUrl: string;
  totalQuantity: number;
};

export type CartResult = {
  cart?: Cart;
  userErrors?: { field?: string[]; message: string }[];
};

type ShopifyCartFragment = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
};

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
  }
`;

export async function fetchCart(cartId: CartId): Promise<CartResult> {
  const query = `
    ${CART_FRAGMENT}
    query CartQuery($id: ID!) {
      cart(id: $id) {
        ...CartFields
      }
    }
  `;

  const res = await shopifyQuery<{
    cart: ShopifyCartFragment | null;
  }, { id: string }>({
    query,
    variables: { id: cartId }
  });

  if (!res.ok || !res.data?.cart) {
    return {
      cart: undefined,
      userErrors: res.errors?.map((e) => ({ message: e.message }))
    };
  }

  const cart = mapCart(res.data.cart);

  return { cart };
}

export async function createCart(
  lines?: CartLineInput[]
): Promise<CartResult> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await shopifyMutation<{
    cartCreate: {
      cart: ShopifyCartFragment | null;
      userErrors: { field?: string[]; message: string }[];
    };
  }, { input: { lines?: CartLineInput[] } }>({
    query: mutation,
    variables: { input: { lines } }
  });

  const payload = res.data?.cartCreate;

  if (!res.ok || !payload?.cart) {
    return {
      cart: undefined,
      userErrors:
        payload?.userErrors ?? res.errors?.map((e) => ({ message: e.message }))
    };
  }

  return {
    cart: mapCart(payload.cart),
    userErrors: payload.userErrors
  };
}

export async function addCartLines(
  cartId: CartId,
  lines: CartLineInput[]
): Promise<CartResult> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await shopifyMutation<{
    cartLinesAdd: {
      cart: ShopifyCartFragment | null;
      userErrors: { field?: string[]; message: string }[];
    };
  }, { cartId: string; lines: CartLineInput[] }>({
    query: mutation,
    variables: { cartId, lines }
  });

  const payload = res.data?.cartLinesAdd;

  if (!res.ok || !payload?.cart) {
    return {
      cart: undefined,
      userErrors:
        payload?.userErrors ?? res.errors?.map((e) => ({ message: e.message }))
    };
  }

  return {
    cart: mapCart(payload.cart),
    userErrors: payload.userErrors
  };
}

export async function updateCartLines(
  cartId: CartId,
  lines: CartUpdateLineInput[]
): Promise<CartResult> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await shopifyMutation<{
    cartLinesUpdate: {
      cart: ShopifyCartFragment | null;
      userErrors: { field?: string[]; message: string }[];
    };
  }, { cartId: string; lines: CartUpdateLineInput[] }>({
    query: mutation,
    variables: { cartId, lines }
  });

  const payload = res.data?.cartLinesUpdate;

  if (!res.ok || !payload?.cart) {
    return {
      cart: undefined,
      userErrors:
        payload?.userErrors ?? res.errors?.map((e) => ({ message: e.message }))
    };
  }

  return {
    cart: mapCart(payload.cart),
    userErrors: payload.userErrors
  };
}

export async function removeCartLines(
  cartId: CartId,
  lineIds: string[]
): Promise<CartResult> {
  const mutation = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await shopifyMutation<{
    cartLinesRemove: {
      cart: ShopifyCartFragment | null;
      userErrors: { field?: string[]; message: string }[];
    };
  }, { cartId: string; lineIds: string[] }>({
    query: mutation,
    variables: { cartId, lineIds }
  });

  const payload = res.data?.cartLinesRemove;

  if (!res.ok || !payload?.cart) {
    return {
      cart: undefined,
      userErrors:
        payload?.userErrors ?? res.errors?.map((e) => ({ message: e.message }))
    };
  }

  return {
    cart: mapCart(payload.cart),
    userErrors: payload.userErrors
  };
}

function mapCart(fragment: ShopifyCartFragment): Cart {
  return {
    id: fragment.id,
    checkoutUrl: fragment.checkoutUrl,
    totalQuantity: fragment.totalQuantity
  };
}

