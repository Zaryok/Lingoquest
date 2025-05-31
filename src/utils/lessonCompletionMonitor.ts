// Lesson Completion Monitoring Utility
// This utility helps track and debug lesson completion issues

interface CompletionEvent {
  timestamp: number;
  event: string;
  data?: any;
  lessonId?: string;
  userId?: string;
}

class LessonCompletionMonitor {
  private events: CompletionEvent[] = [];
  private startTime: number | null = null;
  private completionTimeout: NodeJS.Timeout | null = null;

  startMonitoring(lessonId: string, userId: string) {
    this.startTime = Date.now();
    this.events = [];
    this.logEvent('MONITORING_STARTED', { lessonId, userId });
    
    // Set a watchdog timer
    this.completionTimeout = setTimeout(() => {
      this.logEvent('COMPLETION_TIMEOUT_WARNING', { 
        duration: Date.now() - (this.startTime || 0),
        message: 'Lesson completion taking longer than expected'
      });
      console.warn('🚨 Lesson completion timeout warning - check for stuck state');
    }, 6000);
  }

  logEvent(event: string, data?: any) {
    const eventData: CompletionEvent = {
      timestamp: Date.now(),
      event,
      data
    };
    
    this.events.push(eventData);
    
    const duration = this.startTime ? Date.now() - this.startTime : 0;
    console.log(`📊 [${duration}ms] ${event}:`, data);
  }

  completionSuccess() {
    if (this.completionTimeout) {
      clearTimeout(this.completionTimeout);
      this.completionTimeout = null;
    }
    
    const duration = this.startTime ? Date.now() - this.startTime : 0;
    this.logEvent('COMPLETION_SUCCESS', { totalDuration: duration });
    
    if (duration > 3000) {
      console.warn(`⚠️ Lesson completion took ${duration}ms - consider optimization`);
    } else {
      console.log(`✅ Lesson completed successfully in ${duration}ms`);
    }
  }

  completionError(error: any) {
    if (this.completionTimeout) {
      clearTimeout(this.completionTimeout);
      this.completionTimeout = null;
    }
    
    const duration = this.startTime ? Date.now() - this.startTime : 0;
    this.logEvent('COMPLETION_ERROR', { error: error.message, totalDuration: duration });
    console.error(`❌ Lesson completion failed after ${duration}ms:`, error);
  }

  getReport() {
    const duration = this.startTime ? Date.now() - this.startTime : 0;
    return {
      totalDuration: duration,
      events: this.events,
      eventCount: this.events.length,
      averageEventTime: this.events.length > 0 ? duration / this.events.length : 0
    };
  }

  reset() {
    if (this.completionTimeout) {
      clearTimeout(this.completionTimeout);
      this.completionTimeout = null;
    }
    this.startTime = null;
    this.events = [];
  }
}

// Global instance
export const lessonMonitor = new LessonCompletionMonitor();

// Helper functions for common monitoring scenarios
export const monitorLessonStart = (lessonId: string, userId: string) => {
  lessonMonitor.startMonitoring(lessonId, userId);
};

export const monitorStepCompletion = (stepIndex: number, isCorrect: boolean) => {
  lessonMonitor.logEvent('STEP_COMPLETED', { stepIndex, isCorrect });
};

export const monitorProfileUpdate = (updateType: string) => {
  lessonMonitor.logEvent('PROFILE_UPDATE_START', { updateType });
};

export const monitorProfileUpdateComplete = (updateType: string, success: boolean) => {
  lessonMonitor.logEvent('PROFILE_UPDATE_COMPLETE', { updateType, success });
};

export const monitorNavigation = (destination: string) => {
  lessonMonitor.logEvent('NAVIGATION_START', { destination });
};

export const monitorNavigationComplete = (destination: string) => {
  lessonMonitor.logEvent('NAVIGATION_COMPLETE', { destination });
  lessonMonitor.completionSuccess();
};

export const monitorError = (error: any, context: string) => {
  lessonMonitor.logEvent('ERROR_OCCURRED', { error: error.message, context });
};

export const monitorTimeout = (operation: string, timeoutMs: number) => {
  lessonMonitor.logEvent('TIMEOUT_SET', { operation, timeoutMs });
};

export const monitorTimeoutTriggered = (operation: string) => {
  lessonMonitor.logEvent('TIMEOUT_TRIGGERED', { operation });
};

// Development helper to log completion report
export const logCompletionReport = () => {
  if (process.env.NODE_ENV === 'development') {
    const report = lessonMonitor.getReport();
    console.group('📋 Lesson Completion Report');
    console.log('Total Duration:', report.totalDuration + 'ms');
    console.log('Event Count:', report.eventCount);
    console.log('Average Event Time:', Math.round(report.averageEventTime) + 'ms');
    console.table(report.events);
    console.groupEnd();
  }
};
