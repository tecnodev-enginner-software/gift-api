import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionUsers extends BaseSchema {
  protected tableName = 'permission_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_id', 30).references('users.id')
      table.string('permission_id', 30).references('permissions.id')
      table.unique(['user_id', 'permission_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
