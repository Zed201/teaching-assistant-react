import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, Page, launch } from 'puppeteer';
import expect from 'expect';

setDefaultTimeout(60 * 1000);

const baseUrl = 'http://localhost:3004';  // Frontend
const serverUrl = 'http://localhost:3005'; // Backend

let browser: Browser;
let page: Page;

let createdCpfs: string[] = [];
let createdClassId: string | null = null;

/* ============================
   HOOKS
============================ */

Before(async () => {
  browser = await launch({ headless: true });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
});

After(async () => {
  // Remove alunos criados
  for (const cpf of createdCpfs) {
    try {
      await fetch(`${serverUrl}/api/students/${cpf}`, { method: 'DELETE' });
    } catch (_) {}
  }

  // Remove turma criada
  if (createdClassId) {
    try {
      await fetch(`${serverUrl}/api/classes/${createdClassId}`, { method: 'DELETE' });
    } catch (_) {}
  }

  createdCpfs = [];
  createdClassId = null;

  if (browser) {
    await browser.close();
  }
});

/* ============================
   HELPERS
============================ */

function generateCPF() {
  return Math.floor(Math.random() * 1e11).toString().padStart(11, '0');
}

async function createClass() {
  const payload = {
    topic: 'Engenharia de Software',
    semester: 1,
    year: 2025
  };

  const res = await fetch(`${serverUrl}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  createdClassId = data.id;
  return data.id;
}

async function createStudent(name: string) {
  const cpf = generateCPF();

  const payload = {
    name,
    cpf,
    email: `${name.replace(/\s/g, '')}@test.com`
  };

  const res = await fetch(`${serverUrl}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status !== 201) {
    const body = await res.text();
    throw new Error(`Erro ao criar aluno: ${body}`);
  }

  createdCpfs.push(cpf);
  return cpf;
}

async function enrollStudent(classId: string, cpf: string) {
  await fetch(`${serverUrl}/api/classes/${classId}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentCPF: cpf })
  });
}

async function setStudentEvaluations(
  classId: string,
  cpf: string,
  evaluations: { goal: string; grade: 'MA' | 'MPA' | 'MANA' }[]
) {
  for (const ev of evaluations) {
    await fetch(`${serverUrl}/api/classes/${classId}/enrollments/${cpf}/evaluation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev)
    });
  }
}

/* ============================
   STEPS
============================ */

Given('a média da turma é {string}', async function () {
  const classId = await createClass();
  this.classId = classId;
});

Given(
  'o aluno {string} tem média {string} e sem reprovações anteriores',
  async function (name: string, media: string) {
    const cpf = await createStudent(name);
    await enrollStudent(this.classId, cpf);

    const grade: 'MA' | 'MPA' | 'MANA' =
      Number(media) >= 7 ? 'MA' : Number(media) >= 5 ? 'MPA' : 'MANA';

    await setStudentEvaluations(this.classId, cpf, [
      { goal: 'Gerência de Projeto', grade }
    ]);

    this.students = this.students || {};
    this.students[name] = cpf;
  }
);

Given(
  'a aluna {string} tem média {string} e com reprovações anteriores',
  async function (name: string, media: string) {
    const cpf = await createStudent(name);
    await enrollStudent(this.classId, cpf);

    const grade: 'MA' | 'MPA' | 'MANA' =
      Number(media) >= 7 ? 'MA' : Number(media) >= 5 ? 'MPA' : 'MANA';

    await setStudentEvaluations(this.classId, cpf, [
      { goal: 'Gerência de Projeto', grade }
    ]);

    this.students = this.students || {};
    this.students[name] = cpf;
  }
);

When('eu visualizo a {string}', async function () {
  await page.goto(baseUrl);
  await page.waitForSelector('.students-list table', { timeout: 15000 });
  await new Promise(res => setTimeout(res, 1500));
});

Then(
  'vejo {string} com borda {string}',
  async function (studentName: string, expectedColor: string) {
    const rows = await page.$$('.students-list table tbody tr');
    let targetRow = null;

    for (const row of rows) {
      const nameCell = await row.$('td:nth-child(2)');
      const text = await page.evaluate(el => el?.textContent?.trim(), nameCell);
      if (text === studentName) {
        targetRow = row;
        break;
      }
    }

    if (!targetRow) {
      throw new Error(`Aluno "${studentName}" não encontrado na lista`);
    }

    const borderLeft = await page.evaluate(el => {
      return window.getComputedStyle(el).borderLeftColor;
    }, targetRow);

    const colorMap: Record<string, string> = {
      'Verde': 'rgb(34, 197, 94)',
      'Amarelo': 'rgb(234, 179, 8)',
      'Vermelho': 'rgb(239, 68, 68)'
    };

    expect(borderLeft).toBe(colorMap[expectedColor]);
  }
);
