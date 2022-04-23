import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import ProfileEnum from 'Contracts/enums/Profile'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 30)

      table.string('user_id', 30).references('users.id').onDelete('CASCADE').notNullable()
      table.enum('account_type', Object.values(ProfileEnum)).notNullable()
      table.string('about').nullable()
      table.boolean('is_approved').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
