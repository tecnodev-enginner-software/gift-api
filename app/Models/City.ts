import {
  BaseModel,
  beforeCreate,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

import Address from 'App/Models/Address'
import State from 'App/Models/State'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class City extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'state_id' })
  public stateId: string | null

  @column()
  public name: string

  @column()
  public ibge: number | null

  // @column({
  //   prepare: (value?: string) => {
  //     return value ? Database.st().geomFromText(value, 4326) : value
  //   },
  // })
  // POSTGIS -> https://docs.adonisjs.com/cookbooks/using-knex-postgis-with-lucid
  @column()
  public geom: any | null | undefined

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column({ columnName: 'cod_tom' })
  public codTom: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => State, {
    foreignKey: 'stateId',
  })
  public state: HasOne<typeof State>

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @beforeCreate()
  public static assignCuid(model: City) {
    model.id = cuid()
  }
}
