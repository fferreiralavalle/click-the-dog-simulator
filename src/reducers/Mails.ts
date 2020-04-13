import GameManager from "../game/GameManager";

const types = {
  UPDATE_MAILS: "UPDATE_MAILS",
};

const INITIAL_STATE = {
  mails: [],
};

const mails = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case types.UPDATE_MAILS:
      return {
        ...state,
        mails: GameManager.getInstance()
          .getNotificationManager()
          .getAllNotifications(),
        unseen: GameManager.getInstance()
          .getNotificationManager()
          .getUnseenNotificationsAmount(),
      };
    default:
      return state;
  }
};

export const actions = {
  updateMails: () => ({ type: types.UPDATE_MAILS }),
};

export const selecters = {
  getMails: (state: any): Array<Notification> => state.mails.mails,
  getUnseenAmount: (state: any): number => state.mails.unseen,
};

export default mails;
