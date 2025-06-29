import BottomDrawer from '@/components/BottomDrawer'
import Button from '@/components/Button'
import Calendar from '@/components/Calendar'
import { useState } from 'react'

type DateDrawerProps = {
  open: boolean
  onClose: () => void
  handleCurrentDay: (date: Date) => void
  saveButtonText?: string
  value?: Date | string
  disableBeforeToday?: boolean
}
export default function DateDrawer({
  onClose,
  open = false,
  handleCurrentDay,
  saveButtonText = '이동하기',
  value,
  disableBeforeToday,
}: DateDrawerProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const handleDay = (date: Date) => {
    setSelectedDay(date)
  }
  return (
    <BottomDrawer isOpen={open} onClose={onClose}>
      <Calendar
        className="mx-auto"
        handleCurrentDay={handleDay}
        value={value}
        disableBeforeToday={disableBeforeToday}
      />
      <div className="flex gap-4 w-full">
        <Button
          onClick={onClose}
          className="w-full h-[54px] flex justify-center items-center rounded-2xl bg-bg-secondary"
          label="취소"
          labelClassName="text-text-secondary text-l-semibold select-none"
        />
        <Button
          className="w-full h-[54px] flex justify-center items-center rounded-2xl bg-bg-tertiary"
          onClick={() => {
            handleCurrentDay(selectedDay)
            onClose()
          }}
          label={saveButtonText}
          labelClassName="text-[#F1F8F3] text-l-semibold select-none"
        />
      </div>
    </BottomDrawer>
  )
}
