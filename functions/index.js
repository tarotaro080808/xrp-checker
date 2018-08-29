const functions = require('firebase-functions');
const admin = require('firebase-admin')
const axios = require('axios')

admin.initializeApp()

// Cloud Functions
exports.addMessage = functions.https.onRequest((req, res) => {
  const today = new Date();
  const year  = today.getFullYear();      
  const month = ("0"+(today.getMonth() + 1)).slice(-2)
  const target = year + month
  Array.prototype.getLastVal = function (){ return this[this.length -1];}

  let format = req.query.format
  format = req.body.format
  const formattedDate = 'finished'
  
  axios
  .get('https://public.bitbank.cc/xrp_jpy/candlestick/1day/' + year)
  .then(response => {
    let data = response.data.data.candlestick[0].ohlcv
    data = data.getLastVal()
    return admin.database().ref('history/' + target).set(data[3])
  })
  .catch(error => console.log(error))
  return res.status(200).send(formattedDate)
})

exports.getUsdApi = functions.https.onRequest((req, res) => {
  let format = req.query.format
  format = req.body.format
  const formattedDate = 'finished'

  axios
  .get('https://forex.1forge.com/1.0.3/quotes?pairs=USDJPY&api_key=cnwdYmdbfsAoHaJvkOnJEWyXEOwx0dk1')
  .then(response => {
    return admin.database().ref('ticker/USD').set(
      response.data[0].price
    )
  })
  .catch(error => console.log(error))
  return res.status(200).send(formattedDate)
})

exports.getEurApi = functions.https.onRequest((req, res) => {
  let format = req.query.format
  format = req.body.format
  const formattedDate = 'finished'

  axios
  .get('https://forex.1forge.com/1.0.3/quotes?pairs=EURJPY&api_key=cnwdYmdbfsAoHaJvkOnJEWyXEOwx0dk1')
  .then(response => {
    return admin.database().ref('ticker/EUR').set(
      response.data[0].price
    )
  })
  .catch(error => console.log(error))
  return res.status(200).send(formattedDate)
})


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
