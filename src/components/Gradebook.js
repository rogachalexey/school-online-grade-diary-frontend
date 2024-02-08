import { Divider, Table, Typography, Select, Checkbox } from 'antd'
import { useGetMarksQuery } from '../store/endpoints/marksEndpoints'
import { useGetClassesQuery } from '../store/endpoints/classesEndpoints'
import { useGetSchoolWeeksQuery } from '../store/endpoints/schoolWeeksEndpoints'
import { useGetSubjectsQuery } from '../store/endpoints/subjectsEndpoints'
import { useGetLessonsQuery } from '../store/endpoints/lessonsEndpoints'
import { useGetClassMembersQuery } from '../store/endpoints/classMembersEndpoints'
import { useEffect, useState } from 'react'
import { selectCurrentUserClassId, selectCurrentUserId, selectCurrentUserRoleId } from '../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const { Title } = Typography

const Gradebook = () => {

    const [activeSubject, setActiveSubject] = useState(1)
    const [activeClass, setActiveClass] = useState(1)
    const [activeStudent, setActiveStudent] = useState(null)
    const [isStat, setIsStat] = useState(false)

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
        data: subjects,
        isLoading: isSubjectsLoading,
        isError: isSubjectsError,
        error: subjectsError
    } = useGetSubjectsQuery()

    const {
        data: classMembers,
        isLoading: isClassMembersLoading,
        isError: isClassMembersError,
        error: classMembersError
    } = useGetClassMembersQuery({ classId: activeClass, studentId: activeStudent })

    const {
        data: lessons,
        isLoading: isLessonsLoading,
        isError: isLessonsError,
        error: lessonsError
    } = useGetLessonsQuery({ classId: activeClass, subjectId: activeSubject })

    const {
        data: marks,
        isLoading: isMarksLoading,
        isError: isMarksError,
        error: marksError
    } = useGetMarksQuery({ subjectId: activeSubject, classId: activeClass })

    const currentRoleId = useSelector(selectCurrentUserRoleId)
    const currentUserClassId = useSelector(selectCurrentUserClassId)
    const currentUserId = useSelector(selectCurrentUserId)

    useEffect(() => {
        if (currentRoleId === 3 && currentUserClassId) {
            setActiveClass(currentUserClassId)
            setActiveStudent(currentUserId)
        }
    })

    const handlActiveClass = (value) => setActiveClass(value)
    const handlActiveSubject = (value) => setActiveSubject(value)
    const onChange = (e) => setIsStat(e.target.checked)

    function dateFormation(id, dayOfWeek) {
        const week = schoolWeeks.data.filter(item => item.id === id)[0]
        const startDate = new Date(week.start_week)
        const dayDifference = dayOfWeek - startDate.getDay()
        startDate.setDate(startDate.getDate() + dayDifference)
        const day = startDate.getDate().toString().padStart(2, '0')
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0')
        return `${day}.${month}`;
    }

    let content = ''

    if (isClassesLoading || isSchoolYearsLoading || isMarksLoading || isSubjectsLoading || isLessonsLoading || isClassMembersLoading) {
        content = <h1>Loading...</h1>
    } else if (isClassesError || isSchoolYearsError || isMarksError || isSubjectsError || isLessonsError || isClassMembersError) {
        // console.log(classesError)
        // content = <h1>{scheduleError || classesError || schoolYearsError}</h1>
    } else {
        const classesItems = classes.data.map(item => ({
            value: item.id,
            label: `${item.class_number} ${item.class_letter}`
        }))
        const subjectsItems = subjects.data.map(item => ({
            value: item.id,
            label: item.name
        }))

        let columns = [
            {
                title: 'No',
                dataIndex: 'number',
                key: 'number',
                fixed: 'left',
                width: '4vw',
                align: 'center'
            },
            {
                title: 'Student',
                dataIndex: 'student',
                key: 'student',
                fixed: 'left',
                width: '6vw',
                align: 'center'
            }
        ]
        if (!isStat) {
            lessons.data.forEach(item => {
                columns.push({
                    title: <NavLink to={`/lesson/${item.id}`}>{dateFormation(item.school_week_id, item.day)}</NavLink>,
                    dataIndex: 'lesson' + item.id,
                    key: 'lesson' + item.id,
                    width: '70px',
                    align: 'center'
                })
            })
        } else {
            columns.push(
                {
                    title: 'Total skips',
                    dataIndex: 'totalSkips',
                    key: 'totalSkips',
                    align: 'center',
                    width: '2vw',
                    render: (item) => <h4>{item}</h4>
                },
                {
                    title: 'Excused absences',
                    dataIndex: 'totalReasonSckips',
                    key: 'totalReasonSckips',
                    align: 'center',
                    width: '4vw',
                    render: (item) => <h4>{item}</h4>
                },
                {
                    title: 'Absences for unexcused reasons',
                    dataIndex: 'totalUnreasonSckips',
                    key: 'totalUnreasonSckips',
                    align: 'center',
                    width: '4vw',
                    render: (item) => <h4>{item}</h4>
                },
                {
                    title: 'Percentage of absences',
                    dataIndex: 'allSkipsPerc',
                    key: 'allSkipsPerc',
                    align: 'center',
                    width: '4vw',
                    render: (item) => <h4>{item === 'NaN' ? 0 : item}</h4>
                },
                {
                    title: 'Percentage of absences due to unexcused reasons',
                    dataIndex: 'unreasonSkipsPerc',
                    key: 'unreasonSkipsPerc',
                    align: 'center',
                    width: '4vw',
                    render: (item) => <h4>{item === 'NaN' ? 0 : item}</h4>
                },
                {
                    title: 'Density of estimates',
                    dataIndex: 'completionRatePerc',
                    key: 'completionRatePerc',
                    align: 'center',
                    width: '4vw',
                    render: (item) => <h4>{item === 'NaN' ? 0 : item}</h4>
                },
                {
                    title: 'Average',
                    dataIndex: 'average',
                    key: 'average',
                    align: 'center',
                    width: '4vw',
                    render: (item) => <h4>{item === 'NaN' ? 0 : item}</h4>
                })
        }

        let studentNumber = 1
        const tableData = classMembers.data.map(item => {
            const studentMarks = marks.data.filter(mark => mark.student_id === item.student_id)
            let total = 0
            let totalSkips = 0
            let totalReasonSckips = 0
            let tableLine = {
                number: studentNumber++,
                student: <NavLink to={`/student/${item.student_id}`}>
                    {item.last_name} {item.first_name[0]}.{item.middle_name[0]}.
                </NavLink>
            }
            studentMarks.forEach(mark => {
                tableLine[`lesson${mark.lesson_id}`] = mark.mark
                if (mark.mark > 1) {
                    total += mark.mark
                } else {
                    totalSkips++
                    if (mark.mark === 1) {
                        totalReasonSckips++
                    }
                }
            })
            tableLine.average = (total / studentMarks.length).toFixed(2)
            tableLine.totalSkips = totalSkips
            tableLine.lessonsCount = lessons.data.length
            tableLine.totalReasonSckips = totalReasonSckips
            tableLine.totalUnreasonSckips = totalSkips - totalReasonSckips
            tableLine.allSkipsPerc = ((totalSkips / tableLine.lessonsCount) * 100).toFixed(2)
            tableLine.unreasonSkipsPerc = (((totalSkips - totalReasonSckips) / totalSkips) * 100).toFixed(2)
            tableLine.completionRatePerc = (studentMarks.length / tableLine.lessonsCount * 100).toFixed(2)

            return tableLine
        })

        // console.log(tableData)

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
                    placeholder="Select subject"
                    options={subjectsItems}
                    optionFilterProp="children"
                    defaultValue={activeSubject}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onSelect={handlActiveSubject}
                />
                <Checkbox onChange={onChange} style={{ marginLeft: '1vw' }}>Statistic</Checkbox>
            </div>
            <Table
                style={{ marginTop: '5vh', marginBottom: '5vh' }}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{
                    x: 1300,
                }}
                bordered
            />
        </>
    }

    return (
        <>
            <Title level={1} style={{ textAlign: 'center' }}>Gradebook</Title>
            <Divider />
            {content}
        </>
    )
}

export default Gradebook