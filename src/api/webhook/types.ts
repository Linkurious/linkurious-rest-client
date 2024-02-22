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

interface ExistingWebhookParams {
  webhookId: number;
}

export interface DeleteWebhookParams extends ExistingWebhookParams {}

export interface PingWebhookParams extends ExistingWebhookParams {}

export interface GetWebhookDeliveriesParams extends ExistingWebhookParams, PaginationClause {}

export const WEBHOOK_EVENT_TYPES = ['newCase', 'caseAssignment'] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];

export type PayloadEventType = WebhookEventType | 'ping';

export interface Payload {
  eventType: PayloadEventType;
  sourceKey?: string;
  data: Record<string, unknown>;
}

export interface Webhook extends Omit<CreateWebhookParams, 'secret'>, PersistedItem {}

export interface WebhookEvent {
  eventType: WebhookEventType;
  sourceKey?: string;
}

export interface WebhookDelivery extends PersistedItem {
  webhookId: number;
  payload: Payload;
  sentDate: string | null;
  error?: string;
}
