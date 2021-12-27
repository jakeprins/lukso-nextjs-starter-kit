export const LSP4schema = [
  {
    name: 'SupportedStandards:LSP4DigitalCertificate',
    key: '0xeafec4d89fa9619884b6b89135626455000000000000000000000000abf0613c',
    keyType: 'Mapping',
    valueContent: '0xabf0613c',
    valueType: 'bytes'
  },
  {
    name: 'LSP4TokenName',
    key: '0xdeba1e292f8ba88238e10ab3c7f88bd4be4fac56cad5194b6ecceaf653468af1',
    keyType: 'Singleton',
    valueContent: 'String',
    valueType: 'string'
  },
  {
    name: 'LSP4TokenSymbol',
    key: '0x2f0a68ab07768e01943a599e73362a0e17a63a72e94dd2e384d2c1d4db932756',
    keyType: 'Singleton',
    valueContent: 'String',
    valueType: 'string'
  },
  {
    name: 'LSP4Metadata',
    key: '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e',
    keyType: 'Singleton',
    valueContent: 'JSONURL',
    valueType: 'bytes'
  },
  {
    name: 'LSP4Creators[]',
    key: '0x114bd03b3a46d48759680d81ebb2b414fda7d030a7105a851867accf1c2352e7',
    keyType: 'Array',
    valueContent: 'Number',
    valueType: 'uint256',
    elementValueContent: 'Address',
    elementValueType: 'address'
  }
]
