class DoNothing:
    def get_control():
        return 0

class Controller:
    def __init__(self):
        self.handle = DoNothing
        self.pedal = DoNothing

    def set_handle_controller(self, handle):
        self.handle = handle

    def set_pedal_controller(self, pedal):
        self.pedal = pedal

    def get_control(self):
        steer = self.handle.get_control
        acc = self.accel.get_control
        return acc, steer