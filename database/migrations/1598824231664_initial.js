/* eslint-disable camelcase */
const { PgLiteral } = require("node-pg-migrate")

exports.shorthands = {
  id: {
    type: "uuid",
    primaryKey: true,
    notNull: true,
    default: PgLiteral.create("gen_random_uuid()"),
  },
  serialid: {
    type: "serial",
    notNull: true,
  },
  created_or_modified_at: {
    type: "timestamptz",
    notNull: true,
    default: PgLiteral.create("current_timestamp"),
  },
}

exports.up = (pgm) => {
  pgm.createExtension("pgcrypto")

  // The field separation of this table is primarily to avoid race conditions or
  // field contention between players
  pgm.createTable("session", {
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
      default: new PgLiteral("md5(random()::text)"),
    },
    host: { type: "text" },

    player1_active: { type: "boolean", notNull: true, default: false },
    player2_active: { type: "boolean", notNull: true, default: false },
    player3_active: { type: "boolean", notNull: true, default: false },
    player4_active: { type: "boolean", notNull: true, default: false },

    // stream1_camera_url: { type: "text" },
    // stream2_camera_url: { type: "text" },
    // stream3_camera_url: { type: "text" },
    // stream4_camera_url: { type: "text" },
    // stream1_screen_url: { type: "text" },
    // stream2_screen_url: { type: "text" },
    // stream3_screen_url: { type: "text" },
    // stream4_screen_url: { type: "text" },

    // admin-published information about session, e.g. when each player will have
    // spotlight
    state_info: { type: "json", notNull: true, default: "{}" },

    // determines if "FAILURE" or "SUCCESS" is displayed on screen
    start_time: {
      type: "timestamptz",
      notNull: true,
    },
    created_at: "created_or_modified_at",
  })
}
