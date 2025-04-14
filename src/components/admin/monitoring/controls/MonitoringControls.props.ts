
import { MonitoringConfiguration } from "@/utils/monitoring/types";

export interface MonitoringControlsProps {
  redisConnected?: boolean;
  onConfigUpdate?: () => Promise<void>;
}
