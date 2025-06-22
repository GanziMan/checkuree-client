import SEO from '@/components/SEO'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import LoginButton from '../_component/LoginButton'
import HeaderBanner from '../_component/HeaderBanner'

export interface LoginDataType {
  username: string
  password: string
  isAutoLogin: boolean
}

export default function Page() {
  const accessToken = Cookies.get(import.meta.env.VITE_ACCESS_TOKEN)

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
  }, [])

  return (
    <section className="relative flex flex-col justify-center items-center h-screen gap-8 mb-[31px]">
      <SEO
        title="체쿠리 | 카카오 로그인"
        content="체쿠리 음악학원 출석부 서비스의 카카오 로그인 페이지입니다."
      />
      <div className="flex flex-col items-center justify-center gap-[191px]">
        <HeaderBanner />
        <LoginButton
          className="relative bg-[#FEE500]"
          onClick={() =>
            (window.location.href =
              'https://checkuree.com/oauth2/authorization/kakao')
          }
        >
          <img
            src="/images/icons/ico-kakao-logo.svg"
            width={18}
            height={18}
            alt="카카오 심볼 로고"
            className="absolute left-4"
            loading="lazy"
          />

          {/* font 적용 */}
          <p className="ml-[30px] font-medium text-[17px]">카카오로 시작하기</p>
        </LoginButton>
      </div>
    </section>
  )
}
