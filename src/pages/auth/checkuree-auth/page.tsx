import axios from 'axios'

import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { useAuthLogin } from './queries'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import SEO from '@/components/SEO'
import Button from '@/components/Button'

export interface LoginDataType {
  username: string
  password: string
  isAutoLogin: boolean
}

const LoginSchema = z.object({
  username: z.string().min(1, '아이디를 입력하세요.'),
  password: z.string().min(1, '비밀번호를 입력하세요.'),
  isAutoLogin: z.boolean(),
})

const initailValues = {
  username: '',
  password: '',
  isAutoLogin: false,
}

export default function Page() {
  const accessToken = Cookies.get('accessToken')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { mutate: loginMutation } = useAuthLogin()

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
  }, [])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onSubmit',
    defaultValues: initailValues,
  })
  return (
    <section className="w-full flex flex-col justify-center items-center gap-12 h-full px-6">
      <SEO
        title="체쿠리 | 음악 학원 출석부 서비스"
        content="체쿠리 사내 로그인 페이지입니다."
      />
      <img
        src={'/images/logos/checkuree_logo.svg'}
        width={284}
        height={48}
        alt="로고 이미지"
        loading="lazy"
      />
      <form
        className="flex flex-col gap-6 justify-center w-full"
        onSubmit={handleSubmit(() => {
          loginMutation({
            username: getValues('username'),
            password: getValues('password'),
            isAutoLogin: getValues('isAutoLogin'),
          })
        })}
      >
        <div className="flex flex-col gap-4 w-full items-start">
          <div className="flex flex-col gap-[1px] w-full text-left">
            <input
              id="id-input"
              {...register('username')}
              placeholder="ID"
              className="bg-white w-full h-12 rounded-2xl p-4 border-[2px] focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-[1px] w-full text-left">
            <div className="relative flex items-center w-full">
              <input
                id="password-input"
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                className="bg-white w-full h-12 rounded-2xl p-4 border-[2px] focus:outline-none"
              />
              <img
                className="absolute right-4"
                src={`/images/icons/ico-${
                  showPassword ? 'visible' : 'invisible'
                }-eye.svg`}
                width={24}
                height={24}
                alt="로그인 유지 체크"
                onClick={() => setShowPassword(!showPassword)}
                loading="lazy"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex gap-1 items-center">
            <img
              src="/images/icons/ico-check-active.svg"
              width={20}
              height={20}
              alt="로그인 유지 체크"
              loading="lazy"
            />

            <p className="font-medium text-[#5D5D5D]">로그인 유지</p>
          </div>
        </div>

        <Button
          id="login-button"
          data-cy="login-button"
          aria-label="login-button"
          className={
            'w-full h-[54px] rounded-xl text-lg leading-[22px] font-semibold flex items-center justify-center text-[#FFFFFF] bg-[#59996B] cursor-pointer'
          }
          type="submit"
          label="체쿠리 ID로 계속하기"
        />
      </form>
    </section>
  )
}
