/**
 * srhtclient
 * Copyright (C) 2021  Rui Vieira
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Collection } from "./core.ts";

interface Tracker {
  id: number;
  owner: { canonical_name: string; name: string };
  created: string;
  updated: string;
  name: string;
  description: string;
  default_permissions: { anonymous: any[]; submitter: any[]; user: any[] };
}

interface TrackerShort {
  id: number;
  owner: any;
  created: string;
  updated: string;
  name: string;
}

interface UserShort {
}

interface BasicTicket {
  title: string;
  description: string;
}

export interface TicketUpdate {
  comment?: string;
  status?: TicketStatus;
  resolution?: TicketResolution;
  labels?: string[];
}

export enum TicketStatus {
  REPORTED = "reported",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  RESOLVED = "resolved",
}

export enum TicketResolution {
  UNRESOLVED = "unresolved",
  FIXED = "fixed",
  IMPLEMENTED = "implemented",
  WONT_FIX = "wont_fix",
  BY_DESIGN = "by_design",
  INVALID = "invalid",
  DUPLICATE = "duplicate",
  NOT_OUR_BUG = "not_our_bug",
}

interface Ticket extends BasicTicket {
  id: number;
  "ref"?: string;
  tracker?: TrackerShort;
  "created": string;
  "updated": string;
  "submitter"?: UserShort;
  "status": TicketStatus;
  "resolution": TicketResolution;
  "permissions"?: {
    "anonymous"?: string[];
    "submitter"?: string[];
    "user"?: string[];
  };
  "labels"?: string[];
  "assignees"?: string[];
}

/**
 * Manages sourcehut issue trackers.
 */
export class Todo {
  private readonly baseURL: string;
  private readonly token: string;

  /**
     * Initialise a issue tracker manager.
     * @param token A OAuth1 token
     * @param baseURL Base URL for REST API (defaults to `https://todo.sr.ht/api`)
     */
  constructor(token: string, baseURL: string = "https://todo.sr.ht/api") {
    this.token = token;
    this.baseURL = baseURL;
  }

  /**
     * List all trackers associated with the current user.
     */
  getAllTrackers(): Promise<Collection<Tracker>> {
    return fetch(`${this.baseURL}/trackers`, {
      method: "GET",
      headers: {
        "Authorization": `token ${this.token}`,
      },
    }).then((r) => r.json());
  }

  getAllTrackerTickets(tracker: string): Promise<Collection<Ticket>> {
    return fetch(`${this.baseURL}/trackers/${tracker}/tickets`, {
      method: "GET",
      headers: {
        "Authorization": `token ${this.token}`,
      },
    }).then((r) => r.json());
  }

  /**
     * Get specific ticket from a tracker.
     * @param tracker The tracker's name
     * @param id Ticket id
     */
  getTrackerTicket(tracker: string, id: number): Promise<Ticket> {
    return fetch(`${this.baseURL}/trackers/${tracker}/tickets/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `token ${this.token}`,
      },
    }).then((r) => r.json());
  }

  /**
     * Update a specific ticket from a tracker.
     * The ticket must exist
     * @param trackerName
     * @param id
     * @param update
     */
  updateTrackerTicket(
    trackerName: string,
    id: number,
    update: TicketUpdate,
  ): Promise<Response> {
    console.log(JSON.stringify(update));
    return fetch(`${this.baseURL}/trackers/${trackerName}/tickets/${id}`, {
      method: "POST",
      headers: {
        "Authorization": `token ${this.token}`,
      },
      body: JSON.stringify(update),
    });
  }

  createTicket(trackerName: string, ticket: BasicTicket) {
    return fetch(`${this.baseURL}/trackers/${trackerName}/tickets`, {
      method: "POST",
      headers: {
        "Authorization": `token ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    }).then((r) => r.json());
  }
}
