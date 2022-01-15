import Button from 'components/Button'
import TextInput from 'components/TextInput'
import TextArea from 'components/TextArea'
import { useToast } from 'utils/useToast'
import { deployUniversalProfile, fetchUniversalProfile } from 'utils/lukso'
import { shortenAddress, useWeb3 } from 'utils/web3'

import Layout from '../components/Layout'
import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import ProfileCard from 'components/ProfileCard'
import { UniversalProfile } from '@lukso/lsp-factory.js'
import { useState } from 'react'

const CreateProfilePage: NextPage = () => {
  const { account, balance } = useWeb3()
  const { addToast } = useToast()
  const [profile, setProfile] = useState<UniversalProfile>()
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [profileImage, setProfileImage] = useState<string>()

  const [isLoading, setIsLoading] = useState(false)

  const createProfile = async () => {
    if (balance === 0) {
      addToast({
        title: 'You need some LXY to deploy a UP',
        description:
          'Make sure the controlling account has some LXYt to cover the transaction costs'
      })
      return
    }

    const profile = { name, description, profileImage }
    setIsLoading(true)
    addToast({
      title: 'Deploying your profile',
      description: 'This could take up to 2 minutes. Please do not close your window.',
      closeAfter: 7000
    })

    try {
      const erc725ContractAddress = await deployUniversalProfile(account, profile)
      const universalProfile = await fetchUniversalProfile(erc725ContractAddress as string)
      setProfile({ ...universalProfile.LSP3Profile, address: erc725ContractAddress })
      addToast({
        title: 'Looking good!',
        description: 'You Universal Profile has been deployed on the Lukso blockchain.',
        type: 'success',
        autoClose: true
      })
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create a new Universal Profile
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Fill in the form and deploy a new Universal Profile to the blockchain.
              </p>
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
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Profile Image
            </label>
            <TextInput
              type="file"
              className="mt-1"
              name="profileImage"
              onChange={(event: any) => setProfileImage(event.target.files[0])}
            />
          </div>
          <div className="mt-5">
            <Button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 sm:col-start-2 sm:text-sm"
              onClick={createProfile}
              isLoading={isLoading}
            >
              Create new profile
            </Button>
          </div>
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
                  className="px-2 text-sm text-gray-500 bg-gray-50 hover:text-gray-400"
                >
                  {shortenAddress(profile.address)}
                </a>
              </div>
            </div>
            <ProfileCard profile={profile} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CreateProfilePage
