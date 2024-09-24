import 'dotenv/config'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { serve } from '@hono/node-server'

import { router } from '@/routes'
import { connectMongo } from '@/helpers/connect_mongodb'
import { env } from '@/utils/env'

connectMongo()

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: [
    "http://localhost:3000",
  ],
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-HTTP-Method-Override",
    "Accept",
  ],
  credentials: true,
  allowMethods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
  ],
  exposeHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-HTTP-Method-Override",
    "Accept",
    "Content-Length",
    "Accept-Encoding",
    "Content-Encoding",
    "Content-Disposition",
    "Content-Range",
    "Content-Language",
    "Content-Location",
  ],
}))
app.use('*', prettyJSON())

app.route('/', router)

serve({
  fetch: app.fetch,
  port: Number(env.PORT),
  hostname: '0.0.0.0',
}, (info) => {
  console.log(`Server is running on ${info.port}`)
})