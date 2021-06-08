import { formatPhoneNumber, formatDate, formatToMoney } from './index';
import { Order } from '../interfaces';

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

// demo-store code ...

function generateReceiptText(order: Order) {
  return `Hi ${
    order.customer.firstName
  },\n\nThis is confirmation for your Macaport Demo Apparel Order. \n\nOrder ID: ${
    order._id
  } \nDate: ${formatDate(`${order.createdAt}`)} \nName: ${
    order.customer.firstName
  } ${order.customer.lastName} \nEmail: ${
    order.customer.email
  } \n\nOrder Summary:
  ${order.items
    .map(
      i =>
        `\n${i.name} (${i.size}) Qty: ${i.quantity} - ${formatToMoney(
          i.itemTotal!
        )}`
    )
    .join('')} \n\nSubtotal: ${formatToMoney(
    order.summary.subtotal,
    true
  )} \nTransaction Fee: ${formatToMoney(
    order.summary.transactionFee,
    true
  )} \nTotal: ${formatToMoney(order.summary.total, true)}
  `;
}

function generateReceiptHtml(order: Order) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Macaport Demo Apparel Store</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
        /* CLIENT_SPECIFIC STYLES */
        body,
        table,
        td,
        a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        /* RESET STYLES */
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
  
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
  
        /* GMAIL BLUE LINKS */
        u + #body a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* SAMSUNG MAIL BLUE LINKS */
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* Universal styles for links and stuff */
  
        /* Responsive styles */
        @media screen and (max-width: 600px) {
          .mobile {
            padding: 0 !important;
            width: 100% !important;
          }
  
          .mobile-padding {
            padding: 0 24px !important;
          }
        }
  
        @media screen and (max-width: 500px) {
          .mobile-full-width {
            width: 100% !important;
          }
  
          .item-title {
            padding: 14px 0 0 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.25px !important;
            font-weight: bold !important;
          }
        }
      </style>
    </head>
    <body
      id="body"
      style="
        margin: 0 !important;
        padding: 0 !important;
        background-color: #edf0f3;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        width="100%"
      >
        <tr>
          <td align="center" style="padding: 24px 0 0" class="mobile">
            <table
              class="mobile"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              width="600"
              bgcolor="#ffffff"
              style="
                background-color: #ffffff;
                color: #242a37;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                  sans-serif;
                font-size: 18px;
                line-height: 36px;
                margin: 0;
                padding: 0;
              "
            >
              <tr>
                <td style="padding: 0 64px" class="mobile-padding">
                  <table
                    class="mobile"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <!-- Logo -->
                    <tr>
                      <td align="center" style="padding: 42px 0 18px">
                        <img
                          src="https://res.cloudinary.com/dra3wumrv/image/upload/v1621535049/macaport/logo-main-bg.png"
                          alt="Macaport logo with mountains"
                          width="64"
                          style="display: block; margin: 0 auto"
                        />
                      </td>
                    </tr>
  
                    <!-- Store Title -->
                    <tr>
                      <td style="padding: 0; line-height: 1">
                        <h1
                          style="
                            margin: 0;
                            font-size: 20px;
                            font-weight: 400;
                            color: #232c35;
                            text-align: center;
                          "
                        >
                          Macaport Demo Store Receipt
                        </h1>
                      </td>
                    </tr>
  
                    <!-- Order ID -->
                    <tr>
                      <td style="padding: 0 0 24px">
                        <h1
                          style="
                            margin: 0;
                            font-size: 15px;
                            font-weight: 400;
                            color: #8398ad;
                            text-align: center;
                          "
                        >
                          Order #${order.orderId}
                        </h1>
                      </td>
                    </tr>
  
                    <!-- Order Details -->
                    <tr>
                      <td style="font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="70"
                        >
                          <tr>
                            <td
                              style="color: #242a37; font-weight: 500"
                              class="item-title"
                            >
                              Date:
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="300"
                        >
                          <tr>
                            <td style="color: #52677b">
                              ${formatDate(`${order.createdAt}`)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="70"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #242a37; font-weight: 500"
                            >
                              Name:
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="300"
                        >
                          <tr>
                            <td style="color: #52677b">
                              ${order.customer.firstName}
                              ${order.customer.lastName}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="70"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #242a37; font-weight: 500"
                            >
                              Email:
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="300"
                        >
                          <tr>
                            <td style="color: #52677b">
                              ${order.customer.email}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Order Items -->
                    <tr>
                      <td style="padding: 40px 0 12px">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td
                              style="
                                font-size: 12px;
                                font-weight: 500;
                                color: #8398ad;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                                line-height: 1.65;
                              "
                            >
                              Order Summary
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0 0; font-size: 15px">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                          style="background-color: #f8f8f8"
                        >
                          <tr>
                            <td style="padding: 0 20px">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                width="100%"
                              >
                                <!-- Order items -->
                                ${order.items
                                  .map(
                                    (item, index) => `
                                <tr key="${item.id}">
                                  <td
                                    style="${`
                                      padding: 18px 0;
                                      color: #242a37;
                                      line-height: 1;
                                      ${
                                        index !== 0
                                          ? 'border-top: 1px solid #e5e5e5;'
                                          : ''
                                      }
                                    `}"
                                  >
                                    <table
                                      align="left"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      width="100%"
                                    >
                                      <tr>
                                        <td>
                                          <div
                                            style="
                                              padding: 0 0 6px;
                                              font-weight: 500;
                                            "
                                          >
                                            ${item.name}
                                          </div>
                                          <div
                                            style="
                                              font-size: 14px;
                                              color: #627b93;
                                            "
                                          >
                                            Color: ${item.color} | Size:
                                            ${item.size} | Qty: ${item.quantity}
                                          </div>
                                        </td>
                                        <td
                                          style="
                                            text-align: right;
                                            vertical-align: middle;
                                            font-weight: 500;
                                          "
                                        >
                                          ${formatToMoney(item.itemTotal!)}
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                `
                                  )
                                  .join('')}
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Order Totals -->
                    <tr>
                      <td
                        style="
                          padding: 32px 0 42px;
                          font-size: 15px;
                          color: #52677b;
                          line-height: 1.5;
                        "
                      >
                        <table
                          align="right"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="240"
                        >
                          <tr>
                            <td>Subtotal:</td>
                            <td style="text-align: right">
                              ${formatToMoney(order.summary.subtotal, true)}
                            </td>
                          </tr>
                          <tr>
                            <td>Transaction Fee:</td>
                            <td style="text-align: right">
                              ${formatToMoney(
                                order.summary.transactionFee,
                                true
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #242a37">
                              Total:
                            </td>
                            <td
                              style="
                                text-align: right;
                                font-weight: bold;
                                color: #10b981;
                              "
                            >
                              ${formatToMoney(order.summary.total, true)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Questions and contact -->
                    <tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td
                              style="
                                padding: 28px 0;
                                font-size: 16px;
                                color: #5a7187;
                                line-height: 1.5;
                                border-top: 1px solid #e6ebf1;
                                border-bottom: 1px solid #e6ebf1;
                              "
                            >
                              <p style="margin: 0">
                                If you have any questions about your order,
                                contact us at
                                <a
                                  href="#"
                                  style="color: #2563eb; text-decoration: none"
                                  >test@email.com</a
                                >
                                or call at
                                <a
                                  href="#"
                                  style="color: #2563eb; text-decoration: none"
                                  >(123) 456-7890</a
                                >.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Footer -->
                    <tr>
                      <td
                        style="
                          padding: 40px 0;
                          color: #5a7187;
                          font-size: 14px;
                          line-height: 1.3;
                        "
                      >
                        <p style="margin: 0 0 20px 0">
                          You're receiving this email because you made a purchase
                          from
                          <a
                            href="#"
                            style="color: #2563eb; text-decoration: none"
                            >Macaport Demo Apparel Store</a
                          >.
                        </p>
                        <p style="margin: 0">
                          1234 Test Street, New London, WI 12345
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export function generateReceiptEmail(order: Order) {
  const text = generateReceiptText(order);
  const html = generateReceiptHtml(order);
  return { text, html };
}