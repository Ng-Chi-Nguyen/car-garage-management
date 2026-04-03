import activityService from "../services/activity/activity.service.js";

const activityController = {
  getActivityLogs: async (req, res) => {
    const query = req.validatedQuery ?? req.query;
    const { activityLogs, pagination, filters } = await activityService.getActivityLogs(query);

    return res.json({
      success: true,
      data: {
        activityLogs,
        pagination,
        filters,
      },
    });
  },
  getActivityStats: async (req, res) => {
    const query = req.validatedQuery ?? req.query;
    const activityStats = await activityService.getActivityStats(query);

    return res.json({ success: true, data: { activityStats } });
  },
};

export default activityController;
