import { Avatar, Card, Col, Divider, Row, Typography } from 'antd'
import { NavLink, useParams } from 'react-router-dom'
import { useGetStudentQuery } from '../store/endpoints/studentsEndpoints'

const { Text, Title } = Typography


const Profile = () => {
    const { id } = useParams();
    const {
        data: student,
        isLoading,
        isSuccess
    } = useGetStudentQuery(id)

    let content = <h1>Loading...</h1>

    if (isSuccess) {
        const { id, last_name, first_name, middle_name, birthday, description, phone_number, address, student_class } = student
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
                            <Title keyboard level={5}>student</Title>
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
                            <Title level={4}>Class:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>
                                <NavLink to={`/class/${student_class.id}`}>
                                    {student_class.class_number} {student_class.class_letter}
                                </NavLink>
                            </Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} />
                        <Col span={4}>
                            <Title level={4}>Curator:</Title>
                        </Col>
                        <Col span={16}>
                            <Title type="secondary" level={5}>
                                <NavLink to={`/teacher/${student_class.teacher_id}`}>
                                    {student_class.teacher_last_name} {student_class.teacher_first_name} {student_class.teacher_middle_name}
                                </NavLink>
                            </Title>
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