import { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { SHOW_SUBMIT_NEW, type Role } from '../utils/auth';
import NavBar from './nav/NavBar';
import NavDropdown from './nav/NavDropdown';
import NavItem from './nav/NavItem';
import { useRouter } from 'next/router';

const PopulatedNavBar = () => {
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem('role') as Role | null;
    setRole(r);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (!role) return null;

  const showSubmit = SHOW_SUBMIT_NEW[role];

  return (
    <NavBar>
      <NavItem>SPEED</NavItem>
      <NavItem route="/" end>
        Home
      </NavItem>

      {role === 'submitter' && (
        <NavItem dropdown>
          Submitter <IoMdArrowDropdown />
          <NavDropdown>
            <NavItem route="/submitter/my-submissions">My Submissions</NavItem>
            <NavItem route="/submitter/submit-article">Submit Article</NavItem>
          </NavDropdown>
        </NavItem>
      )}

      {role === 'moderator' && (
        <NavItem dropdown>
          Moderator <IoMdArrowDropdown />
          <NavDropdown>
            <NavItem route="/moderator/pending-articles">Pending Articles</NavItem>
          </NavDropdown>
        </NavItem>
      )}

      {role === 'analyst' && (
        <NavItem dropdown>
          Analyst <IoMdArrowDropdown />
          <NavDropdown>
            <NavItem route="/analyst/approved-articles">Approved Articles</NavItem>
          </NavDropdown>
        </NavItem>
      )}

      {role === 'searcher' && (
        <NavItem dropdown>
          Searcher <IoMdArrowDropdown />
          <NavDropdown>
            <NavItem route="/searcher/search">Search Articles</NavItem>
          </NavDropdown>
        </NavItem>
      )}

      {role === 'administrator' && (
        <NavItem dropdown>
          Administrator <IoMdArrowDropdown />
          <NavDropdown>
            <NavItem route="/administrator/user">User Management</NavItem>
          </NavDropdown>
        </NavItem>
      )}

      <NavItem dropdown route="/articles">
        Articles <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem route="/articles">View articles</NavItem>
          {showSubmit && (
            <NavItem route="/articles/new">Submit new</NavItem>
          )}
        </NavDropdown>
      </NavItem>

      <NavItem dropdown>
        Account <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem onClick={handleLogout}>Logout</NavItem>
        </NavDropdown>
      </NavItem>
    </NavBar>
  );
};

export default PopulatedNavBar;