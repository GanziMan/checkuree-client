import {
  updateAttendeeDetail,
  updateProgressPromote,
} from '@/api/AttendeeApiClient'
import { getAttendeeRecords } from '@/api/RecordApiClient'
import { GenderType } from '@/api/type'
import { attendeeKeys } from '@/queryKeys'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { counsellingKeys } from '../../../queryKeys'
import { handleError } from '@/utils/handleError'

// TODO: Calendar 작업 시 필요
export const useAttendeeRecords = ({
  bookId,
  attendeeId,
  from,
  to,
}: {
  bookId: number
  attendeeId: number
  from: string
  to: string
}) => {
  return useQuery({
    queryKey: [''],
    queryFn: async () =>
      await getAttendeeRecords({
        params: {
          from,
          to,
        },
        attendanceBookId: bookId,
        attendeeId,
      }),
  })
}

export const useCounsellingList = ({
  bookId,
  attendeeId,
}: {
  bookId: number
  attendeeId: number
}) => useQuery(counsellingKeys.list(bookId, attendeeId))

// 선택된 스케줄에 따라 수강생 목록 가져오기
export const useScheduleData = ({
  dayOfWeek,
  hhmm,
  bookId,
}: {
  dayOfWeek: string
  hhmm: string
  bookId: number
}) =>
  useQuery({
    ...attendeeKeys.schedules(bookId, dayOfWeek, hhmm),
    enabled: !!dayOfWeek && !!hhmm,
  })

export const useScheduleTimeTable = ({ bookId }: { bookId: number }) =>
  useQuery(attendeeKeys.scheduleTable(bookId))

export const useBookCourses = ({
  openDrawer,
  bookId,
}: {
  openDrawer: boolean
  bookId: string
}) =>
  useQuery({
    ...attendeeKeys.courses(Number(bookId)),
    enabled: openDrawer,
  })

export const useProgressLog = ({
  bookId,
  attendeeId,
}: {
  bookId: number
  attendeeId: number
}) => useQuery(attendeeKeys.progressLog(bookId, attendeeId))

export const useAttendeeDetail = ({
  attendeeId,
  bookId,
}: {
  attendeeId: number
  bookId: number
}) =>
  useQuery({
    ...attendeeKeys.detail(bookId, attendeeId),
    enabled: attendeeId !== null,
    refetchOnMount: true,
    staleTime: 0,
  })

interface AttendeeModifyFormState {
  birthDate: string
  gender: GenderType
  address_1: string
  description: string
}

export const useAttendeeUpdate = ({
  bookId,
  attendeeId,
  formData,
  setIsAttendeeModify,
}: {
  bookId: number
  attendeeId: number
  formData: AttendeeModifyFormState
  setIsAttendeeModify: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClinet = useQueryClient()
  return useMutation({
    mutationFn: async () =>
      await updateAttendeeDetail({
        attendanceBookId: bookId,
        attendeeId: Number(attendeeId),
        params: {
          birthDate: formData.birthDate.replaceAll('.', '-'),
          gender: formData.gender,
          address_1: formData.address_1,
          description: formData.description,
        },
      }),
    onSuccess: () => {
      queryClinet.invalidateQueries({
        queryKey: attendeeKeys.detail(bookId, attendeeId).queryKey,
      })
      toast.success('학생 정보가 저장되었습니다.')
      setIsAttendeeModify(false)
    },
  })
}

export const useProgressPromote = ({
  bookId,
  formData,
  attendeeId,
}: {
  bookId: number
  formData: {
    completeAt: string
    startAt: string
    nextGradeId: string
  }
  attendeeId: number
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (progressId: number) =>
      await updateProgressPromote({
        attendanceBookId: Number(bookId),
        params: {
          attendeeProgressId: progressId,
          completedAt: formData.completeAt.replaceAll('.', '-'),
          startAt: formData.startAt.replaceAll('.', '-'),
          nextGradeId: formData.nextGradeId
            ? Number(formData.nextGradeId)
            : undefined, // "" 빈 문자열일 경우 보내지 않음
        },
      }).then((res) => res.data),
    onSuccess: () => {
      toast.success('다음 과정이 저장되었습니다.')

      queryClient.invalidateQueries({
        queryKey: attendeeKeys.progressLog(bookId, attendeeId).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: attendeeKeys.detail(bookId, attendeeId).queryKey,
      })
      // queryClient.invalidateQueries({
      //   queryKey: attendeeKeys.courses(bookId).queryKey,
      // })
    },
    onError: handleError,
  })
}
