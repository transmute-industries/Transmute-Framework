pragma solidity ^0.4.13;

/**
 * @title Event Store Library
 * @author Transmute Industries
 *
 * version 1.0.0
 * Copyright (c) 2017 Transmute Industries, LLC
 * The MIT License (MIT)
 * https://github.com/transmute-industries/transmute-framework/blob/master/LICENSE
 *
 * The Event Store Library is inspired by event sourced applications and architecture.
 *
 * Transmute Industries works on open source projects in the Ethereum community with
 * the purpose of testing, documenting, and deploying reusable code onto the
 * blockchain to improve security, usability, and scalability of smart contracts.
 * Transmute Industries also provides custom dApp development for enterprise built
 * atop these open source projects.
 * For further information: transmute.industries
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

library EventStoreLib {

    struct EsEventStruct {
        address TxOrigin;
        uint Created;

        bytes32 EventType; // Event Type + Version

        bytes1 KeyType; // A - Address, U - UInt, B - Bytes32, X - Bytes32 (ascii)
        bytes1 ValueType; // A - Address, U - UInt, B - Bytes32, X - Bytes32 (ascii)
        
        bytes32 Key; // Key 
        bytes32 Value; // Value 
    }

    struct EsEventStorage {
        EsEventStruct[] events;
    }

    // WRITE EVENT
    function writeEvent(
        EsEventStorage storage self, 
        bytes32 _eventType,
        bytes1 _keyType,
        bytes1 _valueType,
        bytes32 _key,
        bytes32 _value
    ) returns (uint) {
        uint _created = now;
        uint _eventId = self.events.length;

        EsEventStruct memory esEvent;
        esEvent.TxOrigin = msg.sender;
        esEvent.Created = _created;

        esEvent.EventType = _eventType;

        esEvent.KeyType = _keyType;
        esEvent.ValueType = _valueType;

        esEvent.Key = _key;
        esEvent.Value = _value;

        EsEvent(
            _eventId,
            esEvent.TxOrigin, 
            esEvent.Created,
            esEvent.EventType,
            esEvent.KeyType,
            esEvent.ValueType,
            esEvent.Key,
            esEvent.Value
        );
        self.events.push(esEvent);
        return _eventId;
    }

    // READ EVENT
    function readEvent(EsEventStorage storage self, uint _eventId) 
    returns (uint, address, uint, bytes32, bytes1, bytes1, bytes32, bytes32) {
        EsEventStruct memory esEvent = self.events[_eventId];
        return (
            _eventId, 
            esEvent.TxOrigin, 
            esEvent.Created,
            esEvent.EventType,

            esEvent.KeyType,
            esEvent.ValueType,

            esEvent.Key,
            esEvent.Value
        );
    }

    event EsEvent(
        uint Id,
        address TxOrigin,
        uint Created,

        bytes32 EventType,

        bytes1 KeyType,
        bytes1 ValueType,

        bytes32 Key,
        bytes32 Value
    );

}