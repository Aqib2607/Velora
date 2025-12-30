import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Globe, 
  Terminal,
  Lock,
  Eye,
  Zap
} from "lucide-react";

const generateLogEntry = () => {
  const ips = [
    "192.168.1.45",
    "10.0.0.123",
    "172.16.0.88",
    "203.45.67.89",
    "45.123.67.89",
    "89.234.56.12",
  ];
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const endpoints = [
    "/api/users",
    "/api/products",
    "/api/auth/login",
    "/api/orders",
    "/api/admin/dashboard",
    "/api/payment/process",
  ];
  const statuses = [
    { code: 200, color: "text-matrix-green" },
    { code: 201, color: "text-matrix-green" },
    { code: 401, color: "text-alert-red" },
    { code: 403, color: "text-alert-red" },
    { code: 500, color: "text-yellow-500" },
  ];

  const ip = ips[Math.floor(Math.random() * ips.length)];
  const method = methods[Math.floor(Math.random() * methods.length)];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const timestamp = new Date().toISOString().split("T")[1].slice(0, 12);

  return { ip, method, endpoint, status, timestamp };
};

const worldLocations = [
  { x: 20, y: 30, name: "New York" },
  { x: 50, y: 25, name: "London" },
  { x: 75, y: 35, name: "Tokyo" },
  { x: 30, y: 60, name: "São Paulo" },
  { x: 55, y: 50, name: "Mumbai" },
  { x: 85, y: 70, name: "Sydney" },
  { x: 45, y: 40, name: "Dubai" },
  { x: 15, y: 45, name: "Los Angeles" },
];

export default function SecurityPanel() {
  const [logs, setLogs] = useState<ReturnType<typeof generateLogEntry>[]>([]);
  const [threats, setThreats] = useState(127);
  const [activeUsers, setActiveUsers] = useState(1543);
  const [requestsPerMin, setRequestsPerMin] = useState(2847);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 15 }, generateLogEntry);
    setLogs(initialLogs);

    // Add new logs periodically
    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-50), generateLogEntry()]);
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 10) - 5);
      setRequestsPerMin((prev) => prev + Math.floor(Math.random() * 100) - 50);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen theme-security bg-background text-foreground font-mono">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,197,94,0.1)_2px,rgba(34,197,94,0.1)_4px)]" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-matrix-green/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-matrix-green matrix-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-matrix-green matrix-glow">
                SECURITY PANEL
              </h1>
              <p className="text-xs text-matrix-dark">
                System Status: <span className="text-matrix-green">ONLINE</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-matrix-green animate-pulse" />
            <span className="text-sm text-matrix-green">LIVE</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Eye, label: "Active Users", value: activeUsers, color: "text-matrix-green" },
            { icon: Zap, label: "Requests/min", value: requestsPerMin, color: "text-matrix-green" },
            { icon: AlertTriangle, label: "Threats Blocked", value: threats, color: "text-alert-red" },
            { icon: Lock, label: "Uptime", value: "99.99%", color: "text-matrix-green" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg border border-matrix-green/30 bg-card/50"
            >
              <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-matrix-dark">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Log Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-matrix-green/30 bg-card/50 overflow-hidden"
          >
            <div className="flex items-center gap-2 p-4 border-b border-matrix-green/30">
              <Terminal className="h-5 w-5 text-matrix-green" />
              <span className="font-bold text-matrix-green">LIVE REQUEST LOG</span>
            </div>
            <div
              ref={logContainerRef}
              className="h-80 overflow-y-auto p-4 space-y-1 terminal-text custom-scrollbar"
            >
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="text-matrix-dark">[{log.timestamp}]</span>
                  <span className="text-yellow-500">{log.ip}</span>
                  <span className="text-cyan-400">{log.method}</span>
                  <span className="text-muted-foreground">{log.endpoint}</span>
                  <span className={log.status.color}>{log.status.code}</span>
                </motion.div>
              ))}
              <span className="inline-block w-2 h-4 bg-matrix-green animate-terminal-blink" />
            </div>
          </motion.div>

          {/* Threat Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border border-matrix-green/30 bg-card/50 overflow-hidden"
          >
            <div className="flex items-center gap-2 p-4 border-b border-matrix-green/30">
              <Globe className="h-5 w-5 text-matrix-green" />
              <span className="font-bold text-matrix-green">GLOBAL ACTIVITY MAP</span>
            </div>
            <div className="relative h-80 p-4">
              {/* World Map Background */}
              <div className="absolute inset-4 border border-matrix-green/20 rounded-lg overflow-hidden">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`h-${i}`}
                      className="absolute w-full h-px bg-matrix-green/10"
                      style={{ top: `${(i + 1) * 12.5}%` }}
                    />
                  ))}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute h-full w-px bg-matrix-green/10"
                      style={{ left: `${(i + 1) * 8.33}%` }}
                    />
                  ))}
                </div>

                {/* Activity Points */}
                {worldLocations.map((loc, i) => (
                  <motion.div
                    key={loc.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="absolute"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  >
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-matrix-green animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-matrix-green/50 animate-ping" />
                    </div>
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-matrix-green whitespace-nowrap">
                      {loc.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-lg border border-matrix-green/30 bg-card/50 p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-matrix-green" />
            <span className="font-bold text-matrix-green">NETWORK ACTIVITY (24H)</span>
          </div>
          <div className="h-32 flex items-end gap-1">
            {[...Array(48)].map((_, i) => {
              const height = 20 + Math.random() * 80;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + i * 0.02 }}
                  className="flex-1 rounded-t bg-matrix-green/60"
                  style={{
                    boxShadow: height > 70 ? "0 0 10px rgba(34, 197, 94, 0.5)" : undefined,
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
