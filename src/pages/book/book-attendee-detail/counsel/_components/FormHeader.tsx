import { useNavigate } from 'react-router-dom'

export default function FormHeader({ studentName }: { studentName: string }) {
  const navigate = useNavigate()
  return (
    <div className="px-4 w-full">
      <div className="w-full h-[64px] flex items-center justify-between py-5 cursor-pointer">
        <p className="font-bold text-text-primary text-[22px]">
          {studentName} 상담 기록
        </p>
        <img
          src="/images/icons/book-create/ico-close.svg"
          alt="닫기 아이콘"
          loading="lazy"
          width={32}
          height={32}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
      </div>
      <hr className="border-[2px] border-bg-tertiary w-full rounded-full mx-auto" />
    </div>
  )
}
