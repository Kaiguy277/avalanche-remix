// PostHog analytics utilities
declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, properties?: Record<string, unknown>) => void;
      reset: () => void;
    };
  }
}

export const analytics = {
  // Track custom events
  track: (event: string, properties?: Record<string, unknown>) => {
    if (window.posthog) {
      window.posthog.capture(event, properties);
    }
  },

  // Track page views with additional context
  pageView: (pageName: string, properties?: Record<string, unknown>) => {
    if (window.posthog) {
      window.posthog.capture('$pageview', {
        page_name: pageName,
        ...properties,
      });
    }
  },

  // Track tool usage
  toolUsed: (toolName: string, action: string, properties?: Record<string, unknown>) => {
    if (window.posthog) {
      window.posthog.capture('tool_used', {
        tool_name: toolName,
        action,
        ...properties,
      });
    }
  },

  // Track CTA clicks
  ctaClicked: (ctaName: string, location: string) => {
    if (window.posthog) {
      window.posthog.capture('cta_clicked', {
        cta_name: ctaName,
        location,
      });
    }
  },

  // Track form submissions
  formSubmitted: (formName: string, success: boolean, properties?: Record<string, unknown>) => {
    if (window.posthog) {
      window.posthog.capture('form_submitted', {
        form_name: formName,
        success,
        ...properties,
      });
    }
  },

  // Track file uploads
  fileUploaded: (toolName: string, fileType: string, fileSize?: number) => {
    if (window.posthog) {
      window.posthog.capture('file_uploaded', {
        tool_name: toolName,
        file_type: fileType,
        file_size: fileSize,
      });
    }
  },

  // Track errors
  errorOccurred: (errorType: string, errorMessage: string, context?: string) => {
    if (window.posthog) {
      window.posthog.capture('error_occurred', {
        error_type: errorType,
        error_message: errorMessage,
        context,
      });
    }
  },

  // Track external link clicks
  externalLinkClicked: (url: string, linkText: string) => {
    if (window.posthog) {
      window.posthog.capture('external_link_clicked', {
        url,
        link_text: linkText,
      });
    }
  },

  // Track navigation
  navigationClicked: (destination: string, source: string) => {
    if (window.posthog) {
      window.posthog.capture('navigation_clicked', {
        destination,
        source,
      });
    }
  },
};
