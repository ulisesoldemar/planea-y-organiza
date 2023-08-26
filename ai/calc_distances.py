import cv2
import numpy as np

from find_coords import find_coords

def calc_distance(balls: np.ndarray, target: np.ndarray, method='euclidean') -> float:
    match method:
        case 'euclidean':
            return np.sum(np.sqrt(np.sum((balls - target) ** 2, axis=1)))
        case 'cityblock':
            return np.sum(np.sum(np.abs(balls - target), axis=1))


# distances = {'euclidean': [], 'cityblock': []}
# for i in range(5):
#     I = cv2.imread(f'img/Seccion{i+1}.png')
#     balls, target = find_coords(I)
#     distances['euclidean'].append(total_distance(balls, target[0], 'euclidean'))
#     distances['cityblock'].append(total_distance(balls, target[0], 'cityblock'))
# print(distances)

# min_distance = np.min(distances['euclidean'])
# max_distance = np.max(distances['euclidean'])
# diff_distance = max_distance - min_distance

# print(min_distance)
# print(max_distance)
# print(diff_distance)
# print(diff_distance / 4)

# for distance in distances['euclidean']:
#     print(distance, distance+(diff_distance/8))