import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

interface Team {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', studentId: '', email: '', password: '', confirmPassword: '',
    age: '', yearLevel: '', section: '', contactInfo: '', teamId: '', bio: '', interestedEvents: [] as string[]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
      const fetchData = async () => {
          try {
              // TODO: Uncomment when api functions are available
              // const [fetchedTeams, fetchedEvents] = await Promise.all([getLeaderboard(), getEvents()]);
              // setTeams(fetchedTeams);
              // setAvailableEvents(fetchedEvents);
          } catch (e) {
              console.error("Failed to fetch form data", e);
          }
      }
      fetchData();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      // Real-time email validation
      if (name === 'email') {
          if (value && !validateEmail(value)) {
              setEmailError('Please enter a valid email address');
          } else {
              setEmailError('');
          }
      }
  }
  
  const handleEventToggle = (eventName: string) => {
      setFormData(prev => {
          const exists = prev.interestedEvents.includes(eventName);
          return {
              ...prev,
              interestedEvents: exists ? prev.interestedEvents.filter(e => e !== eventName) : [...prev.interestedEvents, eventName]
          };
      });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    if (!validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    if (!formData.age || parseInt(formData.age) < 13) {
        setError("Age must be at least 13 years old");
        return;
    }

    setLoading(true);
    setError('');
    setEmailError('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataToSubmit } = formData;
      await register(dataToSubmit);
      navigate('/dashboard');
    } catch (err: any) {
      // Check if error is due to existing email
      if (err.message && err.message.includes('email')) {
          setEmailError('This email is already registered. Please log in or use a different email.');
      } else {
          setError(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const inputClass = "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl my-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
          Create SIMS Account
        </h1>
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="First Name *" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <Input label="Middle Name" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
                <Input label="Last Name *" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Student ID *" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
                <Input label="Age *" id="age" name="age" type="number" min="13" value={formData.age} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input 
                    label="Email Address *" 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                  {emailError && <p className="text-sm text-red-500 font-semibold mt-1">{emailError}</p>}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Password *" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                <Input label="Confirm Password *" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Contact Info" id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
            </div>

            {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
            
            <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading || !!emailError}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Already have an account? <span onClick={() => navigate('/login')} className="text-indigo-600 hover:underline cursor-pointer">Log In</span>
                </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
