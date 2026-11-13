import sys
import logging

utilities_logger = logging.getLogger('utilities_logger')
stdout = logging.StreamHandler(stream=sys.stdout)
fmt = logging.Formatter("%(asctime)s %(name)s: %(levelname)s | %(filename)s:%(lineno)s ~ %(message)s")
stdout.setFormatter(fmt)
utilities_logger.addHandler(stdout)
utilities_logger.setLevel(logging.INFO)