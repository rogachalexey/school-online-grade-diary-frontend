import { Divider, Typography, Table, Avatar, Badge } from 'antd'
import { useSelector } from 'react-redux'
import { selectCurrentUserClassId, selectCurrentUserId, selectCurrentUserRoleId } from '../store/slices/authSlice'
import { useGetChatsQuery } from '../store/endpoints/chatsEndpoints'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const { Title } = Typography

const Chats = () => {

    const navigate = useNavigate()

    const currentRoleId = useSelector(selectCurrentUserRoleId)
    const currentUserId = useSelector(selectCurrentUserId)
    const currentUserClassId = useSelector(selectCurrentUserClassId)

    const [activeTeacher, setActiveTeacher] = useState(currentRoleId === 2 ? currentUserId : null)
    const [activeClass, setActiveClass] = useState(currentRoleId === 3 ? currentUserClassId : null)

    const {
        data: chats,
        isLoading: isChatsLoading,
        isError: isChatsError,
        error: chatsError
    } = useGetChatsQuery({ teacherId: activeTeacher, classId: activeClass })

    useEffect(() => {
        if (currentRoleId === 1) {
            navigate('/')
        }
    }, [currentRoleId])

    useEffect(() => {
        if (currentRoleId === 3 && currentUserClassId) {
            setActiveClass(currentUserClassId)
        }
    }, [currentRoleId, currentUserClassId])

    useEffect(() => {
        if (currentRoleId === 2 && currentUserId) {
            setActiveTeacher(currentUserId)
        }
    }, [currentRoleId, currentUserId])

    let content = ''

    if (isChatsLoading) {
        content = <h1>Loading...</h1>
    } else if (isChatsError) {
        // console.log(classesError)
        // content = <h1>{scheduleError || classesError || schoolYearsError}</h1>
    } else {
        const columns = [
            {
                title: '',
                dataIndex: 'item',
                key: 'item',
                render: (item) =>
                    <>
                        <NavLink to={`/chat/${item.id}`}>
                            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                                <Badge dot={true}>
                                    <Avatar shape="square" size={60} />
                                </Badge>
                                <div style={{ marginLeft: '2vw' }}>
                                    <Title level={5}>Subject: {item.subject_name}</Title>
                                    <Title level={5}>Teacher: {item.teacher_last_name} {item.teacher_first_name} {item.teacher_middle_name}</Title>
                                    <Title level={5}>Class: {item.class_number} {item.class_letter}</Title>
                                </div>
                            </div>
                        </NavLink>
                    </>,
                onClick: () => console.log('asd')
            },
        ]
        content =
            <>
                <Table
                    columns={columns}
                    dataSource={chats.data.map(item => ({ item }))}
                    pagination={false}
                    style={{ margin: '0 10vw 4vh' }}
                />
            </>
    }

    return (
        <>
            <Title level={1} style={{ textAlign: 'center' }}>Chats</Title>
            <Divider />
            {content}
        </>
    )
}

export default Chats