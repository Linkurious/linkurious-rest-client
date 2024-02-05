/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-05.
 */
import {PaginationClause, PersistedItem} from '../commonTypes';

export interface CreateWebhookParams {
  url: string;
  secret: string;
  events?: WebhookEvent[];
}

export interface DeleteWebhookParams {
  webhookId: number;
}

export type PingWebhookParams = DeleteWebhookParams;

export interface GetWebhookDeliveriesParams extends DeleteWebhookParams, PaginationClause {}

export const WEBHOOK_EVENT_TYPES = ['newCase', 'caseAssignment'] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];

export type WebhookDeliveryEventType = WebhookEventType | 'ping';

export interface Webhook extends Omit<CreateWebhookParams, 'secret'>, PersistedItem {}

export interface WebhookEvent {
  eventType: WebhookEventType;
  sourceKey?: string;
}

export interface WebhookDelivery extends PersistedItem {
  webhookId: number;
  eventType: WebhookDeliveryEventType;
  sourceKey?: string;
  data: Record<string, unknown>;
  sentDate?: string;
}
