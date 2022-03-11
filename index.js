const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const url =
  'https://www.microsoft.com/en-au/d/xbox-series-x/8wj714n3rbtl?icid=XboxConsoles_CP2_SeriesX_090221_en_AU&activetab=pivot:overviewtab';
const cssSelector = '#buttons_ConfigureDeviceButton';
const intervalDelay = 45 * 60 * 1000; // Every 45 mins

function checkForStock() {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('Navigating to ', url);
    await page.goto(url);

    console.log('Checking stock...');
    await page.waitForTimeout(3000); // Waiting for elements to finish loading

    const isElementEnabled = await page.$eval(
      cssSelector,
      (el) => !el.disabled
    );
    if (isElementEnabled) {
      console.log('Oh! Stock available!!');
      console.log(new Date());
      emailMe();
    } else {
      console.log('Still out of stock :(');
      console.log(new Date());
    }
    await browser.close();
  })();
}

checkForStock();
setInterval(() => checkForStock(), intervalDelay);

const maillist = [''];
const fromUserEmail = '';
const fromUserPassword = '';

function emailMe() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromUserEmail,
      pass: fromUserPassword,
    },
  });

  const mailOptions = {
    from: fromUserEmail,
    to: maillist,
    subject: 'In stock!',
    text: 'Go check it out - ' + url,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
