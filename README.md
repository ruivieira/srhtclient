[![builds.sr.ht status](https://builds.sr.ht/~ruivieira/srhtclient/commits/.build.yml.svg)](https://builds.sr.ht/~ruivieira/srhtclient/commits/.build.yml?) [![test](https://github.com/ruivieira/srhtclient/actions/workflows/main.yml/badge.svg)](https://github.com/ruivieira/srhtclient/actions/workflows/main.yml)

# srht-client

A Deno client to [sourcehut](https://sourcehut.org/) REST API.

## Usage

- The client requires an OAuth token.
- If no base is specified for the REST API endpoints, `https://sr.ht` is the default.

Imports are available from:

- deno.land: https://deno.land/x/srhtclient
- nest.land: https://nest.land/package/srhtclient

### Issue tracker

An example of using the issue tracker's API.

Initialisation of the `Todo` issue tracker manager:

```typescript
import {Todo} from "https://deno.land/x/srhtclient/rest/todo.ts";

const token: string = "your token";

const todo = new Todo(token);
```

Get the name of all trackers associated with this user:

```typescript
const trackers = await todo.getAllTrackers();

trackers.results
    .forEach((tracker) => console.log(tracker.name));
```

Create a new ticket called `test` on the `deno` tracker.

```typescript
todo.createTicket("deno", {
    title: "test",
    description: "Just testing the API",
});
```

List all tickets on a tracker

```typescript
todo.getAllTrackerTickets("deno")
    .then((r) => console.log(r));
```

Update a ticket

```typescript
import {
    TicketStatus,
    TicketUpdate,
} from "https://deno.land/x/srhtclient/rest/todo.ts";

const update: TicketUpdate = {
    comment: "This is a comment from srhtclient",
    status: TicketStatus.CONFIRMED,
};

await todo.updateTrackerTicket("deno", 6, update);
```
