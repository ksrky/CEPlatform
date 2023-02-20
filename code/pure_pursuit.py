import math
import numpy as np

param_K_dd = 0.4


class PurePursuit:
    """
    Pure pursuit algorithm
    waypoints: x
    K_dd: Look ahead distance = K_dd * velocity
    wheal_base: x
    waypoint_shift: x
    """

    def __init__(self, waypoints, K_dd=param_K_dd, wheel_base=2.65, waypoint_shift=1.4):
        self.waypoints = waypoints
        self.K_dd = K_dd
        self.wheel_base = wheel_base
        self.waypoint_shift = waypoint_shift

    def circle_line_segment_intersection(circle_center, circle_radius, pt1, pt2, full_line=True, tangent_tol=1e-9):
        (p1x, p1y), (p2x, p2y), (cx, cy) = pt1, pt2, circle_center
        (x1, y1), (x2, y2) = (p1x - cx, p1y - cy), (p2x - cx, p2y - cy)
        dx, dy = (x2 - x1), (y2 - y1)
        dr = (dx ** 2 + dy ** 2)**.5
        big_d = x1 * y2 - x2 * y1
        discriminant = circle_radius ** 2 * dr ** 2 - big_d ** 2

        if discriminant < 0:
            return []
        else:
            intersections = [
                (cx + (big_d * dy + sign * (-1 if dy < 0 else 1) * dx * discriminant**.5) / dr ** 2,
                 cy + (-big_d * dx + sign * abs(dy) * discriminant**.5) / dr ** 2)
                for sign in ((1, -1) if dy < 0 else (-1, 1))]
            if not full_line:
                fraction_along_segment = [(xi - p1x) / dx if abs(dx) > abs(dy) else (yi - p1y) / dy for xi, yi in intersections]
                intersections = [pt for pt, frac in zip(intersections, fraction_along_segment) if 0 <= frac <= 1]
            if len(intersections) == 2 and abs(discriminant) <= tangent_tol:
                return [intersections[0]]
            else:
                return intersections

    def get_target_point(self, look_ahead_distance):
        intersections = []
        for j in range(len(self.waypoints)-1):
            pt1 = self.waypoints[j]
            pt2 = self.waypoints[j+1]
            intersections += self.circle_line_segment_intersection((0, 0), look_ahead_distance, pt1, pt2, full_line=False)
        filtered = [pt for pt in intersections if pt[0] > 0]
        if len(filtered) == 0:
            return None
        return filtered[0]

    def get_control(self, speed):
        self.waypoints[:, 0] += self.waypoint_shift
        look_ahead_distance = np.clip(self.K_dd * speed, 3, 20)

        track_point = self.get_target_point(look_ahead_distance)
        if track_point is None:
            return 0

        alpha = np.arctan2(track_point[1], track_point[0])

        steer = np.arctan((2 * self.wheel_base * np.sin(alpha)) / look_ahead_distance)

        self.waypoints[:, 0] -= self.waypoint_shift
