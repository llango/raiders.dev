# API

This documents all the endpoints.

- `/api/session?session_id=` - Get all sessions OR get or update a specific session

## Data Structures

There is a session table with the following columns that is often passed around
as JSON.

```javascript
{
  session_id: "id",
  session_num: "serialid",
  theme: {
    type: "text",
  },
  players_allowed: {
    type: "integer",
    notNull: true,
    default: 4,
  },
  // usernames
  players: {
    type: "text[]",
    notNull: true,
    default: "{}",
  },
  plan: {
    type: "jsonb",
    notNull: true,
    default: "[]",
  },
  room_code: {
    type: "text",
    notNull: true,
    unique: true,
    default: pgm.sql("md5(random()::text)"),
  },
  streamUrls: {
    type: "jsonb",
    notNull: true,
    default: "{}",
  },
  overlay: {
    type: "jsonb",
    notNull: true,
    default: "{}",
  },
  start_time: {
    type: "timestamptz",
    notNull: true,
  },
  created_at: "created_or_modified_at",
}
```
