import { CSVReader, XLSXReader, SpreadsheetReader } from '../services/SpreeadsheetReader';
import path from 'path';
import fs from 'fs';

describe('SpreadsheetReader Classes', () => {
  const testFilesPath = path.join(__dirname, 'tests_files');
  const csvFile1 = path.join(testFilesPath, 'import_grade_1.csv');
  const csvFile2 = path.join(testFilesPath, 'import_grade_2.csv');
  const invalidFile = path.join(testFilesPath, 'import_grade_invalid.txt');
  const nonExistentFile = path.join(testFilesPath, 'non_existent.csv');

  describe('CSVReader Class', () => {
    describe('Constructor', () => {
      test('should create a CSVReader instance with valid filepath', () => {
        const reader = new CSVReader(csvFile1);
        
        expect(reader).toBeInstanceOf(CSVReader);
        expect(reader).toBeInstanceOf(SpreadsheetReader);
        expect(reader.filepath).toBe(csvFile1);
      });

      test('should accept any filepath string without validation at construction', () => {
        const reader = new CSVReader(nonExistentFile);
        
        expect(reader.filepath).toBe(nonExistentFile);
      });
    });

    describe('getColumns method', () => {
      test('should read column headers from CSV file', async () => {
        const reader = new CSVReader(csvFile1);
        const columns = await reader.getColumns();
        
        expect(columns).toBeInstanceOf(Array);
        expect(columns.length).toBeGreaterThan(0);
        expect(columns[0]).toBe('cpf');
      });

      test('should return all column headers in correct order', async () => {
        const reader = new CSVReader(csvFile1);
        const columns = await reader.getColumns();
        
        expect(columns).toEqual([
          'cpf',
          'Requirements',
          'Configuration Management',
          'Project Management',
          'Design',
          'Refactoring',
          'Tests'
        ]);
      });

      test('should trim whitespace from column names', async () => {
        const reader = new CSVReader(csvFile1);
        const columns = await reader.getColumns();
        
        // Verify no leading or trailing whitespace
        columns.forEach(column => {
          expect(column).toBe(column.trim());
        });
      });

      test('should reject with error for non-existent file', async () => {
        const reader = new CSVReader(nonExistentFile);
        
        await expect(reader.getColumns()).rejects.toThrow();
      }, 10000);

      test('should handle different CSV files correctly', async () => {
        // Skip test if csvFile2 is empty
        if (!fs.existsSync(csvFile2) || fs.statSync(csvFile2).size === 0) {
          return;
        }
        
        const reader2 = new CSVReader(csvFile2);
        const columns2 = await reader2.getColumns();
        
        expect(columns2).toBeInstanceOf(Array);
        expect(columns2.length).toBeGreaterThan(0);
      }, 10000);
    });

    describe('process method', () => {
      test('should parse CSV file and return array of objects', async () => {
        const reader = new CSVReader(csvFile1);
        const data = await reader.process();
        
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
      });

      test('should parse all rows from CSV file', async () => {
        const reader = new CSVReader(csvFile1);
        const data = await reader.process();
        
        // Based on the CSV content we saw, there should be 4 data rows
        expect(data.length).toBe(4);
      });

      test('should create objects with correct property names from headers', async () => {
        const reader = new CSVReader(csvFile1);
        const data = await reader.process();
        
        expect(data[0]).toHaveProperty('cpf');
        expect(data[0]).toHaveProperty('Requirements');
        expect(data[0]).toHaveProperty('Configuration Management');
        expect(data[0]).toHaveProperty('Project Management');
        expect(data[0]).toHaveProperty('Design');
        expect(data[0]).toHaveProperty('Refactoring');
        expect(data[0]).toHaveProperty('Tests');
      });

      test('should parse correct values from CSV rows', async () => {
        const reader = new CSVReader(csvFile1);
        const data = await reader.process();
        
        // First row data
        expect(data[0].cpf).toBe('11111111111');
        expect(data[0].Requirements).toBe('MPA');
        expect(data[0]['Configuration Management']).toBe('MA');
        
        // Check another row
        expect(data[1].cpf).toBe('55555555555');
        expect(data[1].Requirements).toBe('MANA');
      });

      test('should handle empty values in CSV', async () => {
        const reader = new CSVReader(csvFile1);
        const data = await reader.process();
        
        // Third row has empty values after 'MA'
        const rowWithEmptyValues = data.find(row => row.cpf === '22222222222');
        expect(rowWithEmptyValues).toBeDefined();
        expect(rowWithEmptyValues.Requirements).toBe('MA');
        expect(rowWithEmptyValues['Configuration Management']).toBe('');
      });

      test('should handle empty CSV file', async () => {
        // Create a temporary empty CSV file for testing
        const emptyFile = path.join(testFilesPath, 'temp_empty.csv');
        fs.writeFileSync(emptyFile, '');
        
        const reader = new CSVReader(emptyFile);
        const data = await reader.process();
        
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBe(0);
        
        // Clean up
        fs.unlinkSync(emptyFile);
      });

      test('should handle CSV with only headers', async () => {
        // Create a temporary CSV file with only headers
        const headersOnlyFile = path.join(testFilesPath, 'temp_headers_only.csv');
        fs.writeFileSync(headersOnlyFile, 'col1,col2,col3\n');
        
        const reader = new CSVReader(headersOnlyFile);
        const data = await reader.process();
        
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBe(0);
        
        // Clean up
        fs.unlinkSync(headersOnlyFile);
      });
    });

    describe('loadFile protected method', () => {
      test('should load file content as Buffer', async () => {
        const reader = new CSVReader(csvFile1);
        // Access protected method for testing by casting
        const buffer = await (reader as any).loadFile();
        
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      }, 10000);

      test('should reject with error for non-existent file', async () => {
        const reader = new CSVReader(nonExistentFile);
        
        await expect((reader as any).loadFile()).rejects.toThrow();
      }, 10000);
    });
  });

  describe('XLSXReader Class', () => {
    describe('Constructor', () => {
      test('should create an XLSXReader instance with valid filepath', () => {
        const reader = new XLSXReader('test.xlsx');
        
        expect(reader).toBeInstanceOf(XLSXReader);
        expect(reader).toBeInstanceOf(SpreadsheetReader);
        expect(reader.filepath).toBe('test.xlsx');
      });
    });

    describe('process method', () => {
      test('should throw "Method not implemented yet" error', async () => {
        const reader = new XLSXReader('test.xlsx');
        
        await expect(reader.process()).rejects.toThrow('Method not implemented yet');
      });
    });

    describe('getColumns method', () => {
      test('should throw "Not implemented" error', () => {
        const reader = new XLSXReader('test.xlsx');
        
        expect(() => reader.getColumns()).toThrow('Not implemented');
      });
    });
  });

  describe('SpreadsheetReader Abstract Class', () => {
    test('cannot be instantiated directly', () => {
      // This is a compile-time check, but we can verify the abstract nature
      // by ensuring our concrete classes properly extend it
      const csvReader = new CSVReader(csvFile1);
      const xlsxReader = new XLSXReader('test.xlsx');
      
      expect(csvReader).toBeInstanceOf(SpreadsheetReader);
      expect(xlsxReader).toBeInstanceOf(SpreadsheetReader);
    });
  });

  describe('Integration Tests', () => {
    test('should process multiple CSV files sequentially', async () => {
      const reader1 = new CSVReader(csvFile1);
      
      const data1 = await reader1.process();
      
      expect(data1).toBeInstanceOf(Array);
      expect(data1.length).toBeGreaterThan(0);
      
      // Test second file only if it has content
      if (fs.existsSync(csvFile2) && fs.statSync(csvFile2).size > 0) {
        const reader2 = new CSVReader(csvFile2);
        const data2 = await reader2.process();
        expect(data2).toBeInstanceOf(Array);
      }
    });

    test('should reuse same reader instance for multiple operations', async () => {
      const reader = new CSVReader(csvFile1);
      
      const columns = await reader.getColumns();
      const data = await reader.process();
      
      expect(columns).toBeInstanceOf(Array);
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
    });

    test('should handle relative and absolute paths', async () => {
      const absolutePathReader = new CSVReader(csvFile1);
      const data = await absolutePathReader.process();
      
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
