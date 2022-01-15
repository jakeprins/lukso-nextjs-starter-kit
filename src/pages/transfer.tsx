import Button from 'components/Button'
import TextInput from 'components/TextInput'
import Layout from 'components/Layout'
import Navbar from 'components/Navbar'
import { useToast } from 'utils/useToast'
import { hasPermission, transferLXY } from 'utils/lukso'
import { fetchERC725Data } from 'utils/lukso/profile'
import { getAccountBalance, shortenAddress, useWeb3 } from 'utils/web3'

import { NextPage } from 'next'
import { useState } from 'react'

const TransferPage: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [profile, setProfile] = useState<any>()
  const { addToast } = useToast()
  const { web3Info, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [amount, setAmount] = useState<string>()
  const [balance, setBalance] = useState<number>()
  const [recipient, setRecipient] = useState<string>()

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const hasPermissions = await hasPermission(contractAddress, account.address, web3Info)
      const response = await fetchERC725Data(contractAddress)
      setProfile({ ...response.LSP3Profile.LSP3Profile, address: contractAddress })
      const profileBalance = await getAccountBalance(web3Info, contractAddress)
      setBalance(profileBalance)

      if (!hasPermissions) {
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

  const transfer = async () => {
    if (balance === 0) {
      addToast({
        title: 'You need some LXY to cover the transaction costs',
        description: 'Make sure the controlling account has some LXYt to cover gas fees'
      })
      return
    }
    setIsSending(true)
    try {
      const transaction = await transferLXY(
        profile?.address,
        account?.address,
        recipient as string,
        amount as string,
        web3Info
      )
      console.log(transaction)
      setIsSending(false)
    } catch (error: any) {
      console.error(error)
      setIsSending(false)
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
                  Recipient
                </label>
                <TextInput
                  name="name"
                  className="mt-1"
                  placeholder="UP Address"
                  onChange={(e) => setRecipient(e.currentTarget.value)}
                  value={recipient}
                />
              </div>
              <div className="mt-4">
                <div className="block text-sm font-medium leading-5 text-gray-700">
                  Balance: {balance} LXY
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                  Amount
                </label>
                <TextInput
                  name="name"
                  className="mt-1"
                  onChange={(e) => setAmount(e.currentTarget.value)}
                  value={amount}
                  placeholder="0.1"
                />
              </div>
              <div className="mt-5">
                <Button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 sm:col-start-2 sm:text-sm"
                  onClick={transfer}
                  isLoading={isSending}
                >
                  Transfer
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
