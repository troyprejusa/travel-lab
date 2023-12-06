import sys
import logging

router_logger = logging.getLogger('router_logger')
stdout = logging.StreamHandler(stream=sys.stdout)
fmt = logging.Formatter("%(asctime)s %(name)s: %(levelname)s | %(filename)s:%(lineno)s ~ %(message)s")
stdout.setFormatter(fmt)
router_logger.addHandler(stdout)
router_logger.setLevel(logging.DEBUG)