import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import LinkTokenEnum from 'Contracts/enums/LinkToken'

export default class LinkTokens extends BaseSchema {
  protected tableName = 'link_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table
        .string('user_id', 30)
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('token', 255).notNullable().unique()
      table.enum('type', Object.values(LinkTokenEnum)).notNullable()
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
