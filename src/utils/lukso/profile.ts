import KeyManager from '@lukso/universalprofile-smart-contracts/artifacts/LSP6KeyManager.json'
import { LSP3UniversalProfile } from '@lukso/lsp-factory.js'
import UP from '@lukso/universalprofile-smart-contracts/artifacts/UniversalProfile.json'
import { getInstance } from './erc725'

export const fetchUniversalProfile = async (contractAddress: string): Promise<any> => {
  const erc725 = getInstance(contractAddress)
  const profile = await erc725.fetchData('LSP3Profile')

  return profile.LSP3Profile
}

const uploadMetadataToIPFS = async (metadata: any) => {
  const uploadResult = await LSP3UniversalProfile.uploadProfileData(metadata)
  return uploadResult.url
}

const createContractsInstance = async (web3: any, profileAddress: string) => {
  const profileContract = new web3.eth.Contract(UP.abi, profileAddress)

  const keyManagerAddress = await profileContract.methods.owner().call()
  const keyManagerContract = new web3.eth.Contract(KeyManager.abi, keyManagerAddress)

  return { profileContract, keyManagerContract }
}

export const updateUniversalProfile = async (
  web3: any,
  profile: any,
  account: { address: string; privateKey: string }
) => {
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
    web3,
    profile.address
  )
  const abiPayload = await profileContract.methods
    .setData([encodedData.LSP3Profile.key], [encodedData.LSP3Profile.value])
    .encodeABI()

  const result = await keyManagerContract.methods
    .execute(abiPayload)
    .send({ from: account.address, gasLimit: 3_000_000 })

  return result
}
