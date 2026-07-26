export type ID = string;

export type EstablishmentType = 'ecole' | 'institut' | 'universite' | 'centre';

export interface Establishment {
  id: ID;
  name: string;
  type: EstablishmentType;
  city: string;
  director: string;
  email: string;
  phone: string;
}

export type StudentStatus = 'actif' | 'diplome' | 'suspendu' | 'sortie';

export interface Student {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  program: string;
  classGroup: string;
  status: StudentStatus;
  enrolledAt: string;
  avatarColor: string;
}

export type TeacherStatus = 'titulaire' | 'vacataire' | 'conge';

export interface Teacher {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  status: TeacherStatus;
  weeklyHours: number;
  hiredAt: string;
  avatarColor: string;
}

export type EnrollmentStatus = 'en_attente' | 'validee' | 'refusee' | 'liste_attente';

export interface Enrollment {
  id: ID;
  studentName: string;
  studentId?: ID;
  program: string;
  requestedAt: string;
  status: EnrollmentStatus;
  amount: number;
  documents: string[];
  note: string;
}

export type PaymentStatus = 'paye' | 'en_attente' | 'en_retard';
export type PaymentMethod = 'carte' | 'virement' | 'especes' | 'cheque';

export interface Payment {
  id: ID;
  studentId: ID;
  studentName: string;
  label: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  method: PaymentMethod | null;
  status: PaymentStatus;
  receiptNo: string;
}

export interface Grade {
  id: ID;
  studentId: ID;
  studentName: string;
  subject: string;
  assessment: string;
  score: number;
  outOf: number;
  coefficient: number;
  date: string;
}

export type EventKind = 'cours' | 'td' | 'tp' | 'examen' | 'reunion';

export interface TimetableEvent {
  id: ID;
  title: string;
  kind: EventKind;
  teacherId: ID;
  teacherName: string;
  classGroup: string;
  room: string;
  day: number; // 0 = Monday ... 5 = Saturday
  start: string; // "HH:mm"
  end: string;
  color: string;
}

export type AbsenceKind = 'absence' | 'retard';
export type AbsenceStatus = 'justifiee' | 'non_justifiee' | 'en_attente';

export interface Absence {
  id: ID;
  personName: string;
  role: 'apprenant' | 'enseignant';
  classGroup: string;
  date: string;
  kind: AbsenceKind;
  duration: string;
  status: AbsenceStatus;
  reason: string;
}

export interface DocumentTemplate {
  id: ID;
  name: string;
  type: 'recu' | 'certificat' | 'convention' | 'bulletin' | 'attestation';
  headerColor: string;
  showLogo: boolean;
  showSignature: boolean;
  footerText: string;
  fields: string[];
}