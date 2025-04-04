import { createSlice } from '@reduxjs/toolkit';

const initialDesktopState = {
  selectedCategories: [],
  searchValue: '',
  filteredResults: [],
  isDropdownOpen: false,
  isManualSelection: false,
  buttonsOffset: 0,
  dropdownStyle: {},
  isSearchExpanded: false,
};

const initialState = {
  desktop: { ...initialDesktopState },
  mobile: {
    searchValue: '',
    selectedCategories: [],
    isOverlayOpen: false,
    prevSearchValue: '',
    prevSelectedCategory: null,
    mobileInput: '',
  },
};

const journal_categoryFiltersSlice = createSlice({
  name: 'categoryFilters',
  initialState,
  reducers: {
    setDesktopSelectedCategories(state, action) {
      state.desktop.selectedCategories = action.payload;
    },
    setDesktopSearchValue(state, action) {
      state.desktop.searchValue = action.payload;
    },
    setDesktopFilteredResults(state, action) {
      state.desktop.filteredResults = action.payload;
    },
    setDesktopIsDropdownOpen(state, action) {
      state.desktop.isDropdownOpen = action.payload;
    },
    setDesktopIsManualSelection(state, action) {
      state.desktop.isManualSelection = action.payload;
    },
    setDesktopButtonsOffset(state, action) {
      state.desktop.buttonsOffset = action.payload;
    },
    setDesktopDropdownStyle(state, action) {
      state.desktop.dropdownStyle = action.payload;
    },
    setDesktopIsSearchExpanded(state, action) {
      state.desktop.isSearchExpanded = action.payload;
    },
    resetDesktopSearchState(state) {
      state.desktop = { ...initialDesktopState };
    },
    setMobileSearchValue(state, action) {
      state.mobile.searchValue = action.payload;
    },
    setMobileSelectedCategories(state, action) {
      state.mobile.selectedCategories = action.payload;
    },
    setMobileIsOverlayOpen(state, action) {
      state.mobile.isOverlayOpen = action.payload;
    },
    setMobilePrevSearchValue(state, action) {
      state.mobile.prevSearchValue = action.payload;
    },
    setMobilePrevSelectedCategory(state, action) {
      state.mobile.prevSelectedCategory = action.payload;
    },
    setMobileInput(state, action) {
      state.mobile.mobileInput = action.payload;
    },
  },
});

export const {
  setDesktopSelectedCategories,
  setDesktopSearchValue,
  setDesktopFilteredResults,
  setDesktopIsDropdownOpen,
  setDesktopIsManualSelection,
  setDesktopButtonsOffset,
  setDesktopDropdownStyle,
  setDesktopIsSearchExpanded,
  resetDesktopSearchState,
  setMobileSearchValue,
  setMobileSelectedCategories,
  setMobileIsOverlayOpen,
  setMobilePrevSearchValue,
  setMobilePrevSelectedCategory,
  setMobileInput,
} = journal_categoryFiltersSlice.actions;

export default journal_categoryFiltersSlice.reducer;
