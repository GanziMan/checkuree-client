import { useParams } from 'react-router-dom'
import { Fragment } from 'react'
import NextProgressModal from './NextProgressModal'
import { useProgressLog, useProgressPromote } from '../queries'
import useModalStore from '@/store/dialogStore'
import useProgressFormStore from '@/store/progressStore'
import { Progresses } from '@/api/type'
import Button from '@/components/Button'

export type LearningManageProps = {
  studentInfo: {
    name: string
    age: number
    grade: string
    scheduleDays: string
  }
  progresses: Progresses
}

export default function LearningManage(props: LearningManageProps) {
  const { progresses, studentInfo } = props
  const { bookId, attendeeId } = useParams()

  const { data: progressLog } = useProgressLog({
    bookId: Number(bookId),
    attendeeId: Number(attendeeId),
  })

  const openModal = useModalStore((state) => state.openModal)

  const { formData, setFormData } = useProgressFormStore()

  const { mutate: progressMutation } = useProgressPromote({
    bookId: Number(bookId),
    formData,
    attendeeId: Number(attendeeId),
  })

  const openNextProgressModal = (progressId: number) => {
    openModal(
      <NextProgressModal bookId={Number(bookId)} />,
      () => {
        progressMutation(progressId)
        setFormData({
          nextGradeId: '',
          completeAt: '',
          startAt: '',
        })
      },
      () => {
        setFormData({
          nextGradeId: '',
          completeAt: '',
          startAt: '',
        })
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 학생 정보 섹션 */}
      <div className="flex gap-8 items-center w-full h-[81px] rounded-2xl bg-white">
        <img
          src="/images/icons/book-roaster/ico-student.svg"
          alt="학생 아이콘"
          width={40}
          height={40}
          loading="lazy"
          className="rounded-full ml-[23px]"
        />
        <div className="flex flex-col gap-1 text-left">
          <p className="text-m-bold">
            <span className="text-text-primary">{studentInfo.name}</span>
            <span className="text-text-secondary text-m-semibold ml-2">
              {studentInfo.age}
            </span>
          </p>
          <p className="text-s-medium">
            <span className="text-text-brand">{studentInfo.scheduleDays}</span>
            <span className="text-[#b0b0b0]"> {studentInfo.grade}</span>
          </p>
        </div>
      </div>

      <div className="w-full rounded-2xl bg-white p-4 flex flex-col gap-5">
        <p className="flex text-s-bold text-[#5d5d5d]">커리큘럼 정보</p>
        {progresses?.map((progress) => (
          <Fragment key={progress.id}>
            <div className="flex items-center justify-between text-s-semibold">
              <p className="text-text-tertiary">커리큘럼</p>
              <p className="text-text-primary">{progress.gradeTitle}</p>
              <Button
                className="max-w-[109px] w-full h-8 rounded-lg bg-[#f6f6f6] text-s-medium text-text-secondary"
                onClick={() => openNextProgressModal(Number(progress.id))}
                label="다음 과정으로"
              />
            </div>
            <div className="flex items-center justify-between text-s-semibold">
              <p className="text-text-tertiary">시작일</p>
              <p className="text-text-primary">{progress.startDate}</p>
            </div>
          </Fragment>
        ))}
      </div>

      {/* 성장 이력 섹션 */}
      <div className="w-full rounded-2xl bg-white p-4 flex flex-col gap-3">
        <p className="flex text-s-bold text-[#5d5d5d]">성장 이력</p>
        {/* 헤더 */}
        <div className="grid grid-cols-4 gap-4 text-s-semibold">
          <div className="text-[#B0B0B0] text-center">과정명</div>
          <div className="text-[#B0B0B0] text-center">소요 기간</div>
          <div className="text-[#B0B0B0] text-center">소요 레슨</div>
          <div className="text-[#B0B0B0] text-center">소요 일자</div>
        </div>
        {/* 데이터 */}
        <div className="flex flex-col gap-3">
          {progressLog?.map((progress) => (
            <div
              key={progress.progressLogId}
              className="grid grid-cols-4 gap-4 text-[11px] font-semibold"
            >
              <div className="text-center truncate">{progress.gradeTitle}</div>
              <div className="text-center">
                {progress.startedAt.substring(5).replaceAll('-', '.')}-
                {progress.endedAt.substring(5).replaceAll('-', '.')}
              </div>
              <div className="text-center">{progress.lessonCount}</div>
              <div className="text-center">
                {formatDuration(progress.startedAt, progress.endedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatDuration(startedAt: string, endedAt: string): string {
  const startDate = new Date(startedAt)
  const endDate = new Date(endedAt)

  // 하루 차이 계산 (UTC 기준 보정)
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1

  const weeks = Math.floor(diffDays / 7)
  const days = diffDays % 7

  let result = ''
  if (weeks > 0) {
    result += `${weeks}주`
  }
  if (days > 0) {
    result += ` ${days}일`
  }
  return result.trim()
}
