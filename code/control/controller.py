class Controller:
    def calculate():
        return

    def get_control(self, **kwargs):
        result = self.calculate(**kwargs)
        acc = result.get('acc', 0)
        steer = result.get('steer', 0)
        return acc, steer
