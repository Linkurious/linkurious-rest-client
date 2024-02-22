/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-05.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {PaginatedResponse} from '../commonTypes';

import {
  CreateWebhookParams,
  DeleteWebhookParams,
  GetWebhookDeliveriesParams,
  PingWebhookParams,
  Webhook,
  WebhookDelivery
} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND} = LkErrorKey;

export class WebhookAPI extends Request {
  /**
   * Create a new webhook.
   */
  createWebhook(this: Request<Webhook>, params: CreateWebhookParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/webhooks',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete an existing webhook.
   */
  deleteWebhook(params: DeleteWebhookParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, NOT_FOUND],
      url: '/admin/webhooks/:webhookId',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * List all existing webhooks.
   */
  getWebhooks(this: Request<{items: Webhook[]}>) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/webhooks',
      method: 'GET'
    });
  }

  /**
   * Trigger the "ping" event on a webhook.
   */
  pingWebhook(this: Request<WebhookDelivery>, params: PingWebhookParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, NOT_FOUND],
      url: '/admin/webhooks/:webhookId/ping',
      method: 'POST',
      params: params
    });
  }

  /**
   * List deliveries for a webhook, with optional pagination.
   */
  getWebhookDeliveries(
    this: Request<PaginatedResponse<WebhookDelivery>>,
    params: GetWebhookDeliveriesParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, NOT_FOUND],
      url: '/admin/webhooks/:webhookId/deliveries',
      method: 'GET',
      params: params
    });
  }
}
