import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Countries extends BaseSchema {
  protected tableName = 'countries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table.string('name').index()
      table.string('abbreviation')
      table.integer('bacen').unique()

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
