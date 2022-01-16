import { Menu, Transition } from '@headlessui/react'

import Blockies from 'react-blockies'
import Button from 'components/Button'
import { FiCopy } from 'react-icons/fi'
import { Fragment } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { shortenAddress } from 'utils/web3'
import { useClipboard } from 'use-clipboard-copy'
import { useWeb3 } from 'utils/web3'

export default function AccountDropdown() {
  const { web3Info, account, contractAddress, balance } = useWeb3()
  const clipboard = useClipboard({ copiedTimeout: 1200 })

  return (
    <Menu as="div" className={`relative flex-shrink-0 inline-block ml-4 text-left`}>
      <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary-500">
        {account ? (
          <div className="flex items-center">
            {/* TODO: Blockie */}
            <img src="https://lukso.network/images/sm/lukso-icon-32.png" className="w-5 h-5 mr-2" />
            <span className="flex">{shortenAddress(account?.address)}</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
        <HiChevronDown className="w-5 h-5 mx-1" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-40 mt-2 text-gray-800 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {web3Info && (
            <div className="px-5 py-3 ">
              <div className="flex items-center">
                <Blockies
                  seed={account?.address}
                  size={9}
                  color="#357dc0"
                  bgColor="#afe0f5"
                  spotColor="#254a87"
                  className="w-8 h-8 mr-2 rounded-md"
                />
                <div className="flex flex-col">
                  <p className="mr-2 text-sm text-gray-500">Signed in with EOA:</p>

                  <span
                    className="text-sm font-medium truncate cursor-pointer hover:text-gray-900"
                    onClick={() => clipboard.copy(account?.address)}
                  >
                    {shortenAddress(account?.address)}
                    {clipboard.copied ? (
                      <span className="ml-1 text-sm">Copied!</span>
                    ) : (
                      <FiCopy
                        className="inline-block ml-1 text-sm cursor-pointer"
                        onClick={() => clipboard.copy(account?.address)}
                      />
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="px-5 py-4">
            <Menu.Item>
              {web3Info ? (
                <div>
                  <p className="flex items-center justify-between">
                    <span>Network: </span>
                    <span className="">Lukso Testnet</span>
                  </p>

                  <p className="flex items-center justify-between">
                    <span>Balance: </span>
                    <span className="">
                      <span className="font-medium text-gray-900">{balance}</span>{' '}
                      <span className="text-gray-700">LXYt</span>
                    </span>
                  </p>

                  {contractAddress ? (
                    <p className="flex items-center justify-between">
                      <span>UP address: </span>
                      <span>
                        {shortenAddress(contractAddress)}
                        {clipboard.copied ? (
                          <span className="ml-1 text-sm">Copied!</span>
                        ) : (
                          <FiCopy
                            className="inline-block ml-1 text-sm cursor-pointer"
                            onClick={() => clipboard.copy(contractAddress)}
                          />
                        )}
                      </span>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </Menu.Item>
          </div>
          {account?.address ? (
            <div className="p-4">
              <a
                href={`https://blockscout.com/lukso/l14/address/${account?.address}/transactions`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  View on Blockscout
                </Button>
              </a>
            </div>
          ) : null}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
