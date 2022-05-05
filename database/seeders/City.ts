import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'
import State from 'App/Models/State'

export default class CitySeeder extends BaseSeeder {
  public async run() {
    const path = Application.databasePath('json/city.json')
    if (await Drive.exists(path)) {
      const states = await State.all()

      const contents = await Drive.get(path)
      const listJson = JSON.parse(contents.toString())
      for (const item of listJson) {
        await City.updateOrCreate(
          {
            ibge: item.ibge,
          },
          { ...item, stateId: states.find((state) => state.uf === item.state)?.id }
        )
      }
    }
  }
}
