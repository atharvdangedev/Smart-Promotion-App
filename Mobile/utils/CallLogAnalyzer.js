// (DO NOT MESS WITH THIS FILE)

const CallTypes = {
  INCOMING_TYPE: 1,
  OUTGOING_TYPE: 2,
  MISSED_TYPE: 3,
  REJECTED_TYPE: 5,
};

/**
 * Analyzes a call log entry and returns a structured representation.
 * Determines the type of call based on the entry type and duration.
 *
 * @param {CallLogEntry} entry - The raw call log entry data.
 * @returns {AnalyzedCall | null} An object containing the analyzed call data,
 * including type, number, duration, and timestamp, or null if analysis fails.
 */
export function analyzeCallLogEntry(entry) {
  let type = 'unknown';

  switch (entry.type) {
    case CallTypes.INCOMING_TYPE:
      type = entry.duration > 0 ? 'incoming' : 'missed';
      break;
    case CallTypes.OUTGOING_TYPE:
      type = 'outgoing';
      break;
    case CallTypes.MISSED_TYPE:
      type = 'missed';
      break;
    case CallTypes.REJECTED_TYPE:
      type = 'rejected';
      break;
    default:
      type = 'unknown';
  }

  return {
    type,
    number: entry.number,
    duration: entry.duration,
    timestamp: entry.timestamp,
  };
}
