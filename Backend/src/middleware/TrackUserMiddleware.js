import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

export const trackUserActivity = (req, res, next) => {
  // Get IP address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Parse user-agent for detailed device info
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  // Get approximate location using IP
  const geo = geoip.lookup(ip);

  req.userActivity = {
    ip: ip,
    browser: result.browser.name,
    os: result.os.name + " " + result.os.version,
    device: result.device.vendor ? `${result.device.vendor} ${result.device.model}` : "Unknown",
    location: geo ? `${geo.city}, ${geo.country}` : "Unknown",
  };

  next();
};
