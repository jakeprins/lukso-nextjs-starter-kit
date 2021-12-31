import { ADDRESSES, PERMISSIONS, PERMISSIONS_ARRAY } from 'constants/lukso'

import Web3 from 'web3'
import { createContractsInstance } from './profile'

export const transferLXY = async (
  profileAddress: string,
  accountAddress: string,
  recipientAddress: string,
  amount: string,
  web3: Web3
) => {
  // instantiate contracts
  const { profileContract, keyManagerContract } = await createContractsInstance(
    profileAddress,
    web3
  )

  const OPERATION_CALL = 0
  const amountInWei = web3.utils.toWei(amount)
  // payload executed at the target (here nothing, just a plain LYX transfer)
  const data = '0x'

  // encode the payload to transfer LYX from the UP
  const transferLYXPayload = await profileContract.methods
    .execute(OPERATION_CALL, recipientAddress, amountInWei, data)
    .encodeABI()

  // execute the LYX transfer via the Key Manager
  const transaction = await keyManagerContract.methods
    .execute(transferLYXPayload)
    .send({ from: accountAddress, gasLimit: 3_000_000 })

  return transaction
}

export const addToPermissionsArray = async (
  profileAddress: string,
  accountAddress: string,
  newAddress: string,
  web3: Web3
) => {
  const { profileContract, keyManagerContract } = await createContractsInstance(
    profileAddress,
    web3
  )

  const newPermissions = PERMISSIONS.SET_DATA

  const payload = await profileContract.methods
    .setData(
      [
        ADDRESSES.PERMISSIONS + newAddress.substr(2), // allow provided address to setData on your UP
        PERMISSIONS_ARRAY, // length of AddressPermissions[]
        PERMISSIONS_ARRAY.slice(0, 34) + '00000000000000000000000000000001' // add new address into the list of permissions
      ],
      [
        newPermissions,
        3, // 3 because UP owner + Universal Receiver Delegate permission have already been set by lsp-factory
        newAddress
      ]
    )
    .encodeABI()

  const transaction = keyManagerContract.methods
    .execute(payload)
    .send({ from: accountAddress, gasLimit: 3_000_000 })

  return transaction
}
