import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import RoleEnum from 'Contracts/enums/Role'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

import User from './User'
import Permission from './Permission'

BaseModel.namingStrategy = new CamelCaseNamingStrategy()
export default class Role extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public slug: string

  @column()
  public binary: RoleEnum

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public permissions: ManyToMany<typeof Permission>

  @beforeCreate()
  public static assignCuid(role: Role) {
    role.id = cuid()
  }
}
