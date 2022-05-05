import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import User from './User'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class Favorite extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true, serializeAs: null })
  public id: string

  @column({ columnName: 'user_id', serializeAs: null })
  public userId: string

  @column({ columnName: 'favorited_id', serializeAs: null })
  public favoritedId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'favoritedId',
  })
  public favorited: BelongsTo<typeof User>

  @beforeCreate()
  public static assignCuid(model: Favorite) {
    model.id = cuid()
  }
}
