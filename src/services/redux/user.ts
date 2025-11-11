import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  username: string | null;
  points: number;
  referrals: number;
  level: number;
  currentTapCount: number;
  refillValue: number;
  tapTime: string | null; // ISO string or null
  onboarding: boolean;
  referralCode?: string | null;
  profilePicture: string;
  walletAddress: string | null;
  hasPassword: boolean;
}

export interface State {
  profile: User | null;
  bonus: any;
  userCabal: any;
  referrals: any[];
  tasks: any[];
  cabal: any[];
  leaderBoard: any[];
  milestones: any[];
  boosts: any[];
  missions: any[];
  miningStatus: boolean;
  miningStartDate: string | null;
  isAuthenticated: boolean;
  jwtToken: string | null;
  sessionActive: boolean; // MetaMask-style session state
}

const defaultProfile: User = {
  _id: "",
  username: "",
  points: 0,
  referrals: 0,
  level: 1,
  currentTapCount: 0,
  refillValue: 0,
  tapTime: null,
  onboarding: true,
  referralCode: null,
  profilePicture: "",
  walletAddress: null,
  hasPassword: false,
};

const initialState: State = {
  profile: defaultProfile,
  bonus: null,
  userCabal: null,
  referrals: [],
  tasks: [],
  cabal: [],
  leaderBoard: [],
  milestones: [],
  boosts: [],
  missions: [],
  miningStatus: false,
  miningStartDate: null,
  isAuthenticated: false,   
  jwtToken: null,
  sessionActive: false, // MetaMask-style: session starts as inactive
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      if (!state.profile) state.profile = { ...defaultProfile };
      state.profile.username = action.payload;
    },
    setProfilePicture: (state, action: PayloadAction<string>) => {
      if (!state.profile) state.profile = { ...defaultProfile };
      state.profile.profilePicture = action.payload;
    },
    setPoints: (state, action: PayloadAction<number>) => {
      if (state.profile) state.profile.points = action.payload;
    },
    setLevel: (state, action: PayloadAction<number>) => {
      if (state.profile) state.profile.level = action.payload;
    },
    setOnboarding: (state, action: PayloadAction<boolean>) => {
      if (state.profile) state.profile.onboarding = action.payload;
    },
    setTapTime: (state, action: PayloadAction<string | null>) => {
      if (state.profile) state.profile.tapTime = action.payload;
    },
    setRefillValue: (state) => {
      if (state.profile) state.profile.refillValue += 1;
    },
    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      if (state.profile) state.profile.walletAddress = action.payload;
    },
    setHasPassword: (state, action: PayloadAction<boolean>) => {
      if (state.profile) state.profile.hasPassword = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    // Missions
    startMission: (state, action: PayloadAction<any>) => {
      const mission = action.payload;
      const existingIndex = state.missions.findIndex((m: any) => 
        m._id === mission._id || m.slug === mission.slug
      );
      if (existingIndex >= 0) {
        // Update existing mission
        state.missions[existingIndex] = { ...state.missions[existingIndex], ...mission };
      } else {
        // Add new mission
        state.missions.push(mission);
      }
    },
    clearMission: (state) => {
      state.missions = [];
    },
    removeActiveMission: (state, action: PayloadAction<any>) => {
      state.missions = state.missions.filter(
        (m: any) => m._id !== action.payload._id
      );
    },
    updateMissionStatus: (state, action: PayloadAction<any>) => {
      const mission = action.payload;
      const target = state.missions.find((m: any) => 
        m._id === mission._id || m.slug === mission.slug
      );
      if (target) {
        target.status = mission.status;
        // Update other fields if provided
        if (mission.rejectionReason !== undefined) {
          target.rejectionReason = mission.rejectionReason;
        }
        if (mission.proofUrl !== undefined) {
          target.proofUrl = mission.proofUrl;
        }
      }
    },

    // Other data
    setReferrals: (state, action: PayloadAction<any[]>) => {
      state.referrals = action.payload;
    },
    setMilestones: (state, action: PayloadAction<any[]>) => {
      state.milestones = action.payload;
    },
    setTasks: (state, action: PayloadAction<any[]>) => {
      state.tasks = action.payload;
    },
    setLeaderboard: (state, action: PayloadAction<any[]>) => {
      state.leaderBoard = action.payload;
    },
    setBoosts: (state, action: PayloadAction<any[]>) => {
      state.boosts = action.payload;
    },
    setBonus: (state, action: PayloadAction<any>) => {
      state.bonus = action.payload;
    },
    setMiningStatus: (state, action: PayloadAction<boolean>) => {
      state.miningStatus = action.payload;
    },
    setMiningStartDate: (state, action: PayloadAction<string | null>) => {
      state.miningStartDate = action.payload;
    },
    
    clearIsAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
    setJwtToken: (state, action: PayloadAction<string | null>) => {
      state.jwtToken = action.payload;
    },
    clearJwtToken: (state) => {
      state.jwtToken = null;
    },
    logout: (state) => {
      // Clear authentication state
      state.isAuthenticated = false;
      state.jwtToken = null;
      state.sessionActive = false;
      // Clear localStorage
      localStorage.removeItem('jwt_token');
    },
    unlockSession: (state) => {
      // MetaMask-style: unlock session with password
      state.sessionActive = true;
    },
    lockSession: (state) => {
      // MetaMask-style: lock session (user needs to enter password again)
      state.sessionActive = false;
    },
    clearUser: () => initialState, // reset everything
  },
});

export const {
  setUsername,
  setProfilePicture,
  setPoints,
  setLevel,
  setTasks,
  setReferrals,
  setLeaderboard,
  startMission,
  removeActiveMission,
  updateMissionStatus,
  clearMission,
  setOnboarding,
  setMilestones,
  setBoosts,
  setBonus,
  setTapTime,
  setProfile,
  setRefillValue,
  setMiningStatus,
  setMiningStartDate,
  clearUser,
  setWalletAddress,
  setHasPassword,
  setIsAuthenticated,
  setJwtToken,
  clearJwtToken,
  clearIsAuthenticated,
  logout,
  unlockSession,
  lockSession,
} = userSlice.actions;

// Middleware to sync localStorage with Redux state
export const localStorageSyncMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);
  
  // Sync JWT token changes to localStorage
  if (action.type === 'user/setJwtToken') {
    const token = action.payload;
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }
  
  // Sync logout to localStorage
  if (action.type === 'user/logout') {
    localStorage.removeItem('jwt_token');
  }
  
  return result;
};

export default userSlice.reducer;
