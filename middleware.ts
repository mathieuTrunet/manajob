import { next } from '@vercel/edge'
import { ipAddress } from '@vercel/functions'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const MAXIMUM_REQUEST = 3

const REQUEST_PER_MINUTE = 60

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(MAXIMUM_REQUEST, `${REQUEST_PER_MINUTE} s`),
})

export const config = {
  matcher: '/api/:path*',
}

export default async function middleware(request: Request) {
  const ip = ipAddress(request) || '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  return success ? next() : new Response('User Limit Reached', { status: 429 })
}
