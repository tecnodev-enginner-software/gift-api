import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import State from 'App/Models/State'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class Country extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public abbreviation: string

  @column()
  public bacen: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => State, {
    foreignKey: 'countryId',
  })
  public state: BelongsTo<typeof State>

  @beforeCreate()
  public static assignCuid(model: Country) {
    model.id = cuid()
  }
}
