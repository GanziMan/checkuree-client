import CounselList from './CounselList'
import { useCounsellingList } from '../queries'
import { useNavigate, useParams } from 'react-router-dom'
import { Associates } from '@/api/type'
import Button from '@/components/Button'

export type CounselManageProps = {
  studentInfo: {
    name: string
    age: number
    grade: string
    scheduleDays: string
    associates: Associates[]
  }
}
export default function CounselManage(props: CounselManageProps) {
  const { studentInfo } = props
  const { bookId, attendeeId } = useParams()
  const navigate = useNavigate()

  const { data: counsellingList } = useCounsellingList({
    bookId: parseInt(bookId!),
    attendeeId: parseInt(attendeeId!),
  })

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
      {counsellingList?.map((counsel) => (
        <CounselList
          key={counsel.counsellingId}
          counselType={counsel.counsellingType}
          counselSubjects={counsel.counsellingTopicTypes}
          counselleeType={counsel.counselee.relationType}
          counsellingAt={new Date(counsel.counsellingAt)}
          counsellingId={counsel.counsellingId}
          counsellorName={counsel.counsellor.name}
          counsellorId={counsel.counsellor.counsellorId}
          counseleeId={counsel.counselee.counseleeId}
        />
      ))}

      <Button
        onClick={() =>
          navigate(
            `/book/${bookId}/attendee/${attendeeId}/counselling${location.search}`,
            {
              state: {
                associates: studentInfo.associates,
                name: studentInfo.name,
              },
            },
          )
        }
        className="w-[104px] h-[46px] rounded-full flex gap-2 justify-center items-center bg-bg-tertiary fixed bottom-11 right-[5%]"
      >
        <img
          src="/images/icons/book/ico-plus.svg"
          alt="플러스 아이콘"
          width={16}
          height={16}
          loading="lazy"
        />
        <p className="text-white font-semibold text-lg">상담</p>
      </Button>
    </div>
  )
}
