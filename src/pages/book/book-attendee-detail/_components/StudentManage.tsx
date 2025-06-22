import { formatSchedule } from '@/utils'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  DaysType,
  FutureScheduleType,
  GenderType,
  Progresses,
} from '@/api/type'
import tw from 'tailwind-styled-components'
import React from 'react'

const dayMap: Record<DaysType, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

function formatFutureSchedule(future: {
  appliedFrom: string
  schedules: FutureScheduleType[]
}) {
  if (!future) return ''

  const groups = future.schedules.reduce(
    (acc, { day, time }) => {
      const dow = dayMap[day]
      const [h, m] = time.split(':')
      let hour = Number(h)
      const period = hour >= 12 ? '오후' : '오전'
      hour = hour % 12 === 0 ? 12 : hour % 12
      const minute = m.padStart(2, '0')
      const timeStr = `${period} ${hour}:${minute}`
      if (!acc[dow]) acc[dow] = []
      acc[dow].push(timeStr)
      return acc
    },
    {} as Record<string, string[]>,
  )

  const dayOrder = ['월', '화', '수', '목', '금', '토', '일']
  const entries = dayOrder
    .filter((dow) => groups[dow]?.length)
    .flatMap((dow) => groups[dow].map((time) => `(${dow}) ${time}`))

  const lines = entries.reduce<string[]>((acc, cur, idx) => {
    if (idx % 2 === 0) {
      acc.push(cur)
    } else {
      acc[acc.length - 1] += `, ${cur}`
    }
    return acc
  }, [])

  const [year, month, day] = future.appliedFrom.split('-')
  const scheduleStr = lines.join('\n')
  return `${year}년 ${month}월 ${day}일부터\n${scheduleStr}`
}

type ScheduleItem = {
  id: number
  day: DaysType
  time: string
}[]

type studentInfo = {
  name: string
  age: number
  phoneNumber: string
  enrollDate: string
}

type StudentManageProps = {
  student: studentInfo
  lessonInfo: Progresses
  registerInfo: {
    address_1: string
    birthDate: string
    gender: GenderType
    phoneNumber: string
    description: string
    school: string
  }
  scheduleItems: ScheduleItem
  associates?: {
    relation?: string
    phoneNumber?: string
  }
  futureSchedules: {
    appliedFrom: string
    schedules: FutureScheduleType[]
  }
}

export default function StudentManage(props: StudentManageProps) {
  const {
    student,
    registerInfo,
    scheduleItems,
    associates,
    lessonInfo,
    futureSchedules,
  } = props

  const location = useLocation()
  const navigate = useNavigate()
  const response = scheduleItems?.length > 0 && formatSchedule(scheduleItems)
  const { bookId, attendeeId } = useParams()

  const formattedFuture = React.useMemo(
    () => formatFutureSchedule(futureSchedules),
    [futureSchedules?.appliedFrom, futureSchedules?.schedules],
  )
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8 items-center w-full rounded-2xl bg-white">
        <img
          src="/images/icons/book-roaster/ico-student.svg"
          alt="학생 아이콘"
          loading="lazy"
          width={80}
          height={80}
          className="rounded-full ml-[23px]"
        />
        <div className="flex flex-col gap-2 text-left">
          <div className="flex flex-col gap-1 mt-4">
            <p className="text-xl-bold">
              <span className="text-text-primary">{student.name || ''}</span>
              <span className="text-text-secondary ml-2">
                {(student.age || '') + '세'}
              </span>
            </p>
            <p className="text-m-bold text-text-secondary">
              {student.phoneNumber}
            </p>
          </div>
          <p className="text-s-medium text-text-tertiary">
            <span>입학일자</span>{' '}
            <span>{student.enrollDate?.replaceAll('-', '.')}</span>
          </p>
          <p className="text-s-medium text-text-primary mb-4">
            {lessonInfo?.map((course) => {
              return (
                <p key={course.id}>
                  {course.courseTitle} &gt; {course.gradeTitle}
                </p>
              )
            })}
          </p>
        </div>
      </div>
      <>
        <div className="w-full rounded-2xl bg-white p-4 flex flex-col gap-5">
          <p className="flex text-s-bold text-[#5d5d5d]">
            <span>수업 정보</span>{' '}
            <img
              src="/images/icons/ico-pencil.svg"
              width={20}
              height={20}
              alt="수정 아이콘"
              onClick={() => {
                navigate(
                  `/book/${bookId}/attendee/${attendeeId}/schedule${location.search}`,
                )
              }}
            />
          </p>
          <div className="flex justify-between">
            <p className="text-text-tertiary text-s-semibold">클래스</p>
            <div className="flex flex-col text-text-primary text-s-semibold text-left w-[200px]">
              {response
                ? response
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .reduce<string[][]>((acc, cur, index) => {
                      if (index % 2 === 0) acc.push([]) // 2개 단위로 배열 생성
                      acc[acc.length - 1].push(cur)
                      return acc
                    }, [])
                    .map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <p key={rowIndex} className="break-keep text-left">
                          {row.map((day, index) => (
                            <span key={index}>{day} &nbsp;</span>
                          ))}
                        </p>
                      </React.Fragment>
                    ))
                : ''}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-text-tertiary text-s-semibold">예정된 일정</p>
            <div className="flex flex-col text-text-secondary text-s-semibold whitespace-pre-line text-left w-[200px]">
              {formattedFuture}
            </div>
          </div>
        </div>
        <div className="w-full rounded-2xl bg-white p-4 flex flex-col gap-5">
          <p className="flex text-s-bold text-[#5d5d5d]">
            <span>등록 정보</span> {/*<img*/}
            {/*현재 수정 불가능하기 때문에 임시 주석처리*/}
            {/*  src="/images/icons/ico-pencil.svg"*/}
            {/*  width={20}*/}
            {/*  height={20}*/}
            {/*  alt=""*/}
            {/*  onClick={() => {*/}
            {/*    setIsAttendeeModify(true);*/}
            {/*    setIsCourseModify(false);*/}
            {/*  }}*/}
            {/*/>*/}
          </p>
          <InfoWrapper>
            <p className="text-text-tertiary">기본 정보</p>
            <p className="text-text-primary">
              {registerInfo.birthDate?.replaceAll('-', '.')},{' '}
              {registerInfo.gender === 'MALE' ? '남' : '여'}
            </p>
          </InfoWrapper>
          <InfoWrapper>
            <p className="text-text-tertiary">학교</p>
            <p className="text-text-primary">{registerInfo.school}</p>
          </InfoWrapper>
          <InfoWrapper>
            <p className="text-text-tertiary">학생 주소</p>
            <p className="text-text-primary max-w-[250px] overflow-wrap break-word">
              {registerInfo.address_1}
            </p>
          </InfoWrapper>
          <InfoWrapper>
            <p className="text-text-tertiary">가족 연락처</p>
            <p className="text-text-primary">
              {associates?.relation === 'MOTHER' ? '(모)' : '(부)'}
              {associates?.phoneNumber}{' '}
            </p>
          </InfoWrapper>
          <InfoWrapper>
            <p className="text-text-tertiary">비고</p>
            <p className="text-text-primary">{registerInfo.description}</p>
          </InfoWrapper>
        </div>
      </>{' '}
    </div>
  )
}

const InfoWrapper = tw.div`flex justify-between text-s-semibold`
