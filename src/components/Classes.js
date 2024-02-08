import { Divider, Form, Input, Table, Typography } from 'antd'
import { useGetClassesQuery } from '../store/endpoints/classesEndpoints'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const { Title } = Typography

const columns = [
    {
        title: 'No',
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        align: 'center'
    },
    {
        title: 'Class',
        dataIndex: 'classItem',
        key: 'classItem',
        render: (classItem) => <NavLink to={`/class/${classItem.id}`}>{classItem.classNumber} {classItem.classLetter}</NavLink>,
        align: 'center'
    },
    {
        title: 'Curator',
        dataIndex: 'teacher',
        key: 'teacher',
        render: (teacher) => <NavLink to={`/teacher/${teacher.id}`}>{teacher.lastName} {teacher.firstName} {teacher.middleName}</NavLink>,
        align: 'center'
    }
]

const Classes = () => {
    const [classNumber, setNumber] = useState('')
    const [classLetter, setLetter] = useState('')
    const {
        data: classes,
        isLoading,
        isError
    } = useGetClassesQuery({ classLetter, classNumber })

    let content = ''

    if (isLoading) {
        content = <h1>Loading...</h1>
    } else if (isError) {

    } else {
        let count = 1
        const tableData = classes.data.map(item => ({
            number: count++,
            classItem: {
                id: item.id,
                classLetter: item.class_letter,
                classNumber: item.class_number
            },
            teacher: {
                id: item.teacher_id,
                lastName: item.teacher_last_name,
                firstName: item.teacher_first_name,
                middleName: item.teacher_middle_name
            }
        }))
        content = <>
            <Table dataSource={tableData} columns={columns} style={{ margin: '3vh 5vw' }} pagination={false} />
        </>
    }

    const handlNumberInput = (e) => setNumber(e.target.value)
    const handlLetterInput = (e) => setLetter(e.target.value)

    return (
        <>
            <Title level={1} style={{ textAlign: 'center' }}>Classes</Title>
            <Divider />
            <Form
                style={{
                    display: 'flex',
                    justifyContent: 'center',

                }}
            >
                <Form.Item
                    label="Number:"
                    name="number"
                    style={{
                        marginRight: '5vw'
                    }}
                >
                    <Input value={classNumber} onChange={handlNumberInput} />
                </Form.Item>
                <Form.Item
                    label="Letter:"
                    name="letter"
                    style={{
                        marginRight: '5vw'
                    }}
                >
                    <Input value={classLetter} onChange={handlLetterInput} />
                </Form.Item>
            </Form>
            {content}
        </>
    )
}

export default Classes