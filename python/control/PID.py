import math
import numpy as np


def get_track_point(waypoints):
    mind = 10000
    theta = 0
    pt1 = None
    pt2 = None
    for j in range(len(waypoints)-1):
        (x1, y1) = waypoints[j]
        (x2, y2) = waypoints[j+1]
        d = (x1 * y2 - x2 * y1)**2 / ((x2 - x1)**2 + (y2 - y1)**2)
        if x1 * x1 + y1 * y1 < 10 and d < mind:  # TODO
            mind = d
            theta = math.acos((x2 - x1) / ((x2 - x1)**2 + (y2 - y1)**2)**.5)
            pt1 = np.array(waypoints[j])
            pt2 = np.array(waypoints[j+1])
    return pt1, pt2


class PID:
    def __init__(self, Kp, Ki, Kd, set_point):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.set_point = set_point
        self.int_term = 0
        self.derivative_term = 0
        self.prev_error = None

    def get_control(self, **kwargs):
        measurement = kwargs['measurement']
        dt = kwargs['dt']
        error = self.set_point - measurement
        self.int_term += error * self.Ki * dt
        if self.prev_error is not None:
            self.derivative_term = (error-self.prev_error) / dt * self.Kd
        self.prev_error = error
        return self.Kp * error + self.int_term + self.derivative_term


class PIDHandle(PID):
    def get_control(self, **kwargs):
        waypoints = kwargs['waypoints']
        heading = kwargs['heading']

        next = [(x, y) for (x, y) in waypoints if x > 0]
        if not next:
            y = 0
        else:
            (_, y) = next[0]

        return super().get_control(measurement=-y, dt=kwargs['dt'])
