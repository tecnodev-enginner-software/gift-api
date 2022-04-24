import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cities extends BaseSchema {
  protected tableName = 'cities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table.string('state_id', 30).references('id').inTable('states').nullable()
      table.string('name')
      table.integer('ibge')
      table.point('geom')
      table.float('latitude', 8)
      table.float('longitude', 8)
      table.integer('cod_tom')

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
