import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import { Button, TextInput, useToast } from '@apideck/components'

import { fetchUniversalProfile } from 'utils/lukso'
import { useState } from 'react'
import ProfileCard from 'components/ProfileCard'
import { shortenAddress } from 'utils/web3'
import { UniversalProfile } from '@lukso/lsp-factory.js'

const FetchProfilePage: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [profile, setProfile] = useState<UniversalProfile>()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const fetchAndContinue = async () => {
    setIsLoading(true)
    try {
      const profile = await fetchUniversalProfile(contractAddress)
      setProfile({ ...profile.LSP3Profile, address: contractAddress })
      addToast({
        title: 'Universal Profile Found',
        description: 'Look at that beauty!',
        type: 'success',
        autoClose: true
      })
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
  return (
    <Layout title="Fetch Profile | Lukso Starter Kit">
      <Navbar />

      <div className="min-h-screen p-4 my-12">
        <div className="max-w-sm p-6 mx-auto bg-white rounded-md shadow-xl">
          <div className="mt-3 text-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Fetch a Universal Profile
            </h3>
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
              onClick={fetchAndContinue}
              isLoading={isLoading}
            >
              Fetch profile
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
