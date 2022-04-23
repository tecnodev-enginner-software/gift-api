import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Region from 'App/Models/Region'
import RegionEnum from 'Contracts/enums/Region'

export default class RegionSeeder extends BaseSeeder {
  public async run() {
    await Region.createMany([
      {
        name: 'Norte',
        abbreviation: RegionEnum.NORTE,
      },
      {
        name: 'Sul',
        abbreviation: RegionEnum.SUL,
      },
      {
        name: 'Leste',
        abbreviation: RegionEnum.LESTE,
      },
      {
        name: 'Oeste',
        abbreviation: RegionEnum.OESTE,
      },
      {
        name: 'Nordeste',
        abbreviation: RegionEnum.NORDESTE,
      },
      {
        name: 'Noroeste',
        abbreviation: RegionEnum.NOROESTE,
      },
      {
        name: 'Sudeste',
        abbreviation: RegionEnum.SUDESTE,
      },
      {
        name: 'Sudoeste',
        abbreviation: RegionEnum.SUDOESTE,
      },
      {
        name: 'Centro',
        abbreviation: RegionEnum.CENTRO,
      },
      {
        name: 'Centro-Norte',
        abbreviation: RegionEnum.CENTRO_NORTE,
      },
      {
        name: 'Centro-Sul',
        abbreviation: RegionEnum.CENTRO_SUL,
      },
      {
        name: 'Centro-Leste',
        abbreviation: RegionEnum.CENTRO_LESTE,
      },
      {
        name: 'Centro-Oeste',
        abbreviation: RegionEnum.CENTRO_OESTE,
      },
    ])
  }
}
