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
    reducers:{
        setUsername: (state, action) => {
            state.user.username = action.payload;
            localStorage.setItem("matara-user", JSON.stringify(state.user));
          },
    }
  })


    export const { setUsername } = userSlice.actions;
    export default userSlice.reducer;