import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  add,
  startOfMonth,
  startOfToday,
  startOfWeek,
  isSameDay,
} from 'date-fns'
import { useEffect, useState, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ko } from 'date-fns/locale'
import LeftArrowIcon from '@/assets/icons/ico-arrow-left.svg?react'
import RightArrowIcon from '@/assets/icons/ico-arrow-right.svg?react'
import DownArrowIcon from '@/assets/icons/ico-arrow-down.svg?react'
import Button from './Button'

type CalendarProps = {
  className?: string
  handleCurrentDay: (date: Date) => void
  value?: Date | string
  disableBeforeToday?: boolean
}

export default function Calendar({
  className,
  handleCurrentDay,
  value,
  disableBeforeToday,
}: CalendarProps) {
  const today = startOfToday()
  const [selectedMonth, setSelectedMonth] = useState(
    startOfMonth(value || today),
  )

  const [selectedDay, setSelectedDay] = useState<Date | string>(value || today)
  const [hasSelection, setHasSelection] = useState(false)

  const [isYearSelectorOpen, setIsYearSelectorOpen] = useState(false)

  const lastDayOfMonth = endOfMonth(selectedMonth)
  const additionalPreviousMonth = startOfWeek(selectedMonth, {
    weekStartsOn: 0,
  })
  const additionalNextMonth = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 })

  const dates = eachDayOfInterval({
    start: additionalPreviousMonth,
    end: additionalNextMonth,
  })

  useEffect(() => {
    setSelectedMonth(startOfMonth(value || today))
    setSelectedDay(value || today)
  }, [value])

  return (
    <div className="flex flex-col gap-3 px-4">
      <button
        type="button"
        className="focus:outline-none text-[20px] font-bold text-text-primary cursor-pointer"
      >
        {format(selectedDay, 'M월 d일 (E)', { locale: ko })}
      </button>

      <div className="flex justify-between border-t border-border-interactive-secondary h-[42px] pt-0.5">
        <div
          className="flex items-center"
          onClick={() => setIsYearSelectorOpen(true)}
        >
          <Button className="focus:outline-none text-s-bold text-text-primary cursor-pointer">
            {format(selectedMonth, 'yyyy년 MM월')}
          </Button>

          <DownArrowIcon
            width={32}
            height={32}
            className={`${isYearSelectorOpen ? 'rotate-180' : ''}`}
          />
        </div>
        {!isYearSelectorOpen && (
          <div className="flex items-center">
            <Button
              aria-label="calendar backward"
              className="focus:text-gray-400 hover:text-gray-400 text-[#5d5d5d] h-10 w-10 flex justify-center items-center"
              onClick={() =>
                setSelectedMonth(add(selectedMonth, { months: -1 }))
              }
              children={
                <LeftArrowIcon width={12} height={12} color="#5d5d5d" />
              }
            />

            <Button
              aria-label="calendar forward"
              className="focus:text-gray-400 hover:text-gray-400 text-[#5d5d5d] w-10 h-10 flex justify-center items-center"
              onClick={() =>
                setSelectedMonth(add(selectedMonth, { months: 1 }))
              }
              children={
                <RightArrowIcon width={12} height={12} color="#5d5d5d" />
              }
            />
          </div>
        )}
      </div>

      {isYearSelectorOpen && (
        <YearSelector
          selectedMonth={selectedMonth}
          today={today}
          onSelect={(year) => {
            setSelectedMonth(new Date(year, selectedMonth.getMonth(), 1))
            setIsYearSelectorOpen(false)
          }}
        />
      )}

      {!isYearSelectorOpen && (
        <table className={twMerge('w-full table-fixed', className)}>
          <thead>
            <tr>
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => {
                return (
                  <th key={day} className="w-1/7">
                    <div className="w-full h-[30px] flex justify-center items-center">
                      <p
                        className={`text-center text-s-semibold ${
                          day === '일' ? 'text-border-danger' : 'text-[#5d5d5d]'
                        }`}
                      >
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
                        const isSelectedDay =
                          hasSelection && isSameDay(date, selectedDay)
                        const isTodayDay = isSameDay(date, today)
                        const isTextColor = isSelectedDay
                          ? 'rounded-full w-9 h-9 bg-[#BDDDC3]'
                          : isTodayDay
                            ? 'rounded-full w-9 h-9 border border-border-brand'
                            : ''

                        const isPast = disableBeforeToday && date < today
                        const disabledStyle = isPast
                          ? 'text-text-disabled cursor-not-allowed'
                          : ''

                        const isTodayMonth =
                          date.getMonth() === selectedMonth.getMonth()
                        const holidayColor =
                          date.getDay() === 0
                            ? 'text-[#f44336] '
                            : !isTodayMonth
                              ? 'text-text-tertiary'
                              : ''
                        return (
                          <td key={date.toString()}>
                            <div
                              onClick={() => {
                                if (
                                  (disableBeforeToday && date < today) ||
                                  !isTodayMonth
                                )
                                  return
                                setHasSelection(true)
                                setSelectedDay(date)
                                handleCurrentDay(date)
                              }}
                              className="relative flex justify-center items-center w-full h-[45px]"
                            >
                              <p className="relative z-10">
                                <span
                                  className={twMerge(
                                    '!text-s-semibold flex items-center justify-center',
                                    disabledStyle,
                                    holidayColor,
                                    isSameDay(date, today)
                                      ? 'text-text-brand'
                                      : isSameDay(date, selectedDay)
                                        ? 'text-text-brand'
                                        : '',
                                  )}
                                >
                                  {format(date, 'd')}
                                </span>
                              </p>
                              <p
                                className={twMerge(
                                  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0',
                                  isTextColor,
                                )}
                              />
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
      )}
    </div>
  )
}

function YearSelector({
  selectedMonth,
  today,
  onSelect,
}: {
  selectedMonth: Date
  today: Date
  onSelect: (year: number) => void
}) {
  const currentYearRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    currentYearRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    })
  }, [])

  const isActiveYear = (year: number) => {
    return (
      year === selectedMonth.getFullYear() ||
      isSameDay(today, new Date(year, selectedMonth.getMonth(), 1))
    )
  }

  // 렌더링 연도
  // 만일 연도가 많아지게되면 virtualized 리스트로 변경하는 것을 고려해볼 수 있다.
  const renderYear = (year: number) => {
    const isActive = isActiveYear(year)
    return (
      <div
        key={year}
        ref={isActive ? currentYearRef : null}
        className={`text-center text-text-secondary cursor-pointer text-s-semibold h-10 flex items-center justify-center w-20 mx-auto ${
          isActive ? 'bg-[#BDDDC3] rounded-full text-[#428758]' : ''
        }`}
        onClick={() => onSelect(year)}
      >
        {year}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-[10px] py-[5px] h-[200px] overflow-y-auto">
      {Array.from({ length: 81 }, (_, i) => renderYear(2018 - 69 + i))}
    </div>
  )
}
