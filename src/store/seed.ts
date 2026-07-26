import type {
  Establishment,
  Student,
  Teacher,
  Enrollment,
  Payment,
  Grade,
  TimetableEvent,
  Absence,
  DocumentTemplate } from
'./types';

const COLORS = ['#5B3FA8', '#FF6B4A', '#1F9E8F', '#F5B301', '#8CC000'];
const pick = (i: number) => COLORS[i % COLORS.length];

export const seedEstablishment: Establishment = {
  id: 'est-1',
  name: 'Campus Lumière',
  type: 'centre',
  city: 'Lyon',
  director: 'Camille Rousseau',
  email: 'direction@campus-lumiere.fr',
  phone: '+33 4 78 00 12 34'
};

const first = ['Léa', 'Noah', 'Emma', 'Adam', 'Jade', 'Gabriel', 'Louise', 'Sacha', 'Alice', 'Nathan', 'Chloé', 'Ethan', 'Manon', 'Liam', 'Inès', 'Yanis'];
const last = ['Martin', 'Bernard', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Garcia', 'Roux', 'Fontaine', 'Girard', 'Lefevre', 'Mercier', 'Blanc', 'Guerin', 'Boyer'];
const programs = ['Développement Web', 'Design UX/UI', 'Marketing Digital', 'Data & IA', 'Cybersécurité', 'Gestion de Projet'];
const classes = ['DW-A1', 'DW-A2', 'UX-B1', 'MK-C1', 'DA-D1', 'CY-E1'];

export const seedStudents: Student[] = Array.from({ length: 16 }, (_, i) => {
  const f = first[i % first.length];
  const l = last[i % last.length];
  return {
    id: `stu-${i + 1}`,
    firstName: f,
    lastName: l,
    email: `${f.toLowerCase()}.${l.toLowerCase()}@campus-lumiere.fr`,
    phone: `+33 6 ${String(10 + i)} ${String(20 + i)} ${String(30 + i)} ${String(40 + i)}`,
    birthDate: `200${i % 6}-0${i % 9 + 1}-1${i % 9}`,
    program: programs[i % programs.length],
    classGroup: classes[i % classes.length],
    status: (['actif', 'actif', 'actif', 'suspendu', 'diplome'] as const)[i % 5],
    enrolledAt: `2024-09-0${i % 9 + 1}`,
    avatarColor: pick(i)
  };
});

const subjects = ['Algorithmique', 'Design System', 'SEO & SEA', 'Machine Learning', 'Réseaux', 'Management Agile', 'Bases de données', 'Communication'];

export const seedTeachers: Teacher[] = Array.from({ length: 8 }, (_, i) => {
  const f = first[(i + 3) % first.length];
  const l = last[(i + 5) % last.length];
  return {
    id: `tea-${i + 1}`,
    firstName: f,
    lastName: l,
    email: `${f.toLowerCase()}.${l.toLowerCase()}@campus-lumiere.fr`,
    phone: `+33 6 ${String(50 + i)} ${String(60 + i)} ${String(70 + i)} ${String(80 + i)}`,
    subject: subjects[i % subjects.length],
    status: (['titulaire', 'titulaire', 'vacataire', 'conge'] as const)[i % 4],
    weeklyHours: 12 + i % 4 * 4,
    hiredAt: `202${i % 4}-09-01`,
    avatarColor: pick(i + 2)
  };
});

export const seedEnrollments: Enrollment[] = Array.from({ length: 7 }, (_, i) => ({
  id: `enr-${i + 1}`,
  studentName: `${first[(i + 7) % first.length]} ${last[(i + 2) % last.length]}`,
  program: programs[i % programs.length],
  requestedAt: `2025-07-0${i % 9 + 1}`,
  status: (['en_attente', 'validee', 'liste_attente', 'en_attente', 'refusee'] as const)[i % 5],
  amount: [4500, 5200, 3800, 6100][i % 4],
  documents: ['CNI', 'Diplôme', 'CV'].slice(0, i % 3 + 1),
  note: ''
}));

export const seedPayments: Payment[] = seedStudents.slice(0, 12).map((s, i) => {
  const status = (['paye', 'paye', 'en_attente', 'en_retard'] as const)[i % 4];
  return {
    id: `pay-${i + 1}`,
    studentId: s.id,
    studentName: `${s.firstName} ${s.lastName}`,
    label: `Frais de scolarité — Tranche ${i % 3 + 1}`,
    amount: [1200, 1500, 900, 1800][i % 4],
    dueDate: `2025-0${i % 8 + 1}-15`,
    paidDate: status === 'paye' ? `2025-0${i % 8 + 1}-12` : null,
    method: status === 'paye' ? (['carte', 'virement', 'cheque'] as const)[i % 3] : null,
    status,
    receiptNo: status === 'paye' ? `REC-2025-${String(100 + i)}` : '—'
  };
});

const assessments = ['Contrôle continu', 'Partiel', 'Projet', 'Oral', 'TP noté'];
export const seedGrades: Grade[] = seedStudents.slice(0, 12).flatMap((s, i) =>
Array.from({ length: 2 }, (_, j) => ({
  id: `gr-${i}-${j}`,
  studentId: s.id,
  studentName: `${s.firstName} ${s.lastName}`,
  subject: subjects[(i + j) % subjects.length],
  assessment: assessments[(i + j) % assessments.length],
  score: 8 + (i * 3 + j * 5) % 12,
  outOf: 20,
  coefficient: j % 3 + 1,
  date: `2025-0${(i + j) % 8 + 1}-1${j}`
}))
);

const kinds = ['cours', 'td', 'tp', 'examen', 'reunion'] as const;
const EVENT_COLORS: Record<string, string> = {
  cours: '#5B3FA8',
  td: '#1F9E8F',
  tp: '#F5B301',
  examen: '#FF6B4A',
  reunion: '#8CC000'
};
const slots = [
['08:00', '10:00'],
['10:15', '12:15'],
['13:30', '15:30'],
['15:45', '17:45']];


export const seedEvents: TimetableEvent[] = [];
let ei = 0;
for (let day = 0; day < 5; day++) {
  const count = 2 + day % 3;
  for (let s = 0; s < count; s++) {
    const t = seedTeachers[(day + s) % seedTeachers.length];
    const kind = kinds[(day + s) % kinds.length];
    const slot = slots[s % slots.length];
    seedEvents.push({
      id: `evt-${ei++}`,
      title: t.subject,
      kind,
      teacherId: t.id,
      teacherName: `${t.firstName} ${t.lastName}`,
      classGroup: classes[(day + s) % classes.length],
      room: `Salle ${101 + (day + s) % 8}`,
      day,
      start: slot[0],
      end: slot[1],
      color: EVENT_COLORS[kind]
    });
  }
}

export const seedAbsences: Absence[] = Array.from({ length: 9 }, (_, i) => {
  const isStudent = i % 3 !== 0;
  const person = isStudent ?
  seedStudents[i % seedStudents.length] :
  seedTeachers[i % seedTeachers.length];
  return {
    id: `abs-${i + 1}`,
    personName: `${person.firstName} ${person.lastName}`,
    role: isStudent ? 'apprenant' : 'enseignant',
    classGroup: isStudent ? (person as Student).classGroup : (person as Teacher).subject,
    date: `2025-07-1${i % 9}`,
    kind: (['absence', 'retard'] as const)[i % 2],
    duration: i % 2 === 0 ? 'Journée' : `${15 + i % 4 * 15} min`,
    status: (['justifiee', 'non_justifiee', 'en_attente'] as const)[i % 3],
    reason: ['Rendez-vous médical', 'Transport', 'Familial', ''][i % 4]
  };
});

export const seedTemplates: DocumentTemplate[] = [
{
  id: 'tpl-1',
  name: 'Reçu de paiement',
  type: 'recu',
  headerColor: '#5B3FA8',
  showLogo: true,
  showSignature: true,
  footerText: 'Merci de votre confiance — Campus Lumière',
  fields: ['Nom', 'Montant', 'Date', 'Méthode', 'N° de reçu']
},
{
  id: 'tpl-2',
  name: 'Certificat de scolarité',
  type: 'certificat',
  headerColor: '#1F9E8F',
  showLogo: true,
  showSignature: true,
  footerText: 'Document officiel — à conserver',
  fields: ['Nom', 'Programme', 'Année', 'Classe']
},
{
  id: 'tpl-3',
  name: 'Bulletin de notes',
  type: 'bulletin',
  headerColor: '#FF6B4A',
  showLogo: true,
  showSignature: false,
  footerText: 'Moyenne calculée sur les coefficients',
  fields: ['Nom', 'Matières', 'Notes', 'Moyenne']
}];