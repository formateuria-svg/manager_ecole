import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
import {
  seedEstablishment,
  seedStudents,
  seedTeachers,
  seedEnrollments,
  seedPayments,
  seedGrades,
  seedEvents,
  seedAbsences,
  seedTemplates } from
'./seed';

const uid = (prefix: string) =>
`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

interface DataState {
  establishment: Establishment;
  students: Student[];
  teachers: Teacher[];
  enrollments: Enrollment[];
  payments: Payment[];
  grades: Grade[];
  events: TimetableEvent[];
  absences: Absence[];
  templates: DocumentTemplate[];

  updateEstablishment: (patch: Partial<Establishment>) => void;

  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  removeStudent: (id: string) => void;

  addTeacher: (t: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, patch: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;

  addEnrollment: (e: Omit<Enrollment, 'id'>) => void;
  updateEnrollment: (id: string, patch: Partial<Enrollment>) => void;
  removeEnrollment: (id: string) => void;

  addPayment: (p: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, patch: Partial<Payment>) => void;
  removePayment: (id: string) => void;
  markPaid: (id: string, method: Payment['method']) => void;

  addGrade: (g: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, patch: Partial<Grade>) => void;
  removeGrade: (id: string) => void;

  addEvent: (e: Omit<TimetableEvent, 'id'>) => void;
  updateEvent: (id: string, patch: Partial<TimetableEvent>) => void;
  removeEvent: (id: string) => void;

  addAbsence: (a: Omit<Absence, 'id'>) => void;
  updateAbsence: (id: string, patch: Partial<Absence>) => void;
  removeAbsence: (id: string) => void;

  updateTemplate: (id: string, patch: Partial<DocumentTemplate>) => void;
  addTemplate: (t: Omit<DocumentTemplate, 'id'>) => void;
  removeTemplate: (id: string) => void;

  resetData: () => void;
}

export const useStore = create<DataState>()(
  persist(
    (set) => ({
      establishment: seedEstablishment,
      students: seedStudents,
      teachers: seedTeachers,
      enrollments: seedEnrollments,
      payments: seedPayments,
      grades: seedGrades,
      events: seedEvents,
      absences: seedAbsences,
      templates: seedTemplates,

      updateEstablishment: (patch) =>
      set((s) => ({ establishment: { ...s.establishment, ...patch } })),

      addStudent: (s) => set((st) => ({ students: [{ ...s, id: uid('stu') }, ...st.students] })),
      updateStudent: (id, patch) =>
      set((st) => ({
        students: st.students.map((x) => x.id === id ? { ...x, ...patch } : x)
      })),
      removeStudent: (id) => set((st) => ({ students: st.students.filter((x) => x.id !== id) })),

      addTeacher: (t) => set((st) => ({ teachers: [{ ...t, id: uid('tea') }, ...st.teachers] })),
      updateTeacher: (id, patch) =>
      set((st) => ({
        teachers: st.teachers.map((x) => x.id === id ? { ...x, ...patch } : x)
      })),
      removeTeacher: (id) => set((st) => ({ teachers: st.teachers.filter((x) => x.id !== id) })),

      addEnrollment: (e) =>
      set((st) => ({ enrollments: [{ ...e, id: uid('enr') }, ...st.enrollments] })),
      updateEnrollment: (id, patch) =>
      set((st) => ({
        enrollments: st.enrollments.map((x) => x.id === id ? { ...x, ...patch } : x)
      })),
      removeEnrollment: (id) =>
      set((st) => ({ enrollments: st.enrollments.filter((x) => x.id !== id) })),

      addPayment: (p) => set((st) => ({ payments: [{ ...p, id: uid('pay') }, ...st.payments] })),
      updatePayment: (id, patch) =>
      set((st) => ({
        payments: st.payments.map((x) => x.id === id ? { ...x, ...patch } : x)
      })),
      removePayment: (id) => set((st) => ({ payments: st.payments.filter((x) => x.id !== id) })),
      markPaid: (id, method) =>
      set((st) => ({
        payments: st.payments.map((x) =>
        x.id === id ?
        {
          ...x,
          status: 'paye',
          method,
          paidDate: new Date().toISOString().slice(0, 10),
          receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`
        } :
        x
        )
      })),

      addGrade: (g) => set((st) => ({ grades: [{ ...g, id: uid('gr') }, ...st.grades] })),
      updateGrade: (id, patch) =>
      set((st) => ({ grades: st.grades.map((x) => x.id === id ? { ...x, ...patch } : x) })),
      removeGrade: (id) => set((st) => ({ grades: st.grades.filter((x) => x.id !== id) })),

      addEvent: (e) => set((st) => ({ events: [{ ...e, id: uid('evt') }, ...st.events] })),
      updateEvent: (id, patch) =>
      set((st) => ({ events: st.events.map((x) => x.id === id ? { ...x, ...patch } : x) })),
      removeEvent: (id) => set((st) => ({ events: st.events.filter((x) => x.id !== id) })),

      addAbsence: (a) => set((st) => ({ absences: [{ ...a, id: uid('abs') }, ...st.absences] })),
      updateAbsence: (id, patch) =>
      set((st) => ({
        absences: st.absences.map((x) => x.id === id ? { ...x, ...patch } : x)
      })),
      removeAbsence: (id) => set((st) => ({ absences: st.absences.filter((x) => x.id !== id) })),

      updateTemplate: (id, patch) =>
      set((st) => ({
        templates: st.templates.map((x) => x.id === id ? { ...x, ...patch } : x)
      })),
      addTemplate: (t) =>
      set((st) => ({ templates: [{ ...t, id: uid('tpl') }, ...st.templates] })),
      removeTemplate: (id) =>
      set((st) => ({ templates: st.templates.filter((x) => x.id !== id) })),

      resetData: () =>
      set({
        establishment: seedEstablishment,
        students: seedStudents,
        teachers: seedTeachers,
        enrollments: seedEnrollments,
        payments: seedPayments,
        grades: seedGrades,
        events: seedEvents,
        absences: seedAbsences,
        templates: seedTemplates
      })
    }),
    { name: 'smc-data-v1' }
  )
);