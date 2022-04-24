import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Country from 'App/Models/Country'

export default class CountrySeeder extends BaseSeeder {
  public async run() {
    const path = Application.databasePath('json/country.json')
    if (await Drive.exists(path)) {
      const contents = await Drive.get(path)
      const listJson = JSON.parse(contents.toString())
      for (const item of listJson) {
        await Country.updateOrCreate(
          {
            abbreviation: item.abbreviation,
            bacen: item.bacen,
          },
          { ...item }
        )
      }
    }
  }
}
