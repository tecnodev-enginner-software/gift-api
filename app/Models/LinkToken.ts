import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import User from './User'
import LinkTokenEnum from 'Contracts/enums/LinkToken'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class LinkToken extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public userId: string

  @column()
  public token: string

  @column({ columnName: 'type' })
  public type: LinkTokenEnum

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static assignCuid(link: LinkToken) {
    link.id = cuid()
  }
}
