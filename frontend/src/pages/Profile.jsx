import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Calendar,
  ShieldCheck,
  Edit3,
  Lock,
  KeyRound,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', mobile: '' });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!user) {
      toast.error('Please login to view profile details');
      navigate('/login');
    } else {
      refreshProfile(); // Refresh stats on mount
      setEditForm({
        name: user.name,
        email: user.email,
        mobile: user.mobile
      });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.mobile.trim()) {
      toast.error('All profile fields are required');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(editForm.mobile)) {
      toast.error('Mobile number must be a 10-digit number');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/profile', editForm);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refreshProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', passwordForm);
      toast.success('Password updated successfully!');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 grid-bg">
      <div className="glass rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden animate-slide-up">
        
        {/* Profile Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-6 sm:left-8">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center font-bold text-3xl text-primary-600 dark:text-primary-400 uppercase select-none">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-8 px-6 sm:px-8">
          
          {/* Header Action Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {user.name}
                <ShieldCheck size={20} className="text-primary-500 fill-primary-500/10 shrink-0" />
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar size={14} />
                Member Account
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-primary-500 text-sm font-bold rounded-xl text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <Edit3 size={15} />
                  Edit Profile
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 px-4 py-2 border border-red-250 dark:border-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Details & Password Section */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Account details Card */}
              <div className="glass rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Account Credentials</h3>
                  {isEditing && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 rounded">
                      Editing Mode
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    {/* Name input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="block w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Email input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="block w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Phone input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Mobile Number</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone size={16} />
                        </div>
                        <input
                          type="text"
                          name="mobile"
                          value={editForm.mobile}
                          onChange={handleEditChange}
                          className="block w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ name: user.name, email: user.email, mobile: user.mobile });
                        }}
                        className="flex items-center gap-1 py-1.5 px-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-1.5 py-1.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                      >
                        <Save size={12} />
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Details */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-400 border border-slate-100 dark:border-slate-800 shrink-0">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 break-all">{user.email}</span>
                      </div>
                    </div>

                    {/* Phone Details */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-400 border border-slate-100 dark:border-slate-800 shrink-0">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.mobile}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password Card */}
              <div className="glass rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Security Settings</h3>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                    >
                      Change Account Password
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <form onSubmit={handleSavePassword} className="space-y-4">
                    {/* Old password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={15} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="oldPassword"
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="Verify current password"
                          className="block w-full pl-9 pr-10 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound size={15} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Must be at least 6 characters"
                          className="block w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                      <div className="relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound size={15} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmNewPassword"
                          value={passwordForm.confirmNewPassword}
                          onChange={handlePasswordChange}
                          placeholder="Re-enter new password"
                          className="block w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
                        }}
                        className="flex items-center gap-1 py-1.5 px-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-1.5 py-1.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                      >
                        <Save size={12} />
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    To protect your account details, we recommend setting a strong password that is verified via your current active password.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Activity</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                {/* Created Listings */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400 rounded-xl shrink-0">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-slate-800 dark:text-white leading-none">
                      {user.stats?.createdCount || 0}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 mt-1 block">My Listings</span>
                  </div>
                </div>

                {/* Liked Items */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-xl shrink-0">
                    <Heart size={20} className="fill-current" />
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-slate-800 dark:text-white leading-none">
                      {user.stats?.likedCount || user.likedProducts?.length || 0}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 mt-1 block">Liked Items</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
