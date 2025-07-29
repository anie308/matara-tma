import { apiSlice } from "../api";

const userSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ username }) => ({
        url: `/user/get-user?username=${username}`,
        method: "GET",
      }),
    }),
    getUserPoints: builder.query({
      query: ({ username }) => ({
        url: `/user/points?username=${username}`,
        method: "GET",
      }),
    }),
    getReferrals: builder.query({
      query: ({ username }) => ({
        url: `/user/referrals?username=${username}`,
        method: "GET",
      }),
    }),
    getMilestones: builder.query({
      query: ({ username }) => ({
        url: `milestone/${username}`,
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
    getBoosts: builder.query({
      query: ({ username }) => ({
        url: `/boost/${username}`,
        method: "GET",
      }),
      providesTags: ["boosts"],
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
    purchaseBoost: builder.mutation({
      query: (data) => ({
        url: `/boost/purchase`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["boosts"],

    }),
    claimMilestone: builder.mutation({
      query: (data) => ({
        url: `/milestone/complete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["milestone"],
    }),
    collectBonus: builder.mutation({
      query: (data) => ({
        url: `/bonus/collect`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bonus"],
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
  useClaimMilestoneMutation,
  useGetUserPointsQuery,
  useGetBoostsQuery,
  usePurchaseBoostMutation,
  useCheckBonusQuery,
  useCollectBonusMutation,
} = userSlice;
