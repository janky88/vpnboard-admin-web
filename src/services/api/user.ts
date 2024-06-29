// @ts-ignore
/* eslint-disable */
import request from '@/lib/request';

/** Create a new order Create a new order POST /user/order/create */
export async function postUserOrderCreate(
  body: API.CreateOrderRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CreateOrderResponse }>('/user/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** List orders List orders POST /user/order/list */
export async function postUserOrderList(
  body: API.ListOrderRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ListOrderResponse }>('/user/order/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Create a new payment Create a new payment POST /user/payment/create */
export async function postUserPaymentCreate(
  body: API.CreatePaymentRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CreatePaymentResponse }>('/user/payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Lists payments Lists payments POST /user/payment/list */
export async function postUserPaymentList(
  body: API.ListPaymentRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ListPaymentResponse }>('/user/payment/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** List product List product POST /user/product/list */
export async function postUserProductList(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.ListProductResponse }>('/user/product/list', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Closes a ticket Closes a ticket POST /user/ticket/close */
export async function postUserTicketClose(
  body: API.CloseTicketRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/user/ticket/close', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Gets the content of a ticket Gets the content of a ticket POST /user/ticket/content/get */
export async function postUserTicketContentGet(
  body: API.GetTicketContentRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.GetTicketContentResponse }>(
    '/user/ticket/content/get',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** Sends a message to a ticket Sends a message to a ticket POST /user/ticket/content/send */
export async function postUserTicketContentSend(
  body: API.SendMessageRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/user/ticket/content/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Creates a new ticket Creates a new ticket POST /user/ticket/create */
export async function postUserTicketCreate(
  body: API.CreateTicketRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/user/ticket/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Lists tickets Lists tickets POST /user/ticket/list */
export async function postUserTicketList(
  body: API.ListTicketRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ListTicketResponse }>('/user/ticket/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get user info Get user info POST /user/user/info */
export async function postUserUserInfo(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetUserInfoResponse }>('/user/user/info', {
    method: 'POST',
    ...(options || {}),
  });
}
