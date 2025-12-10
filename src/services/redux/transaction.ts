import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialProp = {
    type: string,
    token: string,
    address: string,
    network: string,
    icon: string
    name: string
    transferType?: "external" | "username"
    recipientUsername?: string
}

const initialState: InitialProp = {
    type: "",
    token: "USDT",
    address: "",
    network: "bsc",
    icon: "",
    name: "",
    transferType: "external",
    recipientUsername: ""
}

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        setTransaction: (state, action: PayloadAction<InitialProp>) => {
            state.type = action.payload.type;
            state.token = action.payload.token;
            state.address = action.payload.address;
            state.network = action.payload.network;
            state.icon = action.payload.icon;
            state.name = action.payload.name;
            state.transferType = action.payload.transferType || "external";
            state.recipientUsername = action.payload.recipientUsername || "";
        },
        clearTransaction: (state) => {
            state.type = "";
            state.token = "USDT";
            state.address = "";
            state.network = "bsc";
            state.icon = "";
            state.name = "";
            state.transferType = "external";
            state.recipientUsername = "";
        },

        setType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },

        setNetwork: (state, action: PayloadAction<string>) => {
            state.network = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setTransferType: (state, action: PayloadAction<"external" | "username">) => {
            state.transferType = action.payload;
        },
        setRecipientUsername: (state, action: PayloadAction<string>) => {
            state.recipientUsername = action.payload;
        }
    }
})

export const { setTransaction, setType, setToken, setAddress, clearTransaction, setTransferType, setRecipientUsername } = transactionSlice.actions;
export default transactionSlice.reducer;