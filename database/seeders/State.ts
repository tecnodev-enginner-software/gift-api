import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import State from 'App/Models/State'
import Country from 'App/Models/Country'
import Region from 'App/Models/Region'

export default class StateSeeder extends BaseSeeder {
  public async run() {
    const path = Application.databasePath('json/state.json')
    if (await Drive.exists(path)) {
      const countries = await Country.all()
      const regions = await Region.all()

      const contents = await Drive.get(path)
      const listJson = JSON.parse(contents.toString())
      for (const item of listJson) {
        await State.updateOrCreate(
          {
            uf: item.uf,
            ibge: item.ibge,
          },
          {
            ...item,
            countryId: countries.find((country) => country.abbreviation === item.country)?.id,
            regionId: regions.find((region) => region.abbreviation === item.region)?.id,
          }
        )
      }
    }
  }
}
