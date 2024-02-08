import { Divider, Table, Typography, Tabs, Select, Button, Input, DatePicker } from 'antd'
import { useGetClassesQuery } from '../store/endpoints/classesEndpoints'
import { useGetTeachersQuery } from '../store/endpoints/teachersEndpoints'
import { useGetStudentsQuery } from '../store/endpoints/studentsEndpoints'
import { useEditClassMemberMutation, useAddNewClassMemberMutation } from '../store/endpoints/classMembersEndpoints'
import { useDeleteUserMutation, useEditUserMutation } from '../store/endpoints/usersEndpoints'
import { useRegisterMutation } from '../store/endpoints/authEndpoints'
import { useEffect, useState } from 'react'
import { selectCurrentUserRoleId } from '../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Manager = () => {

    const navigate = useNavigate()
    const currentRoleId = useSelector(selectCurrentUserRoleId)

    const [activeClass, setActiveClass] = useState(1)
    const [currentUser, setCurrentUser] = useState(null)

    const [usernameInput, setUsernameInput] = useState('')
    const [firstNameInput, setFirstNameInput] = useState('')
    const [lastNameInput, setLastNameInput] = useState('')
    const [middleNameInput, setMiddleNameInput] = useState('')
    const [passInput, setPassInput] = useState('')
    const [repassInput, setRepassInput] = useState('')
    const [roleInput, setRoleInput] = useState('')
    const [genderInput, setGenderInput] = useState('')
    const [birthdayInput, setBirthdayInput] = useState('2000-01-01')
    const [phoneInput, setPhoneInput] = useState('')
    const [addressInput, setAddressInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')

    const [classInput, setClassInput] = useState(1)

    const {
        data: teachers,
        isLoading: isTeachersLoading,
        isError: isTeachersError,
        error: teachersError
    } = useGetTeachersQuery({})

    const {
        data: students,
        isLoading: isStudentsLoading,
        isError: isStudentsError,
        error: studentsError
    } = useGetStudentsQuery({ classId: activeClass })

    const {
        data: classes,
        isLoading: isClassesLoading,
        isError: isClassesError,
        error: classesError
    } = useGetClassesQuery({})

    const [addUser, {
        isLoading: isAddNewUserLoading,
        isError: isAddNewUserError
    }] = useRegisterMutation()

    const [updateUser, {
        isLoading: isUpdateUserLoading,
        isError: isUpdateUserError
    }] = useEditUserMutation()

    const [deleteUser, {
        isLoading: isDeleteUserLoading,
        isError: isDeleteUserError
    }] = useDeleteUserMutation()

    const [addClassMember, {
        isLoading: isAddNewClassMemberLoading,
        isError: isAddNewClassMemberError
    }] = useAddNewClassMemberMutation()

    const [updateClassMember, {
        isLoading: isUpdateClassMemberLoading,
        isError: isUpdateClassMemberError
    }] = useEditClassMemberMutation()

    let content = ''

    useEffect(() => {
        if (currentRoleId && currentRoleId !== 1)
            navigate('/')
    })

    const handlActiveClass = (value) => setActiveClass(value)

    function renderTableActions(user) {
        function editUser() {
            setCurrentUser(user)
            setUsernameInput(user.username)
            setFirstNameInput(user.first_name)
            setLastNameInput(user.last_name)
            setMiddleNameInput(user.middle_name)
            setRoleInput(user.role_id)
            setGenderInput(user.sex)
            setBirthdayInput(user.birthday)
            setPhoneInput(user.phone_number)
            setAddressInput(user.address)
            setDescriptionInput(user.description)
            if (user.role_id === 3) {
                setClassInput(activeClass)
            }
        }
        function deleteCurrentUser() {
            deleteUser(user.id)
            cancelUpdate()
        }
        return <div>
            <Button type='text' onClick={editUser} icon={<EditOutlined />} />
            <Button type='text' onClick={deleteCurrentUser} icon={<DeleteOutlined />} />
        </div>
    }

    function cancelUpdate() {
        setCurrentUser(null)
        setUsernameInput(null)
        setFirstNameInput(null)
        setLastNameInput(null)
        setMiddleNameInput(null)
        setRoleInput(null)
        setGenderInput(null)
        setPhoneInput(null)
        setAddressInput(null)
        setDescriptionInput(null)
    }

    function doneUpdate() {
        updateUser({
            id: currentUser.id,
            username: usernameInput,
            first_name: firstNameInput,
            last_name: lastNameInput,
            middle_name: middleNameInput,
            role_id: roleInput,
            sex: genderInput,
            birthday: birthdayInput,
            phone_number: phoneInput,
            address: addressInput,
            description: descriptionInput
        })
        if (currentUser.role_id === 3) {
            updateClassMember({
                id: currentUser.id,
                class_id: classInput
            })
        }
        cancelUpdate(null)
    }

    function registerUser() {
        if (passInput === repassInput) {
            addUser({
                username: usernameInput,
                first_name: firstNameInput,
                last_name: lastNameInput,
                middle_name: middleNameInput,
                password: passInput,
                role_id: roleInput,
                sex: genderInput,
                birthday: birthdayInput,
                phone_number: phoneInput,
                address: addressInput,
                description: descriptionInput
            })
            // if (currentUser.role_id === 3) {
            //     addClassMember({
            //         student_id: currentUser.id,
            //         class_id: classInput
            //     })
            // }
            cancelUpdate(null)
        }

    }

    const columns = [
        {
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
        },
        {
            title: 'Last name',
            dataIndex: 'last_name',
            key: 'last_name',
            align: 'center',
            sorter: (a, b) => a.last_name.length - b.last_name.length,
            ellipsis: true
        },
        {
            title: 'First name',
            dataIndex: 'first_name',
            key: 'first_name',
            align: 'center',
            sorter: (a, b) => a.first_name.length - b.first_name.length,
            ellipsis: true
        },
        {
            title: 'Middle name',
            dataIndex: 'middle_name',
            key: 'middle_name',
            align: 'center',
            sorter: (a, b) => a.middle_name.length - b.middle_name.length,
            ellipsis: true
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: '7vw',
            render: (user) => renderTableActions(user)
        }
    ]

    const handlUsernameInput = (e) => setUsernameInput(e.target.value)
    const handlFirstNameInput = (e) => setFirstNameInput(e.target.value)
    const handlLastNameInput = (e) => setLastNameInput(e.target.value)
    const handlMiddleNameInput = (e) => setMiddleNameInput(e.target.value)
    const handlPassInput = (e) => setPassInput(e.target.value)
    const handlRepassInput = (e) => setRepassInput(e.target.value)
    const handlRoleInput = (value) => setRoleInput(value)
    const handlGenderInput = (value) => setGenderInput(value)
    const handlClassInput = (value) => setClassInput(value)
    const handlBirthdayInput = (date) => {
        const formattedDate = date ? date.format('YYYY-MM-DD') : null
        setBirthdayInput(formattedDate)
    }
    const handlPhoneInput = (e) => setPhoneInput(e.target.value)
    const handlAddressInput = (e) => setAddressInput(e.target.value)
    const handlDescriptionInput = (e) => setDescriptionInput(e.target.value)

    if (
        isTeachersLoading || isClassesLoading || isStudentsLoading ||
        isAddNewUserLoading || isDeleteUserLoading || isUpdateUserLoading ||
        isAddNewClassMemberLoading || isUpdateClassMemberLoading) {
        content = <h1>Loading...</h1>
    } else if (
        isTeachersError || isClassesError || isStudentsError ||
        isAddNewUserError || isDeleteUserError || isUpdateUserError ||
        isAddNewClassMemberError || isUpdateClassMemberError) {

    } else {
        let count = 1
        const teachersData = teachers.data.map(item => ({ ...item, number: count++ }))
        count = 1
        const studentsData = students.data.map(item => ({ ...item, number: count++ }))

        const classesItems = classes.data.map(item => ({
            value: item.id,
            label: `${item.class_number} ${item.class_letter}`
        }))
        classesItems.push({
            value: null,
            label: 'none'
        })

        const rolesItems = [
            {
                value: 2,
                label: 'Teacher'
            },
            {
                value: 3,
                label: 'Student'
            }
        ]

        const genderItems = [
            {
                value: 'Male',
                label: 'Male'
            },
            {
                value: 'Female',
                label: 'Female'
            }
        ]

        const tabs = [
            {
                key: '1',
                label: 'Students',
                children: <>
                    <Select
                        showSearch
                        style={{
                            width: 150,
                            marginBottom: '2vh'
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
                    <Table columns={columns} dataSource={studentsData} scroll={{ y: 300 }} pagination={false} />
                </>
            },
            {
                key: '2',
                label: 'Teachers',
                children: <>
                    <Table columns={columns} dataSource={teachersData} scroll={{ y: 300 }} pagination={false} />
                </>
            }
        ]

        const inputStyle = { display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '1vh' }
        const inputWidth = { width: '20vw' }

        const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY', 'YYYY-MM-DD'];

        content = <>
            < Tabs items={tabs} />
            <Divider />
            {currentUser
                ? <Title style={{ textAlign: 'center' }}>Update {currentUser.username}</Title>
                : <Title style={{ textAlign: 'center' }}>Add new user</Title>}
            <Divider />

            <div style={{ width: '55%', margin: '0 auto 5vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={inputStyle}>
                    <div style={inputWidth}>
                        <Text>username</Text>
                        <Input required value={usernameInput} onChange={handlUsernameInput} />
                    </div>
                    <div style={inputWidth}>
                        <Text>last name</Text>
                        <Input value={lastNameInput} onChange={handlLastNameInput} />
                    </div>
                </div>
                <div style={inputStyle}>
                    <div style={inputWidth}>
                        <Text>first name</Text>
                        <Input value={firstNameInput} onChange={handlFirstNameInput} />
                    </div>
                    <div style={inputWidth}>
                        <Text>middle name</Text>
                        <Input value={middleNameInput} onChange={handlMiddleNameInput} />
                    </div>
                </div>
                {currentUser ? null
                    : <div style={inputStyle}>
                        <div style={inputWidth}>
                            <Text>new password</Text>
                            <Input type='password' value={passInput} onChange={handlPassInput} />
                        </div>
                        <div style={inputWidth}>
                            <Text>repeat password</Text>
                            <Input type='password' value={repassInput} onChange={handlRepassInput} />
                        </div>
                    </div>}
                <div style={inputStyle}>
                    <div>
                        <Text>role</Text><br />
                        <Select options={rolesItems} value={roleInput} style={{ width: '7vw' }} onSelect={handlRoleInput} />
                    </div>
                    <div>
                        <Text>gender</Text><br />
                        <Select options={genderItems} value={genderInput} style={{ width: '6vw' }} onSelect={handlGenderInput} />
                    </div>
                    <div>
                        <Text>birthday</Text><br />
                        <DatePicker format={dateFormatList} value={dayjs(birthdayInput, dateFormatList[4])} onChange={handlBirthdayInput} />
                    </div>
                    <div>
                        <Text>phone number</Text>
                        <Input value={phoneInput} onChange={handlPhoneInput} />
                    </div>
                </div>

                <div style={inputStyle}>
                    {roleInput === 3
                        ? <div style={{ marginRight: '1vw' }}>
                            <Text>class</Text><br />
                            <Select options={classesItems} style={{ width: '6vw' }} onSelect={handlClassInput} value={classInput} />
                        </div>
                        : null}
                    <div style={{ width: '100%' }}>
                        <Text>address</Text>
                        <Input value={addressInput} onChange={handlAddressInput} />
                    </div>
                </div>
                <div style={{ width: '100%' }}>
                    <Text>description</Text>
                    <Input value={descriptionInput} onChange={handlDescriptionInput} />
                </div>
                <div style={{ marginTop: '3vh' }}>
                    {currentUser
                        ? <>
                            <Button type='primary' onClick={cancelUpdate} style={{ marginRight: '1vw' }}>Cancel</Button>
                            <Button type='primary' onClick={doneUpdate}>Edit</Button>
                        </>
                        : <>
                            <Button type='primary' onClick={registerUser}>Create</Button>
                        </>}
                </div>
            </div>
        </>
    }

    return <>
        <Title style={{ textAlign: 'center' }}>Manager</Title>
        <Divider />
        {content}
    </>
}

export default Manager