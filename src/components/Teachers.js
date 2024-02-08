import { useGetTeachersQuery } from '../store/endpoints/teachersEndpoints'
import React, { useState } from 'react';
import { Avatar, Card, Radio, Form, Input, Typography, Divider } from 'antd';
import { selectCurrentUserId } from '../store/slices/authSlice';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const { Meta } = Card;

const { Title } = Typography

const Teacher = ({ teacher }) => {
    let teacher_classes = '-'
    let teacher_auditoriums = '-'
    if (teacher.classes[0].id) {
        teacher_classes = teacher.classes.map((item, index, array) => (
            <>
                <NavLink to={`/class/${item?.id}`}>{item.class_number} {item.class_letter}</NavLink>
                {index < array.length - 1 ? <>, </> : null}
            </>
        ))
    }
    if (teacher.auditoriums[0].id) {
        teacher_auditoriums = teacher.auditoriums.map(item => item.auditorium_number).join(', ')
    }

    return (
        <NavLink to={`../teacher/${teacher.id}`}
            style={{
                width: '32vw',
                margin: '2vh'
            }}
        >
            <Card
                key={teacher.id}
            >
                <Meta
                    avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />}
                    title={`${teacher.last_name} ${teacher.first_name} ${teacher.middle_name}`}
                    description={
                        <>
                            <p>{teacher.description}</p>
                            <p>Curator: {teacher_classes}</p>
                            <p>Auditoriums: {teacher_auditoriums}</p>
                        </>
                    }
                >
                </Meta>
            </Card>
        </NavLink>
    )
}

const Teachers = () => {
    const [search, setSearch] = useState('')
    const [isAllTeachers, setIsAllTeachers] = useState('all')

    const userId = useSelector(selectCurrentUserId)

    const {
        data: teachers,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetTeachersQuery({ search })

    let content = ''

    if (isLoading) {
        content = <h1>Loading...</h1>
    } else if (isSuccess) {
        content = teachers.data.map(item => <Teacher teacher={item} key={item.id}/>)
    }

    const handlSearchInput = (e) => setSearch(e.target.value)

    return (
        <>
            <Title
                style={{
                    textAlign: 'center'
                }}
                level={1}
            >
                Teachers
            </Title>
            <Divider />
            <Form
                style={{
                    display: 'flex',
                    justifyContent: 'center',

                }}
            >
                {/* <Form.Item name="myTeachers"
                style={{
                    marginRight: '3vw'
                }}
                >
                    <Radio.Group value={isAllTeachers}>
                        <Radio.Button value="all">All</Radio.Button>
                        <Radio.Button value="my">My</Radio.Button>
                    </Radio.Group>
                </Form.Item> */}
                <Form.Item
                    label="Search:"
                    name="search"
                    style={{
                        marginRight: '5vw'
                    }}
                >
                    <Input value={search} onChange={handlSearchInput} />
                </Form.Item>
            </Form>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}
            >
                {content}
            </div>
        </>
    )
}

export default Teachers