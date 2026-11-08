import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, DriverProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: Partial<StudentProfile>) => Promise<{ success: boolean; error?: string }>;
  registerDriver: (data: Partial<DriverProfile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole | 'guest') => void;
}

// Deterministic seed profiles for instant testing & realistic presentation
export const DEMO_STUDENT: StudentProfile = {
  id: 'usr_student_01',
  name: 'أحمد طارق (Ahmed Tarek)',
  email: 'student@harryup.app',
  phone: '01012345678',
  role: 'student',
  university: 'جامعة الأقصر - كلية الحاسبات والمعلومات (طيبة)',
  faculty: 'علوم الحاسب والذكاء الاصطناعي',
  studentIdNumber: 'LXU-2024-9182',
  createdAt: '2026-09-15T08:00:00Z',
};

export const DEMO_DRIVER: DriverProfile = {
  id: 'usr_driver_01',
  name: 'كابتن محمود السيد (Capt. Mahmoud)',
  email: 'driver@harryup.app',
  phone: '01198765432',
  role: 'driver',
  companyName: 'سوبر جيت - مشغل معتمد بالأقصر (SuperJet Authorized)',
  driverRole: 'fleet_driver',
  vehicleType: 'حافلة سوبر جيت مكيفة (سياحي 49 راكب)',
  vehiclePlate: 'ص ق ج 8492 (Luxor 8492)',
  licenseNumber: 'DL-EGY-LX-99124',
  verificationStatus: 'approved',
  rating: 4.9,
  totalTripsCompleted: 148,
  createdAt: '2026-08-01T10:00:00Z',
};

export const DEMO_PENDING_DRIVER: DriverProfile = {
  id: 'usr_driver_02',
  name: 'يوسف حسن (Youssef Hassan)',
  email: 'youssef.driver@harryup.app',
  phone: '01234567890',
  role: 'driver',
  companyName: 'حافلات طيبة إكسبريس (Tuba Express)',
  driverRole: 'independent',
  vehicleType: 'تويوتا هاي إس ميكروباص سياحي (14 راكب)',
  vehiclePlate: 'ط ب د 3190',
  licenseNumber: 'DL-EGY-LX-44810',
  verificationStatus: 'pending_verification',
  verificationNotes: 'في انتظار فحص رخصة القيادة السارية والفحص الفني للمركبة',
  rating: 5.0,
  totalTripsCompleted: 12,
  createdAt: '2026-11-01T09:30:00Z',
};

export const DEMO_ADMIN: User = {
  id: 'usr_admin_01',
  name: 'إدارة تشغيل HarryUp (Operations Team)',
  email: 'admin@harryup.app',
  phone: '01000000001',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('harryup_current_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    // Default to student demo to provide immediate functional access
    return DEMO_STUDENT;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('harryup_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('harryup_current_user');
    }
  }, [user]);

  const login = async (email: string, requestedRole?: UserRole): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    
    if (trimmed.includes('driver') || requestedRole === 'driver') {
      setUser(DEMO_DRIVER);
      return { success: true };
    }
    if (trimmed.includes('admin') || requestedRole === 'admin') {
      setUser(DEMO_ADMIN);
      return { success: true };
    }
    // default student
    setUser(DEMO_STUDENT);
    return { success: true };
  };

  const registerStudent = async (data: Partial<StudentProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || !data.email || !data.phone) {
      return { success: false, error: 'يرجى ملء جميع البيانات المطلوبة' };
    }
    const newStudent: StudentProfile = {
      id: `usr_stu_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'student',
      university: data.university || 'جامعة الأقصر - كليات مجمع طيبة',
      faculty: data.faculty || 'عام',
      studentIdNumber: data.studentIdNumber || `LX-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    setUser(newStudent);
    return { success: true };
  };

  const registerDriver = async (data: Partial<DriverProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || !data.email || !data.phone || !data.vehiclePlate) {
      return { success: false, error: 'يرجى ملء جميع بيانات السائق والمركبة' };
    }
    const newDriver: DriverProfile = {
      id: `usr_drv_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'driver',
      companyName: data.companyName || 'مشغل نقل معتمد بالأقصر',
      driverRole: data.driverRole || 'fleet_driver',
      vehicleType: data.vehicleType || 'حافلة مكيفة 28 راكب',
      vehiclePlate: data.vehiclePlate,
      licenseNumber: data.licenseNumber || `DL-${Math.floor(10000 + Math.random() * 90000)}`,
      verificationStatus: 'pending_verification', // Per requirement: drivers start pending!
      rating: 5.0,
      totalTripsCompleted: 0,
      createdAt: new Date().toISOString()
    };
    setUser(newDriver);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoRole = (targetRole: UserRole | 'guest') => {
    if (targetRole === 'guest') {
      setUser(null);
    } else if (targetRole === 'student') {
      setUser(DEMO_STUDENT);
    } else if (targetRole === 'driver') {
      setUser(DEMO_DRIVER);
    } else if (targetRole === 'admin') {
      setUser(DEMO_ADMIN);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        registerStudent,
        registerDriver,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
