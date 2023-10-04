def get_email_temp(code):
  html = """\
  <html>
  <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
  <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
    <div style="margin: 0 auto; width: 90%; text-align: center;">
      <h1 style="background-color: #3BB927; padding: 5px 10px; border-radius: 5px; color: white;">Foodle</h1>
      <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
        <h3 style="margin-bottom: 100px; font-size: 24px;">Password Reset Code</h3>
        <p style="margin-bottom: 30px;">Please use the code below to reset your password to your Foodle account. Thank you!</p>
        <p style="margin-bottom: 10px; font-size: 18px;">{code}</p>
      </div>
    </div>
  </div>
  </body>
  </html>
  """.format(code=code)
  return html