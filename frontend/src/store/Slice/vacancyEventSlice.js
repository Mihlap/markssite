import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

export const postEventData = createAsyncThunk(
  'events/postEventData',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${serverHost}/api-events/save-event-details`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        dispatch(fetchEvents());
      }
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api-events/get-events`);
    return response.data;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных: ' + error.message);
  }
});

export const fetchEventDetails = createAsyncThunk('events/fetchEventDetails', async (eventId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api-events/get-event/${eventId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных мероприятия: ' + error.message);
  }
});

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${serverHost}/api-events/get-event/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных мероприятия: ' + error.message);
  }
});

export const editEvent = createAsyncThunk('events/editEvent', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${serverHost}/api-events/update-event/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue('Не удалось обновить мероприятия');
    }
  } catch (error) {
    return rejectWithValue('Ошибка при обновлении мероприятия: ' + error.message);
  }
});

export const updateEventsOrder = createAsyncThunk('events/updateEventsOrder', async (events, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${serverHost}/api-events/update-event-order`, {
      events: events.map((event, index) => ({
        id: event.id,
        order: index,
      })),
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении порядка мероприятий на сервере:', error);
    return rejectWithValue('Ошибка при обновлении порядка мероприятий: ' + error.message);
  }
});

export const toggleEventVisibility = createAsyncThunk(
  'events/toggleEventVisibility',
  async ({ id, hidden }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`${serverHost}/api-events/toggle-event/${id}`, { hidden });
      if (response.status === 200) {
        dispatch(updateEventVisibility({ id, hidden }));
        dispatch(fetchEvents());
      }
      return response.data;
    } catch (error) {
      console.error('Ошибка при переключении видимости мероприятия:', error);
      return rejectWithValue('Ошибка при переключении видимости мероприятия: ' + error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${serverHost}/api-events/delete-event/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue('Ошибка при удалении мероприятия: ' + error.message);
  }
});

const formAddEventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetEventsState(state) {
      state.slides = [];
      state.isLoading = false;
      state.error = null;
    },
    updateEventVisibility(state, action) {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index].hidden = action.payload.hidden;
        state.events = [...state.events];
      }
    },
    updateEventsOrderLocally(state, action) {
      state.events = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(postEventData.fulfilled, (state, action) => {
        state.events = [...state.events, action.payload];
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = { ...state.events[index], ...action.payload };
        } else {
          console.warn('Slide not found for update, adding new slide.');
          state.events.push(action.payload);
        }
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        const existingIndex = state.events.findIndex((event) => event.id === action.payload.id);
        if (existingIndex !== -1) {
          state.events[existingIndex] = action.payload;
        } else {
          state.events.push(action.payload);
        }
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        console.error('Ошибка при получении данных мероприятия:', action.payload);
        state.error = action.payload;
      })
      .addCase(updateEventsOrder.fulfilled, (state, action) => {
        state.events = action.payload.events;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
        state.events = [...state.events];
      });
  },
});

export const { resetEventsState, updateEventVisibility, updateEventsOrderLocally } = formAddEventSlice.actions;

export default formAddEventSlice.reducer;
