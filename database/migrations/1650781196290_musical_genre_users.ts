import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MusicalGenreUsers extends BaseSchema {
  protected tableName = 'musical_genre_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .string('user_id', 30)
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .string('musical_genre_id', 30)
        .references('id')
        .inTable('musical_genres')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['user_id', 'musical_genre_id'])

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
