import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { useAttendeeRecords } from '../queries'
import { useParams } from 'react-router-dom'
import { isArray } from 'lodash'
import { twMerge } from 'tailwind-merge'
import { AttendeeRecord, STATUS } from '@/api/type'
import Button from '@/components/Button'

export type AttendanceManageProps = {
  studentInfo: {
    name: string
    age: number
    grade: string
    scheduleDays: string
  }
}

export default function AttendanceManage(props: AttendanceManageProps) {
  const { studentInfo } = props

  const today = startOfToday()
  const { bookId, attendeeId } = useParams()

  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(today))
  const [totalCount, setTotalCount] = useState({
    attendCount: 0,
    absentCount: 0,
    makeupCount: 0,
  })

  // 달력에 표기할 날짜 계산
  const lastDayOfMonth = endOfMonth(selectedMonth)
  const additionalPreviousMonth = startOfWeek(selectedMonth, {
    weekStartsOn: 0,
  })
  const additionalNextMonth = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 })

  const dates = eachDayOfInterval({
    start: additionalPreviousMonth,
    end: additionalNextMonth,
  })

  // 이번 달의 출석 기록 조회 ( 추가로 보이는이전 달과 다음 달의 출석 기록은 조회하지 않음 )
  const { data: records, refetch } = useAttendeeRecords({
    bookId: Number(bookId),
    attendeeId: Number(attendeeId),
    from: format(startOfMonth(selectedMonth), 'yyyy-MM-dd'),
    to: format(endOfMonth(selectedMonth), 'yyyy-MM-dd'),
  })

  const [recordsByDate, setRecordsByDate] = useState<
    Map<string, AttendeeRecord[]>
  >(new Map())

  useEffect(() => {
    if (records?.data && isArray(records?.data)) {
      // 날짜별로 출석 기록을 묶음
      const updatedRecordsByDate = new Map<string, AttendeeRecord[]>()
      records?.data?.forEach((record: AttendeeRecord) => {
        const existingRecords: AttendeeRecord[] =
          updatedRecordsByDate.get(record.attendDate) || []
        updatedRecordsByDate.set(record.attendDate, [
          record,
          ...existingRecords,
        ])
      })
      setRecordsByDate(updatedRecordsByDate)

      // 출석, 결석, 보강 횟수 계산
      let totalAttendCount = 0
      let totalAbsentCount = 0
      let totalMakeupCount = 0
      records?.data?.forEach((record: AttendeeRecord) => {
        if (record.status === 'ATTEND' && !record.makeup) {
          totalAttendCount += 1
        } else if (record.status === 'ABSENT') {
          totalAbsentCount += 1
        } else if (record.status === ('ATTEND' as STATUS) && record.makeup) {
          totalMakeupCount += 1
        }
      })
      setTotalCount({
        attendCount: totalAttendCount,
        absentCount: totalAbsentCount,
        makeupCount: totalMakeupCount,
      })
    }
  }, [records?.data])

  // selectedMonth가 변경되면 API를 다시 호출
  useEffect(() => {
    refetch()
  }, [selectedMonth])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8 items-center w-full h-[81px] rounded-2xl bg-white">
        <img
          src="/images/icons/book-roaster/ico-student.svg"
          alt="학생 아이콘"
          width={40}
          height={40}
          loading="lazy"
          className="rounded-full ml-[23px]"
        />
        <div className="flex flex-col gap-2 text-left">
          <div className="flex flex-col gap-1">
            <p className="text-m-bold">
              <span className="text-text-primary">{studentInfo.name}</span>
              <span className="text-text-secondary text-m-semibold ml-2">
                {studentInfo.age}
              </span>
            </p>
            <p className="text-s-medium">
              <span className="text-text-brand">
                {studentInfo.scheduleDays}
              </span>{' '}
              <span className="text-[#b0b0b0]"> {studentInfo.grade}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-auto rounded-2xl bg-white p-4 flex flex-col gap-2">
        <div>
          <p className="flex text-s-bold text-[#5d5d5d]">출석 현황</p>
        </div>

        {/* 출석/결석/보강의 total count 값에 따라사 요소가 움직임 ... */}
        <div className="flex items-center justify-between mt-6 mx-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#59996b]"></div>
            <p className="text-text-secondary text-s-medium">
              출석{' '}
              <span className="text-[#59996b]">{totalCount.attendCount}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#EA5353]"></div>
            <p className="text-text-secondary text-s-medium">
              결석{' '}
              <span className="text-[#EA5353]">{totalCount.absentCount}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#F2BD2D]"></div>
            <p className="text-text-secondary text-s-medium">
              보강{' '}
              <span className="text-[#F2BD2D]">{totalCount.makeupCount}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <Button
            aria-label="calendar backward"
            className="focus:text-gray-400 hover:text-gray-400 text-[#5d5d5d] mr-2"
            onClick={() => setSelectedMonth(add(selectedMonth, { months: -1 }))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-left"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </Button>
          <div>
            <span className="focus:outline-none text-s-bold text-text-primary">
              {format(selectedMonth, 'yyyy년 MM월')}
            </span>
          </div>
          <Button
            aria-label="calendar forward"
            className="focus:text-gray-400 hover:text-gray-400 text-[#5d5d5d] ml-2"
            onClick={() => setSelectedMonth(add(selectedMonth, { months: 1 }))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler  icon-tabler-chevron-right"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center justify-between mt-1">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => {
                  return (
                    <th key={day} className="w-1/7">
                      <div className="w-full h-[30px] flex justify-center items-center">
                        <p className="text-xs-medium text-center text-[#5d5d5d]">
                          {day}
                        </p>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {
                // 7일씩 끊어서 렌더링
                dates
                  .reduce((acc, _, index) => {
                    if (index % 7 === 0) {
                      acc.push(dates.slice(index, index + 7))
                    }
                    return acc
                  }, [] as Date[][])
                  .map((dates, index) => {
                    return (
                      <tr key={index}>
                        {dates.map((date) => {
                          const isTextColor =
                            date.getDay() === 0
                              ? 'text-[#f44336]'
                              : date.getMonth() !== selectedMonth.getMonth()
                                ? 'text-text-tertiary'
                                : isSameDay(today, date)
                                  ? 'text-[#5d5d5d] rounded-full w-4 h-4 bg-[#BDDDC3]'
                                  : 'text-[#5d5d5d]'
                          return (
                            <td>
                              <div className="flex w-full h-[53px] justify-center flex-col items-center">
                                <div className="h-full">
                                  {/* 이래야 today 의 h-4 가 h-full 에 영향을 주지 않음*/}
                                  <p
                                    className={twMerge(
                                      'text-xs-medium',
                                      isTextColor,
                                    )}
                                  >
                                    {format(date, 'd')}
                                  </p>
                                </div>

                                <div className="flex gap-1 justify-center mb-6">
                                  {/* 원을 1~3개 추가 */}
                                  {recordsByDate
                                    .get(format(date, 'yyyy-MM-dd'))
                                    ?.map((record) => {
                                      return (
                                        <p
                                          className={`rounded-full w-1.5 h-1.5 ${
                                            record.status ===
                                            ('ABSENT' as STATUS)
                                              ? 'bg-[#EA5353]'
                                              : record.status ===
                                                    ('ATTEND' as STATUS) &&
                                                  record.makeup
                                                ? 'bg-[#F2BD2D]'
                                                : 'bg-[#59996b]'
                                          }`}
                                        ></p>
                                      )
                                    })}
                                </div>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
