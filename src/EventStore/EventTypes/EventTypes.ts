
import { web3 } from '../../env'

import * as _ from 'lodash'

export module EventTypes {

    export interface IBigNumber {
        toNumber: ()=> number;
    }

    export interface IEsEventFromTruffle {
        Id: IBigNumber;
        Type: string;
        Version: string;

        ValueType: string;
        AddressValue: string;
        UIntValue: IBigNumber;
        Bytes32Value: string;

        TxOrigin: string;
        Created: IBigNumber;
        PropertyCount: IBigNumber;
    }

    export interface IEsEventPropertyFromTruffle {
        EventIndex: IBigNumber;
        EventPropertyIndex: IBigNumber;
        Name: string;
        ValueType: string;

        AddressValue: string;
        UIntValue: IBigNumber;
        Bytes32Value: string;
    }

    export interface IEsEvent {
        Id?: number;
        Type: string;
        Version: string;

        ValueType: string;
        AddressValue: string;
        UIntValue: number;
        Bytes32Value: string;

        TxOrigin?: string;
        Created?: number;
        PropertyCount?: number;
    }

    export interface IEsEventProperty {
        EventIndex: number;
        EventPropertyIndex: number;
        Name: string;
        ValueType: string;

        AddressValue: string;
        UIntValue: number;
        Bytes32Value: string;
    }

    export interface ITransmuteEventMeta{
        id: number,
        version: string,
        txOrigin: string
        created: number
    }

    // an event that is compatible with redux actions
    // http://redux.js.org/docs/basics/Actions.html
    // https://github.com/airbnb/javascript#objects
    // https://github.com/acdlite/flux-standard-action
    // TLDR; we are extending the FSA here, to add some required EventStore properties
    export interface ITransmuteEvent {
        type: string,
        // The type of an action identifies to the consumer the nature of the action that has occurred. 
        // By convention, type is usually a string constant or a Symbol. 
        // If two types are the same, they MUST be strictly equivalent (using ===).
        payload: any,
        // The optional payload property MAY be any type of value. It represents the payload of the action. 
        // Any information about the action that is not the type or status of the action should be part of the payload field.
        // By convention, if error is true, the payload SHOULD be an error object. This is akin to rejecting a promise with an error object.
        error?: any,
        // The optional error property MAY be set to true if the action represents an error.
        // An action whose error is true is analogous to a rejected Promise. By convention, the payload SHOULD be an error object.
        // If error has any other value besides true, including undefined and null, the action MUST NOT be interpreted as an error.
        meta:ITransmuteEventMeta
        // meta data from the event, this keeps the payload clean of meta data, which is important!
    }

    export interface ITransmuteCommand {
        type: string,
        payload: any
    }

    export const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }

    /**
    * @typedef {String} EsEvent
    */
    export const EsEvent = 'EsEvent'
    /**
    * @typedef {String} EsEventProperty
    */
    export const EsEventProperty = 'EsEventProperty'

    /**
    * @typedef {Object} EsEventPropertySchema
    * @property {Number} EventIndex  - the solidityEventId used by the EventStore
    * @property {Number} EventPropertyIndex  - the property index used by the EventStore
    * @property {String} Name - a string representing a key
    * @property {String} Type - a string representing the type of the value
    * @property {String} AddressValue - an address value
    * @property {Number} UIntValue  - a uint value
    * @property {String} Bytes32Value - a string value
    */
    export const EsEventPropertySchema = {
        EventIndex: 'BigNumber',
        EventPropertyIndex: 'BigNumber',
        Name: 'Bytes32',
        ValueType: 'Bytes32',

        AddressValue: 'String',
        UIntValue: 'BigNumber',
        Bytes32Value: 'Bytes32'
    }

    /**
    * @typedef {Object} EsEventSchema
    * @property {Number} Id - the solidityEventId used by the EventStore
    * @property {String} Type - a string representing the redux action
    * @property {Number} Created - the time (uint) the event was written by the EventStore
    * @property {String} IntegrityHash - web3.sha3(JSON.stringify(event)) an unsafe way to check if the object has changed
    * @property {Number} PropertyCount - a number (uint) of custom properties on the event
    */
    export const EsEventSchema = {
        Id: 'BigNumber',
        Type: 'Bytes32',
        Version: 'Bytes32',

        ValueType: 'Bytes32',
        AddressValue: 'String',
        UIntValue: 'BigNumber',
        Bytes32Value: 'Bytes32',

        TxOrigin: 'String',
        Created: 'BigNumber',
        PropertyCount: 'BigNumber'
    }

    /**
    * @typedef {Object} TruffleEventSchema
    * @property {EsEventSchema} EsEvent -  a Solidity Event Schema
    * @property {EsEventPropertySchema} EsEventProperty - a Solidity Event Property Schema
    */
    export const TruffleEventSchema = {
        [EsEvent]: EsEventSchema,
        [EsEventProperty]: EsEventPropertySchema
    }

     /**
     * @type {Function} getPropFromTruffleEventSchemaType - convert truffle values to transmute values (js types) from schema keys
     * @param {String} schemaPropType - the type of the truffle property
     * @param {Object} readModel - a json object representing the state of a given model
     * @return {Object} the property type without truffle data types (no bid numbers or other truffle types...)
     */
    export const getPropFromTruffleEventSchemaType = (schemaPropType, truffleValue) => {
        switch (schemaPropType) {
            case 'Address': return truffleValue.toString()
            case 'String': return truffleValue.toString()
            case 'Bytes32': return EventTypes.toAscii(truffleValue)
            case 'BigNumber': return truffleValue.toNumber()
            case 'UInt': return truffleValue.toNumber()
            default: throw Error(`UNKNWON schemaPropType for truffleValue '${truffleValue}'. Make sure your schema is up to date.`)
        }
    }

    export const getTransmuteEventPropertyFromEsEventProperty = (prop) => {
        let _obj = {}
        switch (prop.Type) {
            case 'Bytes32': _obj[prop.Name] = toAscii(prop.Bytes32Value); break;
            case 'BigNumber': _obj[prop.Name] = prop.UIntValue; break;
            case 'Address': _obj[prop.Name] = prop.AddressValue; break;
        }
        return _obj
    }

    export const getEsEventFromEsEventValues = (eventValues): IEsEventFromTruffle  => {
        let evt = {};
        _.keys(EsEventSchema).map((k, i ) =>{
            evt[k] = eventValues[i]
        })
        return <IEsEventFromTruffle> evt
    }

    export const getEsEventPropertyFromEsEventPropertyValues = (eventPropValues): IEsEventPropertyFromTruffle  => {
        let evt = {};
        _.keys(EsEventPropertySchema).map((k, i ) =>{
            evt[k] = eventPropValues[i]
        })
        return <IEsEventPropertyFromTruffle> evt
    }

    export const getEsEventFromEsEventWithTruffleTypes = (eventType: string, solEvent: IEsEventFromTruffle): IEsEvent  =>{
        let event = {}
        let schema = TruffleEventSchema[eventType]
        _.forIn(solEvent, (value, key) => {
            let prop = getPropFromTruffleEventSchemaType(schema[key], value)
            _.extend(event, {
                [key]: prop
            })
        })
        return <IEsEvent> event
    }

}