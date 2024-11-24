import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StudentModal = ({ student, role, onClose }) => {
    const [formData, setFormData] = useState({
        id: 0,
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        nationalityId: '',
    });
    const [familyMembers, setFamilyMembers] = useState([]);
    const [nationalities, setNationalities] = useState([]);
    const isDisabled = role === 'Admin' && student; // Disable fields for Admin if student exists

    // Fetch nationalities and initialize data
    useEffect(() => {
        axios.get('https://localhost:7210/api/Nationalities')
            .then((response) => setNationalities(response.data || []))
            .catch((error) => console.error('Error fetching nationalities:', error));

        if (student && student.id) {
            // Set form data for editing an existing student
            setFormData({
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                dateOfBirth: new Date(student.dateOfBirth),
                nationalityId: student.nationalityId || '',
            });

            // Fetch family members for editing
            axios.get(`https://localhost:7210/api/Students/${student.id}/FamilyMembers`)
                .then((response) => {
                    const formattedFamilyMembers = response.data.map((member) => ({
                        ...member,
                        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null, // Convert to Date object
                    }));
                    setFamilyMembers(formattedFamilyMembers);
                })
                .catch((error) => console.error('Error fetching family members:', error));
        }
    }, [student]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dateOfBirth: date });
    };

    const handleFamilyMemberChange = (index, field, value) => {
        const updatedMembers = [...familyMembers];
        updatedMembers[index][field] = value;
        setFamilyMembers(updatedMembers);
    };

    const handleAddFamilyMember = () => {
        setFamilyMembers([
            ...familyMembers,
            { id: 0, firstName: '', lastName: '', dateOfBirth: null, relationshipId: '', nationalityId: '' },
        ]);
    };

    const handleDeleteFamilyMember = (id, index) => {
        if (id) {
            axios.delete(`https://localhost:7210/api/FamilyMembers/${id}`)
                .then(() => {
                    const updatedMembers = [...familyMembers];
                    updatedMembers.splice(index, 1);
                    setFamilyMembers(updatedMembers);
                    alert('Family member deleted successfully.');
                })
                .catch((error) => console.error('Error deleting family member:', error));
        } else {
            const updatedMembers = [...familyMembers];
            updatedMembers.splice(index, 1);
            setFamilyMembers(updatedMembers);
        }
    };

    // Update student details only
    const handleUpdateStudentDetails = () => {
        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.nationalityId) {
            alert('Please fill in all required fields.');
            return;
        }

        const studentRequestBody = {
            id: formData.id || 0,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth.toISOString(), // Convert date to ISO format
            nationalityId: parseInt(formData.nationalityId, 10),
        };

        axios.put(`https://localhost:7210/api/Students/${student.id}`, studentRequestBody)
            .then(() => {
                alert('Student details updated successfully!');
                onClose();
            })
            .catch((error) => console.error('Error updating student details:', error));
    };

    // Update family members only
    const handleUpdateFamilyDetails = () => {
        if (!familyMembers.length) {
            alert('No family members to update.');
            return;
        }

        const familyPromises = familyMembers.map((member) => {
            // Ensure dateOfBirth is converted to a valid Date object or handle null
            const dateOfBirth = member.dateOfBirth
                ? new Date(member.dateOfBirth).toISOString()
                : null;

            if (member.id && member.id !== 0) {
                // Update existing family member
                return axios.put(`https://localhost:7210/api/FamilyMembers/${member.id}`, {
                    id: member.id,
                    firstName: member.firstName,
                    lastName: member.lastName,
                    dateOfBirth,
                    relationshipId: parseInt(member.relationshipId || '0', 10),
                    nationalityId: parseInt(member.nationalityId || '0', 10),
                });
            } else {
                // Add new family member
                return axios.post(`https://localhost:7210/api/Students/${formData.id}/FamilyMembers`, {
                    firstName: member.firstName,
                    lastName: member.lastName,
                    dateOfBirth,
                    relationshipId: parseInt(member.relationshipId || '0', 10),
                    nationalityId: parseInt(member.nationalityId || '0', 10),
                });
            }
        });

        Promise.all(familyPromises)
            .then(() => {
                alert('Family details updated successfully!');
            })
            .catch((error) => console.error('Error updating family details:', error));
    };
    // Function to delete a student
    const handleDeleteStudent = () => {
        if (!student || !student.id) {
            alert('Cannot delete a non-existent student.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            axios.delete(`https://localhost:7210/api/Students/${student.id}`)
                .then(() => {
                    alert('Student deleted successfully.');
                    onClose(); // Close modal after deletion
                })
                .catch((error) => console.error('Error deleting student:', error));
        }
    };

    return (
        <div className="modal">
            {/* Basic Information */}
            <h3>Basic Information</h3>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="First Name"
            />
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="Last Name"
            />
            <DatePicker
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                disabled={isDisabled}
                placeholderText="Select Date of Birth"
            />
            <select name="nationalityId" value={formData.nationalityId} onChange={handleChange} disabled={isDisabled}>
                <option value="">Select Nationality</option>
                {nationalities.map((nat) => (
                    <option key={nat.id} value={nat.id}>
                        {nat.name}
                    </option>
                ))}
            </select>

            {/* Family Information */}
            <h3>Family Information</h3>
            {familyMembers.map((member, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) => handleFamilyMemberChange(index, 'firstName', e.target.value)}
                        disabled={isDisabled}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) => handleFamilyMemberChange(index, 'lastName', e.target.value)}
                        disabled={isDisabled}
                        placeholder="Last Name"
                    />
                    <DatePicker
                        selected={member.dateOfBirth}
                        onChange={(date) => handleFamilyMemberChange(index, 'dateOfBirth', date)}
                        disabled={isDisabled}
                        placeholderText="Select Date of Birth"
                    />
                    <select
                        value={member.relationshipId}
                        onChange={(e) => handleFamilyMemberChange(index, 'relationshipId', e.target.value)}
                        disabled={isDisabled}
                    >
                        <option value="">Select Relationship</option>
                        <option value="1">Parent</option>
                        <option value="2">Sibling</option>
                        <option value="3">Spouse</option>
                    </select>
                    <select
                        value={member.nationalityId}
                        onChange={(e) => handleFamilyMemberChange(index, 'nationalityId', e.target.value)}
                        disabled={isDisabled}
                    >
                        <option value="">Select Nationality</option>
                        {nationalities.map((nat) => (
                            <option key={nat.id} value={nat.id}>
                                {nat.name}
                            </option>
                        ))}
                    </select>
                    {!isDisabled && (
                        <>
                            <button onClick={() => handleDeleteFamilyMember(member.id, index)}>Delete</button>
                        </>
                    )}
                </div>
            ))}
            {!isDisabled && (
                <>
                    <button onClick={handleAddFamilyMember}>Add Family Member</button>
                </>
            )}

            {/* Submit and Cancel Buttons */}
            {!isDisabled && (
                <>  
                                 
                    <button onClick={handleUpdateStudentDetails}>Update Student Details</button>
                    <button onClick={handleUpdateFamilyDetails}>Update Family Details</button>
                    <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteStudent}>Delete</button>    
                    <button onClick={() => onClose()}>Cancel</button>
                </>
            )}
        </div>
    );
};

StudentModal.propTypes = {
    student: PropTypes.object,
    role: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default StudentModal;