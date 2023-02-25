import numpy as np


def get_heading(theta):
    return np.arctan2(np.sin(theta), np.cos(theta))


class Vehicle:
    def __init__(self, x=0, y=0, velocity=0, heading=0, wheel_base=2):
        self.x = x
        self.y = y
        self.velocity = velocity
        self.heading = heading
        self.wheel_base = wheel_base

    def update(self, acc, dt, delta):
        self.x += self.velocity * np.cos(self.heading) * dt
        self.y += self.velocity * np.sin(self.heading) * dt
        ang_vel = self.velocity * np.tan(delta) / self.wheel_base
        self.heading = get_heading(self.heading + ang_vel * dt)
        self.velocity += acc * dt
