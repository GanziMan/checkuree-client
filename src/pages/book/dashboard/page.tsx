import AttendanceRateChart from './_components/AttendanceRateChart'
import LeftArrowIcon from '@/assets/icons/ico-arrow-left.svg?react'
import RightArrowIcon from '@/assets/icons/ico-arrow-right.svg?react'
import DownArrowIcon from '@/assets/icons/ico-arrow-down.svg?react'
import AttendanceCategoryChart from './_components/AttendanceCategoryChart'

import Bottom from '../_components/Footer'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAttendeeStatistic, useBookStatistic } from '../queries'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { AttendeeStatisticsType, PeriodType } from '@/api/type'
import DateDrawer from '../book-check/_components/DateDrawer'
import { Header } from './_components/Header'

export default function Page() {
  const [searchParmas] = useSearchParams()

  const bookName = searchParmas.get('bookName')
  const { bookId } = useParams()

  const [attendRateTab, setAttendRateTab] = useState<PeriodType>('DAILY')
  const [categoryTab, setCategoryTab] = useState<AttendeeStatisticsType>('DAY')
  const [currentDate, setCurrentDate] = useState(dayjs()) // dayjs로 초기화
  const [openDrawer, setOpenDrawer] = useState(false)

  const handlePreviousDay = () => {
    setCurrentDate((prev) => prev.subtract(1, 'day'))
  }

  const handleNextDay = () => {
    setCurrentDate((prev) => prev.add(1, 'day'))
  }

  const handleCurrentDay = useCallback((date: Date) => {
    setCurrentDate(dayjs(date))
  }, [])

  const formattedDate = currentDate.format('YYYY-MM-DD')
  const displayDate = currentDate.locale('ko').format('M월 D일')

  const { data: statisticData } = useBookStatistic(Number(bookId), {
    from: dayjs(currentDate).format('YYYY-MM-DD'),
    periodType: attendRateTab,
  })

  const { data: statisticAttendeeData } = useAttendeeStatistic(Number(bookId), {
    type: categoryTab,
  })

  return (
    <section className="w-full">
      <Header bookName={bookName!} />
      {/* Calendar */}
      <div className="w-full flex h-10 justify-between items-center px-4 border-b border-bg-disabled">
        <LeftArrowIcon
          width={12}
          height={12}
          onClick={handlePreviousDay}
          className="cursor-pointer"
          color="#888888"
        />
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => setOpenDrawer(true)}
        >
          <p className="text-xl font-bold" data-value={formattedDate}>
            {displayDate}
          </p>
          <DownArrowIcon width={40} height={40} />
        </div>
        <RightArrowIcon
          width={12}
          height={12}
          onClick={handleNextDay}
          className="cursor-pointer"
          color="#888888"
        />
      </div>
      <div className="w-full h-screen flex-1 bg-bg-secondary flex flex-col gap-4 p-4">
        <AttendanceRateChart
          statisticData={statisticData!}
          currentDate={currentDate}
          tabChange={(tab: PeriodType) => setAttendRateTab(tab)}
          tab={attendRateTab}
        />

        <AttendanceCategoryChart
          statisticData={statisticAttendeeData!}
          tabChange={(tab: AttendeeStatisticsType) => setCategoryTab(tab)}
          tab={categoryTab}
        />

        <div className="h-[92px]" />
      </div>
      <DateDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        handleCurrentDay={handleCurrentDay}
      />
      <Bottom />
    </section>
  )
}
