import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class EventType extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(event: EventType) {
    event.id = cuid()
  }
}
