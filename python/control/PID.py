import math


def get_curvature(waypoints):
    mind = 10000
    theta = 0
    for j in range(len(waypoints)-1):
        (x1, y1) = waypoints[j]
        (x2, y2) = waypoints[j+1]
        d = (x1 * y2 - x2 * y1)**2 / ((x2 - x1)**2 + (y2 - y1)**2)
        if d < mind:
            mind = d
            theta = math.acos((x2 - x1) / ((x2 - x1)**2 + (y2 - y1)**2)**.5)
    return theta


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
        theta = get_curvature(waypoints)
        print(theta, heading)
        return super().get_control(measurement=theta, dt=kwargs['dt'])
