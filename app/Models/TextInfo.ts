import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import TextInfoEnum from 'Contracts/enums/TextInfo'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class TextInfo extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public type: TextInfoEnum

  @column()
  public html: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(info: TextInfo) {
    info.id = cuid()
  }
}
