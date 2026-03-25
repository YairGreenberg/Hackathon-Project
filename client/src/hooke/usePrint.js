import axios from "axios";
import {create} from "zustand";

export const usePrint = create((set) => ({
  message: "",
  error: "",
  loading: false,
  sendToPrint: async (id) => {
    set({loading: true});
    try {
      // -- add url --
      const url = "";
      const {data} = await axios.post(url, {id});
      set({message: data});
    } catch (error) {
      console.error(error.message);
      set({error: error.message});
    } finally {
      set({loading: false});
    }
  },
}));
