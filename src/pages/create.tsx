import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import { Button, useToast } from '@apideck/components'

import { deployUniversalProfile, fetchUniversalProfile } from 'utils/lukso'
import { useState } from 'react'
import ProfileCard from 'components/ProfileCard'
import { shortenAddress, useWeb3 } from 'utils/web3'
import { UniversalProfile } from '@lukso/lsp-factory.js'

const FetchProfilePage: NextPage = () => {
  const { account, balance } = useWeb3()
  const { addToast } = useToast()
  const [profile, setProfile] = useState<UniversalProfile>()

  const [isLoading, setIsLoading] = useState(false)

  const createProfile = async (values: any) => {
    // We need some balance to cover the fees for deploying the UP
    if (balance === 0) {
      console.log('Go get that LYX!')
      return
    }

    setIsLoading(true)
    addToast({
      title: 'Deploying your profile',
      description: 'This could take up to 2 minutes. Please do not close your window.',
      closeAfter: 7000
    })

    try {
      const erc725ContractAddress = await deployUniversalProfile(account, values)
      const universalProfile = await fetchUniversalProfile(erc725ContractAddress as string)
      setProfile({ ...universalProfile.LSP3Profile, address: erc725ContractAddress })
      addToast({
        title: 'Looking good!',
        description: 'You Universal Profile has been updated on the Lukso blockchain.',
        type: 'success',
        autoClose: true
      })
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

          <div className="my-3">TODO</div>
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

export default FetchProfilePage
