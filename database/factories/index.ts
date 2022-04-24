import Factory from '@ioc:Adonis/Lucid/Factory'

import Address from 'App/Models/Address'
import City from 'App/Models/City'
import Country from 'App/Models/Country'
import Modality from 'App/Models/Modality'
import EventSize from 'App/Models/EventSize'
import EventType from 'App/Models/EventType'
import MusicalGenre from 'App/Models/MusicalGenre'
import Profile from 'App/Models/Profile'
import Region from 'App/Models/Region'
import Role from 'App/Models/Role'
import State from 'App/Models/State'
import TextInfo from 'App/Models/TextInfo'
import User from 'App/Models/User'

import ProfileEnum from 'Contracts/enums/Profile'
import RoleEnum from 'Contracts/enums/Role'
import TextInfoEnum from 'Contracts/enums/TextInfo'

export const AddressFactory = Factory.define(Address, ({ faker }) => {
  return {
    street: faker.address.streetName(),
    number: faker.address.zipCodeByState('??'),
    neighborhood: faker.address.streetAddress(),
    complement: faker.address.ordinalDirection(),
    zipCode: faker.address.zipCode(),
  }
}).build()

export const CityFactory = Factory.define(City, ({ faker }) => {
  return {
    name: faker.internet.userName(),
    latitude: faker.datatype.number({ min: 1000000, max: 10000000 }),
    longitude: faker.datatype.number({ min: 1000000, max: 10000000 }),
    codTom: faker.datatype.number({ min: 1000000, max: 10000000 }),
  }
}).build()

export const CountryFactory = Factory.define(Country, ({ faker }) => {
  return {
    name: faker.internet.userName(),
    abbreviation: faker.name.findName(),
    bacen: faker.datatype.number({ min: 1000000, max: 10000000 }),
  }
}).build()

export const RegionFactory = Factory.define(Region, ({ faker }) => {
  return {
    name: faker.internet.userName(),
    abbreviation: faker.name.findName(),
  }
}).build()

export const StateFactory = Factory.define(State, ({ faker }) => {
  return {
    name: faker.internet.userName(),
    uf: faker.datatype.string(5),
    ibge: faker.datatype.number(),
    ddd: faker.datatype.string(5),
  }
}).build()

export const ProfileFactory = Factory.define(Profile, ({ faker }) => {
  const accountType = faker.random.objectElement(ProfileEnum)
  const about = faker.random.arrayElement([faker.random.words(20), '', null])

  return {
    isApproved: false,
    accountType,
    about,
  }
}).build()

export const RoleFactory = Factory.define(Role, ({ faker }) => {
  return {
    slug: faker.lorem.slug(),
    description: faker.random.words(20),
    name: faker.name.firstName(),
    binary: faker.random.objectElement(RoleEnum),
  }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  const findName = faker.name.findName()
  const names = findName.split(' ')

  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstName: names[0],
    lastName: names[1],
    corporateName: faker.name.findName(),
    fullName: findName,
    active: false,
    password: faker.internet.password(),
  }

  return user
}).build()

export const MusicalGenreFactory = Factory.define(MusicalGenre, ({ faker }) => {
  const musicalGenre = {
    description: faker.random.alpha(5),
  }

  return musicalGenre
}).build()

export const ModalityFactory = Factory.define(Modality, ({ faker }) => {
  const modality = {
    description: faker.random.alpha(5),
  }

  return modality
}).build()

export const EventSizeFactory = Factory.define(EventSize, ({ faker }) => {
  const eventSize = {
    description: faker.random.alpha(5),
  }

  return eventSize
}).build()

export const EventTypeFactory = Factory.define(EventType, ({ faker }) => {
  const eventType = {
    description: faker.random.alpha(5),
  }

  return eventType
}).build()

export const TextInfoFactory = Factory.define(TextInfo, ({ faker }) => {
  const eventType = {
    type: faker.random.objectElement(TextInfoEnum),
    html: faker.lorem.paragraphs(15, '<br/>\n'),
  }

  return eventType
}).build()
