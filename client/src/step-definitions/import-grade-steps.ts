import { Given, When, Then, Before, After, DataTable, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, Page, launch } from 'puppeteer';
import expect from 'expect';
import ClassService from '../services/ClassService';
import { Class, getClassId } from '../types/Class';

// importcao dessa forma para ele nao ficar checando o arquivo de server e dar erro asim
const {loadDataFromFile} = require("../../../server/src/server") as any

// funcao autoexecutavel para pegar as classes
let classes: Class[] = [];

(async () => {
  classes = await ClassService.getAllClasses();
  console.log(classes);
})();

// classesIDs pegos dinamicamente
const classIDs: string[] = classes.map((c: Class) => {
  return getClassId(c);
});

const api_url = (classId: string) => {
  return `http://localhost:3005/api/classes/gradeImport/${classId}`;
};

console.log(classIDs);
Given('O usuário seleciona um arquivo CSV ou XLSX para importação', async function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('Uma requisição POST com o arquivo é enviada para {string}', async function (string) {
          // Write code here that turns the phrase above into concrete actions
          return 'pending';
        });

Then('O status da resposta deve ser {string}', async function (string) {
          // Write code here that turns the phrase above into concrete actions
          return 'pending';
        });
Then('O JSON da resposta deve conter:', async function (dataTable) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
Given('O usuário seleciona um arquivo que não é CSV ou XLSX', async function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('Uma requisição POST com o arquivo é enviada para {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('O status da resposta deve ser {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('O JSON da resposta deve conter uma mensagem de erro explicando que o arquivo é inválido.', async function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
Given('O usuário possui um {string} retornado do upload do arquivo', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('O usuário preparou um mapeamento JSON da forma \\{{string}: {string}}', async function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('Uma requisição POST com JSON contendo {string} e {string} é enviada para {string}', async function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('O status da resposta deve ser {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('O JSON da resposta deve indicar que o parse das notas foi realizado com sucesso.', async function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
