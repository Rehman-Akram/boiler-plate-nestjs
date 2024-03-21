export function newUserEmailTemplate(recipientName: string, message: string): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
  </head>
  <body>
    <div class="container">
      <h1>Hi ${recipientName},</h1>
      <p>${message}</p>
      <p>Looking forward to seeing you!</p>
      <p>Best regards,</p>
    </div>
  </body>
  </html>`;
}
