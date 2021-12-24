import { getBackgroundImage, getProfileImage } from 'utils/lukso'

import classNames from 'classnames'
import { getIcon } from './ProfileLinks'

const ProfileCard = ({ profile }: any) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={classNames(`max-w-sm w-full mx-3 sm:mx-auto  bg-white rounded-md shadow-xl`, {
          'overflow-hidden': profile.backgroundImage,
          'mt-8': !profile.backgroundImage
        })}
        style={{ minWidth: 320 }}
        id="container"
      >
        {profile.backgroundImage ? (
          <img
            className="object-cover w-full h-32 lg:h-48"
            src={getBackgroundImage(profile)}
            alt={profile.name}
          />
        ) : null}
        <div
          className={classNames(`w-full sm:flex sm:items-center`, {
            '-mt-16': profile.backgroundImage,
            '-mt-8': !profile.backgroundImage
          })}
        >
          <img
            className="w-24 h-24 mx-auto rounded-full lg:w-28 lg:h-28 ring-4 ring-white"
            src={getProfileImage(profile)}
            alt={profile.name}
          />
        </div>
        <div className="p-4 mx-auto sm:p-6">
          <div className="flex-1 min-w-0 text-center">
            <h1 className="mb-2 text-2xl font-medium text-gray-900">{profile.name}</h1>
            <p className="mb-5 text-base font-light text-gray-600">{profile.description}</p>
            <div className="flex justify-center mt-3 space-x-3">
              {profile.links?.map((link: any) => {
                return (
                  <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full p-3 text-base font-medium text-gray-400 border border-gray-200 rounded-md shadow-lg"
                    >
                      {getIcon(link.url)}
                    </button>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        #container {
          box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 2px, rgba(0, 0, 0, 0.06) 0px 2px 4px,
            rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.06) 0px 8px 16px,
            rgba(0, 0, 0, 0.06) 0px 16px 32px, rgba(0, 0, 0, 0.06) 0px 32px 64px;
        }
      `}</style>
    </div>
  )
}

export default ProfileCard
