import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

import Region from './Region'
import Country from './Country'
import City from './City'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class State extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'uf' })
  public uf: string

  @column({ columnName: 'country_id', serializeAs: null })
  public countryId: string | null

  @column({ columnName: 'region_id', serializeAs: null })
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

  @hasMany(() => City)
  public cities: HasMany<typeof City>

  @belongsTo(() => Country, {
    foreignKey: 'countryId',
  })
  public country: BelongsTo<typeof Country>

  @belongsTo(() => Region, {
    foreignKey: 'regionId',
  })
  public region: BelongsTo<typeof Region>

  @beforeCreate()
  public static assignCuid(model: State) {
    model.id = cuid()
  }
}
