import { CoursesResponse } from '@/api/AttendanceBookSchema'
import BottomDrawer from '@/components/BottomDrawer'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CreateAttendeeSchema } from '../_schema'
import { useFormContext } from 'react-hook-form'

type Subject = {
  id: number
  title: string
}

type SubjectItem = {
  id: number
  level: number
  title: string
}

interface SubjectSelectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  subjects?: Subject[]
  subjectItems?: SubjectItem[]
  handleBottomDrawer: (open: boolean) => void
  bookCourses: CoursesResponse
  onChangeGrade: (gradeId: number) => void
}
type Grade = {
  id: number
  title: string
  level: number
  subjectItemId: number
}

export default function SubjectSelectionDrawer({
  isOpen,
  onClose,
  handleBottomDrawer,
  bookCourses,
  onChangeGrade,
}: SubjectSelectionDrawerProps) {
  const [grades, setGrades] = useState<Grade[]>([])

  const { setValue, watch } = useFormContext<CreateAttendeeSchema>()

  useEffect(() => {
    if (bookCourses) {
      setGrades(bookCourses?.courses[0].grades)
      setValue('progressRequest.subject', bookCourses?.courses[0])
    }
  }, [bookCourses])

  const selectedSub = watch('progressRequest.subject')
  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-7 items-center">
        <span className="mr-auto text-m-bold">커리큘럼 선택</span>
        <div className="w-full h-[234px] flex bg-white">
          {/* 왼쪽: 과목 목록 */}
          <ul className="w-full max-w-[107px] overflow-y-scroll scrollbar-hide rounded-tl-lg">
            {bookCourses?.courses?.map((subject) => {
              const isSelected = selectedSub?.title === subject.title
              return (
                <li
                  key={subject.id}
                  className={twMerge(
                    'bg-white h-[52px] flex items-center justify-center cursor-pointer',
                    isSelected
                      ? 'text-text-brand text-[13px] font-bold bg-bg-base'
                      : 'text-text-primary text-[13px] font-medium ',
                  )}
                  onClick={() => {
                    setValue('progressRequest.subject', subject)
                    setGrades(subject.grades)
                  }}
                >
                  {subject.title}
                </li>
              )
            })}
          </ul>

          {/* 오른쪽: 과목 아이템 목록 */}
          {grades && (
            <ul className="w-full overflow-y-scroll bg-[#f6f6f6] px-[14px] rounded-tr-lg">
              {grades?.map((subjectItem) => (
                <li
                  key={subjectItem.id}
                  className="h-[52px] flex items-center justify-between cursor-pointer"
                >
                  <p className="text-text-primary text-s-semibold">
                    {subjectItem.title}
                  </p>
                  <img
                    src="/images/icons/book-create/ico-plus.svg"
                    alt="플러스 아이콘"
                    data-cy="add-icon"
                    aria-label="add-icon"
                    width={19}
                    height={19}
                    onClick={() => {
                      setValue('progressRequest.subjectCourse', {
                        subjectCourseId: subjectItem.id,
                        level: subjectItem.level,
                        title: subjectItem.title,
                      })
                      onChangeGrade(subjectItem.id)
                      handleBottomDrawer(false)
                    }}
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BottomDrawer>
  )
}
