import * as healthService from "../services/health.service.js";

export const getHealth = async (req, res) => {
  const startTime = Date.now();

  try {
    const dbStatus = await healthService.checkDatabase();
    const responseTime = Date.now() - startTime;

    const isHealthy = dbStatus.connected;
    const statusCode = isHealthy ? 200 : 503;

    return res.status(statusCode).json({
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: dbStatus.connected ? "connected" : "disconnected",
      ...(dbStatus.error && { dbError: dbStatus.error }),
    });
  } catch (error) {
    return res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      message: error.message,
    });
  }
};
