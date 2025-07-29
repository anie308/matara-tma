/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("flower-user");
  return user ? JSON.parse(user) : null;
};

const getMissonsFromLocalStorage = () => {
  const missions = localStorage.getItem("flower-missions");
  return missions ? JSON.parse(missions) : [];
};

const initialState = {
  user: getUserFromLocalStorage() || {
    token: null,
    username: null,
    points: 30000,
    referrals: 0,
    level: 1,
    currentTapCount: 1,
    maxpoints: 1000,
    currentPoints: 1000,
    multipleTapIncrement: 50000,
    energyIncrement: 50000,
    rechargeSpeed: 100000,
    refillValue: 1,
    tapTime: null,
    onboarding: false,
    // referralCode: null,
  },
  bonus: null,
  userCabal: null,
  referrals: [],
  tasks: [],
  cabal: [],
  leaderBoard: [],
  milestones: [],
  boosts:[],
  missions: getMissonsFromLocalStorage() || [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentPoints: (state, action) => {
      state.user.currentPoints = action.payload;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },
    setLevel: (state, action) => {
      state.user.level = action.payload;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },
    setTapTime: (state, action) => {
      state.user.tapTime = action.payload;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },
    setUsername: (state, action) => {
      state.user.username = action.payload;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },
    setPoints: (state, action) => {
      state.user.points = action.payload;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },
    setOnboarding: (state, action) => {
      state.user.onboarding = action.payload;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },

    startMission: (state, action) => {
      const missions = state.missions;
      const singleMission = action.payload;
      const isAlreadyActive = missions.some((m: any) => m._id === singleMission._id);
      if (!isAlreadyActive) {
        state.missions.push(singleMission);
      }

      localStorage.setItem("flower-missions", JSON.stringify(state.missions));
    },
    clearMission: (state) => {
      state.missions = [];
      localStorage.setItem("flower-missions", JSON.stringify(state.missions));
    },
    removeActiveMission: (state, action) => {
      state.missions = state.missions.filter(
        (mission: any) => mission._id !== action.payload._id
      );
      localStorage.setItem("flower-missions", JSON.stringify(state.missions));
    },
    updateMissionStatus: (state, action) => {
      const singleMission = action.payload;
      const mission = state.missions.find((m: any) => m._id === singleMission?._id);
      if (mission) {
        mission.status = singleMission?.status;
      }
      localStorage.setItem("flower-missions", JSON.stringify(state.missions));
    },
    // setLevel: (state) => {
    //   state.user.level = state.user.level += 1;
    //   localStorage.setItem("flower-user", JSON.stringify(state.user));
    // },
    setRefillValue: (state) => {
      state.user.refillValue = state.user.refillValue += 1;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
    },
    setEnergy: (state) => {
      state.user.maxpoints = state.user.maxpoints += 500;
      localStorage.setItem("flower-user", JSON.stringify(state.user));
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
  setCurrentPoints,
  setLevel,
  setEnergy,
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
  setTapTime
} = userSlice.actions;

export default userSlice.reducer;
