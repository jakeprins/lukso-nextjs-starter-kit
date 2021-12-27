import { IPFS_URL } from 'constants/lukso'
import { LSP3ProfileImage } from '@lukso/lsp-factory.js'

export const getImageUrl = (images: LSP3ProfileImage[], size?: string) => {
  if (!images?.length) return
  if (size === 'large') {
    return `${IPFS_URL}/${images[0].url.substring(7)}`
  }
  switch (size) {
    case 'xl':
      return `${IPFS_URL}/${images[0].url.substring(7)}`
    case 'large':
      return `${IPFS_URL}/${images[1].url.substring(7)}`
    case 'medium':
      return `${IPFS_URL}/${images[2].url.substring(7)}`
    case 'small':
      return `${IPFS_URL}/${images[3].url.substring(7)}`
    case 'tiny':
      return `${IPFS_URL}/${images[4].url.substring(7)}`
    default:
      return `${IPFS_URL}/${images[0].url.substring(7)}`
  }
}
