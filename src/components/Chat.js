import { Avatar, Button, Input, Typography } from 'antd'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useGetChatQuery } from '../store/endpoints/chatsEndpoints'
import {
    useAddNewMessageMutation,
    useDeleteMessageMutation,
    useEditMessageMutation,
    useGetMessagesQuery
} from '../store/endpoints/messagesEndpoints'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUserClassId, selectCurrentUserId, selectCurrentUserRoleId } from '../store/slices/authSlice'
import { CloseOutlined, DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function dateFormation(date) {
    const dateObject = new Date(date)
    const hours = dateObject.getHours().toString().padStart(2, '0')
    const minutes = dateObject.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
}

const Message = ({ message, setUpdateActive, setUpdateMessageId, deleteMessage, setInputMessage }) => {
    function deleteMessageHandler() {
        deleteMessage(message.id)
    }
    function updateMessageHandler() {
        setInputMessage(message.content)
        setUpdateActive(true)
        setUpdateMessageId(message.id)
    }
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1vw',
            marginRight: message.me ? '2vw' : '0',
            justifyContent: message.me ? 'end' : 'start'
        }}>
            {message.me ? null : <Avatar size='large' src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />}
            <div style={{
                padding: '1vh 2vw ',
                marginLeft: '1vw',
                backgroundColor: '#4995ff',
                borderRadius: '2vw',
                maxWidth: '30vw'
            }}>
                <Title level={5} style={{ color: 'white' }}>
                    {message.user_first_name}
                    {message.me ?
                        <Button
                            onClick={updateMessageHandler}
                            type="text"
                            style={{ marginLeft: '1vw' }}
                            icon={<EditOutlined style={{ color: 'white' }} />} />
                        : null}
                    {message.me ?
                        <Button
                            onClick={deleteMessageHandler}
                            type="text"
                            icon={<DeleteOutlined style={{ color: 'white' }} />} />
                        : null}
                </Title>
                <Text style={{ color: 'white' }}>{message.content}</Text>
                <Text style={{ color: 'silver', marginLeft: '1vw' }}>{dateFormation(message.create_time)}</Text>
            </div>
        </div>
    )
}

const Chat = () => {

    const { chatId } = useParams()

    const [updateActive, setUpdateActive] = useState(false)
    const [updateMessageId, setUpdateMessageId] = useState(null)
    const [inputMessage, setInputMessage] = useState('')

    const currentUserId = useSelector(selectCurrentUserId)
    const currentUserRoleId = useSelector(selectCurrentUserRoleId)
    const currentUserClassId = useSelector(selectCurrentUserClassId)
    const navigate = useNavigate()

    const {
        data: chat,
        isLoading: isChatLoading,
        isError: isChatError,
        error: chatError
    } = useGetChatQuery(chatId)

    const {
        data: messages,
        isLoading: isMessagesLoading,
        isError: isMessagesError,
        error: messagesError,
        refetch
    } = useGetMessagesQuery({ chatId })

    const [addMessage, {
        isLoading: isAddMessageLoading,
        isError: isAddMessageError
    }] = useAddNewMessageMutation()

    const [updateMessage, {
        isLoading: isUpdateMessageLoading,
        isError: isUpdateMessageError
    }] = useEditMessageMutation()

    const [deleteMessage, {
        isLoading: isDeleteMessageLoading,
        isError: isDeleteMessageError
    }] = useDeleteMessageMutation()

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:5000/api/v1/messages/connect/${chatId}`)

        socket.addEventListener('message', (event) => {
            if (event.data === 'refresh' && messages?.data) {
                console.log(event.data)
                refetch()
            }
        })

        return () => {
            socket.close()
        }
    }, [])

    useEffect(() => {
        if (currentUserRoleId === 1) {
            navigate('/')
        }
    }, [currentUserRoleId])

    useEffect(() => {
        if (currentUserClassId && chat) {
            if (currentUserRoleId === 3 && currentUserClassId !== chat.class_id) {
                navigate('/')
            } else if (currentUserRoleId === 2 && currentUserId !== chat.teacher_id) {
                navigate('/')
            }
        }
    }, [currentUserRoleId, currentUserClassId, currentUserId, chat])

    const handlMessageinput = (e) => setInputMessage(e.target.value)

    const onMessageSendClicked = async () => {
        if (inputMessage && chatId && currentUserId) {
            await addMessage({
                chat_id: chatId,
                content: inputMessage,
                user_id: currentUserId
            })
            setInputMessage('')
        }
    }

    const onMessageUpdateClicked = async () => {
        if (inputMessage && updateMessageId && updateActive) {
            await updateMessage({
                id: updateMessageId,
                content: inputMessage
            })
            setInputMessage('')
            setUpdateActive(false)
            setUpdateMessageId(null)
        }
    }

    const onCloseUpdateClicked = async () => {
        setInputMessage('')
        setUpdateActive(false)
        setUpdateMessageId(null)
    }

    let content = ''

    if (isChatLoading || isMessagesLoading || isAddMessageLoading || isUpdateMessageLoading || isDeleteMessageLoading) {
        content = <h1>Loading...</h1>
    } else if (isChatError || isAddMessageError || isUpdateMessageError || isDeleteMessageError) {

    } else {

        const messagesContent = messages?.data.slice().reverse().map(item =>
            <Message
                message={{
                    ...item,
                    me: currentUserId === item.user_id
                }}
                key={item.id}
                setUpdateActive={setUpdateActive}
                setUpdateMessageId={setUpdateMessageId}
                deleteMessage={deleteMessage}
                setInputMessage={setInputMessage} />) || []

        content = (
            <>
                <div style={{
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{
                        height: '15vh',
                        backgroundColor: '#1677ff',
                        borderBottomRightRadius: '0.7vw',
                        borderBottomLeftRadius: '0.7vw',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <Title level={1} style={{ color: 'white', textAlign: 'center' }}>
                            {chat.class_number} {chat.class_letter} | {chat.subject_name} сhat
                        </Title>
                        <Title level={4} style={{ margin: '0', color: 'white' }}>
                            Teacher: <NavLink to={`/teacher/${chat.teacher_id}`} className='chatLinkHover' style={{ color: 'silver' }}>
                                {chat.teacher_last_name} {chat.teacher_first_name} {chat.teacher_middle_name}
                            </NavLink>
                        </Title>

                    </div>
                    <div style={{
                        height: '75vh',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        overflowY: 'auto',
                    }}>
                        {messagesContent}
                    </div>
                    <div style={{
                        padding: '0.5vw',
                        backgroundColor: '#fafafa',
                        display: 'flex',
                        alignItems: 'center',
                        height: '10vh',
                        scrollbarColor: '#d4aa70 #e4e4e4',
                        scrollbarWidth: '100px'
                    }}>
                        <Input
                            value={inputMessage}
                            onChange={handlMessageinput}
                            placeholder='Write a message...'
                            style={{ backgroundColor: '#fafafa' }}
                        />
                        {
                            updateActive
                                ?
                                <>
                                    <Button onClick={onCloseUpdateClicked} type="primary" icon={<CloseOutlined />} style={{ margin: '1vh 1vw' }} />
                                    <Button onClick={onMessageUpdateClicked} type="primary" icon={<EditOutlined />} style={{ marginRight: '1vw' }} />
                                </>
                                :
                                <Button onClick={onMessageSendClicked} type="primary" icon={<SendOutlined />} style={{ margin: '1vh 1vw' }} />
                        }


                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            {content}
        </>
    )
}

export default Chat