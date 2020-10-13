const { createSchema } = require('@work-ladder/cli-shared-utils')

exports.schema = createSchema((joi) => joi.object({
  publicPath: joi.string().allow(''),
}))

exports.defaults = {
  publicPath: '/',
}
