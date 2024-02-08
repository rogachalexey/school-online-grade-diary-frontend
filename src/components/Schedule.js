import { Divider, Table, Typography, Tabs, Select, Button, Card, Input } from 'antd'
import { useGetScheduleListQuery, useGetCurrentWeekQuery, } from '../store/endpoints/scheduleEndpoints'
import {
    useAddNewLessonMutation,
    useDeleteLessonMutation,
    useEditLessonMutation
} from '../store/endpoints/lessonsEndpoints'
import { useGetClassesQuery } from '../store/endpoints/classesEndpoints'
import { useGetSchoolWeeksQuery } from '../store/endpoints/schoolWeeksEndpoints'
import { useGetTeachersQuery } from '../store/endpoints/teachersEndpoints'
import { useGetSubjectsQuery } from '../store/endpoints/subjectsEndpoints'
import { useGetAuditoriumsQuery } from '../store/endpoints/auditoriumsEndpoints'
import { useEffect, useState } from 'react'
import { selectCurrentUserClassId, selectCurrentUserId, selectCurrentUserRoleId } from '../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { CaretRightOutlined, CaretLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { CloseOutlined, DeleteOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const { Title } = Typography

const lessonTimes = [
    '08:00 - 08:45',
    '08:55 - 09:40',
    '09:50 - 10:35',
    '10:55 - 11:40',
    '11:50 - 12:35',
    '12:45 - 13:30',
    '14:00 - 14:45',
    '14:55 - 15:40',
    '15:50 - 16:35',
    '16:45 - 17:30'
]

const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

function scheduleFilter(day, currentWeekId, { data, activeTeacher, activeClass }) {
    if (!activeTeacher && !activeClass) {
        return []
    }
    const dayLessons = data.filter(item => item.day === day && item.school_week_id === currentWeekId)

    const daySchedule = lessonTimes.map((item, index) => ({ lessonTime: index, isBusy: false }))

    if (activeTeacher && activeClass) {
        dayLessons.forEach(item => {
            if (daySchedule[item.time - 1].id && daySchedule[item.time - 1].id === item.id) {
                daySchedule[item.time - 1] = { ...item, lessonTime: daySchedule[item.time - 1].lessonTime, isBusy: false }
            } else {
                daySchedule[item.time - 1] = { lessonTime: daySchedule[item.time - 1].lessonTime, isBusy: true, id: item.id }
            }
        })
    } else {
        dayLessons.forEach(item => {
            daySchedule[item.time - 1] = { lessonTime: daySchedule[item.time - 1].lessonTime, ...item, isBusy: false }
        })
    }

    return daySchedule
}

function findSchoolWeek(id, schoolWeeks) {
    return schoolWeeks?.filter(item => item.id === id)[0]
}

const Schedule = () => {

    const currentRoleId = useSelector(selectCurrentUserRoleId)
    const currentUserId = useSelector(selectCurrentUserId)
    const currentUserClassId = useSelector(selectCurrentUserClassId)

    const [activeWeek, setActiveWeek] = useState(null)
    const [activeTeacher, setActiveTeacher] = useState(currentRoleId === 2 ? currentUserId : null)
    const [activeClass, setActiveClass] = useState(currentRoleId === 2 ? null : 1)
    const [activeTab, setActiveTab] = useState(1)

    const [updateHomeworkInput, setUpdateHomeworkInput] = useState('')
    const [inputHomeworkLessonId, setInputHomeworkLessonId] = useState(null)

    const [updateActiveTab, setUpdateActiveTab] = useState(null)
    const [addActiveTab, setAddActiveTab] = useState(null)
    const [cuerrentLessonTime, setCuerrentLessonTime] = useState(null)
    const [isUpdateLesson, setIsUpdateLesson] = useState(false)
    const [isAddNewLesson, setIsAddNewLesson] = useState(false)
    const [updateLessonSubject, setUpdateLessonSubject] = useState(null)
    const [updateLessonClass, setUpdateLessonClass] = useState(null)
    const [updateLessonTeacher, setUpdateLessonTeacher] = useState(null)
    const [updateLessonAuditorium, setUpdateLessonAuditorium] = useState(null)
    const [addLessonSubject, setAddLessonSubject] = useState(null)
    const [addLessonClass, setAddLessonClass] = useState(null)
    const [addLessonTeacher, setAddLessonTeacher] = useState(null)
    const [addLessonAuditorium, setAddLessonAuditorium] = useState(null)


    const {
        data: currentWeek,
        isLoading: isCurrentWeekLoading,
        isError: isCurrentWeekError,
        error: currentWeekError
    } = useGetCurrentWeekQuery()

    const {
        data: scheduleTeacher,
        isLoading: isScheduleTeacherLoading,
        isError: isScheduleTeacherError,
        error: scheduleTeacherError
    } = useGetScheduleListQuery({ teacherId: activeTeacher })

    const {
        data: scheduleClass,
        isLoading: isScheduleClassLoading,
        isError: isScheduleClassError,
        error: scheduleClassError
    } = useGetScheduleListQuery({ classId: activeClass })

    const {
        data: classes,
        isLoading: isClassesLoading,
        isError: isClassesError,
        error: classesError
    } = useGetClassesQuery({})

    const {
        data: schoolWeeks,
        isLoading: isSchoolYearsLoading,
        isError: isSchoolYearsError,
        error: schoolYearsError
    } = useGetSchoolWeeksQuery()

    const {
        data: teachers,
        isLoading: isTeachersLoading,
        isError: isTeachersError,
        error: teachersError
    } = useGetTeachersQuery({})

    const {
        data: subjects,
        isLoading: isSubjectsLoading,
        isError: isSubjectsError,
        error: subjectsError
    } = useGetSubjectsQuery({})

    const {
        data: auditoriums,
        isLoading: isAuditoriumsLoading,
        isError: isAuditoriumsError,
        error: auditoriumsError
    } = useGetAuditoriumsQuery({})

    const [addLesson, {
        isLoading: isAddNewLessonLoading,
        isError: isAddNewLessonError
    }] = useAddNewLessonMutation()

    const [updateLesson, {
        isLoading: isUpdateLessonLoading,
        isError: isUpdateLessonError
    }] = useEditLessonMutation()

    const [deleteLesson, {
        isLoading: isDeleteLessonLoading,
        isError: isDeleteLessonError
    }] = useDeleteLessonMutation()

    function renderTableActions(isBusy, lesson) {
        function cancelAction() {
            setIsAddNewLesson(false)
            setIsUpdateLesson(false)
            setCuerrentLessonTime(null)
            setAddLessonSubject(null)
            setAddLessonClass(null)
            setAddLessonTeacher(null)
            setAddLessonAuditorium(null)
        }
        function deleteCurrentLesson() {
            deleteLesson(lesson.id)
            cancelAction()
        }
        function setUpdateActions() {
            setIsUpdateLesson(true)
            setIsAddNewLesson(false)
            setUpdateActiveTab(activeTab)
            setUpdateLessonSubject(lesson.subject_id)
            setUpdateLessonAuditorium(lesson.auditorium_id)
            setCuerrentLessonTime(lesson.lessonTime)
            setUpdateLessonClass(lesson.class_id)
            setUpdateLessonTeacher(lesson.teacher_id)
        }
        function setAddActions() {
            setIsAddNewLesson(true)
            setIsUpdateLesson(false)
            setAddActiveTab(activeTab)
            setCuerrentLessonTime(lesson.lessonTime)
            if (activeClass) {
                setAddLessonClass(activeClass)
            }
            if (activeTeacher) {
                setAddLessonTeacher(activeTeacher)
            }
        }
        function updateCurrentLesson() {
            updateLesson({
                id: lesson.id,
                subject_id: updateLessonSubject,
                class_id: updateLessonClass,
                teacher_id: updateLessonTeacher,
                auditorium_id: updateLessonAuditorium
            })
            cancelAction()
        }
        function addNewLesson() {
            if (
                addLessonSubject || addLessonClass ||
                addLessonTeacher || addLessonAuditorium ||
                activeWeek || activeTab
            ) {
                addLesson({
                    subject_id: addLessonSubject,
                    class_id: addLessonClass,
                    teacher_id: addLessonTeacher,
                    auditorium_id: addLessonAuditorium,
                    school_week_id: activeWeek,
                    day: activeTab,
                    time: lesson.lessonTime + 1
                })
                cancelAction()
            } else {

            }
        }
        if (!isBusy) {
            if (lesson.subject_id) {
                if (isUpdateLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === updateActiveTab) {
                    return <>
                        <Button type='text' onClick={cancelAction} icon={<CloseOutlined />} />
                        <Button type='text' onClick={updateCurrentLesson} icon={<CheckOutlined />} />
                    </>
                } else {
                    return <>
                        <Button type='text' onClick={setUpdateActions} icon={<EditOutlined />} />
                        <Button type='text' onClick={deleteCurrentLesson} icon={<DeleteOutlined />} />
                    </>
                }
            } else if (isAddNewLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === addActiveTab) {
                return <>
                    <Button type='text' onClick={cancelAction} icon={<CloseOutlined />} />
                    <Button type='text' onClick={addNewLesson} icon={<CheckOutlined />} />
                </>
            } else {
                return <Button type='text' onClick={setAddActions} icon={<PlusOutlined />} />
            }
        } else {
            return '-'
        }
    }

    function renderHomework(lesson) {
        function setInputHomework() {
            setUpdateHomeworkInput(lesson.homework)
            setInputHomeworkLessonId(lesson.id)
        }
        function cancelInputHomework() {
            setInputHomeworkLessonId(null)
        }
        function editHomework() {
            updateLesson({
                id: lesson.id,
                homework: updateHomeworkInput
            })
            cancelInputHomework()
        }
        if (currentRoleId === 2 && lesson.teacher_id === currentUserId) {
            if (inputHomeworkLessonId === lesson.id) {
                return <div style={{ display: 'flex' }}>
                    <Input value={updateHomeworkInput} onChange={handlUpdateHomeworkInput} />
                    <Button type='text' onClick={cancelInputHomework} icon={<CloseOutlined />} />
                    <Button type='text' onClick={editHomework} icon={<CheckOutlined />} />
                </div>
            } else {
                return <div style={{ display: 'flex', alignItems:'center' }}>
                    {lesson.homework}
                    <Button type='text' onClick={setInputHomework} icon={<EditOutlined />} style={{marginLeft:'auto',marginRight:'0'}}/>
                </div>
            }
        } else {
            return lesson.homework
        }
    }

    const handlActiveClass = (value) => setActiveClass(value)
    const handlActiveTeacher = (value) => setActiveTeacher(value)
    const handlActiveTab = (value) => setActiveTab(value)

    const handlUpdateHomeworkInput = (e) => setUpdateHomeworkInput(e.target.value)
    const handlUpdateLessonSubject = (value) => setUpdateLessonSubject(value)
    const handlUpdateLessonClass = (value) => setUpdateLessonClass(value)
    const handlUpdateLessonTeacher = (value) => setUpdateLessonTeacher(value)
    const handlUpdateLessonAuditorium = (value) => setUpdateLessonAuditorium(value)
    const handlAddLessonSubject = (value) => setAddLessonSubject(value)
    const handlAddLessonClass = (value) => setAddLessonClass(value)
    const handlAddLessonTeacher = (value) => setAddLessonTeacher(value)
    const handlAddLessonAuditorium = (value) => setAddLessonAuditorium(value)

    let classesItems = []
    let auditoriumsItems = []
    let teachersItems = []
    let subjectsItems = []

    const columns = [
        {
            title: 'Time',
            dataIndex: 'lessonTime',
            key: 'lessonTime',
            render: (time) => lessonTimes[time],
            width: '8vw',
            align: 'center'
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: (item, lesson) => {
                if (isUpdateLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === updateActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '10vw' }}
                        placeholder={'Subject'}
                        options={subjectsItems}
                        defaultValue={updateLessonSubject}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlUpdateLessonSubject}
                    />
                } else if (isAddNewLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === addActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '10vw' }}
                        placeholder={'Subject'}
                        options={subjectsItems}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlAddLessonSubject}
                    />
                } else {
                    return item ? <NavLink to={`/lesson/${item.lessonId}`}>{item.subjectName}</NavLink> : ''
                }
            },
            width: '12vw',
            align: 'center'
        },
        {
            title: 'Class',
            dataIndex: 'classItem',
            key: 'classItem',
            render: (classItem, lesson) => {
                if (isUpdateLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === updateActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '5vw' }}
                        placeholder={'Class'}
                        options={classesItems}
                        defaultValue={updateLessonClass}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlUpdateLessonClass}
                        disabled={activeClass ? true : false}
                    />
                } else if (isAddNewLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === addActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '5vw' }}
                        placeholder={'Class'}
                        options={classesItems}
                        defaultValue={addLessonClass}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlAddLessonClass}
                        disabled={activeClass ? true : false}
                    />
                } else {
                    return classItem ? <NavLink to={`/class/${classItem.id}`}>
                        {classItem.class_number} {classItem.class_letter}
                    </NavLink> : ''
                }
            },
            width: '6vw',
            align: 'center'
        },
        {
            title: 'Teacher',
            dataIndex: 'teacher',
            key: 'teacher',
            render: (teacher, lesson) => {
                if (isUpdateLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === updateActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '10vw' }}
                        placeholder={'Teacher'}
                        options={teachersItems}
                        defaultValue={updateLessonTeacher}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlUpdateLessonTeacher}
                        disabled={activeTeacher ? true : false}
                    />
                } else if (isAddNewLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === addActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '10vw' }}
                        placeholder={'Teacher'}
                        options={teachersItems}
                        optionFilterProp="children"
                        defaultValue={addLessonTeacher}
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlAddLessonTeacher}
                        disabled={activeTeacher ? true : false}
                    />
                } else {
                    return teacher ? <NavLink to={`/teacher/${teacher.id}`}>{teacher.teacher_last_name}</NavLink> : ''
                }
            },
            width: '6vw',
            align: 'center'
        },
        {
            title: 'Auditorium',
            dataIndex: 'auditorium_number',
            key: 'auditorium_number',
            render: (auditorium, lesson) => {
                if (isUpdateLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === updateActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '4vw' }}
                        placeholder={'Auditorium'}
                        options={auditoriumsItems}
                        defaultValue={updateLessonAuditorium}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlUpdateLessonAuditorium}
                    />
                } else if (isAddNewLesson && lesson.lessonTime === cuerrentLessonTime && activeTab === addActiveTab) {
                    return <Select
                        showSearch
                        style={{ width: '4vw' }}
                        placeholder={'Auditorium'}
                        options={auditoriumsItems}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        onSelect={handlAddLessonAuditorium}
                    />
                } else {
                    return auditorium
                }
            },
            width: '6vw',
            align: 'center'
        },
        {
            title: 'Homework',
            dataIndex: 'homework',
            key: 'homework',
            render: (homework, lesson) => renderHomework(lesson),
            align: 'center'
        }
    ]

    if (currentRoleId === 1) {
        columns.push({
            title: 'Actions',
            dataIndex: 'isBusy',
            key: 'isBusy',
            align: 'center',
            width: '7vw',
            render: (isBusy, lesson) => renderTableActions(isBusy, lesson)
        })
    }

    useEffect(() => {
        if (currentRoleId === 3 && currentUserClassId) {
            setActiveClass(currentUserClassId)
        }
    })

    function findNextWeek(e) {
        const id = activeWeek || null
        if (id) {
            const newWeek = schoolWeeks.data.filter(item => item.id === id + 1)[0]
            if (newWeek) {
                setActiveWeek(newWeek.id)
            }
        }

    }
    function findPrevWeek(e) {
        const id = activeWeek || null
        if (id) {
            const newWeek = schoolWeeks.data.filter(item => item.id === id - 1)[0]
            if (newWeek) {
                setActiveWeek(newWeek.id)
            }
        }
    }

    useEffect(() => {
        if (!activeWeek && currentWeek) {
            setActiveWeek(currentWeek.currentWeekId)
        }
        if (currentWeek) {
            setActiveTab(currentWeek.currentDay)
        }
    }, [currentWeek])

    let content = ''

    if (
        isClassesLoading || isSchoolYearsLoading ||
        isTeachersLoading || isScheduleClassLoading ||
        isScheduleTeacherLoading || isCurrentWeekLoading ||
        isAuditoriumsLoading || isSubjectsLoading ||
        isAddNewLessonLoading || isUpdateLessonLoading ||
        isDeleteLessonLoading
    ) {
        content = <h1>Loading...</h1>
    } else if (
        isClassesError || isSchoolYearsError || isTeachersError ||
        isCurrentWeekError || isAuditoriumsError || isSubjectsError ||
        isAddNewLessonError || isUpdateLessonError ||
        isDeleteLessonError
    ) {
        // console.log(classesError)
        // content = <h1>{scheduleError || classesError || schoolYearsError}</h1>
    } else {
        const selectedWeek = findSchoolWeek(activeWeek, schoolWeeks.data)
        const teachersData = scheduleTeacher && activeTeacher ? scheduleTeacher.data.map(item => ({
            ...item,
            teacher: {
                id: item.teacher_id,
                teacher_last_name: item.teacher_last_name
            },
            subject: {
                lessonId: item.id,
                subjectName: item.subject_name
            },
            classItem: {
                id: item.class_id,
                class_letter: item.class_letter,
                class_number: item.class_number
            }
        })) : []
        const classesData = scheduleClass && activeClass ? scheduleClass.data.map(item => ({
            ...item,
            teacher: {
                id: item.teacher_id,
                teacher_last_name: item.teacher_last_name
            },
            subject: {
                lessonId: item.id,
                subjectName: item.subject_name
            },
            classItem: {
                id: item.class_id,
                class_letter: item.class_letter,
                class_number: item.class_number
            }
        })) : []

        const data = [...teachersData, ...classesData]

        let columnKey = 1
        const tabs = weekDays.map(item => {
            return {
                key: columnKey,
                label: item,
                children: <Table
                    columns={columns}
                    dataSource={scheduleFilter(columnKey++, activeWeek, { activeTeacher, activeClass, data })}
                    pagination={false}
                    style={{ marginBottom: '5vh' }}
                    bordered
                />
            }
        })

        classesItems = classes.data.map(item => ({
            value: item.id,
            label: `${item.class_number} ${item.class_letter}`
        }))
        classesItems.push({
            value: null,
            label: 'none'
        })
        teachersItems = teachers.data.map(item => ({
            value: item.id,
            label: `${item.last_name} ${item.first_name}`
        }))
        teachersItems.push({
            value: null,
            label: 'none'
        })
        subjectsItems = subjects.data.map(item => ({
            value: item.id,
            label: item.name
        }))
        subjectsItems.push({
            value: null,
            label: 'none'
        })
        auditoriumsItems = auditoriums.data.map(item => ({
            value: item.id,
            label: item.auditorium_number
        }))
        auditoriumsItems.push({
            value: null,
            label: 'none'
        })

        content = <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {currentRoleId !== 3 ?
                    <Select
                        showSearch
                        style={{
                            width: 150,
                        }}
                        placeholder="Select class"
                        options={classesItems}
                        defaultValue={activeClass}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onSelect={handlActiveClass}
                        disabled={currentRoleId === 3}
                    />
                    : null
                }

                <Select
                    showSearch
                    style={{
                        width: 150,
                        marginLeft: '1vw'
                    }}
                    placeholder="Select teacher"
                    options={teachersItems}
                    optionFilterProp="children"
                    defaultValue={activeTeacher}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onSelect={handlActiveTeacher}
                />
                <div style={{ marginRight: '0', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" icon={<CaretLeftOutlined />} onClick={findPrevWeek} />
                    <Card style={{ height: '5vh', width: '15vw', margin: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {`${selectedWeek?.start_week}  --  ${selectedWeek?.end_week}`}
                    </Card>
                    <Button type="primary" icon={<CaretRightOutlined />} onClick={findNextWeek} />
                </div>
            </div>
            <Tabs activeKey={activeTab} items={tabs} onChange={handlActiveTab} />
        </>
    }

    return (
        <>
            <Title level={1} style={{ textAlign: 'center' }}>Schedule</Title>
            <Divider />
            {content}
        </>
    )
}

export default Schedule