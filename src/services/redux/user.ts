import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from '@reduxjs/toolkit';

export interface User {
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
  isAuthenticated: boolean;
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
}

const defaultProfile: User = {
  username: null,
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
  isAuthenticated: false,
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
      if (state.profile) state.profile.isAuthenticated = action.payload;
    },
    // Missions
    startMission: (state, action: PayloadAction<any>) => {
      const mission = action.payload;
      const exists = state.missions.some((m: any) => m._id === mission._id);
      if (!exists) state.missions.push(mission);
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
      const target = state.missions.find((m: any) => m._id === mission._id);
      if (target) target.status = mission.status;
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
      if (state.profile) {
        state.profile.isAuthenticated = false;
      }
      // Clear localStorage
      localStorage.removeItem('jwt_token');
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
