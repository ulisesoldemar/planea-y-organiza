import cv2
import json
import numpy as np
import os

from find_coords import find_coords, show_solution
from calc_distances import calc_distance


def convert(o):
    if isinstance(o, np.int64):
        return int(o)
    raise TypeError


def dump_coords_from_img(img_dir: str, output_filename: str):
    directory = os.fsencode(img_dir)
    sections = []
    total_distance = 0.0
    avg_distance = 0.0
    for file in sorted(os.listdir(directory)):
        filename = os.fsdecode(file)
        I = cv2.imread(f'{img_dir}/{filename}')
        balls, target = find_coords(I)
        section_distance = calc_distance(balls, target[0])
        avg_section = section_distance / len(balls)
        data_dict = {
            'target': {
                'x': target[0][0],
                'y': target[0][1]
            },
            'balls': [
                {'x': x, 'y': y} for x, y, in balls
            ],
            'sectionDistance': section_distance,
            'avgSectionDistance': avg_section
        }
        total_distance += section_distance
        avg_distance += avg_section
        sections.append(data_dict)

    with open(output_filename, 'w') as file:
        json.dump({
            'sections': sections,
            'totalDistance': total_distance,
            'avgDistance': avg_distance,
            },
            file, default=convert)

# def dump_coords_from_img(img_path: str, output_filename: str, show=False):
#     I = cv2.imread(img_path)
#     balls, target = find_coords(I)
#     data_dict = {
#         'target': {
#             'x': target[0][0],
#             'y': target[0][1]
#         },
#         'balls': [
#             {'x': x, 'y': y} for x, y, in balls
#         ]
#     }
#     return data_dict
