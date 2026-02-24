import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { shopifyConfig } from '$lib/config/shopify';
import {
  addCartLines,
  createCart,
  fetchCart,
  removeCartLines,
  updateCartLines,
  type CartLineInput,
  type CartUpdateLineInput
} from '$lib/server/shopify/cart';

const NO_STORE_HEADERS = {
  'cache-control': 'private, no-store'
};

function getCartIdFromCookies(cookies: import('@sveltejs/kit').Cookies) {
  return cookies.get(shopifyConfig.cartCookieName) ?? null;
}

function setCartIdCookie(
  cookies: import('@sveltejs/kit').Cookies,
  cartId: string | null
) {
  if (!cartId) {
    cookies.delete(shopifyConfig.cartCookieName, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true
    });
    return;
  }

  cookies.set(shopifyConfig.cartCookieName, cartId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: shopifyConfig.cartCookieMaxAgeSeconds
  });
}

export const GET: RequestHandler = async ({ cookies }) => {
  const cartId = getCartIdFromCookies(cookies);

  if (!cartId) {
    return json(
      { cart: null },
      {
        status: 200,
        headers: NO_STORE_HEADERS
      }
    );
  }

  const result = await fetchCart(cartId);

  if (!result.cart) {
    setCartIdCookie(cookies, null);
  }

  return json(
    {
      cart: result.cart ?? null,
      errors: result.userErrors ?? null
    },
    {
      status: 200,
      headers: NO_STORE_HEADERS
    }
  );
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = (await request.json().catch(() => ({}))) as {
    lines?: CartLineInput[];
  };

  const result = await createCart(body.lines);

  if (result.cart?.id) {
    setCartIdCookie(cookies, result.cart.id);
  }

  const status = result.cart ? 201 : 400;

  return json(
    {
      cart: result.cart ?? null,
      errors: result.userErrors ?? null
    },
    {
      status,
      headers: NO_STORE_HEADERS
    }
  );
};

export const PATCH: RequestHandler = async ({ request, cookies }) => {
  const cartId = getCartIdFromCookies(cookies);

  if (!cartId) {
    return json(
      { cart: null, errors: [{ message: 'No cartId cookie set' }] },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    action?: 'add' | 'update' | 'remove';
    lines?: CartLineInput[];
    updates?: CartUpdateLineInput[];
    lineIds?: string[];
  };

  if (!body.action) {
    return json(
      { cart: null, errors: [{ message: 'Missing action' }] },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let result;

  if (body.action === 'add' && body.lines?.length) {
    result = await addCartLines(cartId, body.lines);
  } else if (body.action === 'update' && body.updates?.length) {
    result = await updateCartLines(cartId, body.updates);
  } else if (body.action === 'remove' && body.lineIds?.length) {
    result = await removeCartLines(cartId, body.lineIds);
  } else {
    return json(
      { cart: null, errors: [{ message: 'Invalid payload for action' }] },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!result.cart) {
    return json(
      {
        cart: null,
        errors:
          result.userErrors ?? [{ message: 'Cart operation failed' }]
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  setCartIdCookie(cookies, result.cart.id);

  return json(
    {
      cart: result.cart,
      errors: result.userErrors ?? null
    },
    {
      status: 200,
      headers: NO_STORE_HEADERS
    }
  );
}

