import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import TextInfoEnum from 'Contracts/enums/TextInfo'

export default class TextInfos extends BaseSchema {
  protected tableName = 'text_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table.enu('type', Object.values(TextInfoEnum)).index().unique()
      table.text('html')

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
