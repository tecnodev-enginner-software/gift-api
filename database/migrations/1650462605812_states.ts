import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class States extends BaseSchema {
  protected tableName = 'states'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table.string('country_id', 30).references('countries.id').nullable()
      table.string('region_id', 30).references('regions.id').nullable()
      table.string('name')
      table.string('uf')
      table.integer('ibge').nullable()
      table.string('ddd').nullable()

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
