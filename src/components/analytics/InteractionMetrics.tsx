
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { fetchInteractionEvents } from "@/hooks/analytics/use-analytics-api";

const InteractionMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([
    { 
      name: "Total Clicks", 
      value: "0", 
      change: 0, 
      isPositive: true 
    },
    { 
      name: "Avg. Time (sec)", 
      value: "0", 
      change: 0, 
      isPositive: true 
    },
    { 
      name: "Bounce Rate", 
      value: "0%", 
      change: 0, 
      isPositive: false 
    },
    { 
      name: "Click Density", 
      value: "Low", 
      note: "Below avg." 
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch and calculate metrics
  useEffect(() => {
    if (!user) return;
    
    const fetchMetrics = async () => {
      setIsLoading(true);
      
      try {
        // Fetch click events
        const clickEvents = await fetchInteractionEvents(user.id, 'click');
        
        // Calculate total clicks
        const totalClicks = clickEvents.length;
        
        // Calculate recent vs older clicks to determine change
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        
        const recentClicks = clickEvents.filter(
          e => new Date(e.timestamp) >= oneWeekAgo
        ).length;
        
        const olderClicks = clickEvents.filter(
          e => new Date(e.timestamp) >= twoWeeksAgo && new Date(e.timestamp) < oneWeekAgo
        ).length;
        
        // Calculate percentage change
        const clickChange = olderClicks === 0 
          ? 100 
          : Math.round(((recentClicks - olderClicks) / olderClicks) * 100);
        
        // Use session data to calculate average time
        const sessionData = groupEventsBySession(clickEvents);
        const avgTimePerSession = calculateAverageSessionTime(sessionData) || 0;
        
        // Calculate bounce rate (single-page sessions)
        const sessionCount = Object.keys(sessionData).length;
        const singlePageSessions = Object.values(sessionData).filter(
          session => new Set(session.map(e => e.page_url)).size === 1
        ).length;
        
        const bounceRate = sessionCount > 0
          ? Math.round((singlePageSessions / sessionCount) * 100)
          : 0;
        
        // Determine click density
        let clickDensity = "Low";
        let densityNote = "Below avg.";
        
        if (totalClicks > 1000) {
          clickDensity = "High";
          densityNote = "Above avg.";
        } else if (totalClicks > 500) {
          clickDensity = "Medium";
          densityNote = "Average";
        }
        
        // Update metrics
        setMetrics([
          { 
            name: "Total Clicks", 
            value: totalClicks.toLocaleString(), 
            change: clickChange, 
            isPositive: clickChange >= 0 
          },
          { 
            name: "Avg. Time (sec)", 
            value: avgTimePerSession.toFixed(1), 
            change: 0, 
            isPositive: true 
          },
          { 
            name: "Bounce Rate", 
            value: `${bounceRate}%`, 
            change: 0, 
            isPositive: false 
          },
          { 
            name: "Click Density", 
            value: clickDensity, 
            note: densityNote 
          },
        ]);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
  }, [user]);
  
  // Group events by session
  const groupEventsBySession = (events: any[]) => {
    const sessions: Record<string, any[]> = {};
    
    events.forEach(event => {
      if (!sessions[event.session_id]) {
        sessions[event.session_id] = [];
      }
      sessions[event.session_id].push(event);
    });
    
    return sessions;
  };
  
  // Calculate average session time
  const calculateAverageSessionTime = (sessions: Record<string, any[]>) => {
    const sessionTimes: number[] = [];
    
    Object.values(sessions).forEach(events => {
      if (events.length < 2) return;
      
      // Sort events by timestamp
      const sortedEvents = [...events].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Calculate time between first and last event
      const firstTime = new Date(sortedEvents[0].timestamp).getTime();
      const lastTime = new Date(sortedEvents[sortedEvents.length - 1].timestamp).getTime();
      const durationSeconds = (lastTime - firstTime) / 1000;
      
      if (durationSeconds > 0 && durationSeconds < 3600) { // Ignore sessions longer than an hour
        sessionTimes.push(durationSeconds);
      }
    });
    
    if (sessionTimes.length === 0) return 0;
    
    // Calculate average
    const total = sessionTimes.reduce((sum, time) => sum + time, 0);
    return total / sessionTimes.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center justify-between pb-2 last:pb-0 last:border-0 border-b border-gray-100">
          <span className="text-sm font-medium">{metric.name}</span>
          <div className="flex items-center">
            <span className="font-semibold">{metric.value}</span>
            {metric.change !== undefined && metric.change !== 0 && (
              <div className={`flex items-center ml-2 text-xs ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(metric.change)}%
              </div>
            )}
            {metric.note && (
              <span className="ml-2 text-xs text-muted-foreground">{metric.note}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InteractionMetrics;
