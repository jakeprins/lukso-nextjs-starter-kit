import { CHAIN_ID, RPC_URL } from 'constants/web3'
import { LSPFactory, ProfileDataBeforeUpload } from '@lukso/lsp-factory.js'

export const deployUniversalProfile = async (
  account: { address: string; privateKey: string },
  profile: ProfileDataBeforeUpload | any
) => {
  const lspFactory = new LSPFactory(RPC_URL, {
    deployKey: account.privateKey,
    chainId: CHAIN_ID
  })

  const deployedContracts = await lspFactory.LSP3UniversalProfile.deploy({
    controllingAccounts: [account.address],
    lsp3Profile: profile as ProfileDataBeforeUpload
  })

  return deployedContracts.ERC725Account.address
}
