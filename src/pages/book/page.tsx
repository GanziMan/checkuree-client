import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookType, BookContext } from '@/context/BookContext'
import { useBookList } from './queries'
import SEO from '@/components/SEO'
import MainContent from './_components/Main'
import Header from './_components/Header'
import Button from '@/components/Button'

export default function Page() {
  const navigate = useNavigate()
  const context = useContext(BookContext)

  const { setSelectedBook } = context!

  const handleNavigation = (bookData: BookType) => {
    setSelectedBook(bookData)
    navigate(`/book/${bookData.id}?bookName=${bookData.title}`)
  }

  const { data: bookList } = useBookList()

  return (
    <section className="relative flex flex-col w-full min-h-screen">
      <SEO
        title="체쿠리 | 출석부 목록"
        content="체쿠리 음악학원 출석부 서비스의 출석부 목록 페이지입니다."
      />
      <Header />
      {bookList?.status === 200 && bookList.data.length > 0 ? (
        <MainContent
          bookList={bookList.data}
          handleNavigation={handleNavigation}
        />
      ) : (
        <div className="bg-bg-secondary flex items-center h-full justify-center font-semibold text-text-disabled">
          <p className="text-text-secondary">출석부를 등록해 주세요</p>
        </div>
      )}
      <Button
        onClick={() => navigate('/book/create')}
        className="w-[104px] h-[46px] rounded-full flex gap-2 justify-center items-center bg-bg-tertiary fixed bottom-11 right-[5%]"
        children={
          <>
            <img
              src="/images/icons/book/ico-plus.svg"
              alt="플러스 아이콘"
              width={16}
              height={16}
              loading="lazy"
            />
            <p className="text-white font-semibold text-lg">출석부</p>
          </>
        }
      />
    </section>
  )
}
