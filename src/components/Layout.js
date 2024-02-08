import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials, logOut, setStudentClass } from "../store/slices/authSlice"
import { useLogoutMutation, useMeQuery } from "../store/endpoints/authEndpoints"
import { useGetClassMemberQuery } from '../store/endpoints/classMembersEndpoints'
import { Layout, Menu } from 'antd';
import {
    LogoutOutlined,
    HomeOutlined,
    BookOutlined,
    MessageOutlined,
    ScheduleOutlined,
    TeamOutlined,
    SolutionOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';
const { Sider, Content } = Layout;

const Container = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [userId, setUserId] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logout, { isLoading: logoutIsLoading, isError: isLogoutError }] = useLogoutMutation()

    const handleLogout = async (e) => {
        e.preventDefault()

        try {
            await logout()
            dispatch(logOut())
            navigate('/login')
        } catch (err) {
            console.log(err)
        }
    }

    const {
        data: me,
        isLoading: isMeLoading,
        isError: isMeError
    } = useMeQuery()

    const {
        data: classMember,
        isLoading: isClassMemberLoading,
        isError: isClassMemeberError
    } = useGetClassMemberQuery(userId)

    useEffect(() => {
        if (me?.id) {
            dispatch(setCredentials({ ...me }))
            setUserId(me.id)
        }
    }, [me])

    useEffect(() => {
        if (userId && me?.role_id === 3 && classMember?.id) {
            dispatch(setStudentClass({ ...classMember }))
        }
    }, [classMember])

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }

    let content = ''
    if (isMeLoading || logoutIsLoading || isClassMemberLoading) {
        content = <h1>Loading...</h1>
    } else if (isMeError || isLogoutError) {
        // console.log(classesError)
        // content = <h1>{scheduleError || classesError || schoolYearsError}</h1>
    } else {
        let profile
        if (me.role_id === 2) {
            profile = `/teacher/${me.id}`
        } else if (me.role_id === 3) {
            profile = `/student/${me.id}`
        }

        let items = [
            getItem(<NavLink to='/'><h1>Home</h1></NavLink>, '1', <HomeOutlined />),
        ]
        if (profile) {
            items.push(getItem(<NavLink to='/chats'>Chats</NavLink>, '2', <MessageOutlined />))
        }
        items.push(
            getItem(<NavLink to='/classes'>Classes</NavLink>, '3', <TeamOutlined />),
            getItem(<NavLink to='/gradebook'>Gradebook</NavLink>, '4', <BookOutlined />),
            getItem(<NavLink to='/schedule'>Schedule</NavLink>, '5', <ScheduleOutlined />),
            getItem(<NavLink to='/teachers'>Teachers</NavLink>, '6', <SolutionOutlined />))
        if (profile) {
            items.push(getItem(<NavLink to={profile}>Profile</NavLink>, '7', <UserOutlined />))
        } else {
            items.push(getItem(<NavLink to='manager'>Manager</NavLink>, '7', <SettingOutlined />))
        }
        items.push(
            getItem(<div style={{ color: 'red' }} onClick={handleLogout}>Logout</div>, '-', <LogoutOutlined style={{ color: 'red' }} />)
        )
        content = (
            <Layout
                style={{
                    minHeight: '100vh'
                }}
            >
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" mode="inline" items={items} />
                </Sider>
                <Content
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            width: '75vw'
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        )

        return content
    }
}

export default Container