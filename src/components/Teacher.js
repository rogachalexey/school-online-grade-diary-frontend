import { Avatar, Card, Col, Divider, Row, Typography } from 'antd'
import { NavLink, useParams } from 'react-router-dom'
import { useGetTeacherQuery } from '../store/endpoints/teachersEndpoints'

const { Text, Title } = Typography


const Profile = () => {
    const { id } = useParams();
    const {
        data: user,
        isLoading
    } = useGetTeacherQuery(id)

    let content

    if (isLoading) {
        content = <h1>Loading...</h1>
    } else {
        const { 
            id, last_name, first_name, middle_name, birthday, description, phone_number, address, classes, auditoriums 
        } = user
        let teacher_classes = '-'
        let teacher_auditoriums = '-'
        if (classes[0].id) {
            teacher_classes = classes.map((item, index, array) => (
                <>
                    <NavLink to={`/class/${item.id}`}>{item.class_number} {item.class_letter}</NavLink>
                    {index < array.length - 1 ? <>, </> : null}
                </>
            ))
        }
        if (auditoriums[0].id) {
            teacher_auditoriums = auditoriums.map(item => item.auditorium_number).join(', ')
        }
        content = (
            <>
                <Title level={1} style={{ textAlign: 'center' }}>{first_name}'s profile</Title>
                <Divider />
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
                            <Title keyboard level={5}>Teacher</Title>
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
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Classes:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>{teacher_classes}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Auditoriums:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>{teacher_auditoriums}</Title>
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