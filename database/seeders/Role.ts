import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RoleEnum from 'Contracts/enums/Role'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'slug'

    await Role.updateOrCreateMany(uniqueKey, [
      {
        slug: 'super',
        name: 'super user',
        binary: RoleEnum.SUPER,
        description:
          'This user has maximum access to all platform features. This user cannot be deleted. This user can only create admin users.',
      },
      {
        slug: 'admin',
        name: 'admin user',
        binary: RoleEnum.ADMIN,
        description:
          'This user has maximum access to all platform features. This user can be deleted. This user can only create admins, managers and basic users.',
      },
      {
        slug: 'manager',
        name: 'manager user',
        binary: RoleEnum.MANAGER,
        description:
          'This is some platform features. This user can only create basic users. It is limited to read, create or delete.',
      },
      {
        slug: 'visitor',
        name: 'visitor user',
        binary: RoleEnum.VISITOR,
        description: 'Can only read some data.',
      },
      {
        slug: 'basic',
        name: 'basic user',
        binary: RoleEnum.BASIC,
        description: 'This user accesses app features.',
      },
    ])
  }
}
