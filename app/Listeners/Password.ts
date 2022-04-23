import type { EventsList } from '@ioc:Adonis/Core/Event'

import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class Password {
  public async onForgotPassword(data: EventsList['forgot:password']) {
    const { email, token, fullName } = data

    const urlWithToken = `${Env.get('WEB_APP_URL')}/reset-password?token=${token}`

    await Mail.sendLater((message) => {
      message
        .from('no-reply@talentos.gift')
        .to(email)
        .subject('Gift: Recuperação de Senha')
        .htmlView('emails/forgotpassword', {
          productName: 'Gift',
          name: fullName,
          resetPasswordUrl: urlWithToken,
        })
    })
  }
}
