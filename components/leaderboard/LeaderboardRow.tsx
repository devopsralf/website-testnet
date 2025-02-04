import React from 'react'

import FishAvatar from './FishAvatar'
import { graffitiToColor, numberToOrdinal } from 'utils'

type Props = {
  rank: number
  graffiti: string
  points: number
}

function LeaderboardRow({ rank, graffiti, points = 0 }: Props) {
  const avatarColor = graffitiToColor(graffiti)
  const rankStr = numberToOrdinal(rank)
  const pointsStr = points.toLocaleString()

  return (
    <div
      className="relative bg-white rounded flex items-center px-10"
      style={{ boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.19)' }}
    >
      <div className="absolute inset-0 rounded border hover:border-2 border-black" />
      <div className="font-extended text-2xl w-24">{rankStr}</div>
      <div className="flex flex-1 items-center font-extended text-2xl">
        <div className="py-3 mr-5">
          <FishAvatar color={avatarColor} />
        </div>
        <div>{graffiti}</div>
      </div>
      <div className="font-extended text-2xl">{pointsStr}</div>
    </div>
  )
}

export default LeaderboardRow
