import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Modalities extends BaseSchema {
  protected tableName = 'modalities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table.string('description')

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
