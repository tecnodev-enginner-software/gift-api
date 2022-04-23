import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionRoles extends BaseSchema {
  protected tableName = 'permission_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('role_id', 30).references('roles.id')
      table.string('permission_id', 30).references('permissions.id')
      table.unique(['role_id', 'permission_id'])

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
