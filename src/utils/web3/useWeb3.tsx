import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { getAccount, getAccountBalance } from 'utils/web3'

import { RPC_URL } from 'constants/lukso'
import Web3 from 'web3'

interface ContextProps {
  web3Info: Web3
  account: { address: string; privateKey: string }
  contractAddress: string
  setContractAddress: Dispatch<SetStateAction<string | undefined>>
  balance: number
  getBalance: () => void
  isLoading: boolean
}

const Web3Context = createContext<Partial<ContextProps>>({})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [web3Info, setWeb3Info] = useState<Web3>()
  const [account, setAccount] = useState<{ address: string; privateKey: string }>()
  const [balance, setBalance] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getWeb3 = async () => {
      const web3 = new Web3(RPC_URL)
      return web3
    }

    getWeb3().then((web3) => {
      setWeb3Info(web3)
    })
  }, [])

  useEffect(() => {
    const getCurrentAccount = async (web3Info: Web3) => {
      const account = await getAccount(web3Info)
      if (account?.address) {
        setAccount(account)
        const accountBalance = await getAccountBalance(web3Info, account?.address)
        setBalance(accountBalance)
      }
    }

    if (web3Info && !account) {
      getCurrentAccount(web3Info)
    }
  }, [web3Info, account])

  const getBalance = useCallback(async () => {
    if (web3Info && account?.address) {
      setIsLoading(true)
      const accountBalance = await getAccountBalance(web3Info, account?.address)
      setBalance(accountBalance)
      setIsLoading(false)
    }
  }, [web3Info, account?.address])

  useEffect(() => {
    if (web3Info && account?.address) {
      getBalance()
    }
  }, [web3Info, account?.address, getBalance])

  const contextValue = useMemo(
    () => ({
      web3Info,
      account,
      balance,
      getBalance,
      isLoading
    }),
    [account, balance, getBalance, isLoading, web3Info]
  )

  return <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  return useContext(Web3Context) as ContextProps
}
