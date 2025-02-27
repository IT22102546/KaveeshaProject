import { createSlice,createAsyncThunk} from "@reduxjs/toolkit";


const initialState = {
    items: [],
    status :null,
    error : null,
};


export const studioFetch = createAsyncThunk(
  "studios/studiosFetch",
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await fetch("/api/studios/getstudios", { signal });
      if (!response.ok) {
        throw new Error("Failed to fetch studios");
      }
      const data = await response.json(); 
      return data;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

const studiosSlice = createSlice({
    name :"studios",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
          .addCase(studioFetch.pending, (state, action) => {
            state.status = "pending";
          })
          .addCase(studioFetch.fulfilled, (state, action) => {
            state.status = "success";
            state.items = action.payload;
          })
          .addCase(studioFetch.rejected, (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
          });
    },
});

export default studiosSlice.reducer;

