import { Student } from './Student';
import { Evaluation } from './Evaluation';
import * as fs from 'fs';
import * as path from 'path';

export class StudentSet {
  private students: Student[] = [];
  private dataFile: string;

  constructor(dataFile: string = 'students.json') {
    this.dataFile = path.resolve(dataFile);
    this.ensureDataDirectory();
    this.loadFromFile();
  }

  // Ensure the data directory exists
  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  // Add a new student
  addStudent(student: Student): Student {
    // Check if CPF already exists (student.cpf is already clean)
    if (this.findStudentByCPF(student.cpf)) {
      throw new Error('Student with this CPF already exists');
    }

    this.students.push(student);
    this.triggerSave(); // Save to file after adding
    return student;
  }

  // Remove student by CPF (expects clean CPF)
  removeStudent(cpf: string): boolean {
    const index = this.students.findIndex(s => s.cpf === cpf);
    
    if (index === -1) {
      return false;
    }

    this.students.splice(index, 1);
    this.triggerSave(); // Save to file after removing
    return true;
  }

  // Update student by CPF
  updateStudent(updatedStudent: Student): Student {
    // updatedStudent.cpf is already clean
    const existingStudent = this.findStudentByCPF(updatedStudent.cpf);
    
    if (!existingStudent) {
      throw new Error('Student not found');
    }

    // Update basic fields
    existingStudent.name = updatedStudent.name;
    existingStudent.email = updatedStudent.email;
    
        // Update evaluations by modifying existing objects and adding new ones as needed
    updatedStudent.evaluations.forEach(updatedEval => {
      // Find existing evaluation for this goal
      const existingEval = existingStudent.evaluations.find(evaluation => evaluation.getGoal() === updatedEval.getGoal());
      
      if (existingEval) {
        // Update the existing evaluation object's grade (preserving object identity)
        existingEval.setGrade(updatedEval.getGrade());
      } else {
        // Add new evaluation object for goals that don't exist yet
        existingStudent.evaluations.push(updatedEval);
      }
    });
    
    // Remove evaluations that are no longer in the updated list
    for (let i = existingStudent.evaluations.length - 1; i >= 0; i--) {
      const existingGoal = existingStudent.evaluations[i].getGoal();
      const stillExists = updatedStudent.evaluations.some(updatedEval => updatedEval.getGoal() === existingGoal);
      
      if (!stillExists) {
        existingStudent.evaluations.splice(i, 1);
      }
    }
    
    // CPF should not be updated as it's the identifier
    
    this.triggerSave(); // Save to file after updating
    return existingStudent;
  }

  // Find student by CPF (expects clean CPF)
  findStudentByCPF(cpf: string): Student | undefined {
    return this.students.find(s => s.cpf === cpf);
  }

  // Get all students
  getAllStudents(): Student[] {
    return [...this.students]; // Return a copy to prevent external modification
  }

  // Get students count
  getCount(): number {
    return this.students.length;
  }

  // Save students to JSON file
  private saveToFile(): void {
    try {
      const data = {
        students: this.students.map(student => ({
          name: student.name,
          cpf: student.getCPF(),
          email: student.email,
          evaluations: student.evaluations.map(evaluation => evaluation.toJSON())
        }))
      };
      
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving students to file:', error);
    }
  }

  // Load students from JSON file
  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.dataFile)) {
        const fileContent = fs.readFileSync(this.dataFile, 'utf8');
        const data = JSON.parse(fileContent);
        
        if (data.students && Array.isArray(data.students)) {
          this.students = data.students.map((studentData: any) => {
            const evaluations = studentData.evaluations
              ? studentData.evaluations.map((evalData: any) => 
                  Evaluation.fromJSON(evalData)
                )
              : [];
            
            return new Student(
              studentData.name,
              studentData.cpf,
              studentData.email,
              evaluations
            );
          });
        }
      }
    } catch (error) {
      console.error('Error loading students from file:', error);
      this.students = []; // Start with empty array if loading fails
    }
  }

  // Trigger save after any modification
  private triggerSave(): void {
    // Use setImmediate to save asynchronously after the current operation
    setImmediate(() => {
      this.saveToFile();
    });
  }
}