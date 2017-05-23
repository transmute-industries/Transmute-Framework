'use strict'

import { web3 } from '../env'

const contract = require('truffle-contract')
const eventStoreFactoryArtifacts = require('../../build/contracts/EventStoreFactory')

import { Transactions } from '../Transactions/Transactions'

export module EventStoreFactory {

    export const EventStoreFactoryContract = contract(eventStoreFactoryArtifacts)
    EventStoreFactoryContract.setProvider(web3.currentProvider)

    export const createEventStore = async (factory, fromAddress) => {
        // console.log(factory)
        let tx = await factory.createEventStore({
            from: fromAddress,
            gas: 2000000
        })
        let events = Transactions.transactionToEventCollection(tx)
        return events
    }

    export const getAllEventStoreContractAddresses = async (factory, fromAddress) => {
        let addresses = await factory.getEventStores({
            from: fromAddress
        })
        return addresses
    }

}
