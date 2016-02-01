import redis from 'promise-redis'
let client = redis().createClient(6379,"localhost")

exports.sessionDao = client
