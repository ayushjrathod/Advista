import { useEffect } from "react";

/**
 * Custom hook to handle Enter key submission for forms
 * @param {Function} onSubmit - Function to call when Enter is pressed
 * @param {boolean} isEnabled - Whether the hook is enabled
 * @param {Array} dependencies - Dependencies for the effect
 */
export const useEnterKeySubmit = (onSubmit, isEnabled = true, dependencies = []) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
        // Check if the target is not a textarea or if it's a single-line input
        const isTextarea = event.target.tagName === "TEXTAREA";
        const isMultiLineInput = event.target.getAttribute("rows") && parseInt(event.target.getAttribute("rows")) > 1;

        if (!isTextarea || !isMultiLineInput) {
          event.preventDefault();
          onSubmit(event);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSubmit, isEnabled, ...dependencies]);
};

/**
 * Custom hook to handle Escape key to close modals or reset forms
 * @param {Function} onEscape - Function to call when Escape is pressed
 * @param {boolean} isEnabled - Whether the hook is enabled
 */
export const useEscapeKey = (onEscape, isEnabled = true) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, isEnabled]);
};
