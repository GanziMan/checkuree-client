import { Content, List, Root, Trigger } from '@radix-ui/react-tabs'
import StudentManage, { StudentManageProps } from './StudentManage'
import AttendanceManage, { AttendanceManageProps } from './AttendanceManage'
import LearningManage, { LearningManageProps } from './LearningManage'
import CounselManage, { CounselManageProps } from './CounselManage'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAttendeeDetail } from '../queries'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import type { CSSProperties, ComponentType } from 'react'

export default function TabContainer() {
  const { bookId, attendeeId } = useParams()

  const [searchParams] = useSearchParams()

  const { data: attendeeDetail, refetch } = useAttendeeDetail({
    attendeeId: Number(attendeeId),
    bookId: Number(bookId),
  })

  const defaultStyles: Record<'trigger' | 'content', CSSProperties> = {
    trigger: { wordBreak: 'keep-all' },
    content: { background: '#f6f6f6' },
  }

  const scheduleDays = searchParams.get('scheduleDays')!
  const grade = searchParams.get('grade')!

  if (!attendeeDetail) return <Loading />

  const studentInfoBase = {
    name: attendeeDetail.name,
    age: Number(attendeeDetail.age),
    grade,
    scheduleDays,
  }

  const studentAssociate = attendeeDetail.associates?.find(
    (fam) => fam.relationType === 'MOTHER' || fam.relationType === 'FATHER',
  )

  const tabItems: Array<{
    value: string
    label: string
    Component: ComponentType<any>
    props:
      | StudentManageProps
      | AttendanceManageProps
      | LearningManageProps
      | CounselManageProps
  }> = [
    {
      value: 'tab1',
      label: '학생관리',
      Component: StudentManage,
      props: {
        student: {
          name: attendeeDetail.name,
          age: Number(attendeeDetail.age),
          phoneNumber: attendeeDetail.phoneNumber,
          enrollDate: attendeeDetail.enrollmentDate,
        },
        futureSchedules: attendeeDetail.futureSchedules,
        lessonInfo: attendeeDetail.progresses,
        registerInfo: {
          address_1: attendeeDetail.address_1,
          birthDate: attendeeDetail.birthDate,
          gender: attendeeDetail.gender,
          phoneNumber: attendeeDetail.phoneNumber,
          description: attendeeDetail.description,
          school: attendeeDetail.school || '',
        },
        scheduleItems: attendeeDetail.schedules.schedules || [],
        associates: {
          relation: studentAssociate?.relationType || '',
          phoneNumber: studentAssociate?.phoneNumber || '',
        },
      },
    },
    {
      value: 'tab2',
      label: '출석관리',
      Component: AttendanceManage,
      props: { studentInfo: studentInfoBase },
    },
    {
      value: 'tab3',
      label: '학습관리',
      Component: LearningManage,
      props: {
        progresses: attendeeDetail.progresses,
        studentInfo: studentInfoBase,
      },
    },
    {
      value: 'tab4',
      label: '상담관리',
      Component: CounselManage,
      props: {
        studentInfo: {
          ...studentInfoBase,
          associates: attendeeDetail.associates || [],
        },
      },
    },
  ]

  // 뒤로가기 후 데이터를 강제로 다시 불러오기
  // 커리큘럼/클래스(스케쥴) 수정 후 뒤로가기 시 데이터 갱신
  useEffect(() => {
    refetch() // React Query의 refetch 기능 실행
  }, [])

  return (
    <Root
      className="TabsRoot"
      defaultValue="tab1"
      style={{
        width: '100%',
      }}
    >
      <List className="TabsList" aria-label="Manage your account">
        {tabItems.map((item) => (
          <Trigger
            key={item.value}
            className="TabsTrigger"
            value={item.value}
            style={defaultStyles.trigger}
          >
            {item.label}
          </Trigger>
        ))}
      </List>

      {tabItems.map((item) => (
        <Content
          key={item.value}
          className="TabsContent"
          value={item.value}
          style={defaultStyles.content}
        >
          <item.Component {...item.props} />
        </Content>
      ))}
    </Root>
  )
}
