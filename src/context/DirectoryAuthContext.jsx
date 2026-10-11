import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfileByUserId, saveProfile, getAllProfilesAdmin } from '../services/directoryStorage';
import { slugify } from '../services/directoryTypes';

const DirectoryAuthContext = createContext(null);

const ADMIN_STORAGE_KEY = 'jcer_admin_session_auth';
const DEMO_USER_KEY = 'jcer_demo_student_session';

// Master institutional passcodes for college admin authorization
const ADMIN_PASSCODES = ['jcer2026', 'jcer-ecell-admin', 'ecell@jcer'];

export const DirectoryAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check saved admin session
  useEffect(() => {
    const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Restore authenticated student session from localStorage
  useEffect(() => {
    const localDemo = localStorage.getItem(DEMO_USER_KEY);
    if (localDemo) {
      try {
        const parsed = JSON.parse(localDemo);
        setCurrentUser(parsed);
        getProfileByUserId(parsed.uid).then((prof) => {
          setStudentProfile(prof);
          setIsLoading(false);
        });
      } catch (e) {
        console.warn('Session parse error:', e);
        setIsLoading(false);
      }
    } else {
      setCurrentUser(null);
      setStudentProfile(null);
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (currentUser?.uid) {
      const p = await getProfileByUserId(currentUser.uid);
      setStudentProfile(p);
      return p;
    }
    return null;
  }, [currentUser]);

  // Student Login
  const login = async (email, password) => {
    setIsLoading(true);
    const localUid = 'student-' + slugify(email.split('@')[0]);
    const studentUser = {
      uid: localUid,
      email,
      displayName: email.split('@')[0],
      role: 'student',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(studentUser));
    setCurrentUser(studentUser);

    let prof = await getProfileByUserId(localUid);
    if (!prof) {
      const allProfiles = await getAllProfilesAdmin();
      const existingByEmail = allProfiles.find(
        (p) => p.email?.toLowerCase() === email.toLowerCase() || p.collegeEmail?.toLowerCase() === email.toLowerCase()
      );

      if (existingByEmail) {
        prof = { ...existingByEmail, userId: localUid };
        await saveProfile(prof);
      } else {
        prof = {
          id: 'prof-' + localUid,
          userId: localUid,
          slug: slugify(studentUser.displayName),
          fullName: studentUser.displayName,
          email,
          collegeEmail: email,
          usn: '',
          department: 'Computer Science & Engineering',
          academicYear: '3rd Year',
          avatarUrl: '',
          bio: 'Student innovator and creator at JCER.',
          primaryRole: 'Student Innovator',
          skills: ['Innovation', 'Problem Solving'],
          collaborationStatus: 'Open for Hackathons',
          preferredRoles: ['Frontend Engineer'],
          socialLinks: {},
          status: 'draft',
          achievements: [],
          gallery: [],
        };
        await saveProfile(prof);
      }
    }
    setStudentProfile(prof);
    setIsLoading(false);
    return { success: true, user: studentUser, profile: prof };
  };

  // Student Registration
  const register = async (formData) => {
    setIsLoading(true);
    const { email, fullName, department, academicYear, usn } = formData;
    const uid = 'student-' + slugify(fullName) + '-' + Date.now().toString().slice(-4);

    const newUser = {
      uid,
      email,
      displayName: fullName,
      role: 'student',
    };

    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);

    const initialProfile = {
      id: 'prof-' + uid,
      userId: uid,
      slug: slugify(fullName) + '-' + Math.floor(100 + Math.random() * 900),
      fullName,
      email,
      collegeEmail: email,
      usn: usn || '',
      department: department || 'Computer Science & Engineering',
      academicYear: academicYear || '1st Year',
      avatarUrl: formData.avatarUrl || '',
      bio: formData.bio || '',
      primaryRole: formData.primaryRole || 'Student Innovator',
      skills: formData.skills || [],
      collaborationStatus: formData.collaborationStatus || 'Open for Hackathons',
      preferredRoles: formData.preferredRoles || [],
      socialLinks: formData.socialLinks || {},
      status: 'draft',
      isFeatured: false,
      achievements: formData.achievements || [],
      gallery: [],
      submittedAt: null,
      approvedAt: null,
      updatedAt: new Date().toISOString(),
    };

    await saveProfile(initialProfile);
    setStudentProfile(initialProfile);
    setIsLoading(false);
    return { success: true, user: newUser, profile: initialProfile };
  };

  // Admin login via passcode
  const adminLogin = (passcode) => {
    if (ADMIN_PASSCODES.includes(passcode.trim())) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid administrator authorization key.' };
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  // Google Sign-In Simulation
  const loginWithGoogle = async () => {
    setIsLoading(true);
    const demoEmail = 'google.student@jcer.edu.in';
    const localUid = 'google-user-' + Date.now().toString().slice(-4);
    const demoUser = {
      uid: localUid,
      email: demoEmail,
      displayName: 'Google Student Achiever',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      role: 'student',
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    let prof = await getProfileByUserId(localUid);
    if (!prof) {
      prof = {
        id: 'prof-' + localUid,
        userId: localUid,
        slug: 'google-student-achiever',
        fullName: demoUser.displayName,
        email: demoEmail,
        collegeEmail: demoEmail,
        usn: '2JC23CS099',
        department: 'Computer Science & Engineering',
        academicYear: '2nd Year',
        avatarUrl: demoUser.photoURL,
        bio: 'Exploring AI & Cloud platforms at JCER. Active hackathon competitor.',
        primaryRole: 'Full-Stack Developer',
        skills: ['React', 'Python', 'Web3', 'AI'],
        collaborationStatus: 'Open for Hackathons',
        preferredRoles: ['Frontend Engineer'],
        socialLinks: {},
        status: 'draft',
        achievements: [],
        gallery: [],
      };
      await saveProfile(prof);
    }
    setStudentProfile(prof);
    setIsLoading(false);
    return { success: true, user: demoUser, profile: prof };
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    setCurrentUser(null);
    setStudentProfile(null);
  };

  return (
    <DirectoryAuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        isAdmin,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        adminLogin,
        adminLogout,
        refreshProfile,
        setStudentProfile,
      }}
    >
      {children}
    </DirectoryAuthContext.Provider>
  );
};

export const useDirectoryAuth = () => {
  const context = useContext(DirectoryAuthContext);
  if (!context) {
    throw new Error('useDirectoryAuth must be used within a DirectoryAuthProvider');
  }
  return context;
};

