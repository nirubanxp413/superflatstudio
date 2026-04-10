/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['p5'],

  webpack(config, { isServer }) {
    // Sanity Studio uses browser-only APIs; exclude it from the server bundle
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        ({ request }, callback) => {
          // Let the server bundle skip the heavy studio chunk
          if (request && request.includes('@sanity/') && !request.includes('@sanity/client')) {
            return callback(null, `commonjs ${request}`)
          }
          callback()
        },
      ]
    }
    return config
  },
}

module.exports = nextConfig
