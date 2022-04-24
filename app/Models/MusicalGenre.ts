import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import User from './User'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class MusicalGenre extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'musical_genre_users',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public users: ManyToMany<typeof User>

  @beforeCreate()
  public static assignCuid(model: MusicalGenre) {
    model.id = cuid()
  }
}
