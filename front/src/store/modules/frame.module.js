import { getFrames, getFrame, addFrame, updateFrame, deleteFrame } from "@/api/frame";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    frame: null,
    frames: [],
  },

  getters: {
    framesForSelect(state) {
      const frames = state.frames;

      return frames.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_FRAME(state, frame = null) {
      state.frame = frame;
    },

    SET_FRAMES(state, frames) {
      if (frames.length) {
        state.frames = [...frames];
      } else if (!Array.isArray(frames)) {
        state.frames.push(frames);
      }
    },

    UPDATE_FRAME(state, frame) {
      state.frames = updateArray(state.frames, [frame]);
    },

    DELETE_FRAME(state, frameId) {
      state.frames = state.frames.filter((frame) => frame.id !== frameId);
    },
  },

  actions: {
    async getFrame(context, frameId) {
      if (!frameId) return;

      const response = await getFrame(frameId);

      context.commit("SET_FRAME", response);
    },

    async getFrames(context) {
      if (context.state.frames.length && context.state.frames.length !== 1) return;

      const response = await getFrames();

      context.commit("SET_FRAMES", response);
    },

    async addFrame(context, frame) {
      const response = await addFrame(frame);

      context.commit("SET_FRAMES", response);
    },

    async updateFrame(context, frame) {
      const response = await updateFrame(frame);

      context.commit("UPDATE_FRAME", response);
    },

    async deleteFrame(context, { frameId, delaySuccessNotify = false }) {
      await deleteFrame(frameId, delaySuccessNotify);

      context.commit("DELETE_FRAME", frameId);
    },
  },
};
