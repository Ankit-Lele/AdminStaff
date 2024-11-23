import  { useState } from 'react';
import Navbar from './components/Navbar';
import RoleDropdown from './components/RoleDropdown';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';

const App = () => {
    const [role, setRole] = useState('admin');
    const [selectedStudent, setSelectedStudent] = useState(null);

    return (
        <>
            <Navbar />
            <RoleDropdown role={role} setRole={setRole} />
            <button onClick={() => setSelectedStudent({})}>Add New Student</button>
            <StudentList onStudentClick={(student) => setSelectedStudent(student)} />
            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    role={role}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </>
    );
};

export default App;