import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

import { cuid } from '@ioc:Adonis/Core/Helpers'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import City from './City'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class Address extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'city_id', serializeAs: null })
  public cityId: string | null

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public neighborhood: string

  @column()
  public complement: string

  @column({ columnName: 'zip_code' })
  public zipCode: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => City, {
    foreignKey: 'cityId',
  })
  public city: HasOne<typeof City>

  @beforeCreate()
  public static assignCuid(model: Address) {
    model.id = cuid()
  }
}
