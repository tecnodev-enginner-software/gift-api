import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import ProfileEnum from 'Contracts/enums/Profile'

import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import User from './User'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()

export default class Profile extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id', serializeAs: null })
  public userId: string

  @column({ columnName: 'account_type' })
  public accountType: ProfileEnum

  @column({
    columnName: 'is_approved',
    consume: (value?: number) => Boolean(value),
  })
  public approved: boolean | null

  @column()
  public about: string | null | undefined

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static assignCuid(profile: Profile) {
    profile.id = cuid()
  }
}
