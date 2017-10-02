pragma solidity ^0.4.13;


import "../../EventStoreLib.sol";
import '../../../zeppelin/lifecycle/Destructible.sol';

contract UnsafeEventStore is Destructible {
  using EventStoreLib for EventStoreLib.EsEventStorage;

  EventStoreLib.EsEventStorage store;
  address public creator;

  // FALLBACK
  function () payable { revert(); }
  
  // CONSTRUCTOR  
  function UnsafeEventStore() payable {
    creator = tx.origin;
  }

  function eventCount() 
  returns (uint)
  {
    return store.events.length;
  }

  function writeEvent(
    bytes32 _eventType, 
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
    public 
    returns (uint)
  {
    // Check access control here before writing events...
    return EventStoreLib.writeEvent(
      store, 
      _eventType, 
      _keyType,
      _valueType,
      _key,
      _value
    );
  }

  // READ EVENT
  function readEvent(uint _eventId) 
    public 
    returns (
      uint, 
      address, 
      uint, 
      bytes32, 
      bytes1,
      bytes1,
      bytes32,
      bytes32
    )
  {
    return EventStoreLib.readEvent(store, _eventId);
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