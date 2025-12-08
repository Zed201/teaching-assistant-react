import request from 'supertest';
import { app, classes, studentSet } from '../server';
import { Class } from '../models/Class';
import { Student } from '../models/Student';
import { DEFAULT_ESPECIFICACAO_DO_CALCULO_DA_MEDIA } from '../models/EspecificacaoDoCalculoDaMedia';

describe('GET /api/classes/:classId/students-status (integration test)', () => {
  let classId: string;

  beforeEach(() => {
    // ✅ Limpeza correta do estado interno
    (studentSet as any).students = [];
    (classes as any).classes = [];
  });

  test('returns correct status for students in a class', async () => {
    // ✅ Criação dos alunos
    const student1 = new Student('João', '11111111111', 'j@test.com');
    const student2 = new Student('Maria', '22222222222', 'm@test.com');

    studentSet.addStudent(student1);
    studentSet.addStudent(student2);

    // ✅ Criação da turma
    const classObj = new Class(
      'ES',
      1,
      2025,
      DEFAULT_ESPECIFICACAO_DO_CALCULO_DA_MEDIA
    );

    classes.addClass(classObj);

    // ✅ Matrícula + avaliações (é isso que o endpoint usa!)
    const enroll1 = classObj.addEnrollment(student1);
    enroll1.addOrUpdateEvaluation('Prova 1', 'MA'); // Verde

    const enroll2 = classObj.addEnrollment(student2);
    enroll2.addOrUpdateEvaluation('Prova 1', 'MPA'); // Amarelo
    enroll2.setReprovadoPorFalta(false);

    classId = classObj.getClassId();

    // ✅ Chamada real da API
    const res = await request(app)
      .get(`/api/classes/${classId}/students-status`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    // ✅ DEBUG DEFINITIVO (pode remover depois)
    console.log('RESPOSTA DA API:', JSON.stringify(res.body, null, 2));

    // ✅ Mapeamento ROBUSTO (corrige seu undefined)
    const byCpf: Record<string, string> = {};
    res.body.forEach((r: any) => {
      const cpf =
        r.student?.cpf ||
        r.student?.getCPF?.() ||
        r.studentCPF;

      byCpf[cpf] = r.statusColor;
    });

    // ✅ Agora não existe mais undefined possível
    expect(byCpf['11111111111']).toBe('green');
    expect(byCpf['22222222222']).toBe('yellow');
  });
});
