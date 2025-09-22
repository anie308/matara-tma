import { apiSlice } from "../api";

const userSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ username }) => ({
        url: `/user/get-user?username=${username}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserPoints: builder.query({
      query: ({ username }) => ({
        url: `/user/points?username=${username}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getMiningState: builder.query({
      query: ({ username }) => ({
        url: `/mine/state?username=${username}`,
        method: "GET",
      }),
      providesTags: ["mining"],
    }),

    startMining: builder.mutation({
      query: ({ username }) => ({
        url: `/mine/start?username=${username}`,
        method: "POST",
        // body: { username, points },
      }),
    }),
    claimMining: builder.mutation({
      query: ({ data }) => ({
        url: `/mine/claim`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "mining"],
    }),

    getReferrals: builder.query({
      query: ({ username }) => ({
        url: `/user/referrals?username=${username}`,
        method: "GET",
      }),
    }),
    getMilestones: builder.query({
      query: ({ username }) => ({
        url: `/milestone/${username}`,
        method: "GET",
      }),
      providesTags: ["milestone"],
    }),
    getLeaderBoard: builder.query({
      query: () => ({
        url: `/user/leaderboard`,
        method: "GET",
      }),
    }),

    sendPoints: builder.mutation({
      query: ({ username, points }) => ({
        url: `/user/send-points`,
        method: "POST",
        body: { username, points },
      }),
    }),
    onboardUser: builder.mutation({
      query: ({ username }) => ({
        url: `/user/onboard`,
        method: "POST",
        body: { username },
      }),
    }),
    getUserTasks: builder.query({
      query: ({ username }) => ({
        url: `/task/${username}`,
        method: "GET",
      }),
      providesTags: ["tasks"],
    }),
    checkBonus: builder.query({
      query: ({ username }) => ({
        url: `/bonus/check/${username}`,
        method: "GET",
      }),
      providesTags: ["bonus"],
    }),
    getSingleTask: builder.query({
      query: ({ slug }) => ({
        url: `/task/${slug}`,
        method: "GET",
      }),
    }),
    completeTask: builder.mutation({
      query: ({ slug, reqData }) => ({
        url: `/task/${slug}/complete`,
        method: "POST",
        body: reqData,
      }),
      invalidatesTags: ["tasks"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetReferralsQuery,
  useSendPointsMutation,
  useGetUserTasksQuery,
  useGetSingleTaskQuery,
  useCompleteTaskMutation,
  useGetLeaderBoardQuery,
  useOnboardUserMutation,
  useGetMilestonesQuery,
  useGetUserPointsQuery,
  useGetMiningStateQuery,
  useCheckBonusQuery,
  useStartMiningMutation,
  useClaimMiningMutation,
} = userSlice;
