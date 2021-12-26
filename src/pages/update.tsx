import { Button, TextArea, TextInput, useToast } from '@apideck/components'
import { fetchUniversalProfile, hasPermissionToUpdate, updateUniversalProfile } from 'utils/lukso'
import { shortenAddress, useWeb3 } from 'utils/web3'

import Layout from '../components/Layout'
import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import { UniversalProfile } from '@lukso/lsp-factory.js'
import { useState } from 'react'

const UpdateProfilePage: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [profile, setProfile] = useState<UniversalProfile>()
  const { addToast } = useToast()
  const { web3Info, account, balance } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const profile = await fetchUniversalProfile(contractAddress)
      const hasPermissions = await hasPermissionToUpdate(contractAddress, account.address, web3Info)

      if (hasPermissions) {
        const data = profile.LSP3Profile
        setProfile({ ...data, address: contractAddress })
        setName(data.name)
        setDescription(data.description)
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

  const updateProfile = async () => {
    if (balance === 0) {
      addToast({
        title: 'You need some LXY to deploy a UP',
        description:
          'Make sure the controlling account has some LXYt to cover the transaction costs'
      })
      return
    }
    setIsUpdating(true)
    try {
      const updatedProfile = { ...profile, name, description }
      const result = await updateUniversalProfile(updatedProfile, account.address, web3Info)
      console.log(`https://blockscout.com/lukso/l14/tx/${result?.transactionHash}`)
      setProfile(updatedProfile)
      addToast({
        title: 'Looking good!',
        description: 'You Universal Profile has been updated on the Lukso blockchain.',
        type: 'success',
        autoClose: true
      })
      setIsUpdating(false)
    } catch (error: any) {
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">Fetch and Update</h3>
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
              Fetch profile
            </Button>
          </div>
          {profile && (
            <div>
              <div className="relative max-w-sm mx-auto my-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <a
                    href={`https://universalprofiles.cloud/${profile?.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 text-sm text-gray-500 bg-white hover:text-gray-400"
                  >
                    {shortenAddress(profile.address)}
                  </a>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                  Name
                </label>
                <TextInput
                  name="name"
                  className="mt-1"
                  onChange={(e) => setName(e.currentTarget.value)}
                  value={name}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Description
                </label>
                <TextArea
                  className="mt-1"
                  name="description"
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  value={description}
                />
              </div>
              <div className="mt-5">
                <Button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 sm:col-start-2 sm:text-sm"
                  onClick={updateProfile}
                  isLoading={isUpdating}
                >
                  Update profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UpdateProfilePage
