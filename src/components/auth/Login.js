import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { authenticate } from "../../store/slices/authSlice"
import { useAuthenticateMutation } from "../../store/endpoints/authEndpoints"
import { Button, Form, Input, Layout, Typography, Card } from 'antd';
import { Content } from "antd/es/layout/layout"

const { Title } = Typography

const Login = () => {
    const usernameRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const [login, { isLoading }] = useAuthenticateMutation()
    const dispatch = useDispatch()

    // useEffect(() => {
    //     usernameRef.current.focus()
    // }, [])

    // useEffect(() => {
    //     setErrMsg('')
    // }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const usernameData = await login({ username, password }).unwrap()
            dispatch(authenticate({ ...usernameData, username }))
            setUsername('')
            setPassword('')
            navigate('/')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
            // errRef.current.focus()
        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleusernameInput = (e) => setUsername(e.target.value)

    const handlePasswordInput = (e) => setPassword(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> : (
        <Layout>
            <Content
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <>
                    <Card
                        style={{
                            width: 500
                        }}
                    >
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Title
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                Login
                            </Title>
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input value={username} onChange={handleusernameInput} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                value="ф"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password value={username} onChange={handlePasswordInput} />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </>
            </Content>
        </Layout>
    )

    return content
}

export default Login