import { cuid } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import NotificationEnum from 'Contracts/enums/Notification'
import RoleEnum from 'Contracts/enums/Role'
import { DateTime } from 'luxon'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class Notification extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id', serializeAs: null })
  public userId: string

  @column({ columnName: 'role_type' })
  public roleType: RoleEnum

  @column({ columnName: 'notification_type' })
  public notificationType: NotificationEnum

  @column()
  public title: string

  @column()
  public text: string

  @column()
  public check: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static assignCuid(model: Notification) {
    model.id = cuid()
  }
}
