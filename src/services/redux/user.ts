/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("matara-user");
  return user ? JSON.parse(user) : null;
};

const getMissonsFromLocalStorage = () => {
  const missions = localStorage.getItem("matara-missions");
  return missions ? JSON.parse(missions) : [];
};

export interface User {
  username: string | null;
  points: number;
  referrals: number;
  level: number;
  currentTapCount: number;
  refillValue: number;
  tapTime: string | null; // ISO string or null
  onboarding: boolean;
  referralCode?: string | null; // optional, since it’s commented out
  profilePicture: string
}

export interface State {
  // user: User;
  profile: User; // refine later
  bonus: any;
  userCabal: any;
  referrals: any[];
  tasks: any[];
  cabal: any[];
  leaderBoard: any[];
  milestones: any[];
  boosts: any[];
  missions: any[];
}


 const initialState: State = {
  // user: getUserFromLocalStorage() || {
  //   username: null,
  //   points: 0,
  //   referrals: 0,
  //   level: 1,
  //   currentTapCount: 1,
  //   refillValue: 1,
  //   tapTime: null,
  //   onboarding: false,
  //   // referralCode: null,
  // },
  profile: getUserFromLocalStorage() || {
    username: null,
    points: 0,
    referrals: 0,
    level: 1,
    currentTapCount: 1,
    refillValue: 1,
    tapTime: null,
    onboarding: false,
    profilePicture: ""
    // referralCode: null,
  }, 
  bonus: null,
  userCabal: null,
  referrals: [],
  tasks: [],
  cabal: [],
  leaderBoard: [],
  milestones: [],
  boosts: [],
  missions: getMissonsFromLocalStorage() || [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setLevel: (state, action) => {
      state.profile.level = action.payload;
      localStorage.setItem("matara-user", JSON.stringify(state.profile));
    },
    setTapTime: (state, action) => {
      state.profile.tapTime = action.payload;
      localStorage.setItem("matara-user", JSON.stringify(state.profile));
    },
    setUsername: (state, action) => {
      state.profile.username = action.payload;
      localStorage.setItem("matara-user", JSON.stringify(state.profile));
    },
    setPoints: (state, action) => {
      state.profile.points = action.payload;
      localStorage.setItem("matara-user", JSON.stringify(state.profile));
    },
    setOnboarding: (state, action) => {
      state.profile.onboarding = action.payload;
      localStorage.setItem("matara-user", JSON.stringify(state.profile));
    },

    startMission: (state, action) => {
      const missions = state.missions;
      const singleMission = action.payload;
      const isAlreadyActive = missions.some((m: any) => m._id === singleMission._id);
      if (!isAlreadyActive) {
        state.missions.push(singleMission);
      }

      localStorage.setItem("matara-missions", JSON.stringify(state.missions));
    },
    clearMission: (state) => {
      state.missions = [];
      localStorage.setItem("matara-missions", JSON.stringify(state.missions));
    },
    removeActiveMission: (state, action) => {
      state.missions = state.missions.filter(
        (mission: any) => mission._id !== action.payload._id
      );
      localStorage.setItem("matara-missions", JSON.stringify(state.missions));
    },
    updateMissionStatus: (state, action) => {
      const singleMission = action.payload;
      const mission = state.missions.find((m: any) => m._id === singleMission?._id);
      if (mission) {
        mission.status = singleMission?.status;
      }
      localStorage.setItem("matara-missions", JSON.stringify(state.missions));
    },
    // setLevel: (state) => {
    //   state.user.level = state.user.level += 1;
    //   localStorage.setItem("flower-user", JSON.stringify(state.user));
    // },
    setRefillValue: (state) => {
      state.profile.refillValue = state.profile.refillValue += 1;
      localStorage.setItem("matara-user", JSON.stringify(state.profile));
    },
   
    setReferrals: (state, action) => {
      state.referrals = action.payload;
    },
    setMilestones: (state, action) => {
      state.milestones = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.leaderBoard = action.payload;
    },
    setBoosts: (state, action) => {
      state.boosts = action.payload;
    },
    setBonus: (state, action) => {
      state.bonus = action.payload;
    }
  },
});

export const {
  setUsername,
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
  setProfile
} = userSlice.actions;

export default userSlice.reducer;
