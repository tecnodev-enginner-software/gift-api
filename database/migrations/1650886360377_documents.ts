import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import DocumentEnum from 'Contracts/enums/Document'

export default class Documents extends BaseSchema {
  protected tableName = 'documents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30)

      table
        .string('user_id', 30)
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.enum('document_type', Object.values(DocumentEnum)).notNullable()
      table.string('code').nullable()

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
