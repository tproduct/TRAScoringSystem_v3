import { createSlice } from "@reduxjs/toolkit";
import {
  handleAsyncActions,
  fetchCompetitionData,
  createCompetitionData,
  updateCompetitionData,
  deleteCompetitionData,
} from "./asyncThunks";
import { devData } from "../files/devData";

// const initialState = devData;

const initialState = {
  loading: false,
  error: null,
  info: null,
  categories: null,
  rules: {
    qualify: null,
    semifinal: null,
    final: null
  },
  routines:{
    qualify: null,
    semifinal: null,
    final: null
  },
  players:{
    individual: null,
    syncronized: null
  },
  teams:null,
  orders:{
    individual: {
      qualify: null,
      semifinal: null,
      final: null
    },
    syncronized: {
      qualify: null,
      semifinal: null,
      final: null,
    }
  },
  scores: {},
};

export const competitionSlice = createSlice({
  name: "comp",
  initialState,
  reducers: {
    setCompetition(state, action){
      state.info = action.payload.info;
      state.categories = action.payload.categories;
      state.rules = action.payload.rules;
      state.routines = action.payload.routines;
      state.players = action.payload.players;
      state.teams = action.payload.teams;
      state.orders = action.payload.orders;
      state.scores = action.payload.scores;
    },
    setCompetitionInfo(state, action) {
      state.info = action.payload;
    },
    setCategories(state, action) {
      state.categories = action.payload;
      
    },
    setRoutines(state, action) {
      state.routines = action.payload;
    },
    setQualifyRules(state, action) {
      state.rules.qualify = action.payload;
    },
    setSemifinalRules(state, action) {
      state.rules.semifinal = action.payload;
    },
    setFinalRules(state, action) {
      state.rules.final = action.payload;
    },
    setQualifyRoutines(state, action) {
      state.routines.qualify = action.payload;
    },
    setSemifinalRoutines(state, action) {
      state.routines.semifinal = action.payload;
    },
    setFinalRoutines(state, action) {
      state.routines.final = action.payload;
    },
    setIndividualPlayers(state, action) {
      state.players.individual = action.payload;
    },
    setSyncronizedPlayers(state, action) {
      state.players.syncronized = action.payload;
    },
    setTeams(state, action){
      state.teams = action.payload;
    },
    setOrders(state, action){
      state.orders = action.payload;
    },
    setScores(state, action){
      state.scores = action.payload;
    },
    resetRules(state) {
      state.rules.qualify = [];
      state.rules.semifinal = [];
      state.rules.final = [];
    },
    resetCompetition(state) {
      state.info = null;
      state.categories = null;
      state.routines = {
        qualify: null,
        semifinal: null,
        final: null
      };
      state.rules = {
        qualify: null,
        semifinal: null,
        final: null
      };
      state.players = {
        individual: null,
        syncronized: null
      };
    },
  },
  // extraReducers: (builder) => {
  //   handleAsyncActions(builder, fetchCompetitionData);
  //   handleAsyncActions(builder, createCompetitionData);
  //   handleAsyncActions(builder, updateCompetitionData);
  //   handleAsyncActions(builder, deleteCompetitionData);
  // },
});

const createPlayersFormData = (playersData, categoryIds) => {
  return categoryIds.reduce((acc, id) => {
    return [
      ...acc,
      {
        category_id: id,
        players: playersData.filter(
          (player) => player.category_id === id
        ),
      },
    ];
  }, []);
};

export const {
  setCompetition,
  setCompetitionInfo,
  setCategories,
  setQualifyRules,
  setSemifinalRules,
  setFinalRules,
  setQualifyRoutines,
  setSemifinalRoutines,
  setFinalRoutines,
  setIndividualPlayers,
  setSyncronizedPlayers,
  setTeams,
  setOrders,
  setScores,
  resetCompetition,
} = competitionSlice.actions;
export default competitionSlice.reducer;
