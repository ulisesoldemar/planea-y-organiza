import json
import numpy as np

def convert(o):
    if isinstance(o, np.int64):
        return int(o)
    raise TypeError

def save_JSON(ball_coords, target_coords, filename: str):
    data = []
    data_dict = {
        'target': {
            'x': target_coords[0],
            'y': target_coords[1]
        },
        'balls': [
            {'x': x, 'y': y} for x, y, in ball_coords
        ]
    }
    with open(filename, 'w') as file:
        json.dump(data_dict, file, default=convert)
