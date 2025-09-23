/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("matara-user");
  return user ? JSON.parse(user) : null;
};

const getMissonsFromLocalStorage = () => {
  const missions = localStorage.getItem("matara-missions");
  return missions ? JSON.parse(missions) : [];
};

// const getMiningFromLocalStorage = () => {
//   const mining = localStorage.getItem("matara-mining");
//   return mining ? JSON.parse(mining) : {
//     isActive: false,
//     startTime: null,
//     totalMined: 0,
//     sessionStartTime: null,
//   };
// };

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




// const getMissionsFromLocalStorage = () => {
//   const missions = localStorage.getItem("matara-missions");
//   return missions ? JSON.parse(missions) : [];
// };

const getMiningStatusFromLocalStorage = () => {
  const status = localStorage.getItem("matara-mining-status");
  return status ? JSON.parse(status) : false;
};

const getMiningStartDateFromLocalStorage = () => {
  const date = localStorage.getItem("matara-mining-start-date");
  return date ? JSON.parse(date) : null;
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
}


//  const initialState: State = {
//   profile: getUserFromLocalStorage(),
//   bonus: null,
//   userCabal: null,
//   referrals: [],
//   tasks: [],
//   cabal: [],
//   leaderBoard: [],
//   milestones: [],
//   boosts: [],
//   missions: getMissionsFromLocalStorage() || [],
//   miningStatus: getMiningStatusFromLocalStorage(),
//   miningStartDate: getMiningStartDateFromLocalStorage(),
// };


 const initialState: State = {
  profile: getUserFromLocalStorage(),
  bonus: null,
  userCabal: null,
  referrals: [],
  tasks: [],
  cabal: [],
  leaderBoard: [],
  milestones: [],
  boosts: [],
  missions: getMissonsFromLocalStorage() || [],
  miningStatus: getMiningStatusFromLocalStorage(),
  miningStartDate: getMiningStartDateFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    
    setProfile: (state, action) => {
      state.profile = action.payload;
      if (action.payload) {
        localStorage.setItem("matara-user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("matara-user");
      }
    },
    setLevel: (state, action) => {
      if (state.profile) {
        state.profile.level = action.payload;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
    },
    setTapTime: (state, action) => {
      if (state.profile) {
        state.profile.tapTime = action.payload;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
    },
    setUsername: (state, action) => {
      if (state.profile) {
        state.profile.username = action.payload;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
    },
    setProfilePicture: (state, action) => {
      if (state.profile) {
        state.profile.profilePicture = action.payload;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
    },
    setPoints: (state, action) => {
      if (state.profile) {
        state.profile.points = action.payload;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
    },
    setOnboarding: (state, action) => {
      if (state.profile) {
        state.profile.onboarding = action.payload;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
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
      if (state.profile) {
        state.profile.refillValue = state.profile.refillValue + 1;
        localStorage.setItem("matara-user", JSON.stringify(state.profile));
      }
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
    },
    setMiningStatus: (state, action: PayloadAction<boolean>) => {
      state.miningStatus = action.payload;
      localStorage.setItem("matara-mining-status", JSON.stringify(action.payload));
    },
    setMiningStartDate: (state, action: PayloadAction<string | null>) => {
      state.miningStartDate = action.payload;
      localStorage.setItem("matara-mining-start-date", JSON.stringify(action.payload));
    }
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
  setMiningStartDate
} = userSlice.actions;

export default userSlice.reducer;
