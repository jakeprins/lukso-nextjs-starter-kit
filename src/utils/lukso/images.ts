import { IPFS_URL } from 'constants/web3'
import { LSP3ProfileImage } from '@lukso/lsp-factory.js'
import { UniversalProfile } from 'types/UniversalProfile'

export const getImageUrl = (images: LSP3ProfileImage[], size = 'large') => {
  if (!images?.length) return
  if (size === 'large') {
    return `${IPFS_URL}/${images[0].url.substring(7)}`
  }
}

export const getProfileImage = (profile: UniversalProfile) => {
  return profile.profileImagePreview || getImageUrl(profile.profileImage as any)
}

export const getBackgroundImage = (profile: UniversalProfile) => {
  return profile.backgroundImagePreview || getImageUrl(profile.backgroundImage as any)
}
