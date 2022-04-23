import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class UserPolicy extends BasePolicy {
  public async before(user: User | null) {
    await user?.load('roles')

    const countRole = user?.roles.reduce((acc, val) => acc + val.binary, 0) ?? 1
    const isSuperUser = countRole >= 16

    if (user && isSuperUser) {
      return true
    }
  }

  public async update(user: User, updatedUser: User) {
    return updatedUser.id === user.id
  }
}
