from collections import deque
import time


class RateTracker:
    def __init__(self, request_count: int, request_window: int):
        self.tracker = {}
        self.request_count = request_count
        self.request_window = request_window

    def add_entry(self, id) -> bool:
        tracker = self.tracker  # Alias for convenience

        if id not in tracker:
            tracker[id] = deque()

        user_record = tracker[id]
        
        now = time.monotonic()

        user_record.append(now)

        # Trim the list for the last N seconds
        while now - user_record[0] > self.request_window:
            user_record.popleft()

        if len(user_record) >self.request_count:
            return False
        
        return True
    
    # TODO: Add periodic cleanup for this data structure