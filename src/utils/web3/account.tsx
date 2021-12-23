import { CHAIN_ID } from 'constants/lukso'
import Web3 from 'web3'

export const getAccountBalance = async (web3: Web3, accountAddress: string) => {
  return parseFloat(web3.utils.fromWei(await web3.eth.getBalance(accountAddress)))
}

export const getAccount = async (web3: Web3) => {
  const password = process.env.NEXT_PUBLIC_WALLET_PASSWORD || ''
  web3.eth.accounts.wallet.load(password)

  // Load account from local storage
  if (web3.eth.accounts.wallet.length) {
    console.log('Loaded existing account.')
  } else if (process.env.NODE_ENV === 'development') {
    // During development reuse the same account so we know we have some LYXt
    const address = process.env.NEXT_PUBLIC_WALLET_ADDRESS || ''
    const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY || ''
    web3.eth.accounts.wallet.add({ address, privateKey })
    web3.eth.accounts.wallet.save(password)
    console.log('Loaded account from existing wallet credentials')
  } else {
    // Create new account
    // web3.eth.accounts.wallet.create(1)
    // web3.eth.accounts.wallet.save(password)
    // console.log('New account created.')
  }

  const wallet = web3.eth.accounts.wallet[0]
  const address = wallet?.address
  const privateKey = wallet?.privateKey
  const balance = web3.utils.fromWei(await web3.eth?.getBalance(address), 'ether')

  console.log('Balance ', balance, 'LYXt')
  console.log('Address', address)

  return { address, privateKey }
}

export const shortenAddress = (address: string, charsLength = 4) => {
  const prefixLength = 2 // "0x"
  if (!address) return ''
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return address.slice(0, charsLength + prefixLength) + '…' + address.slice(-charsLength)
}

export const getNetworkName = (chainId = `${CHAIN_ID}`) => {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'
  if (chainId === '1337') return 'Localhost'
  if (chainId === '22') return 'Lukso'

  return 'Lukso'
}
