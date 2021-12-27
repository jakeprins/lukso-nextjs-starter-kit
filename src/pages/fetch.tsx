import { Button, TextInput, useToast } from '@apideck/components'
import { shortenAddress, useWeb3 } from 'utils/web3'

import Layout from '../components/Layout'
import Navbar from 'components/Navbar'
import { NextPage } from 'next'
import ProfileCard from 'components/ProfileCard'
import { UniversalProfile } from '@lukso/lsp-factory.js'
import { fetchERC725Data } from 'utils/lukso/profile'
import { getAssetsFromProfile } from 'utils/lukso/assets'
import { getImageUrl } from 'utils/lukso'
import { useState } from 'react'

const FetchProfilePage: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [profile, setProfile] = useState<UniversalProfile>()
  const [assets, setAssets] = useState<any>()
  const [receiver, setReceiver] = useState<string>()
  const { addToast } = useToast()
  const { web3Info } = useWeb3()

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetchERC725Data(contractAddress)
      setProfile({ ...response.LSP3Profile.LSP3Profile, address: contractAddress })
      setReceiver(response.LSP1UniversalReceiverDelegate)
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

  const fetchAssets = async () => {
    if (!receiver) return
    setIsLoadingAssets(true)
    try {
      const response = await getAssetsFromProfile(receiver, web3Info)
      setAssets(response)
      addToast({
        title: 'Succeeded to fetch assets',
        description: `${response.length} assets found`,
        type: 'success',
        autoClose: true
      })
    } catch (error) {
      addToast({
        title: 'Could not fetch assets',
        description: 'Are you sure you provided a correct ERC725Y contract address?',
        type: 'error',
        autoClose: true
      })
    } finally {
      setIsLoadingAssets(false)
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
              onClick={fetchProfile}
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
            <div className="max-w-sm mx-auto mt-5">
              <Button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 sm:col-start-2 sm:text-sm"
                onClick={fetchAssets}
                isLoading={isLoadingAssets}
              >
                Fetch assets of profile
              </Button>
            </div>
          </div>
        )}
        <div className="grid max-w-lg gap-6 mx-auto mt-12 mb-12 md:grid-cols-2 md:max-w-3xl lg:gap-8 2xl:grid-cols-4 2xl:gap-4 2xl:max-w-7xl">
          {assets?.map((asset: any, i: number) => {
            return (
              <div className="rounded-lg card" key={i}>
                <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                  <div className="flex-shrink-0 h-48 overflow-hidden">
                    <img
                      src={getImageUrl(asset.images[0], 'medium')}
                      alt={asset.description}
                      className="object-cover w-full"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-6 bg-white 2xl:p-5">
                    <div className="flex-1">
                      <div className="mt-1.5">
                        <p className="text-lg font-medium text-gray-800 truncate">
                          {asset.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default FetchProfilePage
