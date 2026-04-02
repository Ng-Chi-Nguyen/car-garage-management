import activityService from "../services/activity/activity.service.js";

const activityController = {
  getActivityLogs: async (_req, res) => {
    const activityLogs = await activityService.getActivityLogs();
    return res.json({ success: true, data: { activityLogs } });
  },
  getActivityStats: async (_req, res) => {
    const activityStats = await activityService.getActivityStats();
    return res.json({ success: true, data: { activityStats } });
  },
};

export default activityController;
