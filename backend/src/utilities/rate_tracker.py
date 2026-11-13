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

        # TODO: Make this data structure self-cleaning
        self.cleanup()

        if len(user_record) > self.request_count:
            return False
        
        return True
    
    def cleanup(self):
        # Do a (brute force) cleanup of this structure to remove old entries
        now = time.monotonic()
        remove_key = []
        for id, timestamps in self.tracker.items():
            if len(timestamps) > 0 and now - timestamps[-1] > self.request_window:
                remove_key.append(id)

        for rem in remove_key:
            self.tracker.pop(rem)
    