import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


const StudentModal = ({ role, selectedStudent, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationalityId: '',
    }); // Basic student details
    const [familyMembers, setFamilyMembers] = useState([]); // Family members of the selected student
    const [nationalities, setNationalities] = useState([]); // List of nationalities

    // Fetch nationalities when modal opens
    useEffect(() => {
        axios
            .get('https://localhost:7210/api/Nationalities')
            .then((response) => setNationalities(response.data || []))
            .catch((error) => console.error('Error fetching nationalities:', error));
    }, []);

    // Prefill form data and fetch family members when a student is selected
    useEffect(() => {
        if (selectedStudent?.id) {
            setFormData(selectedStudent);

            axios
                .get(`https://localhost:7210/api/Students/${selectedStudent.id}/FamilyMembers`)
                .then((response) => setFamilyMembers(response.data || []))
                .catch((error) => console.error('Error fetching family members:', error));
        } else {
            // Reset form and family members for adding a new student
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                nationalityId: '',
            });
            setFamilyMembers([]);
        }
    }, [selectedStudent]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddFamilyMember = () => {
        setFamilyMembers([
            ...familyMembers,
            { id: Date.now(), firstName: '', lastName: '', relationshipId: '', nationalityId: '', isNew: true },
        ]);
    };

    const handleFamilyMemberChange = (index, field, value) => {
        const updatedMembers = [...familyMembers];
        updatedMembers[index][field] = value;
        setFamilyMembers(updatedMembers);
    };

    const handleDeleteFamilyMember = (index) => {
        const memberToDelete = familyMembers[index];
        if (!memberToDelete.isNew) {
            axios
                .delete(`https://localhost:7210/api/FamilyMembers/${memberToDelete.id}`)
                .then(() => alert('Family member deleted successfully'))
                .catch((error) => console.error('Error deleting family member:', error));
        }
        const updatedMembers = [...familyMembers];
        updatedMembers.splice(index, 1);
        setFamilyMembers(updatedMembers);
    };

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.nationalityId) {
            alert('Please fill in all required fields.');
            return;
        }

        if (selectedStudent?.id) {
            // Update existing student
            axios
                .put(`https://localhost:7210/api/Students/${selectedStudent.id}`, formData)
                .then(() => alert('Student updated successfully'))
                .catch((error) => console.error('Error updating student:', error));
        } else {
            // Add new student
            axios
                .post('https://localhost:7210/api/Students', formData)
                .then(() => alert('Student added successfully'))
                .catch((error) => console.error('Error adding student:', error));
        }

        onClose(); // Close modal after submission
    };

    return (
        <div className="modal">
            <h2>{selectedStudent?.id ? 'Edit Student' : 'Add New Student'}</h2>

            {/* Student Details Form */}
            <form>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    disabled={role === 'admin' && !!selectedStudent?.id} // Admin cannot edit existing names
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    disabled={role === 'admin' && !!selectedStudent?.id} // Admin cannot edit existing names
                />
                <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    disabled={role === 'admin' && !!selectedStudent?.id} // Admin cannot edit existing names
                />

                <select
                    name="nationalityId"
                    value={formData.nationalityId}
                    onChange={handleChange}
                    disabled={role === 'admin' && !!selectedStudent?.id} // Admin cannot edit existing names
                >
                    <option value="">Select Nationality</option>
                    {nationalities.map((nationality) => (
                        <option key={nationality.id} value={nationality.id}>
                            {nationality.name}
                        </option>
                    ))}
                </select>

                {/* Family Members Section */}
                {selectedStudent?.id && (
                    <>
                        <h3>Family Members</h3>
                        {familyMembers.map((member, index) => (
                            <div key={member.id}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={member.firstName}
                                    onChange={(e) =>
                                        handleFamilyMemberChange(index, 'firstName', e.target.value)
                                    }
                                    disabled={role === 'admin'}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={member.lastName}
                                    onChange={(e) =>
                                        handleFamilyMemberChange(index, 'lastName', e.target.value)
                                    }
                                    disabled={role === 'admin'}
                                />
                                <select
                                    value={member.relationshipId}
                                    onChange={(e) =>
                                        handleFamilyMemberChange(index, 'relationshipId', e.target.value)
                                    }
                                    disabled={role === 'admin'}
                                >
                                    <option value="">Select Relationship</option>
                                    <option value="1">Parent</option>
                                    <option value="2">Sibling</option>
                                    <option value="3">Spouse</option>
                                </select>
                                <select
                                    value={member.nationalityId || ''}
                                    onChange={(e) =>
                                        handleFamilyMemberChange(index, 'nationalityId', e.target.value)
                                    }
                                    disabled={role === 'admin'}
                                >
                                    <option value="">Select Nationality</option>
                                    {nationalities.map((nationality) => (
                                        <option key={nationality.id} value={nationality.id}>
                                            {nationality.name}
                                        </option>
                                    ))}
                                </select>
                                {role === 'registrar' && (
                                    <button type="button" onClick={() => handleDeleteFamilyMember(index)}>
                                        Delete Family Member
                                    </button>
                                )}
                            </div>
                        ))}
                        {role === 'registrar' && (
                            <>
                                <button type="button" onClick={handleAddFamilyMember}>
                                    Add Family Member
                                </button>
                            </>
                        )}
                    </>
                )}

                {/* Submit Button */}
                {(role === 'registrar' || !selectedStudent?.id) && (
                    <button type="button" onClick={handleSubmit}>
                        {selectedStudent?.id ? 'Update Student' : 'Add Student'}
                    </button>
                )}

                {/* Close Modal */}
                <button type="button" onClick={onClose}>
                    Close Modal
                </button>
            </form>
        </div>
    );
};

// PropTypes validation
StudentModal.propTypes = {
    role: PropTypes.string.isRequired,
    selectedStudent: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default StudentModal;