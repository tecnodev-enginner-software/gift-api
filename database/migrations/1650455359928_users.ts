import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30).primary()
      table.string('username').notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('full_name').notNullable()
      table.string('first_name')
      table.string('last_name')
      table.string('corporate_name')
      table.string('password').notNullable()
      table.boolean('is_active').defaultTo(false).notNullable()
      table.boolean('is_valid').defaultTo(false).notNullable()
      table.timestamp('last_login', { useTz: true })
      table.timestamp('data_joined', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
