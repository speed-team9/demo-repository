import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch(`${apiBaseUrl}/api/users`);
      const data = await response.json();
      console.log('Users fetched:', data);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleManage = (username: string) => {
    router.push(`/administrator/users/${username}`);
  };

  const handleAddUser = () => {
    router.push('/administrator/users/new');
  };

  const handleEdit = (user: User) => {
    console.log('Opening edit modal for user:', user);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    console.log('Updating user role with username:', selectedUser.username, 'new role:', selectedUser.role);
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API;
      const response = await fetch(`${apiBaseUrl}/api/users/${selectedUser.username}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedUser.role }),
      });

      console.log('Update response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('User updated successfully:', result);
        setShowModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedUser(prev => prev ? { ...prev, role } : null);
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const thStyle = {
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: 'bold'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '12px'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '90%'
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>User Management</h1>
        <button
          onClick={handleAddUser}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add User
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Registration Time</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>{new Date(user.createdAt).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={buttonStyle}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Update User Role</h2>
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username:</label>
                <input
                  type="text"
                  value={selectedUser.username}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="searcher">Searcher</option>
                  <option value="submitter">Submitter</option>
                  <option value="moderator">Moderator</option>
                  <option value="analyst">Analyst</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={buttonStyle} type="submit">
                  Update Role
                </button>
                <button 
                  style={{ ...buttonStyle, backgroundColor: '#6c757d' }} 
                  type="button" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}