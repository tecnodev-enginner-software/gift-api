import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

import Region from './Region'
import Country from './Country'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class State extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'uf' })
  public uf: string

  @column({ columnName: 'country_id' })
  public countryId: string | null

  @column({ columnName: 'region_id' })
  public regionId: string | null

  @column()
  public name: string

  @column()
  public ibge: number | null

  @column()
  public ddd: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Country, {
    foreignKey: 'countryId',
  })
  public country: HasOne<typeof Country>

  @hasOne(() => Region, {
    foreignKey: 'regionId',
  })
  public region: HasOne<typeof Region>

  @beforeCreate()
  public static assignCuid(model: State) {
    model.id = cuid()
  }
}
