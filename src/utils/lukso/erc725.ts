import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js'

import { RPC_URL } from 'constants/lukso'
import Web3 from 'web3'

const provider = new Web3.providers.HttpProvider(RPC_URL)
const config = {
  ipfsGateway: 'https://ipfs.lukso.network/ipfs/'
}
const schema: ERC725JSONSchema[] = [
  {
    name: 'SupportedStandards:ERC725Account',
    key: '0xeafec4d89fa9619884b6b89135626455000000000000000000000000afdeb5d6',
    keyType: 'Mapping',
    valueContent: '0xafdeb5d6',
    valueType: 'bytes'
  },
  {
    name: 'LSP3Profile',
    key: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
    keyType: 'Singleton',
    valueContent: 'JSONURL',
    valueType: 'bytes'
  },
  {
    name: 'LSP1UniversalReceiverDelegate',
    key: '0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47',
    keyType: 'Singleton',
    valueContent: 'Address',
    valueType: 'address'
  }
]

export function getInstance(contractAddress: string) {
  const erc725 = new ERC725(schema, contractAddress, provider, config)

  return erc725
}
