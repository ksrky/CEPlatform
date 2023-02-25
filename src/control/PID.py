class PID:
    def __init__(self, Kp, Ki, Kd, set_point):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.set_point = set_point
        self.int_term = 0
        self.derivative_term = 0
        self.last_error = None

    def get_control(self, measurement, dt):
        error = self.set_point - measurement
        self.int_term += error * self.Ki * dt
        if self.last_error is not None:
            self.derivative_term = (error-self.last_error) / dt * self.Kd
        self.last_error = error
        return self.Kp * error + self.int_term + self.derivative_term