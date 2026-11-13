import sys
import logging

models_logger = logging.getLogger('models_logger')
stdout = logging.StreamHandler(stream=sys.stdout)
fmt = logging.Formatter("%(asctime)s %(name)s: %(levelname)s | %(filename)s:%(lineno)s ~ %(message)s")
stdout.setFormatter(fmt)
models_logger.addHandler(stdout)
models_logger.setLevel(logging.INFO)