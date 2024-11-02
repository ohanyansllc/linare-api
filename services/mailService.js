const nodemailer = require("nodemailer");

module.exports = class MailService {
  mailer = nodemailer.createTransport({
      host: process.env.ORGANIZATION_EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
          user: process.env.ORGANIZATION_EMAIL,
          pass: process.env.ORGANIZATION_PASS
      },
      tls: {
          rejectUnauthorized: false
      }
  });

  async sendMail(email, url, subject, purpose) {
      const newUrl = `${process.env.SITE_URL}/${url}`;

      try {
          await this.mailer
              .sendMail({
                  from: `Linare <${process.env.ORGANIZATION_EMAIL}>`,
                  to: email,
                  subject: subject,
                  html: `<a href="${newUrl}">${purpose}</a>`,
              })
      } catch(error) {
          console.log(error)
      }
  }

  async customerSendMail(email, subject, purpose) {
      try {
          await this.mailer
              .sendMail({
                  from: email,
                  to: `Linare <${process.env.ORGANIZATION_EMAIL}>`,
                  subject: subject,
                  html: `<div>${purpose}</div>`,
              })
      } catch(error) {
          console.log(error)
      }
  }

    async userInviteSendMail(email, subject, purpose) {
        try {
            await this.mailer
                .sendMail({
                    from: `Linare <${process.env.ORGANIZATION_EMAIL}>`,
                    to: email,
                    subject: subject,
                    html: `<div>${purpose}</div>`,
                })
        } catch (error) {
            console.log(error)
        }
    }
};
