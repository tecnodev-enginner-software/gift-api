import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

import User from 'App/Models/User'

import NotificationTokenEnum from 'Contracts/enums/NotificationToken'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()

export default class NotificationToken extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id', serializeAs: null })
  public userId: string

  @column()
  public token: string

  @column({ columnName: 'device_id' })
  public deviceId: string

  @column({ columnName: 'device_name' })
  public deviceName: string | null | undefined

  @column({ columnName: 'os_name' })
  public osName: string | null | undefined

  @column({ columnName: 'os_version' })
  public osVersion: string | null | undefined

  @column({ columnName: 'notification_token_type' })
  public notificationType: NotificationTokenEnum

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static assignCuid(model: NotificationToken) {
    model.id = cuid()
  }
}
