/**
 * Validate priority argument for gas command
 * @param priority - Priority level to validate
 * @throws Error if priority is invalid
 */
export const validateGasPriority = (priority: string | undefined): void => {
  if (!priority) return;

  const validPriorities = ['low', 'average', 'high'];
  if (!validPriorities.includes(priority.toLowerCase())) {
    throw new Error(
      `Invalid priority level: ${priority}. Must be one of: ${validPriorities.join(', ')}`
    );
  }
};
