import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlusIcon, AlertCircleIcon, CheckIcon } from 'lucide-react';
import { AuthShell } from '../components/marketing/AuthShell';
import { Field, Input, Label, Select } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAuth } from '../store/useAuth';
import { useStore } from '../store/useStore';

const roles = ['Directeur / Directrice', 'Responsable pédagogique', 'Administration', 'Gestionnaire'];
const types = [
{ v: 'ecole', l: 'École' },
{ v: 'institut', l: 'Institut' },
{ v: 'universite', l: 'Université' },
{ v: 'centre', l: 'Centre de formation' }];


export function Register() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);
  const updateEstablishment = useStore((s) => s.updateEstablishment);

  const [form, setForm] = useState({
    name: '',
    establishment: '',
    type: 'ecole',
    email: '',
    password: '',
    role: roles[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = register({
        name: form.name,
        email: form.email,
        password: form.password,
        establishment: form.establishment,
        role: form.role
      });
      setLoading(false);
      if (res.ok) {
        updateEstablishment({
          name: form.establishment,
          type: form.type as never,
          director: form.name,
          email: form.email
        });
        navigate('/app');
      } else {
        setError(res.error ?? 'Inscription impossible.');
      }
    }, 550);
  };

  return (
    <AuthShell
      title="Créez votre établissement."
      subtitle="14 jours d'essai, tous les modules inclus, sans carte."
      footer={
      <>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-plum underline underline-offset-2">
            Se connecter
          </Link>
        </>
      }>
      
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Votre nom">
            <Input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Camille Rousseau" />
          </Field>
          <Field label="Fonction">
            <Select value={form.role} onChange={(e) => set('role', e.target.value)}>
              {roles.map((r) =>
              <option key={r}>{r}</option>
              )}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom de l'établissement">
            <Input required value={form.establishment} onChange={(e) => set('establishment', e.target.value)} placeholder="Campus Lumière" />
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {types.map((t) =>
              <option key={t.v} value={t.v}>
                  {t.l}
                </option>
              )}
            </Select>
          </Field>
        </div>

        <Field label="Adresse e-mail">
          <Input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="vous@etablissement.fr" />
        </Field>

        <div>
          <Label>Mot de passe</Label>
          <Input type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="6 caractères minimum" />
        </div>

        {error &&
        <div className="flex items-center gap-2 rounded-xl border-2 border-coral bg-coral-soft px-3 py-2 text-sm font-medium text-ink">
            <AlertCircleIcon className="h-4 w-4 text-coral" /> {error}
          </div>
        }

        <label className="flex items-start gap-2 text-xs text-smoke">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-2 border-ink accent-plum" />
          <span>
            J'accepte les conditions d'utilisation et la politique de confidentialité de School Manager Cloud.
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Création…' : <>Créer mon établissement <UserPlusIcon className="h-4 w-4" /></>}
        </Button>

        <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-smoke">
          {['Tous les modules', 'Exports illimités', 'Documents configurables', 'Apprenants illimités'].map((f) =>
          <li key={f} className="flex items-center gap-1.5">
              <CheckIcon className="h-3.5 w-3.5 text-teal" /> {f}
            </li>
          )}
        </ul>
      </form>
    </AuthShell>);

}