import { AbiItem } from 'web3-utils'
import { ERC725JSONSchema } from '@erc725/erc725.js' // LSP1 Interface: Universal Receiver Address Store
import LSP1 from 'interfaces/LSP1.json' // Deprecated LSP4 Interface: Old Digital Certificate Metadata
import LSP4D from 'interfaces/LSP4D.json'
import { LSP4schema } from 'schemas/LSP4.schema.js' // Schema for the Digital Certificate Metadata Standard
import LSP8 from 'interfaces/LSP8.json' // LSP8 Interface: Improved Non Fungible Token
import Web3 from 'web3'
import { getInstance } from '.'

export const getAssetsFromProfile = async (receiver: string, web3: Web3) => {
  const tokenAddresses = await getTokenAddresses(receiver, web3)
  const digitalAssets: any = await getMetaData(tokenAddresses, web3)

  return digitalAssets
}

const getMetaData = async (tokenAddresses: string[], web3: Web3) => {
  const assets: any = []
  for (const tokenAddress of tokenAddresses) {
    try {
      const digitalAssetAddress = web3.utils.toChecksumAddress(tokenAddress.substr(26))
      const metaURL = await getAssetMetaData(digitalAssetAddress, web3)
      const tokenName = await getAssetTokenName(digitalAssetAddress, web3)
      console.log('tokenName', tokenName)

      if (metaURL) {
        const metadata = await fetchJSON(metaURL)
        console.log(metadata)
        assets.push(metadata.LSP4Metadata)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return assets
}

const getTokenAddresses = async (receiver: string, web3: Web3) => {
  try {
    const addressStore = new web3.eth.Contract(LSP1, receiver)
    const tokenAddresses = await addressStore.methods.getAllRawValues().call()

    return tokenAddresses
  } catch (e) {
    console.log(e)
  }
}

const fetchJSON = async (url: string) => {
  try {
    const response = await fetch(url)
    const exam = await response.json()
    return exam
  } catch (e) {
    console.log('JSON data of IPFS link could not be fetched', e)
  }
}

const getAssetMetaData = async (assetAddress: string, web3: Web3) => {
  try {
    // Check if asset is LSP4D or new LSP8
    const isLegacy = await isERC725YLegacy(assetAddress, web3)
    const interfaceJSON = isLegacy ? LSP4D : LSP8
    const schemaKey = LSP4schema[3].key
    const key = isLegacy ? schemaKey : [schemaKey]

    // Fetch the encoded contract data
    const digitalAsset = new web3.eth.Contract(interfaceJSON, assetAddress)
    const encodedData = await digitalAsset.methods.getData(key).call()

    // Decode fetched data
    const metaData = await decodeMetaData(encodedData, assetAddress)

    return metaData
  } catch (e) {
    console.log('Data of assets address could not be loaded', e)
  }
}

const getAssetTokenName = async (assetAddress: string, web3: Web3) => {
  try {
    // Check if asset is LSP4D or new LSP8
    const isLegacy = await isERC725YLegacy(assetAddress, web3)
    const interfaceJSON = isLegacy ? LSP4D : LSP8
    const schemaKey = LSP4schema[1].key
    const key = isLegacy ? schemaKey : [schemaKey]

    // Fetch the encoded contract data
    const digitalAsset = new web3.eth.Contract(interfaceJSON, assetAddress)
    const encodedData = await digitalAsset.methods.getData(key).call()
    // Decode fetched data
    const tokenName = await decodeTokenName(encodedData, assetAddress)

    return tokenName
  } catch (e) {
    console.log('Data of assets address could not be loaded', e)
  }
}

const isERC725YLegacy = async (address: string, web3: Web3) => {
  try {
    // Create Instance of the contract which is to be queried
    const abi: AbiItem = [
      {
        type: 'function',
        stateMutability: 'view',
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool'
          }
        ],
        name: 'supportsInterface',
        inputs: [
          {
            type: 'bytes4',
            name: 'interfaceId',
            internalType: 'bytes4'
          }
        ]
      }
    ]
    const assetContract = new web3.eth.Contract(abi, address)
    const erc725YLegacy = '0x2bd57b73'
    const isERC725YLegacy = await assetContract.methods.supportsInterface(erc725YLegacy).call()
    return isERC725YLegacy
  } catch (e) {
    console.log(e)
  }
}

const decodeMetaData = async (encodedLSP4Data: any, assetAddress: string) => {
  try {
    const erc725 = getInstance(assetAddress, LSP4schema as ERC725JSONSchema[])
    const decodedLSP4Data = await erc725.decodeData({
      LSP4Metadata: encodedLSP4Data
    })
    const fullIpfsUrl =
      'https://ipfs.lukso.network/ipfs/' + decodedLSP4Data.LSP4Metadata.url.substring(7)

    return fullIpfsUrl
  } catch (e) {
    console.log('Data of an asset could not be decoded', e)
  }
}

const decodeTokenName = async (encodedLSP4Data: any, assetAddress: string) => {
  try {
    const erc725 = getInstance(assetAddress, LSP4schema as ERC725JSONSchema[])
    const decodedLSP4Data = await erc725.decodeData({
      LSP4TokenName: encodedLSP4Data
    })

    return decodedLSP4Data.LSP4TokenName
  } catch (e) {
    console.log('Data of an asset could not be decoded', e)
  }
}
