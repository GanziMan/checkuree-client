import { useContext, useState } from 'react'

import Header from './_components/Header'
import Bottom from '../_components/Footer'
import BottomFilter from './_components/BottomFilter'

import MainContent from './_components/Main'
import { BookContext } from '@/context/BookContext'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAttendeeList } from './queries'
import SEO from '@/components/SEO'
import { DaysType, GenderType } from '@/api/type'

const DaysMatch: Record<string, DaysType> = {
  월: 'MONDAY',
  화: 'TUESDAY',
  수: 'WEDNESDAY',
  목: 'THURSDAY',
  금: 'FRIDAY',
  토: 'SATURDAY',
  일: 'SUNDAY',
}
export default function Page() {
  const [searchParams] = useSearchParams()
  const { bookId } = useParams()
  const bookName = searchParams.get('bookName')
  const context = useContext(BookContext)
  const { selectedBook } = context!

  const [openFilter, setOpenFilter] = useState<boolean>(false)

  const onDrawerChange = () => {
    setOpenFilter(!openFilter)
  }

  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<{
    dayArrays: DaysType[]
    gender: GenderType
    age: { min: number; max: number }
  }>({
    dayArrays: [],
    gender: '',
    age: { min: 0, max: 100 },
  })
  const { data: attendeeList } = useAttendeeList({
    bookId: Number(bookId),
    dayArrays: filter.dayArrays,
    gender: filter.gender,
    age: filter.age,
  })

  const onChangeFilter = (
    dayArrays: DaysType[],
    gender: GenderType,
    age: { min: number; max: number },
  ) => {
    setFilter({
      dayArrays,
      gender,
      age,
    })
    setOpenFilter(false)
  }

  const getGrades = (grades: { id: number; name: string }[]) => {
    const gradesBooks = grades.map((grade) => grade.name)
    return gradesBooks.join(' / ')
  }

  const onChangeSearch = (value: string) => {
    setSearch(value)
  }

  return (
    <section className="flex flex-col w-full h-full">
      <SEO
        title="체쿠리 | 학생 목록"
        content="체쿠리 음악학원 출석부 서비스의 학생 목록 페이지입니다."
      />
      <Header
        title={bookName || selectedBook?.title!}
        onDrawerChange={onDrawerChange}
        onChangeSearch={onChangeSearch}
      />
      {attendeeList?.status === 200 && attendeeList?.data.content.length > 0 ? (
        <MainContent
          roaster={attendeeList}
          getGrades={getGrades}
          searchName={search}
        />
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center h-full">
          <img
            src="/images/icons/book-roaster/ico-error-frog.svg"
            alt="체쿠리 에러 아이콘"
            width={45}
            height={45}
            loading="lazy"
          />
          <p className="text-s-medium text-[#B0B0B0]">
            등록된 학생이 없습니다.
          </p>
        </div>
      )}

      <BottomFilter
        openFilter={openFilter}
        onDrawerChange={onDrawerChange}
        DaysMatch={DaysMatch}
        onChangeFilter={onChangeFilter}
      />
      {!openFilter && <Bottom />}
    </section>
  )
}
