import {
  counsellingTopicTypeToKor,
  counsellingTypeToKor,
  relationTypeToKor,
} from '@/utils/enumMapper'

import { useNavigate, useParams } from 'react-router-dom'
import { RelationType } from '@/api/type'
import { CounsellingTopicType, CounsellingType } from '@/api/CounselSchema'
import dayjs from 'dayjs'

interface CounselListProps {
  counselType: CounsellingType
  counselSubjects: CounsellingTopicType[]
  counselleeType: RelationType
  counsellingAt: Date
  counsellingId: number
  counsellorName?: string
  counsellorId?: number
  counseleeId: number // 상담자 번호
}
const CounselList = (args: CounselListProps) => {
  const navigate = useNavigate()

  const { bookId, attendeeId } = useParams()

  const { counselType, counselleeType, counsellingAt, counselSubjects } = args
  const slicedSubjects = []
  for (let i = 0; i < counselSubjects.length; i += 2) {
    slicedSubjects.push(counselSubjects.slice(i, i + 2))
  }

  return (
    <div className="w-full rounded-2xl text-left bg-white p-4 flex flex-col gap-5">
      <p className="flex text-s-bold text-[#5d5d5d]">
        상담 내역{' '}
        <img
          src="/images/icons/ico-pencil.svg"
          width={20}
          height={20}
          alt="상담내역 수정 아이콘"
          loading="lazy"
          onClick={() => {
            navigate(
              `/book/${bookId}/attendee/${attendeeId}/counselling${location.search}`,
              { state: args },
            )
          }}
        />
      </p>
      <div className="flex flex-col gap-2">
        <p className="text-m-semibold text-text-primary">
          {dayjs(counsellingAt).format('YYYY.MM.DD')}
        </p>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm">
            <p className="text-text-tertiary w-24">유형</p>
            <p className="text-text-primary text-s-semibold">
              {counsellingTypeToKor(counselType)}
            </p>
          </div>
          <div className="flex flex-row text-sm">
            <p className="text-text-tertiary w-24 items-baseline">주제</p>
            <div className="flex flex-col">
              {counselSubjects
                .reduce<CounsellingTopicType[][]>((acc, cur) => {
                  if (
                    !acc.length ||
                    acc[acc.length - 1].join(', ').length >= 17
                  )
                    acc.push([]) // 길이가 17이 넘어가는 경우 줄 띄우기
                  acc[acc.length - 1].push(cur)
                  return acc
                }, [])
                .map((subjects) => {
                  return (
                    <p
                      className="break-keep text-left text-s-semibold"
                      key={subjects.join(', ')}
                    >
                      {subjects
                        .map((subject) => counsellingTopicTypeToKor(subject))
                        .join(', ')}
                    </p>
                  )
                })}
            </div>
          </div>
          <div className="flex items-center text-sm">
            <p className="text-text-tertiary w-24">상담자</p>
            <p className="text-text-primary text-s-semibold">
              {relationTypeToKor(counselleeType)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CounselList
