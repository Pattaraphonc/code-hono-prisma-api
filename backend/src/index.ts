import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = new Hono()

app.get('/products', async (c) => {
  const products = await prisma.product.findMany()
  return c.json(products)
})

app.get('/products/:id', async (c) => {
  const id  = c.req.param('id')
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return c.notFound()
  return c.json({ data: product })
})

app.post('/products', async (c) => {
  const body = await c.req.json()
  const product = await prisma.product.create({ data: body })
  return c.json({ data: product })
})

serve({
  fetch: app.fetch,
  port: 4002
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
