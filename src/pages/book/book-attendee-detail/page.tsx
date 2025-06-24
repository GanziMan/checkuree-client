import './_components/tabStyles.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import SEO from '@/components/SEO'
import TabContainer from './_components/TabContainer'

export default function Page() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // 이후에는 non-null 단언 없이 바로 attendeeDetail.name 등 사용
  return (
    <section className="bg-bg-secondary flex-1 w-full">
      <SEO
        title="체쿠리 | 학생 상세"
        content="체쿠리 음악학원 출석부 서비스의 학생 상세 페이지입니다."
      />
      <div className="cursor-pointer w-full h-[64px] flex items-center px-4 py-5 bg-white">
        <img
          src="/images/icons/ico-arrow-left-black.svg"
          alt="닫기 아이콘"
          width={14}
          height={14}
          loading="lazy"
          onClick={() =>
            navigate(
              location.state?.from ||
                `/book/${bookId}/attendee${location.search}`,
            )
          }
        />
      </div>
      <TabContainer />
    </section>
  )
}
