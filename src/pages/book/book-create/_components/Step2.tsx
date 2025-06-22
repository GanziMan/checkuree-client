import { useEffect, useState } from 'react'

import { twMerge } from 'tailwind-merge'
import BottomDrawer from '@/components/BottomDrawer'
import { useSubjectItems, useSubjects } from '../queries'

import { useFormContext } from 'react-hook-form'
import { COURSE_ERROR_MESSAGE, CreateBookSchema } from '../_schema'
import FieldTitle from '@/components/FieldTitle'
import Button from '@/components/Button'

export type GradeItemProps = {
  handleCurriculum: (state: boolean) => void
  isCurriculum: boolean
}

export type GradeItem = { level: number; subjectItemId: number; title: string }

export default function Step2(props: GradeItemProps) {
  const { handleCurriculum, isCurriculum } = props

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateBookSchema>()

  const courseData = watch('courses', [])
  const { data: subjects } = useSubjects()
  const [courseTitle, setCourseTitle] = useState<string>('')

  const [selectedSubject, setSelectedSubject] = useState<{
    id: number
    title: string
  }>()

  const [selectedSubjectItems, setSelectedSubjectItems] = useState<GradeItem[]>(
    [],
  )

  const { data: subjectItems } = useSubjectItems({
    subjectId: selectedSubject?.id!,
  })

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  const onDrawerChange = () => {
    setOpenDrawer(!openDrawer)
  }
  const handleBottomDrawer = (open: boolean) => {
    setOpenDrawer(open)
  }

  useEffect(() => {
    if (subjects)
      setSelectedSubject({
        id: subjects[0].id,
        title: subjects[0].title,
      })
  }, [subjects])

  const isCourseNameVaild =
    courseTitle.length > 0 && selectedSubjectItems.length > 0

  const removeItemsAndAdjustLevels = (
    selectedSubjectItems: GradeItem[],
    targetIndex: number,
  ): GradeItem[] =>
    selectedSubjectItems
      .filter((_, index) => index !== targetIndex) // targetIndex를 제외한 나머지 아이템 필터링
      .map((item, index) => ({
        ...item,
        level: index + 1,
      }))

  return (
    <>
      <div className="flex flex-col justify-center gap-6 w-full">
        {/* 커리큘럼 추가된 것 */}
        {courseData.map((course, index) => {
          return (
            <div
              key={[course.title, index].join('-')}
              className="border-t border-b border-[#f6f6f6] w-full h-16 flex justify-between items-center"
            >
              <p className="text-m-bold text-text-primary pl-2">
                {course.title} <span className="text-text-danger">*</span>
              </p>
              <img
                src={'/images/icons/book-create/ico-right-arrow.svg'}
                alt="이미지 추가 아이콘"
                width={32}
                height={32}
                className=""
              />
            </div>
          )
        })}

        {isCurriculum ? (
          <>
            {/* 커리큘럼 이름 */}
            <div className="flex flex-col gap-2">
              <FieldTitle title="커리큘럼 이름" essential />

              <input
                type="text"
                data-cy="curriculum-input"
                aria-label="curriculum-input"
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="커리큘럼 이름"
                className="bg-white w-full h-12 border border-[#E7E7E7] rounded-xl p-4 outline-none text-m-medium text-text-secondary"
              />
            </div>
            {/* 커리큘럼 내용 */}
            <div className="flex flex-col gap-2">
              <FieldTitle title="커리큘럼 내용" essential />

              <div className="rounded-2xl py-1 px-2 text-left bg-bg-base">
                <ul>
                  <li className="h-11 w-full px-9  py-1 text-s-semibold text-text-primary flex items-center justify-between ">
                    <span className="">올챙이(기본)</span>
                  </li>
                  {selectedSubjectItems.map((subjectItem) => {
                    return (
                      <li
                        key={subjectItem.subjectItemId}
                        className="h-11 w-full px-1 py-1 text-s-semibold text-text-primary flex justify-between"
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <img
                            src={'/images/icons/book-create/ico-equal.svg'}
                            alt="이미지 추가 아이콘"
                            width={24}
                            height={24}
                            className=""
                          />
                          <span>{subjectItem.title}</span>
                        </div>
                        <img
                          src="/images/icons/book-create/ico-close-gray.svg"
                          alt="닫기 아이콘"
                          loading="lazy"
                          width={32}
                          height={32}
                          onClick={() => {
                            const targetIndex = selectedSubjectItems.findIndex(
                              (item) =>
                                item.subjectItemId ===
                                subjectItem.subjectItemId,
                            )
                            // 변경이 없는 경우
                            if (targetIndex === -1) return
                            // 변경 사항이 있는 경우
                            const convertedItems = removeItemsAndAdjustLevels(
                              selectedSubjectItems,
                              targetIndex,
                            )
                            setSelectedSubjectItems(convertedItems)
                          }}
                        />
                      </li>
                    )
                  })}

                  <div
                    onClick={() => handleBottomDrawer(true)}
                    data-cy="subject-add-button"
                    aria-label="subject-add-button"
                    className="h-11 w-full text-s-semibold text-text-primary flex gap-[1px] justify-center items-center"
                  >
                    <img
                      src={'/images/icons/book-create/ico-plus.svg'}
                      alt="이미지 추가 아이 콘"
                      width={15}
                      height={15}
                      loading="lazy"
                    />
                    <p className="text-s-medium text-border-secondary-hover">
                      과목 추가하기
                    </p>
                  </div>
                </ul>
              </div>
            </div>

            <Button
              className={twMerge(
                'w-full h-[54px] flex justify-center items-center rounded-xl bg-bg-tertiary text-[#f1f8f3]',
                isCourseNameVaild
                  ? 'bg-bg-tertiary text-[#f1f8f3]'
                  : 'bg-bg-disabled text-text-disabled',
              )}
              data-cy="curriculum-confirm"
              aria-label="curriculum-confirm"
              disabled={!isCourseNameVaild}
              onClick={() => {
                setSelectedSubjectItems([])
                setCourseTitle('')
                setValue(
                  'courses',
                  [
                    ...courseData,
                    {
                      title: courseTitle,
                      isPrimary: true,
                      grades: selectedSubjectItems,
                    },
                  ],
                  { shouldValidate: true },
                )
                handleCurriculum(false)
              }}
              label="확인"
              labelClassName="text-lg font-semibold"
            />
          </>
        ) : (
          <Button
            className="w-full h-10 flex justify-center items-center bg-bg-secondary"
            data-cy="curriculum-add-button"
            aria-label="curriculum-add-button"
            onClick={() => handleCurriculum(true)}
          >
            <img
              src={'/images/icons/book-create/ico-plus.svg'}
              alt="이미지 추가 아이콘"
              width={24}
              height={24}
            />
            <p className="text-m-medium text-[#B0B0B0]">커리큘럼 추가하기 </p>
          </Button>
        )}

        {errors.courses && (
          <p className="text-red-500 text-xs">{COURSE_ERROR_MESSAGE}</p>
        )}
      </div>
      <BottomDrawer
        isOpen={openDrawer}
        onClose={onDrawerChange}
        children={
          <div className="flex flex-col gap-4 items-center">
            <div className="relative w-full">
              <input
                type="text"
                className="bg-bg-secondary rounded-lg w-full h-11 outline-none pl-11 text-m-bold text-border-secondary-hover"
                placeholder="과목 검색"
              />
              <img
                width={40}
                height={40}
                src={'/images/icons/book-roaster/ico-glasses.svg'}
                alt="검색 아이콘"
                className="absolute top-[2px] left-1"
              />
            </div>

            <div className="w-full h-[234px] flex bg-white ">
              <ul className="w-full max-w-[107px] overflow-y-scroll scrollbar-hide rounded-tl-lg">
                {subjects?.map((subject) => {
                  return (
                    <li
                      key={subject.id}
                      className={twMerge(
                        'bg-white h-[52px] flex items-center justify-center',
                        selectedSubject?.title === subject.title
                          ? 'text-text-brand font-bold bg-bg-base'
                          : 'text-text-primary text-m-medium',
                      )}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject.title}
                    </li>
                  )
                })}
              </ul>
              <ul className="w-full overflow-y-scroll bg-[#f6f6f6] px-[14px] rounded-tr-lg">
                {subjectItems?.map((subjectItem) => {
                  const isFindIndex = selectedSubjectItems.find(
                    (item) => item.subjectItemId === subjectItem.id,
                  )
                  return (
                    <li
                      key={subjectItem.level}
                      className="h-[52px] flex items-center justify-between"
                    >
                      <p className="text-text-primary text-s-semibold">
                        {subjectItem.title}
                      </p>
                      <img
                        src={
                          isFindIndex
                            ? '/images/icons/ico-check.svg'
                            : '/images/icons/book-create/ico-plus.svg'
                        }
                        alt="플러스 아이콘"
                        data-cy="add-icon"
                        aria-label="add-icon"
                        width={19}
                        height={19}
                        onClick={() =>
                          !isFindIndex &&
                          setSelectedSubjectItems([
                            ...selectedSubjectItems,
                            {
                              subjectItemId: subjectItem.id,
                              level: selectedSubjectItems.length + 1,
                              title: subjectItem.title,
                            },
                          ])
                        }
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        }
      />
    </>
  )
}
