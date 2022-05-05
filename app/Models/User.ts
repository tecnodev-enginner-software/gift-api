import {
  afterFind,
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import Hash from '@ioc:Adonis/Core/Hash'

import LinkToken from './LinkToken'
import Role from './Role'
import Permission from './Permission'
import Profile from './Profile'
import MusicalGenre from './MusicalGenre'
import Document from './Document'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ columnName: 'first_name' })
  public firstName?: string | undefined | null

  @column({ columnName: 'last_name' })
  public lastName?: string | undefined | null

  @column({ columnName: 'corporate_name' })
  public corporateName?: string | undefined | null

  @column({ columnName: 'full_name' })
  public fullName: string

  @column({ columnName: 'is_active' })
  public active: boolean

  @column({ columnName: 'is_valid' })
  public valid: boolean

  @column.dateTime({ columnName: 'last_login', autoCreate: true, autoUpdate: true })
  public lastLogin: DateTime

  @column.dateTime({ columnName: 'data_joined', autoCreate: true })
  public dataJoined: DateTime

  @column({ serializeAs: null })
  public password: string

  @hasMany(() => LinkToken, {
    foreignKey: 'userId',
  })
  public tokens: HasMany<typeof LinkToken>

  @hasMany(() => Document, {
    foreignKey: 'userId',
  })
  public documents: HasMany<typeof Document>

  @hasOne(() => Profile, {
    foreignKey: 'userId',
  })
  public profile: HasOne<typeof Profile>

  @manyToMany(() => MusicalGenre, {
    pivotTable: 'musical_genre_users',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public musicalGenres: ManyToMany<typeof MusicalGenre>

  @manyToMany(() => Role, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public permissions: ManyToMany<typeof Permission>

  @beforeCreate()
  public static assignCuid(user: User) {
    user.id = cuid()
    user.valid = false
    user.active = true
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterFind()
  public static async reforceBoolean(user: User) {
    if (Number.isInteger(user.active)) {
      user.active = Boolean(user.active)
    }

    if (Number.isInteger(user.valid)) {
      user.valid = Boolean(user.valid)
    }
  }
}
