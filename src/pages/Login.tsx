import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogInIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react';
import { AuthShell } from '../components/marketing/AuthShell';
import { Field, Input, Label } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAuth } from '../store/useAuth';

export function Login() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState('demo@campus-lumiere.fr');
  const [password, setPassword] = useState('demo1234');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.ok) navigate('/app');else
      setError(res.error ?? 'Connexion impossible.');
    }, 450);
  };

  return (
    <AuthShell
      title="Bon retour."
      subtitle="Connectez-vous pour piloter votre établissement."
      footer={
      <>
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-bold text-plum underline underline-offset-2">
            Créer un établissement
          </Link>
        </>
      }>
      
      <form onSubmit={submit} className="space-y-4">
        <Field label="Adresse e-mail">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@etablissement.fr" />
          
        </Field>
        <div>
          <Label>Mot de passe</Label>
          <div className="relative">
            <Input
              type={show ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-10" />
            
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ink"
              aria-label={show ? 'Masquer' : 'Afficher'}>
              
              {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error &&
        <div className="flex items-center gap-2 rounded-xl border-2 border-coral bg-coral-soft px-3 py-2 text-sm font-medium text-ink">
            <AlertCircleIcon className="h-4 w-4 text-coral" /> {error}
          </div>
        }

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-medium text-smoke">
            <input type="checkbox" className="h-4 w-4 rounded border-2 border-ink accent-plum" defaultChecked />
            Se souvenir de moi
          </label>
          <button type="button" className="font-semibold text-plum hover:underline">
            Mot de passe oublié ?
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Connexion…' : <>Se connecter <LogInIcon className="h-4 w-4" /></>}
        </Button>

        <p className="rounded-xl border-2 border-dashed border-line bg-canvas/60 px-3 py-2 text-center text-xs text-smoke">
          Démo : <span className="font-mono font-bold text-ink">demo@campus-lumiere.fr</span> / <span className="font-mono font-bold text-ink">demo1234</span>
        </p>
      </form>
    </AuthShell>);

}