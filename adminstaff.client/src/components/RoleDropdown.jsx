
import PropTypes from 'prop-types';

const RoleDropdown = ({ role, setRole }) => {
    return (
        <div>
            <label htmlFor="role">Role:</label>
            <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="admin">Admin</option>
                <option value="registrar">Registrar</option>
            </select>
        </div>
    );
};

// Add PropTypes validation
RoleDropdown.propTypes = {
    role: PropTypes.string.isRequired, // Ensure 'role' is a required string
    setRole: PropTypes.func.isRequired, // Ensure 'setRole' is a required function
};

export default RoleDropdown;