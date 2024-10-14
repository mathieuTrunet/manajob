const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/

const { OPENAI_API_KEY } = process.env

const API_URL = `https://api.openai.com/v1/chat/completions`

const MAXIMUM_BODY_SIZE = 12_500

interface Completion {
  choices: Array<{ message: { content: string } }>
}

const getBody = (text: string) =>
  JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `return data from this job offer:name of the company offering; date of post of offer;
            experience required | experience categories: junior = 1; confirmed = 3; 
            senior/experimented = 5; if no relevant data found = 0 | date: return as format YYYY-MM-YY;today date is: ${getTodayDate()};
            if no relevant data found = empty string | if no relevant company name found = empty string | returned json object : {companyName:, offerDate:, experienceRequired:}`,
          },
        ],
      },
      {
        role: 'user',
        content: [{ type: 'text', text: text }],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: { type: 'json_object' },
  })

const fetchOffer = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) return response.status

  const text = await response.text()

  return getParsedOffer(text)
}

const getParsedOffer = (body: string) =>
  body
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[!@#$%^&*+=\[\]{}<>]/g, '')
    .replace(/\s{2,}/g, ' ')

const getFetchOfferErrorMessage = (errorStatus: number) => {
  if (errorStatus === 403) return 'Forbidden'

  return 'Offer Fetch Error'
}

const fetchCompletion = async (text: string): Promise<Completion | number> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': `application/json` },
    body: getBody(text),
  })

  if (!response.ok) return response.status

  const completion = (await response.json()) as Completion

  return completion
}

const getFetchCompletionErrorMessage = (errorStatus: number) => {
  if (errorStatus === 429) return 'Too Many Requests'

  if (errorStatus === 403) return 'Region Not Supported'

  if (errorStatus === 503) return 'Engine Overloaded'

  return 'Completion Fetch Error'
}

const getTodayDate = () => new Date(Date.now())

export async function POST(request: Request) {
  const body = await request.text()

  if (!body) return new Response('Empty Body', { status: 400 })

  if (body.length > MAXIMUM_BODY_SIZE) return new Response('Body Too Large', { status: 413 })

  const isUrl = URL_REGEX.test(body)

  const offerResponse = isUrl ? await fetchOffer(body) : body

  if (typeof offerResponse === 'number')
    return new Response(getFetchOfferErrorMessage(offerResponse), { status: offerResponse })

  const completionResponse = await fetchCompletion(offerResponse)

  if (typeof completionResponse === 'number')
    return new Response(getFetchCompletionErrorMessage(completionResponse), { status: completionResponse })

  const parsedCompletion = JSON.parse(completionResponse.choices[0].message.content)

  const responseHeaders = { headers: { 'Content-Type': 'application/json' }, status: 200 }

  return new Response(JSON.stringify({ ...parsedCompletion, ...(isUrl && { offerLink: body }) }), responseHeaders)
}
