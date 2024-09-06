const express = require('express')
const jsonRouter = require('express-json-rpc-router')
const app = express()

app.use(express.json())

const controller = {
  // You have access to raw express req/res object as raw.res and raw.req
  testMethod({ username }, raw) {
    console.log('username: ', username)
    return ['example data 1', 'example data 2']
  },
}

const beforeController = {
  // You have access to raw express req/res object as raw.res and raw.req
  testMethod(params, _, raw) {
    if (Math.random() >= 0.5) {
      // Random error
      const error = new Error('Something going wrong')
      error.data = { hello: 'world' } // its optional
      throw error
    }
  },
}

const afterController = {
  testMethod: [
    // You have access to result and to raw express req/res object as raw.res and raw.req.
    (params, result, raw) => console.log('testMethod executed 1!'),
    () => console.log('testMethod executed 2!'),
  ],
}

app.use(
  jsonRouter({
    methods: controller,
    beforeMethods: beforeController,
    afterMethods: afterController,
    onError(err) {
      console.log(err) // send report
    },
  }),
)
//app.use(jsonRouter({ methods: controller }))
//app.use(bodyParser.json())

app.listen(3003, () => console.log('Example app listening on port 3003'))
