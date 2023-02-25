import numpy as np

# TODO: Tune parameters of PID with these global variables
param_Kp = 2
param_Ki = 0
param_Kd = 0
# TODO: Tune parameters of Pure Pursuit with these global variables
param_K_dd = 0.4
# The above parameters will be used in the Carla simulation
# The simple simulation in tests/control/control.ipynb does not use these parameters


class PurePursuit:
    def __init__(self, K_dd=param_K_dd, wheel_base=2.65, waypoint_shift=1.4):
        self.K_dd = K_dd
        self.wheel_base = wheel_base
        self.waypoint_shift = waypoint_shift

    def circle_line_segment_intersection(self, circle_center, circle_radius, pt1, pt2, full_line=True, tangent_tol=1e-9):
        """ Find the points at which a circle intersects a line-segment.  This can happen at 0, 1, or 2 points.
        :param circle_center: The (x, y) location of the circle center
        :param circle_radius: The radius of the circle
        :param pt1: The (x, y) location of the first point of the segment
        :param pt2: The (x, y) location of the second point of the segment
        :param full_line: True to find intersections along full line - not just in the segment.  False will just return intersections within the segment.
        :param tangent_tol: Numerical tolerance at which we decide the intersections are close enough to consider it a tangent
        :return Sequence[Tuple[float, float]]: A list of length 0, 1, or 2, where each element is a point at which the circle intercepts a line segment.
        Note: We follow: http://mathworld.wolfram.com/Circle-LineIntersection.html
        """

        (p1x, p1y), (p2x, p2y), (cx, cy) = pt1, pt2, circle_center
        (x1, y1), (x2, y2) = (p1x - cx, p1y - cy), (p2x - cx, p2y - cy)
        dx, dy = (x2 - x1), (y2 - y1)
        dr = (dx ** 2 + dy ** 2)**.5
        big_d = x1 * y2 - x2 * y1
        discriminant = circle_radius ** 2 * dr ** 2 - big_d ** 2

        if discriminant < 0:  # No intersection between circle and line
            return []
        else:  # There may be 0, 1, or 2 intersections with the segment
            intersections = [
                (cx + (big_d * dy + sign * (-1 if dy < 0 else 1) * dx * discriminant**.5) / dr ** 2,
                 cy + (-big_d * dx + sign * abs(dy) * discriminant**.5) / dr ** 2)
                for sign in ((1, -1) if dy < 0 else (-1, 1))]  # This makes sure the order along the segment is correct
            if not full_line:  # If only considering the segment, filter out intersections that do not fall within the segment
                fraction_along_segment = [(xi - p1x) / dx if abs(dx) > abs(dy) else (yi - p1y) / dy for xi, yi in intersections]
            intersections = [pt for pt, frac in zip(intersections, fraction_along_segment) if 0 <= frac <= 1]
            if len(intersections) == 2 and abs(discriminant) <= tangent_tol:  # If line is tangent to circle, return just one point (as both intersections have same location)
                return [intersections[0]]
            else:
                return intersections

    def get_target_point(self, lookahead, polyline):
        """ Determines the target point for the pure pursuit controller

        Parameters
        ----------
        lookahead : float
                The target point is on a circle of radius `lookahead`
                The circle's center is (0,0)
        poyline: array_like, shape (M,2)
                A list of 2d points that defines a polyline.

        Returns:
        --------
        target_point: numpy array, shape (,2)
                Point with positive x-coordinate where the circle of radius `lookahead`
                and the polyline intersect. 
                Return None if there is no such point.  
                If there are multiple such points, return the one that the polyline
                visits first.
        """
        intersections = []
        for j in range(len(polyline)-1):
            pt1 = polyline[j]
            pt2 = polyline[j+1]
            intersections += self.circle_line_segment_intersection((0, 0), lookahead, pt1, pt2, full_line=False)
        filtered = [p for p in intersections if p[0] > 0]
        if len(filtered) == 0:
            return None
        return filtered[0]

    def get_control(self, waypoints, speed):
        # transform x coordinates of waypoints such that coordinate origin is in rear wheel
        waypoints[:, 0] += self.waypoint_shift
        look_ahead_distance = np.clip(self.K_dd * speed, 3, 20)

        track_point = self.get_target_point(look_ahead_distance, waypoints)
        if track_point is None:
            return 0

        alpha = np.arctan2(track_point[1], track_point[0])

        # Change the steer output with the lateral controller.
        steer = np.arctan((2 * self.wheel_base * np.sin(alpha)) / look_ahead_distance)

        # undo transform to waypoints
        waypoints[:, 0] -= self.waypoint_shift
        return steer


class PIDController:
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
        self.int_term += error*self.Ki*dt
        if self.last_error is not None:
            self.derivative_term = (error-self.last_error)/dt*self.Kd
        self.last_error = error
        return self.Kp * error + self.int_term + self.derivative_term


class PurePursuitPlusPID:
    def __init__(self, pure_pursuit=PurePursuit(), pid=PIDController(param_Kp, param_Ki, param_Kd, 0)):
        self.pure_pursuit = pure_pursuit
        self.pid = pid

    def get_control(self, waypoints, speed, desired_speed, dt):
        self.pid.set_point = desired_speed
        a = self.pid.get_control(speed, dt)
        steer = self.pure_pursuit.get_control(waypoints, speed)
        return a, steer
