import { formatPhoneNumber } from './index';

interface Message {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface EmailParams extends Message {
  id: string;
  date: string;
}

function generateText(input: EmailParams) {
  return `Contact Form Message [#${input.id}]\n\nDate: ${input.date}\nName: ${
    input.firstName
  } ${input.lastName}\nEmail: ${input.email}\nPhone: ${formatPhoneNumber(
    input.phone
  )}\n\nMessage: ${
    input.message
  }\n\n*This message was sent from the contact form at macaport.com/contact.\n`;
}

export function generateHtml(input: EmailParams) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Macaport Contact Form Message [#${input.id}]</title></head><body><div style="background-color:#eff2f3;margin:0;width:100%;" ><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="20" bgcolor="#EFF2F3" stye="font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;" class="body-table" ><tbody><tr><td align="left" width="100%" valign="top"><div style="font-size:1px;color:#eff2f3;line-height:1px;overflow:hidden;mso-hide:all;margin:0;padding:0;" > ${input.message}</div><table role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" ><tbody><tr><td><div style="margin: 0 auto; padding: 20px 0; width: 100%;"><center> <img alt="Macaport Logo with Mountains" src="https://res.cloudinary.com/dra3wumrv/image/upload/v1621535049/macaport/logo-horizontal.png" style="text-decoration:none;padding:0;outline:none;line-height:100%;border:0;display:block;max-width:100%;height:56px;" /></div></center></td></tr></tbody></table><div class="main-width" style="margin:0 auto;max-width:600px;width:100%;padding:0;box-sizing: border-box;" ><table role="presentation" width="100%" align="center" border="0" cellpadding="0" ><tbody><tr><td width="100%" align="left" valign="top"><div class="main-body" style="width:100%;background-color:#FFFFFF;border-radius:6px;box-sizing:border-box;padding:0 16px;" ><table role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" ><tbody><tr><td width="100%" align="left" valign="top" bgcolor="#FFFFFF" style="background-color: #FFFFFF;border-radius:8px;box-sizing: border-box;padding: 0 20px 36px;" ><table role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" ><tbody><tr><td><div style="padding: 24px 0 12px;"><h2 style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:18px;line-height:1.25;text-align:left;font-weight:700" > Contact Form Message [#${input.id}]</h2></div></td></tr></tbody></table><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="0" ><tbody><tr><td style="padding: 0 0 12px;border-bottom:1px solid #EEEEEE;"><div class="message-category" style="margin: 0;padding: 0;" ><div class="title" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.35;font-weight:bold;margin: 0 0 4px 0;" > <b>Date</b></div><div class="data" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;margin:0;" > ${input.date}</div></div></td></tr></tbody></table><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="0" ><tbody><tr><td style="padding: 14px 0; border-bottom:1px solid #EEEEEE;"><div class="message-category" style="margin: 0; padding: 0;" ><div class="title" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.35;font-weight:bold;margin: 0 0 4px 0;" > <b>Name</b></div><div class="data" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;margin:0;" > ${input.firstName} ${input.lastName}</div></div></td></tr></tbody></table><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="0" ><tbody><tr><td style="margin-top:16px;padding-top:16px;padding-bottom:16px;border-bottom:1px solid #EEEEEE;"><div class="message-category" style="margin: 0; padding: 0;" ><div class="title" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.35;font-weight:bold;margin: 0 0 4px 0;" > <b>Email</b></div><div class="data" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;margin:0;" > ${input.email}</div></div></td></tr></tbody></table><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="0" ><tbody><tr><td style="margin-top:16px;padding-top:16px;padding-bottom:16px;border-bottom:1px solid #EEEEEE;"><div class="message-category" style="margin: 0; padding: 0;" ><div class="title" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.35;font-weight:bold;margin: 0 0 4px 0;" > <b>Phone</b></div><div class="data" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;margin:0;" > ${input.phone}</div></div></td></tr></tbody></table><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="0" ><tbody><tr><td style="margin-top:16px;padding-top:16px;margin-bottom:0;"><div class="message-category" style="margin: 0; padding: 0;" ><div class="title" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.35;font-weight:bold;margin: 0 0 4px 0;" > <b>Message</b></div><div class="data" style="color:#2e3b42;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;margin:0;" > ${input.message}</div></div></td></tr></tbody></table></td></tr></tbody></table></div></td></tr></tbody></table><table role="presentation" width="100%" height="100%" align="left" border="0" cellpadding="0" ><tbody><tr><td><center><div style="padding:24px 0 40px; width: 100%;"><p style="display:block;font-family:-apple-system,BlinkMacSystemFont,“Segoe UI”,Roboto,Helvetica,Arial,sans-serif;color:#878e92;font-size:14px;line-height:22px;text-align:center" > <a href="https://www.macaport.com" target="_blank" style="font-weight:500;padding:0 6px;color:#203557;text-decoration:none" ><span style="color:#203557;text-decoration:none" >www.macaport.com</span ></a ></p></div></center></td></tr></tbody></table></div></td></tr></tbody></table></div></body></html>`;
}

export function generateContactFormEmail(
  message: Message,
  id: string,
  date: string
) {
  const phone = formatPhoneNumber(message.phone);
  const text = generateText({ ...message, phone, id, date });
  const html = generateHtml({ ...message, phone, id, date });

  return { text, html };
}
