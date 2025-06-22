import { useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

interface FormHeaderProps {
  isStep2?: boolean
  text: string
}
export default function FormHeader({ isStep2, text }: FormHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col px-4">
      <div className="w-full h-[64px] flex items-center justify-between py-5">
        <p className="font-bold text-text-primary text-[22px]">{text}</p>
        <img
          src="/images/icons/book-create/ico-close.svg"
          alt="닫기 아이콘"
          width={32}
          height={32}
          onClick={() => navigate(-1)}
          loading="lazy"
        />
      </div>
      <div className="flex gap-2 w-full justify-center">
        <hr className="border-[2px] border-bg-tertiary w-full rounded-full" />

        {text !== '클래스 수정' && (
          <hr
            className={twMerge(
              'border-[2px] w-full rounded-full',
              isStep2 ? 'border-bg-tertiary' : 'border-[#DDEEDF]',
            )}
          />
        )}
      </div>
    </div>
  )
}
