import { Radio, RadioType } from "../../state/radio";
import { RootState } from "../store";

export function getRadioForJob(state: RootState, job: string): Radio | undefined {
  return state.radios.radios
    .filter(radio => !radio.burned)
    .find(radio => radio.job === job);
}

export const getMainRadio = (state: RootState): Radio | undefined => {
  return state.radios.radios.find(radio => radio.type === RadioType.MAIN && !radio.burned);
}

export const getSlideRadio = (state: RootState): Radio | undefined => {
  return state.radios.radios.find(radio => radio.type === RadioType.SLIDE && !radio.burned);
}

export const getFriendsRadio = (state: RootState): Radio | undefined => {
  return state.radios.radios.find(radio => radio.type === RadioType.FRIENDS && !radio.burned);
}

export const getActiveRadios = (state: RootState): Radio[] => {
  return state.radios.radios
    .filter(radio => ![RadioType.MAIN, RadioType.FRIENDS, RadioType.SLIDE].includes(radio.type) && !radio.burned)
    .sort((a, b) => new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime());
}

export const getRecentlyBurnedRadios = (state: RootState): Radio[] => {
  return state.radios.radios
    .filter(radio => radio.burned && new Date().getTime() - new Date(radio.burnTime || "").getTime() < 3600000)
    .sort((a, b) => new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime());
}

export const getAllUsedChannels = (state: RootState): string[] => {
  return state.radios.radios.map(radio => radio.channel);
}