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
  pgm.createTable("session_command", {
    session_command_id: "id",
    session_id: { type: "uuid", notNull: true, references: '"session"' },
    command: { type: "jsonb", notNull: true },
    issued_by: { type: "text", notNull: true },
    created_at: "created_or_modified_at",
  })
}
