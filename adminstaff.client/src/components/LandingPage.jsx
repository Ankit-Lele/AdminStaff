import  { useState, useEffect } from 'react';
import { Table, Button, Dropdown } from 'react-bootstrap';
import StudentModal from './StudentModal.jsx';

const API_BASE_URL = 'https://localhost:7210/api';

const LandingPage = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState('Registrar');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Students`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleAddNewStudent = () => {
        setSelectedStudent(null);
        setShowModal(true);
    };

    const handleRoleChange = (role) => {
        setUserRole(role);
    };

    return (
        <div>
            <Dropdown onSelect={handleRoleChange}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Role: {userRole}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
                    <Dropdown.Item eventKey="Registrar">Registrar</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Button onClick={handleAddNewStudent}>Add New Student</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id} onClick={() => handleStudentClick(student)}>
                            <td>{student.id}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <StudentModal
                show={showModal}
                onHide={() => setShowModal(false)}
                student={selectedStudent}
                userRole={userRole}
                onStudentUpdate={fetchStudents}
            />
        </div>
    );
};

export default LandingPage;