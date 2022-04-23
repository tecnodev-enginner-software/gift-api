import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'email'

    const users = await User.updateOrCreateMany(uniqueKey, [
      {
        username: 'super',
        email: 'super@talentos.gift',
        firstName: 'Super',
        lastName: 'User',
        fullName: 'Super User',
        password: 'senhaa',
        active: true,
      },
      {
        username: 'admin',
        email: 'admin@talentos.gift',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        password: 'senhaa',
        active: true,
      },
      {
        username: 'manager',
        email: 'manager@talentos.gift',
        firstName: 'Manager',
        lastName: 'User',
        fullName: 'Manager User',
        password: 'senhaa',
        active: true,
      },
      {
        username: 'visitor',
        email: 'visitor@talentos.gift',
        firstName: 'Visitor',
        lastName: 'User',
        fullName: 'Visitor User',
        password: 'senhaa',
        active: true,
      },
      {
        username: 'basic',
        email: 'basic@talentos.gift',
        firstName: 'Basic',
        lastName: 'User',
        fullName: 'Basic User',
        password: 'senhaa',
        active: true,
      },
    ])

    const roles = await Role.all()

    await users
      .find((x) => x.email === 'super@talentos.gift')
      ?.related('roles')
      .attach([roles.find((x) => x.binary === 16)?.id ?? ''])
    await users
      .find((x) => x.email === 'admin@talentos.gift')
      ?.related('roles')
      .attach([roles.find((x) => x.binary === 8)?.id ?? ''])
    await users
      .find((x) => x.email === 'manager@talentos.gift')
      ?.related('roles')
      .attach([roles.find((x) => x.binary === 4)?.id ?? ''])
    await users
      .find((x) => x.email === 'visitor@talentos.gift')
      ?.related('roles')
      .attach([roles.find((x) => x.binary === 2)?.id ?? ''])
    await users
      .find((x) => x.email === 'basic@talentos.gift')
      ?.related('roles')
      .attach([roles.find((x) => x.binary === 1)?.id ?? ''])
  }
}
