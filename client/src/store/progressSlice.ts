import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProgressState {
  season: number;
  episode: number;
}

const initialState: ProgressState = {
  season: 1,
  episode: 0,
};

export const progressSlice = createSlice({
  name: 'progrss',
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<ProgressState>) => {
      state.season = action.payload.season;
      state.episode = action.payload.episode;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateProgress } = progressSlice.actions

export default progressSlice.reducer;