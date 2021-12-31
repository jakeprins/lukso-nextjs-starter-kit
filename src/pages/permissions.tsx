import { Button, TextArea, TextInput, useToast } from '@apideck/components'
import { fetchERC725Data, getAddressesWithPermissions } from 'utils/lukso/profile'
import {
  fetchUniversalProfile,
  hasPermission,
  transferLXY,
  updateUniversalProfile
} from 'utils/lukso'
import { getAccountBalance, shortenAddress, useWeb3 } from 'utils/web3'

import Layout from '../components/Layout'
import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import { UniversalProfile } from '@lukso/lsp-factory.js'
import { addToPermissionsArray } from 'utils/lukso/keyManager'
import { useState } from 'react'

const TransferPage: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [profile, setProfile] = useState<UniversalProfile>()
  const { addToast } = useToast()
  const { web3Info, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newAddress, setNewAddress] = useState<string>()
  const [URDAddress, setURDAddress] = useState<string>()
  const [permissions, setPermissions] = useState<string[]>()

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const addressesWithPermissions = await getAddressesWithPermissions(contractAddress, web3Info)
      setPermissions(addressesWithPermissions)

      const hasPermission = addressesWithPermissions.includes(account.address.toLowerCase())

      if (hasPermission) {
        const response = await fetchERC725Data(contractAddress)
        setURDAddress(response.LSP1UniversalReceiverDelegate)
        setProfile({ ...response.LSP3Profile.LSP3Profile, address: contractAddress })
      } else {
        addToast({
          title: 'No permissions to control this profile',
          description: 'The current account does not have permissions to control this profile',
          type: 'warning',
          autoClose: true
        })
      }
    } catch (error) {
      addToast({
        title: 'Could not fetch the profile',
        description: 'Are you sure you provided a correct ERC725Y contract address?',
        type: 'error',
        autoClose: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updatePermissions = async () => {
    setIsUpdating(true)
    try {
      const transaction = await addToPermissionsArray(
        profile?.address,
        account.address,
        newAddress,
        web3Info
      )
      console.log(transaction)

      // update permissions UI
      const addressesWithPermissions = await getAddressesWithPermissions(profile?.address, web3Info)
      setPermissions(addressesWithPermissions)
      setIsUpdating(false)
    } catch (error: any) {
      console.error(error)
      setIsUpdating(false)
      addToast({
        title: 'Something went wrong',
        description:
          error?.message || 'Something went wrong while deploying your profile to the blockchain',
        type: 'error',
        closeAfter: 6000
      })
    }
  }

  return (
    <Layout title="Fetch Profile | Lukso Starter Kit">
      <Navbar />
      <div className="min-h-screen p-4 my-12">
        <div className="max-w-sm p-6 mx-auto bg-white rounded-md shadow-xl">
          <div className="mt-3 text-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Fetch permissions</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Enter a contract address of a Universal Profile
              </p>
            </div>
          </div>
          <div className="my-3">
            <TextInput
              name="contract_address"
              placeholder="0x..."
              onChange={(e) => setContractAddress(e.currentTarget.value)}
            />
          </div>
          <div className="mt-5">
            <Button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 sm:col-start-2 sm:text-sm"
              onClick={fetchProfile}
              isLoading={isLoading}
              variant="outline"
            >
              Fetch permissions
            </Button>
          </div>
          {profile && (
            <div>
              <div className="mt-4">
                <div className="block text-sm font-medium leading-5 text-gray-700">
                  Addresses with permissions
                </div>

                {permissions?.map((address, i) => (
                  <div className="" key={i}>
                    - {shortenAddress(address)}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                  New address
                </label>
                <TextInput
                  name="name"
                  className="mt-1"
                  onChange={(e) => setNewAddress(e.currentTarget.value)}
                  value={newAddress}
                  placeholder="Address to give permissions to set data"
                />
              </div>
              <div className="mt-5">
                <Button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 sm:col-start-2 sm:text-sm"
                  onClick={updatePermissions}
                  isLoading={isUpdating}
                >
                  Update permissions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default TransferPage
