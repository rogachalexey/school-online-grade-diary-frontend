import { Divider, Typography } from 'antd'
import { useGetClassQuery } from '../store/endpoints/classesEndpoints'
import { useGetClassMembersQuery } from '../store/endpoints/classMembersEndpoints'
import { NavLink, useParams } from 'react-router-dom'
import { Table } from 'antd';

const { Title } = Typography

const columns = [
    {
        title: 'Number',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: 'Last name',
        dataIndex: 'member',
        key: 'member',
        render: (member) => <NavLink to={`/student/${member.id}`}>{member.last_name}</NavLink>,
        sorter: (a, b) => a.last_name.length - b.last_name.length,
        ellipsis: true
    },
    {
        title: 'First name',
        dataIndex: 'first_name',
        key: 'first_name',
        sorter: (a, b) => a.first_name.length - b.first_name.length,
        ellipsis: true
    },
    {
        title: 'Middle name',
        dataIndex: 'middle_name',
        key: 'middle_name',
        sorter: (a, b) => a.middle_name.length - b.middle_name.length,
        ellipsis: true
    }
]

const ClassMembers = () => {
    const { id } = useParams()

    const {
        data: classData,
        isLoading: isClassLoading,
        isSuccess: isClassSuccess
    } = useGetClassQuery(id)
    const {
        data: classMembersData,
        isLoading: isMembersLoading,
        isSuccess: isClassMembersSuccess
    } = useGetClassMembersQuery({ classId: id })

    let content = <h1>Loading...</h1>

    if (!(isClassLoading || isMembersLoading) && isClassSuccess && isClassMembersSuccess) {
        let curator = '-'
        let count = 1
        const tableData = classMembersData?.data.map(item => {
            return {
                number: count++,
                member: {
                    last_name: item.last_name,
                    id:item.student_id
                },
                ...item,  
                key: item.id
            }
        })
        if (classData?.teacher_id) {
            curator = <NavLink to={`/teacher/${classData.teacher_id}`}>
                {classData.teacher_last_name} {classData.teacher_first_name} {classData.teacher_middle_name}
            </NavLink>
            content = <>
                <Title style={{ textAlign: 'center' }}>{classData.class_number} {classData.class_letter}</Title>
                <Divider />
                <Title level={4} style={{ textAlign: 'center' }}>
                    Curator: {curator}
                </Title>
                <Table columns={columns} dataSource={tableData} pagination={false} style={{marginBottom:'5vh'}}/>
            </>
        }
    }

    return content
}

export default ClassMembers