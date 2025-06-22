import { BookType } from '@/context/BookContext'
import { formatTimeRange, getDayGroupFromInput } from '@/utils'

interface MainContentProps {
  bookList: BookType[]
  handleNavigation: (bookData: BookType) => void
}
export default function Main({ bookList, handleNavigation }: MainContentProps) {
  return (
    <div className="bg-bg-secondary w-full h-full">
      <div className="w-full py-5 px-[25px] grid grid-cols-2 gap-y-6 gap-x-4 justify-items-stretch mx-auto">
        {bookList.map((book, index) => {
          return (
            <Book
              key={book.id}
              book={book}
              index={index}
              handleNavigation={handleNavigation}
            />
          )
        })}
      </div>
    </div>
  )
}

function Book({
  book,
  index,
  handleNavigation,
}: {
  book: BookType
  index: number
  handleNavigation: (bookData: BookType) => void
}) {
  const {
    id,
    title,
    attendeeCount,
    availableDays,
    availableFrom,
    availableTo,
  } = book
  return (
    <div
      key={id}
      data-cy={`book-${index}`}
      aria-label={`book-${index}`}
      className={`cursor-pointer w-full h-[195px] ${index % 2 === 1 ? 'justify-self-start' : 'justify-self-end'}`}
      onClick={() => handleNavigation(book)}
    >
      <img
        src={'/images/img-test.png'}
        className="w-full h-[97px] rounded-t-2xl"
        alt="출석부 이미지"
        loading="lazy"
      />
      <div className="flex flex-col gap-2 px-3 py-4 text-left rounded-b-2xl h-[98px] bg-white">
        <div className="flex gap-2">
          <p className="font-bold leading-5 text-text-primary max-w-[119px] truncate">
            {title}
          </p>
          <p className="font-semibold leading-5 text-text-secondary">
            {attendeeCount}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm leading-4">
          <p className="text-text-brand font-bold">
            {getDayGroupFromInput(availableDays)}
          </p>
          <p className="text-text-secondary font-medium truncate">
            {formatTimeRange(
              availableFrom.replace(':', ''),
              availableTo.replace(':', ''),
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
