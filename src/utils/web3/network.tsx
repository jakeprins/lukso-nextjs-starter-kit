import { CHAIN_ID } from 'constants/lukso'

export const getNetworkName = (chainId = `${CHAIN_ID}`) => {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'
  if (chainId === '1337') return 'Localhost'
  if (chainId === '22') return 'Lukso'

  return 'Lukso'
}
