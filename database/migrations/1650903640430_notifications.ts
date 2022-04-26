import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import NotificationEnum from 'Contracts/enums/Notification'
import RoleEnum from 'Contracts/enums/Role'

export default class Notifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30)

      table.string('user_id', 30).references('id').inTable('users').onDelete('CASCADE')
      table
        .enum('notification_type', Object.values(NotificationEnum))
        .defaultTo(NotificationEnum.DEFAULT)
        .notNullable()
      table.enum('role_type', Object.values(RoleEnum)).defaultTo(RoleEnum.BASIC).notNullable()
      table.string('title').notNullable()
      table.string('text').notNullable()
      table.boolean('check').defaultTo(false).notNullable()

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
