import { IPFS_URL } from 'constants/lukso'
import { LSP3ProfileImage } from '@lukso/lsp-factory.js'

export const getImageUrl = (images: LSP3ProfileImage[], size = 'large') => {
  if (!images?.length) return
  if (size === 'large') {
    return `${IPFS_URL}/${images[0].url.substring(7)}`
  }
}
