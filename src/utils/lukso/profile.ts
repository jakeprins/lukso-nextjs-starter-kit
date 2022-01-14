import { ADDRESSES } from 'constants/lukso'
import { AbiItem } from 'web3-utils'
import KeyManager from '@lukso/universalprofile-smart-contracts/artifacts/LSP6KeyManager.json'
import { LSP3UniversalProfile } from '@lukso/lsp-factory.js'
import UP from '@lukso/universalprofile-smart-contracts/artifacts/UniversalProfile.json'
import Web3 from 'web3'
import { getInstance } from './erc725'

export const fetchUniversalProfile = async (contractAddress: string): Promise<any> => {
  const erc725 = getInstance(contractAddress)
  const profile = await erc725.fetchData('LSP3Profile')

  return profile.LSP3Profile
}

export const fetchERC725Data = async (contractAddress: string): Promise<any> => {
  const erc725 = getInstance(contractAddress)
  let response
  try {
    response = await erc725.fetchData(['LSP3Profile', 'LSP1UniversalReceiverDelegate'])
  } catch (e) {
    console.log(e)
  }

  return response
}

const uploadMetadataToIPFS = async (metadata: any) => {
  const uploadResult = await LSP3UniversalProfile.uploadProfileData(metadata)

  return uploadResult.url
}

export const createContractsInstance = async (profileAddress: string, web3: any) => {
  const profileContract = new web3.eth.Contract(UP.abi, profileAddress)

  const keyManagerAddress = await profileContract.methods.owner().call()
  const keyManagerContract = new web3.eth.Contract(KeyManager.abi, keyManagerAddress)

  return { profileContract, keyManagerContract }
}

export const updateUniversalProfile = async (profile: any, accountAddress: string, web3: any) => {
  const profileMetadataIPFSUrl = await uploadMetadataToIPFS(profile)
  const erc725 = getInstance(profile.address)
  const encodedData = erc725.encodeData({
    LSP3Profile: {
      hashFunction: 'keccak256(utf8)',
      hash: web3.utils.keccak256(JSON.stringify({ LSP3Profile: profile })),
      url: profileMetadataIPFSUrl
    }
  })
  const { profileContract, keyManagerContract } = await createContractsInstance(
    profile.address,
    web3
  )
  const abiPayload = await profileContract.methods
    .setData([encodedData.LSP3Profile.key], [encodedData.LSP3Profile.value])
    .encodeABI()

  const result = await keyManagerContract.methods
    .execute(abiPayload)
    .send({ from: accountAddress, gasLimit: 3_000_000 })

  return result
}

export const getData = async (address: string, keys: string[], web3: Web3) => {
  const Contract = new web3.eth.Contract(
    [
      {
        stateMutability: 'view',
        type: 'function',
        inputs: [
          {
            internalType: 'bytes32[]',
            name: '_keys',
            type: 'bytes32[]'
          }
        ],
        name: 'getData',
        outputs: [
          {
            internalType: 'bytes[]',
            name: 'values',
            type: 'bytes[]'
          }
        ]
      }
    ],
    address
  )

  let data: string[] = []
  try {
    data = await Contract.methods.getData(keys).call()
  } catch (err: any) {
    console.log(err.message)
  }

  return data
}

// const getDataMultiple = async (address: string, keys: string[], web3: Web3) => {
//   const abi: AbiItem[] = [
//     {
//       type: 'function',
//       stateMutability: 'view',
//       outputs: [
//         {
//           type: 'bytes[]',
//           name: '',
//           internalType: 'bytes[]'
//         }
//       ],
//       name: 'getDataMultiple',
//       inputs: [
//         {
//           type: 'bytes32[]',
//           name: '_keys',
//           internalType: 'bytes32[]'
//         }
//       ]
//     }
//   ]
//   const Contract = new web3.eth.Contract(abi, address)
//   let dataMultiple: string[] = []
//   try {
//     dataMultiple = await Contract.methods.getDataMultiple(keys).call()
//   } catch (err: any) {
//     console.log(err.message)
//     console.log('getDataMultiple not working, fetching with getData')
//     dataMultiple = await Promise.all(keys.map((key) => getDataLegacy(address, web3, key)))
//   }

//   return dataMultiple
// }

// const getDataLegacy = async (address: string, web3: Web3, key: string) => {
//   const abi: AbiItem[] = [
//     {
//       type: 'function',
//       stateMutability: 'view',
//       outputs: [
//         {
//           type: 'bytes',
//           name: '_value',
//           internalType: 'bytes'
//         }
//       ],
//       name: 'getData',
//       inputs: [
//         {
//           type: 'bytes32',
//           name: '_key',
//           internalType: 'bytes32'
//         }
//       ]
//     }
//   ]
//   const Contract = new web3.eth.Contract(abi, address)
//   let data
//   try {
//     data = await Contract.methods.getData(key).call()
//   } catch (err: any) {
//     console.log(err.message)
//   }

//   return data
// }

const getAllDataKeys = async (address: string, web3: Web3): Promise<string[]> => {
  const abi: AbiItem[] = [
    {
      type: 'function',
      stateMutability: 'view',
      outputs: [
        {
          type: 'bytes32[]',
          name: '',
          internalType: 'bytes32[]'
        }
      ],
      name: 'allDataKeys',
      inputs: []
    }
  ]
  const Contract = new web3.eth.Contract(abi, address)
  let allDataKeys = []
  try {
    allDataKeys = await Contract.methods.allDataKeys().call()
  } catch (err: any) {
    console.log(err.message)
  }

  return allDataKeys
}

export const getAddressesWithPermissions = async (profileAddress: string, web3: Web3) => {
  const getKeys = await getAllDataKeys(profileAddress, web3)
  const permissionKey = ADDRESSES.PERMISSIONS
  const permissionKeys = getKeys.filter((key) => key.indexOf(permissionKey) !== -1)
  const addressesWithPermissions = permissionKeys.map((key) => key.replace(permissionKey, '0x'))

  return addressesWithPermissions
}

export const hasPermission = async (profileAddress: string, accountAddress: string, web3: Web3) => {
  const addressesWithPermissions = await getAddressesWithPermissions(profileAddress, web3)
  const hasPermission = addressesWithPermissions.includes(accountAddress.toLowerCase())

  return hasPermission
}
