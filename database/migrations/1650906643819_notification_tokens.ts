import BaseSchema from '@ioc:Adonis/Lucid/Schema'

import NotificationTokenEnum from 'Contracts/enums/NotificationToken'

export default class NotificationTokens extends BaseSchema {
  protected tableName = 'notification_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30)

      table
        .string('user_id', 30)
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('token').unique().notNullable()
      table.string('device_id').unique().notNullable()
      table
        .enum('notification_token_type', Object.values(NotificationTokenEnum))
        .defaultTo(NotificationTokenEnum.MOBILE)
        .notNullable()
      table.string('device_name')
      table.string('os_name')
      table.string('os_version')

      table.index(['token', 'device_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
