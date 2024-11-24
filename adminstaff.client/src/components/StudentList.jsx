import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentModal from './StudentModal';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState('Registrar'); // Default role

    // Fetch all students
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get('https://localhost:7210/api/Students')
            .then(response => setStudents(response.data || []))
            .catch(error => console.error('Error fetching students:', error));
    };

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleAddNewStudent = () => {
        setSelectedStudent(null); // Open modal with empty fields
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        fetchStudents(); // Refresh student list after changes
    };

    const handleRoleChange = (e) => {
        setUserRole(e.target.value);
    };

    return (
        <div>
            <div>
                <label htmlFor="role">Role:</label>
            </div>
            {/* Role Dropdown */}
            <select value={userRole} onChange={handleRoleChange}>
                <option value="Registrar">Registrar</option>
                <option value="Admin">Admin</option>
            </select>

            {/* Add New Student Button */}
            <button onClick={handleAddNewStudent}>Add New Student</button>

            {/* Students Table */}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Nationality</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.ID} onClick={() => handleRowClick(student)}>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                            <td>{student.nationality}</td> {/* Ensure nationality is included */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Student Modal */}
            {isModalOpen && (
                <StudentModal
                    student={selectedStudent}
                    role={userRole}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default StudentList;