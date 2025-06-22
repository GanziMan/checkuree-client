import { CoursesResponse } from '@/api/AttendanceBookSchema'
import BottomDrawer from '@/components/BottomDrawer'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

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
  selectedSubject?: Subject
  setSelectedSubject: (subject: Subject) => void
  setSelectedSubjectItems: (item: {
    subjectItemId: number
    level: number
    title: string
  }) => void
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
  selectedSubject,
  setSelectedSubject,
  setSelectedSubjectItems,
  handleBottomDrawer,
  bookCourses,
  onChangeGrade,
}: SubjectSelectionDrawerProps) {
  const [grades, setGrades] = useState<Grade[]>([])

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 items-center">
        <div className="w-full h-[234px] flex bg-white ">
          {/* 왼쪽: 과목 목록 */}
          <ul className="w-full max-w-[107px] overflow-y-scroll scrollbar-hide rounded-tl-lg">
            {bookCourses?.courses?.map((subject) => {
              const isSelected = selectedSubject?.title === subject.title
              return (
                <li
                  key={subject.id}
                  className={twMerge(
                    'bg-white h-[52px] flex items-center justify-center cursor-pointer',
                    isSelected
                      ? 'text-text-brand text-[14px] font-bold bg-bg-base'
                      : 'text-text-primary text-s-medium ',
                  )}
                  onClick={() => {
                    setSelectedSubject(subject)
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
                    width={19}
                    height={19}
                    loading="lazy"
                    onClick={() => {
                      setSelectedSubjectItems({
                        subjectItemId: subjectItem.id,
                        level: subjectItem.level,
                        title: subjectItem.title,
                      })
                      onChangeGrade(subjectItem.id)
                      handleBottomDrawer(false)
                    }}
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
