import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-7rem)] rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm border border-emerald-100">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Profile</h2>
        <p className="mt-1 text-slate-600">Your account and role details.</p>

        <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center text-xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{user?.name || 'User'}</h3>
              <p className="capitalize text-slate-500">{user?.userType || 'member'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-800"><FontAwesomeIcon icon={faEnvelope} className="mr-2 text-emerald-700" />{user?.email || 'Not set'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Role</p>
              <p className="mt-1 text-sm font-medium text-slate-800"><FontAwesomeIcon icon={faUserShield} className="mr-2 text-emerald-700" />{user?.userType || 'Not set'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Phone</p>
              <p className="mt-1 text-sm font-medium text-slate-800"><FontAwesomeIcon icon={faPhone} className="mr-2 text-emerald-700" />{user?.phone || 'Not set'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Location</p>
              <p className="mt-1 text-sm font-medium text-slate-800"><FontAwesomeIcon icon={faLocationDot} className="mr-2 text-emerald-700" />{user?.location || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
