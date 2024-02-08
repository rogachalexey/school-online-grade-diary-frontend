import { Button, Divider, Select, Table, Typography } from 'antd'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useGetScheduleQuery } from '../store/endpoints/scheduleEndpoints'
import { useGetClassMembersQuery } from '../store/endpoints/classMembersEndpoints'
import { useGetSchoolWeekQuery } from '../store/endpoints/schoolWeeksEndpoints'
import { useGetMarksQuery, useAddNewMarkMutation, useDeleteMarkMutation, useEditMarkMutation } from '../store/endpoints/marksEndpoints'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUserClassId, selectCurrentUserId, selectCurrentUserRoleId } from '../store/slices/authSlice'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

function dateFormation(date, dayOfWeek) {
    const startDate = new Date(date)
    const dayDifference = dayOfWeek - startDate.getDay()
    startDate.setDate(startDate.getDate() + dayDifference)
    const day = startDate.getDate().toString().padStart(2, '0')
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0')
    return `${day}.${month}`;
}

const Lesson = () => {
    const { lessonId } = useParams()

    const [classId, setClassId] = useState(null)
    const [schoolWeekId, setSchoolWeekId] = useState(null)

    const [isUpdate, setIsUpdate] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [currentStudent, setCurrentStudent] = useState(null)
    const [selectValue, setSelectValue] = useState(null)

    const {
        data: lesson,
        isLoading: isLessonLoading,
        isError: isLessonError,
        isSuccess: isLessonSuccess
    } = useGetScheduleQuery(lessonId)

    const {
        data: classMembers,
        isLoading: isClassMembersLoading,
        isError: isClassMembersError,
        isSuccess: isClassMembersSuccess
    } = useGetClassMembersQuery({ classId })

    const {
        data: marks,
        isLoading: isMarksLoading,
        isError: isMarksError,
        isSuccess: isMarksSuccess
    } = useGetMarksQuery({ lessonId })

    const {
        data: schoolWeek,
        isLoading: isSchoolWeekLoading,
        isError: isSchoolWeekError,
        isSuccess: isSchoolWeekSuccess
    } = useGetSchoolWeekQuery(schoolWeekId)

    const [addMark, {
        isLoading: isAddMarkLoading,
        isError: isAddMarkError
    }] = useAddNewMarkMutation()

    const [updateMark, {
        isLoading: isUpdateMarkLoading,
        isError: isUpdateMarkError
    }] = useEditMarkMutation()

    const [deleteMark, {
        isLoading: isDeleteMarkLoading,
        isError: isDeleteMarkError
    }] = useDeleteMarkMutation()

    const currentUserClassId = useSelector(selectCurrentUserClassId)
    const currentUserId = useSelector(selectCurrentUserId)
    const currentUserRoleId = useSelector(selectCurrentUserRoleId)
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUserRoleId === 3) {
            navigate('/')
        }
        if (lesson) {
            if (currentUserClassId) {
                if (lesson?.class_id !== currentUserClassId) {
                    navigate('/')
                }
            }
            setClassId(lesson.class_id)
            setSchoolWeekId(lesson.school_week_id)
        }
    }, [lesson, currentUserClassId, currentUserRoleId])

    const handlSelectMark = (value) => setSelectValue(value)

    let content = ''

    if (isLessonLoading || isClassMembersLoading || isSchoolWeekLoading || isMarksLoading ||
        isAddMarkLoading || isDeleteMarkLoading || isUpdateMarkLoading) {
        content = <h1>Loading...</h1>
    } else if (isLessonError || isClassMembersError || isSchoolWeekError || isMarksError ||
        isAddMarkError || isDeleteMarkError || isUpdateMarkError) {

    } else {
        let count = 1
        const tableData = classMembers.data.map(item => {
            const mark = marks.data.filter(mark => mark.student_id === item.student_id)[0]
            return {
                number: count++,
                student: {
                    id: item.student_id,
                    lastName: item.last_name,
                    firstName: item.first_name,
                    middleName: item.middle_name
                },
                mark
            }
        })

        function actionRender(member) {
            function setAddMark() {
                cancelAction()
                setIsAdd(true)
                setCurrentStudent(member.student.id)
            }
            function setUpdateMark() {
                cancelAction()
                setIsUpdate(true)
                setCurrentStudent(member.student.id)
            }
            function cancelAction() {
                setIsAdd(false)
                setIsUpdate(false)
                setCurrentStudent(null)
            }
            function updateCurrentMark() {
                if (selectValue > -1 && selectValue < 11) {
                    updateMark({
                        id: member.mark.id,
                        lesson_id: lessonId,
                        mark: selectValue,
                        student_id: member.student.id
                    })
                }
                cancelAction()
            }
            function addCurrentMark() {
                if (selectValue > -1 && selectValue < 11) {
                    addMark({
                        lesson_id: lessonId,
                        mark: selectValue,
                        student_id: member.student.id
                    })
                }
                cancelAction()
            }
            function deleteCurrentMark() {
                deleteMark(member.mark.id)
            }
            if (member.mark) {
                if (isUpdate && currentStudent === member.student.id) {
                    return <>
                        <Button type='text' onClick={cancelAction} icon={<CloseOutlined />} />
                        <Button type='text' onClick={updateCurrentMark} icon={<CheckOutlined />} />
                    </>
                } else {
                    return <>
                        <Button type='text' onClick={setUpdateMark} icon={<EditOutlined />} />
                        <Button type='text' onClick={deleteCurrentMark} icon={<DeleteOutlined />} />
                    </>
                }
            } else if (isAdd && currentStudent === member.student.id) {
                return <>
                    <Button type='text' onClick={cancelAction} icon={<CloseOutlined />} />
                    <Button type='text' onClick={addCurrentMark} icon={<CheckOutlined />} />
                </>
            } else {
                return <>
                    <Button type='text' onClick={setAddMark} icon={<PlusOutlined />} />
                </>
            }
        }

        const marksItems = [
            {
                value: 0,
                label: 'U'
            },
            {
                value: 1,
                label: 'V'
            },
            {
                value: 2
            },
            {
                value: 3
            },
            {
                value: 4
            },
            {
                value: 5
            },
            {
                value: 6
            },
            {
                value: 7
            },
            {
                value: 8
            },
            {
                value: 9
            },
            {
                value: 10
            }
        ]

        const columns = [
            {
                title: 'No',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: 'Student',
                dataIndex: 'student',
                key: 'student',
                render: (item) => <NavLink to={`/student/${item.id}`}>
                    {item.lastName} {item.firstName} {item.middleName}
                </NavLink>,
                align: 'center'
            },
            {
                title: 'Mark',
                dataIndex: 'mark',
                key: 'mark',
                align: 'center',
                render: (mark, member) => {
                    if ((isAdd || isUpdate) && currentStudent === member.student.id) {
                        return <Select options={marksItems} onSelect={handlSelectMark} />
                    } else {
                        if (mark) {
                            if (mark.mark === 0)
                                return 'U'
                            else if (mark.mark === 1)
                                return 'V'
                            else
                                return mark.mark
                        } else {
                            return ''
                        }
                    }
                }
            }
        ]

        if (currentUserId === lesson.teacher_id) {
            columns.push({
                title: 'Actions',
                key: 'actions',
                align: 'center',
                render: (member) => actionRender(member)
            })
        }

        content = (
            <>
                <Title level={1} style={{ textAlign: 'center' }}>
                    {lesson.subject_name} lesson - {dateFormation(schoolWeek.start_week, lesson.day)}
                </Title>
                <Divider />
                <Title level={3} style={{ textAlign: 'center' }}>
                    Teacher: <NavLink to={`/teacher/${lesson.teacher_id}`}>
                        {lesson.teacher_last_name} {lesson.teacher_first_name} {lesson.teacher_middle_name}
                    </NavLink>
                </Title>
                <Table columns={columns} dataSource={tableData} pagination={false} style={{ margin: '0 6vw 5vh' }} />
            </>
        )
    }
    return (
        <>
            {content}
        </>
    )
}

export default Lesson