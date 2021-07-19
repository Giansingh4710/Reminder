export const initialState = {
  showInputModal: false,
  allReminders: [], //list of objs
};

export const actions = {
  setInputModal: {
    type: "SET_INPUT_MODAL",
  },
  addReminder: (theReminder) => {
    return {
      type: "ADD_REMINDER",
      reminder: theReminder,
    };
  },
  deleteReminder: (theReminderId) => {
    return {
      type: "DELETE_REMINDER",
      reminderId: theReminderId,
    };
  },
  deleteAllReminders: {
    type: "DELETE_ALL",
  },
};

export const reducer = (state, action) => {
  if (action.type === "SET_INPUT_MODAL") {
    return {
      ...state,
      showInputModal: !state.showInputModal,
    };
  }
  if (action.type === "ADD_REMINDER") {
    return {
      ...state,
      allReminders: [...state.allReminders, action.reminder],
    };
  }
  if (action.type === "DELETE_REMINDER") {
    const newReminders = state.allReminders.filter(
      (reminder) => reminder.id !== action.reminderId
    );
    return {
      ...state,
      allReminders: newReminders,
    };
  }
  if (action.type === "DELETE_ALL") {
    return {
      ...state,
      allReminders: [],
    };
  }
  return state;
};
