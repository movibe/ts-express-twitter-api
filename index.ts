import * as express from 'express'
import * as Twit from 'twit'

const app = express()

app.get('/', (req, res) => {
    res.send('Twitter Api Request Server Started')
})

const extractHeader = (headers: any): Object => {
    const result = {}
    const compareString = 'p_'
    Object.keys(headers).map((item) => item.substr(0, 2) === compareString ? result[ item.replace(compareString, '') ] = headers[ item ] : null)
    return result
}

app.get('/twitterapi', async (req, res) => {
    const {
        consumer_key,
        consumer_secret,
        access_token,
        access_token_secret,
        timeout_ms,
        twitter_url,
    } = req.headers

    if (
        !consumer_key &&
        !consumer_secret &&
        !access_token &&
        !access_token_secret &&
        !timeout_ms &&
        !twitter_url
    ) {
        return res.status(500).jsonp({
            error: 'Header Missing',
            data: 'consumer_key,consumer_secret,access_token,access_token_secret,timeout_ms,twitter_url,',
        })
    }

    const T = new Twit({
        consumer_key,
        consumer_secret,
        access_token,
        access_token_secret,
        timeout_ms,
    })

    try {
        const params = extractHeader(req.headers)
        const response: any = await T.get(twitter_url, params)
        res.json(response.data)
    } catch (e) {
        return res.status(400).jsonp({
            error: 'Error request',
            data: e,
        })
    }
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
