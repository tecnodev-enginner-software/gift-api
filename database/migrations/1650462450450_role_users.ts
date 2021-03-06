import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RoleUsers extends BaseSchema {
  protected tableName = 'role_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .string('user_id', 30)
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .string('role_id', 30)
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['user_id', 'role_id'])

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
