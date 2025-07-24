import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import toast from 'react-hot-toast';
import FormInput from '../components/FormInput.jsx';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Sign In</h2>
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || loading}
        >
          {submitting || loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;