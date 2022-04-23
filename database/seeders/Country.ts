import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'

export default class CountrySeeder extends BaseSeeder {
  public async run() {
    await Country.createMany([
      {
        name: 'Brasil',
        abbreviation: 'BR',
        bacen: 1058,
      },
      {
        name: 'Afeganistão',
        abbreviation: 'AF',
        bacen: 132,
      },
      {
        name: 'Albânia, Republica da',
        abbreviation: 'AL',
        bacen: 175,
      },
      {
        name: 'Argélia',
        abbreviation: 'DZ',
        bacen: 590,
      },
      {
        name: 'Samoa Americana',
        abbreviation: 'AS',
        bacen: 6912,
      },
      {
        name: 'Andorra',
        abbreviation: 'AD',
        bacen: 370,
      },
      {
        name: 'Angola',
        abbreviation: 'AO',
        bacen: 400,
      },
      {
        name: 'Anguilla',
        abbreviation: 'AI',
        bacen: 418,
      },
      {
        name: 'Antigua e Barbuda',
        abbreviation: 'AG',
        bacen: 434,
      },
      {
        name: 'Argentina',
        abbreviation: 'AR',
        bacen: 639,
      },
      {
        name: 'Armênia, Republica da',
        abbreviation: 'AM',
        bacen: 647,
      },
      {
        name: 'Aruba',
        abbreviation: 'AW',
        bacen: 655,
      },
      {
        name: 'Austrália',
        abbreviation: 'AU',
        bacen: 698,
      },
      {
        name: 'Áustria',
        abbreviation: 'AT',
        bacen: 728,
      },
      {
        name: 'Azerbaijão, Republica do',
        abbreviation: 'AZ',
        bacen: 736,
      },
      {
        name: 'Bahamas, Ilhas',
        abbreviation: 'BS',
        bacen: 779,
      },
      {
        name: 'Bahrein, Ilhas',
        abbreviation: 'BH',
        bacen: 809,
      },
      {
        name: 'Bangladesh',
        abbreviation: 'BD',
        bacen: 817,
      },
      {
        name: 'Barbados',
        abbreviation: 'BB',
        bacen: 833,
      },
      {
        name: 'Belarus, Republica da',
        abbreviation: 'BY',
        bacen: 850,
      },
      {
        name: 'Bélgica',
        abbreviation: 'BE',
        bacen: 876,
      },
      {
        name: 'Belize',
        abbreviation: 'BZ',
        bacen: 884,
      },
      {
        name: 'Benin',
        abbreviation: 'BJ',
        bacen: 2291,
      },
      {
        name: 'Bermudas',
        abbreviation: 'BM',
        bacen: 906,
      },
      {
        name: 'Butão',
        abbreviation: 'BT',
        bacen: 1198,
      },
      {
        name: 'Bolívia',
        abbreviation: 'BO',
        bacen: 973,
      },
      {
        name: 'Bósnia-herzegovina (Republica da)',
        abbreviation: 'BA',
        bacen: 981,
      },
      {
        name: 'Botsuana',
        abbreviation: 'BW',
        bacen: 1015,
      },
      {
        name: 'Bouvet, Ilha',
        abbreviation: 'BV',
        bacen: 1023,
      },
      {
        name: 'Território Britânico do Oceano Indico',
        abbreviation: 'IO',
        bacen: 7820,
      },
      {
        name: 'Brunei',
        abbreviation: 'BN',
        bacen: 1082,
      },
      {
        name: 'Bulgária, Republica da',
        abbreviation: 'BG',
        bacen: 1112,
      },
      {
        name: 'Burkina Faso',
        abbreviation: 'BF',
        bacen: 310,
      },
      {
        name: 'Burundi',
        abbreviation: 'BI',
        bacen: 1155,
      },
      {
        name: 'Camboja',
        abbreviation: 'KH',
        bacen: 1414,
      },
      {
        name: 'Camarões',
        abbreviation: 'CM',
        bacen: 1457,
      },
      {
        name: 'Canada',
        abbreviation: 'CA',
        bacen: 1490,
      },
      {
        name: 'Cabo Verde, Republica de',
        abbreviation: 'CV',
        bacen: 1279,
      },
      {
        name: 'Cayman, Ilhas',
        abbreviation: 'KY',
        bacen: 1376,
      },
      {
        name: 'Republica Centro-Africana',
        abbreviation: 'CF',
        bacen: 6408,
      },
      {
        name: 'Chade',
        abbreviation: 'TD',
        bacen: 7889,
      },
      {
        name: 'Chile',
        abbreviation: 'CL',
        bacen: 1589,
      },
      {
        name: 'China, Republica Popular',
        abbreviation: 'CN',
        bacen: 1600,
      },
      {
        name: 'Christmas, Ilha (Navidad)',
        abbreviation: 'CX',
        bacen: 5118,
      },
      {
        name: 'Cocos (Keeling), Ilhas',
        abbreviation: 'CC',
        bacen: 1651,
      },
      {
        name: 'Colômbia',
        abbreviation: 'CO',
        bacen: 1694,
      },
      {
        name: 'Comores, Ilhas',
        abbreviation: 'KM',
        bacen: 1732,
      },
      {
        name: 'Congo',
        abbreviation: 'CG',
        bacen: 1775,
      },
      {
        name: 'Congo, Republica Democrática do',
        abbreviation: 'CD',
        bacen: 8885,
      },
      {
        name: 'Cook, Ilhas',
        abbreviation: 'CK',
        bacen: 1830,
      },
      {
        name: 'Costa Rica',
        abbreviation: 'CR',
        bacen: 1961,
      },
      {
        name: 'Costa do Marfim',
        abbreviation: 'CI',
        bacen: 1937,
      },
      {
        name: 'Croácia (Republica da)',
        abbreviation: 'HR',
        bacen: 1953,
      },
      {
        name: 'Cuba',
        abbreviation: 'CU',
        bacen: 1996,
      },
      {
        name: 'Chipre',
        abbreviation: 'CY',
        bacen: 1635,
      },
      {
        name: 'Tcheca, Republica',
        abbreviation: 'CZ',
        bacen: 7919,
      },
      {
        name: 'Dinamarca',
        abbreviation: 'DK',
        bacen: 2321,
      },
      {
        name: 'Djibuti',
        abbreviation: 'DJ',
        bacen: 7838,
      },
      {
        name: 'Dominica, Ilha',
        abbreviation: 'DM',
        bacen: 2356,
      },
      {
        name: 'Republica Dominicana',
        abbreviation: 'DO',
        bacen: 6475,
      },
      {
        name: 'Timor Leste',
        abbreviation: 'TL',
        bacen: 7951,
      },
      {
        name: 'Equador',
        abbreviation: 'EC',
        bacen: 2399,
      },
      {
        name: 'Egito',
        abbreviation: 'EG',
        bacen: 2402,
      },
      {
        name: 'El Salvador',
        abbreviation: 'SV',
        bacen: 6874,
      },
      {
        name: 'Guine-Equatorial',
        abbreviation: 'GQ',
        bacen: 3310,
      },
      {
        name: 'Eritreia',
        abbreviation: 'ER',
        bacen: 2437,
      },
      {
        name: 'Estônia, Republica da',
        abbreviation: 'EE',
        bacen: 2518,
      },
      {
        name: 'Etiópia',
        abbreviation: 'ET',
        bacen: 2534,
      },
      {
        name: 'Falkland (Ilhas Malvinas)',
        abbreviation: 'FK',
        bacen: 2550,
      },
      {
        name: 'Feroe, Ilhas',
        abbreviation: 'FO',
        bacen: 2593,
      },
      {
        name: 'Fiji',
        abbreviation: 'FJ',
        bacen: 8702,
      },
      {
        name: 'Finlândia',
        abbreviation: 'FI',
        bacen: 2712,
      },
      {
        name: 'Franca',
        abbreviation: 'FR',
        bacen: 2755,
      },
      {
        name: 'Guiana francesa',
        abbreviation: 'GF',
        bacen: 3255,
      },
      {
        name: 'Polinésia Francesa',
        abbreviation: 'PF',
        bacen: 5991,
      },
      {
        name: 'Terras Austrais e Antárticas Francesas',
        abbreviation: 'TF',
        bacen: 3607,
      },
      {
        name: 'Gabão',
        abbreviation: 'GA',
        bacen: 2810,
      },
      {
        name: 'Gambia',
        abbreviation: 'GM',
        bacen: 2852,
      },
      {
        name: 'Georgia, Republica da',
        abbreviation: 'GE',
        bacen: 2917,
      },
      {
        name: 'Alemanha',
        abbreviation: 'DE',
        bacen: 230,
      },
      {
        name: 'Gana',
        abbreviation: 'GH',
        bacen: 2895,
      },
      {
        name: 'Gibraltar',
        abbreviation: 'GI',
        bacen: 2933,
      },
      {
        name: 'Grécia',
        abbreviation: 'GR',
        bacen: 3018,
      },
      {
        name: 'Groenlândia',
        abbreviation: 'GL',
        bacen: 3050,
      },
      {
        name: 'Granada',
        abbreviation: 'GD',
        bacen: 2976,
      },
      {
        name: 'Guadalupe',
        abbreviation: 'GP',
        bacen: 3093,
      },
      {
        name: 'Guam',
        abbreviation: 'GU',
        bacen: 3131,
      },
      {
        name: 'Guatemala',
        abbreviation: 'GT',
        bacen: 3174,
      },
      {
        name: 'Guine',
        abbreviation: 'GN',
        bacen: 3298,
      },
      {
        name: 'Guine-Bissau',
        abbreviation: 'GW',
        bacen: 3344,
      },
      {
        name: 'Guiana',
        abbreviation: 'GY',
        bacen: 3379,
      },
      {
        name: 'Haiti',
        abbreviation: 'HT',
        bacen: 3417,
      },
      {
        name: 'Ilha Heard e Ilhas McDonald',
        abbreviation: 'HM',
        bacen: 3603,
      },
      {
        name: 'Vaticano, Estado da Cidade do',
        abbreviation: 'VA',
        bacen: 8486,
      },
      {
        name: 'Honduras',
        abbreviation: 'HN',
        bacen: 3450,
      },
      {
        name: 'Hong Kong',
        abbreviation: 'HK',
        bacen: 3514,
      },
      {
        name: 'Hungria, Republica da',
        abbreviation: 'HU',
        bacen: 3557,
      },
      {
        name: 'Islândia',
        abbreviation: 'IS',
        bacen: 3794,
      },
      {
        name: 'Índia',
        abbreviation: 'IN',
        bacen: 3611,
      },
      {
        name: 'Indonésia',
        abbreviation: 'ID',
        bacen: 3654,
      },
      {
        name: 'Ira, Republica Islâmica do',
        abbreviation: 'IR',
        bacen: 3727,
      },
      {
        name: 'Iraque',
        abbreviation: 'IQ',
        bacen: 3697,
      },
      {
        name: 'Irlanda',
        abbreviation: 'IE',
        bacen: 3751,
      },
      {
        name: 'Israel',
        abbreviation: 'IL',
        bacen: 3832,
      },
      {
        name: 'Itália',
        abbreviation: 'IT',
        bacen: 3867,
      },
      {
        name: 'Jamaica',
        abbreviation: 'JM',
        bacen: 3913,
      },
      {
        name: 'Japão',
        abbreviation: 'JP',
        bacen: 3999,
      },
      {
        name: 'Jordânia',
        abbreviation: 'JO',
        bacen: 4030,
      },
      {
        name: 'Cazaquistão, Republica do',
        abbreviation: 'KZ',
        bacen: 1538,
      },
      {
        name: 'Quênia',
        abbreviation: 'KE',
        bacen: 6238,
      },
      {
        name: 'Kiribati',
        abbreviation: 'KI',
        bacen: 4111,
      },
      {
        name: 'Coreia, Republica Popular Democrática da',
        abbreviation: 'KP',
        bacen: 1872,
      },
      {
        name: 'Coreia, Republica da',
        abbreviation: 'KR',
        bacen: 1902,
      },
      {
        name: 'Kuwait',
        abbreviation: 'KW',
        bacen: 1988,
      },
      {
        name: 'Quirguiz, Republica',
        abbreviation: 'KG',
        bacen: 6254,
      },
      {
        name: 'Laos, Republica Popular Democrática do',
        abbreviation: 'LA',
        bacen: 4200,
      },
      {
        name: 'Letônia, Republica da',
        abbreviation: 'LV',
        bacen: 4278,
      },
      {
        name: 'Líbano',
        abbreviation: 'LB',
        bacen: 4316,
      },
      {
        name: 'Lesoto',
        abbreviation: 'LS',
        bacen: 4260,
      },
      {
        name: 'Libéria',
        abbreviation: 'LR',
        bacen: 4340,
      },
      {
        name: 'Líbia',
        abbreviation: 'LY',
        bacen: 4383,
      },
      {
        name: 'Liechtenstein',
        abbreviation: 'LI',
        bacen: 4405,
      },
      {
        name: 'Lituânia, Republica da',
        abbreviation: 'LT',
        bacen: 4421,
      },
      {
        name: 'Luxemburgo',
        abbreviation: 'LU',
        bacen: 4456,
      },
      {
        name: 'Macau',
        abbreviation: 'MO',
        bacen: 4472,
      },
      {
        name: 'Macedônia do Norte',
        abbreviation: 'MK',
        bacen: 4499,
      },
      {
        name: 'Madagascar',
        abbreviation: 'MG',
        bacen: 4502,
      },
      {
        name: 'Malavi',
        abbreviation: 'MW',
        bacen: 4588,
      },
      {
        name: 'Malásia',
        abbreviation: 'MY',
        bacen: 4553,
      },
      {
        name: 'Maldivas',
        abbreviation: 'MV',
        bacen: 4618,
      },
      {
        name: 'Mali',
        abbreviation: 'ML',
        bacen: 4642,
      },
      {
        name: 'Malta',
        abbreviation: 'MT',
        bacen: 4677,
      },
      {
        name: 'Marshall, Ilhas',
        abbreviation: 'MH',
        bacen: 4766,
      },
      {
        name: 'Martinica',
        abbreviation: 'MQ',
        bacen: 4774,
      },
      {
        name: 'Mauritânia',
        abbreviation: 'MR',
        bacen: 4880,
      },
      {
        name: 'Mauricio',
        abbreviation: 'MU',
        bacen: 4855,
      },
      {
        name: 'Mayotte (Ilhas Francesas)',
        abbreviation: 'YT',
        bacen: 4885,
      },
      {
        name: 'México',
        abbreviation: 'MX',
        bacen: 4936,
      },
      {
        name: 'Micronesia',
        abbreviation: 'FM',
        bacen: 4995,
      },
      {
        name: 'Moldávia, Republica da',
        abbreviation: 'MD',
        bacen: 4944,
      },
      {
        name: 'Mônaco',
        abbreviation: 'MC',
        bacen: 4952,
      },
      {
        name: 'Mongólia',
        abbreviation: 'MN',
        bacen: 4979,
      },
      {
        name: 'Montserrat, Ilhas',
        abbreviation: 'MS',
        bacen: 5010,
      },
      {
        name: 'Marrocos',
        abbreviation: 'MA',
        bacen: 4740,
      },
      {
        name: 'Moçambique',
        abbreviation: 'MZ',
        bacen: 5053,
      },
      {
        name: 'Mianmar (Birmânia)',
        abbreviation: 'MM',
        bacen: 930,
      },
      {
        name: 'Namíbia',
        abbreviation: 'NA',
        bacen: 5070,
      },
      {
        name: 'Nauru',
        abbreviation: 'NR',
        bacen: 5088,
      },
      {
        name: 'Nepal',
        abbreviation: 'NP',
        bacen: 5177,
      },
      {
        name: 'Países Baixos (Holanda)',
        abbreviation: 'NL',
        bacen: 5738,
      },
      {
        name: 'Nova Caledonia',
        abbreviation: 'NC',
        bacen: 5428,
      },
      {
        name: 'Nova Zelândia',
        abbreviation: 'NZ',
        bacen: 5487,
      },
      {
        name: 'Nicarágua',
        abbreviation: 'NI',
        bacen: 5215,
      },
      {
        name: 'Níger',
        abbreviation: 'NE',
        bacen: 5258,
      },
      {
        name: 'Nigéria',
        abbreviation: 'NG',
        bacen: 5282,
      },
      {
        name: 'Niue, Ilha',
        abbreviation: 'NU',
        bacen: 5312,
      },
      {
        name: 'Norfolk, Ilha',
        abbreviation: 'NF',
        bacen: 5355,
      },
      {
        name: 'Marianas do Norte',
        abbreviation: 'MP',
        bacen: 4723,
      },
      {
        name: 'Noruega',
        abbreviation: 'NO',
        bacen: 5380,
      },
      {
        name: 'Oma',
        abbreviation: 'OM',
        bacen: 5568,
      },
      {
        name: 'Paquistão',
        abbreviation: 'PK',
        bacen: 5762,
      },
      {
        name: 'Palau',
        abbreviation: 'PW',
        bacen: 5754,
      },
      {
        name: 'Panamá',
        abbreviation: 'PA',
        bacen: 5800,
      },
      {
        name: 'Papua Nova Guine',
        abbreviation: 'PG',
        bacen: 5452,
      },
      {
        name: 'Paraguai',
        abbreviation: 'PY',
        bacen: 5860,
      },
      {
        name: 'Peru',
        abbreviation: 'PE',
        bacen: 5894,
      },
      {
        name: 'Filipinas',
        abbreviation: 'PH',
        bacen: 2674,
      },
      {
        name: 'Pitcairn, Ilha',
        abbreviation: 'PN',
        bacen: 5932,
      },
      {
        name: 'Polônia, Republica da',
        abbreviation: 'PL',
        bacen: 6033,
      },
      {
        name: 'Portugal',
        abbreviation: 'PT',
        bacen: 6076,
      },
      {
        name: 'Porto Rico',
        abbreviation: 'PR',
        bacen: 6114,
      },
      {
        name: 'Catar',
        abbreviation: 'QA',
        bacen: 1546,
      },
      {
        name: 'Reunião, Ilha',
        abbreviation: 'RE',
        bacen: 6602,
      },
      {
        name: 'Romênia',
        abbreviation: 'RO',
        bacen: 6700,
      },
      {
        name: 'Rússia, Federação da',
        abbreviation: 'RU',
        bacen: 6769,
      },
      {
        name: 'Ruanda',
        abbreviation: 'RW',
        bacen: 6750,
      },
      {
        name: 'São Cristovão e Neves, Ilhas',
        abbreviation: 'KN',
        bacen: 6955,
      },
      {
        name: 'Santa Lucia',
        abbreviation: 'LC',
        bacen: 7153,
      },
      {
        name: 'São Vicente e Granadinas',
        abbreviation: 'VC',
        bacen: 7056,
      },
      {
        name: 'Samoa',
        abbreviation: 'WS',
        bacen: 6904,
      },
      {
        name: 'San Marino',
        abbreviation: 'SM',
        bacen: 6971,
      },
      {
        name: 'São Tome e Príncipe, Ilhas',
        abbreviation: 'ST',
        bacen: 7200,
      },
      {
        name: 'Arábia Saudita',
        abbreviation: 'SA',
        bacen: 531,
      },
      {
        name: 'Senegal',
        abbreviation: 'SN',
        bacen: 7285,
      },
      {
        name: 'Seychelles',
        abbreviation: 'SC',
        bacen: 7315,
      },
      {
        name: 'Serra Leoa',
        abbreviation: 'SL',
        bacen: 7358,
      },
      {
        name: 'Cingapura',
        abbreviation: 'SG',
        bacen: 7412,
      },
      {
        name: 'Eslovaca, Republica',
        abbreviation: 'SK',
        bacen: 2470,
      },
      {
        name: 'Eslovênia, Republica da',
        abbreviation: 'SI',
        bacen: 2461,
      },
      {
        name: 'Salomão, Ilhas',
        abbreviation: 'SB',
        bacen: 6777,
      },
      {
        name: 'Somalia',
        abbreviation: 'SO',
        bacen: 7480,
      },
      {
        name: 'África do Sul',
        abbreviation: 'ZA',
        bacen: 7560,
      },
      {
        name: 'Ilhas Geórgia do Sul e Sandwich do Sul',
        abbreviation: 'GS',
        bacen: 2925,
      },
      {
        name: 'Espanha',
        abbreviation: 'ES',
        bacen: 2453,
      },
      {
        name: 'Sri Lanka',
        abbreviation: 'LK',
        bacen: 7501,
      },
      {
        name: 'Santa Helena',
        abbreviation: 'SH',
        bacen: 7102,
      },
      {
        name: 'São Pedro e Miquelon',
        abbreviation: 'PM',
        bacen: 7005,
      },
      {
        name: 'Sudão',
        abbreviation: 'SD',
        bacen: 7595,
      },
      {
        name: 'Suriname',
        abbreviation: 'SR',
        bacen: 7706,
      },
      {
        name: 'Svalbard e Jan Mayen',
        abbreviation: 'SJ',
        bacen: 7552,
      },
      {
        name: 'Eswatini',
        abbreviation: 'SZ',
        bacen: 7544,
      },
      {
        name: 'Suécia',
        abbreviation: 'SE',
        bacen: 7641,
      },
      {
        name: 'Suíça',
        abbreviation: 'CH',
        bacen: 7676,
      },
      {
        name: 'Síria, Republica Árabe da',
        abbreviation: 'SY',
        bacen: 7447,
      },
      {
        name: 'Formosa (Taiwan)',
        abbreviation: 'TW',
        bacen: 1619,
      },
      {
        name: 'Tadjiquistao, Republica do',
        abbreviation: 'TJ',
        bacen: 7722,
      },
      {
        name: 'Tanzânia, Republica Unida da',
        abbreviation: 'TZ',
        bacen: 7803,
      },
      {
        name: 'Tailândia',
        abbreviation: 'TH',
        bacen: 7765,
      },
      {
        name: 'Togo',
        abbreviation: 'TG',
        bacen: 8001,
      },
      {
        name: 'Toquelau, Ilhas',
        abbreviation: 'TK',
        bacen: 8052,
      },
      {
        name: 'Tonga',
        abbreviation: 'TO',
        bacen: 8109,
      },
      {
        name: 'Trinidad e Tobago',
        abbreviation: 'TT',
        bacen: 8150,
      },
      {
        name: 'Tunísia',
        abbreviation: 'TN',
        bacen: 8206,
      },
      {
        name: 'Turquia',
        abbreviation: 'TR',
        bacen: 8273,
      },
      {
        name: 'Turcomenistão, Republica do',
        abbreviation: 'TM',
        bacen: 8249,
      },
      {
        name: 'Turcas e Caicos, Ilhas',
        abbreviation: 'TC',
        bacen: 8230,
      },
      {
        name: 'Tuvalu',
        abbreviation: 'TV',
        bacen: 8281,
      },
      {
        name: 'Uganda',
        abbreviation: 'UG',
        bacen: 8338,
      },
      {
        name: 'Ucrânia',
        abbreviation: 'UA',
        bacen: 8311,
      },
      {
        name: 'Emirados Árabes Unidos',
        abbreviation: 'AE',
        bacen: 2445,
      },
      {
        name: 'Reino Unido',
        abbreviation: 'GB',
        bacen: 6289,
      },
      {
        name: 'Estados Unidos',
        abbreviation: 'US',
        bacen: 2496,
      },
      {
        name: 'Ilhas Menores Distantes dos Estados Unidos',
        abbreviation: 'UM',
        bacen: 18664,
      },
      {
        name: 'Uruguai',
        abbreviation: 'UY',
        bacen: 8451,
      },
      {
        name: 'Uzbequistão, Republica do',
        abbreviation: 'UZ',
        bacen: 8478,
      },
      {
        name: 'Vanuatu',
        abbreviation: 'VU',
        bacen: 5517,
      },
      {
        name: 'Venezuela',
        abbreviation: 'VE',
        bacen: 8508,
      },
      {
        name: 'Vietnã',
        abbreviation: 'VN',
        bacen: 8583,
      },
      {
        name: 'Virgens, Ilhas (Britânicas)',
        abbreviation: 'VG',
        bacen: 8630,
      },
      {
        name: 'Virgens, Ilhas (E.U.A.)',
        abbreviation: 'VI',
        bacen: 8664,
      },
      {
        name: 'Wallis e Futuna, Ilhas',
        abbreviation: 'WF',
        bacen: 8753,
      },
      {
        name: 'Saara Ocidental',
        abbreviation: 'EH',
        bacen: 6858,
      },
      {
        name: 'Iémen',
        abbreviation: 'YE',
        bacen: 3573,
      },
      {
        name: 'Iugoslávia, República Fed. da',
        abbreviation: 'YU',
        bacen: 3883,
      },
      {
        name: 'Zâmbia',
        abbreviation: 'ZM',
        bacen: 8907,
      },
      {
        name: 'Zimbabue',
        abbreviation: 'ZW',
        bacen: 6653,
      },
      {
        name: 'Guernsey, Ilha do Canal (Inclui Alderney e Sark)',
        abbreviation: 'GG',
        bacen: 1504,
      },
      {
        name: 'Jersey, Ilha do Canal',
        abbreviation: 'JE',
        bacen: 1508,
      },
      {
        name: 'Man, Ilha de',
        abbreviation: 'IM',
        bacen: 3595,
      },
      {
        name: 'Montenegro',
        abbreviation: 'ME',
        bacen: 4985,
      },
      {
        name: 'Republika Srbija',
        abbreviation: 'RS',
        bacen: 7370,
      },
      {
        name: 'Sudao do Sul',
        abbreviation: 'SS',
        bacen: 7600,
      },
      {
        name: 'Zona do Canal do Panamá',
        abbreviation: '',
        bacen: 8958,
      },
      {
        name: 'Palestina',
        abbreviation: 'PS',
        bacen: 5780,
      },
      {
        name: 'Aland, Ilhas',
        abbreviation: 'AX',
        bacen: 153,
      },
      {
        name: 'Coletividade de São Bartolomeu',
        abbreviation: 'BL',
        bacen: 3598,
      },
      {
        name: 'Curaçao',
        abbreviation: 'CW',
        bacen: 200,
      },
      {
        name: 'São Martinho, Ilha de (Parte Francesa)',
        abbreviation: 'SM-FR',
        bacen: 6980,
      },
      {
        name: 'Bonaire',
        abbreviation: 'AN',
        bacen: 990,
      },
      {
        name: 'Antartica',
        abbreviation: 'AQ',
        bacen: 420,
      },
      {
        name: 'Ilha Herad e Ilhas Macdonald',
        abbreviation: 'Himi',
        bacen: 3433,
      },
      {
        name: 'São Bartolomeu',
        abbreviation: 'St-Barth',
        bacen: 6939,
      },
      {
        name: 'São Martinho, Ilha de (Parte Holandesa)',
        abbreviation: 'SM-NL',
        bacen: 6998,
      },
    ])
  }
}