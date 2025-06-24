import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import toast from 'react-hot-toast'
import SEO from '@/components/SEO'
import { Associates, RelationType } from '@/api/type'

import { createCounsellings, updateCounsellings } from '@/api/CounselApiClient'
import { CounsellingSchema, CreateCounsellingSchema } from '../_schema'
import FormHeader from './_components/FormHeader'

import Button from '@/components/Button'
import tw from 'tailwind-styled-components'
import CounsellingCreateForm from './_components/CounsellingCreateForm'

export default function CounsellingCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { bookId, attendeeId } = useParams()
  const [counseleeId, setCounseleeId] = useState<number>()

  const submit = async (data: CreateCounsellingSchema) => {
    if (location.state.counsellingId) {
      await updateCounsellings({
        params: {
          ...data,
          counseleeId: location.state.counseleeId,
          attendeeId: Number(attendeeId),
          counsellingAt: new Date(data.counsellingAt),
        },
        attendanceBookId: Number(bookId),
        counsellingId: location.state.counsellingId,
      })
        .then(() => {
          toast.success('상담이 수정되었습니다..')
          navigate(`/book/${bookId}/attendee/${attendeeId}${location.search}`)
        })
        .catch((err) => {
          toast.error(err.response.data.message)
        })
    } else {
      await createCounsellings({
        params: {
          ...data,
          counseleeId: counseleeId!,
          attendeeId: Number(attendeeId),
          counsellingAt: new Date(data.counsellingAt),
        },
        attendanceBookId: Number(bookId),
      })
        .then(() => {
          toast.success('상담이 등록되었습니다.')
          navigate(`/book/${bookId}/attendee/${attendeeId}${location.search}`)
        })
        .catch((err) => {
          toast.error(err.response.data.message)
        })
    }
  }

  const transferCounselorName = (relationType: RelationType) => {
    switch (relationType) {
      case 'FATHER':
        return '학생 부'
      case 'MOTHER':
        return '학생 모'
      case 'SIBLING':
        return '조부모'
      case 'OTHER':
        return '기타'
    }
  }

  const counselors = location?.state.associates?.map(
    (counselor: Associates) => {
      return {
        name: transferCounselorName(counselor.relationType),
        value: String(counselor.id),
      }
    },
  )

  const dateFormat = (dateString: string) => {
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const methods = useForm<CreateCounsellingSchema>({
    resolver: zodResolver(CounsellingSchema),
    mode: 'onSubmit',
    defaultValues: {
      type: location.state.counselType,
      topics: location.state.counselSubjects,
      counsellingAt: location.state.counsellingAt
        ? dateFormat(location.state.counsellingAt)
        : '',
    },
  })

  const { handleSubmit } = methods

  return (
    <FormProvider {...methods}>
      <SEO
        title="체쿠리 | 상담 등록"
        content="체쿠리 음악학원 출석부 서비스의 상담 등록 페이지입니다."
      />
      <FormHeader studentName={location?.state.name} />
      <Form className="" onSubmit={handleSubmit(submit)}>
        <CounsellingCreateForm
          onChangeCounseleeId={(id: number) => setCounseleeId(id)}
          counselors={counselors}
          counsellorName={location.state.counsellorName}
        />
        <Button
          type="submit"
          className={twMerge(
            'w-full h-[54px] flex justify-center items-center rounded-xl',
            'bg-bg-tertiary text-[#f1f8f3]',
          )}
          label="저장하기"
          labelClassName="font-semibold text-lg"
        />
      </Form>
    </FormProvider>
  )
}

const Form = tw.form`flex flex-col w-full pb-[30px] justify-center gap-6 mt-10 px-6 mx-auto`
