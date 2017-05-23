
var _ = require('lodash')

var {
    TruffleEventSchema
} = require('../EventTypes')

const getPropFromSchema = (propType, value) => {
    switch (propType) {
        case 'String': return value.toString()
        case 'Address': return value.toString()
        case 'BigNumber': return value.toNumber()
        default: throw Error(`UNKNOWN propType ${propType} for value '${value}'. Make sure your schema is up to date.`)
    }
}

const eventFromLog = (log) => {
    let schema = TruffleEventSchema[log.event]
    let event = {}
    _.forIn(log.args, (value, key) => {
        let prop = getPropFromSchema(schema[key], value)
        _.extend(event, {
            [key]: prop
        })
    })
    return event
}

const eventsFromTransaction = (tx) => {
    return tx.logs.map((log) => {
        return eventFromLog(log)
    })
}

module.exports = {
    eventsFromTransaction
}
