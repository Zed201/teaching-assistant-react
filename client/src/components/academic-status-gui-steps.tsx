import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentList from './StudentList'; // adjust path if different

type Student = { name: string; cpf: string; email: string; };

function buildStudent(name: string, cpf: string, email = 'a@b.com'): Student {
  return { name, cpf, email };
}

function buildStatus(cpf: string, statusColor: 'green' | 'yellow' | 'red') {
  return {
    student: { cpf },
    statusColor
  };
}

describe('StudentList component (rendering border colors)', () => {
  test('renders green border for student with green status', () => {
    const students = [buildStudent('João da Silva', '11122233344')];
    const studentsStatus = [buildStatus('11122233344', 'green')];

    render(
      <StudentList
        students={students}
        studentsStatus={studentsStatus as any}
        onStudentDeleted={() => {}}
        onEditStudent={() => {}}
        onError={() => {}}
        loading={false}
      />
    );

    const nameCell = screen.getByText('João da Silva');
    const row = nameCell.closest('tr');
    expect(row).toBeTruthy();
    expect(row).toHaveStyle('border-left: 6px solid #22c55e');
  });

  test('renders yellow border for student with yellow status', () => {
    const students = [buildStudent('Carlos Souza', '22233344455')];
    const studentsStatus = [buildStatus('22233344455', 'yellow')];

    render(
      <StudentList
        students={students}
        studentsStatus={studentsStatus as any}
        onStudentDeleted={() => {}}
        onEditStudent={() => {}}
        onError={() => {}}
        loading={false}
      />
    );

    const nameCell = screen.getByText('Carlos Souza');
    const row = nameCell.closest('tr');
    expect(row).toBeTruthy();
    expect(row).toHaveStyle('border-left: 6px solid #eab308');
  });

  test('renders red border for student with red status', () => {
    const students = [buildStudent('Maria de Souza', '33344455566')];
    const studentsStatus = [buildStatus('33344455566', 'red')];

    render(
      <StudentList
        students={students}
        studentsStatus={studentsStatus as any}
        onStudentDeleted={() => {}}
        onEditStudent={() => {}}
        onError={() => {}}
        loading={false}
      />
    );

    const nameCell = screen.getByText('Maria de Souza');
    const row = nameCell.closest('tr');
    expect(row).toBeTruthy();
    expect(row).toHaveStyle('border-left: 6px solid #ef4444');
  });

  test('renders transparent border when studentsStatus is not provided', () => {
    const students = [buildStudent('No Status', '44455566677')];

    render(
      <StudentList
        students={students}
        onStudentDeleted={() => {}}
        onEditStudent={() => {}}
        onError={() => {}}
        loading={false}
      />
    );

    const nameCell = screen.getByText('No Status');
    const row = nameCell.closest('tr');
    expect(row).toBeTruthy();
    expect(row).toHaveStyle('border-left: 6px solid transparent');
  });

  test('shows loading state', () => {
    const students: any[] = [];
    const { getByText } = render(
      <StudentList
        students={students}
        studentsStatus={[] as any}
        onStudentDeleted={() => {}}
        onEditStudent={() => {}}
        onError={() => {}}
        loading={true}
      />
    );
    expect(getByText(/Loading students/i)).toBeInTheDocument();
  });
});