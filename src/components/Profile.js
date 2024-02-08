import { Avatar, Card, Col, Divider, Row, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { useGetUserQuery } from '../store/endpoints/usersEndpoints'

const { Text, Title } = Typography


const Profile = () => {
    const { id } = useParams();
    const {
        data: user,
        isLoading
    } = useGetUserQuery(id)

    let content

    if (isLoading) {
        content = <h1>Loading...</h1>
    } else {
        const { id, username, last_name, first_name, middle_name, birthday, role_id, description, phone_number, address } = user
        const userRole = role_id === 1 ? 'manager' : role_id === 2 ? 'teacher' : 'student'
        content = (
            <>
                <Title level={1} style={{textAlign:'center'}}>{first_name}'s profile</Title>
                <Divider/>
                <Card
                    key={id}
                >
                    <Row>
                        <Col span={4}>
                            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                                style={{
                                    height: '7vw',
                                    width: '7vw'
                                }}
                            />
                        </Col>
                        <Col span={20}>
                            <h2>{`${last_name} ${first_name} ${middle_name}`}</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Description:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>{description}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Role:</Title>
                        </Col>
                        <Col span={16}>
                            <Title keyboard level={5}>{userRole}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Birthday:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>{birthday}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Phone number:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>{phone_number}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Address:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>{address}</Title>
                        </Col>
                    </Row>
                </Card>
            </>
        )
    }
    return (
        <>
            {content}
        </>
    )
}

export default Profile