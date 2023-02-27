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

    def get_control(self, **kwargs):
        steer = self.handle.get_control(**kwargs)
        acc = self.accel.get_control(**kwargs)
        return acc, steer


class HandleControl:
    def __init__(self, handle=DoNothing):
        self.handle = handle

    def set_handle(self, handle):
        self.handle = handle

    def get_control(self, **kwargs):
        return self.handle.get_control(**kwargs)
