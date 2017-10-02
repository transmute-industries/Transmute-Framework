var Ownable = artifacts.require('./TransmuteFramework/zeppelin/ownership/Ownable.sol')
var Destructible = artifacts.require('./TransmuteFramework/zeppelin/lifecycle/Destructible.sol')

var AddressSetLib = artifacts.require("./TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol")
var AddressSetSpec = artifacts.require("./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol")

var Bytes32SetLib = artifacts.require("./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetLib.sol")
var Bytes32SetSpec = artifacts.require("./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol")

var UIntSetLib = artifacts.require("./TransmuteFramework/SetLib/UIntSet/UIntSetLib.sol")
var UIntSetSpec = artifacts.require("./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol")

var RBAC = artifacts.require('./TransmuteFramework/RBAC.sol')

var EventStoreLib = artifacts.require('./TransmuteFramework/EventStore/EventStoreLib.sol')

var UnsafeEventStore = artifacts.require('./TransmuteFramework/EventStore/UnsafeEventStore/UnsafeEventStore.sol')
var UnsafeEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/UnsafeEventStore/UnsafeEventStoreFactory.sol')

var RBACEventStore = artifacts.require('./TransmuteFramework/EventStore/RBACEventStore/RBACEventStore.sol')
var RBACEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/RBACEventStore/RBACEventStoreFactory.sol')

module.exports = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Destructible)
  deployer.deploy(Destructible)

  deployer.deploy(AddressSetLib)
  deployer.link(AddressSetLib, AddressSetSpec)
  deployer.deploy(AddressSetSpec)

  deployer.deploy(Bytes32SetLib)
  deployer.link(Bytes32SetLib, Bytes32SetSpec)
  deployer.deploy(Bytes32SetSpec)

  deployer.deploy(UIntSetLib)
  deployer.link(UIntSetLib, UIntSetSpec)
  deployer.deploy(UIntSetSpec)

  deployer.deploy(EventStoreLib)
  
  deployer.link(EventStoreLib, UnsafeEventStore)
  deployer.link(AddressSetLib, UnsafeEventStore)
  deployer.link(Destructible, UnsafeEventStore)
  deployer.deploy(UnsafeEventStore)

  deployer.link(EventStoreLib, UnsafeEventStoreFactory)
  deployer.link(AddressSetLib, UnsafeEventStoreFactory)
  deployer.link(UnsafeEventStore, UnsafeEventStoreFactory)
  deployer.deploy(UnsafeEventStoreFactory)

  deployer.link(EventStoreLib, RBAC)
  deployer.link(Bytes32SetLib, RBAC)
  deployer.deploy(RBAC)

  deployer.link(EventStoreLib, RBACEventStore)
  deployer.link(Bytes32SetLib, RBACEventStore)
  deployer.link(RBAC, RBACEventStore)
  deployer.deploy(RBACEventStore)

  deployer.link(EventStoreLib, RBACEventStoreFactory)
  deployer.link(Bytes32SetLib, RBACEventStoreFactory)
  deployer.link(RBAC, RBACEventStoreFactory)
  deployer.link(AddressSetLib, RBACEventStoreFactory)
  deployer.link(RBACEventStore, RBACEventStoreFactory)
  deployer.deploy(RBACEventStoreFactory)
}
